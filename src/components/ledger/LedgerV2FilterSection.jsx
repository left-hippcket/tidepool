import React from 'react';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { FMSelectSimple } from '../ui/FMSelectSimple';
import { FMButton } from '../ui/FMButton';
import { getQuickDateRange } from '../../utils/ledgerFilters';

const { RangePicker } = DatePicker;

const LedgerV2FilterSection = ({
  filters,
  onFilterChange,
  onReset,
  productCategories = [],
}) => {
  const handleDateFieldChange = (value) => {
    onFilterChange({ dateField: value });
  };

  const handleProductCategoryChange = (value) => {
    onFilterChange({ productCategory: value });
  };

  const handleDateRangeChange = (dates) => {
    if (dates && dates.length === 2) {
      onFilterChange({
        startDate: dates[0].format('YYYY-MM-DD'),
        endDate: dates[1].format('YYYY-MM-DD'),
      });
    } else {
      onFilterChange({ startDate: null, endDate: null });
    }
  };

  const handleQuickDate = (type) => {
    const { startDate, endDate } = getQuickDateRange(type);
    onFilterChange({
      startDate: dayjs(startDate).format('YYYY-MM-DD'),
      endDate: dayjs(endDate).format('YYYY-MM-DD'),
      quickDateType: type, // 선택된 빠른 날짜 타입 저장
    });
  };

  // 빠른 날짜 버튼이 현재 선택되었는지 확인
  const isQuickDateSelected = (type) => {
    if (!filters.startDate || !filters.endDate) return false;
    const { startDate, endDate } = getQuickDateRange(type);
    return (
      dayjs(filters.startDate).format('YYYY-MM-DD') === dayjs(startDate).format('YYYY-MM-DD') &&
      dayjs(filters.endDate).format('YYYY-MM-DD') === dayjs(endDate).format('YYYY-MM-DD')
    );
  };

  const dateRangeValue =
    filters.startDate && filters.endDate
      ? [dayjs(filters.startDate), dayjs(filters.endDate)]
      : null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">🔍 조회 필터</h3>
        <FMButton onClick={onReset} variant="secondary" size="small">
          필터 초기화
        </FMButton>
      </div>

      {/* 필터 */}
      <div>
        <div className="flex items-center gap-4 flex-wrap mb-3">
          <FMSelectSimple
            value={filters.productCategory || '전체'}
            onChange={handleProductCategoryChange}
            options={[
              { value: '전체', label: '전체' },
              ...productCategories.map(cat => ({ value: cat, label: cat }))
            ]}
            className="w-32"
          />

          <FMSelectSimple
            value={filters.dateField || '주문일'}
            onChange={handleDateFieldChange}
            options={[
              { value: '주문일', label: '주문일' },
              { value: '납품일', label: '납품일' },
            ]}
            className="w-32"
          />

          <div className="flex gap-2">
            <FMButton
              onClick={() => handleQuickDate('yesterday')}
              variant={isQuickDateSelected('yesterday') ? 'primary' : 'outline'}
              size="small"
            >
              어제
            </FMButton>
            <FMButton
              onClick={() => handleQuickDate('today')}
              variant={isQuickDateSelected('today') ? 'primary' : 'outline'}
              size="small"
            >
              오늘
            </FMButton>
            <FMButton
              onClick={() => handleQuickDate('tomorrow')}
              variant={isQuickDateSelected('tomorrow') ? 'primary' : 'outline'}
              size="small"
            >
              내일
            </FMButton>
            <FMButton
              onClick={() => handleQuickDate('last7days')}
              variant={isQuickDateSelected('last7days') ? 'primary' : 'outline'}
              size="small"
            >
              최근 7일
            </FMButton>
          </div>

          <RangePicker
            value={dateRangeValue}
            onChange={handleDateRangeChange}
            format="YYYY-MM-DD"
            placeholder={['시작일', '종료일']}
            className="w-64"
          />
        </div>
      </div>
    </div>
  );
};

export default LedgerV2FilterSection;
