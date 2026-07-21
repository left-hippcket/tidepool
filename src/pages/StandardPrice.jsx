import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, DatePicker, message, Popconfirm, Tabs } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import StandardPriceComparison from './StandardPriceComparison';

const { Option } = Select;

// Mock 데이터 - 상품마스터DB 참조
const mockProductCategories = [
  { id: 1, name: '누운고기' },
  { id: 2, name: '뜬고기' },
  { id: 3, name: '갑각류' },
];

const mockProducts = {
  1: [
    { id: 1, name: '광어', specs: ['1.2kg', '1.3kg', '1.4kg', '2.0kg'] },
    { id: 2, name: '강도다리', specs: ['1.0kg', '1.5kg'] },
  ],
  2: [
    { id: 3, name: '우럭', specs: ['800g', '1.0kg'] },
  ],
  3: [
    { id: 4, name: '대하', specs: ['500g', '1kg'] },
  ],
};

const mockOrigins = {
  1: ['완도', '통영', '고흥', '여수'],
  2: ['완도', '통영'],
  3: ['남해', '완도'],
  4: ['서해', '남해'],
};

function StandardPrice() {
  const [activeTab, setActiveTab] = useState('1');
  const [dataSource, setDataSource] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // 초기 데이터 로드
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = () => {
    // Mock 초기 데이터
    const initialData = [
      {
        key: '1',
        id: '1',
        applyDate: '2026-07-21',
        categoryId: 1,
        categoryName: '누운고기',
        productId: 1,
        productName: '광어',
        originId: 1,
        originName: '완도',
        spec: '1.2kg',
        price: 15000,
        source: '피시파더',
      },
      {
        key: '2',
        id: '2',
        applyDate: '2026-07-20',
        categoryId: 1,
        categoryName: '누운고기',
        productId: 1,
        productName: '광어',
        originId: 2,
        originName: '통영',
        spec: '1.2kg',
        price: 16000,
        source: '노량진시장',
      },
      {
        key: '3',
        id: '3',
        applyDate: '2026-07-21',
        categoryId: 1,
        categoryName: '누운고기',
        productId: 1,
        productName: '광어',
        originId: 1,
        originName: '완도',
        spec: '1.5kg',
        price: 18000,
        source: '피시파더',
      },
    ];
    setDataSource(initialData);
  };

  const columns = [
    {
      title: '적용일자',
      dataIndex: 'applyDate',
      key: 'applyDate',
      width: 120,
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
      width: 100,
    },
    {
      title: '표준가격',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      render: (price) => `${price.toLocaleString()}원`,
    },
    {
      title: '가격출처',
      dataIndex: 'source',
      key: 'source',
      width: 120,
    },
    {
      title: '수정',
      key: 'action',
      width: 80,
      fixed: 'right',
      render: (_, record) => (
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={() => handleEdit(record)}
        >
          수정
        </Button>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    form.setFieldsValue({
      applyDate: dayjs(),
      source: '피시파더',
    });
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setSelectedCategory(record.categoryId);
    setSelectedProduct(record.productId);
    form.setFieldsValue({
      applyDate: dayjs(record.applyDate),
      categoryId: record.categoryId,
      productId: record.productId,
      originId: record.originId,
      spec: record.spec,
      price: record.price,
      source: record.source,
    });
    setIsModalVisible(true);
  };

  const handleDelete = (record) => {
    const newData = dataSource.filter(item => item.key !== record.key);
    setDataSource(newData);
    message.success('표준가격이 삭제되었습니다.');
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      const categoryName = mockProductCategories.find(c => c.id === values.categoryId)?.name;
      const productName = mockProducts[values.categoryId]?.find(p => p.id === values.productId)?.name;
      const originName = mockOrigins[values.productId]?.[values.originId - 1];

      if (editingRecord) {
        // 수정
        const newData = dataSource.map(item => {
          if (item.key === editingRecord.key) {
            return {
              ...item,
              applyDate: values.applyDate.format('YYYY-MM-DD'),
              originId: values.originId,
              originName,
              spec: values.spec,
              price: values.price,
              source: values.source,
            };
          }
          return item;
        });
        setDataSource(newData);
        message.success('표준가격 정보가 수정되었습니다.');
      } else {
        // 등록
        const newRecord = {
          key: String(dataSource.length + 1),
          id: String(dataSource.length + 1),
          applyDate: values.applyDate.format('YYYY-MM-DD'),
          categoryId: values.categoryId,
          categoryName,
          productId: values.productId,
          productName,
          originId: values.originId,
          originName,
          spec: values.spec,
          price: values.price,
          source: values.source,
        };
        setDataSource([newRecord, ...dataSource]);
        message.success('표준가격이 등록되었습니다.');
      }

      setIsModalVisible(false);
      form.resetFields();
      setSelectedCategory(null);
      setSelectedProduct(null);
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setSelectedCategory(null);
    setSelectedProduct(null);
  };

  const onCategoryChange = (value) => {
    setSelectedCategory(value);
    setSelectedProduct(null);
    form.setFieldsValue({
      productId: undefined,
      originId: undefined,
      spec: undefined,
    });
  };

  const onProductChange = (value) => {
    setSelectedProduct(value);
    const product = mockProducts[selectedCategory]?.find(p => p.id === value);
    if (product && product.specs.length > 0) {
      form.setFieldsValue({
        spec: product.specs[0],
      });
    }
    form.setFieldsValue({
      originId: undefined,
    });
  };

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>표준가격 관리</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          표준가격 등록
        </Button>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <Tabs.TabPane tab="표준가격 관리" key="1">
          <Table
            columns={columns}
            dataSource={dataSource}
            pagination={{ pageSize: 10 }}
            scroll={{ x: 1000 }}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="원산지별 가격 비교" key="2">
          <StandardPriceComparison />
        </Tabs.TabPane>
      </Tabs>

      <Modal
        title={editingRecord ? '표준가격 수정' : '표준가격 등록'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
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
              style={editingRecord ? { backgroundColor: '#f5f5f5' } : {}}
            >
              {mockProductCategories.map(category => (
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
              style={editingRecord ? { backgroundColor: '#f5f5f5' } : {}}
            >
              {selectedCategory && mockProducts[selectedCategory]?.map(product => (
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
            <Select placeholder="원산지 선택" disabled={!selectedProduct}>
              {selectedProduct && mockOrigins[selectedProduct]?.map((origin, index) => (
                <Option key={index + 1} value={index + 1}>
                  {origin}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="spec"
            label="규격"
            rules={[
              { required: true, message: '규격을 입력해주세요' },
              { max: 20, message: '규격은 최대 20자까지 입력 가능합니다' }
            ]}
          >
            <Input placeholder="규격 입력 (예: 1.2kg)" />
          </Form.Item>

          <Form.Item
            name="price"
            label="표준가격"
            rules={[
              { required: true, message: '표준가격을 입력해주세요' },
              { type: 'number', min: 0, message: '0 이상의 숫자를 입력해주세요' }
            ]}
          >
            <Input type="number" placeholder="표준가격 입력" suffix="원" />
          </Form.Item>

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
