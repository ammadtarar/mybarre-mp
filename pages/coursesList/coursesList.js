// pages/coursesList/coursesList.js
const urls = require('../../utils/urls.js');

Page({
  data: {
    locale: wx.getStorageSync('locale'),
    courses : [],
    showPricePopup: false,
    popupTitle : '',
    msg : "",
    course: {},
    needRegistration: true,
    popupType: ''
  },
  onLoad: function (options) {
    this.setData({
      needRegistration: options.needRegistration === 'true' ? true : false
    })
    console.log(this.data)
    wx.setNavigationBarTitle({
      title: 'MYBARRE',
    })
    this.getCourses();
  },
  getCourses: function(){
    const ctx = this;
    wx.showLoading();
    var today = new Date();
    
    var url = urls.getUrl('COURSES_LIST');
    url = url + "?page=1&limit=99999&after=" + today.toString()
    wx.request({
      url: url,
      header: {
        Authorization: wx.getStorageSync('token')
      },
      success: function(res){
        ctx.setData({
          courses: res.data.data.rows
        })
        wx.hideLoading()
      },
      fail: function(e){
        wx.hideLoading()
        console.log(e)
      }
    })
  },
  onClickCourse: function(e){
    const index = e.currentTarget.id;
    const course = this.data.courses[index];
    var msg = this.data.locale.preRegistrationFeeNotice;
    msg = msg.replace("%price" , course.price)
    this.setData({ popupTitle: this.data.locale.notice, msg: msg, course: course, showPricePopup: true, popupType: 'notice',})

  },
  resetAndHidePopup: function(){
    this.setData({
      showPricePopup : false,
      msg : "",
      popupTitle: ""
    })
  },
  onClickPopupNegativeButton: function () {
    this.resetAndHidePopup();
  },
  onClickPopupPositiveButton: function () {
    // 'payError', 'paymentError', 'payApiError', 'success', membershipFail
    console.log("this.data.popupType = ", this.data.popupType)
    console.log("this.needRegistration = ", this.data.needRegistration)
    this.resetAndHidePopup();
    if (this.data.popupType === 'success'){
      wx.reLaunch({
        url: '/pages/into/into',
      })
    } else if (this.data.popupType === "notice" && this.data.needRegistration){
      wx.navigateTo({
        url: '/pages/register/register?courseId=' + this.data.course.id
      })
    } else if (this.data.popupType === "notice" && !this.data.needRegistration){
      console.log("Pay membership")
      this.pay()
    }
    
  },
  pay: function () {
    var today = new Date();
    var out_trade_no = "MybMbrUsr" + wx.getStorageSync("user_id") + "Crs" + this.data.course.id + "" + today.getMilliseconds();
    const ctx = this;
    wx.showLoading({})
    wx.request({
      url: urls.getUrl('PAY'),
      method: "POST",
      header: {
        Authorization: wx.getStorageSync('token')
      },
      data: { orderCode: out_trade_no, money: this.data.course.price },
      success: res => {
        
        console.log("res.statusCode")
        console.log(res.statusCode)
        console.log(res.data)
       
        if (res.statusCode !== 200){
          console.log(this.data)
          wx.hideLoading()
          ctx.setData({ 
            popupType: 'payError', 
            popupTitle: ctx.data.locale.error, 
            msg: ctx.data.locale.payError + res.data.message, 
            showPricePopup: true 
          })
          return;
        }
        
        const payRes = res.data.data;
        wx.requestPayment({
          timeStamp: payRes.timeStamp,
          nonceStr: payRes.nonceStr,
          package: 'prepay_id=' + payRes.prepayId,
          signType: 'MD5',
          paySign: payRes.paySign,
          success: function (successRes) {
            console.log("successRes")
            console.log(successRes)
            ctx.createMembership(out_trade_no);
          },
          fail: function (payErr) {
            console.log("payErr")
            console.log(payErr)
            ctx.setData({
              popupType: 'paymentError',
              popupTitle: ctx.data.locale.error,
              msg: payErr.errMsg,
              showPricePopup: true
            })
          }
        })
        console.log(res.statusCode)
        wx.hideLoading()
      },
      fail: err => {
        console.log(err)
        ctx.setData({
          popupType: 'payApiError',
          popupTitle: ctx.data.locale.error,
          msg: 'Something went wrong',
          showPricePopup: true
        })
        wx.hideLoading()
      }

    })
  },
  createMembership: function (out_trade_no) {
    const ctx = this;
    wx.showLoading();
    wx.request({
      url: urls.getUrl('CREATE_MEMBERSHIP'),
      method: 'POST',
      header: {
        Authorization: wx.getStorageSync('token')
      },
      data: {
        courseId: ctx.data.course.id,
        out_trade_no: out_trade_no
      },
      success: regRes => {
        wx.hideLoading()
        console.log("MBR SHIP RES")
        console.log(regRes)
        ctx.setData({
          popupType: 'success',
          popupTitle: ctx.data.locale.allSet,
          msg: ctx.data.locale.enrollMsg,
          showPricePopup: true
        })
      },
      fail: failRes => {
        wx.hideLoading()
        ctx.setData({
          popupType: 'membershipFail',
          popupTitle: ctx.data.locale.allSet,
          msg: failRes.errMsg,
          showPricePopup: true
        })
        console.log(failRes)
      }
    })
  }
})