// components/textview/textview.js
Component({
  properties: {
    title : {
      type: String
    },
    key : {
      type: String
    }
  },
  data: {

  },
  methods: {
    onValueUpdated: function(e){
      this.triggerEvent('onTextViewUpdated', { key : this.properties.key, value: e.detail.value});
    }
  }
})
