import axios from '@/libs/api.request'
// 本站前台 用户

export const getMemberList = (page,pagesize) => {
  const data = {
    page:page,
    pagesize:pagesize
  }
  return axios.request({
    url: '/users/members',
    params: data,
    method: 'get'
  })
}

export const getMemberInfo = (id) => {
  return axios.request({
    url: '/users/members/'+id,
    method: 'get'
  })
}
export const createMemberInfo = (data) => {
  return axios.request({
    url: '/users/members',
    data,
    method: 'post'
  })
}

export const updateMemberInfo = (data,id) => {
  return axios.request({
    url: '/users/members/'+id,
    data,
    method: 'put'
  })
}



export const delMemberInfo = (id) => {
  return axios.request({
    url: '/users/members/'+id,
    method: 'delete'
  })
}



export const saveMemberStatus = (id,status) => {
  const data = {
    status: status
  }
  return axios.request({
    url: '/users/status/members/'+id,
    data,
    method: 'patch'
  })
}




