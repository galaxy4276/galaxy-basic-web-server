import type { Socket } from 'node:net';
import { Request } from '../type';

export default function createRequest(reqHeaders: string[], socket: Socket, body: Record<string, any>): Request {
  const reqLines: string[] = reqHeaders.shift().split(' ');
  let bodyFlag = false;
  const headers: Record<string, string> = reqHeaders.reduce((acc, currentHeader) => {
    if (bodyFlag) {
      if (currentHeader === '{' || currentHeader === '}') {
        return { ...acc };
      }
      const object = JSON.parse(currentHeader) as Record<string, any>;
      for (const key in object) {
        body[key]  = object[key];
      }
      return { ...acc };
    }

    const [key, value] = currentHeader.split(':');
    if (key.trim() === '' || !value) {
      if (key.trim() === '') bodyFlag = true;
      return { ...acc };
    }
    return {
      ...acc,
      [key.trim().toLowerCase()]: value.trim(),
    };
  }, {});

  return {
    method: reqLines[0],
    url: reqLines[1],
    httpVersion: reqLines[2].split('/')[1],
    headers,
    socket,
    body,
  };
}
