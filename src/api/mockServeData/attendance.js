import Mock from 'mockjs'

// 初始考勤数据
const initialAttendanceList = [
    {
        id: 1,
        employeeId: 1,
        employeeName: 'Charles',
        departmentName: '技术部',
        date: '2024-03-15',
        checkIn: '09:00:00',
        checkOut: '18:00:00',
        status: '正常',
        note: ''
    },
    {
        id: 2,
        employeeId: 2,
        employeeName: 'Charles1',
        departmentName: '人事部',
        date: '2024-03-15',
        checkIn: '09:15:00',
        checkOut: '18:30:00',
        status: '迟到',
        note: '路上堵车'
    }
]

let attendanceList = JSON.parse(localStorage.getItem('attendanceList')) || initialAttendanceList
let nextId = parseInt(localStorage.getItem('attendanceNextId')) || attendanceList.length + 1

const saveToStorage = () => {
    localStorage.setItem('attendanceList', JSON.stringify(attendanceList))
    localStorage.setItem('attendanceNextId', nextId.toString())
}

export default {
    // 获取考勤列表
    getAttendanceList: config => {
        const { date, employeeId, status } = config.body ? JSON.parse(config.body) : {}
        let filteredList = [...attendanceList]

        if (date) {
            filteredList = filteredList.filter(item => item.date === date)
        }
        if (employeeId) {
            filteredList = filteredList.filter(item => item.employeeId === employeeId)
        }
        if (status) {
            filteredList = filteredList.filter(item => item.status === status)
        }

        return {
            code: 20000,
            data: {
                list: filteredList,
                total: filteredList.length
            }
        }
    },

    // 添加考勤记录
    addAttendance: config => {
        const { employeeId, employeeName, departmentName, date, checkIn, checkOut, status, note } = JSON.parse(config.body)
        const attendance = {
            id: nextId++,
            employeeId,
            employeeName,
            departmentName,
            date,
            checkIn,
            checkOut,
            status,
            note
        }
        attendanceList.push(attendance)
        saveToStorage()
        return {
            code: 20000,
            data: {
                message: '添加成功'
            }
        }
    },

    // 更新考勤记录
    updateAttendance: config => {
        const { id, checkIn, checkOut, status, note } = JSON.parse(config.body)
        const index = attendanceList.findIndex(item => item.id === id)
        if (index > -1) {
            attendanceList[index] = {
                ...attendanceList[index],
                checkIn,
                checkOut,
                status,
                note
            }
            saveToStorage()
        }
        return {
            code: 20000,
            data: {
                message: '更新成功'
            }
        }
    },

    // 删除考勤记录
    deleteAttendance: config => {
        const { id } = JSON.parse(config.body)
        const index = attendanceList.findIndex(item => item.id === id)
        if (index > -1) {
            attendanceList.splice(index, 1)
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