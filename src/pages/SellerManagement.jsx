import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { sellerGroups, managers, territories } from '../data/mockData';

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
    <div className="min-h-screen bg-[#f9fafb] p-4 md:p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">셀러 관리</h2>

      {/* 필터 영역 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
        <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">소싱담당자:</span>
              <Select
                className="w-32"
                value={selectedManager}
                onChange={setSelectedManager}
              >
                <Select.Option value="전체">전체</Select.Option>
                {managers.map(m => (
                  <Select.Option key={m} value={m}>{m}</Select.Option>
                ))}
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">주요품목분류:</span>
              <Select
                className="w-32"
                value={selectedCategory}
                onChange={setSelectedCategory}
              >
                <Select.Option value="전체">전체</Select.Option>
                <Select.Option value="누운고기">누운고기</Select.Option>
                <Select.Option value="뜬고기">뜬고기</Select.Option>
                <Select.Option value="갑각류">갑각류</Select.Option>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">사업권역:</span>
              <Select
                className="w-32"
                value={selectedTerritory}
                onChange={setSelectedTerritory}
              >
                <Select.Option value="전체">전체</Select.Option>
                {territories.map(t => (
                  <Select.Option key={t.id} value={t.name}>{t.name}</Select.Option>
                ))}
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">상세지역:</span>
              <Select
                className="w-32"
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
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">상태:</span>
              <Select
                className="w-28"
                value={selectedStatus}
                onChange={setSelectedStatus}
              >
                <Select.Option value="전체">전체</Select.Option>
                <Select.Option value="활성">활성</Select.Option>
                <Select.Option value="비활성">비활성</Select.Option>
              </Select>
            </div>
        </div>
      </div>

      {/* 상단 버튼 영역 */}
      <div className="flex justify-between items-center mb-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
          총 {sortedData.length}개 그룹
        </span>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleRegister}>
          셀러 등록
        </Button>
      </div>

      {/* 테이블 - 데스크톱 */}
      <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">셀러그룹명</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">사업자수</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">소싱담당자</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">주요품목분류</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">사업권역</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">상세지역</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">매입액(누적)</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">매입액(최근 3개월)</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">매입액(최근 1개월)</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">최근거래일</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">사업자등록증</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">상세</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedData.map((seller) => (
                <tr key={seller.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleViewDetail(seller)}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {seller.name}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-gray-900">{seller.businessCount}개</td>
                  <td className="px-4 py-3 text-gray-900">{seller.manager}</td>
                  <td className="px-4 py-3 text-gray-900">{seller.mainCategory}</td>
                  <td className="px-4 py-3 text-gray-900">{seller.territory}</td>
                  <td className="px-4 py-3 text-gray-900">{seller.region}</td>
                  <td className="px-4 py-3 text-right text-gray-900">{(seller.totalPurchase / 100000000).toFixed(1)}억</td>
                  <td className="px-4 py-3 text-right text-gray-900">{(seller.purchase3M / 100000000).toFixed(1)}억</td>
                  <td className="px-4 py-3 text-right text-gray-900">{(seller.purchase1M / 100000000).toFixed(1)}억</td>
                  <td className="px-4 py-3 text-gray-900">{seller.lastTradeDate}</td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={seller.hasCertificate}
                      disabled
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleViewDetail(seller)}
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

      {/* 모바일 카드 리스트 */}
      <div className="md:hidden space-y-3">
        {sortedData.map((seller) => (
          <div key={seller.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex justify-between items-start mb-3">
              <button
                onClick={() => handleViewDetail(seller)}
                className="text-lg font-semibold text-blue-600 hover:text-blue-700"
              >
                {seller.name}
              </button>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                seller.status === 'active'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-gray-50 text-gray-700 border border-gray-200'
              }`}>
                {seller.status === 'active' ? '활성' : '비활성'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <div className="text-gray-500 text-xs mb-0.5">사업자수</div>
                <div className="font-medium text-gray-900">{seller.businessCount}개</div>
              </div>
              <div>
                <div className="text-gray-500 text-xs mb-0.5">소싱담당자</div>
                <div className="font-medium text-gray-900">{seller.manager}</div>
              </div>
              <div>
                <div className="text-gray-500 text-xs mb-0.5">주요품목분류</div>
                <div className="font-medium text-gray-900">{seller.mainCategory}</div>
              </div>
              <div>
                <div className="text-gray-500 text-xs mb-0.5">사업권역</div>
                <div className="font-medium text-gray-900">{seller.territory}</div>
              </div>
              <div>
                <div className="text-gray-500 text-xs mb-0.5">상세지역</div>
                <div className="font-medium text-gray-900">{seller.region}</div>
              </div>
              <div>
                <div className="text-gray-500 text-xs mb-0.5">매입액(누적)</div>
                <div className="font-medium text-gray-900">{(seller.totalPurchase / 100000000).toFixed(1)}억</div>
              </div>
              <div>
                <div className="text-gray-500 text-xs mb-0.5">최근 3개월</div>
                <div className="font-medium text-gray-900">{(seller.purchase3M / 100000000).toFixed(1)}억</div>
              </div>
              <div>
                <div className="text-gray-500 text-xs mb-0.5">최근 1개월</div>
                <div className="font-medium text-gray-900">{(seller.purchase1M / 100000000).toFixed(1)}억</div>
              </div>
              <div className="col-span-2">
                <div className="text-gray-500 text-xs mb-0.5">최근거래일</div>
                <div className="font-medium text-gray-900">{seller.lastTradeDate}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SellerManagement;
