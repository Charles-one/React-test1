import Mock from 'mockjs';

export default {
  getMenu: (config) => {
    const { username, password } = JSON.parse(config.body);
    // 验证用户名和密码
    if (username === 'admin' && password === '123456') {
      return {
        code: 20000,
        data: {
          menu: [
            {
              path: '/home',
              name: 'home',
              label: 'menu.home',
              icon: 'HomeOutlined',
              url: 'home/index',
            },
            {
              path: '/departmentmanagement',
              name: 'departmentmanagement',
              label: 'menu.departmentManagement',
              icon: 'ShopOutlined',
              url: 'DepartmentManagement/index',
            },
            {
              path: '/employeemanagement',
              name: 'employeemanagement',
              label: 'menu.employeeManagement',
              icon: 'UserOutlined',
              url: 'EmployeeManagement/index',
            },
            {
              path: '/attendancemanagement',
              name: 'attendancemanagement',
              label: 'menu.attendanceManagement',
              icon: 'AppstoreOutlined',
              url: 'AttendanceManagement/index',
            },
            {
              path: '/overtimerequest',
              name: 'overtimerequest',
              label: 'menu.overtimeRequest',
              icon: 'MedicineBoxFilled',
              url: 'OvertimeRequest/index',
            },
            {
              path: '/leaverequest',
              name: 'leaverequest',
              label: 'menu.leaveRequest',
              icon: 'BellFilled',
              url: 'LeaveRequest/index',
            },
            {
              path: '/shiftswaprequest',
              name: 'shiftswaprequest',
              label: 'menu.shiftSwapRequest',
              icon: 'AuditOutlined',
              url: 'ShiftSwapRequest/index',
            },
            {
              path: '/attendancesummary',
              name: 'attendancesummary',
              label: 'menu.attendanceSummary',
              icon: 'SignalFilled',
              url: 'AttendanceSummary/index',
            },
            {
              path: '/other',
              name: 'other',
              label: 'menu.other',
              icon: 'SettingOutlined',
              children: [
                {
                  path: '/other/myprofile',
                  name: 'myprofile',
                  label: 'menu.myProfile',
                  icon: 'SettingOutlined',
                  url: 'other/MyProfile',
                },
                {
                  path: '/other/changepassword',
                  name: 'changepassword',
                  label: 'menu.changePassword',
                  icon: 'UnlockOutlined',
                  url: 'other/ChangePassword',
                },
              ],
            },
          ],
          token: Mock.Random.guid(),
          message: '登录成功',
        },
      };
    } else {
      return {
        code: -999,
        data: {
          message: '用户名或密码错误',
        },
      };
    }
  },
};
