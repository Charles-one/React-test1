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
  InputNumber,
} from 'antd';
import {
  getShiftSwapList,
  addShiftSwap,
  updateShiftSwap,
  deleteShiftSwap,
  getEmployeeList,
  getOvertimeList,
} from '../../api';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import './ShiftSwapRequest.css';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const ShiftSwapRequest = () => {
  const [shiftSwaps, setShiftSwaps] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [overtimes, setOvertimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const location = useLocation();
  const { t } = useTranslation();

  // 获取调休申请列表
  const fetchShiftSwaps = async (searchParams = {}) => {
    setLoading(true);
    try {
      const res = await getShiftSwapList(searchParams);
      if (res.data.code === 20000) {
        setShiftSwaps(res.data.data.list);
      }
    } catch (error) {
      message.error('获取调休申请列表失败');
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

  // 获取加班记录
  const fetchOvertimes = async (employeeId) => {
    try {
      const res = await getOvertimeList({ employeeId, status: '已通过' });
      if (res.data.code === 20000) {
        setOvertimes(res.data.data.list);
      }
    } catch (error) {
      message.error('获取加班记录失败');
    }
  };

  useEffect(() => {
    fetchShiftSwaps();
    fetchEmployees();
  }, [location]);

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
      title: '调休天数',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: '关联加班日期',
      dataIndex: 'overtimeDate',
      key: 'overtimeDate',
    },
    {
      title: '申请原因',
      dataIndex: 'reason',
      key: 'reason',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text) => (
        <span
          style={{
            color: text === '已通过' ? '#52c41a' : text === '已拒绝' ? '#ff4d4f' : '#faad14',
          }}
        >
          {text}
        </span>
      ),
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
  ];

  // 处理搜索
  const handleSearch = async () => {
    try {
      const values = await searchForm.validateFields();
      const [startDate, endDate] = values.dateRange || [];
      const searchParams = {
        ...values,
        startDate: startDate?.format('YYYY-MM-DD'),
        endDate: endDate?.format('YYYY-MM-DD'),
      };
      delete searchParams.dateRange;
      fetchShiftSwaps(searchParams);
    } catch (error) {
      console.log('Search form validation failed:', error);
    }
  };

  // 处理审批
  const handleApprove = async (record, status) => {
    Modal.confirm({
      title: `确定要${status === '已通过' ? '通过' : '拒绝'}该调休申请吗？`,
      content: (
        <Form layout="vertical">
          <Form.Item label="审批意见">
            <Input.TextArea id="approveRemark" />
          </Form.Item>
        </Form>
      ),
      onOk: async () => {
        const approveRemark = document.getElementById('approveRemark').value;
        try {
          await updateShiftSwap({
            id: record.id,
            status,
            approveRemark,
          });
          message.success('审批成功');
          fetchShiftSwaps();
        } catch (error) {
          message.error('审批失败');
        }
      },
    });
  };

  // 提交调休申请
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const employee = employees.find((emp) => emp.id === values.employeeId);
      const formattedValues = {
        ...values,
        startTime: values.startTime.format('YYYY-MM-DD HH:mm:ss'),
        endTime: values.endTime.format('YYYY-MM-DD HH:mm:ss'),
        employeeName: employee.name,
        departmentName: employee.departmentName,
      };
      await addShiftSwap(formattedValues);
      message.success('申请提交成功');
      setModalVisible(false);
      form.resetFields();
      fetchShiftSwaps();
    } catch (error) {
      message.error('提交失败');
    }
  };

  // 删除申请
  const handleDelete = (record) => {
    Modal.confirm({
      title: t('common.deleteConfirm'),
      icon: <ExclamationCircleFilled />,
      okText: t('common.yes'),
      okType: 'danger',
      cancelText: t('common.no'),
      onOk() {
        deleteShiftSwap({ id: record.id }).then(() => {
          message.success(t('common.deleteSuccess'));
          fetchShiftSwaps();
        });
      },
    });
  };

  // 当选择员工时，获取该员工的加班记录
  const handleEmployeeChange = (employeeId) => {
    if (employeeId) {
      fetchOvertimes(employeeId);
    } else {
      setOvertimes([]);
    }
  };

  return (
    <div className="shiftswap-request">
      <div className="header">
        <Form form={searchForm} layout="inline">
          <Form.Item>
            <Button
              type="primary"
              onClick={() => {
                form.resetFields();
                setModalVisible(true);
              }}
            >
              提交调休申请
            </Button>
          </Form.Item>
          <Form.Item name="dateRange">
            <RangePicker />
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
            <Select style={{ width: 120 }} placeholder="申请状态" allowClear>
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

      <Table columns={columns} dataSource={shiftSwaps} loading={loading} rowKey="id" />

      <Modal
        title="提交调休申请"
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="employeeId"
            label="申请人"
            rules={[{ required: true, message: '请选择申请人' }]}
          >
            <Select onChange={handleEmployeeChange}>
              {employees.map((emp) => (
                <Option key={emp.id} value={emp.id}>
                  {emp.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="overtimeDate"
            label="关联加班日期"
            rules={[{ required: true, message: '请选择关联的加班日期' }]}
          >
            <Select>
              {overtimes.map((ot) => (
                <Option key={ot.id} value={ot.startTime.split(' ')[0]}>
                  {ot.startTime.split(' ')[0]}（{ot.duration}小时）
                </Option>
              ))}
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
            label="调休天数"
            rules={[{ required: true, message: '请输入调休天数' }]}
          >
            <InputNumber min={0.5} step={0.5} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="reason"
            label="申请原因"
            rules={[{ required: true, message: '请输入申请原因' }]}
          >
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ShiftSwapRequest;
