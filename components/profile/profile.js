// components/profile/profile.js
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
    notifications: [
      {
        text: 'This is first notification',
        isNew: true
      },
      {
        text: 'This is second notification',
        isNew: false
      },
      {
        text: 'This is third notification',
        isNew: false
      },
      {
        text: 'This is first notification',
        isNew: true
      },
      {
        text: 'This is second notification',
        isNew: false
      },
      {
        text: 'This is third notification',
        isNew: false
      }
      ]
  },

  /**
   * Component methods
   */
  methods: {

  }
})
