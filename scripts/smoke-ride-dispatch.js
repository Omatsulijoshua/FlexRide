const { spawn } = require('child_process');
const path = require('path');
require('fs').appendFileSync(path.resolve(__dirname, '..', 'reports', 'smoke-debug.log'), 'script entered\n');
console.log('[smoke] loading socket.io client');
const { io } = require('../backend/dispatch-service/node_modules/socket.io-client');
require('fs').appendFileSync(path.resolve(__dirname, '..', 'reports', 'smoke-debug.log'), 'socket loaded\n');
console.log('[smoke] socket.io client loaded');

const root = path.resolve(__dirname, '..');
const dispatchDir = path.join(root, 'backend', 'dispatch-service');
const rideDir = path.join(root, 'backend', 'ride-service');

const children = [];

function startService(name, cwd, env) {
  const child = spawn(process.execPath, ['dist/main.js'], {
    cwd,
    env: { ...process.env, ...env },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  children.push(child);
  console.log(`[${name}] starting pid=${child.pid}`);

  child.stdout.on('data', data => {
    process.stdout.write(`[${name}] ${data}`);
  });
  child.stderr.on('data', data => {
    process.stderr.write(`[${name}] ${data}`);
  });
  child.on('exit', code => {
    if (!shuttingDown && code !== 0) {
      console.error(`[${name}] exited with code ${code}`);
    }
  });

  return child;
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForHttp(url, child, timeoutMs = 30000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    if (child?.exitCode !== null) {
      throw new Error(`${url} service exited with code ${child.exitCode}`);
    }
    try {
      await fetch(url);
      return;
    } catch {
      await wait(500);
    }
  }
  throw new Error(`Timed out waiting for ${url}`);
}

async function postJson(url, body) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await response.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = text;
  }

  if (!response.ok) {
    throw new Error(`${url} failed with ${response.status}: ${text}`);
  }

  return json;
}

let shuttingDown = false;
async function shutdown() {
  shuttingDown = true;
  for (const child of children.reverse()) {
    if (!child.killed) {
      child.kill();
    }
  }
}

process.on('SIGINT', async () => {
  await shutdown();
  process.exit(130);
});

(async () => {
  require('fs').appendFileSync(path.resolve(__dirname, '..', 'reports', 'smoke-debug.log'), 'main entered\n');
  const dispatch = startService('dispatch', dispatchDir, {});
  require('fs').appendFileSync(path.resolve(__dirname, '..', 'reports', 'smoke-debug.log'), 'dispatch spawned\n');
  await waitForHttp('http://127.0.0.1:3007/dispatch/health', dispatch);
  require('fs').appendFileSync(path.resolve(__dirname, '..', 'reports', 'smoke-debug.log'), 'dispatch ready\n');

  const receivedRide = new Promise((resolve, reject) => {
    const socket = io('http://127.0.0.1:3007', {
      transports: ['websocket'],
      timeout: 10000,
      forceNew: true,
    });

    const timeout = setTimeout(() => {
      socket.close();
      reject(new Error('Driver did not receive new_ride_request within 15 seconds'));
    }, 15000);

    socket.on('connect', () => {
      console.log(`[driver] connected as ${socket.id}`);
    });

    socket.on('connect_error', error => {
      clearTimeout(timeout);
      socket.close();
      reject(error);
    });

    socket.on('new_ride_request', payload => {
      clearTimeout(timeout);
      socket.close();
      resolve(payload);
    });
  });

  receivedRide.catch(() => {});

  const ride = startService('ride', rideDir, {
    RIDE_REPOSITORY_MODE: 'memory',
    DISPATCH_SERVICE_URL: 'http://127.0.0.1:3007',
    POSTGRES_HOST: '127.0.0.1',
  });
  await waitForHttp('http://127.0.0.1:3004/rides/not-a-real-ride', ride);

  const rideRequest = {
    customerId: '11111111-1111-4111-8111-111111111111',
    pickupLat: 6.5244,
    pickupLng: 3.3792,
    pickupAddress: 'Ikeja City Mall, Lagos',
    dropoffLat: 6.4281,
    dropoffLng: 3.4219,
    dropoffAddress: 'Lekki Phase 1, Lagos',
    category: 'ECONOMY',
    bookingMode: 'ONE_WAY',
  };

  const rideResponse = await postJson('http://127.0.0.1:3004/rides', rideRequest);
  const driverPayload = await receivedRide;

  if (!rideResponse.success || !rideResponse.rideId) {
    throw new Error(`Ride response did not contain a successful ride id: ${JSON.stringify(rideResponse)}`);
  }

  if (driverPayload.rideId !== rideResponse.rideId) {
    throw new Error(`Driver received ride ${driverPayload.rideId}, expected ${rideResponse.rideId}`);
  }

  console.log('SMOKE_PASS user placed a ride and a connected driver received new_ride_request');
  console.log(JSON.stringify({ rideResponse, driverPayload }, null, 2));
})()
  .catch(error => {
    console.error('SMOKE_FAIL', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await shutdown();
  });
