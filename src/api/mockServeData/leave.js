import Mock from 'mockjs'

// 初始请假申请数据
const initialLeaveList = [
    {
        id: 1,
        employeeId: 1,
        employeeName: 'Charles',
        departmentName: '技术部',
        startTime: '2025-01-01 09:00:00',
        endTime: '2025-01-02 18:00:00',
        duration: 2,
        type: '年假',
        reason: '个人事务',
        status: '待审批',
        approver: '张三',
        createTime: '2025-01-01 17:30:00',
        approveTime: null,
        approveRemark: null
    }
]

let leaveList = JSON.parse(localStorage.getItem('leaveList')) || initialLeaveList
let nextId = parseInt(localStorage.getItem('leaveNextId')) || leaveList.length + 1

const saveToStorage = () => {
    localStorage.setItem('leaveList', JSON.stringify(leaveList))
    localStorage.setItem('leaveNextId', nextId.toString())
}

export default {
    // 获取请假申请列表
    getLeaveList: config => {
        const { employeeId, status, startDate, endDate } = config.body ? JSON.parse(config.body) : {}
        let filteredList = [...leaveList]

        if (employeeId) {
            filteredList = filteredList.filter(item => item.employeeId === employeeId)
        }
        if (status) {
            filteredList = filteredList.filter(item => item.status === status)
        }
        if (startDate && endDate) {
            filteredList = filteredList.filter(item => {
                const itemDate = item.startTime.split(' ')[0]
                return itemDate >= startDate && itemDate <= endDate
            })
        }

        return {
            code: 20000,
            data: {
                list: filteredList,
                total: filteredList.length
            }
        }
    },

    // 添加请假申请
    addLeave: config => {
        const { employeeId, employeeName, departmentName, startTime, endTime, duration, type, reason } = JSON.parse(config.body)
        const leave = {
            id: nextId++,
            employeeId,
            employeeName,
            departmentName,
            startTime,
            endTime,
            duration,
            type,
            reason,
            status: '待审批',
            approver: '张三', // 这里可以根据实际情况设置审批人
            createTime: new Date().toLocaleString(),
            approveTime: null,
            approveRemark: null
        }
        leaveList.push(leave)
        saveToStorage()
        return {
            code: 20000,
            data: {
                message: '申请提交成功'
            }
        }
    },

    // 更新请假申请（审批）
    updateLeave: config => {
        const { id, status, approveRemark } = JSON.parse(config.body)
        const index = leaveList.findIndex(item => item.id === id)
        if (index > -1) {
            leaveList[index] = {
                ...leaveList[index],
                status,
                approveRemark,
                approveTime: new Date().toLocaleString()
            }
            saveToStorage()
        }
        return {
            code: 20000,
            data: {
                message: '审批成功'
            }
        }
    },

    // 删除请假申请
    deleteLeave: config => {
        const { id } = JSON.parse(config.body)
        const index = leaveList.findIndex(item => item.id === id)
        if (index > -1) {
            leaveList.splice(index, 1)
            saveToStorage()
        }
        return {
            code: 20000,
            data: {
                message: '删除成功'
            }
        }
    }
} 