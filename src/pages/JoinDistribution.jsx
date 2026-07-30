import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
import { joinGroups, managers, territories } from '../data/mockData';
import { FMSelectSimple } from '../components/ui/FMSelectSimple';
import { FMButton } from '../components/ui/FMButton';

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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex flex-col gap-6 w-full">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">조인유통 관리</h2>
          <FMButton
            variant="primary"
            icon={<PlusOutlined className="h-4 w-4" />}
            onClick={handleRegister}
          >
            조인유통 등록
          </FMButton>
        </div>

      {/* 필터 영역 */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h3 className="mb-4 text-base font-semibold text-gray-900">🔍 조회 필터</h3>

        <div className="flex flex-wrap gap-3 items-start xl:flex-nowrap">
          <FMSelectSimple
            label="담당영업사원"
            value={selectedSalesPerson}
            onChange={setSelectedSalesPerson}
            options={[
              { value: '전체', label: '전체' },
              ...managers.map(m => ({ value: m, label: m }))
            ]}
            className="w-32"
          />

          <FMSelectSimple
            label="사업권역"
            value={selectedTerritory}
            onChange={setSelectedTerritory}
            options={[
              { value: '전체', label: '전체' },
              ...territories
                .sort((a, b) => a.displayOrder - b.displayOrder)
                .map(t => ({ value: t.name, label: t.name }))
            ]}
            className="w-32"
          />

          <FMSelectSimple
            label="상세지역"
            value={selectedRegion}
            onChange={setSelectedRegion}
            options={[
              { value: '전체', label: '전체' },
              { value: '서울', label: '서울' },
              { value: '경기', label: '경기' },
              { value: '인천', label: '인천' }
            ]}
            className="w-32"
          />

          <FMSelectSimple
            label="상태"
            value={selectedStatus}
            onChange={setSelectedStatus}
            options={[
              { value: '전체', label: '전체' },
              { value: '활성', label: '활성' },
              { value: '비활성', label: '비활성' }
            ]}
            className="w-28"
          />
        </div>
      </div>

      {/* 테이블 */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">조인유통그룹명</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">사업자수</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">담당영업사원</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">매입액(누적)</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">매출액(누적)</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">매입액(최근 3개월)</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">매출액(최근 3개월)</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">최근거래일</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">사업자등록증</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">상세</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((record) => (
                <tr
                  key={record.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleViewDetail(record)}
                >
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleViewDetail(record); }}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {record.name}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{record.businessCount}개</td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {record.salesPersons?.length > 0
                      ? record.salesPersons.join(', ')
                      : record.salesPerson}
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-gray-500">{(record.totalPurchase / 100000000).toFixed(1)}억</td>
                  <td className="px-4 py-3 text-right text-sm text-gray-500">{(record.totalSales / 100000000).toFixed(1)}억</td>
                  <td className="px-4 py-3 text-right text-sm text-gray-500">{(record.purchase3M / 100000000).toFixed(1)}억</td>
                  <td className="px-4 py-3 text-right text-sm text-gray-500">{(record.sales3M / 100000000).toFixed(1)}억</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{record.lastTradeDate}</td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={record.hasCertificate}
                      disabled
                      className="h-4 w-4"
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleViewDetail(record); }}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      상세
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </div>
  );
}

export default JoinDistribution;
