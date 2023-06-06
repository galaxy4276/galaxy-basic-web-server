import { createWebServer } from './http/handle';
import { createLogFileIfNotExists } from './log';

createLogFileIfNotExists();
const server = createWebServer((req, res) => {
  console.debug('요청 콜백이 수행 됨');
  res.setHeader('Content-Type', 'text/plain');
  console.debug('body 출력');
  console.debug(req.body);
  res.end('Hello World');
});

server.listen(3000, () => {
  console.debug('서버가 실행되었습니다.');
});
