// pages/checkout/checkout.js
const urls = require('../../utils/urls.js');
Page({

  /**
   * Page initial data
   */
  data: {
    locale: wx.getStorageSync('locale'),
    address : null,
    showPopup: false,
    popupNegText: "",
    showPopupNegBtn: "",
    popupTitle: "",
    popupMsg: "",
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.setData({
      address: wx.getStorageSync("address")
    })
    this.getCart();
    wx.setNavigationBarTitle({
      title: this.data.locale.checkout,
    })
  },
  onUpdateRemarks: function(e){
    this.setData({
      ['address.remarks']: e.detail.value
    })
  },
  onClickPopupPositiveButton: function () {
    if (this.data.popupType === 'orderSuccess'){
      this.resetAndHideModal()
      wx.navigateBack({});
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
  goToAddress: function(e){
    wx.navigateTo({
      url: '/pages/orderAddress/orderAddress',
    })
  },
  createOrder: function(e){
    var address = this.data.address || null;
    if(address === undefined || address === null){
      this.setData({
        showPopupNegBtn: false,
        popupType: 'warning',
        popupTitle: this.data.locale.warning,
        popupMsg: this.data.locale.selectAddress,
        showPopup: true
      })
      return
    }
    console.log(this.data.address);
    address.amount  = this.data.total;
    console.log("CREATE_ORDER");
    const ctx = this;
    wx.showLoading();
    wx.request({
      url: urls.getUrl('CREATE_ORDER'),
      method: "POST",
      header: {
        Authorization: wx.getStorageSync('token')
      },
      data: address,
      success: orderRes =>{
        console.log(orderRes);
        const orderId = orderRes.data.data.order.id;
        wx.hideLoading();
        ctx.initPayment(orderId, ctx.data.total);
      },
      fail : orderErr =>{
        wx.hideLoading();
        console.log(orderErr)
      }
    })
  },
  initPayment: function(orderNo , amount){
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
      data: { orderCode: out_trade_no, money: amount },
      success: res => {
        const payRes = res.data.data;
        wx.requestPayment({
          timeStamp: payRes.timeStamp,
          nonceStr: payRes.nonceStr,
          package: 'prepay_id=' + payRes.prepayId,
          signType: 'MD5',
          paySign: payRes.paySign,
          success:function(successRes){
            console.log("successRes")
            console.log(successRes)
            ctx.updateOrderStatus(orderNo , out_trade_no)
          },
          fail: function(payErr){
            console.log("payErr")
            console.log(payErr)
            wx.navigateBack({})
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
  updateOrderStatus: function (orderId, out_trade_no){
    const ctx = this;
    wx.showLoading();
    wx.request({
      url: urls.getUrl('UPDATE_ORDER').replace(":id", orderId),
      method: "POST",
      header: {
        Authorization: wx.getStorageSync('token')
      },
      data: { out_trade_no: out_trade_no, status: "pending_dispatch"},
      success: res =>{
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
  onShow: function () {
    this.setData({
      address: wx.getStorageSync("address")
    })
  },
  getCart: function (e) {
    const ctx = this;
    wx.showLoading({})
    wx.request({
      url: urls.getUrl('CART'),
      header: {
        Authorization: wx.getStorageSync('token')
      },
      success: res => {
        console.log(res.data.data)
        var items = res.data.data;
        var total = 0.00;
        items.forEach(function (item) {
          total = total + (item.count * item.product.price)
        })
        total = parseFloat(total).toFixed(2)
        ctx.setData({ items: items, total: total })
        wx.hideLoading()
      },
      fail: err => {
        console.log(err)
        wx.hideLoading()
      }
    })
  }
})