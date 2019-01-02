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
export const getChannelList = (page, pageSize) => {
  const data = {
    page: page,
    pagesize: pageSize
  }
  return axios.request({
    url: '/channels',
    params: data,
    method: 'get'
  })
}


/*修改*/
export const editChannel = (params) => {
  /* const data = {
    cid:params.cid,
    title:params.title,
    content:params.content
  } */
  return axios.request({
    url: '/channels/' + params.id,
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
