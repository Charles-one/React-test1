import Mock from 'mockjs'

// 初始加班申请数据
const initialOvertimeList = [
    {
        id: 1,
        employeeId: 1,
        employeeName: '张小明',
        departmentName: '技术部',
        startTime: '2024-03-15 18:00:00',
        endTime: '2024-03-15 21:00:00',
        duration: 3,
        reason: '项目紧急，需要加班处理',
        status: '待审批',
        approver: '张三',
        createTime: '2024-03-15 17:30:00',
        approveTime: null,
        approveRemark: null
    }
]

let overtimeList = JSON.parse(localStorage.getItem('overtimeList')) || initialOvertimeList
let nextId = parseInt(localStorage.getItem('overtimeNextId')) || overtimeList.length + 1

const saveToStorage = () => {
    localStorage.setItem('overtimeList', JSON.stringify(overtimeList))
    localStorage.setItem('overtimeNextId', nextId.toString())
}

export default {
    // 获取加班申请列表
    getOvertimeList: config => {
        const { employeeId, status, startDate, endDate } = config.body ? JSON.parse(config.body) : {}
        let filteredList = [...overtimeList]

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

    // 添加加班申请
    addOvertime: config => {
        const { employeeId, employeeName, departmentName, startTime, endTime, duration, reason } = JSON.parse(config.body)
        const overtime = {
            id: nextId++,
            employeeId,
            employeeName,
            departmentName,
            startTime,
            endTime,
            duration,
            reason,
            status: '待审批',
            approver: '张三', // 这里可以根据实际情况设置审批人
            createTime: new Date().toLocaleString(),
            approveTime: null,
            approveRemark: null
        }
        overtimeList.push(overtime)
        saveToStorage()
        return {
            code: 20000,
            data: {
                message: '申请提交成功'
            }
        }
    },

    // 更新加班申请（审批）
    updateOvertime: config => {
        const { id, status, approveRemark } = JSON.parse(config.body)
        const index = overtimeList.findIndex(item => item.id === id)
        if (index > -1) {
            overtimeList[index] = {
                ...overtimeList[index],
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

    // 删除加班申请
    deleteOvertime: config => {
        const { id } = JSON.parse(config.body)
        const index = overtimeList.findIndex(item => item.id === id)
        if (index > -1) {
            overtimeList.splice(index, 1)
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