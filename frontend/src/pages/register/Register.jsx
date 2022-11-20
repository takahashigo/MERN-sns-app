import axios from 'axios';
import React, { useRef } from 'react';
import "./Register.css";
import {useNavigate} from "react-router-dom";

export default function Register() {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const passwordComfirmation = useRef();
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();

    // パスワードと確認用パスワードが一致しているかどうか判定
    if (password.current.value !== passwordComfirmation.current.value){
      passwordComfirmation.current.setCustomValidity("パスワードが一致していません");
    } else {
      try {
        const user = {
          username: username.current.value,
          email: email.current.value,
          password: password.current.value
        };
        // registerAPIを叩く
        await axios.post("/auth/register",user);
        navigate("/login");
      } catch (error) {
        console.log(error);
      }
    }

  };

  return (
    <div className='login'>
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className='loginLogo'>REAL DORMITORY LIFE</h3>
          <span className="loginDesc">君は知らない、本当の姿。</span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={(e)=>handleSubmit(e)}>
            <p className="loginMsg">新規登録はこちらから</p>
            <input type="text" className="loginInput" placeholder='ユーザー名' required  ref={username}/>
            <input type="email" className="loginInput" placeholder='Eメール' required ref={email}/>
            <input type="password" className="loginInput" placeholder='パスワード' required minLength="6" ref={password}/>
            <input type="password" className="loginInput" placeholder='確認用パスワード' required minLength="6" ref={passwordComfirmation}/>
            <button className="loginButton" type='submit'>サインアップ</button>
            <button className="loginRegisterButton">ログイン</button>
          </form>
        </div>
      </div>
    </div>
  )
}
