import type { Socket } from 'node:net';
import { Request } from '../type';

export default function createRequest(reqHeaders: string[], socket: Socket): Request {
  const reqLines: string[] = reqHeaders.shift().split(' ');
  const headers: Record<string, string> = reqHeaders.reduce((acc, currentHeader) => {
    const [key, value] = currentHeader.split(':');
    if (key.trim() === '' || !value) return { ...acc };
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
  };
}
