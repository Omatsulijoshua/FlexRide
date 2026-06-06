import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class DispatchGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Driver connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Driver disconnected: ${client.id}`);
  }

  broadcastNewRide(rideDetails: any) {
    console.log('Broadcasting new ride request to drivers...');
    this.server.emit('new_ride_request', rideDetails);
  }
}
