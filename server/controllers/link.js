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
  const { id } = req.params;

  Link.findOne({ _id: id }).exec((err, link) => {
    if (err) {
      return res.status(400).json({
        error: "Could not list links",
      });
    }

    res.json(link);
  });
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
exports.listUserLinks = (req, res) => {
  const id = req.user._id;

  let limit = req.body.limit ? parseInt(req.body.limit) : 5;
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;
  Link.find({ postedBy: id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("postedBy", "name")
    .populate("categories", "name")
    .exec((err, links) => {
      if (err) {
        return res.status(400).json({
          error: "Could not list links",
        });
      }

      res.json(links);
    });
};
exports.listAdminLinks = (req, res) => {
  let limit = req.body.limit ? parseInt(req.body.limit) : 5;
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;
  Link.find({})
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("postedBy", "name")
    .populate("categories", "name")
    .exec((err, links) => {
      if (err) {
        return res.status(400).json({
          error: "Could not list links",
        });
      }

      res.json(links);
    });
};
exports.update = (req, res) => {
  const { id } = req.params;
  const { title, url, categories, type, medium } = req.body;

  const slug = url;

  // Check to see if link already exists
  Link.findOneAndUpdate(
    { _id: id },
    { title, url, categories, type, medium, slug },
    { new: true }
  ).exec((err, updated) => {
    if (err) {
      return res.status(400).json({
        error: "Error updating link",
      });
    }
    res.json({
      message: `${updated.title} updated successfully`,
      updated,
    });
  });
};
exports.remove = (req, res) => {
  const { id } = req.params;

  Link.findOneAndRemove({ _id: id }).exec((err, success) => {
    if (err) {
      return res.status(400).json({
        error: "Could not delete link",
      });
    }
    res.json({
      message: `Successfully deleted '${success.title}'`,
    });
  });
};
exports.clickCount = (req, res) => {
  const { linkId } = req.body;

  Link.findByIdAndUpdate(linkId, { $inc: { clicks: 1 } }, { new: true }).exec(
    (err, result) => {
      if (err) {
        return res.status(400).json({
          error: "Could not update view count",
        });
      }
      res.json(result);
    }
  );
};
