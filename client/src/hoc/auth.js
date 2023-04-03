import React, { useEffect } from "react";
// import Axios from "axios";
import { useDispatch } from "react-redux";
import { auth } from "../_actions/user_action";
import { useNavigate } from "react-router-dom";

const Auth = (SpecificComponent, option, adminRoute = null) => {
  function AuthenticationCheck(props) {
    // null     => 아무나 출입이 가능한 페이지
    // true     => 로그인 한 유저만 출입이 가능한 페이지
    // false    => 로그인 한 유저는 출입 불가능한 페이지

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
      dispatch(auth()).then((response) => {
        console.log(response);

        // 로그인 하지 않은 상태
        if (!response.payload.isAuth) {
          console.log("로그인 하지 않은 상태");
          console.log(option);
          if (option) {
            console.log("123123123123");
            navigate("/login");
          }
        } else {
          // 로그인 한 상태
          console.log("로그인 한 상태");
          if (adminRoute && !response.payload.isAdmin) {
            console.log(adminRoute);
            console.log(response.payload.isAdmin);
            navigate("/");
          } else {
            console.log(adminRoute);
            console.log(response.payload.isAdmin);
            console.log(option);
            if (option === false) {
              navigate("/");
            }
          }
        }
      });
    }, []);

    return <SpecificComponent />;
  }

  return <AuthenticationCheck />;
};
export default Auth;
