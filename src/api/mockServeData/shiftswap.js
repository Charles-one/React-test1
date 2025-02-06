import Mock from 'mockjs'

// 初始调休申请数据
const initialShiftSwapList = [
    {
        id: 1,
        employeeId: 1,
        employeeName: 'Charles',
        departmentName: '技术部',
        startTime: '2024-03-15 09:00:00',
        endTime: '2024-03-16 18:00:00',
        duration: 2,
        reason: '加班调休',
        overtimeDate: '2024-03-14',  // 关联的加班日期
        status: '待审批',
        approver: '张三',
        createTime: '2024-03-14 17:30:00',
        approveTime: null,
        approveRemark: null
    }
]

let shiftSwapList = JSON.parse(localStorage.getItem('shiftSwapList')) || initialShiftSwapList
let nextId = parseInt(localStorage.getItem('shiftSwapNextId')) || shiftSwapList.length + 1

const saveToStorage = () => {
    localStorage.setItem('shiftSwapList', JSON.stringify(shiftSwapList))
    localStorage.setItem('shiftSwapNextId', nextId.toString())
}

export default {
    // 获取调休申请列表
    getShiftSwapList: config => {
        const { employeeId, status, startDate, endDate } = config.body ? JSON.parse(config.body) : {}
        let filteredList = [...shiftSwapList]

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

    // 添加调休申请
    addShiftSwap: config => {
        const { employeeId, employeeName, departmentName, startTime, endTime, duration, reason, overtimeDate } = JSON.parse(config.body)
        const shiftSwap = {
            id: nextId++,
            employeeId,
            employeeName,
            departmentName,
            startTime,
            endTime,
            duration,
            reason,
            overtimeDate,
            status: '待审批',
            approver: '张三',
            createTime: new Date().toLocaleString(),
            approveTime: null,
            approveRemark: null
        }
        shiftSwapList.push(shiftSwap)
        saveToStorage()
        return {
            code: 20000,
            data: {
                message: '申请提交成功'
            }
        }
    },

    // 更新调休申请（审批）
    updateShiftSwap: config => {
        const { id, status, approveRemark } = JSON.parse(config.body)
        const index = shiftSwapList.findIndex(item => item.id === id)
        if (index > -1) {
            shiftSwapList[index] = {
                ...shiftSwapList[index],
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

    // 删除调休申请
    deleteShiftSwap: config => {
        const { id } = JSON.parse(config.body)
        const index = shiftSwapList.findIndex(item => item.id === id)
        if (index > -1) {
            shiftSwapList.splice(index, 1)
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