import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, Form, Input, Select, message, Space, DatePicker, InputNumber } from 'antd'
import { getLeaveList, addLeave, updateLeave, deleteLeave, getEmployeeList } from '../../api'
import { useLocation } from 'react-router-dom'
import dayjs from 'dayjs'
import './LeaveRequest.css'

const { Option } = Select
const { RangePicker } = DatePicker
const { TextArea } = Input

const LeaveRequest = () => {
    const [leaves, setLeaves] = useState([])
    const [employees, setEmployees] = useState([])
    const [loading, setLoading] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [form] = Form.useForm()
    const [searchForm] = Form.useForm()
    const location = useLocation()

    // 获取请假申请列表
    const fetchLeaves = async (searchParams = {}) => {
        setLoading(true)
        try {
            const res = await getLeaveList(searchParams)
            if (res.data.code === 20000) {
                setLeaves(res.data.data.list)
            }
        } catch (error) {
            message.error('获取请假申请列表失败')
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
            message.error('获取员工列表失败')
        }
    }

    useEffect(() => {
        fetchLeaves()
        fetchEmployees()
    }, [location])

    // 表格列配置
    const columns = [
        {
            title: '申请时间',
            dataIndex: 'createTime',
            key: 'createTime',
        },
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
            title: '请假类型',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: '开始时间',
            dataIndex: 'startTime',
            key: 'startTime',
        },
        {
            title: '结束时间',
            dataIndex: 'endTime',
            key: 'endTime',
        },
        {
            title: '请假天数',
            dataIndex: 'duration',
            key: 'duration',
        },
        {
            title: '请假原因',
            dataIndex: 'reason',
            key: 'reason',
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (text) => (
                <span style={{
                    color: text === '已通过' ? '#52c41a' :
                        text === '已拒绝' ? '#ff4d4f' :
                            '#faad14'
                }}>
                    {text}
                </span>
            )
        },
        {
            title: '审批人',
            dataIndex: 'approver',
            key: 'approver',
        },
        {
            title: '审批意见',
            dataIndex: 'approveRemark',
            key: 'approveRemark',
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space>
                    {record.status === '待审批' && (
                        <>
                            <Button type="link" onClick={() => handleApprove(record, '已通过')}>
                                通过
                            </Button>
                            <Button type="link" danger onClick={() => handleApprove(record, '已拒绝')}>
                                拒绝
                            </Button>
                        </>
                    )}
                    <Button type="link" danger onClick={() => handleDelete(record)}>
                        删除
                    </Button>
                </Space>
            ),
        },
    ]

    // 处理搜索
    const handleSearch = async () => {
        try {
            const values = await searchForm.validateFields()
            const [startDate, endDate] = values.dateRange || []
            const searchParams = {
                ...values,
                startDate: startDate?.format('YYYY-MM-DD'),
                endDate: endDate?.format('YYYY-MM-DD')
            }
            delete searchParams.dateRange
            fetchLeaves(searchParams)
        } catch (error) {
            console.log('Search form validation failed:', error)
        }
    }

    // 处理审批
    const handleApprove = async (record, status) => {
        Modal.confirm({
            title: `确定要${status === '已通过' ? '通过' : '拒绝'}该请假申请吗？`,
            content: (
                <Form layout="vertical">
                    <Form.Item label="审批意见">
                        <Input.TextArea id="approveRemark" />
                    </Form.Item>
                </Form>
            ),
            onOk: async () => {
                const approveRemark = document.getElementById('approveRemark').value
                try {
                    await updateLeave({
                        id: record.id,
                        status,
                        approveRemark
                    })
                    message.success('审批成功')
                    fetchLeaves()
                } catch (error) {
                    message.error('审批失败')
                }
            }
        })
    }

    // 提交请假申请
    const handleSubmit = async () => {
        try {
            const values = await form.validateFields()
            const employee = employees.find(emp => emp.id === values.employeeId)
            const formattedValues = {
                ...values,
                startTime: values.startTime.format('YYYY-MM-DD HH:mm:ss'),
                endTime: values.endTime.format('YYYY-MM-DD HH:mm:ss'),
                employeeName: employee.name,
                departmentName: employee.departmentName
            }
            await addLeave(formattedValues)
            message.success('申请提交成功')
            setModalVisible(false)
            form.resetFields()
            fetchLeaves()
        } catch (error) {
            message.error('提交失败')
        }
    }

    // 删除申请
    const handleDelete = async (record) => {
        try {
            await deleteLeave({ id: record.id })
            message.success('删除成功')
            fetchLeaves()
        } catch (error) {
            message.error('删除失败')
        }
    }

    return (
        <div className="leave-request">
            <div className="header">
                <Form
                    form={searchForm}
                    layout="inline"
                >
                    <Form.Item>
                        <Button type="primary" onClick={() => {
                            form.resetFields()
                            setModalVisible(true)
                        }}>
                            提交请假申请
                        </Button>
                    </Form.Item>
                    <Form.Item name="dateRange">
                        <RangePicker />
                    </Form.Item>
                    <Form.Item name="employeeId">
                        <Select
                            style={{ width: 120 }}
                            placeholder="选择员工"
                            allowClear
                        >
                            {employees.map(emp => (
                                <Option key={emp.id} value={emp.id}>{emp.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="status">
                        <Select
                            style={{ width: 120 }}
                            placeholder="申请状态"
                            allowClear
                        >
                            <Option value="待审批">待审批</Option>
                            <Option value="已通过">已通过</Option>
                            <Option value="已拒绝">已拒绝</Option>
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
                dataSource={leaves}
                loading={loading}
                rowKey="id"
            />

            <Modal
                title="提交请假申请"
                open={modalVisible}
                onOk={handleSubmit}
                onCancel={() => {
                    setModalVisible(false)
                    form.resetFields()
                }}
            >
                <Form
                    form={form}
                    layout="vertical"
                >
                    <Form.Item
                        name="employeeId"
                        label="申请人"
                        rules={[{ required: true, message: '请选择申请人' }]}
                    >
                        <Select>
                            {employees.map(emp => (
                                <Option key={emp.id} value={emp.id}>{emp.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="type"
                        label="请假类型"
                        rules={[{ required: true, message: '请选择请假类型' }]}
                    >
                        <Select>
                            <Option value="年假">年假</Option>
                            <Option value="事假">事假</Option>
                            <Option value="病假">病假</Option>
                            <Option value="婚假">婚假</Option>
                            <Option value="产假">产假</Option>
                            <Option value="丧假">丧假</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="startTime"
                        label="开始时间"
                        rules={[{ required: true, message: '请选择开始时间' }]}
                    >
                        <DatePicker showTime style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        name="endTime"
                        label="结束时间"
                        rules={[{ required: true, message: '请选择结束时间' }]}
                    >
                        <DatePicker showTime style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        name="duration"
                        label="请假天数"
                        rules={[{ required: true, message: '请输入请假天数' }]}
                    >
                        <InputNumber min={0.5} step={0.5} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        name="reason"
                        label="请假原因"
                        rules={[{ required: true, message: '请输入请假原因' }]}
                    >
                        <TextArea rows={4} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default LeaveRequest