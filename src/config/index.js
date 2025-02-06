export default [
  {
    path: '/home',
    name: 'home',
    label: 'menu.home',
    icon: 'HomeOutlined',
    url: '/home/index',
  },
  {
    path: '/departmentmanagement',
    name: 'departmentmanagement',
    label: 'menu.departmentManagement',
    icon: 'ShopOutlined',
    url: '/DepartmentManagement/index',
  },
  {
    path: '/employeemanagement',
    name: 'employeemanagement',
    label: 'menu.employeeManagement',
    icon: 'UserOutlined',
    url: '/EmployeeManagement/index',
  },
  {
    path: '/attendancemanagement',
    name: 'attendancemanagement',
    label: 'menu.attendanceManagement',
    icon: 'AppstoreOutlined',
    url: '/AttendanceManagement/index',
  },
  {
    path: '/overtimerequest',
    name: 'overtimerequest',
    label: 'menu.overtimeRequest',
    icon: 'MedicineBoxFilled',
    url: '/OvertimeRequest/index',
  },
  {
    path: '/leaverequest',
    name: 'leaverequest',
    label: 'menu.leaveRequest',
    icon: 'BellFilled',
    url: '/LeaveRequest/index',
  },
  {
    path: '/shiftswaprequest',
    name: 'shiftswaprequest',
    label: 'menu.shiftSwapRequest',
    icon: 'AuditOutlined',
    url: '/ShiftSwapRequest/index',
  },
  {
    path: '/attendancesummary',
    name: 'attendancesummary',
    label: 'menu.attendanceSummary',
    icon: 'SignalFilled',
    url: '/AttendanceSummary/index',
  },

  {
    path: '/other',
    label: 'menu.other',
    icon: 'SettingOutlined',
    children: [
      {
        path: '/other/MyProfile',
        name: 'MyProfile',
        label: 'menu.myProfile',
        icon: 'SettingOutlined',
      },
      {
        path: '/other/ChangePassword',
        name: 'MyProfile',
        label: 'menu.changePassword',
        icon: 'UnlockOutlined',
      },
    ],
  },
];
