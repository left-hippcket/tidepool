import React, { useState, useEffect } from 'react';
import { Card, Button, DatePicker, Checkbox, Select, Space, Row, Col, message } from 'antd';
import { Line } from '@ant-design/charts';
import dayjs from 'dayjs';
import { productCategories, products, origins, specifications } from '../data/mockData';

const { RangePicker } = DatePicker;
const { Option } = Select;

function StandardPriceComparison({ activeTab }) {
  const [dateRange, setDateRange] = useState([dayjs().subtract(1, 'year'), dayjs()]);
  const [selectedCategory, setSelectedCategory] = useState(1); // 누운고기
  const [selectedProduct, setSelectedProduct] = useState(2); // 넙치
  const [selectedOrigins, setSelectedOrigins] = useState([]);
  const [selectedSpecs, setSelectedSpecs] = useState(['1.5kg']);
  const [chartData, setChartData] = useState([]);
  const [availableOrigins, setAvailableOrigins] = useState([]);
  const [availableSpecs, setAvailableSpecs] = useState([]);
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

  // 초기 로드 시 넙치의 규격과 원산지 자동 설정
  useEffect(() => {
    if (selectedProduct === 2) {
      // 넙치의 규격
      const productSpecs = specifications.filter(s =>
        s.productId === 2 && s.status === 'active'
      );
      setAvailableSpecs(productSpecs);

      // 넙치의 원산지
      const productOrigins = origins.filter(o =>
        o.productId === 2 && o.status === 'active'
      );
      setAvailableOrigins(productOrigins);
      setSelectedOrigins(productOrigins.map(o => o.name));
    }
  }, []);

  // 탭 활성화 시 차트 리사이즈
  useEffect(() => {
    if (activeTab === '2') {
      // 탭 전환 애니메이션이 완료될 때까지 대기
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
    setAvailableOrigins([]);
    setAvailableSpecs([]);
  };

  const onProductChange = (value) => {
    setSelectedProduct(value);

    // 해당 품목의 규격 필터링
    const productSpecs = specifications.filter(s =>
      s.productId === value && s.status === 'active'
    );
    setAvailableSpecs(productSpecs);

    // 해당 품목의 원산지 필터링
    const productOrigins = origins.filter(o =>
      o.productId === value && o.status === 'active'
    );
    setAvailableOrigins(productOrigins);

    // 자동으로 첫 번째 규격 선택
    if (productSpecs.length > 0) {
      setSelectedSpecs([productSpecs[0].name]);
    } else {
      setSelectedSpecs([]);
    }

    // 자동으로 모든 원산지 선택
    setSelectedOrigins(productOrigins.map(o => o.name));
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

  const handleOriginChange = (checkedValues) => {
    setSelectedOrigins(checkedValues);
  };

  const handleQuery = () => {
    if (!selectedCategory) {
      message.error('품목분류를 선택해주세요.');
      return;
    }

    if (!selectedProduct) {
      message.error('품목을 선택해주세요.');
      return;
    }

    if (selectedSpecs.length === 0) {
      message.error('규격을 선택해주세요.');
      return;
    }

    if (selectedOrigins.length === 0) {
      message.error('원산지를 선택해주세요.');
      return;
    }

    if (!dateRange || dateRange.length !== 2) {
      message.error('기간을 선택해주세요.');
      return;
    }

    if (dateRange[0].isAfter(dateRange[1])) {
      message.error('시작일은 종료일보다 이전이어야 합니다.');
      return;
    }

    // 실제 데이터에서 필터링 - 규격과 원산지 조합
    const filteredData = allPriceData
      .filter(item =>
        item.productId === selectedProduct &&
        selectedSpecs.includes(item.spec) &&
        selectedOrigins.includes(item.originName) &&
        dayjs(item.applyDate).isAfter(dateRange[0].subtract(1, 'day')) &&
        dayjs(item.applyDate).isBefore(dateRange[1].add(1, 'day'))
      )
      .map(item => ({
        date: item.applyDate,
        series: `${item.spec} - ${item.originName}`, // 규격-원산지 조합
        price: item.price,
      }));

    if (filteredData.length === 0) {
      message.warning('조회된 데이터가 없습니다. 다른 기간이나 원산지를 선택해주세요.');
      setChartData([]);
      return;
    }

    setChartData(filteredData);
    message.success(`차트가 생성되었습니다. (${filteredData.length}건)`);
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
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
        {/* 조회 필터 */}
        <Card title="🔍 조회 필터" style={{ width: '100%' }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            {/* 첫 번째 줄: 품목분류, 품목, 규격, 기간 */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <Select
                value={selectedCategory}
                onChange={onCategoryChange}
                placeholder="품목분류"
                style={{ flex: 1 }}
              >
                {productCategories.map(category => (
                  <Option key={category.id} value={category.id}>
                    {category.name}
                  </Option>
                ))}
              </Select>

              <Select
                value={selectedProduct}
                onChange={onProductChange}
                placeholder="품목"
                disabled={!selectedCategory}
                style={{ flex: 1 }}
              >
                {selectedCategory && products
                  .filter(p => p.categoryId === selectedCategory)
                  .map(product => (
                    <Option key={product.id} value={product.id}>
                      {product.name}
                    </Option>
                  ))}
              </Select>

              <Select
                mode="multiple"
                value={selectedSpecs}
                onChange={setSelectedSpecs}
                placeholder="규격"
                disabled={!selectedProduct}
                style={{ flex: 1 }}
              >
                {availableSpecs.map(spec => (
                  <Option key={spec.id} value={spec.name}>
                    {spec.name}
                  </Option>
                ))}
              </Select>

              <RangePicker
                value={dateRange}
                onChange={setDateRange}
                placeholder={['시작일', '종료일']}
                style={{ flex: 2 }}
              />

              <Button size="small" onClick={() => handlePeriodClick('3months')}>최근 3개월</Button>
              <Button size="small" onClick={() => handlePeriodClick('6months')}>최근 6개월</Button>
              <Button size="small" onClick={() => handlePeriodClick('1year')}>최근 1년</Button>

              <Button type="primary" onClick={handleQuery} style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
                조회
              </Button>
            </div>

            {/* 두 번째 줄: 원산지 */}
            <div>
              <div style={{ marginBottom: 8, fontWeight: 500 }}>원산지</div>
              <Checkbox.Group
                options={availableOrigins.map(o => ({ label: o.name, value: o.name }))}
                value={selectedOrigins}
                onChange={handleOriginChange}
                disabled={!selectedProduct}
              />
            </div>
          </Space>
        </Card>

        {/* 차트 영역 */}
        {chartData.length > 0 && (
          <Card
            title={`${products.find(p => p.id === selectedProduct)?.name || ''} - 규격별·원산지별 가격 추이`}
            size="small"
            style={{ width: '100%' }}
          >
            <div style={{ width: '100%', height: 400 }}>
              <Line {...config} />
            </div>
          </Card>
        )}

        {chartData.length === 0 && (
          <Card size="small" style={{ width: '100%' }}>
            <div style={{ padding: '80px 20px', textAlign: 'center', color: '#999' }}>
              조회 버튼을 클릭하여 차트를 생성해주세요.
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

export default StandardPriceComparison;
