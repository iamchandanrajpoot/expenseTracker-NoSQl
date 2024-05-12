const SDK = require("aws-sdk");
function uploadToS3(data, filename) {
  const s3 = new SDK.S3({
    accessKeyId: process.env.IAM_USER_KEY,
    secretAccessKey: process.env.IAM_USER_SECRET_KEY,
  });
  const params = {
    Bucket: process.env.BUCKT_NAME,
    Key: filename,
    Body: data,
    ACL: "public-read",
  };

  // return promise
  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data)=>{
        if(err){
            reject(err)
        }else{
            resolve(data);
        }
    })
  });
}

module.exports = uploadToS3;
