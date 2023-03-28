// 백엔드 시작점

// express 가져오기
const express = require("express");

// 새로운 express앱 만들기
const app = express();

// 포트생성
const port = 5000;

const config = require("./config/key");
const cookieParser = require("cookie-parser");
const { auth } = require("./middleware/auth");
const { User } = require("./models/User");

// application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// application/json
app.use(express.json());
app.use(cookieParser());

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
app.post("/api/users/register", async (req, res) => {
  // 회원가입할 때 필요한 정보들을 client에서 가져오면
  // 그것들을 데이터베이스에 넣어준다

  // express를 통해 body에 담긴 정보를 가져온다
  const user = new User(req.body);

  // mongoDB 메서드, user모델에 저장
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

app.post("/api/users/login", (req, res) => {
  // 요청된 이메일을 데이터베이스 찾기
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.json({
          loginSuccess: false,
          messsage: "제공된 이메일에 해당하는 유저가 없습니다.",
        });
      }
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (!isMatch)
          return res.json({
            loginSuccess: false,
            messsage: "비밀번호가 틀렸습니다.",
          });
        // Password가 일치하다면 토큰 생성
        user.generateToken((err, user) => {
          if (err) return res.status(400).send(err);
          // 토큰을 저장
          res
            .cookie("x_auth", user.token)
            .status(200)
            .json({ loginSuccess: true, userId: user._id });
        });
      });
    })
    .catch((err) => {
      return res.status(400).send(err);
    });
});

// role 0 => 일반유저 role 0이 아니면 관리자
app.get("/api/users/auth", auth, (req, res) => {
  // 여기까지 미들웨어를 통과해 왔다는 애기는 Authentication이 true라는 말.
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

app.get("/api/users/logout", auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" })
    .then(function () {
      return res.status(200).send({
        success: true,
      });
    })
    .catch(function (err) {
      return res.json({ success: false, err });
    });
});

// 포트번호 5000번에 실행
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
