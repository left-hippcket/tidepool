import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import { buyerGroups, buyerDetails } from '../data/mockData';

function BuyerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const buyerGroup = buyerGroups.find(b => b.id === parseInt(id));
  const detail = buyerDetails[id];

  if (!buyerGroup || !detail) {
    return (
      <div className="min-h-screen bg-[#f9fafb] p-6">
        <button
          onClick={() => navigate('/buyer')}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ArrowLeftOutlined />
          목록으로 돌아가기
        </button>
        <div className="mt-8 text-lg text-gray-600">바이어 그룹을 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] p-4 md:p-6">
      {/* 헤더 */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/buyer')}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeftOutlined />
            목록으로
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{buyerGroup.name}</h1>
        </div>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          buyerGroup.status === 'active'
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-gray-50 text-gray-700 border border-gray-200'
        }`}>
          {buyerGroup.status === 'active' ? '활성' : '비활성'}
        </span>
      </div>

      {/* 섹션 1: 바이어그룹 기본 정보 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">바이어그룹 기본 정보</h2>
          <button className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
            <EditOutlined />
            수정
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-sm text-gray-500 mb-1">바이어그룹명</div>
            <div className="text-base font-semibold text-gray-900">{buyerGroup.name}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">담당영업사원</div>
            <div className="text-base font-semibold text-gray-900">{buyerGroup.salesPerson}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">주요품목분류</div>
            <div className="text-base font-semibold text-gray-900">{buyerGroup.mainCategory}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">사업권역</div>
            <div className="text-base font-semibold text-gray-900">{buyerGroup.territory}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">상세지역</div>
            <div className="text-base font-semibold text-gray-900">{buyerGroup.region}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">사업자 수</div>
            <div className="text-base font-semibold text-gray-900">{buyerGroup.businessCount}개</div>
          </div>
        </div>

        {/* 키맨 정보 */}
        <div className="mt-8">
          <h3 className="text-base font-semibold text-gray-900 mb-4">키맨 정보</h3>
          <div className="space-y-3">
            {detail.keymen.map((keyman, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">이름</div>
                    <div className="text-sm font-medium text-gray-900">{keyman.name}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">직책</div>
                    <div className="text-sm font-medium text-gray-900">{keyman.position}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">연락처</div>
                    <div className="text-sm font-medium text-gray-900">{keyman.phone}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 거래 정보 */}
        <div className="mt-8">
          <h3 className="text-base font-semibold text-gray-900 mb-4">거래 정보</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-gray-500 mb-1">카톡단톡방이름</div>
              <div className="text-base font-semibold text-gray-900">{detail.kakaoGroupName}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">결제주기</div>
              <div className="text-base font-semibold text-gray-900">{detail.paymentCycle}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">컴플레인강도</div>
              <div className="text-base font-semibold text-gray-900">{detail.complaintIntensity}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">도착단가 정책</div>
              <div className="text-base font-semibold text-gray-900">{detail.arrivalPricePolicy}</div>
            </div>
            <div className="md:col-span-2">
              <div className="text-sm text-gray-500 mb-1">메인공급처</div>
              <div className="text-base font-semibold text-gray-900">{detail.mainSuppliers}</div>
            </div>
          </div>
        </div>

        {/* 중요 평가 요소 */}
        <div className="mt-8">
          <h3 className="text-base font-semibold text-gray-900 mb-4">중요 평가 요소 (우선순위)</h3>
          <div className="flex flex-wrap gap-2">
            {detail.priorityFactors.map((factor, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200"
              >
                {index + 1}순위: {factor}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 섹션 2: 소속 사업자 정보 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">소속 사업자 정보</h2>

        <div className="space-y-4">
          {detail.businesses.map((business, index) => (
            <div key={business.id} className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-white px-4 py-3 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-gray-900">{business.buyerName}</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    business.status === 'active'
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {business.status === 'active' ? '활성' : '비활성'}
                  </span>
                  {business.hasCertificate && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                      사업자등록증 첨부
                    </span>
                  )}
                </div>
                <button className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                  <EditOutlined />
                  수정
                </button>
              </div>

              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">사업자등록번호</div>
                    <div className="text-base font-medium text-gray-900">{business.businessNumber}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">바이어ID</div>
                    <div className="text-base font-medium text-gray-900">{business.buyerId}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">사업자등록상호</div>
                    <div className="text-base font-medium text-gray-900">{business.businessName}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">대표자</div>
                    <div className="text-base font-medium text-gray-900">{business.representative}</div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="text-sm text-gray-500 mb-1">사업장등록주소</div>
                    <div className="text-base font-medium text-gray-900">{business.businessAddress}</div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="text-sm text-gray-500 mb-1">하차지 주소</div>
                    <div className="text-base font-medium text-gray-900">{business.unloadingAddress}</div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="text-sm text-gray-500 mb-1">세금계산서 발행 이메일</div>
                    <div className="text-base font-medium text-gray-900">{business.taxInvoiceEmail}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="mt-4 w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors font-medium">
          + 사업자 추가
        </button>
      </div>

      {/* 섹션 3: 거래 실적 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">거래 실적</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-100">
            <div className="text-xs text-blue-600 mb-2">매출액 (누적)</div>
            <div className="text-2xl font-bold text-blue-700">
              {(buyerGroup.totalSales / 100000000).toFixed(1)}억
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center border border-green-100">
            <div className="text-xs text-green-600 mb-2">매출액 (최근 3개월)</div>
            <div className="text-2xl font-bold text-green-700">
              {(buyerGroup.sales3M / 100000000).toFixed(1)}억
            </div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 text-center border border-yellow-100">
            <div className="text-xs text-yellow-600 mb-2">매출액 (최근 1개월)</div>
            <div className="text-2xl font-bold text-yellow-700">
              {(buyerGroup.sales1M / 100000000).toFixed(1)}억
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
            <div className="text-xs text-gray-600 mb-2">최근거래일</div>
            <div className="text-2xl font-bold text-gray-900">
              {buyerGroup.lastTradeDate}
            </div>
          </div>
        </div>

        <div className="mt-4 p-6 bg-gray-50 text-center rounded-lg border border-gray-200">
          <p className="text-gray-600">상세 거래 내역 및 판매 세부내역은 추후 구현 예정</p>
        </div>
      </div>
    </div>
  );
}

export default BuyerDetail;
