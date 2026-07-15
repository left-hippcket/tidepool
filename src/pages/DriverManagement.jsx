import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Select, Tag, Button } from 'antd';
import { PlusOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import { drivers, driverDetails } from '../data/mockData';

function DriverManagement() {
  const navigate = useNavigate();
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState('전체');
  const [taxTypeFilter, setTaxTypeFilter] = useState('전체');
  const [statusFilter, setStatusFilter] = useState('활성');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  // 필터링
  const filteredDrivers = useMemo(() => {
    return drivers.filter(driver => {
      if (vehicleTypeFilter !== '전체' && driver.vehicleType !== vehicleTypeFilter) return false;
      if (taxTypeFilter !== '전체') {
        if (taxTypeFilter === '미등록' && driver.taxType !== null) return false;
        if (taxTypeFilter !== '미등록' && driver.taxType !== taxTypeFilter) return false;
      }
      if (statusFilter === '활성' && driver.status !== 'active') return false;
      if (statusFilter === '비활성' && driver.status !== 'inactive') return false;
      return true;
    });
  }, [vehicleTypeFilter, taxTypeFilter, statusFilter]);

  // 정렬
  const sortedDrivers = useMemo(() => {
    const sorted = [...filteredDrivers];
    sorted.sort((a, b) => {
      let comparison = 0;

      if (sortConfig.key === 'name') {
        comparison = a.name.localeCompare(b.name, 'ko-KR');
        // 2차 정렬: 차종 내림차순
        if (comparison === 0) {
          const vehicleOrder = { '5.0톤': 2, '1.0톤': 1 };
          comparison = (vehicleOrder[b.vehicleType] || 0) - (vehicleOrder[a.vehicleType] || 0);
        }
      } else if (sortConfig.key === 'vehicleType') {
        const vehicleOrder = { '5.0톤': 2, '1.0톤': 1 };
        comparison = (vehicleOrder[a.vehicleType] || 0) - (vehicleOrder[b.vehicleType] || 0);
        // 2차 정렬: 드라이버명 가나다순
        if (comparison === 0) {
          comparison = a.name.localeCompare(b.name, 'ko-KR');
        }
      }

      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
    return sorted;
  }, [filteredDrivers, sortConfig]);

  // 정렬 토글
  const handleSort = (key) => {
    setSortConfig(prev => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'desc' };
    });
  };

  // 정렬 아이콘
  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <span style={{ color: '#d9d9d9', marginLeft: 4 }}>▼▲</span>;
    }
    return sortConfig.direction === 'desc' ? (
      <CaretDownOutlined style={{ marginLeft: 4, color: '#1890ff' }} />
    ) : (
      <CaretUpOutlined style={{ marginLeft: 4, color: '#1890ff' }} />
    );
  };

  // 테이블 컬럼 (데스크톱)
  const columns = [
    {
      title: () => (
        <span onClick={() => handleSort('name')} style={{ cursor: 'pointer', userSelect: 'none' }}>
          드라이버명 {renderSortIcon('name')}
        </span>
      ),
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <a onClick={() => navigate(`/driver/${record.id}`)} style={{ color: '#1890ff' }}>
          {text}
        </a>
      ),
    },
    {
      title: 'Ticker',
      dataIndex: 'ticker',
      key: 'ticker',
    },
    {
      title: () => (
        <span onClick={() => handleSort('vehicleType')} style={{ cursor: 'pointer', userSelect: 'none' }}>
          차종 {renderSortIcon('vehicleType')}
        </span>
      ),
      dataIndex: 'vehicleType',
      key: 'vehicleType',
    },
    {
      title: '보유통수',
      dataIndex: 'tankCount',
      key: 'tankCount',
      render: (count) => `${count}통`,
    },
    {
      title: '전화번호',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '정산사업자',
      dataIndex: 'settlementBusiness',
      key: 'settlementBusiness',
      render: (text) => text || '-',
    },
    {
      title: '과세유형',
      dataIndex: 'taxType',
      key: 'taxType',
      render: (type) => {
        if (!type) return <Tag color="#D9D9D9">미등록</Tag>;
        if (type === '과세') return <Tag color="#1890FF">과세</Tag>;
        if (type === '면세') return <Tag color="#52C41A">면세</Tag>;
        return '-';
      },
    },
    {
      title: '사업자등록증',
      dataIndex: 'id',
      key: 'certificate',
      width: 120,
      align: 'center',
      render: (id) => {
        const detail = driverDetails[id];
        const hasCertificate = detail?.settlementInfo?.hasCertificate;
        return (
          <input
            type="checkbox"
            checked={hasCertificate || false}
            disabled
            className="rounded border-gray-300"
          />
        );
      },
    },
    {
      title: '상세',
      key: 'action',
      width: 80,
      align: 'center',
      render: (_, record) => (
        <Button size="small" onClick={() => navigate(`/driver/${record.id}`)}>
          상세
        </Button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#f9fafb] p-4 md:p-6">
      {/* 헤더 */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">드라이버 관리</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/driver/register')}
          size="large"
        >
          드라이버 등록
        </Button>
      </div>

      {/* 필터 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">차종</label>
            <Select
              value={vehicleTypeFilter}
              onChange={setVehicleTypeFilter}
              style={{ width: '100%' }}
              options={[
                { value: '전체', label: '전체' },
                { value: '5.0톤', label: '5.0톤' },
                { value: '1.0톤', label: '1.0톤' },
              ]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">과세유형</label>
            <Select
              value={taxTypeFilter}
              onChange={setTaxTypeFilter}
              style={{ width: '100%' }}
              options={[
                { value: '전체', label: '전체' },
                { value: '과세', label: '과세' },
                { value: '면세', label: '면세' },
                { value: '미등록', label: '미등록' },
              ]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">상태</label>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: '100%' }}
              options={[
                { value: '활성', label: '활성' },
                { value: '비활성', label: '비활성' },
                { value: '전체', label: '전체' },
              ]}
            />
          </div>
        </div>
      </div>

      {/* 테이블 (데스크톱) */}
      <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-200">
        <Table
          columns={columns}
          dataSource={sortedDrivers}
          rowKey="id"
          pagination={{ pageSize: 20, showSizeChanger: false }}
          rowClassName={(record) => record.status === 'inactive' ? 'opacity-50' : ''}
        />
      </div>

      {/* 카드 리스트 (모바일) */}
      <div className="md:hidden space-y-3">
        {sortedDrivers.map((driver) => (
          <div
            key={driver.id}
            className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${
              driver.status === 'inactive' ? 'opacity-50' : ''
            }`}
            onClick={() => navigate(`/driver/${driver.id}`)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-semibold text-gray-900">{driver.name}</h3>
                  <span className="text-xs text-gray-500">{driver.ticker}</span>
                </div>
                <p className="text-sm text-gray-600">{driver.phone}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-sm font-medium text-gray-700">{driver.vehicleType}</span>
                <span className="text-xs text-gray-500">{driver.tankCount}통</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">정산사업자:</span>
                <span className="text-xs text-gray-900">{driver.settlementBusiness || '-'}</span>
              </div>
              <div className="flex items-center gap-2">
                {driver.taxType ? (
                  <Tag color={driver.taxType === '과세' ? '#1890FF' : '#52C41A'} style={{ margin: 0 }}>
                    {driver.taxType}
                  </Tag>
                ) : (
                  <Tag color="#D9D9D9" style={{ margin: 0 }}>미등록</Tag>
                )}
                <input
                  type="checkbox"
                  checked={driverDetails[driver.id]?.settlementInfo?.hasCertificate || false}
                  disabled
                  className="rounded border-gray-300"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DriverManagement;
