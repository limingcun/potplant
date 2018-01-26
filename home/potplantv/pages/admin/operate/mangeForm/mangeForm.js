//index.js
//获取应用实例
import API from '../../../../utils/api.js';
import util from '../../../../utils/util.js';
const app = getApp()
Page({
  data: {
    imgArr: [],
    formFomat: [{
        name: 'img',
        title: '头像',
        type: 'img'
      },
      {
        name: 'real_name',
        title: '姓名',
        type: 'text',
        placeholder: '必填'
      },
      {
        name: 'sex',
        title: '性别',
        type: 'select',
        selectArr: ['保密','男','女'],
      },
      {
        name: 'age',
        title: '年龄',
        type: 'text',
        placeholder: ''
      },
      {
        name: 'email',
        title: '邮箱',
        type: 'text',
        placeholder: ''
      },
      {
        name: 'phone',
        title: '电话',
        type: 'text',
        placeholder: ''
      },
      {
        name: 'address',
        title: '地址',
        type: 'text',
        placeholder: ''
      }
    ],
    imgStr: '',
    key: 0,
    formInfo: {},
    isEditId: 0,
    selectIndex: 0,
    bigImg: ''
  },
  onLoad: function (e) {
    var title = '编辑'
    this.data.isEditId = e.id
    this.getEditInfo(e.id)
    wx.setNavigationBarTitle({title: '管理员' + title})
    this.WxValidate = app.WxValidate({
        real_name: {
            required: true,
            maxlength: 14
        },
        age: {
            digits: true
        },
        phone: {
            tel: true
        },
        email: {
            email: true
        }
    },
    {
        real_name: {
            required: '请输入姓名',
            maxlength: '姓名过长'
        },
        age: {
            digits: '只能输入整数'
        },
        phone: {
            tel: '手机号格式不对'
        },
        email: {
            email: '邮箱格式不对'
        }
    })
  },
  /*
   * 插入图片
   */
  addImgFn: function(e) {
    var that = this
    if (that.data.imgArr.length < 1) {
        app.chooseImg(function(res) {
          that.data.imgArr.push(res)
          that.setData({
              'imgArr':that.data.imgArr
          })
        })
    }
  },
  /*
   * 去除图片
   */
  delImgFn: function(e) {
    this.data.imgArr.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      imgArr: this.data.imgArr,
    })
  },
  /*
   * 下拉框值改变
   */
  bindPickerChange: function (e) {
    this.setData({
      selectIndex: e.detail.value
    })
  },
  /*
   * 保存数据
   */
  formSubmit: function(e) {
    if (this.data.imgArr.length == 0) {
      app.showToast('请上传管理员', '../../../image/gth.png', 2000)
      return false
    }
    //提交错误描述
    if (!this.WxValidate.checkForm(e)) {
        const error = this.WxValidate.errorList[0]
        app.showToast(error.msg,'/image/gth.png',2000)
        return false
    }
    wx.showLoading({
      title: '',
      mask: true
    })
    var that = this
    var form = e.detail.value
    // 存在图片情况
    if (that.data.imgArr[0].indexOf('https://wx.qlogo.cn') != -1) {
      form['img'] = that.data.imgArr[0]
      this.textSubmit(form)
    } else {
      // 上传图片情况
      app.requestImg(API.adminMangeImg, that.data.imgArr[0], 'img', {}, (err, data) => {
        if (data) {
          form['img'] = data
          this.textSubmit(form)
        }
      })
    }
  },
  /**
   ** 上传提交form表单上传值
  **/
  textSubmit: function(form) {
    form['_method'] = 'PUT'
    app.requestData(API.adminMange + '/' + this.data.isEditId, form, (err, data) =>{
        if (data) {
            wx.showToast({
                title: '提交成功',
                icon: 'success',
                duration:2000,
                success: function(){
                    var timer = setTimeout(() =>{
                        wx.navigateBack({
                            delta: 1
                        })
                        clearTimeout(timer)
                    }, 2000)
                }
            })  
        } else {
            wx.showToast({
                title: '提交失败',
                image: '/image/gth.png',
                duration:2000,
                success: function() {
                    var timer = setTimeout(() =>{
                        wx.navigateBack({
                        delta: 1
                    })
                    clearTimeout(timer)
                    }, 2000)
                }
            })  
        }
    }, 'POST')
  },
  /**
   ** 获取编辑数据
  **/
  getEditInfo: function(id) {
    app.requestData(API.adminMange + '/' + id + '/edit', {}, (err, data) =>{
      var imgArr = []
      imgArr[0] = data.img
      this.setData({
        formInfo: data,
        imgArr: imgArr,
        selectIndex: data.sex
      })
    })
  },
  /** 
   ** 弹窗图片框
  **/
  changeBig: function(e) {
    var bigImg = e.currentTarget.dataset.img
    wx.previewImage({  
      urls: bigImg.split(',')
    })
  }
})
