import React from 'react';
import { Button, Layout, Dropdown, Avatar, Space } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import './index.css';
import { useDispatch } from 'react-redux';
import { collapseMenu } from '../../store/reducers/tab';
import { useNavigate } from 'react-router-dom';
import LanguageSwitch from '../LanguageSwitch';
import { useTranslation } from 'react-i18next';

const { Header } = Layout;

const CommonHeader = ({ collapsed }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const setCollapsed = () => {
    dispatch(collapseMenu());
  };
  const navigate = useNavigate();
  const items = [
    {
      key: '1',
      label: (
        <a target="_blank" rel="noopener noreferrer">
          {t('common.profile')}
        </a>
      ),
    },
    {
      key: '2',
      label: (
        <a onClick={() => logout(!collapsed)} target="_blank" rel="noopener noreferrer">
          {t('common.logout')}
        </a>
      ),
    },
  ];
  // 登出
  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  return (
    <Header className="header-container">
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed(!collapsed)}
        style={{
          fontSize: '16px',
          width: 64,
          height: 32,
          backgroundColor: '#fff',
        }}
      />
      <Space>
        <LanguageSwitch />
        <Dropdown menu={{ items }}>
          <Avatar size={36} src={require('../../assets/images/user.png')} />
        </Dropdown>
      </Space>
    </Header>
  );
};

export default CommonHeader;
