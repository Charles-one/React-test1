import React from 'react'
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd'
import CommonTag from '../components/commonTag';
import CommonHeader from '../components/commonHeader'
import CommonAside from '../components/commonAside';
import { useSelector } from 'react-redux'
import { RouterAuth } from '../router/routerAuth'

const { Content } = Layout

const Main = () => {
  const collapsed = useSelector(state => state.tab.isCollapse)

  return (
    <RouterAuth>
      <Layout className="main-container">
        <CommonAside collapsed={collapsed} />
        <Layout>
          <CommonHeader collapsed={collapsed} />
          <CommonTag />
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </RouterAuth>
  )
}

export default Main