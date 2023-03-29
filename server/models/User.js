// 몽구스 가져오기
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

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
    maxlength: 50,
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

userSchema.pre("save", function (next) {
  var user = this;

  if (user.isModified("password")) {
    // 비밀번호를 암호화 시킨다.
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        // hash된 비밀번호로 바꿔줌
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  // plainPassword 123467 암호화된 비밀번호
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.methods.generateToken = function (cb) {
  var user = this;
  // jsonwebtoken을 이용해서 token을 생성하기
  var token = jwt.sign(user._id.toHexString(), "secretToken");
  user.token = token;
  user
    .save()
    .then(function (user) {
      cb(null, user);
    })
    .catch(function (err) {
      return cb(err);
    });
};

userSchema.statics.findByToken = function (token, cb) {
  var user = this;

  // 토큰을 decode한다.
  jwt.verify(token, "secretToken", function (err, decoded) {
    // 유저 아이디를 이용해 유저를 찾은다음
    // 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인
    user
      .findOne({ _id: decoded, token: token })
      .then(function (user) {
        cb(null, user);
      })
      .catch(function (err) {
        return cb(err);
      });
  });
};

const User = mongoose.model("User", userSchema);

// 다른곳에 파일쓸 때
module.exports = { User };
