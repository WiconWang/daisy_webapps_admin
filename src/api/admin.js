import axios from '@/libs/api.request'
// 本站前台 用户

export const getAdminList = (page,pagesize) => {
  const data = {
    page:page,
    pagesize:pagesize
  }
  return axios.request({
    url: '/users/admins',
    params: data,
    method: 'get'
  })
}

export const getAdminInfo = (id) => {
  return axios.request({
    url: '/users/admins/'+id,
    method: 'get'
  })
}
export const createAdminInfo = (data) => {
  return axios.request({
    url: '/users/admins',
    data,
    method: 'post'
  })
}

export const updateAdminInfo = (data,id) => {
  return axios.request({
    url: '/users/admins/'+id,
    data,
    method: 'put'
  })
}



export const delAdminInfo = (id) => {
  return axios.request({
    url: '/users/admins/'+id,
    method: 'delete'
  })
}



export const saveAdminStatus = (id,status) => {
  const data = {
    status: status
  }
  return axios.request({
    url: '/users/status/admins/'+id,
    data,
    method: 'patch'
  })
}




