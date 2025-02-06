import Mock from 'mockjs'

// 初始员工数据
const initialEmployeeList = [
    {
        id: 1,
        name: 'Charles',
        age: 28,
        gender: '男',
        phone: '13812345678',
        departmentId: 1, // 关联部门ID
        departmentName: '技术部', // 部门名称
        position: '开发工程师',
        status: '在职',
        createTime: '2025-01-01 09:00:00'
    },
    {
        id: 2,
        name: 'Charles1',
        age: 26,
        gender: '女',
        phone: '13912345678',
        departmentId: 2,
        departmentName: '人事部',
        position: 'HR专员',
        status: '在职',
        createTime: '2025-01-01 09:00:00'
    }
]

let employeeList = JSON.parse(localStorage.getItem('employeeList')) || initialEmployeeList
let nextId = parseInt(localStorage.getItem('employeeNextId')) || employeeList.length + 1

const saveToStorage = () => {
    localStorage.setItem('employeeList', JSON.stringify(employeeList))
    localStorage.setItem('employeeNextId', nextId.toString())
}

// 更新部门人数
const updateDepartmentCount = () => {
    const departmentList = JSON.parse(localStorage.getItem('departmentList')) || []
    if (departmentList) {
        // 重置所有部门人数为0
        departmentList.forEach(dept => {
            dept.memberCount = 0
        })

        // 计算每个部门的在职人数
        employeeList.forEach(emp => {
            if (emp.status === '在职') {  // 只统计在职员工
                const department = departmentList.find(dept => dept.id === emp.departmentId)
                if (department) {
                    department.memberCount++
                }
            }
        })

        localStorage.setItem('departmentList', JSON.stringify(departmentList))
    }
}

// 初始化时立即更新部门人数
updateDepartmentCount()

export default {
    // 获取员工列表
    getEmployeeList: () => {
        updateDepartmentCount() // 每次获取列表时都更新部门人数
        return {
            code: 20000,
            data: {
                list: employeeList,
                total: employeeList.length
            }
        }
    },

    // 添加员工
    addEmployee: config => {
        const { name, age, gender, phone, departmentId, position } = JSON.parse(config.body)
        // 获取部门信息
        const departmentList = JSON.parse(localStorage.getItem('departmentList'))
        const department = departmentList.find(d => d.id === departmentId)

        const employee = {
            id: nextId++,
            name,
            age,
            gender,
            phone,
            departmentId,
            departmentName: department.name,
            position,
            status: '在职',
            createTime: new Date().toLocaleString()
        }
        employeeList.push(employee)
        saveToStorage()
        updateDepartmentCount()
        return {
            code: 20000,
            data: {
                message: '添加成功'
            }
        }
    },

    // 更新员工
    updateEmployee: config => {
        const { id, name, age, gender, phone, departmentId, position, status } = JSON.parse(config.body)
        const index = employeeList.findIndex(item => item.id === id)
        if (index > -1) {
            // 获取新部门信息
            const departmentList = JSON.parse(localStorage.getItem('departmentList'))
            const department = departmentList.find(d => d.id === departmentId)

            employeeList[index] = {
                ...employeeList[index],
                name,
                age,
                gender,
                phone,
                departmentId,
                departmentName: department.name,
                position,
                status
            }
            saveToStorage()
            updateDepartmentCount()
        }
        return {
            code: 20000,
            data: {
                message: '更新成功'
            }
        }
    },

    // 删除员工
    deleteEmployee: config => {
        const { id } = JSON.parse(config.body)
        const index = employeeList.findIndex(item => item.id === id)
        if (index > -1) {
            employeeList.splice(index, 1)
            saveToStorage()
            updateDepartmentCount()
        }
        return {
            code: 20000,
            data: {
                message: '删除成功'
            }
        }
    }
} 