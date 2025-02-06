import Mock from 'mockjs'

// 初始员工数据
const initialEmployeeList = [
    {
        id: 1,
        name: '张小明',
        age: 28,
        gender: '男',
        phone: '13812345678',
        departmentId: 1, // 关联部门ID
        departmentName: '技术部', // 部门名称
        position: '开发工程师',
        status: '在职',
        createTime: '2024-03-15 09:00:00'
    },
    {
        id: 2,
        name: '李小红',
        age: 26,
        gender: '女',
        phone: '13912345678',
        departmentId: 2,
        departmentName: '人事部',
        position: 'HR专员',
        status: '在职',
        createTime: '2024-03-15 09:00:00'
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
    const departmentList = JSON.parse(localStorage.getItem('departmentList'))
    if (departmentList) {
        // 计算每个部门的人数
        const countMap = employeeList.reduce((acc, emp) => {
            acc[emp.departmentId] = (acc[emp.departmentId] || 0) + 1
            return acc
        }, {})

        // 更新部门列表的人数
        departmentList.forEach(dept => {
            dept.memberCount = countMap[dept.id] || 0
        })

        localStorage.setItem('departmentList', JSON.stringify(departmentList))
    }
}

export default {
    // 获取员工列表
    getEmployeeList: () => {
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