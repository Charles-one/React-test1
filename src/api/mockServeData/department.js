// 初始数据
const initialDepartmentList = [
    {
        id: 1,
        name: '技术部',
        manager: 'Charles',
        memberCount: 1,  // 初始值设为0，后面会根据员工数据更新
        createTime: '2025-01-01 09:00:00',
        status: '正常'
    },
    {
        id: 2,
        name: '人事部',
        manager: 'Charles',
        memberCount: 1,
        createTime: '2025-01-01 09:00:00',
        status: '正常'
    },
    {
        id: 3,
        name: '市场部',
        manager: 'Charles',
        memberCount: 0,
        createTime: '2025-01-01 09:00:00',
        status: '正常'
    }
]

// 从 localStorage 获取数据，如果没有则使用初始数据
let departmentList = JSON.parse(localStorage.getItem('departmentList'))
if (!departmentList || departmentList.length === 0) {
    departmentList = initialDepartmentList
    // 第一次加载时，保存初始数据到 localStorage
    localStorage.setItem('departmentList', JSON.stringify(departmentList))
}

let nextId = parseInt(localStorage.getItem('departmentNextId')) || departmentList.length + 1

// 保存数据到 localStorage
const saveToStorage = () => {
    localStorage.setItem('departmentList', JSON.stringify(departmentList))
    localStorage.setItem('departmentNextId', nextId.toString())
}

// 更新部门人数
const updateDepartmentCount = () => {
    const employeeList = JSON.parse(localStorage.getItem('employeeList')) || []
    const departmentCounts = {}

    // 先统计每个部门的在职人数
    employeeList.forEach(emp => {
        if (emp.status === '在职') {
            departmentCounts[emp.departmentId] = (departmentCounts[emp.departmentId] || 0) + 1
        }
    })

    // 更新部门人数，如果没有员工数据则保持原有的 memberCount
    departmentList.forEach(dept => {
        if (departmentCounts.hasOwnProperty(dept.id)) {
            dept.memberCount = departmentCounts[dept.id]
        }
        // 如果没有找到对应的员工数据，保持原有的 memberCount 不变
    })

    saveToStorage()
}

// 初始化时立即更新部门人数
updateDepartmentCount()

export default {
    // 获取部门列表
    getDepartmentList: () => {
        updateDepartmentCount()  // 每次获取列表时都更新人数
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