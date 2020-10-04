// components/couponPopup/couponPopup.js
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
    showError: false,
    showModal : true,
    locale: wx.getStorageSync('locale'),
  },

  /**
   * Component methods
   */
  methods: {
    redeemCode: function(){
      const ctx = this;
      if(!this.data.code){
        this.setData({
          msg: this.data.locale.enterCodeMsg,
          showError : true
        })
        return
      }
      wx.showLoading()
      wx.request({
        url: urls.getUrl('COUPON_CHECK') + "?code=" + this.data.code,
        method: "POST",
        header: {
          Authorization: wx.getStorageSync('token')
        },
        success(res){
          wx.hideLoading()
          const code = res.data.code;
          if(code === 404){
            const msg = res.data.message;
            ctx.setData({
              msg: ctx.data.locale.codeNotFound,
              showError: true
            })
            return;
          }

          if (code === 403 || code === 402) {
            ctx.setData({
              msg: ctx.data.locale.codeExpired,
              showError: true
            })
            return;
          }
          ctx.setData({ showModal: false })
          ctx.triggerEvent('onCodeAccepted', { coupon: res.data.data });
          
        },
        fail(error){
          console.log("error")
          console.log(error)
          wx.hideLoading()
        }
      })
    },
    hideModal: function(e){
      this.setData({ showModal: false })
      this.triggerEvent('onDismissRedeemPopup', { visible: false });
    },
    onTextViewUpdated: function (e) {
      const key = e.detail.key;
      const value = e.detail.value;
      var f = 'certificate.' + key;
      this.setData({
        [key]: value,
        showError: false
      })
      
    },
  }
})
