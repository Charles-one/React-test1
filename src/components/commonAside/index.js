import React from 'react';
import { Menu, Layout } from 'antd';
import * as Icon from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MenuConfig from '../../config';
import { useDispatch } from 'react-redux';
import { selectMenuList } from '../../store/reducers/tab';

const { Sider } = Layout;
const iconToElement = (name) => React.createElement(Icon[name]);

const CommonAside = ({ collapsed }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 将 items 的定义移到组件内部
  const items = MenuConfig.map((icon) => {
    const child = {
      key: `${icon.path}`,
      icon: iconToElement(icon.icon),
      label: t(icon.label),
    };
    if (icon.children) {
      child.children = icon.children.map((item) => {
        return {
          key: item.path,
          label: t(item.label),
        };
      });
    }
    return child;
  });

  // 添加数据到store
  const setTabsList = (val) => {
    dispatch(selectMenuList(val));
  };

  // 点击菜单
  const selectMenu = (e) => {
    let data;
    MenuConfig.forEach((item) => {
      // 找到当前的数据
      if (item.path === e.keyPath[e.keyPath.length - 1]) {
        data = item;
        // 如果是有二级菜单
        if (e.keyPath.length > 1) {
          data = item.children.find((child) => {
            return child.path === e.key;
          });
        }
      }
    });
    setTabsList({
      path: data.path,
      name: data.name,
      label: data.label,
    });
    // 页面跳转
    navigate(e.key);
  };

  return (
    <Sider width={200} collapsed={collapsed}>
      <h3 className="app-name">{collapsed ? 'Charles' : t('common.systemName')}</h3>
      <Menu
        mode="inline"
        theme="dark"
        style={{
          height: '100%',
          borderRight: 0,
        }}
        items={items}
        onClick={selectMenu}
      />
    </Sider>
  );
};

export default CommonAside;
