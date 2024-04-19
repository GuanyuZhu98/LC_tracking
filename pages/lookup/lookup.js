// pages/lookup/lookup.js
const openID = wx.cloud.callFunction({
  name:"getopenID"
})
const db=wx.cloud.database()
let auth = false
//获取异步数据
async function parsePromise() {
  try {
    const result = await openID;
    const openID_ = await result.result.openid
    console.log("输出openID",openID_)
    db.collection("auth_usr").where({openID:String(openID_)}).get({
      success:res=>{
        console.log("找到用户",res.data[0].read)
        auth = res.data[0].read
        return auth
      }
    })

    console.log("用户的OpenID是",openID_); // 输出: Success!
  } catch (error) {
    console.error(error); // 错误处理
  }
}
auth = parsePromise();
function isValidPotNum(value) {
  // 使用正则表达式匹配九位数字
  // 规则
  // 200个碳钢的锅胆订单，沟通SN号为9位数规则如下
  // 此批次编号为900500001至900500200
  // 9位数版本：全新2齿锅 
  // 第1位 9可用于零位检测 
  // 第2位 锅搅拌尺固定板位置：0代表正常版本，9代表抬高版本 
  // 第3位 锅材质，如0 铁锅，1复合材料锅 
  // 第4位 锅的厚度
  // 第5-9位为流水号
  var regex = /\d{9}$/;
  return regex.test(value);
};
//
function validPotNum(res){
  
  if (isValidPotNum(res)){
    console.log("这是一个合法的二维码")
    pot_info_available = true
  } else {
    pot_info_available = false
    wx.showToast({
      title: '非法SN号',
      icon: 'error',
      duration: 1000//持续的时间
    })
  }
}

function lookup(pot_SN){
 
    console.log("进入数据库查询")
    console.log(pot_SN)
    db.collection("pot_info").where({pot_id:Number(pot_SN)}).get({
      success:res=>{
        const result = res.data;
        console.log("成功获取云端数据");
        if (result.length === 0){
          wx.showToast({
            title: "无该锅相关信息",
            icon:"none"
          })
        } else{
          pot_state = res.data[0]
          console.log(pot_state)
          console.log()
        }
      }
    })
    
  
}




let pot_info_available = false
var pot_SN
let pot_state

Page({
  data : {
    auth: auth
  },
  //扫描并判断是否是有效二维码
  ScanQRCode(e){
      wx.scanCode({
        success (res) {
          pot_SN = res.result
          validPotNum(pot_SN)
          if (pot_info_available){
            lookup(pot_SN)
          }
        }
      })
  },
  //从输入框获取SN
  //
  getInputSN(e){
    pot_SN=e.detail.value
  },
  lookup(e){
    validPotNum(pot_SN)
    if (pot_info_available){
      lookup(pot_SN)
    }
  }
})