import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import { Check, X } from 'lucide-react';
import { drivers, driverDetails } from '../data/mockData';
import { FMSelectSimple } from '../components/ui/FMSelectSimple';
import { FMButton } from '../components/ui/FMButton';
import { getStoredGroups, getAllStoredDetails } from '../utils/dataStorage';

function DriverManagement() {
  const navigate = useNavigate();
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState('전체');
  const [taxTypeFilter, setTaxTypeFilter] = useState('전체');
  const [statusFilter, setStatusFilter] = useState('활성');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [driversData, setDriversData] = useState([]);
  const [driverDetailsData, setDriverDetailsData] = useState({});

  // localStorage에서 데이터 로드
  useEffect(() => {
    const storedDrivers = getStoredGroups('driver');
    const storedDetails = getAllStoredDetails('driver');
    setDriversData(storedDrivers);
    setDriverDetailsData(storedDetails);
  }, []);

  // 필터링
  const filteredDrivers = useMemo(() => {
    return driversData.filter(driver => {
      if (vehicleTypeFilter !== '전체' && driver.vehicleType !== vehicleTypeFilter) return false;
      if (taxTypeFilter !== '전체') {
        if (taxTypeFilter === '미등록' && driver.taxType !== null) return false;
        if (taxTypeFilter !== '미등록' && driver.taxType !== taxTypeFilter) return false;
      }
      if (statusFilter === '활성' && driver.status !== 'active') return false;
      if (statusFilter === '비활성' && driver.status !== 'inactive') return false;

      // 검색 필터링
      if (searchKeyword.trim()) {
        const keyword = searchKeyword.toLowerCase();
        const driverNameMatch = driver.name.toLowerCase().includes(keyword);

        // 상세 정보에서 정산사업자명과 전화번호 검색
        const detail = driverDetailsData[driver.id];
        const activeSettlement = detail?.settlementBusinesses?.find(b => b.status === 'active')
          || detail?.settlementInfo;
        const settlementNameMatch = activeSettlement?.settlementBusinessName?.toLowerCase().includes(keyword) || false;
        const phoneMatch = (detail?.basicInfo?.phone || driver.phone || '').toLowerCase().includes(keyword);

        if (!driverNameMatch && !settlementNameMatch && !phoneMatch) {
          return false;
        }
      }

      return true;
    });
  }, [driversData, driverDetailsData, vehicleTypeFilter, taxTypeFilter, statusFilter, searchKeyword]);

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
        <h3 className="mb-4 text-base font-semibold text-gray-900">🔍 조회 필터</h3>

        <div className="flex flex-wrap gap-3 items-start xl:flex-nowrap">
          <FMSelectSimple
            label="차종"
            value={vehicleTypeFilter}
            onChange={setVehicleTypeFilter}
            options={[
              { value: '전체', label: '전체' },
              { value: '5.0톤', label: '5.0톤' },
              { value: '1.0톤', label: '1.0톤' }
            ]}
            className="flex-1 min-w-[150px]"
          />

          <FMSelectSimple
            label="과세유형"
            value={taxTypeFilter}
            onChange={setTaxTypeFilter}
            options={[
              { value: '전체', label: '전체' },
              { value: '과세', label: '과세' },
              { value: '면세', label: '면세' },
              { value: '미등록', label: '미등록' }
            ]}
            className="flex-1 min-w-[150px]"
          />

          <FMSelectSimple
            label="상태"
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: '활성', label: '활성' },
              { value: '비활성', label: '비활성' },
              { value: '전체', label: '전체' }
            ]}
            className="flex-1 min-w-[150px]"
          />

          <div className="flex flex-col gap-1 flex-1 min-w-[150px]">
            <label className="text-sm font-medium text-gray-600">검색</label>
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="드라이버명, 정산사업자명, 전화번호"
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500"
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
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">드라이버명</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">정산사업자명</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">과세유형</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">정산사업자정보</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">사업자등록증</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">전화번호</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">차종</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">상태</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">상세</th>
              </tr>
            </thead>
            <tbody>
              {sortedDrivers.map((record) => {
                const detail = driverDetailsData[record.id];

                // 활성 정산사업자 찾기
                const activeSettlement = detail?.settlementBusinesses?.find(b => b.status === 'active')
                  || detail?.settlementInfo;

                // 정산사업자명
                const settlementBusinessName = activeSettlement?.settlementBusinessName || '-';

                // 과세유형
                const taxType = activeSettlement?.taxType;

                // 정산사업자정보 완성도 체크
                const hasCompleteBusinessInfo = activeSettlement &&
                  activeSettlement.businessNumber &&
                  activeSettlement.businessName &&
                  activeSettlement.representative &&
                  activeSettlement.businessAddress;

                // 사업자등록증
                const hasCertificate = activeSettlement?.hasCertificate;

                // 전화번호
                const phone = detail?.basicInfo?.phone || record.phone;

                // 차종
                const vehicleType = detail?.basicInfo?.vehicleType || record.vehicleType;

                return (
                  <tr
                    key={record.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/driver/${record.id}`)}
                  >
                    <td className="px-4 py-3 text-sm">
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/driver/${record.id}`); }}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        {record.name}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{settlementBusinessName}</td>
                    <td className="px-4 py-3 text-center">
                      {taxType === '과세' ? (
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">과세</span>
                      ) : taxType === '면세' ? (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">면세</span>
                      ) : (
                        <X className="h-5 w-5 text-red-500 mx-auto" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {hasCompleteBusinessInfo ? (
                        <Check className="h-5 w-5 text-gray-500 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-red-500 mx-auto" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {hasCertificate ? (
                        <Check className="h-5 w-5 text-gray-500 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-red-500 mx-auto" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {phone ? (
                        <span className="text-sm text-gray-900">{phone}</span>
                      ) : (
                        <X className="h-5 w-5 text-red-500 mx-auto" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {vehicleType ? (
                        <span className="text-sm text-gray-900">{vehicleType}</span>
                      ) : (
                        <X className="h-5 w-5 text-red-500 mx-auto" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          record.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {record.status === 'active' ? '활성' : '비활성'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/driver/${record.id}`); }}
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
