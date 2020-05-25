// pages/orderAddress/orderAddress.js
Page({

  /**
   * Page initial data
   */
  data: {
    locale: wx.getStorageSync('locale'),
    address: { insideShanghai: true },
    showPopup: false,
    popupNegText: "",
    showPopupNegBtn: "",
    popupTitle: "",
    popupMsg: "",
    preSelectedIndex: 0
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    var address = wx.getStorageSync("address");
    console.log(address)
    console.log(address.insideShanghai ? 0 : 1)
    this.setData({
      address : address,
      yesNoValues: [{ key: this.data.locale.yes, value: true }, { key: this.data.locale.no, value: false }],
      preSelectedIndex: address.insideShanghai ? 0 : 1
    })
    wx.setNavigationBarTitle({
      title: this.data.locale.enterAddress,
    })
  },
  onSingleOptionViewUpdated: function (e) {
    const key = e.detail.key;
    const value = e.detail.value;
    this.setData({
      ['address.insideShanghai']: value
    });
    console.log(this.data.address)
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
  onCnAddUpdated: function(e){
    this.setData({
      ['address.address_cn']: e.detail.value
    })
    console.log(this.data.address)
  },
  onTextViewUpdated: function (e) {
    const value = e.detail.value || "";
    const key = e.detail.key;
    this.setData({
      ['address.' + key]: value
    })
    console.log(this.data.address)
  },
  save: function(e){
    if (Object.keys(this.data.address).length < 6){
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