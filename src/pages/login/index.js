import React from 'react';
import { Form, Input, Button, message } from 'antd';
import './login.css';
import { getMenu } from '../../api';
import { useNavigate, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  if (localStorage.getItem('token')) {
    return <Navigate to="/home" replace />;
  }

  // 获取用户信息
  const getUserInfo = () => {
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

  const handleSubmit = (values) => {
    if (!values.password || !values.username) {
      return message.warning('请输入用户名和密码');
    }

    // 验证用户名和密码
    const userInfo = getUserInfo();
    if (values.username !== userInfo.username || values.password !== userInfo.password) {
      return message.error('用户名或密码错误');
    }

    // 调用登录接口
    getMenu(values).then(({ data }) => {
      localStorage.setItem('token', data.data.token);
      message.success('登录成功');
      navigate('/home');
    });
  };

  return (
    <div className="login-page">
      <Form className="login-container" onFinish={handleSubmit}>
        <div className="login_title">{t('login.title')}</div>
        <Form.Item
          label={t('login.username')}
          name="username"
          rules={[{ required: true, message: t('login.usernamePlaceholder') }]}
        >
          <Input placeholder={t('login.usernamePlaceholder')} />
        </Form.Item>
        <Form.Item
          label={t('login.password')}
          name="password"
          rules={[{ required: true, message: t('login.passwordPlaceholder') }]}
        >
          <Input.Password placeholder={t('login.passwordPlaceholder')} />
        </Form.Item>
        <Form.Item className="login-button">
          <Button type="primary" htmlType="submit">
            {t('login.login')}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
