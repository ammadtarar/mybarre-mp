// components/bundleItem/bundleItem.js
Component({
  /**
   * Component properties
   */
  properties: {
    isPurchased : Boolean,
    json : Object
  },

  /**
   * Component initial data
   */
  data: {
    vidCount : 10,
    imgCount : 9,
    docsCount : 5
  },
  attached:function(){
    console.log(this.properties)
  },

  /**
   * Component methods
   */
  methods: {
    
  }
})
