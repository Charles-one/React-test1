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
import { getEmployeeList, getAttendanceList, getDepartmentList } from '../../api'

const Home = () => {
  const [statistics, setStatistics] = useState({
    totalEmployees: 0,
    onDutyToday: 0,
    lateToday: 0,
    leaveToday: 0
  })
  const [echartData, setEchartData] = useState({})

  // 获取统计数据
  const fetchStatistics = async () => {
    try {
      // 获取员工总数
      const empRes = await getEmployeeList()
      const totalEmployees = empRes.data.data.list.length

      // 获取今日考勤数据
      const today = new Date().toISOString().split('T')[0]
      const attRes = await getAttendanceList({ date: today })
      const todayAttendance = attRes.data.data.list

      // 计算今日考勤统计
      const onDutyToday = todayAttendance.filter(a => a.status === '正常').length
      const lateToday = todayAttendance.filter(a => a.status === '迟到').length
      const leaveToday = totalEmployees - todayAttendance.length

      setStatistics({
        totalEmployees,
        onDutyToday,
        lateToday,
        leaveToday
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
          xData: ['正常', '迟到', '早退', '缺勤'],
          series: [{
            name: '考勤状况',
            type: 'bar',
            data: [onDutyToday, lateToday, 0, leaveToday]
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
      value: statistics.leaveToday,
      icon: <WarningOutlined />,
      color: "#ff4d4f"
    }
  ]

  return (
    <Row className="home">
      <Col span={24}>
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