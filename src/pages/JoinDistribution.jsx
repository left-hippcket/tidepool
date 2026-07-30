import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
import { Check, X } from 'lucide-react';
import { joinGroups, joinDetails, managers, territories } from '../data/mockData';
import { FMSelectSimple } from '../components/ui/FMSelectSimple';
import { FMButton } from '../components/ui/FMButton';

function JoinDistribution() {
  const navigate = useNavigate();
  const [selectedSalesPerson, setSelectedSalesPerson] = useState('전체');
  const [selectedTerritory, setSelectedTerritory] = useState('전체');
  const [selectedRegion, setSelectedRegion] = useState('전체');
  const [selectedStatus, setSelectedStatus] = useState('활성');
  const [searchKeyword, setSearchKeyword] = useState('');

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

    // 검색 필터링
    let matchSearch = true;
    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase();
      const groupNameMatch = item.name.toLowerCase().includes(keyword);

      // 해당 그룹의 사업자들에서 조인명과 ticker 검색
      const detail = joinDetails?.[item.id];
      const businessMatch = detail?.businesses?.some(business =>
        business.joinName?.toLowerCase().includes(keyword) ||
        business.ticker?.toLowerCase().includes(keyword)
      ) || false;

      matchSearch = groupNameMatch || businessMatch;
    }

    return matchSalesPerson && matchTerritory && matchRegion && matchStatus && matchSearch;
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

          <div className="flex flex-col gap-1 min-w-[240px]">
            <label className="text-sm font-medium text-gray-600">검색</label>
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="조인유통그룹명, 조인명, ticker"
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
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">조인유통그룹명</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">담당영업사원</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">사업자정보</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">사업자등록증</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">카톡단톡방</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">메인소싱처</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">메인유통사</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">상태</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">상세</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((record) => {
                const detail = joinDetails[record.id];

                // 사업자정보 완성도 체크
                const hasCompleteBusinessInfo = detail?.businesses?.every(b =>
                  b.businessNumber && b.businessName && b.representative && b.businessAddress
                ) || false;

                // 사업자등록증 체크
                const hasCertificate = detail?.businesses?.every(b => b.hasCertificate) || false;

                // 카톡단톡방
                const kakaoGroup = detail?.kakaoGroupName || null;

                // 메인소싱처 (주요 양식장) - 쉼표로 구분된 문자열을 배열로 변환
                const mainFarmsRaw = detail?.mainFarms;
                const mainFarmsArray = mainFarmsRaw
                  ? mainFarmsRaw.split(',').map(s => s.trim()).filter(Boolean)
                  : [];

                // 메인유통사 (주요 공급처) - 쉼표로 구분된 문자열을 배열로 변환
                const mainSuppliersRaw = detail?.mainSuppliers;
                const mainSuppliersArray = mainSuppliersRaw
                  ? mainSuppliersRaw.split(',').map(s => s.trim()).filter(Boolean)
                  : [];

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
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {record.salesPersons?.length > 0
                        ? record.salesPersons.join(', ')
                        : record.salesPerson}
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
                      {kakaoGroup ? (
                        <span className="text-sm text-gray-900">{kakaoGroup}</span>
                      ) : (
                        <X className="h-5 w-5 text-red-500 mx-auto" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {mainFarmsArray.length > 0 ? (
                        <span className="text-sm text-gray-900">
                          {mainFarmsArray.length === 1
                            ? mainFarmsArray[0]
                            : `${mainFarmsArray[0]} 외`}
                        </span>
                      ) : (
                        <X className="h-5 w-5 text-red-500 mx-auto" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {mainSuppliersArray.length > 0 ? (
                        <span className="text-sm text-gray-900">
                          {mainSuppliersArray.length === 1
                            ? mainSuppliersArray[0]
                            : `${mainSuppliersArray[0]} 외`}
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
      </div>
      </div>
    </div>
  );
}

export default JoinDistribution;
