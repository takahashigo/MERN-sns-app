import {createContext, useEffect, useReducer} from "react";
import AuthReducer from "./AuthReducer";


// Reduxはグローバルな状態管理、これを行うことによって、プロップスの受け渡しのように特定のコンポーネントしか管理できなかったのをグローバル（様々なコンポーネント）で管理できるようにした、ログインの情報などの重要な情報は全てのコンポーネントで扱いたい情報だからこのような考えがある


// 最初のユーザー状態を定義
const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  // user: {
  // _id: "62983dd6f69b17c497f53ed2",
  // username: "takahashigou",
  // email : "go20001104@gmail.com",
  // password : "abcdefg",
  // profilePicture : "/person/1.jpeg",
  // coverPicture : "",
  // followers : [],
  // followings : [],
  // isAdmin : false
  // },
  isFetching: false,
  error: false
};

// 状態をグローバルに管理する（グローバルコンテキストの作成）
export const AuthContext = createContext(initialState);

// 認証状態を提供するもの（プロバイダー）Appコンポーネントを囲んであげてコンポーネント全体でvalueの値を使えるようにしたい
export const AuthContextProvider = ({children}) => {
  const [state,dispatch] = useReducer(AuthReducer,initialState);

  useEffect(() => {
    localStorage.setItem("user",JSON.stringify(state.user));
  },[state.user]);

  return (
    <AuthContext.Provider value={{user: state.user, isFetching: state.isFetching, error: state.error, dispatch}}>
      {children}
    </AuthContext.Provider>
  );
};




