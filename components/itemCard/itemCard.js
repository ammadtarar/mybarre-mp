// components/itemCard/itemCard.js
Component({
  /**
   * Component properties
   */
  properties: {
    type : {
      type : String,
      value : 'doc'
    },
    mimeType : {
      type : String,
      value : '--'
    },
    thumb : {
      type : String,
      value : null
    },
    title : {
      type : String,
      value : '--'
    },
    width : {
      type : Number,
      value : 125
    }
  },

  /**
   * Component initial data
   */
  data: {
    height : '125px'
  },

  /**
   * Component methods
   */
  methods: {
    
  },
  attached: function () { 
    var width = this.properties.width;
    var height = 1.44 * width;
    this.setData({height : height})
  }, 
  ready: function () {},

})
