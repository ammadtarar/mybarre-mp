// components/tabBar/tabBar.js
Component({
  /**
   * Component properties
   */
  properties: {
    tabs : {
      type : Array,
      value : []
    }
  },

  /**
   * Component initial data
   */
  data: {
    tabIndex : 0
  },

  /**
   * Component methods
   */
  methods: {
    onClick: function(e){
      var id = parseInt(e.currentTarget.id);
      this.setData({tabIndex : id})
      this.triggerEvent('onTabSelected', { tabIndex: id });

    }
  }
})
