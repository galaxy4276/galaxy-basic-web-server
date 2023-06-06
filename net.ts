import { createWebServer } from './handle';

const server = createWebServer((req, res) => {
  console.debug('요청 콜백이 수행 됨');
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log(req.headers);
  res.setHeader('Content-Type', 'text/plain');
  res.json({ a: 'b' });
});

server.listen(3000, () => {
  console.debug('서버가 실행되었습니다.');
});
