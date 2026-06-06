import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('join_chat')
  handleJoinChat(
    @ConnectedSocket() client: Socket,
    @MessageBody('rideId') rideId: string,
  ) {
    client.join(`chat_${rideId}`);
    console.log(`Client joined chat room: chat_${rideId}`);
    return { status: 'joined' };
  }

  @SubscribeMessage('send_message')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { rideId: string; senderId: string; text: string },
  ) {
    const message = {
      ...payload,
      timestamp: new Date().toISOString(),
    };
    
    // Broadcast message to everyone in the chat room (driver + passenger)
    this.server.to(`chat_${payload.rideId}`).emit('new_message', message);
    
    // Normally we would also save this message to a MongoDB collection for history
    return { status: 'sent' };
  }
}
