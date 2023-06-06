import net from 'node:net';
import { Request, Response } from './type';

const initBuffer = () => Buffer.from('');
const NEWLINE = '\r\n';

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
        let marker = reqBuffer.indexOf('\r\n');
        if (marker !== -1) {
          const remaining: Buffer = reqBuffer.subarray(marker, 4);
          reqHeader = reqBuffer.subarray(0, marker).toString();
          socket.unshift(remaining);
          break;
        }
      }

      const reqHeaders: string[] = reqBuffer.toString().split('\r\n');
      const reqLine: string[] = reqHeaders.shift().split(' ');
      const headers: Record<string, string> = reqHeaders.reduce((acc, currentHeader) => {
        const [key, value] = currentHeader.split(':');
        if (key.trim() === '' || !value) return { ...acc };
        return {
          ...acc,
          [key.trim().toLowerCase()]: value.trim(),
        };
      }, {});

      const request: Request = {
        method: reqLine[0],
        url: reqLine[1],
        httpVersion: reqLine[2].split('/')[1],
        headers,
        socket,
      };

      let status = 200, statusText = 'OK', headersSent = false, isChunked = false;
      const responseHeaders = { server: 'galaxy4276-webserver' };
      const setHeader = (key: string, value: string) => responseHeaders[key.toLowerCase()] = value;
      const sendHeaders = () => {
        if (!headersSent) {
          headersSent = true;
          setHeader('date', new Date().toISOString());
          socket.write(`HTTP/1.1 ${status} ${statusText}${NEWLINE}`);
          Object.keys(responseHeaders).forEach(headerKey => {
            socket.write(`${headerKey}: ${responseHeaders[headerKey]}${NEWLINE}`);
          });
          socket.write(NEWLINE);
        }
      };

      const response: Response = {
        write(chunk) {
          if (!headersSent) {
            if (!responseHeaders['content-length']) {
              isChunked = true;
              setHeader('transfer-encoding', 'chunked');
            }
            sendHeaders();
          }

          if (isChunked) {
            const size = chunk.length.toString();
            socket.write(`${size}\r\n`);
            socket.write(chunk);
            socket.write('\r\n');
          } else {
            socket.write(chunk);
          }
        },

        end(chunk) {
          if (!headersSent) {
            if (!responseHeaders['content-length']) {
              setHeader('content-length', chunk ? chunk.length : 0);
            }
            sendHeaders();
          }
          if (isChunked) {
            if (chunk) {
              const size = (chunk.length).toString(16);
              socket.write(`${size}\r\n`);
              socket.write(chunk);
              socket.write('\r\n');
            }
            socket.end('0\r\n\r\n');
          } else {
            socket.end(chunk);
          }
        },
        setHeader,
        setStatus(newStatus: number, newStatusText: string) {
          status = newStatus;
          statusText = newStatusText;
        },
        json(data) {
          if (headersSent) {
            throw new Error('Headers Sent, cannot proceed to send JSON');
          }
          const json = Buffer.from(JSON.stringify(data));
          setHeader('content-type', 'application/json; charset=utf8');
          setHeader('content-length', json.length.toString());
          sendHeaders();
          socket.end(json);
        }
      };

      requestHandler(request, response);
    });
  };

  server.on('connection', handleConnection);

  return {
    listen: (port: number, listenCb?: () => void) => server.listen(port, listenCb),
  };
};
