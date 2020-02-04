// components/tab/tab.js
Component({
  /**
   * Component properties
   */
  properties: {
    title : String,
  },

  /**
   * Component initial data
   */
  data: {
    isActive: false
  },

  /**
   * Component methods
   */
  methods: {
    activate: function(){
      this.setData({ isActive : true})
    },
    deactivate: function(){
      this.setData({ isActive: false })
    }
  }
})
