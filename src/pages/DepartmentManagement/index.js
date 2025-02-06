import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Space } from 'antd';
import {
  getDepartmentList,
  addDepartment,
  updateDepartment,
  deleteDepartment,
  getEmployeeList,
} from '../../api';
import { useLocation } from 'react-router-dom';
import './DepartmentManagement.css';

const { Option } = Select;

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingDepartment, setEditingDepartment] = useState(null);
  const location = useLocation();

  // 获取部门列表
  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const res = await getDepartmentList();
      if (res.data.code === 20000) {
        setDepartments(res.data.data.list);
      }
    } catch (error) {
      message.error('获取部门列表失败');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDepartments();
  }, [location]);

  // 表格列配置
  const columns = [
    {
      title: '部门名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '负责人',
      dataIndex: 'manager',
      key: 'manager',
    },
    {
      title: '人数',
      dataIndex: 'memberCount',
      key: 'memberCount',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
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
  ];

  // 处理添加/编辑
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingDepartment) {
        await updateDepartment({ ...values, id: editingDepartment.id });
        message.success('更新成功');
      } else {
        await addDepartment(values);
        message.success('添加成功');
      }
      setModalVisible(false);
      form.resetFields();
      fetchDepartments();
    } catch (error) {
      message.error('操作失败');
    }
  };

  // 编辑部门
  const handleEdit = (department) => {
    setEditingDepartment(department);
    form.setFieldsValue(department);
    setModalVisible(true);
  };

  // 删除部门
  const handleDelete = async (department) => {
    try {
      await deleteDepartment({ id: department.id });
      message.success('删除成功');
      fetchDepartments();
    } catch (error) {
      message.error('删除失败');
    }
  };

  return (
    <div className="department-management">
      <div className="header">
        <Button
          type="primary"
          onClick={() => {
            setEditingDepartment(null);
            form.resetFields();
            setModalVisible(true);
          }}
        >
          添加部门
        </Button>
      </div>

      <Table columns={columns} dataSource={departments} loading={loading} rowKey="id" />

      <Modal
        title={editingDepartment ? '编辑部门' : '添加部门'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="部门名称"
            rules={[{ required: true, message: '请输入部门名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="manager"
            label="负责人"
            rules={[{ required: true, message: '请输入负责人' }]}
          >
            <Input />
          </Form.Item>
          {editingDepartment && (
            <Form.Item name="status" label="状态">
              <Select>
                <Option value="正常">正常</Option>
                <Option value="停用">停用</Option>
              </Select>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default DepartmentManagement;
