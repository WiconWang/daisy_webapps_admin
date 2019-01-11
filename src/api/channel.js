import axios from '@/libs/api.request'
/*添加*/
export const addChannel = (params) => {
  /* const data = {
    cid:params.cid,
    title:params.title,
    content:params.content
  } */
  return axios.request({
    url: '/channels',
    params,
    method: 'post'
  })
}
/*获取列表*/
export const getChannelList = () => {
  return axios.request({
    url: '/channels',
    params: {},
    method: 'get'
  })
}


/*修改*/
export const editChannel = (params,id) => {
  /* const data = {
    cid:params.cid,
    title:params.title,
    content:params.content
  } */
  return axios.request({
    url: '/channels/' + id,
    // params:params,
    params,
    method: 'put'
  })
}


export const getChannel = (id) => {
  return axios.request({
    url: '/channels/'+id,
    method: 'get'
  })
}


export const delChannel = (id) => {
  return axios.request({
    url: '/channels/'+id,
    method: 'delete'
  })
}

