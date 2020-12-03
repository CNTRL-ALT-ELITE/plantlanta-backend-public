import * as AWS from "aws-sdk";
import Busboy from "busboy";
// import { AWS_CREDENTIALS } from "../../config/aws";
import { basename } from "path";

require("dotenv/config");

const UploadMedia = async ({ req, res }) => {
  const { typeOfUpload } = req.body;

  const busboy = new Busboy({ headers: req.headers });

  busboy.on("finish", () => {
    const file = req.files.attachment;

    const AWS_CREDENTIALS = {
      accessKeyId: process.env.AMAZON_ACCESS_KEY_ID,
      secretAccessKey: process.env.AMAZON_SECRET_ACCESS_KEY
    };

    AWS.config.update(AWS_CREDENTIALS);

    const s3 = new AWS.S3();

    const uploadParams = {
      Bucket: "plantlanta-website",
      Body: file.data,
      Key:
        "media/" + typeOfUpload + "/" + Date.now() + "_" + basename(file.name)
    };

    s3.upload(uploadParams, (err, data) => {
      if (err) {
        console.log(err);
        return res.status(400).json({
          status: "error",
          url: null
        });
      }

      if (data) {
        console.log(data);
        return res.json({
          status: "success",
          url: data.Location
        });
      }
    });
  });
  req.pipe(busboy);
};

export default {
  UploadMedia
};
