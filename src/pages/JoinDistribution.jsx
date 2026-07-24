import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Select, Card, Space, Flex, Typography, Table, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { joinGroups, managers, territories } from '../data/mockData';

const { Title, Text } = Typography;

function JoinDistribution() {
  const navigate = useNavigate();
  const [selectedSalesPerson, setSelectedSalesPerson] = useState('전체');
  const [selectedTerritory, setSelectedTerritory] = useState('전체');
  const [selectedRegion, setSelectedRegion] = useState('전체');
  const [selectedStatus, setSelectedStatus] = useState('활성');

  // 이벤트 핸들러
  const handleViewDetail = (record) => {
    navigate(`/join-distribution/${record.id}`);
  };

  const handleRegister = () => {
    navigate('/join-distribution/register');
  };

  // 필터링 로직
  const filteredData = joinGroups.filter(item => {
    const matchSalesPerson = selectedSalesPerson === '전체' || item.salesPerson === selectedSalesPerson;
    const matchTerritory = selectedTerritory === '전체' || item.territory === selectedTerritory;
    const matchRegion = selectedRegion === '전체' || item.region === selectedRegion;
    const matchStatus = selectedStatus === '전체' ||
      (selectedStatus === '활성' && item.status === 'active') ||
      (selectedStatus === '비활성' && item.status === 'inactive');

    return matchSalesPerson && matchTerritory && matchRegion && matchStatus;
  });

  const sortedData = filteredData;

  return (
    <div style={{ minHeight: '100vh', padding: '16px 24px', background: '#f5f5f5' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Title level={2}>조인유통 관리</Title>

      {/* 필터 영역 */}
      <Card>
        <Space wrap size="middle">
          <Space size="small">
            <Text>담당영업사원:</Text>
            <Select
              style={{ width: 128 }}
              value={selectedSalesPerson}
              onChange={setSelectedSalesPerson}
            >
              <Select.Option value="전체">전체</Select.Option>
              {managers.map(m => (
                <Select.Option key={m} value={m}>{m}</Select.Option>
              ))}
            </Select>
          </Space>

          <Space size="small">
            <Text>사업권역:</Text>
            <Select
              style={{ width: 128 }}
              value={selectedTerritory}
              onChange={setSelectedTerritory}
            >
              <Select.Option value="전체">전체</Select.Option>
              {territories
                .sort((a, b) => a.displayOrder - b.displayOrder)
                .map(t => (
                  <Select.Option key={t.id} value={t.name}>{t.name}</Select.Option>
                ))}
            </Select>
          </Space>

          <Space size="small">
            <Text>상세지역:</Text>
            <Select
              style={{ width: 128 }}
              value={selectedRegion}
              onChange={setSelectedRegion}
            >
              <Select.Option value="전체">전체</Select.Option>
              <Select.Option value="서울">서울</Select.Option>
              <Select.Option value="경기">경기</Select.Option>
              <Select.Option value="인천">인천</Select.Option>
            </Select>
          </Space>

          <Space size="small">
            <Text>상태:</Text>
            <Select
              style={{ width: 112 }}
              value={selectedStatus}
              onChange={setSelectedStatus}
            >
              <Select.Option value="전체">전체</Select.Option>
              <Select.Option value="활성">활성</Select.Option>
              <Select.Option value="비활성">비활성</Select.Option>
            </Select>
          </Space>
        </Space>
      </Card>

      {/* 상단 버튼 영역 */}
      <Flex justify="space-between" align="center">
        <Tag color="blue">총 {sortedData.length}개 그룹</Tag>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleRegister}>
          조인유통 등록
        </Button>
      </Flex>

      {/* 테이블 */}
      <Card>
        <Table
          dataSource={sortedData}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          onRow={(record) => ({
            onClick: () => handleViewDetail(record),
            style: { cursor: 'pointer' }
          })}
          columns={[
            {
              title: '조인유통그룹명',
              dataIndex: 'name',
              key: 'name',
              render: (text, record) => (
                <Button type="link" onClick={(e) => { e.stopPropagation(); handleViewDetail(record); }}>
                  {text}
                </Button>
              ),
            },
            { title: '사업자수', dataIndex: 'businessCount', key: 'businessCount', render: (val) => `${val}개` },
            { title: '담당영업사원', dataIndex: 'salesPerson', key: 'salesPerson' },
            {
              title: <Text type="secondary">매입액(누적)</Text>,
              dataIndex: 'totalPurchase',
              key: 'totalPurchase',
              align: 'right',
              render: (val) => <Text type="secondary">{(val / 100000000).toFixed(1)}억</Text>
            },
            {
              title: <Text type="secondary">매출액(누적)</Text>,
              dataIndex: 'totalSales',
              key: 'totalSales',
              align: 'right',
              render: (val) => <Text type="secondary">{(val / 100000000).toFixed(1)}억</Text>
            },
            {
              title: <Text type="secondary">매입액(최근 3개월)</Text>,
              dataIndex: 'purchase3M',
              key: 'purchase3M',
              align: 'right',
              render: (val) => <Text type="secondary">{(val / 100000000).toFixed(1)}억</Text>
            },
            {
              title: <Text type="secondary">매출액(최근 3개월)</Text>,
              dataIndex: 'sales3M',
              key: 'sales3M',
              align: 'right',
              render: (val) => <Text type="secondary">{(val / 100000000).toFixed(1)}억</Text>
            },
            { title: '최근거래일', dataIndex: 'lastTradeDate', key: 'lastTradeDate' },
            {
              title: '사업자등록증',
              dataIndex: 'hasCertificate',
              key: 'hasCertificate',
              align: 'center',
              render: (val) => <input type="checkbox" checked={val} disabled />
            },
            {
              title: '상세',
              key: 'action',
              align: 'center',
              render: (_, record) => (
                <Button type="link" size="small" onClick={(e) => { e.stopPropagation(); handleViewDetail(record); }}>
                  상세
                </Button>
              ),
            },
          ]}
        />
      </Card>
      </Space>
    </div>
  );
}

export default JoinDistribution;
