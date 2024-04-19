// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:"store-cloud-2gjaluqnfb1a8d18"
})

const db = cloud.database()
const collection = db.collection('pot_info')

exports.main = async (event, context) => {
  const number = event.number,appearance_=event.appearance_,concentricity_=event.concentricity_,flange_=event.flange_,stirring_=event.stirring,pot_current_state_=event.pot_current_state,img_url_=event.img_url,sells=event.sells
  try {
    // 查询编号是否存在
    const result = await collection.where({pot_id:number}).get()

    if (result.data.length === 0) {
      return {
        exists: false,
        message: '编号不存在'
      }
    } else {
      // 更新字段
      const updateResult = await collection.doc(result.data[0]._id).update({
        data: {
          appearance: appearance_,
          concentricity:concentricity_,
          flange:flange_,
          stirring:stirring_,
          pot_current_state:pot_current_state_,
          img_url:img_url_,
          sells:sells

        }
      })
      return {
        exists: true,
        message: '更新成功'
      }
    }
  } catch (err) {
    return {
      exists: false,
      message: '查询失败：' + err.message
    }
  }
}
