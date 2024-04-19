// pages/record/record.js
const db=wx.cloud.database()

let photoTempPath_

let Nitriding_optionArray = ["东莞好火","惠州宏利","山东博兴"]
let Forming_optionArray = ["江苏旋压","惠州宏利","山东博兴"]
let isBatch_input
let singleInput
let batchInput1,batchInput2
let customerName 

let pot_SN

let forming_idx,nitriding_idx

let appearance_=false,concentricity_=false,flange_=false,stirring_=false

function create_new_pot(pot_SN,forming_loc,nitride_loc){

  console.log("开始创建数据")
  console.log(pot_SN)
  db.collection("pot_info").add({
    data:{
      pot_id:Number(pot_SN),
      current_user:"none",
      pot_current_state:"生产中",
      pot_produce_coating:nitride_loc,
      pot_produce_forming:forming_loc,
      pot_produce_nitriding:nitride_loc,
      pot_produce_polishing:nitride_loc,
      upload_time:new Date().toJSON().substring(0,10)+' '+new Date().toTimeString().substring(0,8)
    }
  })
}

function valid_upload(type,num1,num2,forming,nitriding){
//判断forming和nitriding有数值
console.log(type,num1,num2,forming,nitriding)
if (forming===undefined){
  wx.showToast({
    title: '未识别到锅胚供应商',
    icon: 'error',
    duration: 1000//持续的时间
  })
  return 0
}

if (nitriding==undefined){
  wx.showToast({
    title: '未识别到氮化供应商',
    icon: 'error',
    duration: 1000//持续的时间
  })
  return 0
}

  if (type===1){
    if(!isValidPotNum(num1)){
      wx.showToast({
        title: '非法SN号',
        icon: 'error',
        duration: 1000//持续的时间
      })
      return 0
    } else{
      return 1
    }
  } else{
    if(isValidPotNum(num1)&&isValidPotNum(num2)&&(num2>num1)){
      return 1
    } else{
      wx.showToast({
        title: '请检查SN号',
        icon: 'error',
        duration: 1000//持续的时间
      })
      return 0
    }
  }
}

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
  var regex = /^\d{9}$/;
  return regex.test(value);
};


