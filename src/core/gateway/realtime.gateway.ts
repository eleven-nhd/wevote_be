import {
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class RealtimeGateway {
  @WebSocketServer()
  server: Server;

  emitTableUpdate(data: any) {
    this.server.emit('table:update', data);
  }
}