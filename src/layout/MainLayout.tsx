import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import Header from './header/Header';
import Sidenav from './Sidenav';
import { useSidebarStore } from '@/store/sidebar.store'

const { Header: AntHeader, Content, Sider, Footer } = Layout;

function MainLayout() {
  const { collapsed } = useSidebarStore();

  return (
    <Layout className='layout-dashboard'>
      <AntHeader className='px-4 md:pl-8 md:pr-10 bg-white h-24 md:h-[72px] border-none md:border-solid border-0 border-b border-ventidole-neutral-30'>
        <Header />
      </AntHeader>

      <Layout className='h-[calc(100vh-72px)] overflow-hidden'>
        <Sider trigger={null} collapsible collapsed={collapsed} collapsedWidth={88} width={280} className=''>
          <Sidenav />
        </Sider>
        <Layout>
          <Content className='overflow-y-auto'>
            <div className='content-ant px-4 pt-5 md:px-10 md:py-10 min-h-full'>
              <Outlet />
            </div>
            <Footer className='bg-ventidole-primary-950 h-16 text-center text-xs text-white font-ventidole-montserrat mt-20'>
              Copyright © 2024 MODU Corp. All Rights Reserved.
            </Footer>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default MainLayout;
