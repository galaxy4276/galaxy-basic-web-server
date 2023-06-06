it('Buffer subarray 간단 테스트', () => {
  const requestHeader =
      "POST /api/post HTTP/1.1\r\n" +
      "Host: localhost:3000\r\n" +
      "User-Agent: insomnia/2023.1.0\r\n" +
      "Content-Type: application/json\r\n" +
      "Sender: galaxyhi4276@gmail.com\r\n" +
      "S: S\r\n" +
      "A: A\r\n" +
      "D: F\r\n" +
      "G: H\r\n" +
      "H: B\r\n" +
      "Accept: */*\r\n" +
      "Content-Length: 152\r\n"
  const buf = Buffer.from(requestHeader);
  console.log(buf.toString());
  const marker = buf.indexOf('\r\n');
  const subBuf = buf.subarray(marker, 4);
  console.log({
    buf: subBuf,
    string: subBuf.toString()
  });
});
