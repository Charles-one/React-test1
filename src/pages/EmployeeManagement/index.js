import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, Form, Input, Select, message, Space, InputNumber } from 'antd'
import { getEmployeeList, addEmployee, updateEmployee, deleteEmployee, getDepartmentList } from '../../api'
import { useLocation } from 'react-router-dom'
import './user.css'

const { Option } = Select
const { Search } = Input

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [editingEmployee, setEditingEmployee] = useState(null)
  const location = useLocation()
  const [searchField, setSearchField] = useState('name')
  const [searchValue, setSearchValue] = useState('')
  const [filteredEmployees, setFilteredEmployees] = useState([])

  // 获取员工列表
  const fetchEmployees = async () => {
    setLoading(true)
    try {
      const res = await getEmployeeList()
      if (res.data.code === 20000) {
        setEmployees(res.data.data.list)
      }
    } catch (error) {
      message.error('获取员工列表失败')
    }
    setLoading(false)
  }

  // 获取部门列表
  const fetchDepartments = async () => {
    try {
      const res = await getDepartmentList()
      if (res.data.code === 20000) {
        setDepartments(res.data.data.list)
      }
    } catch (error) {
      message.error('获取部门列表失败')
    }
  }

  useEffect(() => {
    fetchEmployees()
    fetchDepartments()
  }, [location])

  // 处理搜索
  const handleSearch = (value) => {
    if (!value) {
      setFilteredEmployees(employees)
      return
    }

    const filtered = employees.filter(employee => {
      const fieldValue = employee[searchField]
      if (typeof fieldValue === 'string') {
        return fieldValue.toLowerCase().includes(value.toLowerCase())
      } else if (typeof fieldValue === 'number') {
        return fieldValue.toString().includes(value)
      }
      return false
    })
    setFilteredEmployees(filtered)
  }

  // 当员工数据更新时，更新过滤后的列表
  useEffect(() => {
    setFilteredEmployees(employees)
  }, [employees])

  // 在组件内添加一个函数来检查部门状态
  const getDepartmentStatus = (departmentId) => {
    const department = departments.find(dept => dept.id === departmentId)
    return department?.status
  }

  // 修改表格列配置
  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '所属部门',
      dataIndex: 'departmentName',
      key: 'departmentName',
      render: (text, record) => {
        const departmentStatus = getDepartmentStatus(record.departmentId)
        return (
          <span style={{
            color: departmentStatus === '停用' ? '#ff4d4f' : 'inherit'
          }}>
            {text}
          </span>
        )
      }
    },
    {
      title: '职位',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: '入职时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record)}>
            删除
          </Button>
        </Space>
      ),
    },
  ]

  // 处理添加/编辑
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (editingEmployee) {
        await updateEmployee({ ...values, id: editingEmployee.id })
        message.success('更新成功')
      } else {
        await addEmployee(values)
        message.success('添加成功')
      }
      setModalVisible(false)
      form.resetFields()
      await fetchEmployees()
      await fetchDepartments()
    } catch (error) {
      message.error('操作失败')
    }
  }

  // 编辑员工
  const handleEdit = (employee) => {
    setEditingEmployee(employee)
    form.setFieldsValue(employee)
    setModalVisible(true)
  }

  // 删除员工
  const handleDelete = async (employee) => {
    try {
      await deleteEmployee({ id: employee.id })
      message.success('删除成功')
      await fetchEmployees()
      await fetchDepartments()
    } catch (error) {
      message.error('删除失败')
    }
  }

  return (
    <div className="employee-management">
      <div className="header">
        <Space size="middle" style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={() => {
            setEditingEmployee(null)
            form.resetFields()
            setModalVisible(true)
          }}>
            添加员工
          </Button>
          <Space>
            <Select
              value={searchField}
              onChange={setSearchField}
              style={{ width: 120 }}
            >
              <Option value="name">姓名</Option>
              <Option value="phone">手机号</Option>
              <Option value="departmentName">所属部门</Option>
              <Option value="position">职位</Option>
              <Option value="status">状态</Option>
            </Select>
            <Input.Search
              placeholder="请输入搜索内容"
              allowClear
              onSearch={handleSearch}
              onChange={(e) => {
                setSearchValue(e.target.value)
                if (!e.target.value) {
                  handleSearch('')
                }
              }}
              style={{ width: 200 }}
              role="searchbox"
            />
          </Space>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={filteredEmployees}
        loading={loading}
        rowKey="id"
      />

      <Modal
        title={editingEmployee ? '编辑员工' : '添加员工'}
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
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="age"
            label="年龄"
            rules={[{ required: true, message: '请输入年龄' }]}
          >
            <InputNumber min={18} max={100} />
          </Form.Item>
          <Form.Item
            name="gender"
            label="性别"
            rules={[{ required: true, message: '请选择性别' }]}
          >
            <Select>
              <Option value="男">男</Option>
              <Option value="女">女</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="phone"
            label="手机号"
            rules={[{ required: true, message: '请输入手机号' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="departmentId"
            label="所属部门"
            rules={[{ required: true, message: '请选择所属部门' }]}
          >
            <Select>
              {departments.map(dept => (
                <Option key={dept.id} value={dept.id}>{dept.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="position"
            label="职位"
            rules={[{ required: true, message: '请输入职位' }]}
          >
            <Input />
          </Form.Item>
          {editingEmployee && (
            <Form.Item
              name="status"
              label="状态"
            >
              <Select>
                <Option value="在职">在职</Option>
                <Option value="离职">离职</Option>
                <Option value="休假">休假</Option>
              </Select>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  )
}

export default EmployeeManagement