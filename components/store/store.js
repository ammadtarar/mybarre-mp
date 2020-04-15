// components/store/store.js


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
    tabIndex: 0,
  },
  /**
   * Component methods
   */
  methods: {
    onTabSelected: function(e){
      this.setData({
        tabIndex: e.detail.tabIndex
      })
    }
  },
  attached: function () {
    this.setData({
      tabs: [
        this.data.locale.store_small,
        this.data.locale.cart,
        this.data.locale.orderHistory
      ]
    });
  },
})



