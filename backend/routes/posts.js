const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");


// 投稿作成機能の実装
router.post("/", async (req,res)=>{
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    return res.status(200).json(savedPost);
  } catch (error) {
    return res.status(500).json(error);
  }
});



// 投稿を更新する機能の実装（自分の投稿を自分自身が更新する）
router.put("/:id", async (req,res)=>{
  try {
    const post = await Post.findById(req.params.id);
  
    // 投稿を投稿した人と更新をしようとする人が一致するか判定
    if (post.userId === req.body.userId){
      await post.updateOne({
        $set: req.body
      });
      return res.status(200).json("投稿編集に成功しました");
    } else {
      return res.status(403).json("あなたは他の人の投稿を編集することはできません");
    }
  } catch (error) {
    return res.status(403).json(error);
  }
});




// 投稿を削除する機能の実装（自分の投稿を自分自身が削除する）
router.delete("/:id", async (req,res)=>{
  try {
    const post = await Post.findById(req.params.id);
    
    if (post.userId === req.body.userId){
      // await post.deleteone();でも可能
      await Post.findByIdAndDelete(req.params.id);
      return res.status(200).json("投稿の削除に成功しました");
    } else {
      return res.status(403).json("あなたは他の人の投稿を削除することはできません");
    }
  } catch (error) {
    return res.status(403).json(error);
  }
});



// 特定の投稿取得する機能実装
router.get("/:id", async (req,res)=>{
  try {
    const post = await Post.findById(req.params.id);
    return res.status(200).json(post);
  } catch (error) {
    return res.status(403).json(error);
  }
});



// 特定の投稿にいいねを押す機能実装（投稿に対していいねが押されていたらいいねを取り消す機能もあり、つまり条件分岐）（更新するメソッドPUT)
router.put("/:id/like", async (req,res) =>{
    try {
      const post = await Post.findById(req.params.id);

      // まだ取得した投稿にいいねが押されていなかったらいいねを押すことが可能（配列に加えるpush)
      if (!post.likes.includes(req.body.userId)){
        await post.updateOne({
          $push: {
            likes: req.body.userId
          }
        });
        return res.status(200).json("投稿にいいねすることに成功しました");

        // elseの条件分岐の中には投稿にいいねが押されていた場合、その投稿に対してのいいねを取り外す
      } else {
        await post.updateOne({
          $pull: {
            likes: req.body.userId
          }
        });
        return res.status(403).json("投稿に対していいねを取り外しました");
      }
    } catch (error) {
      return res.status(500).json(error);
    }
});


// プロフィール画面におけるタイムラインの取得機能（自分だけの投稿を取得）
router.get("/profile/:username", async (req,res)=>{
  try {
    // 自分のユーザー情報の取得
    const user = await User.findOne({username:req.params.username});
    // 自分の投稿しているものの全取得
    const posts = await Post.find({userId:user._id});
    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json(error);
  }
});




// タイムラインの取得（自分及びフォローしている人の投稿の一覧を取得）
router.get("/timeline/:userId", async (req,res)=>{
  try {
    // 自分のユーザー情報の取得
    const currentUser = await User.findById(req.params.userId);
    // 自分の投稿しているものの全取得
    const userPosts = await Post.find({userId:currentUser._id});
    // 自分がフォローしている人の投稿を全取得
    const friendsPosts = await Promise.all(
      currentUser.followings.map((friendId)=>{
        return Post.find({userId:friendId});
      })
    );

    // 返すものとしては、自分の全投稿（配列）とフォローしている人の全投稿（二次元配列なのでスプレット演算子で次元削減）を合体させたもの
    return res.status(200).json(userPosts.concat(...friendsPosts));

  } catch (error) {
    return res.status(500).json(error);
  }
});





// router.get("/",(req,res)=>{
  // res.send("posts router");
// });

module.exports = router;

