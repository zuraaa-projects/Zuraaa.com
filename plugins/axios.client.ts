import { Plugin } from '@nuxt/types'

const axiosPlugin: Plugin = ({ $axios }) => {
  const token = localStorage.getItem('token')

  if (token != null) {
    $axios.setToken(token, 'Bearer')
  }
}

export default axiosPlugin
