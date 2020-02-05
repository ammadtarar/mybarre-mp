// pages/home/home.js
Page({

  /**
   * Page initial data
   */
  data: {
    locale: wx.getStorageSync('locale'),
    index : 1
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: 'MYBARRE'
    });
    this.selectComponent("#tabOne").activate()
  },
  onClickTab: function(e){
    var id = e.currentTarget.id;
    var tabOne = this.selectComponent("#tabOne");
    var tabTwo = this.selectComponent("#tabTwo");
    var tabThree = this.selectComponent("#tabThree");
    var tabFour = this.selectComponent("#tabFour")
    tabOne.deactivate();
    tabTwo.deactivate();
    tabThree.deactivate();
    tabFour.deactivate();
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