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
    wx.setNavigationBarTitle({
      title: 'MYbarre',
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

        var courses = res.data.data.rows;
        var availableCourse = [];

        courses.forEach(function (course) {
          if (!(new Date() > new Date(course.last_signup_date)) && course.available_seats > 0) {
            availableCourse.push(course)
          }
        });

        ctx.setData({
          courses: availableCourse
        })
        wx.hideLoading()
      },
      fail: function(e){
        wx.hideLoading()
      }
    })
  },
  onClickCourse: function(e){
    this.setData({ 
      popupTitle: this.data.locale.notice, 
      msg: this.data.locale.preRegistrationFeeNotice, 
      course: this.data.courses[e.currentTarget.id], 
      showPricePopup: true, 
      popupType: 'notice'
    });
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
       
        if (res.statusCode !== 200){
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
            ctx.createMembership(out_trade_no);
          },
          fail: function (payErr) {
            ctx.setData({
              popupType: 'paymentError',
              popupTitle: ctx.data.locale.error,
              msg: payErr.errMsg,
              showPricePopup: true
            })
          }
        })
        wx.hideLoading()
      },
      fail: err => {
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
      }
    })
  }
})