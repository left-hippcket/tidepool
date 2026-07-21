import React, { useState, useEffect } from 'react';
import { Form, Input, Button, DatePicker, Select, InputNumber, Space, Card, message } from 'antd';
import { PlusOutlined, MinusCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { productCategories, products, origins, specifications } from '../data/mockData';

const { Option } = Select;

function StandardPriceRegister() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [allPriceData, setAllPriceData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOrigin, setSelectedOrigin] = useState(null);

  // 기존 가격 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/data/standard-price-data.json');
        if (!response.ok) {
          throw new Error('데이터 로드 실패');
        }
        const data = await response.json();
        setAllPriceData(data);
      } catch (error) {
        console.error('가격 데이터 로드 실패:', error);
        setAllPriceData([]);
      }
    };
    loadData();
  }, []);

  const onCategoryChange = (value) => {
    setSelectedCategory(value);
    setSelectedProduct(null);
    setSelectedOrigin(null);
    form.setFieldsValue({
      productId: undefined,
      originId: undefined,
      priceItems: [],
    });
  };

  const onProductChange = (value) => {
    setSelectedProduct(value);
    setSelectedOrigin(null);
    form.setFieldsValue({
      originId: undefined,
      priceItems: [],
    });
  };

  const onOriginChange = (originId) => {
    setSelectedOrigin(originId);
    const origin = origins.find(o => o.id === originId);

    // 해당 품목의 기존 규격 자동 로드
    const productSpecs = specifications.filter(s => s.productId === selectedProduct && s.status === 'active');

    // 최근 가격 가져오기 (같은 품목 + 원산지 조합)
    const getRecentPrice = (specName) => {
      const recentRecord = allPriceData
        .filter(item =>
          item.productId === selectedProduct &&
          item.originName === origin?.name &&
          item.spec === specName
        )
        .sort((a, b) => b.applyDate.localeCompare(a.applyDate))[0];

      return recentRecord?.price;
    };

    const priceItems = productSpecs.map(spec => ({
      specId: spec.id,
      specName: spec.name,
      price: getRecentPrice(spec.name),
    }));

    form.setFieldsValue({
      priceItems: priceItems,
    });
  };

  const handleSubmit = (values) => {
    const priceItems = values.priceItems || [];
    const validItems = priceItems.filter(item => item.price !== undefined && item.price !== null);

    if (validItems.length === 0) {
      message.warning('최소 1개 이상의 규격에 가격을 입력해주세요.');
      return;
    }

    // 실제로는 여기서 서버에 데이터를 저장해야 합니다
    // 현재는 localStorage에 저장하거나 메시지만 표시
    message.success(`${validItems.length}개의 표준가격이 등록되었습니다.`);

    // 목록 페이지로 이동
    navigate('/standard-price');
  };

  return (
    <div>
      {/* 상단 헤더 */}
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/standard-price')}>
          목록으로
        </Button>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>표준가격 등록</h2>
      </div>

      {/* 등록 폼 */}
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ applyDate: dayjs(), source: '피시파더' }}
        >
          {/* 기본 정보 섹션 */}
          <div style={{ marginBottom: 32 }}>
            <h3 style={{ marginBottom: 16, fontSize: 16, fontWeight: 600, color: '#333' }}>기본 정보</h3>

            <Form.Item
              name="applyDate"
              label="적용일자"
              rules={[{ required: true, message: '적용일자를 선택해주세요' }]}
            >
              <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
            </Form.Item>

            <Form.Item
              name="categoryId"
              label="품목분류"
              rules={[{ required: true, message: '품목분류를 선택해주세요' }]}
            >
              <Select placeholder="품목분류 선택" onChange={onCategoryChange}>
                {productCategories.map(cat => (
                  <Option key={cat.id} value={cat.id}>{cat.name}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="productId"
              label="품목"
              rules={[{ required: true, message: '품목을 선택해주세요' }]}
            >
              <Select
                placeholder="품목 선택"
                onChange={onProductChange}
                disabled={!selectedCategory}
              >
                {selectedCategory && products
                  .filter(p => p.categoryId === selectedCategory)
                  .map(p => (
                    <Option key={p.id} value={p.id}>{p.name}</Option>
                  ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="originId"
              label="원산지"
              rules={[{ required: true, message: '원산지를 선택해주세요' }]}
            >
              <Select
                placeholder="원산지 선택"
                onChange={onOriginChange}
                disabled={!selectedProduct}
              >
                {selectedProduct && origins
                  .filter(o => o.productId === selectedProduct && o.status === 'active')
                  .map(o => (
                    <Option key={o.id} value={o.id}>{o.name}</Option>
                  ))}
              </Select>
            </Form.Item>
          </div>

          {/* 규격별 가격 섹션 */}
          {selectedOrigin && (
            <div style={{ marginBottom: 32 }}>
              <h3 style={{ marginBottom: 16, fontSize: 16, fontWeight: 600, color: '#333' }}>규격별 가격</h3>
              <div style={{ marginBottom: 12, color: '#666', fontSize: 13 }}>
                최근 가격이 자동 입력됩니다. 수정 가능하며, 빈 칸은 업데이트되지 않습니다.
              </div>

              <Form.List name="priceItems">
                {(fields) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                        <Form.Item
                          {...restField}
                          name={[name, 'specName']}
                          style={{ marginBottom: 0, width: 150 }}
                        >
                          <Input disabled style={{ backgroundColor: '#f5f5f5' }} />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, 'price']}
                          style={{ marginBottom: 0, width: 200 }}
                        >
                          <InputNumber
                            style={{ width: '100%' }}
                            placeholder="가격 입력 (선택)"
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/,/g, '')}
                            addonAfter="원"
                          />
                        </Form.Item>
                      </Space>
                    ))}
                  </>
                )}
              </Form.List>
            </div>
          )}

          {/* 가격출처 섹션 */}
          <Form.Item
            name="source"
            label="가격출처"
            rules={[{ required: true, message: '가격출처를 입력해주세요' }]}
          >
            <Input placeholder="예: 피시파더" />
          </Form.Item>

          {/* 하단 버튼 */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 32, paddingTop: 24, borderTop: '1px solid #f0f0f0' }}>
            <Button onClick={() => navigate('/standard-price')}>
              취소
            </Button>
            <Button type="primary" htmlType="submit">
              등록
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}

export default StandardPriceRegister;
