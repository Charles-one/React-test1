import React, { useEffect, useState } from 'react'
import { Col, Row, Card, Statistic } from 'antd'
import {
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined
} from '@ant-design/icons'
import "./home.css"
import MyEcharts from '../../components/Echarts'
import { getEmployeeList, getAttendanceList, getDepartmentList, getLeaveList } from '../../api'
import dayjs from 'dayjs'

const Home = () => {
  const [statistics, setStatistics] = useState({
    totalEmployees: 0,
    onDutyToday: 0,
    lateToday: 0,
    absentToday: 0
  })
  const [echartData, setEchartData] = useState({})
  const [currentTime, setCurrentTime] = useState(dayjs().format('YYYY-MM-DD HH:mm:ss'))

  // 更新实时时间
  useEffect(() => {
    const timer = setInterval(() => {
      const now = dayjs()
      setCurrentTime(now.format('YYYY-MM-DD HH:mm:ss'))
      // 如果时间跨天了，重新获取统计数据
      if (now.format('HH:mm:ss') === '00:00:00') {
        fetchStatistics()
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // 获取统计数据
  const fetchStatistics = async () => {
    try {
      // 获取员工总数
      const empRes = await getEmployeeList()
      const totalEmployees = empRes.data.data.list.length

      // 获取今日考勤数据
      const today = dayjs().format('YYYY-MM-DD')
      const attRes = await getAttendanceList({ date: today })
      const todayAttendance = attRes.data.data.list

      // 获取今日请假数据
      const leaveRes = await getLeaveList({})
      const todayLeaves = leaveRes.data.data.list.filter(leave => {
        const startDate = dayjs(leave.startTime)
        const endDate = dayjs(leave.endTime)
        const currentDate = dayjs()
        return (
          leave.status === '已通过' &&
          currentDate.isAfter(startDate.subtract(1, 'day')) &&
          currentDate.isBefore(endDate.add(1, 'day'))
        )
      })

      // 计算今日考勤统计
      const onDutyToday = todayAttendance.filter(a => a.status === '正常').length
      const lateToday = todayAttendance.filter(a => a.status === '迟到').length
      const absentToday = todayAttendance.filter(a => a.status === '缺勤').length + todayLeaves.length

      setStatistics({
        totalEmployees,
        onDutyToday,
        lateToday,
        absentToday
      })

      // 获取部门数据用于图表展示
      const deptRes = await getDepartmentList()
      const departments = deptRes.data.data.list

      // 设置图表数据
      setEchartData({
        department: {
          series: [{
            type: 'pie',
            data: departments.map(dept => ({
              name: dept.name,
              value: dept.memberCount
            }))
          }]
        },
        attendance: {
          xData: ['正常', '迟到', '请假', '缺勤'],
          series: [{
            name: '考勤状况',
            type: 'bar',
            data: [
              onDutyToday,
              lateToday,
              todayLeaves.length,
              absentToday - todayLeaves.length // 实际缺勤人数（不包括请假）
            ]
          }]
        }
      })
    } catch (error) {
      console.error('获取统计数据失败:', error)
    }
  }

  useEffect(() => {
    fetchStatistics()
  }, [])

  // 统计卡片数据
  const countData = [
    {
      title: "员工总数",
      value: statistics.totalEmployees,
      icon: <UserOutlined />,
      color: "#2ec7c9"
    },
    {
      title: "今日正常",
      value: statistics.onDutyToday,
      icon: <CheckCircleOutlined />,
      color: "#52c41a"
    },
    {
      title: "今日迟到",
      value: statistics.lateToday,
      icon: <ClockCircleOutlined />,
      color: "#faad14"
    },
    {
      title: "今日请假/缺勤",
      value: statistics.absentToday,
      icon: <WarningOutlined />,
      color: "#ff4d4f"
    }
  ]

  return (
    <Row className="home">
      <Col span={24}>
        <div className="current-time">
          当前时间：{currentTime}
        </div>
        <div className="num">
          {countData.map((item, index) => (
            <Card key={index}>
              <div className="icon-box" style={{ background: item.color }}>
                {item.icon}
              </div>
              <div className="detail">
                <Statistic title={item.title} value={item.value} />
              </div>
            </Card>
          ))}
        </div>
        <div className="graph">
          {echartData.department && (
            <Card title="部门人数分布" style={{ width: '48%' }}>
              <MyEcharts
                chartData={echartData.department}
                isAxisChart={false}
                style={{ height: '300px' }}
              />
            </Card>
          )}
          {echartData.attendance && (
            <Card title="今日考勤状况" style={{ width: '48%' }}>
              <MyEcharts
                chartData={echartData.attendance}
                style={{ height: '300px' }}
              />
            </Card>
          )}
        </div>
      </Col>
    </Row>
  )
}

export default Home