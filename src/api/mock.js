import Mock from 'mockjs'
import homeApi from './mockServeData/home'
import permissionApi from './mockServeData/permission'
import departmentApi from './mockServeData/department'
import employeeApi from './mockServeData/employee'
import attendanceApi from './mockServeData/attendance'
import overtimeApi from './mockServeData/overtime'
import leaveApi from './mockServeData/leave'
import shiftSwapApi from './mockServeData/shiftswap'
import summaryApi from './mockServeData/summary'

// 定义各种模拟接口
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

// 考勤管理相关接口
Mock.mock('/attendance/list', 'post', attendanceApi.getAttendanceList)
Mock.mock('/attendance/add', 'post', attendanceApi.addAttendance)
Mock.mock('/attendance/update', 'post', attendanceApi.updateAttendance)
Mock.mock('/attendance/delete', 'post', attendanceApi.deleteAttendance)

// 加班申请相关接口
Mock.mock('/overtime/list', 'post', overtimeApi.getOvertimeList)
Mock.mock('/overtime/add', 'post', overtimeApi.addOvertime)
Mock.mock('/overtime/update', 'post', overtimeApi.updateOvertime)
Mock.mock('/overtime/delete', 'post', overtimeApi.deleteOvertime)

// 请假申请相关接口
Mock.mock('/leave/list', 'post', leaveApi.getLeaveList)
Mock.mock('/leave/add', 'post', leaveApi.addLeave)
Mock.mock('/leave/update', 'post', leaveApi.updateLeave)
Mock.mock('/leave/delete', 'post', leaveApi.deleteLeave)

// 调休申请相关接口
Mock.mock('/shiftswap/list', 'post', shiftSwapApi.getShiftSwapList)
Mock.mock('/shiftswap/add', 'post', shiftSwapApi.addShiftSwap)
Mock.mock('/shiftswap/update', 'post', shiftSwapApi.updateShiftSwap)
Mock.mock('/shiftswap/delete', 'post', shiftSwapApi.deleteShiftSwap)

// 考勤汇总相关接口
Mock.mock('/summary/list', 'post', summaryApi.getAttendanceSummary)