import Mock from 'mockjs';

// 生成考勤汇总数据
const generateSummaryData = () => {
  // 先使用初始考勤数据
  const initialAttendanceList = [
    {
      id: 1,
      employeeId: 1,
      employeeName: 'Charles',
      departmentName: '技术部',
      date: '2024-03-15',
      checkIn: '09:00:00',
      checkOut: '18:00:00',
      status: '正常',
      note: '',
    },
    {
      id: 2,
      employeeId: 2,
      employeeName: 'Charles1',
      departmentName: '人事部',
      date: '2024-03-15',
      checkIn: '09:15:00',
      checkOut: '18:30:00',
      status: '迟到',
      note: '路上堵车',
    },
  ];

  // 获取localStorage中的考勤数据
  const storageAttendanceList = JSON.parse(localStorage.getItem('attendanceList'));

  // 如果localStorage中有数据，则使用localStorage中的数据
  const attendanceList = storageAttendanceList || initialAttendanceList;

  // 按员工ID分组统计考勤数据
  const summaryMap = {};

  attendanceList.forEach((record) => {
    if (!summaryMap[record.employeeId]) {
      summaryMap[record.employeeId] = {
        id: record.employeeId,
        employeeName: record.employeeName,
        departmentName: record.departmentName,
        totalDays: 0,
        normalDays: 0,
        lateDays: 0,
        earlyDays: 0,
        absentDays: 0,
        status: '在职',
      };
    }

    summaryMap[record.employeeId].totalDays++;
    switch (record.status) {
      case '正常':
        summaryMap[record.employeeId].normalDays++;
        break;
      case '迟到':
        summaryMap[record.employeeId].lateDays++;
        break;
      case '早退':
        summaryMap[record.employeeId].earlyDays++;
        break;
      case '缺勤':
        summaryMap[record.employeeId].absentDays++;
        break;
      default:
        break;
    }
  });

  return Object.values(summaryMap);
};

export default {
  // 获取考勤汇总数据
  getAttendanceSummary: (config) => {
    const { departmentName, employeeId, dateRange } = config.body ? JSON.parse(config.body) : {};
    let summaryList = generateSummaryData();

    // 根据查询条件过滤
    if (departmentName) {
      summaryList = summaryList.filter((item) => item.departmentName === departmentName);
    }
    if (employeeId) {
      summaryList = summaryList.filter((item) => item.id === employeeId);
    }

    return {
      code: 20000,
      data: {
        list: summaryList,
        total: summaryList.length,
      },
    };
  },
};
