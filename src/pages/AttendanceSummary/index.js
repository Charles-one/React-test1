import React, { useState, useEffect } from 'react'
import { Table, Form, Select, DatePicker, Button, Card, Statistic, Row, Col } from 'antd'
import { getAttendanceSummary, getEmployeeList, getDepartmentList } from '../../api'
import { useLocation } from 'react-router-dom'
import './AttendanceSummary.css'

const { Option } = Select
const { RangePicker } = DatePicker

const AttendanceSummary = () => {
    const [summaryData, setSummaryData] = useState([])
    const [employees, setEmployees] = useState([])
    const [departments, setDepartments] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchForm] = Form.useForm()
    const location = useLocation()

    // 获取考勤汇总数据
    const fetchSummaryData = async (searchParams = {}) => {
        setLoading(true)
        try {
            const res = await getAttendanceSummary(searchParams)
            if (res.data.code === 20000) {
                setSummaryData(res.data.data.list)
            }
        } catch (error) {
            console.error('获取考勤汇总数据失败:', error)
        }
        setLoading(false)
    }

    // 获取员工列表
    const fetchEmployees = async () => {
        try {
            const res = await getEmployeeList()
            if (res.data.code === 20000) {
                setEmployees(res.data.data.list)
            }
        } catch (error) {
            console.error('获取员工列表失败:', error)
        }
    }

    // 获取部门列表
    const fetchDepartments = async () => {
        try {
            const res = await getDepartmentList()
            if (res.data.code === 20000) {
                setDepartments(res.data.data.list)
            }
        } catch (error) {
            console.error('获取部门列表失败:', error)
        }
    }

    useEffect(() => {
        fetchSummaryData()
        fetchEmployees()
        fetchDepartments()
    }, [])

    // 计算统计数据
    const calculateStatistics = () => {
        if (!summaryData.length) {
            return {
                total: 0,
                normalCount: 0,
                abnormalCount: 0,
                lateCount: 0
            }
        }

        const total = summaryData.length
        const normalCount = summaryData.filter(item => item.lateDays === 0 && item.earlyDays === 0 && item.absentDays === 0).length
        const abnormalCount = total - normalCount
        const lateCount = summaryData.filter(item => item.lateDays > 0).length

        return {
            total,
            normalCount,
            abnormalCount,
            lateCount
        }
    }

    const stats = calculateStatistics()

    // 表格列配置
    const columns = [
        {
            title: '员工姓名',
            dataIndex: 'employeeName',
            key: 'employeeName',
        },
        {
            title: '所属部门',
            dataIndex: 'departmentName',
            key: 'departmentName',
        },
        {
            title: '考勤天数',
            dataIndex: 'totalDays',
            key: 'totalDays',
        },
        {
            title: '正常天数',
            dataIndex: 'normalDays',
            key: 'normalDays',
        },
        {
            title: '迟到次数',
            dataIndex: 'lateDays',
            key: 'lateDays',
            render: (text) => (
                <span style={{ color: text > 0 ? '#ff4d4f' : 'inherit' }}>
                    {text}
                </span>
            )
        },
        {
            title: '早退次数',
            dataIndex: 'earlyDays',
            key: 'earlyDays',
            render: (text) => (
                <span style={{ color: text > 0 ? '#ff4d4f' : 'inherit' }}>
                    {text}
                </span>
            )
        },
        {
            title: '缺勤天数',
            dataIndex: 'absentDays',
            key: 'absentDays',
            render: (text) => (
                <span style={{ color: text > 0 ? '#ff4d4f' : 'inherit' }}>
                    {text}
                </span>
            )
        },
        {
            title: '出勤率',
            key: 'attendanceRate',
            render: (_, record) => {
                const rate = record.totalDays > 0
                    ? ((record.normalDays / record.totalDays) * 100).toFixed(2)
                    : '0.00'
                return `${rate}%`
            }
        }
    ]

    // 处理搜索
    const handleSearch = async () => {
        try {
            const values = await searchForm.validateFields()
            const searchParams = {
                ...values,
            }
            fetchSummaryData(searchParams)
        } catch (error) {
            console.log('Search form validation failed:', error)
        }
    }

    return (
        <div className="attendance-summary">
            <div className="statistics-cards">
                <Row gutter={16}>
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="总人数"
                                value={stats.total}
                                suffix="人"
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="考勤正常"
                                value={stats.normalCount}
                                suffix="人"
                                valueStyle={{ color: '#3f8600' }}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="考勤异常"
                                value={stats.abnormalCount}
                                suffix="人"
                                valueStyle={{ color: '#cf1322' }}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="迟到人数"
                                value={stats.lateCount}
                                suffix="人"
                                valueStyle={{ color: '#faad14' }}
                            />
                        </Card>
                    </Col>
                </Row>
            </div>

            <div className="search-form">
                <Form
                    form={searchForm}
                    layout="inline"
                >
                    <Form.Item name="departmentName">
                        <Select
                            style={{ width: 160 }}
                            placeholder="选择部门"
                            allowClear
                        >
                            {departments.map(dept => (
                                <Option key={dept.id} value={dept.name}>{dept.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="employeeId">
                        <Select
                            style={{ width: 160 }}
                            placeholder="选择员工"
                            allowClear
                        >
                            {employees.map(emp => (
                                <Option key={emp.id} value={emp.id}>{emp.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" onClick={handleSearch}>
                            搜索
                        </Button>
                    </Form.Item>
                </Form>
            </div>

            <Table
                columns={columns}
                dataSource={summaryData}
                loading={loading}
                rowKey="id"
            />
        </div>
    )
}

export default AttendanceSummary