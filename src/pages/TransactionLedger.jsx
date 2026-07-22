import React, { useState, useEffect } from 'react';
import {
  Card, Tabs, Table, Button, DatePicker, Space, Typography, Descriptions,
  Divider, Checkbox, Collapse, message, Spin, Dropdown
} from 'antd';
import {
  DownloadOutlined, FileTextOutlined, ShoppingCartOutlined,
  CarOutlined, TeamOutlined, WarningOutlined, DollarOutlined,
  DownOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { transactionLedgerData } from '../data/mockData';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

function TransactionLedger() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('summary');
  const [dateRange, setDateRange] = useState([dayjs().subtract(6, 'day'), dayjs()]);
  const [expandedRowKey, setExpandedRowKey] = useState(null);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [downloading, setDownloading] = useState(false);

  // 전체 보기 탭 기본 선택 칼럼 (거래식별 정보 제외)
  const defaultColumns = [
    '주문일', '납품일', '품목', '원산지', '규격',
    '주문수량', '주문단위', '주문중량', '상차단가', '상차수수료율',
    '통당운임단가', '운송비포함여부', '도착단가', '알파수익단가',
    '셀러명', '셀러그룹명', '바이어명', '바이어그룹명', '바이어사업권역', '드라이버명',
    '클레임/조정 유형', '클레임/조정 내용', '바이어정산조정금액', '셀러정산조정물량',
    '셀러정산조정금액', '드라이버정산조정금액', '회계처리용조정금액',
    '매출액', '매입액', '운송비(비용)', '거래손익', '상차수수료수익',
    '셀러조정손익', '바이어조정손익', '거래메모'
  ];

  useEffect(() => {
    // localStorage에서 저장된 칼럼 설정 불러오기
    const saved = localStorage.getItem('transaction_ledger_columns');
    if (saved) {
      const parsed = JSON.parse(saved);
      setSelectedColumns(parsed.selectedColumns || defaultColumns);
    } else {
      setSelectedColumns(defaultColumns);
    }
  }, []);

  // 날짜 범위 필터링
  const getFilteredData = () => {
    if (!dateRange || dateRange.length !== 2) return transactionLedgerData;

    const [start, end] = dateRange;
    return transactionLedgerData.filter(item => {
      const deliveryDate = dayjs(item.납품일);
      return deliveryDate.isSameOrAfter(start, 'day') && deliveryDate.isSameOrBefore(end, 'day');
    });
  };

  const filteredData = getFilteredData();

  // 빠른 날짜 선택
  const handleQuickDate = (type) => {
    const today = dayjs();
    switch(type) {
      case 'today':
        setDateRange([today, today]);
        break;
      case 'yesterday':
        setDateRange([today.subtract(1, 'day'), today.subtract(1, 'day')]);
        break;
      case '7days':
        setDateRange([today.subtract(6, 'day'), today]);
        break;
      case '30days':
        setDateRange([today.subtract(29, 'day'), today]);
        break;
      default:
        break;
    }
  };

  // 금액 포맷
  const formatCurrency = (value) => {
    if (value === null || value === undefined) return '-';
    return `${value.toLocaleString()}원`;
  };

  // 손익 색상
  const getProfitColor = (value) => {
    if (value < 0) return '#ff4d4f';
    return undefined;
  };

  // CSV 다운로드
  const handleCSVDownload = async (type = 'period') => {
    setDownloading(true);
    try {
      // 시뮬레이션: 실제로는 서버에서 다운로드
      await new Promise(resolve => setTimeout(resolve, type === 'all' ? 2000 : 500));

      const dataToExport = type === 'all' ? transactionLedgerData : filteredData;

      if (dataToExport.length === 0) {
        message.warning('조회된 데이터가 없습니다.');
        return;
      }

      // CSV 생성 로직 (간단한 예시)
      const headers = Object.keys(dataToExport[0]).join(',');
      const rows = dataToExport.map(row => Object.values(row).join(','));
      const csv = [headers, ...rows].join('\n');

      const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      const startDate = type === 'all' ? '20180101' : dayjs(dateRange[0]).format('YYYYMMDD');
      const endDate = dayjs(type === 'all' ? dayjs() : dateRange[1]).format('YYYYMMDD');
      const filename = type === 'all'
        ? `거래장부_전체기간_${startDate}-${endDate}.csv`
        : `거래장부_${startDate}-${endDate}.csv`;

      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);

      message.success(
        type === 'all'
          ? `전체 기간 CSV 파일이 다운로드되었습니다. (총 ${dataToExport.length}건)`
          : 'CSV 파일이 다운로드되었습니다.'
      );
    } catch (error) {
      message.error('CSV 다운로드에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setDownloading(false);
    }
  };

  // 아코디언 상세 패널
  const renderExpandedRow = (record) => {
    return (
      <div style={{ maxHeight: '600px', overflowY: 'auto', padding: '16px', backgroundColor: '#fafafa' }}>
        {/* 1. 기본정보 */}
        <Title level={5}><FileTextOutlined /> 기본정보</Title>
        <Descriptions column={3} bordered size="small">
          <Descriptions.Item label="거래코드">{record.거래코드}</Descriptions.Item>
          <Descriptions.Item label="주문일">{record.주문일}</Descriptions.Item>
          <Descriptions.Item label="납품일">{record.납품일}</Descriptions.Item>
          <Descriptions.Item label="품목">{record.품목}</Descriptions.Item>
          <Descriptions.Item label="원산지">{record.원산지}</Descriptions.Item>
          <Descriptions.Item label="규격">{record.규격}</Descriptions.Item>
        </Descriptions>
        <Divider />

        {/* 2. 수량·단가 */}
        <Title level={5}><ShoppingCartOutlined /> 수량·단가</Title>
        <Descriptions column={3} bordered size="small">
          <Descriptions.Item label="주문수량">{record.주문수량} {record.주문단위}</Descriptions.Item>
          <Descriptions.Item label="주문단위">{record.주문단위}</Descriptions.Item>
          <Descriptions.Item label="주문중량">{record.주문중량}kg</Descriptions.Item>
          <Descriptions.Item label="상차단가">{formatCurrency(record.상차단가)}</Descriptions.Item>
          <Descriptions.Item label="상차수수료율">{record.상차수수료율}%</Descriptions.Item>
          <Descriptions.Item label="도착단가">{formatCurrency(record.도착단가)}</Descriptions.Item>
          <Descriptions.Item label="알파수익단가">
            <Text style={{ color: getProfitColor(record.알파수익단가) }}>
              {formatCurrency(record.알파수익단가)}
            </Text>
          </Descriptions.Item>
        </Descriptions>
        <Divider />

        {/* 3. 운송 */}
        <Title level={5}><CarOutlined /> 운송</Title>
        <Descriptions column={3} bordered size="small">
          <Descriptions.Item label="통당운임단가">{formatCurrency(record.통당운임단가)}</Descriptions.Item>
          <Descriptions.Item label="운송비포함여부">{record.운송비포함여부}</Descriptions.Item>
          <Descriptions.Item label="운송비(비용)">{formatCurrency(record['운송비(비용)'])}</Descriptions.Item>
          <Descriptions.Item label="드라이버명">{record.드라이버명}</Descriptions.Item>
        </Descriptions>
        <Divider />

        {/* 4. 파트너 */}
        <Title level={5}><TeamOutlined /> 파트너</Title>
        <Descriptions column={3} bordered size="small">
          <Descriptions.Item label="셀러명">{record.셀러명}</Descriptions.Item>
          <Descriptions.Item label="셀러그룹명">{record.셀러그룹명}</Descriptions.Item>
          <Descriptions.Item label="바이어명">{record.바이어명}</Descriptions.Item>
          <Descriptions.Item label="바이어그룹명">{record.바이어그룹명}</Descriptions.Item>
          <Descriptions.Item label="바이어사업권역">{record.바이어사업권역}</Descriptions.Item>
        </Descriptions>
        <Divider />

        {/* 5. 조정·클레임 */}
        <Title level={5}><WarningOutlined /> 조정·클레임</Title>
        <Descriptions column={3} bordered size="small">
          <Descriptions.Item label="유형" span={3}>{record['클레임/조정 유형'] || '-'}</Descriptions.Item>
          <Descriptions.Item label="내용" span={3}>{record['클레임/조정 내용'] || '-'}</Descriptions.Item>
          <Descriptions.Item label="바이어조정액">
            <Text style={{ color: getProfitColor(record.바이어정산조정금액) }}>
              {formatCurrency(record.바이어정산조정금액)}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="셀러조정물량">{record.셀러정산조정물량 || '-'}</Descriptions.Item>
          <Descriptions.Item label="셀러조정액">
            <Text style={{ color: getProfitColor(record.셀러정산조정금액) }}>
              {formatCurrency(record.셀러정산조정금액)}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="기사조정액">
            <Text style={{ color: getProfitColor(record.드라이버정산조정금액) }}>
              {formatCurrency(record.드라이버정산조정금액)}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="회계처리조정액">
            <Text style={{ color: getProfitColor(record.회계처리용조정금액) }}>
              {formatCurrency(record.회계처리용조정금액)}
            </Text>
          </Descriptions.Item>
        </Descriptions>
        <Divider />

        {/* 6. 손익 */}
        <div id="profit-section">
          <Title level={5}><DollarOutlined /> 손익</Title>
          <Descriptions column={3} bordered size="small">
            <Descriptions.Item label="매출액">{formatCurrency(record.매출액)}</Descriptions.Item>
            <Descriptions.Item label="매입액">{formatCurrency(record.매입액)}</Descriptions.Item>
            <Descriptions.Item label="운송비(비용)">{formatCurrency(record['운송비(비용)'])}</Descriptions.Item>
            <Descriptions.Item label="거래손익">
              <Text style={{ color: getProfitColor(record.거래손익) }}>
                {formatCurrency(record.거래손익)}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="상차수수료수익">{formatCurrency(record.상차수수료수익)}</Descriptions.Item>
            <Descriptions.Item label="셀러조정손익">
              <Text style={{ color: getProfitColor(record.셀러조정손익) }}>
                {formatCurrency(record.셀러조정손익)}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="바이어조정손익">
              <Text style={{ color: getProfitColor(record.바이어조정손익) }}>
                {formatCurrency(record.바이어조정손익)}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="거래메모" span={3}>
              <Text style={{ color: '#1890ff' }}>{record.거래메모 || '-'}</Text>
            </Descriptions.Item>
          </Descriptions>
        </div>
      </div>
    );
  };

  // 행 클릭 핸들러
  const handleRowClick = (record) => {
    if (activeTab === 'all') return; // 전체 보기에서는 아코디언 없음

    if (expandedRowKey === record.key) {
      setExpandedRowKey(null);
    } else {
      setExpandedRowKey(record.key);
    }
  };

  // 메모 보기 버튼 클릭
  const handleMemoClick = (e, record) => {
    e.stopPropagation();
    setExpandedRowKey(record.key);

    setTimeout(() => {
      const profitSection = document.getElementById('profit-section');
      profitSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
  };

  // 탭 1: 거래 요약보기
  const summaryColumns = [
    {
      title: '납품일',
      dataIndex: '납품일',
      key: '납품일',
      width: 110,
    },
    {
      title: '품목',
      dataIndex: '품목',
      key: '품목',
      width: 80,
    },
    {
      title: '원산지',
      dataIndex: '원산지',
      key: '원산지',
      width: 80,
    },
    {
      title: '규격',
      dataIndex: '규격',
      key: '규격',
      width: 90,
    },
    {
      title: '주문수량',
      dataIndex: '주문수량',
      key: '주문수량',
      width: 90,
      render: (text, record) => `${text} ${record.주문단위}`,
    },
    {
      title: '주문중량',
      dataIndex: '주문중량',
      key: '주문중량',
      width: 90,
      render: (text) => `${text}kg`,
    },
    {
      title: '셀러그룹명',
      dataIndex: '셀러그룹명',
      key: '셀러그룹명',
      width: 130,
    },
    {
      title: '바이어그룹명',
      dataIndex: '바이어그룹명',
      key: '바이어그룹명',
      width: 130,
    },
    {
      title: '매출액',
      dataIndex: '매출액',
      key: '매출액',
      width: 110,
      render: formatCurrency,
      align: 'right',
    },
    {
      title: '거래손익',
      dataIndex: '거래손익',
      key: '거래손익',
      width: 110,
      render: (value) => (
        <Text style={{ color: getProfitColor(value) }}>
          {formatCurrency(value)}
        </Text>
      ),
      align: 'right',
    },
    {
      title: '거래메모',
      dataIndex: '거래메모',
      key: '거래메모',
      width: 90,
      render: (text, record) => text ? (
        <Button type="link" size="small" onClick={(e) => handleMemoClick(e, record)}>
          메모 보기
        </Button>
      ) : null,
    },
  ];

  // 탭 2: 거래단가 정보
  const priceColumns = [
    {
      title: '납품일',
      dataIndex: '납품일',
      key: '납품일',
      width: 110,
    },
    {
      title: '품목',
      dataIndex: '품목',
      key: '품목',
      width: 80,
    },
    {
      title: '원산지',
      dataIndex: '원산지',
      key: '원산지',
      width: 80,
    },
    {
      title: '규격',
      dataIndex: '규격',
      key: '규격',
      width: 90,
    },
    {
      title: '상차단가',
      dataIndex: '상차단가',
      key: '상차단가',
      width: 110,
      render: formatCurrency,
      align: 'right',
    },
    {
      title: '도착단가',
      dataIndex: '도착단가',
      key: '도착단가',
      width: 110,
      render: formatCurrency,
      align: 'right',
    },
    {
      title: (
        <span>
          알파수익단가
          <Text type="secondary" style={{ fontSize: 11, marginLeft: 4 }}>
            ⓘ
          </Text>
        </span>
      ),
      dataIndex: '알파수익단가',
      key: '알파수익단가',
      width: 130,
      render: (value) => (
        <Text style={{ color: getProfitColor(value) }}>
          {formatCurrency(value)}
        </Text>
      ),
      align: 'right',
    },
    {
      title: '통당운임단가',
      dataIndex: '통당운임단가',
      key: '통당운임단가',
      width: 120,
      render: formatCurrency,
      align: 'right',
    },
  ];

  // 탭 3: 손익 정보
  const profitColumns = [
    {
      title: '납품일',
      dataIndex: '납품일',
      key: '납품일',
      width: 110,
    },
    {
      title: '품목',
      dataIndex: '품목',
      key: '품목',
      width: 80,
    },
    {
      title: '셀러그룹명',
      dataIndex: '셀러그룹명',
      key: '셀러그룹명',
      width: 130,
    },
    {
      title: '바이어그룹명',
      dataIndex: '바이어그룹명',
      key: '바이어그룹명',
      width: 130,
    },
    {
      title: '매출액',
      dataIndex: '매출액',
      key: '매출액',
      width: 110,
      render: formatCurrency,
      align: 'right',
    },
    {
      title: '매입액',
      dataIndex: '매입액',
      key: '매입액',
      width: 110,
      render: formatCurrency,
      align: 'right',
    },
    {
      title: '운송비(비용)',
      dataIndex: '운송비(비용)',
      key: '운송비(비용)',
      width: 110,
      render: formatCurrency,
      align: 'right',
    },
    {
      title: '거래손익',
      dataIndex: '거래손익',
      key: '거래손익',
      width: 110,
      render: (value) => (
        <Text style={{ color: getProfitColor(value) }}>
          {formatCurrency(value)}
        </Text>
      ),
      align: 'right',
    },
  ];

  // 탭 4: 전체 보기 - 동적 칼럼 생성
  const getAllColumns = () => {
    const allFields = {
      '주문코드': { width: 150 },
      '거래코드': { width: 150 },
      '운송코드': { width: 150 },
      '주문일': { width: 120 },
      '납품일': { width: 120 },
      '품목': { width: 100 },
      '원산지': { width: 100 },
      '규격': { width: 100 },
      '주문수량': { width: 100, render: (text, record) => `${text} ${record.주문단위}` },
      '주문단위': { width: 80 },
      '주문중량': { width: 100, render: (text) => `${text}kg` },
      '상차단가': { width: 120, render: formatCurrency, align: 'right' },
      '상차수수료율': { width: 120, render: (text) => `${text}%`, align: 'right' },
      '통당운임단가': { width: 120, render: formatCurrency, align: 'right' },
      '운송비포함여부': { width: 120 },
      '도착단가': { width: 120, render: formatCurrency, align: 'right' },
      '알파수익단가': { width: 120, render: (value) => <Text style={{ color: getProfitColor(value) }}>{formatCurrency(value)}</Text>, align: 'right' },
      '셀러명': { width: 120 },
      '셀러그룹명': { width: 150 },
      '바이어명': { width: 120 },
      '바이어그룹명': { width: 150 },
      '바이어사업권역': { width: 120 },
      '드라이버명': { width: 100 },
      '클레임/조정 유형': { width: 150 },
      '클레임/조정 내용': { width: 200 },
      '바이어정산조정금액': { width: 150, render: (value) => <Text style={{ color: getProfitColor(value) }}>{formatCurrency(value)}</Text>, align: 'right' },
      '셀러정산조정물량': { width: 150 },
      '셀러정산조정금액': { width: 150, render: (value) => <Text style={{ color: getProfitColor(value) }}>{formatCurrency(value)}</Text>, align: 'right' },
      '드라이버정산조정금액': { width: 150, render: (value) => <Text style={{ color: getProfitColor(value) }}>{formatCurrency(value)}</Text>, align: 'right' },
      '회계처리용조정금액': { width: 150, render: (value) => <Text style={{ color: getProfitColor(value) }}>{formatCurrency(value)}</Text>, align: 'right' },
      '매출액': { width: 120, render: formatCurrency, align: 'right' },
      '매입액': { width: 120, render: formatCurrency, align: 'right' },
      '운송비(비용)': { width: 120, render: formatCurrency, align: 'right' },
      '거래손익': { width: 120, render: (value) => <Text style={{ color: getProfitColor(value) }}>{formatCurrency(value)}</Text>, align: 'right' },
      '상차수수료수익': { width: 120, render: formatCurrency, align: 'right' },
      '셀러조정손익': { width: 120, render: (value) => <Text style={{ color: getProfitColor(value) }}>{formatCurrency(value)}</Text>, align: 'right' },
      '바이어조정손익': { width: 120, render: (value) => <Text style={{ color: getProfitColor(value) }}>{formatCurrency(value)}</Text>, align: 'right' },
      '거래메모': { width: 200 },
    };

    return selectedColumns
      .filter(col => allFields[col])
      .map(col => ({
        title: col,
        dataIndex: col,
        key: col,
        ...allFields[col],
      }));
  };

  // 칼럼 선택 변경
  const handleColumnChange = (checkedValues) => {
    setSelectedColumns(checkedValues);
    localStorage.setItem('transaction_ledger_columns', JSON.stringify({
      selectedColumns: checkedValues,
      lastUpdated: new Date().toISOString()
    }));
  };

  // 전체 선택/해제
  const handleSelectAll = () => {
    const allColumns = [
      '주문코드', '거래코드', '운송코드',
      ...defaultColumns
    ];
    setSelectedColumns(allColumns);
    localStorage.setItem('transaction_ledger_columns', JSON.stringify({
      selectedColumns: allColumns,
      lastUpdated: new Date().toISOString()
    }));
  };

  const handleDeselectAll = () => {
    setSelectedColumns([]);
    localStorage.setItem('transaction_ledger_columns', JSON.stringify({
      selectedColumns: [],
      lastUpdated: new Date().toISOString()
    }));
  };

  const downloadMenuItems = [
    {
      key: 'period',
      label: '조회 기간 다운로드',
      onClick: () => handleCSVDownload('period'),
    },
    {
      key: 'all',
      label: '전체 기간 다운로드',
      onClick: () => handleCSVDownload('all'),
    },
  ];

  return (
    <div>
      {/* 헤더 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>장부 조회</Title>
      </div>

      {/* 기간 설정 */}
      <Card className="mb-4">
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Space wrap>
            <Button onClick={() => handleQuickDate('today')}>오늘</Button>
            <Button onClick={() => handleQuickDate('yesterday')}>어제</Button>
            <Button onClick={() => handleQuickDate('7days')}>최근 7일</Button>
            <Button onClick={() => handleQuickDate('30days')}>최근 30일</Button>
          </Space>
          <RangePicker
            value={dateRange}
            onChange={setDateRange}
            format="YYYY-MM-DD"
            style={{ width: '100%', maxWidth: 400 }}
          />
        </Space>
      </Card>

      {/* 탭 */}
      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          tabBarExtraContent={
            <Dropdown.Button
              type="primary"
              icon={<DownOutlined />}
              loading={downloading}
              onClick={() => handleCSVDownload('period')}
              menu={{ items: downloadMenuItems }}
            >
              <DownloadOutlined /> CSV 다운로드
            </Dropdown.Button>
          }
          items={[
            {
              key: 'summary',
              label: '거래 요약보기',
              children: (
                <Table
                  columns={summaryColumns}
                  dataSource={filteredData}
                  pagination={{ pageSize: 20, showSizeChanger: true, pageSizeOptions: ['10', '20', '50', '100'] }}
                  scroll={{ x: 1400 }}
                  onRow={(record) => ({
                    onClick: () => handleRowClick(record),
                    style: { cursor: 'pointer' }
                  })}
                  expandable={{
                    expandedRowKeys: expandedRowKey ? [expandedRowKey] : [],
                    expandedRowRender: renderExpandedRow,
                    showExpandColumn: false,
                  }}
                />
              ),
            },
            {
              key: 'price',
              label: '거래단가 정보',
              children: (
                <Table
                  columns={priceColumns}
                  dataSource={filteredData}
                  pagination={{ pageSize: 20, showSizeChanger: true, pageSizeOptions: ['10', '20', '50', '100'] }}
                  scroll={{ x: 1000 }}
                  onRow={(record) => ({
                    onClick: () => handleRowClick(record),
                    style: { cursor: 'pointer' }
                  })}
                  expandable={{
                    expandedRowKeys: expandedRowKey ? [expandedRowKey] : [],
                    expandedRowRender: renderExpandedRow,
                    showExpandColumn: false,
                  }}
                />
              ),
            },
            {
              key: 'profit',
              label: '손익 정보',
              children: (
                <Table
                  columns={profitColumns}
                  dataSource={filteredData}
                  pagination={{ pageSize: 20, showSizeChanger: true, pageSizeOptions: ['10', '20', '50', '100'] }}
                  scroll={{ x: 1000 }}
                  onRow={(record) => ({
                    onClick: () => handleRowClick(record),
                    style: { cursor: 'pointer' }
                  })}
                  expandable={{
                    expandedRowKeys: expandedRowKey ? [expandedRowKey] : [],
                    expandedRowRender: renderExpandedRow,
                    showExpandColumn: false,
                  }}
                />
              ),
            },
            {
              key: 'all',
              label: '전체 보기',
              children: (
                <>
                  <Table
                    columns={getAllColumns()}
                    dataSource={filteredData}
                    pagination={{ pageSize: 20, showSizeChanger: true, pageSizeOptions: ['10', '20', '50', '100'] }}
                    scroll={{ x: 'max-content' }}
                    locale={{
                      emptyText: selectedColumns.length === 0 ? '칼럼을 선택해주세요.' : '조회된 데이터가 없습니다.'
                    }}
                  />

                  {/* 칼럼 선택 섹션 */}
                  <Card title="칼럼 선택" style={{ marginTop: 16 }} extra={
                    <Space>
                      <Button size="small" onClick={handleSelectAll}>전체 선택</Button>
                      <Button size="small" onClick={handleDeselectAll}>전체 해제</Button>
                    </Space>
                  }>
                    <Collapse defaultActiveKey={['1', '2', '3', '4', '5', '6', '7', '8']}>
                      <Collapse.Panel header="거래식별 정보" key="1">
                        <Space wrap>
                          <Checkbox checked={selectedColumns.includes('주문코드')} onChange={(e) => handleColumnChange(e.target.checked ? [...selectedColumns, '주문코드'] : selectedColumns.filter(c => c !== '주문코드'))}>주문코드</Checkbox>
                          <Checkbox checked={selectedColumns.includes('거래코드')} onChange={(e) => handleColumnChange(e.target.checked ? [...selectedColumns, '거래코드'] : selectedColumns.filter(c => c !== '거래코드'))}>거래코드</Checkbox>
                          <Checkbox checked={selectedColumns.includes('운송코드')} onChange={(e) => handleColumnChange(e.target.checked ? [...selectedColumns, '운송코드'] : selectedColumns.filter(c => c !== '운송코드'))}>운송코드</Checkbox>
                        </Space>
                      </Collapse.Panel>
                      <Collapse.Panel header="날짜 정보" key="2">
                        <Space wrap>
                          <Checkbox checked={selectedColumns.includes('주문일')} onChange={(e) => handleColumnChange(e.target.checked ? [...selectedColumns, '주문일'] : selectedColumns.filter(c => c !== '주문일'))}>주문일</Checkbox>
                          <Checkbox checked={selectedColumns.includes('납품일')} onChange={(e) => handleColumnChange(e.target.checked ? [...selectedColumns, '납품일'] : selectedColumns.filter(c => c !== '납품일'))}>납품일</Checkbox>
                        </Space>
                      </Collapse.Panel>
                      <Collapse.Panel header="품목 정보" key="3">
                        <Space wrap>
                          <Checkbox checked={selectedColumns.includes('품목')} onChange={(e) => handleColumnChange(e.target.checked ? [...selectedColumns, '품목'] : selectedColumns.filter(c => c !== '품목'))}>품목</Checkbox>
                          <Checkbox checked={selectedColumns.includes('원산지')} onChange={(e) => handleColumnChange(e.target.checked ? [...selectedColumns, '원산지'] : selectedColumns.filter(c => c !== '원산지'))}>원산지</Checkbox>
                          <Checkbox checked={selectedColumns.includes('규격')} onChange={(e) => handleColumnChange(e.target.checked ? [...selectedColumns, '규격'] : selectedColumns.filter(c => c !== '규격'))}>규격</Checkbox>
                        </Space>
                      </Collapse.Panel>
                      <Collapse.Panel header="수량/가격 정보" key="4">
                        <Space wrap>
                          <Checkbox checked={selectedColumns.includes('주문수량')} onChange={(e) => handleColumnChange(e.target.checked ? [...selectedColumns, '주문수량'] : selectedColumns.filter(c => c !== '주문수량'))}>주문수량</Checkbox>
                          <Checkbox checked={selectedColumns.includes('주문단위')} onChange={(e) => handleColumnChange(e.target.checked ? [...selectedColumns, '주문단위'] : selectedColumns.filter(c => c !== '주문단위'))}>주문단위</Checkbox>
                          <Checkbox checked={selectedColumns.includes('주문중량')} onChange={(e) => handleColumnChange(e.target.checked ? [...selectedColumns, '주문중량'] : selectedColumns.filter(c => c !== '주문중량'))}>주문중량</Checkbox>
                          <Checkbox checked={selectedColumns.includes('상차단가')} onChange={(e) => handleColumnChange(e.target.checked ? [...selectedColumns, '상차단가'] : selectedColumns.filter(c => c !== '상차단가'))}>상차단가</Checkbox>
                          <Checkbox checked={selectedColumns.includes('상차수수료율')} onChange={(e) => handleColumnChange(e.target.checked ? [...selectedColumns, '상차수수료율'] : selectedColumns.filter(c => c !== '상차수수료율'))}>상차수수료율</Checkbox>
                          <Checkbox checked={selectedColumns.includes('통당운임단가')} onChange={(e) => handleColumnChange(e.target.checked ? [...selectedColumns, '통당운임단가'] : selectedColumns.filter(c => c !== '통당운임단가'))}>통당운임단가</Checkbox>
                          <Checkbox checked={selectedColumns.includes('운송비포함여부')} onChange={(e) => handleColumnChange(e.target.checked ? [...selectedColumns, '운송비포함여부'] : selectedColumns.filter(c => c !== '운송비포함여부'))}>운송비포함여부</Checkbox>
                          <Checkbox checked={selectedColumns.includes('도착단가')} onChange={(e) => handleColumnChange(e.target.checked ? [...selectedColumns, '도착단가'] : selectedColumns.filter(c => c !== '도착단가'))}>도착단가</Checkbox>
                          <Checkbox checked={selectedColumns.includes('알파수익단가')} onChange={(e) => handleColumnChange(e.target.checked ? [...selectedColumns, '알파수익단가'] : selectedColumns.filter(c => c !== '알파수익단가'))}>알파수익단가</Checkbox>
                        </Space>
                      </Collapse.Panel>
                      <Collapse.Panel header="파트너 정보" key="5">
                        <Space wrap>
                          <Checkbox checked={selectedColumns.includes('셀러명')} onChange={(e) => handleColumnChange(e.target.checked ? [...selectedColumns, '셀러명'] : selectedColumns.filter(c => c !== '셀러명'))}>셀러명</Checkbox>
                          <Checkbox checked={selectedColumns.includes('셀러그룹명')} onChange={(e) => handleColumnChange(e.target.checked ? [...selectedColumns, '셀러그룹명'] : selectedColumns.filter(c => c !== '셀러그룹명'))}>셀러그룹명</Checkbox>
                          <Checkbox checked={selectedColumns.includes('바이어명')} onChange={(e) => handleColumnChange(e.target.checked ? [...selectedColumns, '바이어명'] : selectedColumns.filter(c => c !== '바이어명'))}>바이어명</Checkbox>
                          <Checkbox checked={selectedColumns.includes('바이어그룹명')} onChange={(e) => handleColumnChange(e.target.checked ? [...selectedColumns, '바이어그룹명'] : selectedColumns.filter(c => c !== '바이어그룹명'))}>바이어그룹명</Checkbox>
                          <Checkbox checked={selectedColumns.includes('바이어사업권역')} onChange={(e) => handleColumnChange(e.target.checked ? [...selectedColumns, '바이어사업권역'] : selectedColumns.filter(c => c !== '바이어사업권역'))}>바이어사업권역</Checkbox>
                          <Checkbox checked={selectedColumns.includes('드라이버명')} onChange={(e) => handleColumnChange(e.target.checked ? [...selectedColumns, '드라이버명'] : selectedColumns.filter(c => c !== '드라이버명'))}>드라이버명</Checkbox>
                        </Space>
                      </Collapse.Panel>
                      <Collapse.Panel header="클레임/조정 정보" key="6">
                        <Space wrap>
                          <Checkbox checked={selectedColumns.includes('클레임/조정 유형')} onChange={(e) => handleColumnChange(e.target.checked ? [...selectedColumns, '클레임/조정 유형'] : selectedColumns.filter(c => c !== '클레임/조정 유형'))}>클레임/조정 유형</Checkbox>
                          <Checkbox checked={selectedColumns.includes('클레임/조정 내용')} onChange={(e) => handleColumnChange(e.target.checked ? [...selectedColumns, '클레임/조정 내용'] : selectedColumns.filter(c => c !== '클레임/조정 내용'))}>클레임/조정 내용</Checkbox>
                          <Checkbox checked={selectedColumns.includes('바이어정산조정금액')} onChange={(e) => handleColumnChange(e.target.checked ? [...selectedColumns, '바이어정산조정금액'] : selectedColumns.filter(c => c !== '바이어정산조정금액'))}>바이어정산조정금액</Checkbox>
                          <Checkbox checked={selectedColumns.includes('셀러정산조정물량')} onChange={(e) => handleColumnChange(e.target.checked ? [...selectedColumns, '셀러정산조정물량'] : selectedColumns.filter(c => c !== '셀러정산조정물량'))}>셀러정산조정물량</Checkbox>
                          <Checkbox checked={selectedColumns.includes('셀러정산조정금액')} onChange={(e) => handleColumnChange(e.target.checked ? [...selectedColumns, '셀러정산조정금액'] : selectedColumns.filter(c => c !== '셀러정산조정금액'))}>셀러정산조정금액</Checkbox>
                          <Checkbox checked={selectedColumns.includes('드라이버정산조정금액')} onChange={(e) => handleColumnChange(e.target.checked ? [...selectedColumns, '드라이버정산조정금액'] : selectedColumns.filter(c => c !== '드라이버정산조정금액'))}>드라이버정산조정금액</Checkbox>
                          <Checkbox checked={selectedColumns.includes('회계처리용조정금액')} onChange={(e) => handleColumnChange(e.target.checked ? [...selectedColumns, '회계처리용조정금액'] : selectedColumns.filter(c => c !== '회계처리용조정금액'))}>회계처리용조정금액</Checkbox>
                        </Space>
                      </Collapse.Panel>
                      <Collapse.Panel header="손익 정보" key="7">
                        <Space wrap>
                          <Checkbox checked={selectedColumns.includes('매출액')} onChange={(e) => handleColumnChange(e.target.checked ? [...selectedColumns, '매출액'] : selectedColumns.filter(c => c !== '매출액'))}>매출액</Checkbox>
                          <Checkbox checked={selectedColumns.includes('매입액')} onChange={(e) => handleColumnChange(e.target.checked ? [...selectedColumns, '매입액'] : selectedColumns.filter(c => c !== '매입액'))}>매입액</Checkbox>
                          <Checkbox checked={selectedColumns.includes('운송비(비용)')} onChange={(e) => handleColumnChange(e.target.checked ? [...selectedColumns, '운송비(비용)'] : selectedColumns.filter(c => c !== '운송비(비용)'))}>운송비(비용)</Checkbox>
                          <Checkbox checked={selectedColumns.includes('거래손익')} onChange={(e) => handleColumnChange(e.target.checked ? [...selectedColumns, '거래손익'] : selectedColumns.filter(c => c !== '거래손익'))}>거래손익</Checkbox>
                          <Checkbox checked={selectedColumns.includes('상차수수료수익')} onChange={(e) => handleColumnChange(e.target.checked ? [...selectedColumns, '상차수수료수익'] : selectedColumns.filter(c => c !== '상차수수료수익'))}>상차수수료수익</Checkbox>
                          <Checkbox checked={selectedColumns.includes('셀러조정손익')} onChange={(e) => handleColumnChange(e.target.checked ? [...selectedColumns, '셀러조정손익'] : selectedColumns.filter(c => c !== '셀러조정손익'))}>셀러조정손익</Checkbox>
                          <Checkbox checked={selectedColumns.includes('바이어조정손익')} onChange={(e) => handleColumnChange(e.target.checked ? [...selectedColumns, '바이어조정손익'] : selectedColumns.filter(c => c !== '바이어조정손익'))}>바이어조정손익</Checkbox>
                        </Space>
                      </Collapse.Panel>
                      <Collapse.Panel header="기타 정보" key="8">
                        <Space wrap>
                          <Checkbox checked={selectedColumns.includes('거래메모')} onChange={(e) => handleColumnChange(e.target.checked ? [...selectedColumns, '거래메모'] : selectedColumns.filter(c => c !== '거래메모'))}>거래메모</Checkbox>
                        </Space>
                      </Collapse.Panel>
                    </Collapse>
                  </Card>
                </>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}

export default TransactionLedger;
