// components/textview/textview.js
const date = new Date()
const years = []
const months = []
const days = []

for (let i = 1900; i <= date.getFullYear(); i++) {
  years.push(i)
}

for (let i = 1; i <= 12; i++) {
  months.push(i)
}

for (let i = 1; i <= 31; i++) {
  days.push(i)
}

Component({
  properties: {
    title : {
      type: String
    },
    key : {
      type: String
    },
    val : {
      type: String
    },
    type : {
      type: String
    },
    info: {
      type: String
    }
  },
  data: {
    locale: wx.getStorageSync('locale'),
    years: years,
    year: date.getFullYear(),
    months: months,
    month: date.getMonth(),
    days: days,
    day: date.getDay(),
    value: [9999, 1, 1],
    showPicker: false
  },
  methods: {
    closePicker: function(){
      this.setData({
        showPicker : false
      })
    },
    onValueUpdated: function(e){
      this.triggerEvent('onTextViewUpdated', { key : this.properties.key, value: e.detail.value});
    },
    onClickInput: function(){
      this.setData({
        showPicker : true
      })
    },
    onSave: function(){
      this.triggerEvent('onTextViewUpdated', {
        key: this.properties.key,
        value: this.data.year + "/" + this.data.month + "/" + this.data.day
      });
      this.setData({
        showPicker : false
      })
    },
    bindChange: function (e) {
      const val = e.detail.value
      const year = this.data.years[val[0]];
      const month = this.data.months[val[1]];
      const day = this.data.days[val[2]];
      this.setData({
        year: this.data.years[val[0]],
        month: this.data.months[val[1]],
        day: this.data.days[val[2]]
      })
      
    }
  }
})
