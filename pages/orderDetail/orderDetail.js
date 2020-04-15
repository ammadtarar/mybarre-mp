// pages/orderDetail/orderDetail.js
const urls = require('../../utils/urls.js');

Page({

  /**
   * Page initial data
   */
  data: {
    locale: wx.getStorageSync('locale')
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: this.data.locale.orderDetail,
    })
    this.getOrder(options.id)
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
    wx.showLoading({})
    wx.request({
      url: urls.getUrl('PAY'),
      method: "POST",
      header: {
        Authorization: wx.getStorageSync('token')
      },
      data: { orderCode: out_trade_no, money: order.amount },
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