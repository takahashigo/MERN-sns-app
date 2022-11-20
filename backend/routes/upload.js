const router = require("express").Router();
const multer = require("multer");

// どこに保存するか定義（今回の場合ローカルサーバーのファイルに保存される）
const storage = multer.diskStorage({
  destination: (req,file,cb) =>{
    cb(null,"public/images");
  },
  filename: (req,file,cb) => {
    cb(null, req.body.name);
  }
});



const upload = multer({storage});
// 画像アップロード用のAPI(ミドルウェアのシングルの引数はform-dataのキーとなる)
router.post("/",upload.single("file"),(req,res)=>{
  try {
    return res.status(200).json("画像アップロードに成功しました");
  } catch (error) {
    console.log(error);
  }
});



module.exports = router;

