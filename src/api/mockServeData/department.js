// 初始数据
const initialDepartmentList = [
  {
    id: 1,
    name: '技术部',
    manager: 'Charles',
    memberCount: 0, // 初始设为0，后面会更新
    createTime: '2025-01-01 09:00:00',
    status: '正常',
  },
  {
    id: 2,
    name: '人事部',
    manager: 'Charles',
    memberCount: 0, // 初始设为0，后面会更新
    createTime: '2025-01-01 09:00:00',
    status: '正常',
  },
  {
    id: 3,
    name: '市场部',
    manager: 'Charles',
    memberCount: 0, // 初始设为0，后面会更新
    createTime: '2025-01-01 09:00:00',
    status: '正常',
  },
];

// 更新部门人数
const updateDepartmentCount = () => {
  const employeeList = JSON.parse(localStorage.getItem('employeeList')) || [];
  const departmentCounts = {};

  // 统计每个部门的在职人数
  employeeList.forEach((emp) => {
    if (emp.status === '在职') {
      departmentCounts[emp.departmentId] = (departmentCounts[emp.departmentId] || 0) + 1;
    }
  });

  // 更新部门人数
  departmentList.forEach((dept) => {
    dept.memberCount = departmentCounts[dept.id] || 0;
  });

  // 保存更新后的部门列表
  localStorage.setItem('departmentList', JSON.stringify(departmentList));
};

// 从 localStorage 获取数据，如果没有则使用初始数据
let departmentList = JSON.parse(localStorage.getItem('departmentList'));
if (!departmentList || departmentList.length === 0) {
  // 先设置初始部门列表
  departmentList = initialDepartmentList;
  // 从 employee.js 获取初始员工数据
  const initialEmployeeList = [
    {
      id: 1,
      name: 'Charles',
      departmentId: 1,
      status: '在职',
    },
    {
      id: 2,
      name: 'Charles1',
      departmentId: 2,
      status: '在职',
    },
  ];

  // 计算初始部门人数
  initialEmployeeList.forEach((emp) => {
    if (emp.status === '在职') {
      const department = departmentList.find((dept) => dept.id === emp.departmentId);
      if (department) {
        department.memberCount++;
      }
    }
  });

  // 保存到 localStorage
  localStorage.setItem('departmentList', JSON.stringify(departmentList));
}

let nextId = parseInt(localStorage.getItem('departmentNextId')) || departmentList.length + 1;

// 保存数据到 localStorage
const saveToStorage = () => {
  localStorage.setItem('departmentList', JSON.stringify(departmentList));
  localStorage.setItem('departmentNextId', nextId.toString());
};

export default {
  // 获取部门列表
  getDepartmentList: () => {
    updateDepartmentCount(); // 每次获取列表时都更新人数
    return {
      code: 20000,
      data: {
        list: departmentList,
        total: departmentList.length,
      },
    };
  },

  // 添加部门
  addDepartment: (config) => {
    const { name, manager } = JSON.parse(config.body);
    const department = {
      id: nextId++,
      name,
      manager,
      memberCount: 0,
      createTime: new Date().toLocaleString(),
      status: '正常',
    };
    departmentList.push(department);
    saveToStorage();
    return {
      code: 20000,
      data: {
        message: '添加成功',
      },
    };
  },

  // 更新部门
  updateDepartment: (config) => {
    const { id, name, manager, status } = JSON.parse(config.body);
    const index = departmentList.findIndex((item) => item.id === id);
    if (index > -1) {
      departmentList[index] = {
        ...departmentList[index],
        name,
        manager,
        status,
      };
      saveToStorage();
      updateDepartmentCount(); // 确保在更新部门后重新计算人数
    }
    return {
      code: 20000,
      data: {
        message: '更新成功',
      },
    };
  },

  // 删除部门
  deleteDepartment: (config) => {
    const { id } = JSON.parse(config.body);
    const index = departmentList.findIndex((item) => item.id === id);
    if (index > -1) {
      departmentList.splice(index, 1);
      saveToStorage();
    }
    return {
      code: 20000,
      data: {
        message: '删除成功',
      },
    };
  },
};
