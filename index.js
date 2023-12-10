const AWS = require("aws-sdk");

const s3Client = new AWS.S3({
  region: process.env.REGION,
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY,
});

exports.handler = async (event, context, callback) => {
  const { ext, dir } = event;
  const imageDir = getImageDir(dir);

  let today = new Date();
  let randomStr = Math.random().toString(36).substring(2, 8);
  let imageKey = today.getTime() + randomStr;

  const params = {
    Bucket: process.env.IMAGE_BUCKET,
    Key: `${imageDir}${imageKey}.${ext}`,
    Expires: 60 * 60,
  };

  const presignedUrl = await s3Client.getSignedUrlPromise("putObject", params);
  callback(null, {
    imageKey: imageKey + "." + ext,
    presignedUrl: presignedUrl,
  });
};

function getImageDir(imageDir) {
  if (imageDir === "user") return "user/";
  else if (imageDir === "store") return "store/";
}