Page({
  data: {
    isBatchInput: false,
    singleInput: '',
    batchInput1: '',
    batchInput2: '',
    customerName :'',
    Forming_optionArray:Forming_optionArray,
    Nitriding_optionArray:Nitriding_optionArray,

    appearance_:false,
    concentricity_:false,
    flange_:false,
    stirring_:false

  },

  //批量输入操作
  switchChange: function (e) {
    this.setData({
      isBatchInput: e.detail.value
    });
    isBatch_input = e.detail.value
  },
  singleInputChange: function (e) {
    singleInput = e.detail.value
    // console.log(singleInput)
  },
  batchInput1Change: function (e) {
    batchInput1 = e.detail.value
    // console.log(batchInput1)
  },
  batchInput2Change: function (e) {
    batchInput2 = e.detail.value
    // console.log(batchInput2)
  },
  picker1Change:function(e){
    // console.log(e.detail.value);
    this.setData({
      index1:e.detail.value
    })
    forming_idx=e.detail.value
  },
  picker2Change:function(e){
    // console.log(e.detail.value);
    this.setData({
      index2:e.detail.value
    })
    nitriding_idx=e.detail.value
  },
  CreatePotInfo:function(e){
    if (!isBatch_input){
      // console.log(Forming_optionArray[forming_idx],Polishing_Nitriding_Coating_optionArray[nitriding_idx],singleInput)
      let res = valid_upload(1,singleInput,_,forming_idx,nitriding_idx)
      if(res===1){
        create_new_pot(singleInput,Forming_optionArray[forming_idx],Nitriding_optionArray[nitriding_idx])
        console.log("锅信息新建成功")
      }

    } else{
      let res = valid_upload(2,batchInput1,batchInput2,forming_idx,nitriding_idx)
      if(res===1){
        for (var i=batchInput1;i<=batchInput2;i++){
          create_new_pot(i,Forming_optionArray[forming_idx],Nitriding_optionArray[nitriding_idx])
        console.log("锅信息新建成功")
        }
        // create_new_pot(singleInput,Forming_optionArray[forming_idx],Polishing_Nitriding_Coating_optionArray[nitriding_idx])
      }


    }
  },
  IQC_img:function(){
    wx.chooseImage({
      count:1,
      sizeType:'compressed',
      sourceType:['album','camera'],
      success:res=>{
        var photoTempPath = res.tempFilePaths[0]
        this.uploadPhotoToDatabase("IQC",photoTempPath)
      }
    })
  },
  OQC_img:function(){
    wx.chooseImage({
      count:1,
      sizeType:'compressed',
      sourceType:['album','camera'],
      success:res=>{
        var photoTempPath = res.tempFilePaths[0]
        this.uploadPhotoToDatabase("OQC",photoTempPath)
      }
    })
  },

  uploadPhotoToDatabase:function(status,photoTempPath){
    wx.cloud.uploadFile({
      cloudPath:status+"Photo/"+Date.now()+".jpg",
      filePath:photoTempPath,
      success(res){
        console.log("上传成功",res)
        photoTempPath_ = photoTempPath
        // wx.hideLoading()
        wx.showToast({
          title:"上传成功！",
          duration:2000
        })
      },
      fail(res){
        console.log(res)
        wx.hideLoading()
        wx.showToast({
          title:"上传失败,请检查网络！",
          icon:"none",
          duration:2000
        })
      }
    })
  },

  appearance_check:function(e){
    appearance_=e.detail.value
    // console.log(appearance_)
  },
  concentricity_check:function(e){
    concentricity_=e.detail.value
    // console.log(concentricity_)
  },
  flange_check:function(e){
    flange_=e.detail.value
    // console.log(flange_)
  },
  stirring_check:function(e){
    stirring_=e.detail.value
    // console.log(stirring_)
  },
  ScanQRCode(e){
    wx.scanCode({
      success (res) {
        pot_SN = res.result
        isValidPotNum(pot_SN)
        if (isValidPotNum(pot_SN)){
          singleInput=pot_SN
          wx.showToast({
            title: '扫描成功',
            icon: 'success',
            duration: 1000
          })
        }
      }
    })
},

  customerNameChange(e){
    customerName = e.detail.value
    
  },

  pot_IQC(){
    if (isValidPotNum(singleInput)){
    wx.cloud.callFunction({
      name: 'update_PotInfo',
      data: {
        number: Number(singleInput),
        appearance_: appearance_,
        concentricity_:concentricity_,
        flange_:flange_,
        stirring_:stirring_,
        img_url:photoTempPath_,
        pot_current_state:"在库中",
        sells:_,
        check_date:new Date().toJSON().substring(0,10)+' '+new Date().toTimeString().substring(0,8)
        // 替换成你要查询的编号
      },
      success: res => {
        if (res.result.exists) {
          console.log(res.result.message)
          // 编号存在，更新成功，处理其他逻辑
          wx.showToast({
            title: '上传成功',
            icon: 'success',
            duration: 1000//持续的时间
          })
        } else {
          console.log(res.result.message)
          // 编号不存在，提示用户
          wx.showToast({
            title: '未有订单信息',
            icon: 'error',
            duration: 1000//持续的时间
          })
        }
      },
      fail: err => {
        console.error('调用云函数失败', err)
        // 处理失败情况
      }
    })
    } else{wx.showToast({
      title: '非法SN号',
            icon: 'error',
            duration: 1000//持续的时间
    })}
  },

  upload_sell_info(){
    if (isValidPotNum(singleInput)){
    wx.cloud.callFunction({
      name: 'update_PotInfo',
      data: {
        number: Number(singleInput),
        appearance_: appearance_,
        concentricity_:concentricity_,
        flange_:flange_,
        stirring_:stirring_,
        img_url:photoTempPath_,
        pot_current_state:"已发货",
        sells:customerName
        // 替换成你要查询的编号
      },
      success: res => {
        if (res.result.exists) {
          console.log(res.result.message)
          // 编号存在，更新成功，处理其他逻辑
          wx.showToast({
            title: '上传成功',
            icon: 'success',
            duration: 1000//持续的时间
          })
        } else {
          console.log(res.result.message)
          // 编号不存在，提示用户
          wx.showToast({
            title: '未有订单信息',
            icon: 'error',
            duration: 1000//持续的时间
          })
        }
      },
      fail: err => {
        console.error('调用云函数失败', err)
        // 处理失败情况
      }
    })
    } else{wx.showToast({
      title: '非法SN号',
            icon: 'error',
            duration: 1000//持续的时间
    })}
  }



});