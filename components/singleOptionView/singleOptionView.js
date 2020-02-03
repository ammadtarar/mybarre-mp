// components/singleOptionView/singleOptionView.js
Component({
  /**
   * Component properties
   */
  properties: {
    title: String,
    items : Array,
    key: String
  },

  /**
   * Component initial data
   */
  data: {
    index : 0
  },

  /**
   * Component methods
   */
  methods: {
    radioChange: function (e) {
      const val = e.detail.value;
      this.triggerEvent('onSingleOptionViewUpdated', { key: this.properties.key, value: this.properties.items[val].value });
    }
  }
})
