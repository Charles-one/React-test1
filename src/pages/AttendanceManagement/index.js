import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Space,
  DatePicker,
  TimePicker,
} from 'antd';
import {
  getAttendanceList,
  addAttendance,
  updateAttendance,
  deleteAttendance,
  getEmployeeList,
} from '../../api';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import './AttendanceManagement.css';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Option } = Select;

const AttendanceManagement = () => {
  const [attendances, setAttendances] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingAttendance, setEditingAttendance] = useState(null);
  const location = useLocation();
  const { t } = useTranslation();

  // 搜索表单
  const [searchForm] = Form.useForm();

  // 获取考勤列表
  const fetchAttendances = async (searchParams = {}) => {
    setLoading(true);
    try {
      const res = await getAttendanceList(searchParams);
      if (res.data.code === 20000) {
        setAttendances(res.data.data.list);
      }
    } catch (error) {
      message.error('获取考勤列表失败');
    }
    setLoading(false);
  };

  // 获取员工列表
  const fetchEmployees = async () => {
    try {
      const res = await getEmployeeList();
      if (res.data.code === 20000) {
        setEmployees(res.data.data.list);
      }
    } catch (error) {
      message.error('获取员工列表失败');
    }
  };

  useEffect(() => {
    fetchAttendances();
    fetchEmployees();
  }, [location]);

  // 表格列配置
  const columns = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
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
      title: '签到时间',
      dataIndex: 'checkIn',
      key: 'checkIn',
    },
    {
      title: '签退时间',
      dataIndex: 'checkOut',
      key: 'checkOut',
    },
    {
      title: '考勤状态',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: '备注',
      dataIndex: 'note',
      key: 'note',
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

  // 处理搜索
  const handleSearch = async () => {
    try {
      const values = await searchForm.validateFields();
      const searchParams = {
        ...values,
        date: values.date?.format('YYYY-MM-DD'),
      };
      fetchAttendances(searchParams);
    } catch (error) {
      console.log('Search form validation failed:', error);
    }
  };

  // 处理添加/编辑
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formattedValues = {
        ...values,
        date: values.date.format('YYYY-MM-DD'),
        checkIn: values.checkIn.format('HH:mm:ss'),
        checkOut: values.checkOut.format('HH:mm:ss'),
      };

      if (editingAttendance) {
        await updateAttendance({ ...formattedValues, id: editingAttendance.id });
        message.success('更新成功');
      } else {
        // 获取员工信息
        const employee = employees.find((emp) => emp.id === values.employeeId);
        await addAttendance({
          ...formattedValues,
          employeeName: employee.name,
          departmentName: employee.departmentName,
        });
        message.success('添加成功');
      }
      setModalVisible(false);
      form.resetFields();
      fetchAttendances();
    } catch (error) {
      message.error('操作失败');
    }
  };

  // 编辑考勤
  const handleEdit = (attendance) => {
    setEditingAttendance(attendance);
    form.setFieldsValue({
      ...attendance,
      date: dayjs(attendance.date),
      checkIn: dayjs(attendance.checkIn, 'HH:mm:ss'),
      checkOut: dayjs(attendance.checkOut, 'HH:mm:ss'),
    });
    setModalVisible(true);
  };

  // 删除考勤
  const handleDelete = (record) => {
    Modal.confirm({
      title: t('common.deleteConfirm'),
      icon: <ExclamationCircleFilled />,
      okText: t('common.yes'),
      okType: 'danger',
      cancelText: t('common.no'),
      onOk() {
        deleteAttendance({ id: record.id }).then(() => {
          message.success(t('common.deleteSuccess'));
          fetchAttendances();
        });
      },
    });
  };

  return (
    <div className="attendance-management">
      <div className="header">
        <Form form={searchForm} layout="inline">
          <Form.Item>
            <Button
              type="primary"
              onClick={() => {
                setEditingAttendance(null);
                form.resetFields();
                setModalVisible(true);
              }}
            >
              添加考勤记录
            </Button>
          </Form.Item>
          <Form.Item name="date">
            <DatePicker placeholder="选择日期" />
          </Form.Item>
          <Form.Item name="employeeId">
            <Select style={{ width: 120 }} placeholder="选择员工" allowClear>
              {employees.map((emp) => (
                <Option key={emp.id} value={emp.id}>
                  {emp.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="status">
            <Select style={{ width: 120 }} placeholder="考勤状态" allowClear>
              <Option value="正常">正常</Option>
              <Option value="迟到">迟到</Option>
              <Option value="早退">早退</Option>
              <Option value="缺勤">缺勤</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={handleSearch}>
              搜索
            </Button>
          </Form.Item>
        </Form>
      </div>

      <Table columns={columns} dataSource={attendances} loading={loading} rowKey="id" />

      <Modal
        title={editingAttendance ? '编辑考勤记录' : '添加考勤记录'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="date" label="日期" rules={[{ required: true, message: '请选择日期' }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          {!editingAttendance && (
            <Form.Item
              name="employeeId"
              label="员工"
              rules={[{ required: true, message: '请选择员工' }]}
            >
              <Select>
                {employees.map((emp) => (
                  <Option key={emp.id} value={emp.id}>
                    {emp.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}
          <Form.Item
            name="checkIn"
            label="签到时间"
            rules={[{ required: true, message: '请选择签到时间' }]}
          >
            <TimePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="checkOut"
            label="签退时间"
            rules={[{ required: true, message: '请选择签退时间' }]}
          >
            <TimePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="status"
            label="考勤状态"
            rules={[{ required: true, message: '请选择考勤状态' }]}
          >
            <Select>
              <Option value="正常">正常</Option>
              <Option value="迟到">迟到</Option>
              <Option value="早退">早退</Option>
              <Option value="缺勤">缺勤</Option>
            </Select>
          </Form.Item>
          <Form.Item name="note" label="备注">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AttendanceManagement;
