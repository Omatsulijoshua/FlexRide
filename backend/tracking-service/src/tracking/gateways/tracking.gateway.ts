import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RedisGeoService } from '../services/redis-geo.service';
import { LocationUpdateDto } from '../dto/location-update.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class TrackingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly redisGeoService: RedisGeoService) {}

  handleConnection(client: Socket) {
    // In production, we authenticate the token passed in client.handshake.auth
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    // If it's a driver, we'd normally mark them as offline in Redis here
  }

  // Passenger joins a room for a specific ride to listen to the driver's movements
  @SubscribeMessage('join_ride')
  handleJoinRide(
    @ConnectedSocket() client: Socket,
    @MessageBody('rideId') rideId: string,
  ) {
    client.join(`ride_${rideId}`);
    return { event: 'joined', room: `ride_${rideId}` };
  }

  // Driver emits this event every 3-5 seconds
  @SubscribeMessage('driver_location_update')
  handleLocationUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: LocationUpdateDto,
  ) {
    // 1. Update Redis so the driver shows up in "Nearby Drivers" searches
    this.redisGeoService.updateDriverLocation(payload.driverId, payload.lat, payload.lng);

    // 2. If the driver is currently on a ride, broadcast the coords to the passenger
    if (payload.rideId) {
      this.server.to(`ride_${payload.rideId}`).emit('live_tracking', {
        driverId: payload.driverId,
        lat: payload.lat,
        lng: payload.lng,
        heading: payload.heading, // e.g. 90 degrees (East) to rotate the car icon
        timestamp: Date.now(),
      });
    }

    return { status: 'received' };
  }

  // Passenger emits this to see all nearby available cars on their map
  @SubscribeMessage('get_nearby_drivers')
  handleGetNearbyDrivers(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { lat: number; lng: number; radiusKm: number },
  ) {
    const nearby = this.redisGeoService.getNearbyDrivers(payload.lat, payload.lng, payload.radiusKm);
    return { event: 'nearby_drivers_result', data: nearby };
  }
}
