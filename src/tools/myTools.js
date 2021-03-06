import axios from 'axios'

let myTools = {
  //axios默认实例
  axiosInstance: axios.create({
    //baseURL: 'http://local.mengchen-sz.cn',
    baseURL: 'http://mengchen_sz.work',
    // baseURL: 'http://hzhtnew-phone-test.max78.com',
    // baseURL: 'http://hzhtnew-test.max78.com',
    timeout: 10000,                          //超时时间
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
    validateStatus: function (status) {
      return status === 200 || status === 422 || status === 401
    },
    withCredentials: true,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }),

  //处理laravel返回的消息，并用toastr提示
  msgResolver: function (res, toastr) {
    if (res.status === 422) {
      return toastr.message(JSON.stringify(res.data), 'error')
    }
    if (res.data.error) {
      return toastr.message(res.data.error, 'error')
    }
    if (res.data.info) {
      return toastr.message(res.data.info, 'info')
    }
    if (res.data.message) {
      return toastr.message(res.data.message)
    }
    return true
  },

  //获取get请求参数
  getQueryString: function (name) {
    let reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)")
    let r = window.location.search.substr(1).match(reg)

    if (r !== null) {
      return decodeURIComponent(r[2])
    }

    return null
  },
}

window.alert = function(name){
  let iframe = document.createElement("IFRAME");
  iframe.style.display="none";
  iframe.setAttribute("src", 'data:text/plain,');
  document.documentElement.appendChild(iframe);
  window.frames[0].window.alert(name);
  iframe.parentNode.removeChild(iframe);
}

export { myTools }
export default myTools
