import React, { useState, useEffect } from 'react';
import { Layout, Menu, Input, Button, Form, Card } from 'antd';
import {
  HomeOutlined,
  TeamOutlined,
  ShopOutlined,
  AppstoreOutlined,
  SettingOutlined,
  LockOutlined,
  BookOutlined,
} from '@ant-design/icons';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import TerritoryManagement from './pages/TerritoryManagement';
import SellerManagement from './pages/SellerManagement';
import SellerDetail from './pages/SellerDetail';
import SellerRegister from './pages/SellerRegister';
import BuyerManagement from './pages/BuyerManagement';
import BuyerDetail from './pages/BuyerDetail';
import BuyerRegister from './pages/BuyerRegister';
import JoinDistribution from './pages/JoinDistribution';
import JoinDistributionDetail from './pages/JoinDistributionDetail';
import JoinDistributionRegister from './pages/JoinDistributionRegister';
import DriverManagement from './pages/DriverManagement';
import DriverDetail from './pages/DriverDetail';
import DriverRegister from './pages/DriverRegister';
import ProductManagement from './pages/ProductManagement';
import ProductList from './pages/ProductList';
import StandardPrice from './pages/StandardPrice';
import StandardPriceRegister from './pages/StandardPriceRegister';
import TransactionLedger from './pages/TransactionLedger';
import TransactionLedgerRegister from './pages/TransactionLedgerRegister';
import ClaimAdjustmentList from './pages/ClaimAdjustmentList';

const { Header, Sider, Content } = Layout;

const CORRECT_PASSWORD = 'fifa';
const AUTH_KEY = 'fifa_admin_auth';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false); // 초기 상태: 항상 펼쳐진 상태
  const [openKeys, setOpenKeys] = useState(['partners', 'product', 'ledger', 'data']); // 모든 서브메뉴 펼침
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 페이지 로드 시 sessionStorage에서 인증 상태 확인
    const authStatus = sessionStorage.getItem(AUTH_KEY);
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }

    // 윈도우 리사이즈 시 모바일/웹 전환 감지
    const handleResize = () => {
      if (window.innerWidth <= 768 && !collapsed) {
        setCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [collapsed]);

  const handleLogin = (values) => {
    setLoading(true);

    setTimeout(() => {
      if (values.password === CORRECT_PASSWORD) {
        sessionStorage.setItem(AUTH_KEY, 'true');
        setIsAuthenticated(true);
      } else {
        alert('비밀번호가 올바르지 않습니다.');
      }
      setLoading(false);
    }, 300);
  };

  // 인증되지 않은 경우 로그인 화면 표시
  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}>
        <Card
          style={{
            width: 400,
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            borderRadius: 12,
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <img
              src="/images/logo.png"
              alt="Fish Master Logo"
              style={{ width: 120, height: 120, marginBottom: 16, borderRadius: '50%', display: 'block', margin: '0 auto 16px' }}
            />
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>
              Fish Master
            </h2>
            <p style={{ color: '#888', marginTop: 8 }}>
              활어산지유통 관리시스템
            </p>
          </div>

          <Form onFinish={handleLogin} layout="vertical">
            <Form.Item
              name="password"
              rules={[{ required: true, message: '비밀번호를 입력해주세요' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="비밀번호를 입력하세요"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                }}
              >
                로그인
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    );
  }

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: '대시보드',
    },
    {
      key: 'ledger',
      icon: <BookOutlined />,
      label: '거래장부',
      children: [
        { key: '/transaction-ledger', label: '장부 조회' },
        { key: '/claim-adjustment', label: '클레임/조정' },
      ],
    },
    {
      key: 'partners',
      icon: <TeamOutlined />,
      label: '파트너 관리',
      children: [
        { key: '/seller', label: '셀러' },
        { key: '/buyer', label: '바이어' },
        { key: '/join-distribution', label: '조인유통' },
        { key: '/driver', label: '드라이버' },
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
        { key: '/standard-price', label: '표준가격' },
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
    if (location.pathname === '/seller' || location.pathname === '/buyer' || location.pathname === '/join-distribution' || location.pathname === '/driver') {
      return ['partners'];
    }
    if (location.pathname === '/territory' || location.pathname === '/standard-price') {
      return ['data'];
    }
    if (location.pathname === '/product' || location.pathname === '/product-list') {
      return ['product'];
    }
    if (location.pathname === '/transaction-ledger') {
      return ['ledger'];
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
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          gap: '12px'
        }}>
          {collapsed ? (
            <img
              src="/images/logo.png"
              alt="Logo"
              style={{ width: 32, height: 32, borderRadius: '50%' }}
            />
          ) : (
            <>
              <img
                src="/images/logo.png"
                alt="Logo"
                style={{ width: 32, height: 32, borderRadius: '50%' }}
              />
              <span>Fish Master</span>
            </>
          )}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={getSelectedKeys()}
          openKeys={openKeys}
          onOpenChange={setOpenKeys}
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
          justifyContent: 'flex-end',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: 14,
                fontWeight: 600
              }}>
                관
              </div>
              <span style={{ color: '#333', fontSize: 14, fontWeight: 500 }}>
                관리자님
              </span>
            </div>
            <Button
              onClick={() => {
                sessionStorage.removeItem(AUTH_KEY);
                setIsAuthenticated(false);
              }}
              style={{
                borderColor: '#d9d9d9',
                color: '#666'
              }}
            >
              로그아웃
            </Button>
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
            <Route path="/seller/register" element={<SellerRegister />} />
            <Route path="/seller/:id" element={<SellerDetail />} />
            <Route path="/buyer" element={<BuyerManagement />} />
            <Route path="/buyer/register" element={<BuyerRegister />} />
            <Route path="/buyer/:id" element={<BuyerDetail />} />
            <Route path="/join-distribution" element={<JoinDistribution />} />
            <Route path="/join-distribution/register" element={<JoinDistributionRegister />} />
            <Route path="/join-distribution/:id" element={<JoinDistributionDetail />} />
            <Route path="/driver" element={<DriverManagement />} />
            <Route path="/driver/register" element={<DriverRegister />} />
            <Route path="/driver/:id" element={<DriverDetail />} />
            <Route path="/product" element={<ProductManagement />} />
            <Route path="/product-list" element={<ProductList />} />
            <Route path="/transaction-ledger" element={<TransactionLedger />} />
            <Route path="/transaction-ledger/register" element={<TransactionLedgerRegister />} />
            <Route path="/claim-adjustment" element={<ClaimAdjustmentList />} />
            <Route path="/standard-price" element={<StandardPrice />} />
            <Route path="/standard-price/register" element={<StandardPriceRegister />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
