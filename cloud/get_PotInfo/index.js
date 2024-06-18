// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:"store-cloud-2gjaluqnfb1a8d18"
}) // 使用当前云环境
const db=cloud.database()

// 云函数入口函数
exports.main = async (event) => {
  // const pot_id = event.pot_id;
  try {
    const res = await db.collection('pot_info').get();
    // console.log("抓取成功",res)
    return {res};
  } catch (err) {
    // console.error("抓取错误",err);
    throw err;
  }
}