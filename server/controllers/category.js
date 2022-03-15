const Category = require("../models/category");
const Link = require("../models/link");
const slugify = require("slugify");
const formidable = require("formidable");
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

// configure aws s3 (for storage)
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secrectAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

exports.create = (req, res) => {
  const { name, image, content } = req.body;
  // image data
  const base64Data = new Buffer.from(
    image.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );
  const type = image.split(";")[0].split("/")[1];

  const slug = slugify(name);
  let category = new Category({ name, content, slug });

  // Posted by
  category.postedBy = req.user._id;

  //   check to see if there is an existing entry
  Category.find({ name }).exec((err, title) => {
    if (title.length > 0 && title[0]["name"] == name) {
      res.status(400).json({
        error: "This Category name already exists.",
      });
    }
  });

  const params = {
    Bucket: "king-cobra711-react-node-aws",
    Key: `category/${uuidv4()}.${type}`,
    Body: base64Data,
    ACL: "public-read",
    ContentEncoding: "base64",
    ContentType: `image/${type}`,
  };

  // Upload to aws S3
  s3.upload(params, function (err, data) {
    if (err) {
      res.status(400).json({
        error: "Failed to upload to S3",
      });
    }
    category.image.url = data.Location;
    category.image.key = data.Key;

    // save to database
    category.save((err, success) => {
      if (err) {
        res.status(400).json({
          error: "Error saving category to database",
        });
      } else {
        return res.json({
          success,
          message: `Successfully created "${name}"`,
        });
      }
    });
  });
};
exports.list = (req, res) => {
  Category.find({}).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: "Categories could not load",
      });
    }
    res.json(data);
  });
};
exports.read = (req, res) => {
  const { slug } = req.params;
  let limit = req.body.limit ? parseInt(req.body.limit) : 10;
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;
  Category.findOne({ slug })
    .populate("postedBy", "_id name username")
    .exec((err, category) => {
      if (err) {
        return res.status(400).json({
          error: "Could not load category",
        });
      }
      console.log(category);
      Link.find({ categories: category })
        .populate("postedBy", "_id name username")
        .populate("categories", "name")
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .exec((err, links) => {
          if (err) {
            return res.status(400).json({
              error: "Could not load links of a category",
            });
          }
          res.json({ category, links });
        });
    });
};
exports.update = (req, res) => {
  const { slug } = req.params;
  const { name, image, content } = req.body;

  // image data
  const base64Data = new Buffer.from(
    image.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );
  const type = image.split(";")[0].split("/")[1];

  Category.findOneAndUpdate({ slug }, { name, content }, { new: true }).exec(
    (err, updated) => {
      if (err) {
        return res.status(400).json({
          error: "Could not find category to update",
        });
      }
      if (image) {
        // remove the exising image from s3
        const deleteParams = {
          Bucket: "king-cobra711-react-node-aws",
          Key: `${updated.image.key}`,
        };

        s3.deleteObject(deleteParams, function (err, data) {
          if (err) {
            console.log("S3 DELETE ERROR DURING CATEGORY UPDATE", err);
          } else {
            console.log("S3 DELETE SUCCESS DURING CATEGORY UPDATE", data);
          }
        });

        // handle image upload for new image
        const params = {
          Bucket: "king-cobra711-react-node-aws",
          Key: `category/${uuidv4()}.${type}`,
          Body: base64Data,
          ACL: "public-read",
          ContentEncoding: "base64",
          ContentType: `image/${type}`,
        };
        s3.upload(params, function (err, data) {
          if (err) {
            res.status(400).json({
              error: "Failed to upload to S3",
            });
          }
          updated.image.url = data.Location;
          updated.image.key = data.Key;

          // save to database
          updated.save((err, success) => {
            if (err) {
              res.status(400).json({
                error: "Error saving category to database",
              });
            } else {
              updated = success;
              return res.json({
                updated,
                message: `Successfully updated "${name}"`,
              });
            }
          });
        });
      } else {
        res.json({ updated, message: `Successfully updated "${name}"` });
      }
    }
  );
};
exports.remove = (req, res) => {
  const { slug } = req.params;

  Category.findOneAndRemove({ slug }).exec((err, success) => {
    if (err) {
      return res.status(400).json({
        error: "Could not delete category",
      });
    }
    console.log("this is success:   ", success);
    console.log("this is success.image.key:   ", success.image.key);
    // remove the exising image from s3
    const deleteParams = {
      Bucket: "king-cobra711-react-node-aws",
      Key: `${success.image.key}`,
    };

    s3.deleteObject(deleteParams, function (err, data) {
      if (err) {
        console.log("S3 DELETE ERROR DURING CATEGORY DELETE", err);
      } else {
        console.log("S3 DELETE SUCCESS DURING CATEGORY DELETE", data);
      }
    });
    res.json({
      message: `Successfully deleted '${success.name}'`,
    });
  });
};
