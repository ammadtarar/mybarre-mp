// pages/register/register.js
const urls = require('../../utils/urls.js');
const date = new Date()
Page({

  /**
   * Page initial data
   */
  data: {
    locale: wx.getStorageSync('locale'),
    stage : 1,
    form : [],
    sectionTitle: "",
    sectionDescription : "",
    min: 0,
    max: 2000,
    showingCertificateModal: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    courseId : -1,
    showPopup: false,
    popupNegText: "",
    showPopupNegBtn: "",
    popupTitle: "",
    popupMsg: ""
  },
  getSettingInfo: function () {
    console.log("lm-------getSettingInfo")
    // 登录
    wx.login({
      success: res => {
        //todo 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log("lm-------getSettingInfo---login", res)

      }
    })
  },
  bindGetUserInfo(e) {
    console.log(e.detail.userInfo)
  },
  getPhoneNumber(e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
  },
  /**
   * Lifecycle function--Called when page load
   */
  onClickPopupPositiveButton: function () {
    if(this.data.popupType === 'success'){
      this.resetAndHideModal()
      wx.reLaunch({
        url: '/pages/into/into',
      })
      return;
    }
    this.resetAndHideModal()
  },
  onClickPopupNegativeButton: function () {
    this.resetAndHideModal()
  },
  resetAndHideModal: function () {
    this.setData({
      showPopup: false,
      popupTitle: '',
      popupMsg: '',
      showPopupNegBtn: false,
      popupNegText: '',
      popupType: ''
    })
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: this.data.locale.signUp,
    })
    this.setData({

      
      courseId : options.courseId,
      genderValues: [{ key: this.data.locale.male, value: 'male' }, { key: this.data.locale.female, value: 'female' }],
      languageValues: [{ key: this.data.locale.english, value: 'en' }, { key: this.data.locale.mandarin, value: 'zh' }],
      yesNoValues: [{key: this.data.locale.yes , value: true} , {key: this.data.locale.no , value: false}],
      ['form.one.gender']: 'male',
      ['form.one.preffered_language']: 'en',
      ['form.three.certifications']: [],
      ['form.four.heart_condition']: true,
      ['form.four.chest_pain_or_blackouts']: true,
      ['form.four.meds_for_bp']: true,
      ['form.one.dob']: date.getFullYear() + '/' + date.getMonth() + '/' + date.getDay(),
    });

    
    this.processSectionTitleAndDescription();
    this.getCourse()
  },
  inputs: function (e) {
    const value = e.detail.value || "";
    const key = e.currentTarget.id;
    console.log(value)
    console.log(key)
    if (value === null || value === undefined || value === "") {
      var currentForm = this.data.form;
      delete currentForm[key.split('.')[0]][key.split('.')[1]];
      this.setData({ form: currentForm })
    } else {
      this.setData({
        ['form.' + key]: value
      })
    }
  },
  onToggleCertificateModal: function(e){
    this.setData({ showingCertificateModal: e.detail.visible })
  },
  onCertificatesUpdated: function(e){
    const value = e.detail.value || "";
    const key = e.detail.key;
    if (value.length <= 0) {
      var currentForm = this.data.form;
      delete currentForm[key.split('.')[0]][key.split('.')[1]];
      this.setData({ form: currentForm })
    } else {
      this.setData({
        ['form.' + key]: value
      })
    }
  },
  next: function(e){
    const ctx = this;
    var stage = this.data.stage;
    if(stage === 5){
      wx.showLoading();
      var form = {};
      for (let mainKey in this.data.form) {
        const mainObject = this.data.form[mainKey]
        for (let innerKey in mainObject) {
          const innerOject = mainObject[innerKey];
          form[innerKey] = innerOject
        }
      }
      wx.request({
        url: urls.getUrl('UPDATE_PROFILE'),
        method: 'POST',
        header : {
          Authorization : wx.getStorageSync('token')
        },
        data : form,
        success: regRes => {
          wx.hideLoading()
          console.log(regRes)
          wx.setStorageSync('name', form.name);
          wx.setStorageSync('email', form.email);
          wx.setStorageSync('gender', form.gender);
          wx.setStorageSync('phone', form.phone);
          ctx.pay();
        },
        fail: failRes => {
          ctx.setData({
            showPopupNegBtn: false,
            popupType: 'warning',
            popupTitle: this.data.locale.error,
            popupMsg: failRes.errMsg,
            showPopup: true
          })
          console.log(failRes)
          wx.hideLoading()
        }
      })
    }else{
      var keys = { 1: ['one', 10], 2: ['two', 5], 3: ['three', 8], 4: ['four', 3], 5: ['five', 0] };
      if (!this.allValuesEntered(keys[stage][0], keys[stage][1])) {
        ctx.setData({
          showPopupNegBtn: false,
          popupType: 'warning',
          popupTitle: this.data.locale.warning,
          popupMsg: this.data.locale.fillAllFields,
          showPopup: true
        })
        return;
      }
      stage = stage + 1;
      this.setData({ stage: stage })
      this.processSectionTitleAndDescription();
    }
  },
  allValuesEntered: function(stage , len){
    if (stage === 5){
      return truel
    }
    const form = this.data.form[stage] || null;
    if(form === null){
      return false
    }
    console.log(Object.keys(form))
    console.log(Object.keys(form).length)
    console.log(form);
    if (Object.keys(form).length < len){
      return false;
    }else{
      return true;
    }
  },
  onTextViewUpdated: function(e){
    const value = e.detail.value || "";
    const key = e.detail.key;
    if (value === null || value === undefined || value === "") {
      var currentForm = this.data.form;
      delete currentForm[key.split('.')[0]][key.split('.')[1]] ;
      this.setData({ form: currentForm })
    } else {
      this.setData({
        ['form.' + key]: value
      })
    }
  },
  onSingleOptionViewUpdated: function(e){
    const key = e.detail.key;
    const value = e.detail.value;
    var f = 'form.' + key;
    console.log(f);
    this.setData({
      [f]: value
    })
    console.log(this.data.form);
  },
  onClickSectionBack: function(e){
    console.log("onClickSectionBack");

    var stage = this.data.stage;
    if (stage <= 1) {
      stage = 1;
    } else {
      stage = stage - 1;
    }
    this.setData({ stage: stage })
    this.processSectionTitleAndDescription();

  },
  processSectionTitleAndDescription: function(){
    const stage = this.data.stage;
    var title = "";
    var desc = "";
    switch(stage){
      case 1:
        title = "regStageOneTitle";
        desc = "regStageOneDesc";
      break;
      case 2:
        title = "regStageTwoTitle";
        desc = "regStageTwoDesc";
        break;
      case 3:
        title = "regStageThreeTitle";
        desc = "regStageThreeDesc";
        break;
      case 4:
        title = "regStageFourTitle";
        desc = "regStageFourDesc";
        break;
      case 5:
        title = "t&cTitle";
        desc = "t&cDesc";
        break;
    }
    this.setData({
      sectionTitle: this.data.locale[title],
      sectionDescription: this.data.locale[desc],
    })
  },
  getCourse: function(){
    const ctx = this;
    wx.request({
      url : urls.getUrl('COURSE_BY_ID').replace(":id" , ctx.data.courseId),
      success: function(res){
        ctx.setData({
          course: res.data.data
        });
        console.log("course")
        console.log(ctx.data.course)
      },
      fail: function(e){
        console.log(e)
      }
    })
  },
  pay: function(){
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
        

        if (res.statusCode !== 200) {
          console.log(this.data)
          wx.hideLoading()
          ctx.setData({
            showPopupNegBtn: false,
            popupType: 'payError',
            popupTitle: ctx.data.locale.error,
            popupMsg: ctx.data.locale.payError + res.data.message,
            showPopup: true
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
          }
        })
        console.log(res.statusCode)
        wx.hideLoading()
      },
      fail: err => {
        console.log(err)
        wx.hideLoading()
      }

    })
  },
  createMembership: function (out_trade_no){
    const ctx = this;
    wx.showLoading();
    wx.request({
      url: urls.getUrl('CREATE_MEMBERSHIP'),
      method: 'POST',
      header: {
        Authorization: wx.getStorageSync('token')
      },
      data: {
        courseId : ctx.data.course.id,
        out_trade_no : out_trade_no
      },
      success: regRes => {
        wx.hideLoading()
        console.log("MBR SHIP RES")
        console.log(regRes)
        ctx.setData({
          showPopupNegBtn: false,
          popupType: 'success',
          popupTitle: this.data.locale.allSet,
          popupMsg: this.data.locale.enrollMsg,
          showPopup: true
        })
      },
      fail: failRes => {
        wx.hideLoading()
        ctx.setData({
          showPopupNegBtn: false,
          popupType: 'warning',
          popupTitle: this.data.locale.error,
          popupMsg: failRes.errMsg,
          showPopup: true
        })
        console.log(failRes)
      }
    })
  }
})