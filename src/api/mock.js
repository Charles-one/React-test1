import Mock from 'mockjs'
import homeApi from './mockServeData/home'
import permissionApi from './mockServeData/permission'
import departmentApi from './mockServeData/department'
import employeeApi from './mockServeData/employee'

Mock.mock('/home/getData', homeApi.getStatisticalData)
Mock.mock(/permission\/getMenu/, 'post', permissionApi.getMenu)

// 部门管理相关接口
Mock.mock('/department/list', 'get', departmentApi.getDepartmentList)
Mock.mock('/department/add', 'post', departmentApi.addDepartment)
Mock.mock('/department/update', 'post', departmentApi.updateDepartment)
Mock.mock('/department/delete', 'post', departmentApi.deleteDepartment)

// 员工管理相关接口
Mock.mock('/employee/list', 'get', employeeApi.getEmployeeList)
Mock.mock('/employee/add', 'post', employeeApi.addEmployee)
Mock.mock('/employee/update', 'post', employeeApi.updateEmployee)
Mock.mock('/employee/delete', 'post', employeeApi.deleteEmployee)