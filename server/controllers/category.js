const Category = require("../models/category");
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
  let form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not upload",
      });
    }

    const { name, content } = fields;
    const { image } = files;

    const slug = slugify(name);
    let category = new Category({ name, content, slug });

    // check image size
    if (image.size > 2000000) {
      return res.status(400).json({
        error: "Image file must not exceed 2mb",
      });
    }

    //   check to see if there is an existing entry
    Category.find({ name }).exec((err, title) => {
      if (title.length > 0 && title[0]["name"] == name) {
        res.status(400).json({
          error: "This Category name already exists.",
        });
      }
    });

    // upload image to S3
    console.log("this is the image.filepath", image.filepath);
    const params = {
      Bucket: "king-cobra711-react-node-aws",
      Key: `category/${uuidv4()}`,
      Body: fs.readFileSync(image.filepath),
      ACL: "public-read",
      ContentType: "image/jpg",
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
  });
};

// exports.create = (req, res) => {
//   const { name, content } = req.body;
//   const slug = slugify(name);
//   const image = {
//     url: `https://via.placeholder.com/200x150.png?text=${process.env.CLIENT_URL}`,
//     key: "123",
//   };

//   const category = new Category({
//     name,
//     slug,
//     image,
//   });
//   category.postedBy = req.user._id;

//   category.save((err, data) => {
//     if (err) {
//       console.log("CATEGORY CREAT ERROR", err);
//       return res.status(400).json({ error: "Category create failed" });
//     }
//     res.json(data);
//   });
// };
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
  //
};
exports.update = (req, res) => {
  //
};
exports.remove = (req, res) => {
  //
};
