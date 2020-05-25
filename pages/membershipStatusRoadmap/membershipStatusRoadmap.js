// pages/membershipStatusRoadmap/membershipStatusRoadmap.js
const locale = wx.getStorageSync('locale');
Page({
  data: {
    locale: locale,
    statues: [{
        status: 'pre-instructor',
        title: 'Pre Course Instructor',
        detail: locale.pi_desc
      },
      // { status: 'pre-instructor-tbc', title: 'Pre Instructor Tbc', detail: locale.pit_desc },
      {
        status: 'instructor-in-training',
        title: 'Instructor In Training',
        detail: locale.iit_desc
      }, {
        status: 'training-videos-submitted',
        title: 'Training Videos Submitted',
        detail: locale.tvs_desc
      }, {
        status: 'exam-passed',
        title: 'Exam Passed',
        detail: locale.ep_desc
      }, {
        status: 'exam-failed',
        title: 'Exam Failed',
        detail: locale.ef_desc
      }, {
        status: 'license-fee-paid',
        title: 'License Fee Paid',
        detail: locale.lfp_desc
      }, {
        status: 'licensed-instructor',
        title: 'Licensed Instructor',
        detail: locale.lt_desc
      }
    ]
  },
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: this.data.locale.trainingRoadmap,
    })
    this.setData({
      currentStatus: options.status
    })
  },
})
