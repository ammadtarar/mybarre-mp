// pages/orderDetail/orderDetail.js
const urls = require('../../utils/urls.js');

Page({

  /**
   * Page initial data
   */
  data: {
    locale: wx.getStorageSync('locale'),
    orderId : -1,
    isEnglish: true
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    const lang = wx.getStorageSync('lang');
    wx.setNavigationBarTitle({
      title: this.data.locale.orderDetail,
      isEnglish: lang === 'en' ? true : false
    })
    this.setData({
      orderId: options.id
    });
    this.getOrder(options.id);
  },
  goToDetail(e){
    wx.navigateTo({
      url: '/pages/productDetail/productDetail?productId=' + e.currentTarget.id,
    })
  },
  confirm: function(){
    const ctx = this;
    wx.showLoading();
    wx.request({
      url: urls.getUrl('UPDATE_ORDER').replace(":id", ctx.data.orderId),
      method: "POST",
      header: {
        Authorization: wx.getStorageSync('token')
      },
      data: { status: "completed" },
      success: res => {
        wx.hideLoading()
        wx.showToast()
        ctx.getOrder(ctx.data.orderId)
      },
      fail: err => {
        console.log(err)
        wx.hideLoading()
      }
    })
  },
  getOrder: function(id){
    const ctx = this;
    wx.showLoading()
    wx.request({
      url: urls.getUrl('ORDER_BY_ID').replace(':id' , id),
      header: {
        Authorization: wx.getStorageSync('token')
      },
      success: res => {
        var order = res.data.data;

        const status = order.status;
        if (status === 'pending_payment') {
          order.statusStr = ctx.data.locale.pending_payment;
        } else if (status === 'pending_dispatch') {
          order.statusStr = ctx.data.locale.pending_dispatch;
        } else if (status === 'dispatched') {
          order.statusStr = ctx.data.locale.dispatched;
        } else if (status === 'completed') {
          order.statusStr = ctx.data.locale.completed;
        } else {
          order.statusStr = ctx.data.locale.pending_payment;
        }
        ctx.setData({
          order: order
        })
        wx.hideLoading()
      },
      fail: err => {
        console.log(err)
        wx.hideLoading()
      }
    })
  },
  pay: function (e) {
    const order = this.data.order;
    var today = new Date();
    var out_trade_no = "MbStrOrd" + order.id + "" + today.getMilliseconds();
    const ctx = this;
    wx.showLoading({});
    var total = order.amount + (order.shipping_fee || 0.0);
    total = parseFloat(total).toFixed(2)
    wx.request({
      url: urls.getUrl('PAY'),
      method: "POST",
      header: {
        Authorization: wx.getStorageSync('token')
      },
      data: { orderCode: out_trade_no, money: total },
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
            ctx.updateOrderStatus(order.id, out_trade_no)
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
  updateOrderStatus: function (orderId, out_trade_no) {
    const ctx = this;
    wx.showLoading();
    wx.request({
      url: urls.getUrl('UPDATE_ORDER').replace(":id", orderId),
      method: "POST",
      header: {
        Authorization: wx.getStorageSync('token')
      },
      data: { out_trade_no: out_trade_no, status: "pending_dispatch" },
      success: res => {
        wx.hideLoading()
        wx.showToast()
        ctx.getOrder(orderId)
      },
      fail: err => {
        console.log(err)
        wx.hideLoading()
      }
    })
  }
})