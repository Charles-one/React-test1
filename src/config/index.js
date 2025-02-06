export default [
  {
    path: '/home',
    name: 'home',
    label: '首页',
    icon: 'HomeOutlined',
    url: '/home/index',
  },
  {
    path: '/departmentmanagement',
    name: 'departmentmanagement',
    label: '部门管理',
    icon: 'ShopOutlined',
    url: '/DepartmentManagement/index',
  },
  {
    path: '/employeemanagement',
    name: 'employeemanagement',
    label: '员工管理',
    icon: 'UserOutlined',
    url: '/EmployeeManagement/index',
  },
  {
    path: '/attendancemanagement',
    name: 'attendancemanagement',
    label: '员工考勤管理',
    icon: 'AppstoreOutlined',
    url: '/AttendanceManagement/index',
  },
  {
    path: '/overtimerequest',
    name: 'overtimerequest',
    label: '加班申请',
    icon: 'MedicineBoxFilled',
    url: '/OvertimeRequest/index',
  },
  {
    path: '/leaverequest',
    name: 'leaverequest',
    label: '请假申请',
    icon: 'BellFilled',
    url: '/LeaveRequest/index',
  },
  {
    path: '/shiftswaprequest',
    name: 'shiftswaprequest',
    label: '调休申请',
    icon: 'AuditOutlined',
    url: '/ShiftSwapRequest/index',
  },
  {
    path: '/attendancesummary',
    name: 'attendancesummary',
    label: '考勤汇总',
    icon: 'SignalFilled',
    url: '/AttendanceSummary/index',
  },

  {
    path: '/other',
    label: '其他',
    icon: 'SettingOutlined',
    children: [
      {
        path: '/other/MyProfile',
        name: 'MyProfile',
        label: '我的信息',
        icon: 'SettingOutlined',
      },
      {
        path: '/other/ChangePassword',
        name: 'MyProfile',
        label: '修改密码',
        icon: 'UnlockOutlined',
      },
    ],
  },
];
