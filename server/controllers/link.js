const Link = require("../models/link");
const slugify = require("slugify");

// create, read, list, update, remove

exports.create = (req, res) => {
  const { title, url, categories, type, medium } = req.body;

  const slug = url;

  let link = new Link({ title, url, categories, type, medium, slug });
  // postedBy user
  link.postedBy = req.user._id;

  // Check to see if link already exists
  Link.findOne({ $or: [{ title }, { url }] }).exec((err, exists) => {
    console.log("this is the found link", exists);
    if (exists) {
      return res.status(400).json({
        error: "Link title or url already exists",
      });
    } else {
      // save link
      link.save((err, data) => {
        console.log(err);
        if (err) {
          return res.status(400).json({
            error: "Failed to upload link",
          });
        }
        res.status(200).json(data);
      });
    }
  });
};
exports.read = (req, res) => {
  //
};
exports.list = (req, res) => {
  Link.find({}).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: "Could not list links",
      });
    }
    res.json(data);
  });
};
exports.update = (req, res) => {
  //
};
exports.remove = (req, res) => {
  //
};
