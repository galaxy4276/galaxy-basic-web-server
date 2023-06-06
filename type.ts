import type { Socket } from 'node:net';

export interface Request {
  method: string;
  url: string;
  httpVersion: string;
  headers: Record<string, string>;
  socket: Socket;
  body: Record<string, unknown>;
}

type Chunk = any;
export interface Response {
  write: (chunk: Chunk) => void;
  end: (chunk: Chunk) => void;
  setHeader: (key: string, value: string) => string;
  setStatus: (newStatus: number, newStatusText: string) => void;
  json: (data: Record<string, any>) => void;

}