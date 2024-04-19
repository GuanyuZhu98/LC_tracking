// pages/dum/dum.js





Page({
  getPotInfo(){
    wx.cloud.callFunction({
      name: 'update_PotInfo',
      data: {
        number: 900400001,
        appearance_: 1,
        concentricity_:2,
        flange_:2,
        stirring_:1
        // 替换成你要查询的编号
      },
      success: res => {
        if (res.result.exists) {
          console.log(res.result.message)
          // 编号存在，更新成功，处理其他逻辑
        } else {
          console.log(res.result.message)
          // 编号不存在，提示用户
        }
      },
      fail: err => {
        console.error('调用云函数失败', err)
        // 处理失败情况
      }
    })
  }
})