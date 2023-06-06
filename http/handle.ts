import net from 'node:net';
import { Request, Response } from '../type';
import { createHeaderLineBreak, initBuffer } from './util';
import createRequest from './request';
import createResponse from './response';

export const createWebServer = (requestHandler: (req: Request, res: Response) => void) => {
  const server = net.createServer();

  const handleConnection = (socket: net.Socket) => {
    socket.once('readable', () => {
      let reqBuffer: Buffer = initBuffer();
      let buf: Buffer;
      let reqHeader: string;

      while (true) {
        buf = socket.read() as Buffer;
        if (buf == null) break;
        reqBuffer = Buffer.concat([reqBuffer, buf]);
        let marker = reqBuffer.indexOf(createHeaderLineBreak());
        if (marker !== -1) {
          const remaining: Buffer = reqBuffer.subarray(marker, 4);
          reqHeader = reqBuffer.subarray(0, marker).toString();
          socket.unshift(remaining);
          break;
        }
      }

      const reqHeaders: string[] = reqBuffer.toString().split(createHeaderLineBreak());
      const request: Request = createRequest(reqHeaders, socket);
      const response: Response = createResponse(socket);

      requestHandler(request, response);
    });
  };

  server.on('connection', handleConnection);

  return {
    listen: (port: number, listenCb?: () => void) => server.listen(port, listenCb),
    close: server.close,
  };
};
