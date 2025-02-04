import React from 'react'
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd'

import CommonHeader from '../components/commonHeader'
import CommonAside from '../components/commonAside';
import { useSelector } from 'react-redux'

const { Content } = Layout

const Main = () => {
    const collapsed = useSelector(state => state.tab.isCollapse)

    return (
        <Layout className="main-container">
            <CommonAside collapsed={collapsed} />
            <Layout>
                <CommonHeader collapsed={collapsed} />

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
    )
}

export default Main