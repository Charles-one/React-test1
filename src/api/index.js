import axios from './axios'

export const getMenu = (param) => {
    return axios.request({
        url: '/permission/getMenu',
        method: 'post',
        data: param
    })
}

export const getData = () => {
    return axios.request({
        url: '/home/getData',
        method: 'get'
    })
}

export const getUser = (params) => {
    return axios.request({
        url: '/user/getUser',
        method: 'get',
        params
    })
}

export const addUser = (data) => {
    return axios.request({
        url: '/user/add',
        method: 'post',
        data
    })
}

export const editUser = (data) => {
    return axios.request({
        url: '/user/edit',
        method: 'post',
        data
    })
}

export const deleteUser = (data) => {
    return axios.request({
        url: '/user/del',
        method: 'post',
        data
    })
}

// 部门管理相关接口
export const getDepartmentList = () => {
    return axios.request({
        url: '/department/list',
        method: 'get'
    })
}

export const addDepartment = (data) => {
    return axios.request({
        url: '/department/add',
        method: 'post',
        data
    })
}

export const updateDepartment = (data) => {
    return axios.request({
        url: '/department/update',
        method: 'post',
        data
    })
}

export const deleteDepartment = (data) => {
    return axios.request({
        url: '/department/delete',
        method: 'post',
        data
    })
}