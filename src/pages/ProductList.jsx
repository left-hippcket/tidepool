import React, { useState, useMemo } from 'react';
import { Table, Select, Space, Tag } from 'antd';
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

  // 테이블 컬럼 정의
  const columns = [
    {
      title: '품목분류',
      dataIndex: 'categoryName',
      key: 'categoryName',
      width: 150,
    },
    {
      title: '품목',
      dataIndex: 'productName',
      key: 'productName',
      width: 150,
    },
    {
      title: '원산지',
      dataIndex: 'originName',
      key: 'originName',
      width: 120,
      render: (text) => text || '-',
    },
    {
      title: '규격',
      dataIndex: 'specName',
      key: 'specName',
      width: 120,
      render: (text) => text || '-',
    },
    {
      title: '주문단위당중량(kg)',
      dataIndex: 'unitWeight',
      key: 'unitWeight',
      width: 150,
    },
    {
      title: '주문단위',
      dataIndex: 'orderUnit',
      key: 'orderUnit',
      width: 100,
    },
    {
      title: '품목상태',
      dataIndex: 'overallStatus',
      key: 'overallStatus',
      width: 100,
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'default'}>
          {status === 'active' ? '활성' : '비활성'}
        </Tag>
      ),
    },
  ];

  return (
    <div>
      <h2>상품 리스트</h2>

      {/* 필터 영역 */}
      <div style={{
        background: '#fafafa',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16
      }}>
        <Space wrap>
          <span>품목분류:</span>
          <Select
            style={{ width: 150 }}
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

          <span style={{ marginLeft: 16 }}>품목명:</span>
          <Select
            style={{ width: 150 }}
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

          <span style={{ marginLeft: 16 }}>원산지:</span>
          <Select
            style={{ width: 150 }}
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

          <span style={{ marginLeft: 16 }}>활성상태:</span>
          <Select
            style={{ width: 120 }}
            value={selectedStatus}
            onChange={setSelectedStatus}
          >
            <Select.Option value="전체">전체</Select.Option>
            <Select.Option value="활성">활성</Select.Option>
            <Select.Option value="비활성">비활성</Select.Option>
          </Select>
        </Space>
      </div>

      {/* 결과 요약 */}
      <div style={{ marginBottom: 16 }}>
        <Tag color="blue">총 {filteredData.length}개 상품</Tag>
      </div>

      {/* 테이블 */}
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        pagination={{
          pageSize: 20,
          showSizeChanger: true,
          showTotal: (total) => `총 ${total}개`,
        }}
        scroll={{ x: 1000 }}
      />
    </div>
  );
}

export default ProductList;
