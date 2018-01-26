//app.js
import wxValidate from 'utils/wxValidate'
App({
  globalData: {
    userInfo: null,
    https: 'https://pot.find360.cn/'
  },
  WxValidate: (rules, messages) => new wxValidate(rules, messages),
  onLaunch: function () {
  },
  /*
   * 数据交互方法
   * url 访问地址
   * params 访问地址
   * callback 回调函数
   * method 方法 （OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT）
   */
  requestData:function(url,params,callback,method,Role='admin') {
        var that = this
        if(Role=='admin') {
          params['st'] = wx.getStorageSync('st')
          params['openid'] = wx.getStorageSync('openid')
        }
        wx.request({
            url: url,
            data: params,
            method: method || 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {'Content-Type': 'application/x-www-form-urlencoded'}, // 设置请求的 header
            success: function(res){
                if (res.statusCode == 401 || res.statusCode == 403) {
                    that.showModelComfirm(res.statusCode)
                } else {
                    callback(null,res.data)
                }
            },
            fail: function(e) {
                callback(e)
            }
        })
    },
    /*
     * 图片访问方法(默认POST)
     * url 访问地址
     * file 图片路径（虚拟路径）
     * name 图片名称
     * formData 请求中其他额外的form data
     * callback 回调函数
     */
    requestImg: function(url, file, name, formData, callback) {
        var that = this
        formData['st'] = wx.getStorageSync('st')
        formData['openid'] = wx.getStorageSync('openid')
        wx.uploadFile({
            url: url,
            filePath: file,
            name: name,
            formData: formData,
            success: function(res){
                if (res.statusCode == 401 || res.statusCode == 403) {
                    that.showModelComfirm(res.statusCode)
                } else {
                    callback(null,res.data)
                }
            },
            fail: function(e) {
                callback(e)
            }
        })
    },
    /*
     * callback 回调函数
     */
    chooseImg: function(callback) {
        var that = this
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                if (res.tempFiles[0].size/1024>300) {
                  that.showToast('图片过大', '/image/gth.png', 2000)
                  return false
                }
                if (res.errMsg == "chooseImage:ok") {
                    callback(res.tempFilePaths[0])
                    // that.data.imgArr.push(res.tempFilePaths[0])
                    // that.setData({
                    //     'imgArr':that.data.imgArr
                    // })
                } else {
                    that.showToast('上传有误', '/image/gth.png', 2000)
                }
            }
        })
    },
    /*
     * 弹出框
     * title 提示文字
     * icon 提示图片
     * duration 执行时间
     */
    showToast: function (title,icon,duration) {
        wx.showToast({
            title: title,
            image: icon,
            duration: duration
        })
    },
    /*
     * 授权确定
     */
    showModelComfirm: function (e) {
        wx.clearStorageSync()
        wx.hideLoading()
        if (e == 401) {
            var text = '时间已过期，请重新登录'
        } else {
            var text = '其他设备登录，请重新登录'
        }
        wx.showModal({
          title: '微信授权',
          content: text,
          success: function(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/homePage/homePage'
              })
            }
          }
        })
    }
})