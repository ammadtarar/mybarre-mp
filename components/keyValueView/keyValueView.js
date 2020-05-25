// components/keyValueView/keyValueView.js
String.prototype.replaceAll = function (str1, str2, ignore) {
  return this.replace(new RegExp(str1.replace(
    /([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, "\\$&"), (ignore ?
      "gi" : "g")), (typeof (str2) == "string") ? str2.replace(/\$/g, "$$$$") :
      str2);
}

Component({
  /**
   * Component properties
   */
  properties: {
    key : {
      type : String,
      value : '--'
    },
    value: {
      type: String,
      value: '--'
    },
    showInfoIcon:{
      type : Boolean,
      defaultValue : false
    },
    formatText:{
      type: Boolean,
      defaultValue: false
    },
    showWarning:{
      type: Boolean,
      defaultValue: false
    }
  },

  /**
   * Component initial data
   */
  data: {
    formattedValue : ""
  },

  /**
   * Component methods
   */
  methods: {
    
  },
  observers: {
    'value , formatText': function (value, formatText) {
      if (!this.data.formatted && formatText && (value !== undefined && value !== null && value !== "")){
        this.setData({ formattedValue: value.replaceAll("-", " ")})
      }
      
    }
  }
})
