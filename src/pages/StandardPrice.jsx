import React, { useState, useEffect } from 'react';
import { PlusOutlined, DownloadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import StandardPriceComparison from './StandardPriceComparison';
import { productCategories, products, origins, specifications } from '../data/mockData';
import { FMSelectSimple } from '../components/ui/FMSelectSimple';
import { FMInput } from '../components/ui/FMInput';
import { FMButton } from '../components/ui/FMButton';

function StandardPrice() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('1');
  const [dataSource, setDataSource] = useState([]);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editingRowData, setEditingRowData] = useState(null);

  // 필터 상태 - 디폴트 값 설정
  const [selectedCategory, setSelectedCategory] = useState('누운고기');
  const [selectedProduct, setSelectedProduct] = useState('넙치');
  const [selectedOrigin, setSelectedOrigin] = useState('완도');
  const [selectedSpec, setSelectedSpec] = useState('모두');
  const [dateRange, setDateRange] = useState([dayjs().subtract(1, 'year'), dayjs()]);
  const [showLatestOnly, setShowLatestOnly] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [pageSize, setPageSize] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);

  // 초기 데이터 로드
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const response = await fetch('/data/standard-price-data.json');
      if (!response.ok) {
        throw new Error('데이터 로드 실패');
      }
      const data = await response.json();
      console.log('표준가격 데이터 로드 성공:', data.length, '건');
      setDataSource(data);
    } catch (error) {
      console.error('표준가격 데이터 로드 실패:', error);
      // 로드 실패 시 샘플 데이터 사용
      const sampleData = [
        {
          key: '1',
          id: '1',
          applyDate: '2026-07-21',
          categoryId: 1,
          categoryName: '누운고기',
          productId: 2,
          productName: '넙치',
          originId: 7,
          originName: '완도',
          specId: 7,
          spec: '1.2kg',
          price: 15000,
          source: '피시파더',
        },
        {
          key: '2',
          id: '2',
          applyDate: '2026-07-21',
          categoryId: 1,
          categoryName: '누운고기',
          productId: 2,
          productName: '넙치',
          originId: 7,
          originName: '완도',
          specId: 8,
          spec: '1.5kg',
          price: 18000,
          source: '피시파더',
        },
      ];
      setDataSource(sampleData);
    }
  };

  // 필터 옵션 계산
  const categoryFilters = React.useMemo(() => {
    const categories = [...new Set(dataSource.map(item => item.categoryName))].filter(Boolean);
    return categories.map(name => ({ text: name, value: name }));
  }, [dataSource]);

  const productFilters = React.useMemo(() => {
    const products = [...new Set(dataSource.map(item => item.productName))];
    return products.map(name => ({ text: name, value: name }));
  }, [dataSource]);

  const originFilters = React.useMemo(() => {
    const origins = [...new Set(dataSource.map(item => item.originName))];
    return origins.map(name => ({ text: name, value: name }));
  }, [dataSource]);

  // Cascading 필터 옵션
  const availableProducts = React.useMemo(() => {
    if (!selectedCategory || selectedCategory === '모두') return [...new Set(dataSource.map(d => d.productName))];
    return [...new Set(dataSource.filter(d => d.categoryName === selectedCategory).map(d => d.productName))];
  }, [dataSource, selectedCategory]);

  const availableOrigins = React.useMemo(() => {
    let filtered = dataSource;
    if (selectedCategory && selectedCategory !== '모두') filtered = filtered.filter(d => d.categoryName === selectedCategory);
    if (selectedProduct && selectedProduct !== '모두') filtered = filtered.filter(d => d.productName === selectedProduct);
    return [...new Set(filtered.map(d => d.originName))];
  }, [dataSource, selectedCategory, selectedProduct]);

  const availableSpecs = React.useMemo(() => {
    let filtered = dataSource;
    if (selectedCategory && selectedCategory !== '모두') filtered = filtered.filter(d => d.categoryName === selectedCategory);
    if (selectedProduct && selectedProduct !== '모두') filtered = filtered.filter(d => d.productName === selectedProduct);
    if (selectedOrigin && selectedOrigin !== '모두') filtered = filtered.filter(d => d.originName === selectedOrigin);
    return [...new Set(filtered.map(d => d.spec).filter(Boolean))];
  }, [dataSource, selectedCategory, selectedProduct, selectedOrigin]);

  // 최신 가격 추출 함수
  const getLatestPrices = (data) => {
    const latestDates = {};
    data.forEach(item => {
      const key = `${item.productName}-${item.originName}`;
      if (!latestDates[key] || new Date(item.applyDate) > new Date(latestDates[key])) {
        latestDates[key] = item.applyDate;
      }
    });

    return data.filter(item => {
      const key = `${item.productName}-${item.originName}`;
      return item.applyDate === latestDates[key];
    });
  };

  // 규격을 숫자로 변환
  const parseSpec = (spec) => {
    if (!spec) return 0;
    const match = spec.match(/[\d.]+/);
    if (!match) return 0;
    const value = parseFloat(match[0]);
    if (spec.includes('kg')) return value * 1000;
    return value;
  };

  // 필터 적용된 데이터
  const displayData = React.useMemo(() => {
    let filtered = dataSource;
    if (selectedCategory && selectedCategory !== '모두') {
      filtered = filtered.filter(item => item.categoryName === selectedCategory);
    }
    if (selectedProduct && selectedProduct !== '모두') {
      filtered = filtered.filter(item => item.productName === selectedProduct);
    }
    if (selectedOrigin && selectedOrigin !== '모두') {
      filtered = filtered.filter(item => item.originName === selectedOrigin);
    }
    if (selectedSpec && selectedSpec !== '모두') {
      filtered = filtered.filter(item => item.spec === selectedSpec);
    }
    if (dateRange && dateRange.length === 2) {
      const [start, end] = dateRange;
      filtered = filtered.filter(item => {
        const itemDate = dayjs(item.applyDate);
        return itemDate.isSameOrAfter(start, 'day') && itemDate.isSameOrBefore(end, 'day');
      });
    }

    const result = showLatestOnly ? getLatestPrices(filtered) : filtered;

    return result.sort((a, b) => {
      const dateCompare = b.applyDate.localeCompare(a.applyDate);
      if (dateCompare !== 0) return dateCompare;
      const categoryCompare = (a.categoryName || '').localeCompare(b.categoryName || '');
      if (categoryCompare !== 0) return categoryCompare;
      const productCompare = (a.productName || '').localeCompare(b.productName || '');
      if (productCompare !== 0) return productCompare;
      const originCompare = (a.originName || '').localeCompare(b.originName || '');
      if (originCompare !== 0) return originCompare;
      return parseSpec(a.spec) - parseSpec(b.spec);
    });
  }, [dataSource, selectedCategory, selectedProduct, selectedOrigin, selectedSpec, dateRange, showLatestOnly]);

  // 필터 변경 시 첫 페이지로 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedProduct, selectedOrigin, selectedSpec, dateRange, showLatestOnly, pageSize]);

  // 페이지네이션 계산
  const totalPages = Math.ceil(displayData.length / pageSize);
  const paginatedData = displayData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // CSV 다운로드
  const handleCSVDownload = () => {
    setDownloading(true);
    try {
      const headers = ['적용일자', '품목분류', '품목', '원산지', '규격', '표준가격', '출처'];
      const rows = displayData.map(item => [
        item.applyDate,
        item.categoryName,
        item.productName,
        item.originName,
        item.spec,
        item.price,
        item.source
      ].join(','));

      const csv = [headers.join(','), ...rows].join('\n');
      const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });

      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      const today = new Date().toISOString().split('T')[0];
      const productPart = selectedProduct || '전체';
      const originPart = selectedOrigin || '전체';
      link.download = `${productPart}_${originPart}_${today}.csv`;

      link.href = url;
      link.click();
      URL.revokeObjectURL(url);

      toast.success(`CSV 다운로드 완료 (${displayData.length}건)`);
    } finally {
      setDownloading(false);
    }
  };

  const handleRegister = () => {
    navigate('/standard-price/register');
  };

  // 중복 검증 함수
  const isDuplicateEntry = (editedRow, allData, currentRowId) => {
    return allData.some(row =>
      row.id !== currentRowId &&
      row.applyDate === editedRow.applyDate &&
      row.categoryName === editedRow.categoryName &&
      row.productName === editedRow.productName &&
      row.originName === editedRow.originName &&
      row.spec === editedRow.spec
    );
  };

  // 사용 가능한 규격 목록 가져오기
  const getAvailableSpecs = (row) => {
    // 같은 날짜+분류+품목+원산지 조합에서 이미 사용 중인 규격
    const usedSpecs = dataSource
      .filter(item =>
        item.id !== row.id &&
        item.applyDate === row.applyDate &&
        item.categoryName === row.categoryName &&
        item.productName === row.productName &&
        item.originName === row.originName
      )
      .map(item => item.spec);

    // 해당 품목의 모든 규격 목록에서 사용 중인 것 제외
    const allSpecsForProduct = [...new Set(
      dataSource
        .filter(d => d.productName === row.productName)
        .map(d => d.spec)
        .filter(Boolean)
    )];

    // 사용 중인 규격 제외하고 반환
    const available = allSpecsForProduct.filter(spec => !usedSpecs.includes(spec));

    // 현재 선택된 규격이 목록에 없으면 추가 (수정 중인 행의 현재 값은 항상 표시)
    if (row.spec && !available.includes(row.spec)) {
      available.unshift(row.spec);
    }

    return available;
  };

  // 행 수정 시작
  const handleEditRow = (row) => {
    setEditingRowId(row.id);
    setEditingRowData({ ...row });
  };

  // 필드 변경
  const handleFieldChange = (field, value) => {
    const updatedRow = {
      ...editingRowData,
      [field]: value
    };

    // 규격 변경 시 즉시 중복 체크
    if (field === 'spec') {
      const isDuplicate = isDuplicateEntry(updatedRow, dataSource, editingRowId);
      if (isDuplicate) {
        toast.error('이미 같은 조합(날짜+분류+품목+원산지+규격)이 존재합니다.');
        return;
      }
    }

    setEditingRowData(updatedRow);
  };

  // 행 저장
  const handleSaveRow = () => {
    // 최종 중복 검증
    const isDuplicate = isDuplicateEntry(editingRowData, dataSource, editingRowId);

    if (isDuplicate) {
      toast.error('저장할 수 없습니다. 이미 같은 조합이 존재합니다.');
      return;
    }

    // 데이터 업데이트
    const updatedData = dataSource.map(item =>
      item.id === editingRowId ? editingRowData : item
    );

    setDataSource(updatedData);
    setEditingRowId(null);
    setEditingRowData(null);
    toast.success('저장되었습니다.');
  };

  // 행 수정 취소
  const handleCancelEdit = () => {
    setEditingRowId(null);
    setEditingRowData(null);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">표준가격 관리</h2>
        <FMButton
          onClick={handleRegister}
          variant="primary"
          icon={<PlusOutlined className="h-4 w-4" />}
        >
          표준가격 등록
        </FMButton>
      </div>

      {/* 탭 */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab('1')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === '1'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            표준가격 조회/등록
          </button>
          <button
            onClick={() => setActiveTab('2')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === '2'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            표준가격 추세 비교
          </button>
        </div>
      </div>

      {activeTab === '1' && (
        <>
          {/* 조회 필터 */}
          {(
            <div className="mb-4 rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="mb-4 text-base font-semibold text-gray-900">🔍 조회 필터</h3>

              {/* 모든 필터 요소를 한 줄로 */}
              <div className="flex gap-3 items-start">
                {/* FMSelectSimple - 품목분류 */}
                <FMSelectSimple
                  label="품목분류"
                  value={selectedCategory}
                  onChange={(value) => {
                    setSelectedCategory(value);
                    setSelectedProduct(null);
                    setSelectedOrigin(null);
                    setSelectedSpec('모두');
                  }}
                  options={[
                    { value: '모두', label: '모두' },
                    ...categoryFilters.map(c => ({ value: c.value, label: c.text }))
                  ]}
                  placeholder="검색 & 선택"
                  className="w-40"
                />

                {/* FMSelectSimple - 품목 */}
                <FMSelectSimple
                  label="품목"
                  value={selectedProduct}
                  onChange={(value) => {
                    setSelectedProduct(value);
                    setSelectedOrigin('모두');
                    setSelectedSpec('모두');
                  }}
                  options={[
                    { value: '모두', label: '모두' },
                    ...availableProducts.map(p => ({ value: p, label: p }))
                  ]}
                  placeholder="검색 & 선택"
                  className="w-32"
                />

                {/* FMSelectSimple - 원산지 */}
                <FMSelectSimple
                  label="원산지"
                  value={selectedOrigin}
                  onChange={(value) => {
                    setSelectedOrigin(value);
                    setSelectedSpec('모두');
                  }}
                  options={[
                    { value: '모두', label: '모두' },
                    ...availableOrigins.map(o => ({ value: o, label: o }))
                  ]}
                  placeholder="검색 & 선택"
                  className="w-32"
                />

                {/* FMSelectSimple - 규격 */}
                <FMSelectSimple
                  label="규격"
                  value={selectedSpec}
                  onChange={(value) => setSelectedSpec(value)}
                  options={[
                    { value: '모두', label: '모두' },
                    ...availableSpecs.map(s => ({ value: s, label: s }))
                  ]}
                  placeholder="검색 & 선택"
                  className="w-32"
                />

                {/* 기간 선택 */}
                <div className="flex w-full flex-col gap-1 min-w-[420px]">
                  <span className="block text-sm text-gray-600 text-left font-medium">기간</span>
                  <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2">
                    <span className="text-xs text-gray-600 whitespace-nowrap">시작일:</span>
                    <input
                      type="date"
                      value={dateRange[0]?.format('YYYY-MM-DD')}
                      onChange={(e) => setDateRange([dayjs(e.target.value), dateRange[1]])}
                      className="w-[130px] text-sm outline-none"
                    />
                    <svg className="h-4 w-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                    <span className="text-xs text-gray-600 whitespace-nowrap">종료일:</span>
                    <input
                      type="date"
                      value={dateRange[1]?.format('YYYY-MM-DD')}
                      onChange={(e) => setDateRange([dateRange[0], dayjs(e.target.value)])}
                      className="w-[130px] text-sm outline-none"
                    />
                  </div>
                </div>

                {/* 품목별 최신 가격만 체크박스 */}
                <div className="flex w-full flex-col gap-1">
                  <span className="block text-sm text-gray-600 text-left font-medium">&nbsp;</span>
                  <label className="flex items-center gap-2 whitespace-nowrap h-[42px] px-3">
                    <input
                      type="checkbox"
                      checked={showLatestOnly}
                      onChange={(e) => setShowLatestOnly(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">품목별 최신 가격만</span>
                  </label>
                </div>

                {/* CSV 다운로드 버튼 */}
                <div className="flex w-full flex-col gap-1">
                  <span className="block text-sm text-gray-600 text-left font-medium">&nbsp;</span>
                  <FMButton
                    onClick={handleCSVDownload}
                    disabled={downloading}
                    variant="indigo"
                    icon={<DownloadOutlined className="h-4 w-4" />}
                    className="whitespace-nowrap h-[42px]"
                  >
                    CSV 다운로드 ({displayData.length}건)
                  </FMButton>
                </div>
              </div>
            </div>
          )}

          {/* 테이블 */}
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50">
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700" style={{ width: 140 }}>적용일자</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700" style={{ width: 100 }}>품목분류</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700" style={{ width: 100 }}>품목</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700" style={{ width: 100 }}>원산지</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700" style={{ width: 140 }}>규격</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700" style={{ width: 160 }}>표준가격</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700" style={{ width: 140 }}>가격출처</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700" style={{ width: 140 }}>액션</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row, index) => {
                  const isEditing = editingRowId === row.id;
                  const rowData = isEditing ? editingRowData : row;

                  return (
                    <tr
                      key={row.id || row.key}
                      className={`border-b border-gray-100 transition-colors ${
                        isEditing
                          ? 'bg-blue-50 ring-2 ring-blue-200'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {/* 적용일자 */}
                      <td className="px-4 py-3 text-sm">
                        {isEditing ? (
                          <input
                            type="date"
                            value={rowData.applyDate}
                            onChange={(e) => handleFieldChange('applyDate', e.target.value)}
                            className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                          />
                        ) : (
                          <span className="text-gray-900">{row.applyDate}</span>
                        )}
                      </td>

                      {/* 품목분류 - 읽기 전용 */}
                      <td className="px-4 py-3 text-sm text-gray-900">{rowData.categoryName}</td>

                      {/* 품목 - 읽기 전용 */}
                      <td className="px-4 py-3 text-sm text-gray-900">{rowData.productName}</td>

                      {/* 원산지 - 읽기 전용 */}
                      <td className="px-4 py-3 text-sm text-gray-900">{rowData.originName}</td>

                      {/* 규격 */}
                      <td className="px-4 py-3 text-sm">
                        {isEditing ? (
                          <div className="w-full min-w-[120px]">
                            <FMSelectSimple
                              value={rowData.spec}
                              onChange={(value) => handleFieldChange('spec', value)}
                              options={getAvailableSpecs(rowData).map(s => ({
                                value: s,
                                label: s
                              }))}
                              placeholder="규격"
                            />
                          </div>
                        ) : (
                          <span className="text-gray-900">{row.spec}</span>
                        )}
                      </td>

                      {/* 가격 */}
                      <td className="px-4 py-3 text-sm">
                        {isEditing ? (
                          <div className="w-full min-w-[140px]">
                            <FMInput
                              type="text"
                              value={rowData.price?.toString() || ''}
                              onChange={(e) => handleFieldChange('price', parseInt(e.target.value.replace(/,/g, '')) || 0)}
                              isCurrency={true}
                            />
                          </div>
                        ) : (
                          <span className="text-gray-900">{row.price.toLocaleString()}원</span>
                        )}
                      </td>

                      {/* 출처 */}
                      <td className="px-4 py-3 text-sm">
                        {isEditing ? (
                          <div className="w-full min-w-[120px]">
                            <FMInput
                              type="text"
                              value={rowData.source}
                              onChange={(e) => handleFieldChange('source', e.target.value)}
                              placeholder="출처"
                            />
                          </div>
                        ) : (
                          <span className="text-gray-900">{row.source}</span>
                        )}
                      </td>

                      {/* 액션 */}
                      <td className="px-4 py-3 text-sm">
                        {isEditing ? (
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={handleSaveRow}
                              className="rounded-lg border border-blue-300 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100"
                            >
                              저장
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="rounded-lg border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                            >
                              취소
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-center">
                            <button
                              onClick={() => handleEditRow(row)}
                              disabled={editingRowId !== null}
                              className="rounded-lg border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              수정
                            </button>
                          </div>
                        )}
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
              {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, displayData.length)} / 총 {displayData.length}건
            </div>
            <div className="flex items-center gap-2">
              <select
                value={pageSize}
                onChange={(e) => setPageSize(parseInt(e.target.value))}
                className="rounded border border-gray-300 px-2 py-1 text-sm"
              >
                <option value={10}>10개씩</option>
                <option value={20}>20개씩</option>
                <option value={50}>50개씩</option>
                <option value={100}>100개씩</option>
              </select>
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                이전
              </button>
              <span className="text-sm text-gray-600">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                다음
              </button>
            </div>
          </div>
        </>
      )}

      {activeTab === '2' && <StandardPriceComparison activeTab={activeTab} />}
    </div>
  );
}

export default StandardPrice;
