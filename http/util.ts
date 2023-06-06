export enum LINEBREAK {
  HEADER = '\r\n',
}

/**
 * @description 버퍼 초기화를 수행합니다.
 */
export const initBuffer = () => Buffer.from('');

export const createHeaderLineBreak = (count: number = 1) => {
  let lineBreak: string = LINEBREAK.HEADER;
  if (count === 1) return lineBreak;
  for (let i = 1; i < count; i++) {
    lineBreak += LINEBREAK.HEADER;
  }
  return lineBreak;
}
