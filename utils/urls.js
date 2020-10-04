const baseUrl = "http://localhost:3001/"
// const baseUrl = "http://192.168.101.8:3001/"
// const baseUrl = "https://api-staging.mybarrefitness.com/"
// const baseUrl = "https://api.mybarrefitness.com/"

let urls = {
  REGISTER: 'user/mp/register',
  LOGIN_BY_OPEN_ID: 'user/mp/login/by/openid',
  UPDATE_PROFILE: 'user/update',
  BUNDLE_BY_ID: 'bundle/:id',
  STORE_LIST: "store/products/list/all",
  ADD_TO_CART: "user/cart/add/product/:id",
  CART: "user/cart",
  REDUCE_CART_COUNT: "user/cart/reduct/product/:id",
  PAY: 'pay',
  CREATE_ORDER: 'order/create',
  UPDATE_ORDER: 'order/:id/update/status',
  ORDERS_LIST: 'order/list/all',
  COURSES_LIST: 'course/list/all',
  COURSE_BY_ID : 'course/:id',
  ORDER_BY_ID: 'order/:id',
  CREATE_MEMBERSHIP: 'membership/create',
  MY_MEMBERSHIP: 'user/my/membership',
  UPDATE_LICENSE_OUT_TRADE_NUMBER: 'user/membership/:id/add/license/out_trade_no',
  COURSE_CHECK_IN: 'user/course/:id/checkin',
  CE_STORE: "ce/store/list/all",
  USER_BUNDLES: "user/ce/list/all",
  BUNDLE_BY_ID: "bundle/:id",
  CREATE_USER_BUNDLE: "user/add/bundle/:id",
  UPLOAD: "file/upload",
  COUPON_CHECK: "coupon/check",
  CONFIGS: "configs",
  PRODUCT_BY_ID: "store/product/:id",
  LEGACY_COURSE : "course/legacy",
  RENEW_LICENSE : "user/license/renew"
}

function getUrl (key){
  return baseUrl + urls[key]
};

module.exports = {
  getUrl: getUrl,
  baseUrl: baseUrl
}