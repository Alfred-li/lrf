import axios from 'axios'

const urlMap = {
  development: '/',
  production: '/apollo_support/'
}
export const baseUrl = urlMap[process.env.NODE_ENV]
const ERR_OK = 0

export function get(url) {
  return function(params = {}) {
    return axios.get(baseUrl + url, {
      params
    }).then((res) => {
      const {code, data} = res.data
      if (code === ERR_OK) {
        return data
      }
    }).catch((e) => {
    })
  }
}