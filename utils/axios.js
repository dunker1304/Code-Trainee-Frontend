import axios from 'axios'
import dynamic from 'next/dynamic'

import  { getCookie }from "../helpers/utils"

const httpAuth = axios.create({
    baseURL: process.env.API,
    // Add header or another config here
    headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' +  getCookie('access_token')
    },
    withCredentials : true
})

httpAuth.interceptors.response.use((response) => {
    // Do something with response data
    return response
}, (error) => {
    // Do something with response error
    // return Promise.reject(error)
    // let code = parseInt(error.response && error.response.status)
    // if (code === 401) {
    //     return authService.logout()
    // } else if (code === 403) {
    //     return authService.access_denied()
    // }
     return Promise.reject(error)
})

export default httpAuth
