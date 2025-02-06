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

// 员工管理相关接口
export const getEmployeeList = () => {
    return axios.request({
        url: '/employee/list',
        method: 'get'
    })
}

export const addEmployee = (data) => {
    return axios.request({
        url: '/employee/add',
        method: 'post',
        data
    })
}

export const updateEmployee = (data) => {
    return axios.request({
        url: '/employee/update',
        method: 'post',
        data
    })
}

export const deleteEmployee = (data) => {
    return axios.request({
        url: '/employee/delete',
        method: 'post',
        data
    })
}

// 考勤管理相关接口
export const getAttendanceList = (data) => {
    return axios.request({
        url: '/attendance/list',
        method: 'post',
        data
    })
}

export const addAttendance = (data) => {
    return axios.request({
        url: '/attendance/add',
        method: 'post',
        data
    })
}

export const updateAttendance = (data) => {
    return axios.request({
        url: '/attendance/update',
        method: 'post',
        data
    })
}

export const deleteAttendance = (data) => {
    return axios.request({
        url: '/attendance/delete',
        method: 'post',
        data
    })
}