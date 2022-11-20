const express = require("express");
const app = express();
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const uploadRoute = require("./routes/upload");
const path = require("path");
const PORT = 4000;
const mongoose = require("mongoose");
require("dotenv").config();



// データベースとの接続
mongoose.connect(process.env.MONGOURL)
.then(()=>{
  console.log("DBと接続中・・・");
})
.catch((err)=>{
  console.log(err);
});



// ミドルウェアの設定（エンドポイント（最初のエンドポイント）プラスエンドポイント）個々に分けていく

app.use("/images", express.static(path.join(__dirname,"public/images")));// /imagesにリクエストが来たら、public/imagesのディレクトリー内を見てねと宣言

app.use(express.json());//JSON形式でデータのやり取りを行うことを宣言
app.use("/api/users",userRoute);
app.use("/api/auth",authRoute);
app.use("/api/posts",postRoute);
app.use("/api/upload",uploadRoute);

app.get("/",(req,res)=>{
  res.sendFile(__dirname + '/public/index.html');
})


app.listen(PORT,()=>{
  console.log("サーバーが起動しました");
})
