import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import {
  HomeOutlined,
  TeamOutlined,
  ShopOutlined,
  AppstoreOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import TerritoryManagement from './pages/TerritoryManagement';
import SellerManagement from './pages/SellerManagement';
import SellerDetail from './pages/SellerDetail';
import BuyerManagement from './pages/BuyerManagement';
import BuyerDetail from './pages/BuyerDetail';
import ProductManagement from './pages/ProductManagement';
import ProductList from './pages/ProductList';

const { Header, Sider, Content } = Layout;

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: '대시보드',
    },
    {
      key: 'partners',
      icon: <TeamOutlined />,
      label: '파트너 관리',
      children: [
        { key: '/seller', label: '셀러' },
        { key: '/buyer', label: '바이어' },
      ],
    },
    {
      key: 'product',
      icon: <AppstoreOutlined />,
      label: '상품 관리',
      children: [
        { key: '/product', label: '상품 관리' },
        { key: '/product-list', label: '상품 리스트' },
      ],
    },
    {
      key: 'data',
      icon: <SettingOutlined />,
      label: '기타 데이터',
      children: [
        { key: '/territory', label: '사업권역' },
      ],
    },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  const getSelectedKeys = () => {
    return [location.pathname];
  };

  const getOpenKeys = () => {
    if (location.pathname === '/seller' || location.pathname === '/buyer') {
      return ['partners'];
    }
    if (location.pathname === '/territory') {
      return ['data'];
    }
    if (location.pathname === '/product' || location.pathname === '/product-list') {
      return ['product'];
    }
    return [];
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={240}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: collapsed ? 16 : 20,
          fontWeight: 'bold',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          {collapsed ? '🐟' : '🐟 피시파더 ERP'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={getSelectedKeys()}
          defaultOpenKeys={getOpenKeys()}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 240, transition: 'all 0.2s' }}>
        <Header style={{
          padding: '0 24px',
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: 18, fontWeight: 500 }}>
            활어산지유통 관리시스템
          </div>
          <div style={{ color: '#888' }}>
            관리자님 환영합니다
          </div>
        </Header>
        <Content style={{
          margin: '24px 16px',
          padding: 24,
          background: '#fff',
          minHeight: 280,
          borderRadius: 8
        }}>
          <Routes>
            <Route path="/" element={<div style={{ fontSize: 24 }}>대시보드 (준비중)</div>} />
            <Route path="/territory" element={<TerritoryManagement />} />
            <Route path="/seller" element={<SellerManagement />} />
            <Route path="/seller/:id" element={<SellerDetail />} />
            <Route path="/buyer" element={<BuyerManagement />} />
            <Route path="/buyer/:id" element={<BuyerDetail />} />
            <Route path="/product" element={<ProductManagement />} />
            <Route path="/product-list" element={<ProductList />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
