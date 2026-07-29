import React, { useState, useEffect, useMemo } from 'react';
import { Line } from '@ant-design/charts';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { productCategories } from '../data/mockData';
import { FMSelectSimple } from '../components/ui/FMSelectSimple';
import { FMMultiSelect } from '../components/ui/FMMultiSelect';
import { FMButton } from '../components/ui/FMButton';

function StandardPriceComparison({ activeTab }) {
  const [dateRange, setDateRange] = useState([dayjs().subtract(1, 'year'), dayjs()]);
  const [selectedCategory, setSelectedCategory] = useState(1); // 누운고기
  const [selectedProduct, setSelectedProduct] = useState('넙치');
  const [selectedOrigins, setSelectedOrigins] = useState([]);
  const [selectedSpecs, setSelectedSpecs] = useState(['1.5kg']);
  const [chartData, setChartData] = useState([]);
  const [allPriceData, setAllPriceData] = useState([]);

  // 실제 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/data/standard-price-data.json');
        if (!response.ok) {
          throw new Error('데이터 로드 실패');
        }
        const data = await response.json();
        console.log('가격 비교 데이터 로드 성공:', data.length, '건');
        setAllPriceData(data);
      } catch (error) {
        console.error('가격 비교 데이터 로드 실패:', error);
        setAllPriceData([]);
      }
    };
    loadData();
  }, []);

  // 실제 데이터에서 품목 목록 추출
  const products = useMemo(() => {
    if (!selectedCategory) return [];
    const uniqueProducts = [...new Set(
      allPriceData
        .filter(d => d.categoryId === selectedCategory)
        .map(d => d.productName)
    )];
    return uniqueProducts.map((name, index) => ({ id: index + 1, name, categoryId: selectedCategory }));
  }, [allPriceData, selectedCategory]);

  // 실제 데이터에서 원산지 목록 추출
  const availableOrigins = useMemo(() => {
    if (!selectedProduct) return [];
    const uniqueOrigins = [...new Set(
      allPriceData
        .filter(d => d.productName === selectedProduct)
        .map(d => d.originName)
    )];
    return uniqueOrigins.map((name, index) => ({ id: index + 1, name, productName: selectedProduct }));
  }, [allPriceData, selectedProduct]);

  // 실제 데이터에서 규격 목록 추출
  const availableSpecs = useMemo(() => {
    if (!selectedProduct) return [];
    const uniqueSpecs = [...new Set(
      allPriceData
        .filter(d => d.productName === selectedProduct)
        .map(d => d.spec)
    )];
    return uniqueSpecs.map((name, index) => ({ id: index + 1, name, productName: selectedProduct }));
  }, [allPriceData, selectedProduct]);

  // 초기 로드 시 넙치의 규격과 원산지 자동 설정
  useEffect(() => {
    if (allPriceData.length > 0 && selectedProduct === '넙치') {
      const origins = availableOrigins.map(o => o.name);
      setSelectedOrigins(origins);
    }
  }, [allPriceData, availableOrigins]);

  // 탭 활성화 시 차트 리사이즈
  useEffect(() => {
    if (activeTab === '2') {
      const timer = setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [activeTab]);

  // 초기 로드 시 자동 조회
  useEffect(() => {
    if (activeTab === '2' && chartData.length === 0 && allPriceData.length > 0 && selectedOrigins.length > 0) {
      handleQuery();
    }
  }, [activeTab, allPriceData, selectedOrigins]);

  const onCategoryChange = (value) => {
    setSelectedCategory(value);
    setSelectedProduct(null);
    setSelectedSpecs([]);
    setSelectedOrigins([]);
  };

  const onProductChange = (value) => {
    setSelectedProduct(value);

    // 실제 데이터에서 해당 품목의 규격과 원산지를 추출
    const productData = allPriceData.filter(d => d.productName === value);
    const specs = [...new Set(productData.map(d => d.spec))];
    const origins = [...new Set(productData.map(d => d.originName))];

    if (specs.length > 0) {
      setSelectedSpecs([specs[0]]);
    } else {
      setSelectedSpecs([]);
    }

    setSelectedOrigins(origins);
  };

  const handlePeriodClick = (period) => {
    let startDate;
    const endDate = dayjs();

    switch(period) {
      case '1month':
        startDate = endDate.subtract(1, 'month');
        break;
      case '3months':
        startDate = endDate.subtract(3, 'month');
        break;
      case '6months':
        startDate = endDate.subtract(6, 'month');
        break;
      case '1year':
        startDate = endDate.subtract(1, 'year');
        break;
      default:
        startDate = endDate.subtract(3, 'month');
    }

    setDateRange([startDate, endDate]);
  };

  const handleOriginToggle = (originName) => {
    setSelectedOrigins(prev =>
      prev.includes(originName)
        ? prev.filter(o => o !== originName)
        : [...prev, originName]
    );
  };

  const handleQuery = () => {
    if (!selectedCategory) {
      toast.error('품목분류를 선택해주세요.');
      return;
    }

    if (!selectedProduct) {
      toast.error('품목을 선택해주세요.');
      return;
    }

    if (selectedSpecs.length === 0) {
      toast.error('규격을 선택해주세요.');
      return;
    }

    if (selectedOrigins.length === 0) {
      toast.error('원산지를 선택해주세요.');
      return;
    }

    if (!dateRange || dateRange.length !== 2) {
      toast.error('기간을 선택해주세요.');
      return;
    }

    if (dateRange[0].isAfter(dateRange[1])) {
      toast.error('시작일은 종료일보다 이전이어야 합니다.');
      return;
    }

    const filteredData = allPriceData
      .filter(item =>
        item.productName === selectedProduct &&
        selectedSpecs.includes(item.spec) &&
        selectedOrigins.includes(item.originName) &&
        dayjs(item.applyDate).isAfter(dateRange[0].subtract(1, 'day')) &&
        dayjs(item.applyDate).isBefore(dateRange[1].add(1, 'day'))
      )
      .map(item => ({
        date: item.applyDate,
        series: `${item.spec} - ${item.originName}`,
        price: item.price,
      }));

    if (filteredData.length === 0) {
      toast('조회된 데이터가 없습니다. 다른 기간이나 원산지를 선택해주세요.');
      setChartData([]);
      return;
    }

    setChartData(filteredData);
    toast.success(`차트가 생성되었습니다. (${filteredData.length}건)`);
  };

  const config = {
    data: chartData,
    xField: 'date',
    yField: 'price',
    seriesField: 'series',
    smooth: true,
    autoFit: true,
    lineStyle: {
      lineWidth: 2,
    },
    colorField: 'series',
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
    xAxis: {
      type: 'time',
      tickCount: 8,
    },
    yAxis: {
      label: {
        formatter: (v) => `${Number(v).toLocaleString()}원`,
      },
    },
    tooltip: {
      items: [
        {
          field: 'series',
          name: '규격-원산지',
        },
        {
          field: 'price',
          name: '가격',
          valueFormatter: (value) => `${Number(value).toLocaleString()}원`,
        },
      ],
    },
    legend: {
      position: 'top',
    },
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-6 w-full">
        {/* 조회 필터 */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h3 className="mb-4 text-base font-semibold text-gray-900">🔍 조회 필터</h3>
          <div className="flex flex-col gap-4">
            {/* 첫 번째 줄 */}
            <div className="flex flex-wrap gap-3 items-center">
              {/* FMSelectSimple - 품목분류 */}
              <FMSelectSimple
                value={selectedCategory}
                onChange={(value) => onCategoryChange(parseInt(value))}
                options={productCategories.map(cat => ({ value: cat.id, label: cat.name }))}
                placeholder="품목분류"
                className="w-40 min-w-[160px]"
              />

              {/* FMSelectSimple - 품목 */}
              <FMSelectSimple
                value={selectedProduct || ''}
                onChange={(value) => onProductChange(parseInt(value))}
                options={selectedCategory ? products.filter(p => p.categoryId === selectedCategory).map(p => ({ value: p.id, label: p.name })) : []}
                placeholder="품목"
                className="w-32 min-w-[128px]"
              />

              {/* FMMultiSelect - 규격 (다중 선택) */}
              <FMMultiSelect
                values={selectedSpecs}
                onChange={setSelectedSpecs}
                options={availableSpecs.map(spec => ({ value: spec.name, label: spec.name }))}
                placeholder="규격 검색 & 선택"
                className="flex-1 min-w-[280px]"
              />

              {/* 직관적인 기간 선택 UI */}
              <div className="flex-1 flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 min-w-[360px]">
                <span className="text-xs text-gray-600 whitespace-nowrap">시작일:</span>
                <input
                  type="date"
                  value={dateRange[0]?.format('YYYY-MM-DD')}
                  onChange={(e) => setDateRange([dayjs(e.target.value), dateRange[1]])}
                  className="flex-1 text-sm outline-none"
                />
                <svg className="h-4 w-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
                <span className="text-xs text-gray-600 whitespace-nowrap">종료일:</span>
                <input
                  type="date"
                  value={dateRange[1]?.format('YYYY-MM-DD')}
                  onChange={(e) => setDateRange([dateRange[0], dayjs(e.target.value)])}
                  className="flex-1 text-sm outline-none"
                />
              </div>

              <FMButton
                onClick={() => handlePeriodClick('3months')}
                variant="secondary"
                className="whitespace-nowrap"
              >
                최근 3개월
              </FMButton>
              <FMButton
                onClick={() => handlePeriodClick('6months')}
                variant="secondary"
                className="whitespace-nowrap"
              >
                최근 6개월
              </FMButton>
              <FMButton
                onClick={() => handlePeriodClick('1year')}
                variant="secondary"
                className="whitespace-nowrap"
              >
                최근 1년
              </FMButton>

              <FMButton
                onClick={handleQuery}
                variant="primary"
                className="whitespace-nowrap"
              >
                조회
              </FMButton>
            </div>

            {/* 두 번째 줄: 원산지 */}
            <div>
              <div className="mb-2 text-sm font-medium text-gray-700">원산지</div>
              <div className="flex flex-wrap gap-2">
                {availableOrigins.map(o => (
                  <label key={o.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedOrigins.includes(o.name)}
                      onChange={() => handleOriginToggle(o.name)}
                      disabled={!selectedProduct}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <span className="text-sm text-gray-700">{o.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 차트 영역 */}
        {chartData.length > 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h3 className="mb-4 text-base font-semibold text-gray-900">
              {selectedProduct || ''} - 규격별·원산지별 가격 추이
            </h3>
            <div className="w-full" style={{ height: 400 }}>
              <Line {...config} />
            </div>
          </div>
        )}

        {chartData.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-20 text-center">
            <div className="text-gray-400">
              조회 버튼을 클릭하여 차트를 생성해주세요.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StandardPriceComparison;
