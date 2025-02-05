import { createBrowserRouter, Navigate } from 'react-router-dom'
import Main from '../pages/main'
import Home from '../pages/home'
import DepartmentManagement from '../pages/DepartmentManagement'
import EmployeeManagement from '../pages/EmployeeManagement'
import Login from '../pages/login'
import AttendanceManagement from '../pages/AttendanceManagement'
import OvertimeRequest from '../pages/OvertimeRequest'
import LeaveRequest from '../pages/LeaveRequest'
import ShiftSwapRequest from '../pages/ShiftSwapRequest'
import AttendanceSummary from '../pages/AttendanceSummary'
import MyProfile from '../pages/other/MyProfile'
import ChangePassword from '../pages/other/ChangePassword'
const routes = [
    {
        path: '/',
        Component: Main,
        children: [
            {
                path: '/',
                element: <Navigate to="home" replace />
            },
            {
                path: 'home',
                Component: Home,
            },
            {
                path: 'departmentmanagement',
                Component: DepartmentManagement,
            },
            {
                path: 'employeemanagement',
                Component: EmployeeManagement,
            },
            {
                path: 'attendancemanagement',
                Component: AttendanceManagement,
            },
            {
                path: 'overtimerequest',
                Component: OvertimeRequest,
            },
            {
                path: 'leaverequest',
                Component: LeaveRequest,
            },
            {
                path: 'shiftswaprequest',
                Component: ShiftSwapRequest,
            },
            {
                path: 'attendancesummary',
                Component: AttendanceSummary,
            },
            {
                path: 'other',
                children: [
                    {
                        path: 'MyProfile',
                        Component: MyProfile
                    },
                    {
                        path: 'ChangePassword',
                        Component: ChangePassword
                    }
                ]
            }

        ]
    },
    {
        path: '/login',
        Component: Login
    }
]
export default createBrowserRouter(routes)