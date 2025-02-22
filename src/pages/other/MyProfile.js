import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Button, Modal, Form, Input, message, Row, Col, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import userAvatar from '../../assets/images/user.png'; // 导入头像图片

const MyProfile = () => {
  // 从 localStorage 获取用户信息，如果没有则使用默认值
  const getInitialUserInfo = () => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      return JSON.parse(storedUserInfo);
    }
    return {
      username: 'admin',
      password: '123456',
      nickname: 'Charles',
      email: 'cwcharles0323@163.com',
    };
  };

  const [userInfo, setUserInfo] = useState(getInitialUserInfo);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  // 处理信息更新
  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      const newUserInfo = {
        ...userInfo,
        ...values,
      };
      // 更新 localStorage
      localStorage.setItem('userInfo', JSON.stringify(newUserInfo));
      setUserInfo(newUserInfo);
      message.success('更新成功');
      setModalVisible(false);
    } catch (error) {
      message.error('更新失败');
    }
  };

  // 打开编辑模态框
  const handleEdit = () => {
    form.setFieldsValue({
      username: userInfo.username,
      nickname: userInfo.nickname,
      email: userInfo.email,
    });
    setModalVisible(true);
  };

  // 监听 localStorage 变化
  useEffect(() => {
    const handleStorageChange = () => {
      setUserInfo(getInitialUserInfo());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <Avatar
                size={100}
                src={userAvatar} // 使用本地图片
                icon={<UserOutlined />} // 当图片加载失败时显示
              />
              <h2 style={{ marginTop: '16px' }}>{userInfo.nickname}</h2>
              <p>管理员</p>
            </div>
          </Card>
        </Col>
        <Col span={16}>
          <Card
            title="个人信息"
            extra={
              <Button type="primary" onClick={handleEdit}>
                编辑信息
              </Button>
            }
          >
            <Descriptions column={2}>
              <Descriptions.Item label="用户名">{userInfo.username}</Descriptions.Item>
              <Descriptions.Item label="密码">******</Descriptions.Item>
              <Descriptions.Item label="昵称">{userInfo.nickname}</Descriptions.Item>
              <Descriptions.Item label="邮箱">{userInfo.email}</Descriptions.Item>
              <Descriptions.Item label="角色">管理员</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>

      <Modal
        title="编辑个人信息"
        open={modalVisible}
        onOk={handleUpdate}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="nickname"
            label="昵称"
            rules={[{ required: true, message: '请输入昵称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MyProfile;
