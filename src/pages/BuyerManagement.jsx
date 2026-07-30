import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
import { Check, X } from 'lucide-react';
import { buyerGroups, buyerDetails, managers, territories, regions } from '../data/mockData';
import { FMSelectSimple } from '../components/ui/FMSelectSimple';
import { FMButton } from '../components/ui/FMButton';

function BuyerManagement() {
  const navigate = useNavigate();
  const [selectedSalesPerson, setSelectedSalesPerson] = useState('전체');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedTerritory, setSelectedTerritory] = useState('전체');
  const [selectedRegion, setSelectedRegion] = useState('전체');
  const [selectedStatus, setSelectedStatus] = useState('활성');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // 이벤트 핸들러
  const handleViewDetail = (record) => {
    navigate(`/buyer/${record.id}`);
  };

  const handleRegister = () => {
    navigate('/buyer/register');
  };

  // 필터링 로직
  const filteredData = buyerGroups.filter(item => {
    const matchSalesPerson = selectedSalesPerson === '전체' || item.salesPerson === selectedSalesPerson;
    const matchCategory = selectedCategory === '전체' || item.mainCategory === selectedCategory;
    const matchTerritory = selectedTerritory === '전체' || item.territory === selectedTerritory;
    const matchRegion = selectedRegion === '전체' || item.region === selectedRegion;
    const matchStatus = selectedStatus === '전체' ||
      (selectedStatus === '활성' && item.status === 'active') ||
      (selectedStatus === '비활성' && item.status === 'inactive');

    // 검색 필터링
    let matchSearch = true;
    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase();
      const groupNameMatch = item.name.toLowerCase().includes(keyword);

      // 해당 그룹의 사업자들에서 바이어명과 ticker 검색
      const detail = buyerDetails?.[item.id];
      const businessMatch = detail?.businesses?.some(business =>
        business.buyerName?.toLowerCase().includes(keyword) ||
        business.buyerId?.toLowerCase().includes(keyword)
      ) || false;

      matchSearch = groupNameMatch || businessMatch;
    }

    return matchSalesPerson && matchCategory && matchTerritory && matchRegion && matchStatus && matchSearch;
  });

  const sortedData = filteredData;

  // 사업권역에 따른 상세지역 필터링
  const availableRegions = selectedTerritory === '전체'
    ? regions
    : regions.filter(r => r.territoryName === selectedTerritory);

  // 페이지네이션 계산
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 필터 변경 시 첫 페이지로 리셋
  const handleFilterChange = (filterSetter, value) => {
    filterSetter(value);
    setCurrentPage(1);
  };

  // 사업권역 변경 핸들러 (상세지역 리셋)
  const handleTerritoryChange = (value) => {
    setSelectedTerritory(value);
    setSelectedRegion('전체');
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex flex-col gap-6 w-full">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">바이어 관리</h2>
          <FMButton
            variant="primary"
            icon={<PlusOutlined className="h-4 w-4" />}
            onClick={handleRegister}
          >
            바이어 등록
          </FMButton>
        </div>

      {/* 필터 영역 */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h3 className="mb-4 text-base font-semibold text-gray-900">🔍 조회 필터</h3>

        <div className="flex flex-wrap gap-3 items-start xl:flex-nowrap">
            <FMSelectSimple
              label="담당영업사원"
              value={selectedSalesPerson}
              onChange={(value) => handleFilterChange(setSelectedSalesPerson, value)}
              options={[
                { value: '전체', label: '전체' },
                ...managers.map(m => ({ value: m, label: m }))
              ]}
              className="w-32"
            />

            <FMSelectSimple
              label="주요품목분류"
              value={selectedCategory}
              onChange={(value) => handleFilterChange(setSelectedCategory, value)}
              options={[
                { value: '전체', label: '전체' },
                { value: '누운고기', label: '누운고기' },
                { value: '뜬고기', label: '뜬고기' },
                { value: '갑각류', label: '갑각류' }
              ]}
              className="w-32"
            />

            <FMSelectSimple
              label="사업권역"
              value={selectedTerritory}
              onChange={handleTerritoryChange}
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
              onChange={(value) => handleFilterChange(setSelectedRegion, value)}
              options={[
                { value: '전체', label: '전체' },
                ...availableRegions
                  .sort((a, b) => a.displayOrder - b.displayOrder)
                  .map(r => ({ value: r.name, label: r.name }))
              ]}
              className="w-32"
            />

            <FMSelectSimple
              label="상태"
              value={selectedStatus}
              onChange={(value) => handleFilterChange(setSelectedStatus, value)}
              options={[
                { value: '전체', label: '전체' },
                { value: '활성', label: '활성' },
                { value: '비활성', label: '비활성' }
              ]}
              className="w-28"
            />

            <div className="flex flex-col gap-1 min-w-[240px]">
              <label className="text-sm font-medium text-gray-600">검색</label>
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => {
                  setSearchKeyword(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="바이어그룹명, 바이어명, ticker"
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
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">바이어그룹명</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">품목분류</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">영업담당자</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">사업자정보</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">사업자등록증</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">카톡단톡방</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">넙치도착단가</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">메인소싱처</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">상태</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">상세</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((record) => {
                const detail = buyerDetails[record.id];

                // 사업자정보 완성도 체크
                const hasCompleteBusinessInfo = detail?.businesses?.every(b =>
                  b.businessNumber && b.businessName && b.representative && b.businessAddress
                ) || false;

                // 사업자등록증 체크
                const hasCertificate = detail?.businesses?.every(b => b.hasCertificate) || false;

                // 카톡단톡방
                const kakaoGroup = detail?.kakaoGroupName || null;

                // 넙치도착단가
                const hasNunwoon = record.mainCategory?.includes('누운고기');
                const arrivalPrice = detail?.arrivalPricePolicy;
                let arrivalPriceDisplay = '해당없음';
                if (hasNunwoon) {
                  if (arrivalPrice) {
                    // "상차단가 + 800원" -> "+800원" 형태로 변환
                    const match = arrivalPrice.match(/\+\s*(\d+)원/);
                    arrivalPriceDisplay = match ? `+${match[1]}원` : arrivalPrice;
                  } else {
                    arrivalPriceDisplay = null; // X 표시
                  }
                }

                // 메인소싱처
                const mainSuppliers = detail?.mainSuppliers?.split(',').map(s => s.trim()) || [];

                return (
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
                    <td className="px-4 py-3 text-sm text-gray-900">{record.mainCategory}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{record.salesPerson}</td>
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
                      {kakaoGroup ? (
                        <span className="text-sm text-gray-900">{kakaoGroup}</span>
                      ) : (
                        <X className="h-5 w-5 text-red-500 mx-auto" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {arrivalPriceDisplay === '해당없음' ? (
                        <span className="text-sm text-gray-500">해당없음</span>
                      ) : arrivalPriceDisplay ? (
                        <span className="text-sm text-gray-900">{arrivalPriceDisplay}</span>
                      ) : (
                        <X className="h-5 w-5 text-red-500 mx-auto" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {mainSuppliers.length > 0 ? (
                        <span className="text-sm text-gray-900">
                          {mainSuppliers.length === 1
                            ? mainSuppliers[0]
                            : `${mainSuppliers[0]} 외`}
                        </span>
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
                        onClick={(e) => { e.stopPropagation(); handleViewDetail(record); }}
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

        {/* 페이지네이션 */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, sortedData.length)} / 총 {sortedData.length}건
          </div>
          <div className="flex items-center gap-2">
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(parseInt(e.target.value));
                setCurrentPage(1);
              }}
              className="rounded border border-gray-300 px-2 py-1 text-sm"
            >
              <option value={10}>10개씩</option>
              <option value={20}>20개씩</option>
              <option value={50}>50개씩</option>
              <option value={100}>100개씩</option>
            </select>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              이전
            </button>
            <span className="text-sm text-gray-600">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              다음
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

export default BuyerManagement;
