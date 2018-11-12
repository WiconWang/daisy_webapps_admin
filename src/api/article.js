import axios from '@/libs/api.request'

export const addArticle = (params) => {
  /* const data = {
    cid:params.cid,
    title:params.title,
    content:params.content
  } */
  return axios.request({
    url: '/article',
    params,
    method: 'post'
  })
}

export const getArticleList = (page, pageSize) => {
  const data = {
    page: page,
    pagesize: pageSize
  }
  return axios.request({
    url: '/article',
    params: data,
    method: 'get'
  })
}

export const getArticleInfo = (id) => {
  return axios.request({
    url: '/article/' + id,
    method: 'get'
  })
}

export const editArticle = (params) => {
  /* const data = {
    cid:params.cid,
    title:params.title,
    content:params.content
  } */
  return axios.request({
    url: '/article/' + params.id,
    // params:params,
    params,
    method: 'put'
  })
}

export const delArticle = (id) => {
  /* const data = {
    cid:params.cid,
    title:params.title,
    content:params.content
  } */
  return axios.request({
    url: '/article/' + id,
    method: 'delete'
  })
}
