
## WIL
TCP 수준의 소켓 프로그래밍과 HTTP의 메시지 전송 패턴을 파악하여
HTTP(TCP) 요청에 대한 헤더 및 부가 값들을 적절하게 파싱하여
서버 애플리케이션에서 추상화된 형태로 활용할 수 있게하여 간단한
HTTP 서버를 작성하였습니다.


## Goals
- [x] tcp 소켓 수준에서 http 요청 처리
- [x] HTTP 헤더 파서 작성 및 적용
- [x] 로깅 적용
- [ ] 데코레이터 기반 프록시 유틸 기능
- [x] HTTP Body 파서 작성 및 적용

## 정리 노트
**[Node.js 로 바닥부터 웹서버 만들기 (feat. Stream) - galaxy4276](https://www.notion.so/Node-js-feat-Stream-cb5bef748a3d489cac80b5aa11c5ba0e?pvs=4)**

## References
**[knowledgehut Node.Js - Net Module](https://www.knowledgehut.com/blog/web-development/nodejs-net-module)**

**[Victor Jonah - Creating Duplex streams in Node.js](https://blog.logrocket.com/creating-duplex-streams-nodejs/)**

****[What is Stream Module unshift() in Node.js?](https://www.educative.io/answers/what-is-stream-module-unshift-in-nodejs)****

****[How to check if a file exists in Node.js](https://flaviocopes.com/how-to-check-if-file-exists-node/)****
