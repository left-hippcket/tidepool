import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, DatePicker, message, Popconfirm, Tabs, Space, InputNumber, Alert } from 'antd';
import { PlusOutlined, EditOutlined, MinusCircleOutlined, SaveOutlined } from '@ant-design/icons';
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
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.applyDate.localeCompare(b.applyDate),
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
      filters: categoryFilters,
      onFilter: (value, record) => record.categoryName === value,
    },
    {
      title: '품목',
      dataIndex: 'productName',
      key: 'productName',
      width: 100,
      filters: productFilters,
      onFilter: (value, record) => record.productName === value,
    },
    {
      title: '원산지',
      dataIndex: 'originName',
      key: 'originName',
      width: 100,
      filters: originFilters,
      onFilter: (value, record) => record.originName === value,
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
    setOriginalDataSource([...dataSource]);
    setEditingDataSource([...dataSource]);
    setEditMode(true);
    message.info('수정 모드입니다. 여러 행을 수정한 후 상단의 저장 버튼을 클릭하세요.');
  };

  const handleSaveAll = () => {
    setDataSource(editingDataSource);
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
        <Tabs.TabPane tab="표준가격 관리" key="1">
          {editMode && (
            <Alert
              message="수정 모드"
              description="여러 행을 수정한 후 상단의 저장 버튼을 클릭하세요. 취소 버튼을 누르면 모든 변경사항이 취소됩니다."
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}
          <Table
            columns={columns}
            dataSource={editMode ? editingDataSource : dataSource}
            pagination={{ pageSize: 20 }}
            scroll={{ x: 1000 }}
            style={editMode ? { backgroundColor: '#f9fafb' } : {}}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="원산지별 가격 비교" key="2">
          <StandardPriceComparison />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}

export default StandardPrice;
        width={600}
        footer={
          editingRecord ? [
            <Popconfirm
              key="delete"
              title="표준가격을 삭제하시겠습니까? 삭제된 데이터는 복구할 수 없습니다."
              onConfirm={() => {
                handleDelete(editingRecord);
                setIsModalVisible(false);
              }}
              okText="확인"
              cancelText="취소"
            >
              <Button danger style={{ float: 'left' }}>
                삭제
              </Button>
            </Popconfirm>,
            <Button key="cancel" onClick={handleCancel}>
              취소
            </Button>,
            <Button key="submit" type="primary" onClick={handleOk}>
              저장
            </Button>,
          ] : [
            <Button key="cancel" onClick={handleCancel}>
              취소
            </Button>,
            <Button key="submit" type="primary" onClick={handleOk}>
              등록
            </Button>,
          ]
        }
      >
        <Form form={form} layout="vertical">
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
            <Select
              placeholder="품목분류 선택"
              onChange={onCategoryChange}
              disabled={editingRecord !== null}
            >
              {productCategories.map(category => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
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
              disabled={!selectedCategory || editingRecord !== null}
            >
              {selectedCategory && products
                .filter(p => p.categoryId === selectedCategory)
                .map(product => (
                  <Option key={product.id} value={product.id}>
                    {product.name}
                  </Option>
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
              onChange={editingRecord ? undefined : onOriginChange}
              disabled={!selectedProduct}
            >
              {selectedProduct && origins
                .filter(o => o.productId === selectedProduct && o.status === 'active')
                .map(origin => (
                  <Option key={origin.id} value={origin.id}>
                    {origin.name}
                  </Option>
                ))}
            </Select>
          </Form.Item>

          {editingRecord ? (
            // 수정 모드: 단일 규격
            <>
              <Form.Item
                name="specId"
                label="규격"
                rules={[{ required: true, message: '규격을 선택해주세요' }]}
              >
                <Select
                  placeholder="규격 선택"
                  disabled={!selectedProduct}
                >
                  {selectedProduct && specifications
                    .filter(s => s.productId === selectedProduct && s.status === 'active')
                    .map(spec => (
                      <Option key={spec.id} value={spec.id}>
                        {spec.name}
                      </Option>
                    ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="price"
                label="표준가격"
                rules={[
                  { required: true, message: '표준가격을 입력해주세요' },
                  { type: 'number', min: 0, message: '0 이상의 숫자를 입력해주세요' }
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="표준가격 입력"
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/,/g, '')}
                  addonAfter="원"
                />
              </Form.Item>
            </>
          ) : (
            // 등록 모드: 여러 규격 동시 입력
            selectedOrigin && (
              <Form.Item label="규격별 가격">
                <div style={{ marginBottom: 8, color: '#666', fontSize: 12 }}>
                  선택한 품목-원산지의 최근 가격이 자동으로 입력됩니다. 가격을 수정하거나, 규격을 추가/삭제할 수 있습니다.
                </div>
              <Form.List name="priceItems">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                        <Form.Item
                          {...restField}
                          name={[name, 'specName']}
                          rules={[{ required: true, message: '규격 입력' }]}
                          style={{ marginBottom: 0, width: 120 }}
                        >
                          <Input placeholder="예: 1.2kg" />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, 'price']}
                          style={{ marginBottom: 0, width: 180 }}
                        >
                          <InputNumber
                            style={{ width: '100%' }}
                            placeholder="가격 입력 (선택)"
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/,/g, '')}
                            addonAfter="원"
                          />
                        </Form.Item>
                        <MinusCircleOutlined onClick={() => remove(name)} style={{ color: '#ff4d4f' }} />
                      </Space>
                    ))}
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      규격 추가
                    </Button>
                  </>
                )}
              </Form.List>
              </Form.Item>
            )
          )}

          <Form.Item
            name="source"
            label="가격출처"
            rules={[
              { required: true, message: '가격출처를 입력해주세요' },
              { max: 30, message: '가격출처는 최대 30자까지 입력 가능합니다' }
            ]}
          >
            <Input placeholder="가격출처 입력" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default StandardPrice;
