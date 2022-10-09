const Post = require("../models/posts");
const fs = require("fs");
//envoyer les schema sauces sur database(la route implenté)

exports.createpost = (req, res, next) => {
  const post = new Post({
    ...req.body,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
    // http://localhost:3000/images/1662648355155-299811405_2660138807450930_5936707431684283662_n.jpeg
    image: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
  });
  post.save().then(() => res.status(201).json({ message: "post créée !" }));
};

exports.getOnesauces = async (req, res, next) => {
  await Sauces.findOne({
    _id: req.params.id,
  })
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

//suppression un sauce

//contenu dynamique enregistre les informations dans data base
exports.getAllposts = async (req, res, next) => {
  const post = await Post.find()
    .populate("userId")
    .sort({ createdAt: -1 })

    .then((post) => res.json(post))
    .catch((error) => res.status(400).json({ error }));
};

//Modifier route put fichier

exports.modifyposts = (req, res, next) => {
  Post.findOne({ _id: req.params.id })
    .then((post) => {
      // sauce.imageUrl = http://localhost:3000/images/1662648355155-299811405_2660138807450930_5936707431684283662_n.jpeg
      // .split("/images/") = [http://localhost:3000, 1662648355155-299811405_2660138807450930_5936707431684283662_n.jpeg]
      // [1] = 1662648355155-299811405_2660138807450930_5936707431684283662_n.jpeg

      const filename = post.image.split("/images/")[1];
      // condition pour confirmer si l'utilisatuer a changé l'image et il était bien supprimé

      if (req.file) {
        // images/62648355155-299811405_2660138807450930_5936707431684283662_n.jpeg
        fs.unlink(`images/${filename}`, (err) => {
          if (err) throw err;
        });
      }
      const postObject = req.file // file(nouveau img) front end va envoyer
        ? //if le frontend envoyer et changer une image
          {
            ...req.body,
            //revenir sur l'ancienne protocole https....pour envoyer database
            image: `${req.protocol}://${req.get("host")}/images/${
              req.file.filename
            }`,
          }
        : { ...req.body };

      //database
      Post.updateOne(
        { _id: req.params.id },
        { ...postObject, _id: req.params.id }
      )
        .then(() => res.status(200).json({ message: "Post modifiée" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.deletepost = (req, res, next) => {
  Post.findOne({ _id: req.params.id })
    .then((post) => {
      // sauce.imageUrl = http://localhost:3000/images/1662648355155-299811405_2660138807450930_5936707431684283662_n.jpeg
      // .split("/images/") = [http://localhost:3000, 1662648355155-299811405_2660138807450930_5936707431684283662_n.jpeg]
      // [1] = 1662648355155-299811405_2660138807450930_5936707431684283662_n.jpeg
      const filename = post.image.split("/images/")[1];
      fs.unlink(`./images/${filename}`, () => {
        Post.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Post supprimée !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

//*************like/dislike************ */

exports.likePost = (req, res, next) => {
  // 222222
  // usersLiked [222222]
  // likes = 5 - 1 = 4
  // likes = 4 + 1 = 5

  Post.findOne({ _id: req.params.id })
    .then((post) => {
      if (post.usersLiked.includes(req.body.userId)) {
        Post.updateOne(
          { _id: req.params.id },
          {
            $pull: { usersLiked: req.body.userId },
            $inc: { likes: -1 },
          }
        )
          .then(() => res.status(201).json({ message: "like a été retiré !" }))
          .catch((error) =>
            res
              .status(500)
              .json({ message: "like a été retiré ! erreur" + error })
          );
      }
      
      else {
        Post.updateOne(
          { _id: req.params.id },
          {
            $push: { usersLiked: req.body.userId },
            $inc: { likes: +1 },
          }
        )
          .then(() =>
            res.status(201).json({ message: "disliked a été retiré !" })
          )
          .catch((error) =>
            res
              .status(500)
              .json({ message: "disliked a été retiré erreur !" + error })
          );
      }
    })
    .catch((error) => res.status(500).json({ message: "eureur  " + error }));
};
