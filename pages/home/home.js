// pages/home/home.js
Page({

  /**
   * Page initial data
   */
  data: {
    locale: wx.getStorageSync('locale'),
    index : 1,
    diff : 0
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.setData({
      production_ready : wx.getStorageSync('production_ready')
    });
    wx.hideHomeButton();
    const ctx = this;
    wx.getSystemInfo({
      success: function (res) {
        var diff = res.safeArea.bottom - res.safeArea.height;
        if (diff > 20) {
          ctx.setData({ diff: diff - 20})
        }
      }
    });
    wx.setNavigationBarTitle({
      title: 'MYbarre'
    });
    this.selectComponent("#tabOne").activate()
  },
  onShowCart: function(e){
    this.setData({showCart : true})
  },
  onCloseCart: function(e){
    this.setData({ showCart: false })
  },
  onClickPopupPositiveButton: function(e){
    this.setData({
      showRestrictedPopup: false
    })
  },
  onClickTab: function(e){
    var id = e.currentTarget.id;
    const membership_status = wx.getStorageSync('membership_status');
    if (id === "tabThree" && (membership_status !== "license-fee-paid" && membership_status !== "licensed-instructor")){
      this.setData({
        showRestrictedPopup : true
      })
      return;
    }
    var tabOne = this.selectComponent("#tabOne");
    var tabFour = this.selectComponent("#tabFour")
    tabOne.deactivate();
    tabFour.deactivate();
    
    var tabTwo , tabThree;
    
    if(this.data.production_ready){
      tabTwo = this.selectComponent("#tabTwo");
      tabThree = this.selectComponent("#tabThree");
      tabTwo.deactivate();
      tabThree.deactivate();
    }
    
    
    if (id === "tabOne"){
      tabOne.activate();
      this.setData({index : 1})
    } else if (id === "tabTwo") {
      tabTwo.activate();
      this.setData({ index: 2 })
    } else if (id === "tabThree") {
      tabThree.activate();
      this.setData({ index: 3 })
    } else if (id === "tabFour") {
      tabFour.activate();
      this.setData({ index: 4 })
    } 

  }
})