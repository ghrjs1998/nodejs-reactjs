// 몽구스 가져오기
const mongoose = require("mongoose");

// 몽구스를 이용해 스키마 생성
const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    // 공백을 없애주는 역할
    trim: true,
    unique: 1,
  },
  password: {
    // password type이 string인 이유 => 비밀번호를 넣었을때 암호화해서 들어가는데 그때 숫자가아닌 다른 것들도 들어가기떄문
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlnegth: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  // 토큰 유효기간
  tokenExp: {
    type: Number,
  },
});

const User = mongoose.model("User", userSchema);

// 다른곳에 파일쓸 때
module.exports = { User };
