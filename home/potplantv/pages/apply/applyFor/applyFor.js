//获取首页
import API from '../../../utils/api.js';
import util from '../../../utils/util.js';
const app = getApp()
Page({
  data: {
    userInfo: {},
    formData: [{
      name: 'real_name',
      placeholder: '姓名',
      type: 'text'
    },
    {
      name: 'phone',
      placeholder: '电话',
      type: 'text'
    },
    {
      name: 'email',
      placeholder: '邮箱',
      type: 'text'
    },
    {
      name: 'sex',
      placeholder: '性别',
      type: 'select',
      selectArr: ['保密','男','女'],
    },
    {
      name: 'address',
      placeholder: '地址',
      type: 'text'
    }],
    selectIndex: 0
  },
  onLoad: function () {
  	wx.setNavigationBarTitle({title: '申请使用'})
    this.WxValidate = app.WxValidate({
        real_name: {
            required: true,
            maxlength: 14
        },
        phone: {
            required: true,
            tel: true
        },
        email: {
            required: true,
            email: true
        },
        address: {
            required: true
        }
    },
    {
        real_name: {
            required: '请输入姓名',
            maxlength: '姓名长度过长'
        },
        phone: {
            required: '请输入手机号',
            tel: '手机号格式不对'
        },
        email: {
            required: '请输入邮箱',
            email: '邮箱格式不对'
        },
        address: {
            required: '请输入地址'
        }
    })
  },
  onShow: function() {
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
    var data = e.detail.value
    data['img'] = wx.getStorageSync('userInfo').avatarUrl
    data['openid'] = wx.getStorageSync('openid')
    wx.request({
        url: API.applyFor,
        method: 'POST',
        data: data,
        success: function(res) {
            if (res.data == 'true') {
              app.showToast('提交成功', '/image/pass.png', 2000)
              setTimeout(function() {
                wx.navigateTo({
                  url: '../../homePage/homePage'
                })
              }, 2000)
            } else {
              app.showToast('提交失败', '/image/gth.png', 2000)
            }
        }
    })
  }
})
