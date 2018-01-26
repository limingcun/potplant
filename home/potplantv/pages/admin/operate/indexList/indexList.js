//index.js
//获取应用实例
import API from '../../../../utils/api.js';
const app = getApp()
Page({
  data: {
    listArr: [{
        img: '../../../../image/watering.png',
        class: 'water',
        info: '浇水信息',
        type: 'water',
        flag: true
      },
      {
        img: '../../../../image/fertilize.png',
        class: 'fertilize',
        info: '施肥信息',
        type: 'fertilize',
        flag: true
      },
      {
        img: '../../../../image/admin.png',
        class: 'admin',
        info: '管理人信息',
        type: 'admin',
        flag: false
      },
      {
        img: '../../../../image/other.png',
        class: 'other',
        info: '其他信息',
        type: 'other',
        flag: true
      },
      {
        img: '../../../../image/qrcode.png',
        class: 'qrcode',
        info: '二维码信息',
        type: 'qrcode',
        flag: true
      }
    ],
    plant_id: 0,
    adminShow: true,
    plant_name: ''
  },
  onLoad: function (e) {
    this.data.plant_name = e.name
    wx.setNavigationBarTitle({title: e.name + '操作列表'})
    this.setData({
      plant_id: e.id,
      adminShow: e.type==1 ? true : false
    })
  },
  /*
   * 显示操作列表
   */
  showOperate: function(e) {
    var that = this
    var type = e.currentTarget.dataset.type
    var id = e.currentTarget.dataset.id
    if (type=='qrcode') {
      var data = {
        path: 'pages/home/look/look?id=' + id + '&name=' + this.data.plant_name,
        id: id
      }
      app.requestData(API.setQrcode, data, (err, res) =>{
        if (res != undefined && res !== 'false') {
          var bigImg = app.globalData.https + res
          wx.previewImage({  
            urls: bigImg.split(',')
          })
        }
      })
    } else if(type=='admin') {
      var url = '../mange/mange?type=' + type + '&id=' + id + '&plant_name=' + this.data.plant_name
      wx.navigateTo({
        url: url
      })
    } else {
      var url = '../operate/operate?type=' + type + '&id=' + id
      wx.navigateTo({
        url: url
      })
    }
  },
  /*
   * 关闭弹窗
   */
  closePop: function() {
    this.setData({
      isPop: false
    })
  }
})
