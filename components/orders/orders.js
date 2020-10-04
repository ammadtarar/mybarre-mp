// components/orders/orders.js
const urls = require('../../utils/urls.js');

Component({
  /**
   * Component properties
   */
  properties: {

  },

  /**
   * Component initial data
   */
  data: {
    locale: wx.getStorageSync('locale'),
    orders: []
  },

  /**
   * Component methods
   */
  methods: {
    onClickOrder: function(e){
      const id = e.currentTarget.id;
      wx.navigateTo({
        url: '/pages/orderDetail/orderDetail?id=' + id,
      })
    },
    getStatus: function(status){
      var newStatus = status.replace("_" , " ")
      return newStatus
    },
    getOrders : function(){
      const ctx = this;
      wx.showLoading()
      wx.request({
        url: urls.getUrl('ORDERS_LIST'),
        header: {
          Authorization: wx.getStorageSync('token')
        },
        success: res =>{
          var orders = res.data.data.rows;
          orders.forEach(function(order){
            const status = order.status;
            if (status === 'pending_payment'){
              order.statusStr = ctx.data.locale.pending_payment;
            } else if (status === 'pending_dispatch') {
              order.statusStr = ctx.data.locale.pending_dispatch;
            } else if (status === 'dispatched') {
              order.statusStr = ctx.data.locale.dispatched;
            } else if (status === 'completed') {
              order.statusStr = ctx.data.locale.completed;
            }else{
              order.statusStr = ctx.data.locale.pending_payment;
            }
          })
          ctx.setData({
            orders: orders
          })
          wx.hideLoading()
        },
        fail: err =>{
          wx.hideLoading()
        }
      })
    },
    pay: function(e){
      var index = e.currentTarget.id;
      const order = this.data.orders[index];
      

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
              ctx.updateOrderStatus(order.id, out_trade_no)
            },
            fail: function (payErr) {
            }
          })
          wx.hideLoading()
        },
        fail: err => {
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
          ctx.getOrders()
        },
        fail: err => {
          wx.hideLoading()
        }
      })
    }
  },
  attached: function () {
    this.getOrders();
  },
})
