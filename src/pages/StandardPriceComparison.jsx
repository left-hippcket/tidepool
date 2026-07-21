import React, { useState, useEffect } from 'react';
import { Card, Button, DatePicker, Checkbox, Select, Space, Row, Col, message } from 'antd';
import { Line } from '@ant-design/charts';
import dayjs from 'dayjs';
import { productCategories, products, origins, specifications } from '../data/mockData';

const { RangePicker } = DatePicker;
const { Option } = Select;

function StandardPriceComparison() {
  const [dateRange, setDateRange] = useState([dayjs().subtract(3, 'month'), dayjs()]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOrigins, setSelectedOrigins] = useState([]);
  const [selectedSpec, setSelectedSpec] = useState(null);
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

  const onCategoryChange = (value) => {
    setSelectedCategory(value);
    setSelectedProduct(null);
    setSelectedSpec(null);
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
      setSelectedSpec(productSpecs[0].name);
    } else {
      setSelectedSpec(null);
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

    if (!selectedSpec) {
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

    // 실제 데이터에서 필터링
    const filteredData = allPriceData
      .filter(item =>
        item.productId === selectedProduct &&
        item.spec === selectedSpec &&
        selectedOrigins.includes(item.originName) &&
        dayjs(item.applyDate).isAfter(dateRange[0].subtract(1, 'day')) &&
        dayjs(item.applyDate).isBefore(dateRange[1].add(1, 'day'))
      )
      .map(item => ({
        date: item.applyDate,
        origin: item.originName,
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
    seriesField: 'origin',
    smooth: true,
    colorField: 'origin',
    scale: {
      color: {
        domain: ['완도', '제주', '통영'],
        range: ['#1890ff', '#52c41a', '#faad14'],
      },
    },
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
          field: 'origin',
          name: '원산지',
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
    <div>
      <h2 style={{ marginBottom: 24 }}>원산지별 표준가격 비교</h2>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 품목 선택 */}
        <Card title="품목 선택" size="small">
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <div>
              <div style={{ marginBottom: 8, fontWeight: 500 }}>품목분류</div>
              <Select
                value={selectedCategory}
                onChange={onCategoryChange}
                style={{ width: '100%' }}
                placeholder="품목분류 선택"
              >
                {productCategories.map(category => (
                  <Option key={category.id} value={category.id}>
                    {category.name}
                  </Option>
                ))}
              </Select>
            </div>

            <div>
              <div style={{ marginBottom: 8, fontWeight: 500 }}>품목</div>
              <Select
                value={selectedProduct}
                onChange={onProductChange}
                style={{ width: '100%' }}
                placeholder="품목 선택"
                disabled={!selectedCategory}
              >
                {selectedCategory && products
                  .filter(p => p.categoryId === selectedCategory)
                  .map(product => (
                    <Option key={product.id} value={product.id}>
                      {product.name}
                    </Option>
                  ))}
              </Select>
            </div>

            <div>
              <div style={{ marginBottom: 8, fontWeight: 500 }}>규격</div>
              <Select
                value={selectedSpec}
                onChange={setSelectedSpec}
                style={{ width: '100%' }}
                placeholder="규격 선택"
                disabled={!selectedProduct}
              >
                {availableSpecs.map(spec => (
                  <Option key={spec.id} value={spec.name}>
                    {spec.name}
                  </Option>
                ))}
              </Select>
            </div>
          </Space>
        </Card>

        {/* 기간 설정 */}
        <Card title="기간 설정" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Space wrap>
              <Button onClick={() => handlePeriodClick('1month')}>최근 1개월</Button>
              <Button onClick={() => handlePeriodClick('3months')}>최근 3개월</Button>
              <Button onClick={() => handlePeriodClick('6months')}>최근 6개월</Button>
              <Button onClick={() => handlePeriodClick('1year')}>최근 1년</Button>
            </Space>
            <RangePicker
              value={dateRange}
              onChange={setDateRange}
              format="YYYY-MM-DD"
              style={{ width: '100%' }}
            />
          </Space>
        </Card>

        {/* 원산지 설정 */}
        <Card title="원산지 설정" size="small">
          <Checkbox.Group
            options={availableOrigins.map(o => ({ label: o.name, value: o.name }))}
            value={selectedOrigins}
            onChange={handleOriginChange}
            disabled={!selectedProduct}
          />
          <div style={{ marginTop: 8, color: '#999', fontSize: 12 }}>
            * 최소 1개 이상 선택 필수 (품목 선택 시 자동으로 모두 선택됨)
          </div>
        </Card>

        {/* 조회 버튼 */}
        <Button type="primary" size="large" block onClick={handleQuery}>
          조회
        </Button>

        {/* 차트 영역 */}
        {chartData.length > 0 && (
          <Card
            title={`${products.find(p => p.id === selectedProduct)?.name || ''} ${selectedSpec} - 원산지별 가격 추이`}
            size="small"
          >
            <Line {...config} height={400} />
          </Card>
        )}

        {chartData.length === 0 && (
          <Card size="small">
            <div style={{ padding: '80px 20px', textAlign: 'center', color: '#999' }}>
              조회 버튼을 클릭하여 차트를 생성해주세요.
            </div>
          </Card>
        )}
      </Space>
    </div>
  );
}

export default StandardPriceComparison;
