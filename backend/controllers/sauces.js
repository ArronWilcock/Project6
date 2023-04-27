const Sauce = require("../models/sauce");
const Like = require("../models/like");
const fs = require("fs");

exports.createSauce = (req, res, next) => {
  req.body.sauce = JSON.parse(req.body.sauce);
  const url = req.protocol + "://" + req.get("host");
  const sauce = new Sauce({
    name: req.body.sauce.name,
    manufacturer: req.body.sauce.manufacturer,
    description: req.body.sauce.description,
    heat: req.body.sauce.heat,
    imageUrl: url + "/images/" + req.file.filename,
    mainPepper: req.body.sauce.mainPepper,
    userId: req.body.sauce.userId,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  sauce
    .save()
    .then(() => {
      res.status(201).json({
        message: "Post saved successfully!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
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

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.updateSauce = (req, res, next) => {
  let sauce = new Sauce({ _id: req.params._id });
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    req.body.sauce = JSON.parse(req.body.sauce);
    sauce = {
      _id: req.params.id,
      name: req.body.sauce.name,
      manufacturer: req.body.sauce.manufacturer,
      description: req.body.sauce.description,
      heat: req.body.sauce.heat,
      imageUrl: url + "/images/" + req.file.filename,
      mainPepper: req.body.sauce.mainPepper,
      userId: req.body.sauce.userId,
      likes: 0,
      dislikes: 0,
      usersLiked: [],
      usersDisliked: [],
    };
  } else {
    sauce = {
      _id: req.params.id,
      name: req.body.name,
      manufacturer: req.body.manufacturer,
      description: req.body.description,
      heat: req.body.heat,
      imageUrl: req.body.imageUrl,
      mainPepper: req.body.mainPepper,
      userId: req.body.userId,
      likes: 0,
      dislikes: 0,
      usersLiked: [],
      usersDisliked: [],
    };
  }
  Sauce.updateOne({ _id: req.params.id }, sauce)
    .then(() => {
      res.status(201).json({
        message: "Sauce updated successfully!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    const filename = sauce.imageUrl.split("/images/")[1];
    fs.unlink("images/" + filename, () => {
      Sauce.deleteOne({ _id: req.params.id })
        .then(() => {
          res.status(200).json({
            message: "Deleted!",
          });
        })
        .catch((error) => {
          res.status(400).json({
            error: error,
          });
        });
    });
  });
};

exports.likeSauce = (req, res, next) => {
  let like = new Like({
    userId: req.body.userId,
    like: req.body.like,
  });

  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    const usersLiked = sauce.usersLiked;
    const usersDisliked = sauce.usersDisliked;
    if (like.like == 1 && !usersLiked.includes(like.userId)) {
      sauce.likes += 1;
      usersLiked.push(like.userId);
    } else if (like.like == -1 && !usersDisliked.includes(like.userId)) {
      sauce.dislikes += 1;
      usersDisliked.push(like.userId);
    } else if (like.like == 0 && usersLiked.includes(like.userId)) {
    }
  });
};
