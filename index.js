// 백엔드 시작점

// express 가져오기
const express = require("express");

// 새로운 express앱 만들기
const app = express();

// 포트생성
const port = 3000;

// mongoose 가져오기
const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://oper:fjrzlrkdl123@cluster0.ml6n6g0.mongodb.net/?retryWrites=true&w=majority"
  )
  // 잘 작동하는 지 확인, 작동하지않으면 에러메세지 날리기
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

// 루트 디렉토리에오면 Hello World 출력
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// 포트번호 3000번에 실행
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
