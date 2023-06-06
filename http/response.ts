import type { Socket } from 'node:net';
import { Response } from '../type';
import { createHeaderLineBreak } from './util';

export default function createResponse(socket: Socket): Response {
  let status = 200, statusText = 'OK', headersSent = false, isChunked = false;
  const responseHeaders = { server: 'galaxy4276-webserver' };
  const setHeader = (key: string, value: string) => responseHeaders[key.toLowerCase()] = value;
  const sendHeaders = () => {
    if (!headersSent) {
      headersSent = true;
      setHeader('date', new Date().toISOString());
      socket.write(`HTTP/1.1 ${status} ${statusText} ${createHeaderLineBreak()}`);
      Object.keys(responseHeaders).forEach(headerKey => {
        socket.write(`${headerKey}: ${responseHeaders[headerKey]} ${createHeaderLineBreak()}`);
      });
      socket.write(createHeaderLineBreak());
    }
  };

  return {
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
        socket.write(`${size} ${createHeaderLineBreak()}`);
        socket.write(chunk);
        socket.write(createHeaderLineBreak());
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
          socket.write(`${size} ${createHeaderLineBreak()}`);
          socket.write(chunk);
          socket.write(createHeaderLineBreak());
        }
        socket.end(`0 ${createHeaderLineBreak(2)}`);
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
};
