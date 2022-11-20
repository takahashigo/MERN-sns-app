const router = require("express").Router();
const User = require("../models/User");


// CRUD操作の実装
// ユーザー情報の更新機能実装（U）
router.put("/:id", async (req,res)=>{
  if (req.body.userId===req.params.id || req.body.isAdmin){
    try {
      const user = await User.findByIdAndUpdate(req.params.id,{
        $set: req.body
      });
      return res.status(200).json("ユーザ情報が更新されました");
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json("あなたは自分のアカウントの時だけ情報を更新できます");
  }
});


// ユーザー情報の削除機能実装（D)
router.delete("/:id", async (req,res)=>{
  if (req.body.userId===req.params.id || req.body.isAdmin){
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      return res.status(200).json("ユーザ情報が削除されました");
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json("あなたは自分のアカウントの時だけ情報を削除できます");
  }
});


// ユーザー情報の取得機能実装（R)
// router.get("/:id", async (req,res)=>{
//     try {
//       const user = await User.findById(req.params.id);
//       const {password,updatedAt,...other} = user._doc;
//       return res.status(200).json(other);
//     } catch (error) {
//       return res.status(500).json(error);
//     }
// });

// クエリ（ブラウザのURLで？と＆を用いて指定）を用いてユーザー情報を取得する機能実装（プロフィール画面で使用）
router.get("/", async (req,res)=>{
  const userId = req.query.userId;
  const username = req.query.username;

  try {
    const user = userId ? await User.findById(userId) : await User.findOne({username:username});

    const {password,updatedAt,...other} = user._doc;
    return res.status(200).json(other);
  } catch (error) {
    return res.status(500).json(error);
  }
});





// ユーザー情報のクリエイト機能（C)これはauth.jsで実装したので割愛







// ユーザーのフォロー機能実装（フォローを外したり、フォローをしたりと情報を更新する作業のなのでPUTメソッド）
router.put("/:id/follow", async (req,res) =>{
  if (req.body.userId !== req.params.id){
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);

      // 相手のフォロワーに自分自身（フォローする側）がいなかったらフォローできる（配列に加えるpush)
      if (!user.followers.includes(req.body.userId)){
        await user.updateOne({
          $push: {
            followers: req.body.userId
          }
        });
        await currentUser.updateOne({
          $push: {
            followings: req.params.id
          }
        });
        return res.status(200).json("フォローに成功しました");
      } else {
        return res.status(403).json("あなたはすでにこのユーザーをフォローしています");
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(500).json("自分自身をフォローすることはできません。");
  }
});




// ユーザーのフォローを外す機能実装
router.put("/:id/unfollow", async (req,res) =>{
  if (req.body.userId !== req.params.id){
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);

      // フォロワーに自分自身が存在したらフォロワーを外すことができる（配列から取り除くpull)
      if (user.followers.includes(req.body.userId)){
        await user.updateOne({
          $pull: {
            followers: req.body.userId
          }
        });
        await currentUser.updateOne({
          $pull: {
            followings: req.params.id
          }
        });
        return res.status(200).json("フォロー解除しました");
      } else {
        return res.status(403).json("このユーザーはフォロー解除できません");
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(500).json("自分自身をフォロー解除することはできません。");
  }
});


// router.post("/",(req,res)=>{
  // res.send("User router");
// });

module.exports = router;

