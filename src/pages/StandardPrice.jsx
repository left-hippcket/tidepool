import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, DatePicker, message, Popconfirm, Tabs, Space, InputNumber, Alert, Card, Row, Col, Checkbox } from 'antd';

const { RangePicker } = DatePicker;
import { PlusOutlined, EditOutlined, MinusCircleOutlined, SaveOutlined, DownloadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import StandardPriceComparison from './StandardPriceComparison';
import { productCategories, products, origins, specifications } from '../data/mockData';

const { Option } = Select;

function StandardPrice() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('1');
  const [dataSource, setDataSource] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editingDataSource, setEditingDataSource] = useState([]);
  const [originalDataSource, setOriginalDataSource] = useState([]);

  // 필터 상태 - 디폴트 값 설정
  const [selectedCategory, setSelectedCategory] = useState('누운고기');
  const [selectedProduct, setSelectedProduct] = useState('넙치');
  const [selectedOrigin, setSelectedOrigin] = useState('완도');
  const [dateRange, setDateRange] = useState([dayjs().subtract(1, 'year'), dayjs()]);
  const [showLatestOnly, setShowLatestOnly] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [pageSize, setPageSize] = useState(50);

  // 초기 데이터 로드
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    // CSV 파일에서 변환한 실제 표준가격 데이터 로드
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
        // 누운고기 - 넙치
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
        // 누운고기 - 우럭
        {
          key: '3',
          id: '3',
          applyDate: '2026-07-21',
          categoryId: 1,
          categoryName: '누운고기',
          productId: 3,
          productName: '우럭',
          originId: 8,
          originName: '완도',
          specId: null,
          spec: '800g',
          price: 12000,
          source: '피시파더',
        },
        {
          key: '4',
          id: '4',
          applyDate: '2026-07-21',
          categoryId: 1,
          categoryName: '누운고기',
          productId: 3,
          productName: '우럭',
          originId: 8,
          originName: '통영',
          specId: null,
          spec: '800g',
          price: 12500,
          source: '피시파더',
        },
        // 갑각류 - 대하
        {
          key: '5',
          id: '5',
          applyDate: '2026-07-21',
          categoryId: 3,
          categoryName: '갑각류',
          productId: 9,
          productName: '대하',
          originId: null,
          originName: '서해',
          specId: null,
          spec: '500g',
          price: 25000,
          source: '피시파더',
        },
        {
          key: '6',
          id: '6',
          applyDate: '2026-07-21',
          categoryId: 3,
          categoryName: '갑각류',
          productId: 9,
          productName: '대하',
          originId: null,
          originName: '남해',
          specId: null,
          spec: '500g',
          price: 24000,
          source: '피시파더',
        },
        // 이전 날짜 데이터
        {
          key: '7',
          id: '7',
          applyDate: '2026-07-20',
          categoryId: 1,
          categoryName: '누운고기',
          productId: 2,
          productName: '넙치',
          originId: 7,
          originName: '통영',
          specId: 7,
          spec: '1.2kg',
          price: 16000,
          source: '노량진시장',
        },
        {
          key: '8',
          id: '8',
          applyDate: '2026-07-20',
          categoryId: 1,
          categoryName: '누운고기',
          productId: 4,
          productName: '강도다리',
          originId: null,
          originName: '완도',
          specId: null,
          spec: '1.0kg',
          price: 14000,
          source: '노량진시장',
        },
        // 다른 날짜
        {
          key: '9',
          id: '9',
          applyDate: '2026-07-19',
          categoryId: 1,
          categoryName: '누운고기',
          productId: 2,
          productName: '넙치',
          originId: 7,
          originName: '여수',
          specId: 7,
          spec: '1.2kg',
          price: 15500,
          source: '피시파더',
        },
        {
          key: '10',
          id: '10',
          applyDate: '2026-07-19',
          categoryId: 1,
          categoryName: '누운고기',
          productId: 2,
          productName: '넙치',
          originId: 7,
          originName: '고흥',
          specId: 8,
          spec: '1.5kg',
          price: 17500,
          source: '노량진시장',
        },
      ];
      setDataSource(sampleData);
    }
  };

  // 필터 옵션 계산 (useMemo로 최적화)
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
    if (!selectedCategory) return [...new Set(dataSource.map(d => d.productName))];
    return [...new Set(dataSource.filter(d => d.categoryName === selectedCategory).map(d => d.productName))];
  }, [dataSource, selectedCategory]);

  const availableOrigins = React.useMemo(() => {
    let filtered = dataSource;
    if (selectedCategory) filtered = filtered.filter(d => d.categoryName === selectedCategory);
    if (selectedProduct) filtered = filtered.filter(d => d.productName === selectedProduct);
    return [...new Set(filtered.map(d => d.originName))];
  }, [dataSource, selectedCategory, selectedProduct]);

  // 최신 가격 추출 함수 - 품목-원산지별 가장 최신 날짜의 모든 데이터
  const getLatestPrices = (data) => {
    // 1. 품목-원산지별로 가장 최신 날짜 찾기
    const latestDates = {};
    data.forEach(item => {
      const key = `${item.productName}-${item.originName}`;
      if (!latestDates[key] || new Date(item.applyDate) > new Date(latestDates[key])) {
        latestDates[key] = item.applyDate;
      }
    });

    // 2. 가장 최신 날짜의 데이터만 필터링
    return data.filter(item => {
      const key = `${item.productName}-${item.originName}`;
      return item.applyDate === latestDates[key];
    });
  };

  // 규격을 숫자로 변환하는 함수 (정렬용)
  const parseSpec = (spec) => {
    if (!spec) return 0;
    const match = spec.match(/[\d.]+/);
    if (!match) return 0;
    const value = parseFloat(match[0]);
    // kg 단위면 g로 변환
    if (spec.includes('kg')) return value * 1000;
    return value;
  };

  // 필터 적용된 데이터
  const displayData = React.useMemo(() => {
    let filtered = dataSource;
    if (selectedCategory) {
      filtered = filtered.filter(item => item.categoryName === selectedCategory);
    }
    if (selectedProduct) {
      filtered = filtered.filter(item => item.productName === selectedProduct);
    }
    if (selectedOrigin) {
      filtered = filtered.filter(item => item.originName === selectedOrigin);
    }
    if (dateRange && dateRange.length === 2) {
      const [start, end] = dateRange;
      filtered = filtered.filter(item => {
        const itemDate = dayjs(item.applyDate);
        return itemDate.isSameOrAfter(start, 'day') && itemDate.isSameOrBefore(end, 'day');
      });
    }

    const result = showLatestOnly ? getLatestPrices(filtered) : filtered;

    // 정렬: 적용일자 내림차순 → 품목분류 오름차순 → 품목 오름차순 → 원산지 오름차순 → 규격 오름차순
    return result.sort((a, b) => {
      // 1. 적용일자 내림차순
      const dateCompare = b.applyDate.localeCompare(a.applyDate);
      if (dateCompare !== 0) return dateCompare;

      // 2. 품목분류 오름차순
      const categoryCompare = (a.categoryName || '').localeCompare(b.categoryName || '');
      if (categoryCompare !== 0) return categoryCompare;

      // 3. 품목 오름차순
      const productCompare = (a.productName || '').localeCompare(b.productName || '');
      if (productCompare !== 0) return productCompare;

      // 4. 원산지 오름차순
      const originCompare = (a.originName || '').localeCompare(b.originName || '');
      if (originCompare !== 0) return originCompare;

      // 5. 규격 오름차순 (숫자 변환)
      return parseSpec(a.spec) - parseSpec(b.spec);
    });
  }, [dataSource, selectedCategory, selectedProduct, selectedOrigin, dateRange, showLatestOnly]);

  // CSV 다운로드 함수
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

      // 파일명 생성: 품목_원산지_날짜.csv
      const today = new Date().toISOString().split('T')[0];
      const productPart = selectedProduct || '전체';
      const originPart = selectedOrigin || '전체';
      link.download = `${productPart}_${originPart}_${today}.csv`;

      link.href = url;
      link.click();
      URL.revokeObjectURL(url);

      message.success(`CSV 다운로드 완료 (${displayData.length}건)`);
    } finally {
      setDownloading(false);
    }
  };

  const handleFieldChange = (index, field, value) => {
    const newData = [...editingDataSource];
    newData[index] = {
      ...newData[index],
      [field]: value
    };
    setEditingDataSource(newData);
  };

  const columns = [
    {
      title: '적용일자',
      dataIndex: 'applyDate',
      key: 'applyDate',
      width: 140,
      render: (text, record, index) => {
        if (editMode) {
          return (
            <DatePicker
              value={dayjs(text)}
              onChange={(date) => handleFieldChange(index, 'applyDate', date ? date.format('YYYY-MM-DD') : text)}
              style={{ width: '100%' }}
            />
          );
        }
        return text;
      },
    },
    {
      title: '품목분류',
      dataIndex: 'categoryName',
      key: 'categoryName',
      width: 100,
    },
    {
      title: '품목',
      dataIndex: 'productName',
      key: 'productName',
      width: 100,
    },
    {
      title: '원산지',
      dataIndex: 'originName',
      key: 'originName',
      width: 100,
    },
    {
      title: '규격',
      dataIndex: 'spec',
      key: 'spec',
      width: 140,
      render: (text, record, index) => {
        if (editMode) {
          return (
            <Select
              value={text}
              onChange={(value) => handleFieldChange(index, 'spec', value)}
              style={{ width: '100%' }}
            >
              {specifications
                .filter(s => s.productId === record.productId && s.status === 'active')
                .map(s => (
                  <Option key={s.id} value={s.name}>{s.name}</Option>
                ))
              }
            </Select>
          );
        }
        return text;
      },
    },
    {
      title: '표준가격',
      dataIndex: 'price',
      key: 'price',
      width: 160,
      render: (text, record, index) => {
        if (editMode) {
          return (
            <InputNumber
              value={text}
              onChange={(value) => handleFieldChange(index, 'price', value)}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              addonAfter="원"
              style={{ width: '100%' }}
            />
          );
        }
        return `${text.toLocaleString()}원`;
      },
    },
    {
      title: '가격출처',
      dataIndex: 'source',
      key: 'source',
      width: 140,
      render: (text, record, index) => {
        if (editMode) {
          return (
            <Input
              value={text}
              onChange={(e) => handleFieldChange(index, 'source', e.target.value)}
              style={{ width: '100%' }}
            />
          );
        }
        return text;
      },
    },
  ];

  const handleRegister = () => {
    navigate('/standard-price/register');
  };

  const handleEnterEditMode = () => {
    setOriginalDataSource([...displayData]);
    setEditingDataSource([...displayData]);
    setEditMode(true);
    message.info('수정 모드입니다. 여러 행을 수정한 후 상단의 저장 버튼을 클릭하세요.');
  };

  const handleSaveAll = () => {
    // 편집된 데이터를 원본 dataSource에 병합
    const updatedDataSource = dataSource.map(item => {
      const editedItem = editingDataSource.find(e => e.key === item.key || e.id === item.id);
      return editedItem || item;
    });

    setDataSource(updatedDataSource);
    setEditMode(false);
    setEditingDataSource([]);
    setOriginalDataSource([]);
    message.success('모든 변경사항이 저장되었습니다.');
  };

  const handleCancelEdit = () => {
    const hasChanges = JSON.stringify(editingDataSource) !== JSON.stringify(originalDataSource);
    if (hasChanges) {
      Modal.confirm({
        title: '변경사항을 취소하시겠습니까?',
        content: '저장하지 않은 변경사항은 모두 사라집니다.',
        onOk() {
          setEditMode(false);
          setEditingDataSource([]);
          setOriginalDataSource([]);
          message.info('변경사항이 취소되었습니다.');
        },
      });
    } else {
      setEditMode(false);
      setEditingDataSource([]);
      setOriginalDataSource([]);
    }
  };


  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="text-2xl font-bold text-gray-900" style={{ margin: 0 }}>표준가격 관리</h2>
        <Space>
          {editMode ? (
            <>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleSaveAll}
              >
                저장
              </Button>
              <Button
                onClick={handleCancelEdit}
              >
                취소
              </Button>
            </>
          ) : (
            <>
              <Button
                icon={<EditOutlined />}
                onClick={handleEnterEditMode}
              >
                수정 모드
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleRegister}
              >
                표준가격 등록
              </Button>
            </>
          )}
        </Space>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <Tabs.TabPane tab="표준가격 조회/등록" key="1">
          {editMode && (
            <Alert
              message="수정 모드"
              description="여러 행을 수정한 후 상단의 저장 버튼을 클릭하세요. 취소 버튼을 누르면 모든 변경사항이 취소됩니다."
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}

          {!editMode && (
            <Card title="🔍 조회 필터" style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <Select
                  value={selectedCategory}
                  onChange={(value) => {
                    setSelectedCategory(value);
                    setSelectedProduct(null);
                    setSelectedOrigin(null);
                  }}
                  placeholder="품목분류"
                  allowClear
                  style={{ flex: 1 }}
                >
                  {categoryFilters.map(c => (
                    <Option key={c.value} value={c.value}>{c.text}</Option>
                  ))}
                </Select>

                <Select
                  value={selectedProduct}
                  onChange={(value) => {
                    setSelectedProduct(value);
                    setSelectedOrigin(null);
                  }}
                  placeholder="품목"
                  allowClear
                  style={{ flex: 1 }}
                >
                  {availableProducts.map(p => (
                    <Option key={p} value={p}>{p}</Option>
                  ))}
                </Select>

                <Select
                  value={selectedOrigin}
                  onChange={setSelectedOrigin}
                  placeholder="원산지"
                  allowClear
                  style={{ flex: 1 }}
                >
                  {availableOrigins.map(o => (
                    <Option key={o} value={o}>{o}</Option>
                  ))}
                </Select>

                <RangePicker
                  value={dateRange}
                  onChange={setDateRange}
                  placeholder={['시작일', '종료일']}
                  style={{ flex: 2 }}
                />

                <Checkbox
                  checked={showLatestOnly}
                  onChange={(e) => setShowLatestOnly(e.target.checked)}
                  style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
                >
                  품목별 최신 가격만
                </Checkbox>

                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  onClick={handleCSVDownload}
                  loading={downloading}
                  style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
                >
                  CSV 다운로드 ({displayData.length}건)
                </Button>
              </div>
            </Card>
          )}

          <Table
            columns={columns}
            dataSource={editMode ? editingDataSource : displayData}
            pagination={{
              pageSize: pageSize,
              pageSizeOptions: ['10', '20', '50', '100'],
              showSizeChanger: true,
              showTotal: (total) => `총 ${total}건`,
              onShowSizeChange: (current, size) => setPageSize(size)
            }}
            scroll={{ x: 1000 }}
            style={editMode ? { backgroundColor: '#f9fafb' } : {}}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="표준가격 추세 비교" key="2">
          <StandardPriceComparison activeTab={activeTab} />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}

export default StandardPrice;
