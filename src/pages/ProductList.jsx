import React, { useState, useMemo } from 'react';
import { Select, Card, Space, Flex, Typography, Tag, Table } from 'antd';

const { Title, Text } = Typography;
import {
  products as initialProducts,
  origins as initialOrigins,
  specifications as initialSpecs,
} from '../data/mockData';

function ProductList() {
  // 필터 상태
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedProduct, setSelectedProduct] = useState('전체');
  const [selectedOrigin, setSelectedOrigin] = useState('전체');
  const [selectedStatus, setSelectedStatus] = useState('전체');

  // 데이터 조합 함수 (Cartesian Product)
  const generateProductListData = () => {
    const result = [];
    let idCounter = 1;

    initialProducts.forEach(product => {
      const productOrigins = initialOrigins.filter(o => o.productId === product.id);
      const productSpecs = initialSpecs.filter(s => s.productId === product.id);

      // Edge case: 원산지나 규격이 없는 품목 처리
      if (productOrigins.length === 0 || productSpecs.length === 0) {
        result.push({
          id: idCounter++,
          productId: product.id,
          categoryId: product.categoryId,
          categoryName: product.categoryName,
          productName: product.name,
          originId: null,
          originName: productOrigins.length === 0 ? '-' : null,
          specId: null,
          specName: productSpecs.length === 0 ? '-' : null,
          unitWeight: product.unitWeight,
          orderUnit: product.orderUnit,
          productStatus: product.status,
          originStatus: null,
          specStatus: null,
          overallStatus: product.status
        });
        return;
      }

      // Cartesian Product 생성
      productOrigins.forEach(origin => {
        productSpecs.forEach(spec => {
          // 품목, 원산지, 규격이 모두 active일 때만 active
          const overallStatus =
            product.status === 'active' &&
            origin.status === 'active' &&
            spec.status === 'active'
              ? 'active'
              : 'inactive';

          result.push({
            id: idCounter++,
            productId: product.id,
            categoryId: product.categoryId,
            categoryName: product.categoryName,
            productName: product.name,
            originId: origin.id,
            originName: origin.name,
            specId: spec.id,
            specName: spec.name,
            unitWeight: product.unitWeight,
            orderUnit: product.orderUnit,
            productStatus: product.status,
            originStatus: origin.status,
            specStatus: spec.status,
            overallStatus
          });
        });
      });
    });

    return result;
  };

  // 규격 비교 함수 (숫자 기반 정렬)
  const compareSpecifications = (specA, specB) => {
    if (!specA && !specB) return 0;
    if (!specA) return 1;
    if (!specB) return -1;

    // 숫자 추출 (예: "1.2kg" → 1.2, "4~5kg" → 4)
    const extractNumber = (spec) => {
      const match = spec.match(/[\d.]+/);
      return match ? parseFloat(match[0]) : 0;
    };

    const numA = extractNumber(specA);
    const numB = extractNumber(specB);

    return numA - numB;
  };

  // 다단계 정렬 함수
  const sortProductListData = (data) => {
    return [...data].sort((a, b) => {
      // 1. 품목분류명 가나다순
      const categoryCompare = a.categoryName.localeCompare(b.categoryName, 'ko-KR');
      if (categoryCompare !== 0) return categoryCompare;

      // 2. 품목명 가나다순
      const productCompare = a.productName.localeCompare(b.productName, 'ko-KR');
      if (productCompare !== 0) return productCompare;

      // 3. 원산지 가나다순
      const originCompare = (a.originName || '').localeCompare(b.originName || '', 'ko-KR');
      if (originCompare !== 0) return originCompare;

      // 4. 규격 숫자 오름차순
      const specCompare = compareSpecifications(a.specName, b.specName);
      if (specCompare !== 0) return specCompare;

      // 5. 활성상태 (active 우선)
      if (a.overallStatus === 'active' && b.overallStatus !== 'active') return -1;
      if (a.overallStatus !== 'active' && b.overallStatus === 'active') return 1;

      return 0;
    });
  };

  // 필터링 함수
  const getFilteredData = (data) => {
    return data.filter(item => {
      // 품목분류 필터
      const matchCategory = selectedCategory === '전체' ||
        item.categoryName === selectedCategory;

      // 품목명 필터
      const matchProduct = selectedProduct === '전체' ||
        item.productName === selectedProduct;

      // 원산지 필터
      const matchOrigin = selectedOrigin === '전체' ||
        item.originName === selectedOrigin;

      // 활성상태 필터
      const matchStatus = selectedStatus === '전체' ||
        (selectedStatus === '활성' && item.overallStatus === 'active') ||
        (selectedStatus === '비활성' && item.overallStatus === 'inactive');

      return matchCategory && matchProduct && matchOrigin && matchStatus;
    });
  };

  // 데이터 메모이제이션
  const allData = useMemo(() => generateProductListData(), []);
  const sortedData = useMemo(() => sortProductListData(allData), [allData]);
  const filteredData = useMemo(() => getFilteredData(sortedData), [
    sortedData, selectedCategory, selectedProduct, selectedOrigin, selectedStatus
  ]);

  // 필터 옵션 생성 함수들
  const getCategoryOptions = () => {
    const categories = [...new Set(allData.map(item => item.categoryName))];
    return categories.sort((a, b) => a.localeCompare(b, 'ko-KR'));
  };

  const getProductOptions = () => {
    const filtered = selectedCategory === '전체'
      ? allData
      : allData.filter(item => item.categoryName === selectedCategory);
    const products = [...new Set(filtered.map(item => item.productName))];
    return products.sort((a, b) => a.localeCompare(b, 'ko-KR'));
  };

  const getOriginOptions = () => {
    let filtered = allData;
    if (selectedCategory !== '전체') {
      filtered = filtered.filter(item => item.categoryName === selectedCategory);
    }
    if (selectedProduct !== '전체') {
      filtered = filtered.filter(item => item.productName === selectedProduct);
    }
    const origins = [...new Set(filtered.map(item => item.originName).filter(o => o && o !== '-'))];
    return origins.sort((a, b) => a.localeCompare(b, 'ko-KR'));
  };

  // 이벤트 핸들러
  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setSelectedProduct('전체');
    setSelectedOrigin('전체');
  };

  const handleProductChange = (value) => {
    setSelectedProduct(value);
    setSelectedOrigin('전체');
  };

  return (
    <div style={{ minHeight: '100vh', padding: '16px 24px', background: '#f5f5f5' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Title level={2}>상품 리스트</Title>

      {/* 필터 영역 */}
      <Card>
        <Space wrap size="middle">
          <Space size="small">
            <Text>품목분류:</Text>
            <Select
              style={{ width: 160 }}
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <Select.Option value="전체">전체</Select.Option>
              {getCategoryOptions().map(category => (
                <Select.Option key={category} value={category}>
                  {category}
                </Select.Option>
              ))}
            </Select>
          </Space>

          <Space size="small">
            <Text>품목명:</Text>
            <Select
              style={{ width: 160 }}
              value={selectedProduct}
              onChange={handleProductChange}
            >
              <Select.Option value="전체">전체</Select.Option>
              {getProductOptions().map(product => (
                <Select.Option key={product} value={product}>
                  {product}
                </Select.Option>
              ))}
            </Select>
          </Space>

          <Space size="small">
            <Text>원산지:</Text>
            <Select
              style={{ width: 160 }}
              value={selectedOrigin}
              onChange={setSelectedOrigin}
            >
              <Select.Option value="전체">전체</Select.Option>
              {getOriginOptions().map(origin => (
                <Select.Option key={origin} value={origin}>
                  {origin}
                </Select.Option>
              ))}
            </Select>
          </Space>

          <Space size="small">
            <Text>활성상태:</Text>
            <Select
              style={{ width: 128 }}
              value={selectedStatus}
              onChange={setSelectedStatus}
            >
              <Select.Option value="전체">전체</Select.Option>
              <Select.Option value="활성">활성</Select.Option>
              <Select.Option value="비활성">비활성</Select.Option>
            </Select>
          </Space>
        </Space>
      </Card>

      {/* 결과 요약 */}
      <Tag color="blue">총 {filteredData.length}개 상품</Tag>

      {/* 테이블 */}
      <Card>
        <Table
          dataSource={filteredData}
          rowKey="id"
          pagination={{ pageSize: 20 }}
          columns={[
            { title: '품목분류', dataIndex: 'categoryName', key: 'categoryName' },
            { title: '품목', dataIndex: 'productName', key: 'productName' },
            { title: '원산지', dataIndex: 'originName', key: 'originName', render: (val) => val || '-' },
            { title: '규격', dataIndex: 'specName', key: 'specName', render: (val) => val || '-' },
            { title: '주문단위당중량(kg)', dataIndex: 'unitWeight', key: 'unitWeight' },
            { title: '주문단위', dataIndex: 'orderUnit', key: 'orderUnit' },
            {
              title: '품목상태',
              dataIndex: 'overallStatus',
              key: 'overallStatus',
              render: (status) => (
                <Tag color={status === 'active' ? 'success' : 'default'}>
                  {status === 'active' ? '활성' : '비활성'}
                </Tag>
              )
            }
          ]}
        />
      </Card>
      </Space>
    </div>
  );
}

export default ProductList;
