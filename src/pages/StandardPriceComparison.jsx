import React, { useState, useEffect } from 'react';
import { Card, Button, DatePicker, Checkbox, Select, Space, Row, Col, message } from 'antd';
import { Line } from '@ant-design/charts';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

// Mock 데이터
const mockChartData = [
  { date: '2026-04-21', origin: '완도', price: 14500 },
  { date: '2026-04-28', origin: '완도', price: 15000 },
  { date: '2026-05-05', origin: '완도', price: 15500 },
  { date: '2026-05-12', origin: '완도', price: 15200 },
  { date: '2026-05-19', origin: '완도', price: 15800 },
  { date: '2026-05-26', origin: '완도', price: 16000 },
  { date: '2026-06-02', origin: '완도', price: 15700 },
  { date: '2026-06-09', origin: '완도', price: 15900 },
  { date: '2026-06-16', origin: '완도', price: 16200 },
  { date: '2026-06-23', origin: '완도', price: 16500 },
  { date: '2026-06-30', origin: '완도', price: 16300 },
  { date: '2026-07-07', origin: '완도', price: 16700 },
  { date: '2026-07-14', origin: '완도', price: 17000 },
  { date: '2026-07-21', origin: '완도', price: 17200 },

  { date: '2026-04-21', origin: '통영', price: 15000 },
  { date: '2026-04-28', origin: '통영', price: 15500 },
  { date: '2026-05-05', origin: '통영', price: 16000 },
  { date: '2026-05-12', origin: '통영', price: 15700 },
  { date: '2026-05-19', origin: '통영', price: 16300 },
  { date: '2026-05-26', origin: '통영', price: 16500 },
  { date: '2026-06-02', origin: '통영', price: 16200 },
  { date: '2026-06-09', origin: '통영', price: 16400 },
  { date: '2026-06-16', origin: '통영', price: 16700 },
  { date: '2026-06-23', origin: '통영', price: 17000 },
  { date: '2026-06-30', origin: '통영', price: 16800 },
  { date: '2026-07-07', origin: '통영', price: 17200 },
  { date: '2026-07-14', origin: '통영', price: 17500 },
  { date: '2026-07-21', origin: '통영', price: 17700 },

  { date: '2026-04-21', origin: '고흥', price: 14000 },
  { date: '2026-04-28', origin: '고흥', price: 14300 },
  { date: '2026-05-05', origin: '고흥', price: 14800 },
  { date: '2026-05-12', origin: '고흥', price: 14500 },
  { date: '2026-05-19', origin: '고흥', price: 15000 },
  { date: '2026-05-26', origin: '고흥', price: 15300 },
  { date: '2026-06-02', origin: '고흥', price: 15000 },
  { date: '2026-06-09', origin: '고흥', price: 15200 },
  { date: '2026-06-16', origin: '고흥', price: 15500 },
  { date: '2026-06-23', origin: '고흥', price: 15800 },
  { date: '2026-06-30', origin: '고흥', price: 15600 },
  { date: '2026-07-07', origin: '고흥', price: 16000 },
  { date: '2026-07-14', origin: '고흥', price: 16300 },
  { date: '2026-07-21', origin: '고흥', price: 16500 },
];

const mockOrigins = ['완도', '통영', '고흥', '여수'];
const mockSpecs = ['1.2kg', '1.3kg', '1.4kg', '1.5kg', '2.0kg'];

function StandardPriceComparison() {
  const [dateRange, setDateRange] = useState([dayjs().subtract(3, 'month'), dayjs()]);
  const [selectedOrigins, setSelectedOrigins] = useState(['완도', '통영', '고흥']);
  const [selectedSpec, setSelectedSpec] = useState('1.2kg');
  const [chartData, setChartData] = useState([]);
  const [availableOrigins, setAvailableOrigins] = useState(mockOrigins);

  useEffect(() => {
    // 초기 로드
    handleQuery();
  }, []);

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
    if (selectedOrigins.length === 0) {
      message.error('원산지를 선택해주세요.');
      return;
    }

    if (!selectedSpec) {
      message.error('규격을 선택해주세요.');
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

    // 선택된 원산지에 따라 데이터 필터링
    const filteredData = mockChartData.filter(item =>
      selectedOrigins.includes(item.origin) &&
      dayjs(item.date).isAfter(dateRange[0].subtract(1, 'day')) &&
      dayjs(item.date).isBefore(dateRange[1].add(1, 'day'))
    );

    if (filteredData.length === 0) {
      message.warning('조회된 데이터가 없습니다.');
      setChartData([]);
      return;
    }

    setChartData(filteredData);
    message.success('차트가 생성되었습니다.');
  };

  const config = {
    data: chartData,
    xField: 'date',
    yField: 'price',
    seriesField: 'origin',
    smooth: true,
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
      formatter: (datum) => {
        return {
          name: datum.origin,
          value: `${datum.price.toLocaleString()}원`,
        };
      },
    },
    legend: {
      position: 'top',
    },
    color: ['#1890ff', '#52c41a', '#faad14', '#f5222d'],
  };

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>원산지별 표준가격 비교</h2>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
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
            options={availableOrigins}
            value={selectedOrigins}
            onChange={handleOriginChange}
          />
          <div style={{ marginTop: 8, color: '#999', fontSize: 12 }}>
            * 최소 1개 이상 선택 필수
          </div>
        </Card>

        {/* 규격 설정 */}
        <Card title="규격 설정" size="small">
          <Select
            value={selectedSpec}
            onChange={setSelectedSpec}
            style={{ width: '100%' }}
            placeholder="규격 선택"
          >
            {mockSpecs.map(spec => (
              <Option key={spec} value={spec}>
                {spec}
              </Option>
            ))}
          </Select>
        </Card>

        {/* 조회 버튼 */}
        <Button type="primary" size="large" block onClick={handleQuery}>
          조회
        </Button>

        {/* 차트 영역 */}
        {chartData.length > 0 && (
          <Card title="원산지별 가격 추이" size="small">
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
