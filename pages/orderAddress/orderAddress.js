// pages/orderAddress/orderAddress.js
Page({

  /**
   * Page initial data
   */
  data: {
    locale: wx.getStorageSync('locale'),
    address : {},
    showPopup: false,
    popupNegText: "",
    showPopupNegBtn: "",
    popupTitle: "",
    popupMsg: ""
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    var address = wx.getStorageSync("address");
    this.setData({
      address : address
    })
    wx.setNavigationBarTitle({
      title: this.data.locale.enterAddress,
    })
  },
  onClickPopupPositiveButton: function () {
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
  onTextViewUpdated: function (e) {
    const value = e.detail.value || "";
    const key = e.detail.key;
    this.setData({
      ['address.' + key]: value
    })
  },
  save: function(e){
    if (Object.keys(this.data.address).length < 5){
      this.setData({
        showPopupNegBtn: false,
        popupType: 'warning',
        popupTitle: this.data.locale.warning,
        popupMsg: this.data.locale.fillAllFields,
        showPopup: true
      })
      return;
    }
    wx.setStorageSync("address", this.data.address)    
    wx.navigateBack({})
    
  }
})