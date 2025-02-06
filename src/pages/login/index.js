import React from 'react'
import { Form, Input, Button, message } from 'antd';
import "./login.css"
import { getMenu } from '../../api'
import { useNavigate, Navigate } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate()
  if (localStorage.getItem('token')) {
    return <Navigate to="/home" replace />
  }

  // 获取用户信息
  const getUserInfo = () => {
    const storedUserInfo = localStorage.getItem('userInfo')
    if (storedUserInfo) {
      return JSON.parse(storedUserInfo)
    }
    return {
      username: 'admin',
      password: '123456',
      nickname: 'Charles',
      email: 'cwcharles0323@163.com'
    }
  }

  const handleSubmit = (values) => {
    if (!values.password || !values.username) {
      return message.warning('请输入用户名和密码')
    }

    // 验证用户名和密码
    const userInfo = getUserInfo()
    if (values.username !== userInfo.username || values.password !== userInfo.password) {
      return message.error('用户名或密码错误')
    }

    // 调用登录接口
    getMenu(values).then(({ data }) => {
      localStorage.setItem('token', data.data.token)
      message.success('登录成功')
      navigate('/home')
    })
  }

  return (
    <Form
      className="login-container"
      onFinish={handleSubmit}
    >
      <div className="login_title">系统登录</div>
      <Form.Item
        label="账号"
        name="username"
        rules={[{ required: true, message: '请输入账号' }]}
      >
        <Input placeholder="请输入账号" />
      </Form.Item>
      <Form.Item
        label="密码"
        name="password"
        rules={[{ required: true, message: '请输入密码' }]}
      >
        <Input.Password placeholder="请输入密码" />
      </Form.Item>
      <Form.Item className="login-button">
        <Button type="primary" htmlType="submit">登录</Button>
      </Form.Item>
    </Form>
  )
}

export default Login