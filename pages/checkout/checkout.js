// pages/checkout/checkout.js
const urls = require('../../utils/urls.js');
Page({

  /**
   * Page initial data
   */
  data: {
    locale: wx.getStorageSync('locale'),
    address: null,
    showPopup: false,
    popupNegText: "",
    showPopupNegBtn: "",
    popupTitle: "",
    popupMsg: "",
    isEnglish: true,
    shippingFee : 0
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function(options) {
    const lang = wx.getStorageSync('lang');
    this.setData({
      address: wx.getStorageSync("address"),
      isEnglish: lang === 'en' ? true : false
    });
    this.getTariffs();
    wx.setNavigationBarTitle({
      title: this.data.locale.checkout,
    })
  },
  onUpdateRemarks: function(e) {
    this.setData({
      ['address.remarks']: e.detail.value
    })
  },
  onClickPopupPositiveButton: function() {
    if (this.data.popupType === 'orderSuccess') {
      this.resetAndHideModal()
      wx.navigateBack({});
      return;
    }
    this.resetAndHideModal()
  },
  onClickPopupNegativeButton: function() {
    this.resetAndHideModal()
  },
  resetAndHideModal: function() {
    this.setData({
      showPopup: false,
      popupTitle: '',
      popupMsg: '',
      showPopupNegBtn: false,
      popupNegText: '',
      popupType: ''
    })
  },
  goToAddress: function(e) {
    wx.navigateTo({
      url: '/pages/orderAddress/orderAddress',
    })
  },
  createOrder: function(e) {
    var address = this.data.address || null;
    if (address === undefined || address === null) {
      this.setData({
        showPopupNegBtn: false,
        popupType: 'warning',
        popupTitle: this.data.locale.warning,
        popupMsg: this.data.locale.selectAddress,
        showPopup: true
      })
      return
    }
    address.amount = this.data.total;
    address.shipping_fee = this.data.shippingFee
    const ctx = this;
    wx.showLoading();
    wx.request({
      url: urls.getUrl('CREATE_ORDER'),
      method: "POST",
      header: {
        Authorization: wx.getStorageSync('token')
      },
      data: address,
      success: orderRes => {
        const orderId = orderRes.data.data.order.id;
        wx.hideLoading();
        ctx.initPayment(orderId, ctx.data.total + ctx.data.shippingFee);
      },
      fail: orderErr => {
        wx.hideLoading();
        console.log(orderErr)
      }
    })
  },
  getTariffs: function() {
    const ctx = this;
    wx.request({
      url: urls.getUrl('CONFIGS'),
      header: {
        Authorization: wx.getStorageSync('token')
      },
      success: function (res) {
        console.log("configs")
        console.log(res.data.data)
        var outside_tariff = res.data.data.outside_shanghai_parcel_tariff || 30;
        var inside_tariff = res.data.data.shanghai_parcel_tariff || 15;
        ctx.setData({
          outside_tariff: outside_tariff,
          inside_tariff: inside_tariff,
          shippingFee: ctx.data.address ? (ctx.data.address.insideShanghai ? inside_tariff : outside_tariff) : inside_tariff
        })
        ctx.getCart();
      },
      fail: function (e) {
        console.log(e)
      }
    })

  },
  initPayment: function(orderNo, amount) {
    var today = new Date();
    var out_trade_no = "MbStrOrd" + orderNo + "" + today.getMilliseconds();
    const ctx = this;
    wx.showLoading({})
    wx.request({
      url: urls.getUrl('PAY'),
      method: "POST",
      header: {
        Authorization: wx.getStorageSync('token')
      },
      data: {
        orderCode: out_trade_no,
        money: parseFloat(amount).toFixed(2)
      },
      success: res => {
        const payRes = res.data.data;
        wx.requestPayment({
          timeStamp: payRes.timeStamp,
          nonceStr: payRes.nonceStr,
          package: 'prepay_id=' + payRes.prepayId,
          signType: 'MD5',
          paySign: payRes.paySign,
          success: function(successRes) {
            ctx.updateOrderStatus(orderNo, out_trade_no)
          },
          fail: function(payErr) {
            console.log("payErr")
            console.log(payErr)
            wx.navigateBack({})
          }
        })
        wx.hideLoading()
      },
      fail: err => {
        console.log(err)
        wx.hideLoading()
      }

    })
  },
  updateOrderStatus: function(orderId, out_trade_no) {
    const ctx = this;
    wx.showLoading();
    wx.request({
      url: urls.getUrl('UPDATE_ORDER').replace(":id", orderId),
      method: "POST",
      header: {
        Authorization: wx.getStorageSync('token')
      },
      data: {
        out_trade_no: out_trade_no,
        status: "pending_dispatch"
      },
      success: res => {
        wx.hideLoading()
        ctx.setData({
          showPopupNegBtn: false,
          popupType: 'orderSuccess',
          popupTitle: this.data.locale.thankYou,
          popupMsg: this.data.locale.orderPlaced,
          showPopup: true
        })
      },
      fail: err => {
        console.log(err)
        wx.hideLoading()
      }
    })
  },
  onShow: function() {
    this.setData({
      address: wx.getStorageSync("address")
    })
    this.getTariffs();
  },
  getCart: function(e) {
    const ctx = this;
    wx.showLoading({})
    wx.request({
      url: urls.getUrl('CART'),
      header: {
        Authorization: wx.getStorageSync('token')
      },
      success: res => {
        var items = res.data.data;
        var total = 0.00;
        items.forEach(function(item) {
          total = total + (item.count * item.product.price)
        })
        total = total + ctx.data.shippingFee;
        total = parseFloat(total).toFixed(2)
        ctx.setData({
          items: items,
          total: total
        })
        wx.hideLoading()
      },
      fail: err => {
        console.log(err)
        wx.hideLoading()
      }
    })
  }
})