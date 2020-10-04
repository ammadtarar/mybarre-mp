// pages/legacyRegister/legacyRegister.js
const urls = require('../../utils/urls.js');
const date = new Date()
Page({
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
    showPopup: false,
    popupNegText: "",
    showPopupNegBtn: "",
    popupTitle: "",
    popupMsg: "",
    sockSizes: [{ key: '35-38', value: '35-38' }, { key: '39-40', value: '39-40' }],
    headShot: '../../resources/images/user_placeholder.png',
    sholderShot: '../../resources/images/user_placeholder.png',
    headShortUrl: null,
    shoulderShotUrl : null,
    extraManualFee : 199,
    showRedeemCouponPopup: false
  },
  bindGetUserInfo(e) {

  },
  getPhoneNumber(e) {
    
  },
  onClickShoulderShotInfo(){
    this.setData({
      showPopup: true,
      popupTitle: this.data.locale.shoulderShot,
      popupMsg: this.data.locale.shoulderShotInfo,
      showPopupNegBtn: false,
      popupNegText: '',
      popupType: ''
    })
  },
  onClickHeadShotInfo() {
    this.setData({
      showPopup: true,
      popupTitle: this.data.locale.headShot,
      popupMsg: this.data.locale.headShotInfo,
      showPopupNegBtn: false,
      popupNegText: '',
      popupType: ''
    })
  },
  onClickHeadShot(){
    const ctx = this;
    wx.chooseImage({
      success: function(res) {
        ctx.setData({
          headShot: res.tempFilePaths[0]
        })
      },
    })
  },
  onClickShoulderShot() {
    const ctx = this;
    wx.chooseImage({
      success: function (res) {
        ctx.setData({
          sholderShot: res.tempFilePaths[0]
        })
      },
    })
  },
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
    this.getLegacyCourse();
    wx.setNavigationBarTitle({
      title: this.data.locale.signUp,
    })
    this.setData({
      genderValues: [{ key: this.data.locale.female, value: 'female' }, { key: this.data.locale.male, value: 'male' }],
      shirtSizes: [{ key: this.data.locale.small, value: 'small' }, { key: this.data.locale.medium, value: 'medium' }, { key: this.data.locale.large, value: 'large' }],
      manualValues: [{ key: this.data.locale.english, value: 'english' }, { key: this.data.locale.mandarin, value: 'mandarin' }, { key: this.data.locale.both, value: 'both' }],
      yesNoValues: [{key: this.data.locale.yes , value: true} , {key: this.data.locale.no , value: false}],
      ['form.one.gender']: 'female',
      ['form.one.top_size']: 'small',
      ['form.one.sock_size']: '35-38',
      ['form.one.manual_lang']: 'english',
      ['form.three.certifications']: [],
      ['form.four.heart_condition']: true,
      ['form.four.chest_pain_or_blackouts']: true,
      ['form.four.meds_for_bp']: true,
      ['form.one.dob']: date.getFullYear() + '/' + date.getMonth() + '/' + date.getDay(),
    });    
    this.processSectionTitleAndDescription();
  },
  inputs: function (e) {
    const value = e.detail.value || "";
    const key = e.currentTarget.id;
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
  getLegacyCourse(){
    wx.showLoading();
    let ctx = this;
    wx.request({
      url: urls.getUrl('LEGACY_COURSE'),
      success(res){
        ctx.setData({
          course : res.data.data
        });
        console.log(ctx.data.course);
        wx.hideLoading();
      },
      fail(err){
        console.log(err);
        wx.hideLoading();
      }
    })
  },
  next:  function(e){
    // this.setData({
    //   stage : this.data.stage < 6 ? this.data.stage + 1 : 1
    // })
    // return
    const ctx = this;
    var stage = this.data.stage;
    if(stage === 6){
      wx.showLoading();
      var form = {};
      for (let mainKey in this.data.form) {
        const mainObject = this.data.form[mainKey]
        for (let innerKey in mainObject) {
          const innerOject = mainObject[innerKey];
          form[innerKey] = innerOject
        }
      }

      
      ctx.uploadPhoto(ctx.data.headShot)
      .then(function(headUrl){
        form['avatar_url'] = headUrl;
        form['type'] = 'legacy';
        form['status'] = 'pending';

        wx.request({
          url: urls.getUrl('UPDATE_PROFILE'),
          method: 'POST',
          header: {
            Authorization: wx.getStorageSync('token')
          },
          data: form,
          success: regRes => {
            wx.hideLoading()
            wx.setStorageSync('name', form.name);
            wx.setStorageSync('email', form.email);
            wx.setStorageSync('gender', form.gender);
            wx.setStorageSync('phone', form.phone);
            ctx.createMembership('LEGACY_USER_OUTRADE_NO' , '0.0');
          },
          fail: failRes => {
            ctx.setData({
              showPopupNegBtn: false,
              popupType: 'warning',
              popupTitle: this.data.locale.error,
              popupMsg: failRes.errMsg,
              showPopup: true
            })
            wx.hideLoading()
          }
        })
      })
    }else{
      var keys = { 1: ['one', 15], 2: ['two', 0], 3: ['three', 0], 4: ['four', 3], 5: ['five', 0] };
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
      if (ctx.data.stage === 1 && ctx.data.headShot === "../../resources/images/user_placeholder.png"){
        ctx.setData({
          showPopupNegBtn: false,
          popupType: 'warning',
          popupTitle: this.data.locale.warning,
          popupMsg: this.data.locale.headShotInfo,
          showPopup: true
        })
        return
      }

      if(stage === 5){
        var manualStr = "";
        if (ctx.data.form.one.manual_lang === "both") {
          manualStr = ctx.data.locale.engCn;
        } else if (ctx.data.form.one.manual_lang === "english") {
          manualStr = ctx.data.locale.english
        } else if (ctx.data.form.one.manual_lang === "mandarin") {
          manualStr = ctx.data.locale.mandarin
        }
        ctx.setData({
          manualStr: manualStr
        })
      }
      stage = stage + 1;
      this.setData({ stage: stage })
      this.processSectionTitleAndDescription();
    }
  },
  createMembership: function (out_trade_no , price){
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
        out_trade_no: out_trade_no || null,
        price: price,
        couponId: this.data.coupon ? this.data.coupon.id : null
      },
      success: regRes => {
        wx.hideLoading()

        // this.resetAndHideModal()
        wx.reLaunch({
          url: '/pages/into/into',
        })
        // ctx.setData({
        //   showPopupNegBtn: false,
        //   popupType: 'success',
        //   popupTitle: this.data.locale.allSet,
        //   popupMsg: this.data.locale.enrollMsg,
        //   showPopup: true
        // })
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
  },
  uploadPhoto(tempUrl){
    return new Promise(function (resolve, reject) {
      var url = urls.getUrl('UPLOAD') + "?type=others";
      wx.uploadFile({
        header: {
          Authorization: wx.getStorageSync('token')
        },
        url: url,
        filePath: tempUrl,
        name: 'file',
        success(res) {
          var d = JSON.parse(res.data)
          console.log(d)
          resolve(d.url)
        },
        fail(err) {
          resolve(err)
        }
      })
    })
  },
  allValuesEntered: function(stage , len){
    if (stage === 'five'){
      return true
    }
    if(len <= 0){
      return true;
    }
    const form = this.data.form[stage] || null;
    if(form === null){
      return false
    }
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
    this.setData({
      [f]: value
    })
    if (key === "one.manual_lang" && value === "both"){
      this.setData({
        showPopup: true,
        popupTitle: this.data.locale.info,
        popupMsg: this.data.locale.manualInfo,
        showPopupNegBtn: false,
        popupNegText: '',
        popupType: ''
      })
    }
  },
  onClickSectionBack: function(e){
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
      case 6:
        title = "legacyRegistrationDoneTitle";
        desc = "legacyRegistrationDoneDesc";  
        break;
    }
    this.setData({
      sectionTitle: this.data.locale[title],
      sectionDescription: this.data.locale[desc],
    })
  }
})