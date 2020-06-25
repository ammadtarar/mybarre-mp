// pages/bundleDetail/bundleDetail.js
const urls = require('../../utils/urls.js');
Page({

  /**
   * Page initial data
   */
  data: {
    locale: wx.getStorageSync('locale'),
    price: "¥ 0.00",
    videos: ['', '', '', '', ''],
    images: ['', '', '', '', ''],
    docs: ['', '', '', '', ''],
    bundle : null,
    buyable: false,
    showPopup: false,
    popupNegText: "",
    showPopupNegBtn: "",
    popupTitle : "",
    popupMsg : ""
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    if (options.type === 'mybundle'){
      this.setData({
        buyable : false,
      })
    }else{
      this.setData({
        buyable: true,
      })
    }
    this.getBundleDetail(options.id)
    wx.setNavigationBarTitle({
      title: this.data.locale.bundleDetail
    })
  },
  onClickLockedItem: function(){
    this.setData({
      showPopupNegBtn: false,
      popupType: 'buyFirst',
      popupTitle: this.data.locale.info,
      popupMsg: this.data.locale.buyFirst,
      showPopup: true
    })
  },
  onClickPopupPositiveButton: function(){
    if (this.data.popupType === 'buySuccess') {
      this.resetAndHideModal()
      wx.navigateBack({});
      return;
    }
    this.resetAndHideModal()
  },
  onClickPopupNegativeButton: function(){
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
  onMore: function (e) {
    if(this.data.buyable){
      this.setData({
        showPopupNegBtn: false,
        popupType: 'buyFirst',
        popupTitle: this.data.locale.info,
        popupMsg: this.data.locale.buyFirst,
        showPopup: true
      })
      return;
    }
    var type = e.currentTarget.id;
    var data = null
    if (type === 'vid') {
      data = JSON.stringify(this.data.videos);
    } else if (type === 'img') {
      data = JSON.stringify(this.data.images);
    } else {
      data = JSON.stringify(this.data.docs);
    }
    wx.navigateTo({
      url: '/pages/moreMedia/moreMedia?type=' + type + "&data=" + data,
    })
  },
  getBundleDetail: function(id){
    const ctx = this;
    wx.showLoading({})
    wx.request({
      url: urls.getUrl('BUNDLE_BY_ID').replace(":id" , id),
      header: {
        Authorization: wx.getStorageSync('token')
      },
      success: res => {
        var imgs = [];
        var vids = [];
        var docs = [];
        res.data.data.files.forEach(function (file) {
          if (file.mime.includes("image")) {
            imgs.push(file);
          } else if (file.mime.includes("video")) {
            vids.push(file);
          } else {
            docs.push(file);
          }
        });

        imgs.sort(function(a, b) {
          return a.index - b.index;
        });
        vids.sort(function(a, b) {
          return a.index - b.index;
        });
        docs.sort(function(a, b) {
          return a.index - b.index;
        });

        ctx.setData({
          bundle: res.data.data,
          videos: vids,
          images: imgs,
          docs: docs,
          price: "¥ " + res.data.data.price,
          expiry: wx.getStorageSync('membership_expiry')
        })
        wx.hideLoading()
      },
      fail: err => {
        wx.hideLoading()
      }
    })
  },
  onClickExpiry: function(){
    this.setData({
      showPopupNegBtn: false,
      popupType: 'showExpiry',
      popupTitle: this.data.locale.info,
      popupMsg: this.data.locale.bundleExpiryInfo,
      showPopup: true
    })
  },
  buyBundle: function(){
    var today = new Date();
    var out_trade_no = "MybUsr" + wx.getStorageSync("user_id") + "Bdl" + this.data.bundle.id + "Lc" + today.getMilliseconds();
    const ctx = this;
    wx.showLoading({})
    wx.request({
      url: urls.getUrl('PAY'),
      method: "POST",
      header: {
        Authorization: wx.getStorageSync('token')
      },
      data: { orderCode: out_trade_no, money: ctx.data.bundle.price },
      success: res => {
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
            ctx.addToUserBundle(out_trade_no, ctx.data.bundle.price)
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
  addToUserBundle: function(out_trade_no , price){
    wx.showLoading({})
    const ctx = this;
    wx.request({
      url: urls.getUrl('CREATE_USER_BUNDLE').replace(":id" , this.data.bundle.id),
      method: "POST",
      header: {
        Authorization: wx.getStorageSync('token')
      },
      data: { out_trade_no: out_trade_no, price: price },
      success: res => {
        wx.hideLoading()
        ctx.setData({
          showPopupNegBtn: false,
          popupType: 'buySuccess',
          popupTitle: this.data.locale.thankYou,
          popupMsg: this.data.locale.bundleBuySuccess,
          showPopup: true
        })
      },
      fail: err => {
        console.log(err)
        wx.hideLoading()
      }

    })
  }
})