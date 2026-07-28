import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
import { sellerGroups, managers, territories } from '../data/mockData';
import { FMSelectSimple } from '../components/ui/FMSelectSimple';
import { FMButton } from '../components/ui/FMButton';

function SellerManagement() {
  const navigate = useNavigate();
  const [selectedManager, setSelectedManager] = useState('전체');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedTerritory, setSelectedTerritory] = useState('전체');
  const [selectedRegion, setSelectedRegion] = useState('전체');
  const [selectedStatus, setSelectedStatus] = useState('활성');

  // 이벤트 핸들러
  const handleViewDetail = (record) => {
    navigate(`/seller/${record.id}`);
  };

  const handleRegister = () => {
    navigate('/seller/register');
  };

  // 필터링 로직
  const filteredData = sellerGroups.filter(item => {
    const matchManager = selectedManager === '전체' || item.manager === selectedManager;
    const matchCategory = selectedCategory === '전체' || item.mainCategory === selectedCategory;
    const matchTerritory = selectedTerritory === '전체' || item.territory === selectedTerritory;
    const matchRegion = selectedRegion === '전체' || item.region === selectedRegion;
    const matchStatus = selectedStatus === '전체' ||
      (selectedStatus === '활성' && item.status === 'active') ||
      (selectedStatus === '비활성' && item.status === 'inactive');

    return matchManager && matchCategory && matchTerritory && matchRegion && matchStatus;
  });

  const sortedData = filteredData;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex flex-col gap-6 w-full">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">셀러 관리</h2>
          <FMButton
            variant="primary"
            icon={<PlusOutlined className="h-4 w-4" />}
            onClick={handleRegister}
          >
            셀러 등록
          </FMButton>
        </div>

      {/* 필터 영역 */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">소싱담당자:</label>
              <FMSelectSimple
                value={selectedManager}
                onChange={setSelectedManager}
                options={[
                  { value: '전체', label: '전체' },
                  ...managers.map(m => ({ value: m, label: m }))
                ]}
                className="w-32"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">주요품목분류:</label>
              <FMSelectSimple
                value={selectedCategory}
                onChange={setSelectedCategory}
                options={[
                  { value: '전체', label: '전체' },
                  { value: '누운고기', label: '누운고기' },
                  { value: '뜬고기', label: '뜬고기' },
                  { value: '갑각류', label: '갑각류' }
                ]}
                className="w-32"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">사업권역:</label>
              <FMSelectSimple
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
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">상세지역:</label>
              <FMSelectSimple
                value={selectedRegion}
                onChange={setSelectedRegion}
                options={[
                  { value: '전체', label: '전체' },
                  { value: '인천', label: '인천' },
                  { value: '완도/진도', label: '완도/진도' },
                  { value: '통영', label: '통영' },
                  { value: '거제', label: '거제' },
                  { value: '고흥', label: '고흥' }
                ]}
                className="w-32"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">상태:</label>
              <FMSelectSimple
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
      </div>

      {/* 테이블 */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">셀러그룹명</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">사업자수</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">소싱담당자</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">주요품목분류</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">사업권역</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">상세지역</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">매입액(누적)</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">매입액(최근 3개월)</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">매입액(최근 1개월)</th>
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
                  <td className="px-4 py-3 text-sm text-gray-900">{record.manager}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{record.mainCategory}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{record.territory}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{record.region}</td>
                  <td className="px-4 py-3 text-right text-sm text-gray-500">{(record.totalPurchase / 100000000).toFixed(1)}억</td>
                  <td className="px-4 py-3 text-right text-sm text-gray-500">{(record.purchase3M / 100000000).toFixed(1)}억</td>
                  <td className="px-4 py-3 text-right text-sm text-gray-500">{(record.purchase1M / 100000000).toFixed(1)}억</td>
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

export default SellerManagement;
