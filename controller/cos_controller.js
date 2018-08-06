const COS = require('cos-nodejs-sdk-v5')
const config = require('../config/config')
const fs = require('fs')
const md5 = require('js-md5')
const path = require('path')
const exec = require('child-process-promise').exec

const chunkDir = path.join(__dirname, "../tmp");

const cos = new COS({
  // 必选参数
  SecretId: config.cos.SecretId,
  SecretKey: config.cos.SecretKey,
  // 可选参数
  FileParallelLimit: 3,    // 控制文件上传并发数
  ChunkParallelLimit: 8,   // 控制单个文件下分片上传并发数，在同园区上传可以设置较大的并发数
  ChunkSize: 1024 * 1024,  // 控制分片大小，单位 B，在同园区上传可以设置较大的分片大小
});

exports.bigUploadUpload = async function(req, res) {
  // console.log(req.file);
  // console.log(req.body);
  const query = req.body;

  const src_path = req.file.path; // 原始片段在临时目录下的路径  
  const des_dir = './tmp/' + md5(req.file.originalname);
  const des_path = des_dir + '/' + query.chunkNumber;

  // 如果没有des_dir目录,则创建des_dir  
  if (!fs.existsSync(des_dir)) {
      fs.mkdirSync(des_dir);
  }
  // 移动分片文件到  
  try {
      await exec(['mv', src_path, des_path].join(' '));
      if(query.totalChunks == query.chunkNumber) {
        bigUploadMerge(des_dir, req, res)
      } else {
        return res.jsonp({ 'status': 0, 'msg': '上传成功!' });
      }
      
  } catch (e) {
      console.log(e);
      return res.status(404)
  }

  // res.jsonp({code: 0, msg: '初始化成功'}) 

}

async function bigUploadMerge(des_dir, req, res) {


  let now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  let day = now.getDate(); 
  // 文件类型
  let temp = req.body.filename.split('.');
  let fileType = temp[temp.length - 1];
  let lastName = '.' + fileType;

  let fileName = Date.now() + lastName;
  let key = req.query.key + '/' + year + '/' + month + '/' + day + '/' + fileName;

  try {
    var files = fs.readdirSync(des_dir);

    if (files.length == 0) {
      return res.status(404)
    }

    if (files.length > 1) {
        // console.log(files)
        files.sort(function(x, y) {
            return x - y;
        });
        // console.log(files)
    }

    let des_path = './tmp/' + fileName
    for (var i = 0, len = files.length; i < len; i++) {
        fs.appendFileSync(des_path, fs.readFileSync(des_dir + '/' + files[i]));
    }

    // 删除分片文件夹  
    await exec(['rm', '-rf', des_dir].join(' '));
    
    // 腾讯云 文件上传
    let params = {
        Bucket: config.cos.Bucket,                         /* 必须 */
        Region: config.cos.Region,                         /* 必须 */
        Key: key,                                           /* 必须 */
        FilePath: des_path,                                /* 必须 */
    }
    cos.sliceUploadFile(params, function(err, data) {
      if(err) {
        fs.unlinkSync(des_path);
        return res.status(404)  
      } else {
        fs.unlinkSync(des_path);
        console.log(data)
        let videoSrc = 'https://yidongdangxiao-1256926653.cos.ap-guangzhou.myqcloud.com/' + data.Key;
        res.jsonp({code: 0, msg: '上传成功', data: videoSrc})
      }
    });

  } catch (e) {
      // 删除分片文件夹  
      await exec(['rm', '-rf', des_dir].join(' '));
      return res.status(404)
  }
}




exports.uploadUserPhoto = function(req, res, next) {
  // console.log(req.file);
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


exports.uploadDangkeVideo = function(req, res) {
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
          let key = 'video/dangke/' + year + '/' + month + '/' + day + '/' + fileName;

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
              console.log(data)
              let videoSrc = 'https://yidongdangxiao-1256926653.cos.ap-guangzhou.myqcloud.com/' + data.Key;
              res.jsonp({code: 0, msg: '上传成功', data: videoSrc})
            }
          });
      }
  });

}

