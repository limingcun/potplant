var app = getApp()
Page({
  data: {
    items: [{content: '858685868', isTouchMove: false}]
  },
  onLoad: function () {
    
  },
  open: function () {
    var url = 'https://pot.find360.cn/home/aaa'
    app.requestData(url, {}, (err, data) =>{
        
    })
  },
  show: function () {
    var url = 'https://pot.find360.cn/home/test'
    app.requestData(url, {}, (err, data) =>{
        console.log(data)
    })
  }
})