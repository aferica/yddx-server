const COS = require('cos-nodejs-sdk-v5')
const config = require('../config/config')
const fs = require('fs')

const cos = new COS({
  // 必选参数
  SecretId: config.cos.SecretId,
  SecretKey: config.cos.SecretKey,
  // 可选参数
  FileParallelLimit: 3,    // 控制文件上传并发数
  ChunkParallelLimit: 8,   // 控制单个文件下分片上传并发数，在同园区上传可以设置较大的并发数
  ChunkSize: 1024 * 1024,  // 控制分片大小，单位 B，在同园区上传可以设置较大的分片大小
});

exports.uploadUserPhoto = function(req, res, next) {
  console.log(req.file);
  let now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  let day = now.getDate();

  // 文件路径
  let filePath = './' + req.file.path;  
  // 文件类型
  let temp = req.file.originalname.split('.');
  let fileType = temp[temp.length - 1];
  let lastName = '.' + fileType;
  // 构建图片名
  let fileName = Date.now() + lastName;
  // 图片重命名
  fs.rename(filePath, fileName, (err) => {
      if (err) {
          res.end(JSON.stringify({status:'102',msg:'文件写入失败'}));   
      }else{
          let localFile = './' + fileName;  
          let key = 'image/avater/' + year + '/' + month + '/' + day + '/' + fileName;

          // 腾讯云 文件上传
          let params = {
              Bucket: config.cos.Bucket,                         /* 必须 */
              Region: config.cos.Region,                         /* 必须 */
              Key: key,                                           /* 必须 */
              FilePath: localFile,                                /* 必须 */
          }
          cos.sliceUploadFile(params, function(err, data) {
            if(err) {
              fs.unlinkSync(localFile);
              res.jsonp({code: -1, msg: '文件上传失败，请重试'})   
            } else {
              fs.unlinkSync(localFile);
              let imageSrc = 'https://yidongdangxiao-1256926653.cos.ap-guangzhou.myqcloud.com/' + data.Key;
              res.jsonp({code: 0, msg: '上传成功', data: imageSrc})
            }
          });
      }
  });

}

