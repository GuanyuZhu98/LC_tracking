// app.js
App({
  globalData:{
    Forming_optionArray:[],
    Nitriding_optionArray:[]
  },
  onLaunch: function(){
    //初始化云开发环境
    wx.cloud.init({
      env:"store-cloud-2gjaluqnfb1a8d18"
    })

}
})
