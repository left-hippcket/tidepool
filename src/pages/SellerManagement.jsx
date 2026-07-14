import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Input, Select, Space, Tag, Checkbox, message } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { sellerGroups, managers, territories } from '../data/mockData';

function SellerManagement() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [selectedManager, setSelectedManager] = useState('전체');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedTerritory, setSelectedTerritory] = useState('전체');
  const [selectedRegion, setSelectedRegion] = useState('전체');
  const [selectedStatus, setSelectedStatus] = useState('활성');
  const [sortField, setSortField] = useState('totalPurchase');
  const [sortOrder, setSortOrder] = useState('descend');

  // 이벤트 핸들러
  const handleViewDetail = (record) => {
    navigate(`/seller/${record.id}`);
  };

  const handleRegister = () => {
    navigate('/seller/register');
  };

  // 셀러 그룹 테이블 컬럼
  const columns = [
    {
      title: '셀러그룹명',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text, record) => (
        <a
          style={{ color: '#1890ff', cursor: 'pointer' }}
          onClick={() => handleViewDetail(record)}
        >
          {text}
        </a>
      ),
    },
    {
      title: '사업자수',
      dataIndex: 'businessCount',
      key: 'businessCount',
      width: 100,
      render: (count) => `${count}개`,
    },
    {
      title: '소싱담당자',
      dataIndex: 'manager',
      key: 'manager',
      width: 120,
    },
    {
      title: '주요품목분류',
      dataIndex: 'mainCategory',
      key: 'mainCategory',
      width: 130,
    },
    {
      title: '사업권역',
      dataIndex: 'territory',
      key: 'territory',
      width: 120,
    },
    {
      title: '상세지역',
      dataIndex: 'region',
      key: 'region',
      width: 130,
    },
    {
      title: '매입액(누적)',
      dataIndex: 'totalPurchase',
      key: 'totalPurchase',
      width: 150,
      sorter: true,
      sortOrder: sortField === 'totalPurchase' ? sortOrder : null,
      render: (amount) => `${(amount / 100000000).toFixed(1)}억`,
    },
    {
      title: '매입액(최근 3개월)',
      dataIndex: 'purchase3M',
      key: 'purchase3M',
      width: 160,
      sorter: true,
      sortOrder: sortField === 'purchase3M' ? sortOrder : null,
      render: (amount) => `${(amount / 100000000).toFixed(1)}억`,
    },
    {
      title: '매입액(최근 1개월)',
      dataIndex: 'purchase1M',
      key: 'purchase1M',
      width: 160,
      sorter: true,
      sortOrder: sortField === 'purchase1M' ? sortOrder : null,
      render: (amount) => `${(amount / 100000000).toFixed(1)}억`,
    },
    {
      title: '최근거래일',
      dataIndex: 'lastTradeDate',
      key: 'lastTradeDate',
      width: 120,
      sorter: true,
      sortOrder: sortField === 'lastTradeDate' ? sortOrder : null,
    },
    {
      title: '사업자등록증',
      dataIndex: 'hasCertificate',
      key: 'hasCertificate',
      width: 100,
      render: (has) => <Checkbox checked={has} disabled />,
    },
    {
      title: '상세',
      key: 'action',
      width: 80,
      fixed: 'right',
      render: (_, record) => (
        <Button type="link" onClick={() => handleViewDetail(record)}>
          상세
        </Button>
      ),
    },
  ];

  // 필터링 로직
  const filteredData = sellerGroups.filter(item => {
    const matchSearch = !searchText ||
      item.name.includes(searchText) ||
      item.territory.includes(searchText) ||
      item.region.includes(searchText);

    const matchManager = selectedManager === '전체' || item.manager === selectedManager;
    const matchCategory = selectedCategory === '전체' || item.mainCategory === selectedCategory;
    const matchTerritory = selectedTerritory === '전체' || item.territory === selectedTerritory;
    const matchRegion = selectedRegion === '전체' || item.region === selectedRegion;
    const matchStatus = selectedStatus === '전체' ||
      (selectedStatus === '활성' && item.status === 'active') ||
      (selectedStatus === '비활성' && item.status === 'inactive');

    return matchSearch && matchManager && matchCategory && matchTerritory && matchRegion && matchStatus;
  });

  // 정렬 로직
  const sortedData = [...filteredData].sort((a, b) => {
    if (sortField === 'lastTradeDate') {
      const comparison = a[sortField].localeCompare(b[sortField]);
      return sortOrder === 'ascend' ? comparison : -comparison;
    } else {
      const comparison = a[sortField] - b[sortField];
      return sortOrder === 'ascend' ? comparison : -comparison;
    }
  });

  // 테이블 변경 핸들러
  const handleTableChange = (pagination, filters, sorter) => {
    if (sorter.field) {
      setSortField(sorter.field);
      setSortOrder(sorter.order || 'descend');
    }
  };

  return (
    <div>
      <h2>셀러 관리</h2>

      {/* 필터 영역 */}
      <div style={{
        background: '#fafafa',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16
      }}>
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Space wrap>
            <span>검색어:</span>
            <Input
              placeholder="셀러그룹명, 사업권역, 상세지역"
              style={{ width: 250 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
              allowClear
            />
          </Space>

          <Space wrap>
            <span>소싱담당자:</span>
            <Select
              style={{ width: 120 }}
              value={selectedManager}
              onChange={setSelectedManager}
            >
              <Select.Option value="전체">전체</Select.Option>
              {managers.map(m => (
                <Select.Option key={m} value={m}>{m}</Select.Option>
              ))}
            </Select>

            <span style={{ marginLeft: 16 }}>주요품목분류:</span>
            <Select
              style={{ width: 120 }}
              value={selectedCategory}
              onChange={setSelectedCategory}
            >
              <Select.Option value="전체">전체</Select.Option>
              <Select.Option value="누운고기">누운고기</Select.Option>
              <Select.Option value="뜬고기">뜬고기</Select.Option>
              <Select.Option value="갑각류">갑각류</Select.Option>
            </Select>

            <span style={{ marginLeft: 16 }}>사업권역:</span>
            <Select
              style={{ width: 120 }}
              value={selectedTerritory}
              onChange={setSelectedTerritory}
            >
              <Select.Option value="전체">전체</Select.Option>
              {territories.map(t => (
                <Select.Option key={t.id} value={t.name}>{t.name}</Select.Option>
              ))}
            </Select>

            <span style={{ marginLeft: 16 }}>상세지역:</span>
            <Select
              style={{ width: 120 }}
              value={selectedRegion}
              onChange={setSelectedRegion}
            >
              <Select.Option value="전체">전체</Select.Option>
              <Select.Option value="인천">인천</Select.Option>
              <Select.Option value="완도/진도">완도/진도</Select.Option>
              <Select.Option value="통영">통영</Select.Option>
              <Select.Option value="거제">거제</Select.Option>
              <Select.Option value="고흥">고흥</Select.Option>
            </Select>

            <span style={{ marginLeft: 16 }}>상태:</span>
            <Select
              style={{ width: 100 }}
              value={selectedStatus}
              onChange={setSelectedStatus}
            >
              <Select.Option value="전체">전체</Select.Option>
              <Select.Option value="활성">활성</Select.Option>
              <Select.Option value="비활성">비활성</Select.Option>
            </Select>
          </Space>
        </Space>
      </div>

      {/* 상단 버튼 영역 */}
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Tag color="blue">총 {sortedData.length}개 그룹</Tag>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleRegister}>
          셀러 등록
        </Button>
      </div>

      {/* 테이블 */}
      <Table
        columns={columns}
        dataSource={sortedData}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `총 ${total}개`,
        }}
        scroll={{ x: 1800 }}
        onChange={handleTableChange}
      />
    </div>
  );
}

export default SellerManagement;
