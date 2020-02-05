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
    items: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'],
    cols: 2
  },
  /**
   * Component methods
   */
  methods: {
    goToOrders: function(e){
      wx.navigateTo({
        url: '/pages/orders/orders',
      })
    }
  },
  attached: function () {
    let columns = []
    let mid = Math.ceil(this.data.items.length / this.data.cols)
    console.log(mid)
    for (let col = 0; col < this.data.cols; col++) {
      columns.push(this.data.items.slice(col * mid, col * mid + mid))
    }
    console.log(columns)
    this.setData({ columns: columns});
  },
})
