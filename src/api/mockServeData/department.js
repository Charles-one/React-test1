// 初始数据
const initialDepartmentList = [
    {
        id: 1,
        name: '技术部',
        manager: '张三',
        memberCount: 15,
        createTime: '2024-03-15 09:00:00',
        status: '正常'
    },
    {
        id: 2,
        name: '人事部',
        manager: '李四',
        memberCount: 8,
        createTime: '2024-03-15 09:00:00',
        status: '正常'
    },
    {
        id: 3,
        name: '市场部',
        manager: '王五',
        memberCount: 12,
        createTime: '2024-03-15 09:00:00',
        status: '正常'
    }
]

// 从 localStorage 获取数据，如果没有则使用初始数据
let departmentList = JSON.parse(localStorage.getItem('departmentList')) || initialDepartmentList
// 从 localStorage 获取最后使用的 ID，如果没有则使用初始数据长度
let nextId = parseInt(localStorage.getItem('departmentNextId')) || departmentList.length + 1

// 保存数据到 localStorage
const saveToStorage = () => {
    localStorage.setItem('departmentList', JSON.stringify(departmentList))
    localStorage.setItem('departmentNextId', nextId.toString())
}

// 更新部门人数
const updateDepartmentCount = () => {
    const employeeList = JSON.parse(localStorage.getItem('employeeList')) || []
    // 计算每个部门的人数
    const countMap = employeeList.reduce((acc, emp) => {
        acc[emp.departmentId] = (acc[emp.departmentId] || 0) + 1
        return acc
    }, {})

    // 更新部门列表的人数
    departmentList.forEach(dept => {
        dept.memberCount = countMap[dept.id] || 0
    })

    saveToStorage()
}

export default {
    // 获取部门列表
    getDepartmentList: () => {
        // 每次获取部门列表时更新人数
        updateDepartmentCount()
        return {
            code: 20000,
            data: {
                list: departmentList,
                total: departmentList.length
            }
        }
    },

    // 添加部门
    addDepartment: config => {
        const { name, manager } = JSON.parse(config.body)
        const department = {
            id: nextId++,
            name,
            manager,
            memberCount: 0,
            createTime: new Date().toLocaleString(),
            status: '正常'
        }
        departmentList.push(department)
        saveToStorage()
        return {
            code: 20000,
            data: {
                message: '添加成功'
            }
        }
    },

    // 更新部门
    updateDepartment: config => {
        const { id, name, manager, status } = JSON.parse(config.body)
        const index = departmentList.findIndex(item => item.id === id)
        if (index > -1) {
            departmentList[index] = {
                ...departmentList[index],
                name,
                manager,
                status
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

    // 删除部门
    deleteDepartment: config => {
        const { id } = JSON.parse(config.body)
        const index = departmentList.findIndex(item => item.id === id)
        if (index > -1) {
            departmentList.splice(index, 1)
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