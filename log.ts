import fs from 'node:fs';
import path from 'node:path';
import { Request } from './type';

const filepath = path.join(__dirname, 'logs.txt');

export const createLogFileIfNotExists = () => {
  fs.access(filepath, err => {
    if (err) {
      fs.writeFile(filepath, '', (err) => {
        if (err) {
          console.warn('로그 파일 생성 중 에러가 발생하였습니다.');
          console.log(err);
          return;
        }
        console.debug('로그 파일이 생성되었습니다.');
      });
    }
  });
};

export const addLog = async (req: Request) => {
  const date = new Date().toISOString();
  const shortMessage = `[${date}] 로그 파일을 갱신하였습니다. - [${req.method}] - ${req.url}`;
  const context = `
${shortMessage}
헤더 정보:
      ${JSON.stringify(req.headers, null, 4)}
  `;
  fs.appendFile(filepath, context, err => {
    if (err) {
      console.warn('로그 파일 갱신 중 에러가 발생하였습니다.');
      console.log(err);
      return;
    }
    console.debug(shortMessage);
  });
};
