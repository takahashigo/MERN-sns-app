import { Analytics, Face, Gif, Image } from '@mui/icons-material';
import axios from 'axios';
import React, { useContext, useRef, useState } from 'react';
import { AuthContext } from '../../state/AuthContext';
import "./Share.css";

export default function Share() {
  const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;
// 投稿のアイコンがノーバターの画像になっている。（これをuserの固有のものに切り替える修正あり）（このシェアのページにユーザー情報を組み込み、パイプ演算子で分岐する処理）return内の４行目のimgタグのsrc属性内のこと

  const {user} = useContext(AuthContext);
  const desc = useRef();
  const [file,setFile] = useState(null);
  // console.log(file);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPost = {
      userId: user._id,
      desc: desc.current.value,
    };

    if (file){
      const data = new FormData();
      const fileName = Date.now() + file.name;
      data.append("name", fileName);
      data.append("file",file);
      newPost.img = fileName;
      try {
        // 画像のAPIを叩く
        await axios.post("/upload",data);

      } catch (error) {
        console.log(error);
      }
    }


    try {
      await axios.post("/posts",newPost);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };



  return (
    <div className='share'>
      <div className="shareWrapper">
        <div className="shareTop">
          <img src={user.profilePicture ? PUBLIC_FOLDER+user.profilePicture : PUBLIC_FOLDER+"/person/noAvatar.png"} alt="" className="shareProfileImg" />
          <input type="text" className="shareInput" placeholder='今何してるの？' ref={desc}/>
        </div>
        <hr className='shareHr' />

        <form className="shareButtons" onSubmit={(e) => handleSubmit(e)}>
          <div className="shareOptions">
            <label className="shareOption" htmlFor='file' >
              <Image className='shareIcon' htmlColor='blue'/>
              <span className="shareOptionText">写真</span>
              <input type="file" id="file" accept='.png, .jpeg, .jpg' style={{display: "none"}} onChange={(e) => setFile(e.target.files[0])} />
            </label>
            <div className="shareOption">
              <Gif className='shareIcon' htmlColor='hotpink'/>
              <span className="shareOptionText">GIF</span>
            </div>
            <div className="shareOption">
              <Face className='shareIcon' htmlColor='green'/>
              <span className="shareOptionText">気持ち</span>
            </div>
            <div className="shareOption">
              <Analytics className='shareIcon' htmlColor='red'/>
              <span className="shareOptionText">投票</span>
            </div>
          </div>
          <button className="shareButton" type='submit'>投稿</button>
        </form>
      </div>
    </div>
  )
}
