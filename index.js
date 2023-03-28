// 백엔드 시작점

// express 가져오기
const express = require("express");

// 새로운 express앱 만들기
const app = express();

// 포트생성
const port = 5000;

const config = require("./config/key");

const { User } = require("./models/User");

// application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// application/json
app.use(express.json());

// mongoose 가져오기
const mongoose = require("mongoose");
mongoose
  .connect(config.mongoURI)
  // 잘 작동하는 지 확인, 작동하지않으면 에러메세지 날리기
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

// 루트 디렉토리에오면 Hello World 출력
app.get("/", (req, res) => {
  res.send("Hello World! 기모찌");
});

// 회원가입을 위한 라우트 만들기
app.post("/register", async (req, res) => {
  // 회원가입할 때 필요한 정보들을 client에서 가져오면
  // 그것들을 데이터베이스에 넣어준다

  // express를 통해 body에 담긴 정보를 가져온다
  const user = new User(req.body);

  //
  const result = await user
    .save()
    .then(() => {
      res.status(200).json({
        success: true,
      });
    })
    .catch((err) => {
      res.json({ success: false, err });
    });
});

// 포트번호 5000번에 실행
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
