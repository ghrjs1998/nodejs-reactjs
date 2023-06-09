const { User } = require("../models/User");

let auth = (req, res, next) => {
  // 인증처리를 하는곳

  // client 쿠키에서 토큰 가져오기
  let token = req.cookies.x_auth;
  // 토큰을 복호화 한 후, 유저를 찾는다.
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user) return res.json({ isAuth: false, err: true });

    req.token = token;
    req.user = user;
    next();
  });
  // 유저가 있으면 인증 Okay

  // 유저가 없으면 인증 No
};

module.exports = { auth };
