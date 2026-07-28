import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import { drivers, driverDetails } from '../data/mockData';
import { FMSelectSimple } from '../components/ui/FMSelectSimple';
import { FMButton } from '../components/ui/FMButton';

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
      return <span className="ml-1 text-gray-300">▼▲</span>;
    }
    return sortConfig.direction === 'desc' ? (
      <CaretDownOutlined className="ml-1 text-blue-600" />
    ) : (
      <CaretUpOutlined className="ml-1 text-blue-600" />
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex flex-col gap-6 w-full">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">드라이버 관리</h2>
          <FMButton
            variant="primary"
            icon={<PlusOutlined className="h-4 w-4" />}
            onClick={() => navigate('/driver/register')}
          >
            드라이버 등록
          </FMButton>
        </div>

      {/* 필터 영역 */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">차종:</label>
            <FMSelectSimple
              value={vehicleTypeFilter}
              onChange={setVehicleTypeFilter}
              options={[
                { value: '전체', label: '전체' },
                { value: '5.0톤', label: '5.0톤' },
                { value: '1.0톤', label: '1.0톤' }
              ]}
              className="w-32"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">과세유형:</label>
            <FMSelectSimple
              value={taxTypeFilter}
              onChange={setTaxTypeFilter}
              options={[
                { value: '전체', label: '전체' },
                { value: '과세', label: '과세' },
                { value: '면세', label: '면세' },
                { value: '미등록', label: '미등록' }
              ]}
              className="w-32"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">상태:</label>
            <FMSelectSimple
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: '활성', label: '활성' },
                { value: '비활성', label: '비활성' },
                { value: '전체', label: '전체' }
              ]}
              className="w-28"
            />
          </div>
        </div>
      </div>

      {/* 테이블 */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200">
                <th
                  className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer select-none"
                  onClick={() => handleSort('name')}
                >
                  드라이버명 {renderSortIcon('name')}
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer select-none"
                  onClick={() => handleSort('vehicleType')}
                >
                  차종 {renderSortIcon('vehicleType')}
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">보유통수</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">전화번호</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">정산사업자</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">과세유형</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">사업자등록증</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">상세</th>
              </tr>
            </thead>
            <tbody>
              {sortedDrivers.map((record) => {
                const detail = driverDetails[record.id];
                const hasCertificate = detail?.settlementInfo?.hasCertificate;

                return (
                  <tr
                    key={record.id}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      record.status === 'inactive' ? 'opacity-50' : ''
                    }`}
                  >
                    <td className="px-4 py-3 text-sm">
                      <button
                        onClick={() => navigate(`/driver/${record.id}`)}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        {record.name}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{record.vehicleType}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{record.tankCount}통</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{record.phone}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{record.settlementBusiness || '-'}</td>
                    <td className="px-4 py-3 text-sm">
                      {!record.taxType && (
                        <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700">
                          미등록
                        </span>
                      )}
                      {record.taxType === '과세' && (
                        <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700">
                          과세
                        </span>
                      )}
                      {record.taxType === '면세' && (
                        <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-100 text-green-700">
                          면세
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={hasCertificate || false}
                        disabled
                        className="h-4 w-4"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => navigate(`/driver/${record.id}`)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        상세
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </div>
  );
}

export default DriverManagement;
