import { createHeaderLineBreak } from '../http/util';

describe('유틸 함수 테스트', () => {

  it('createHeaderLineBreak 함수가 정상적으로 값을 반환한다.', () => {
    expect(createHeaderLineBreak()).toBe('\r\n');
  });

  it('createHeaderLineBreak 에 인수 2를 전달하면 \r\n 이 2번 출력된다.', () => {
    const result = createHeaderLineBreak(2);
    console.log({ result });
    expect(result).toBe('\r\n\r\n');
  });

});
