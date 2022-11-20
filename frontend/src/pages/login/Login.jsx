import React, { useContext, useRef } from 'react';
import { loginCall } from '../../ActionCalls';
import { AuthContext } from '../../state/AuthContext';
import "./Login.css";

export default function Login() {
  const email = useRef();
  const password = useRef();
  const {user, isFetching, error, dispatch} = useContext(AuthContext);


  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(email.current.value);
    // console.log(password.current.value);
    loginCall({
      email: email.current.value,
      password: password.current.value
    },dispatch);
  };

  console.log(user);

  return (
    <div className='login'>
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className='loginLogo'>REAL DORMITORY LIFE</h3>
          <span className="loginDesc">君は知らない、本当の姿。</span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={(e)=>handleSubmit(e)}>
            <p className="loginMsg">ログインはこちらから</p>
            <input type="email" className="loginInput" placeholder='Eメール' required ref={email} />
            <input type="password" className="loginInput" placeholder='パスワード' required minLength="6" ref={password}/>
            <button className="loginButton">ログイン</button>
            <span className="loginForgot">パスワードを忘れた方へ</span>
            <button className="loginRegisterButton">アカウント作成</button>
          </form>
        </div>
      </div>
    </div>
  );
}

