import axios from '@/libs/api.request'
// 本站前台 用户

export const getUserList = (page,pagesize) => {
  const data = {
    page:page,
    pagesize:pagesize
  }
  return axios.request({
    url: '/users/info',
    params: data,
    method: 'get'
  })
}

export const getUserInfo = (id) => {
  return axios.request({
    url: '/users/info/'+id,
    method: 'get'
  })
}
export const createUserInfo = (data) => {
  return axios.request({
    url: '/users/info',
    data,
    method: 'post'
  })
}

export const updateUserInfo = (data,id) => {
  return axios.request({
    url: '/users/info/'+id,
    data,
    method: 'put'
  })
}



export const delUserInfo = (id) => {
  return axios.request({
    url: '/users/info/'+id,
    method: 'delete'
  })
}



export const saveUserStatus = (id,status) => {
  const data = {
    status: status
  }
  return axios.request({
    url: '/users/status/'+id,
    data,
    method: 'patch'
  })
}




