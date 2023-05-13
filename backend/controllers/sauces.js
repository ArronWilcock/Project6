// controllers contain the business logic to keep the code more modular and maintainable

// Required packages & routes declared
const Sauce = require("../models/sauce");
const fs = require("fs");

// Create sauce Request. This includes creating a sauce without an image file attached
exports.createSauce = (req, res, next) => {
  let sauce = null;
  let parsedSauce = null;
  let imageUrl = null;
  if (req.file) {
    parsedSauce = JSON.parse(req.body.sauce);
    // logic to retrieve the entire url for the image file
    const url = req.protocol + "://" + req.get("host");
    imageUrl = url + "/images/" + req.file.filename;
  } else {
    parsedSauce = req.body;
  }
  sauce = new Sauce({
    name: parsedSauce.name,
    manufacturer: parsedSauce.manufacturer,
    description: parsedSauce.description,
    heat: parsedSauce.heat,
    imageUrl,
    mainPepper: parsedSauce.mainPepper,
    userId: parsedSauce.userId,
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
        error: error.message || error,
      });
    });
};

// Request to find a specified sauce
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

// Request to retrieve all sauces
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

// Request to update a sauce. This request updates the sauce (including any image), while maintaining the sauces id
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

// Request to delete a sauce and remove its linked image from the image folder
exports.deleteSauce = (req, res, next) => {
  if (req.file) {
    Sauce.findOne({ _id: req.params.id }).then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      // fs.unlink function to remove deleted sauces images from the image folder
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
  } else {
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
  }
};

// Like sauce request. This request ensures that a user can only ever be declared on one of the like options
// the users id is then added/removed from the liked/disliked array and the array count updated
exports.likeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    const usersLiked = sauce.usersLiked;
    const usersDisliked = sauce.usersDisliked;
    const userId = req.body.userId;
    const like = req.body.like;
    if (like === 1 && !usersLiked.includes(userId)) {
      resetLike(usersLiked, userId, usersDisliked);
      usersLiked.push(userId);
    } else if (like === -1 && !usersDisliked.includes(userId)) {
      resetLike(usersLiked, userId, usersDisliked);
      usersDisliked.push(userId);
    } else if (
      like === 0 &&
      (usersLiked.includes(userId) || usersDisliked.includes(userId))
    ) {
      resetLike(usersLiked, userId, usersDisliked);
    }

    sauce.likes = usersLiked.length;
    sauce.dislikes = usersDisliked.length;

    Sauce.updateOne({ _id: req.params.id }, sauce)
      .then(() => {
        res.status(201).json({
          message: "Sauce updated successfully!",
        });
      })
      .catch((error) => {
        res.status(400).json({
          error: error.message || error,
        });
      });
  });
};

// helper function for removing a user from any like/dislike array they are no longer required in
function resetLike(usersLiked, userId, usersDisliked) {
  likesIndex = usersLiked.indexOf(userId);
  dislikesIndex = usersDisliked.indexOf(userId);
  usersLiked.splice(likesIndex, 1);
  usersDisliked.splice(dislikesIndex, 1);
}
