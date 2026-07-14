import React, { useState } from 'react';
import { Tabs, Table, Button, Modal, Form, Input, InputNumber, Select, message, Tag, Space, Card, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import {
  productCategories as initialCategories,
  products as initialProducts,
  origins as initialOrigins,
  specifications as initialSpecs
} from '../data/mockData';

const { TabPane } = Tabs;

function ProductManagement() {
  const [categories, setCategories] = useState(initialCategories);
  const [products, setProducts] = useState(initialProducts);
  const [origins, setOrigins] = useState(initialOrigins);
  const [specs, setSpecs] = useState(initialSpecs);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(''); // 'category' | 'product' | 'origin' | 'spec'
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();

  const [activeTab, setActiveTab] = useState('category');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);

  // ===== 탭 1: 품목분류 관리 =====
  const categoryColumns = [
    {
      title: '품목분류명',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '품목수',
      dataIndex: 'itemCount',
      key: 'itemCount',
      width: 100,
      render: (count) => `${count}개`,
    },
    {
      title: '상태',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'default'}>
          {status === 'active' ? '활성' : '비활성'}
        </Tag>
      ),
    },
    {
      title: '수정',
      key: 'action',
      width: 80,
      render: (_, record) => (
        <Button type="link" onClick={() => handleEditCategory(record)}>
          수정
        </Button>
      ),
    },
  ];

  const handleAddCategory = () => {
    setModalType('category');
    setEditingItem(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEditCategory = (record) => {
    setModalType('category');
    setEditingItem(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  // ===== 탭 2: 품목 관리 =====
  const productColumns = [
    {
      title: '품목분류',
      dataIndex: 'categoryName',
      key: 'categoryName',
      width: 150,
    },
    {
      title: '품목명',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '주문단위',
      dataIndex: 'orderUnit',
      key: 'orderUnit',
      width: 100,
    },
    {
      title: '주문단위당중량(kg)',
      dataIndex: 'unitWeight',
      key: 'unitWeight',
      width: 150,
    },
    {
      title: '원산지 개수',
      dataIndex: 'originCount',
      key: 'originCount',
      width: 110,
      render: (count) => `${count}개`,
    },
    {
      title: '규격 개수',
      dataIndex: 'specCount',
      key: 'specCount',
      width: 100,
      render: (count) => `${count}개`,
    },
    {
      title: '상태',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'default'}>
          {status === 'active' ? '활성' : '비활성'}
        </Tag>
      ),
    },
    {
      title: '수정',
      key: 'action',
      width: 80,
      render: (_, record) => (
        <Button type="link" onClick={() => handleEditProduct(record)}>
          수정
        </Button>
      ),
    },
  ];

  const handleAddProduct = () => {
    setModalType('product');
    setEditingItem(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEditProduct = (record) => {
    setModalType('product');
    setEditingItem(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const filteredProducts = selectedCategoryFilter === 'all'
    ? products
    : products.filter(p => p.categoryId === parseInt(selectedCategoryFilter));

  // ===== 탭 3: 원산지/규격 관리 =====
  const handleProductSelect = (product) => {
    setSelectedProduct(product);
  };

  const handleAddOrigin = () => {
    if (!selectedProduct) {
      message.warning('왼쪽에서 품목을 선택해주세요.');
      return;
    }
    setModalType('origin');
    setEditingItem(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEditOrigin = (record) => {
    setModalType('origin');
    setEditingItem(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleAddSpec = () => {
    if (!selectedProduct) {
      message.warning('왼쪽에서 품목을 선택해주세요.');
      return;
    }
    setModalType('spec');
    setEditingItem(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEditSpec = (record) => {
    setModalType('spec');
    setEditingItem(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const selectedOrigins = selectedProduct
    ? origins.filter(o => o.productId === selectedProduct.id)
    : [];

  const selectedSpecs = selectedProduct
    ? specs.filter(s => s.productId === selectedProduct.id)
    : [];

  // ===== 공통 제출 핸들러 =====
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (modalType === 'category') {
        if (editingItem) {
          const activeItemCount = products.filter(
            p => p.categoryId === editingItem.id && p.status === 'active'
          ).length;

          if (values.status === 'inactive' && activeItemCount > 0) {
            message.error(`해당 분류에 ${activeItemCount}개의 품목이 사용중이어서 비활성화할 수 없습니다. 먼저 모든 품목을 비활성화해주세요.`);
            return;
          }

          setCategories(categories.map(c =>
            c.id === editingItem.id ? { ...c, ...values } : c
          ));
          message.success('품목분류 정보가 수정되었습니다.');
        } else {
          const newId = Math.max(...categories.map(c => c.id)) + 1;
          setCategories([...categories, {
            id: newId,
            ...values,
            itemCount: 0,
            status: 'active',
          }]);
          message.success(`품목분류 '${values.name}'이 등록되었습니다.`);
        }
      } else if (modalType === 'product') {
        if (editingItem) {
          const activeOriginCount = origins.filter(
            o => o.productId === editingItem.id && o.status === 'active'
          ).length;
          const activeSpecCount = specs.filter(
            s => s.productId === editingItem.id && s.status === 'active'
          ).length;

          if (values.status === 'inactive' && (activeOriginCount > 0 || activeSpecCount > 0)) {
            message.error(`소속된 활성 원산지/규격이 ${activeOriginCount + activeSpecCount}개 남아있어 비활성화할 수 없습니다. 먼저 '원산지/규격 관리' 탭에서 모든 원산지와 규격을 비활성화해주세요.`);
            return;
          }

          setProducts(products.map(p =>
            p.id === editingItem.id ? { ...p, ...values } : p
          ));
          message.success('품목 정보가 수정되었습니다.');
        } else {
          const newId = Math.max(...products.map(p => p.id)) + 1;
          const category = categories.find(c => c.id === values.categoryId);
          setProducts([...products, {
            id: newId,
            categoryId: values.categoryId,
            categoryName: category.name,
            name: values.name,
            orderUnit: values.orderUnit,
            unitWeight: values.unitWeight,
            originCount: 0,
            specCount: 0,
            status: 'active',
          }]);
          message.success(`품목 '${category.name} / ${values.name}'이 등록되었습니다. 원산지와 규격은 '원산지/규격 관리' 탭에서 추가하실 수 있습니다.`);
        }
      } else if (modalType === 'origin') {
        if (editingItem) {
          setOrigins(origins.map(o =>
            o.id === editingItem.id ? { ...o, ...values } : o
          ));
          message.success('원산지 정보가 수정되었습니다.');
        } else {
          const newId = Math.max(...origins.map(o => o.id)) + 1;
          setOrigins([...origins, {
            id: newId,
            productId: selectedProduct.id,
            productName: selectedProduct.name,
            name: values.name,
            status: 'active',
            createdAt: new Date().toISOString().split('T')[0],
          }]);
          message.success(`원산지 '${values.name}'이 등록되었습니다.`);
        }
      } else if (modalType === 'spec') {
        if (editingItem) {
          setSpecs(specs.map(s =>
            s.id === editingItem.id ? { ...s, ...values } : s
          ));
          message.success('규격 정보가 수정되었습니다.');
        } else {
          const newId = Math.max(...specs.map(s => s.id)) + 1;
          setSpecs([...specs, {
            id: newId,
            productId: selectedProduct.id,
            productName: selectedProduct.name,
            name: values.name,
            status: 'active',
            createdAt: new Date().toISOString().split('T')[0],
          }]);
          message.success(`규격 '${values.name}'이 등록되었습니다.`);
        }
      }

      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <div>
      <h2>상품 관리</h2>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        {/* 탭 1: 품목분류 관리 */}
        <TabPane tab="품목분류 관리" key="category">
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddCategory}>
              품목분류 등록
            </Button>
          </div>
          <Table
            columns={categoryColumns}
            dataSource={categories}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </TabPane>

        {/* 탭 2: 품목 관리 */}
        <TabPane tab="품목 관리" key="product">
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
            <Space>
              <span>품목분류:</span>
              <Select
                style={{ width: 150 }}
                value={selectedCategoryFilter}
                onChange={setSelectedCategoryFilter}
              >
                <Select.Option value="all">전체</Select.Option>
                {categories.filter(c => c.status === 'active').map(c => (
                  <Select.Option key={c.id} value={c.id}>
                    {c.name}
                  </Select.Option>
                ))}
              </Select>
            </Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddProduct}>
              품목 등록
            </Button>
          </div>
          <Table
            columns={productColumns}
            dataSource={filteredProducts}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </TabPane>

        {/* 탭 3: 원산지/규격 관리 */}
        <TabPane tab="원산지/규격 관리" key="origin-spec">
          <Row gutter={16}>
            {/* 왼쪽: 품목 선택 */}
            <Col span={6}>
              <Card title="품목 선택" size="small">
                <div style={{ marginBottom: 8 }}>
                  <Select
                    style={{ width: '100%' }}
                    placeholder="품목분류 필터"
                    allowClear
                    onChange={(value) => {
                      setSelectedCategoryFilter(value || 'all');
                      setSelectedProduct(null);
                    }}
                  >
                    {categories.map(c => (
                      <Select.Option key={c.id} value={c.id}>
                        {c.name}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
                <div style={{ maxHeight: 500, overflow: 'auto' }}>
                  {filteredProducts.map(p => (
                    <div
                      key={p.id}
                      onClick={() => handleProductSelect(p)}
                      style={{
                        padding: '8px 12px',
                        cursor: 'pointer',
                        background: selectedProduct?.id === p.id ? '#e6f7ff' : '#fff',
                        borderRadius: 4,
                        marginBottom: 4,
                        border: selectedProduct?.id === p.id ? '1px solid #1890ff' : '1px solid #f0f0f0',
                      }}
                    >
                      <div>{p.categoryName} / {p.name}</div>
                      {p.status === 'inactive' && (
                        <Tag size="small" style={{ marginTop: 4 }}>비활성</Tag>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </Col>

            {/* 중앙: 원산지 관리 */}
            <Col span={9}>
              <Card
                title={selectedProduct ? `선택 품목: ${selectedProduct.categoryName} / ${selectedProduct.name}` : '원산지 관리'}
                size="small"
                extra={
                  selectedProduct && (
                    <Button
                      type="primary"
                      size="small"
                      icon={<PlusOutlined />}
                      onClick={handleAddOrigin}
                      disabled={selectedProduct?.status === 'inactive'}
                    >
                      원산지 추가
                    </Button>
                  )
                }
              >
                {!selectedProduct ? (
                  <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
                    왼쪽에서 품목을 선택해주세요.
                  </div>
                ) : (
                  <div style={{ maxHeight: 500, overflow: 'auto' }}>
                    {selectedOrigins.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: 20, color: '#999' }}>
                        등록된 원산지가 없습니다.
                      </div>
                    ) : (
                      selectedOrigins.map(origin => (
                        <Card
                          key={origin.id}
                          size="small"
                          style={{
                            marginBottom: 8,
                            background: origin.status === 'active' ? '#fff' : '#f5f5f5'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <strong>{origin.name}</strong>
                              <Tag
                                color={origin.status === 'active' ? 'green' : 'default'}
                                style={{ marginLeft: 8 }}
                              >
                                {origin.status === 'active' ? '활성' : '비활성'}
                              </Tag>
                            </div>
                            <Button
                              type="link"
                              size="small"
                              icon={<EditOutlined />}
                              onClick={() => handleEditOrigin(origin)}
                            >
                              수정
                            </Button>
                          </div>
                        </Card>
                      ))
                    )}
                  </div>
                )}
              </Card>
            </Col>

            {/* 우측: 규격 관리 */}
            <Col span={9}>
              <Card
                title={selectedProduct ? `선택 품목: ${selectedProduct.categoryName} / ${selectedProduct.name}` : '규격 관리'}
                size="small"
                extra={
                  selectedProduct && (
                    <Button
                      type="primary"
                      size="small"
                      icon={<PlusOutlined />}
                      onClick={handleAddSpec}
                      disabled={selectedProduct?.status === 'inactive'}
                    >
                      규격 추가
                    </Button>
                  )
                }
              >
                {!selectedProduct ? (
                  <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
                    왼쪽에서 품목을 선택해주세요.
                  </div>
                ) : (
                  <div style={{ maxHeight: 500, overflow: 'auto' }}>
                    {selectedSpecs.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: 20, color: '#999' }}>
                        등록된 규격이 없습니다.
                      </div>
                    ) : (
                      selectedSpecs.map(spec => (
                        <Card
                          key={spec.id}
                          size="small"
                          style={{
                            marginBottom: 8,
                            background: spec.status === 'active' ? '#fff' : '#f5f5f5'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <strong>{spec.name}</strong>
                              <Tag
                                color={spec.status === 'active' ? 'green' : 'default'}
                                style={{ marginLeft: 8 }}
                              >
                                {spec.status === 'active' ? '활성' : '비활성'}
                              </Tag>
                            </div>
                            <Button
                              type="link"
                              size="small"
                              icon={<EditOutlined />}
                              onClick={() => handleEditSpec(spec)}
                            >
                              수정
                            </Button>
                          </div>
                        </Card>
                      ))
                    )}
                  </div>
                )}
              </Card>
            </Col>
          </Row>
        </TabPane>
      </Tabs>

      {/* 공통 모달 */}
      <Modal
        title={
          modalType === 'category' ? (editingItem ? '품목분류 수정' : '품목분류 등록') :
          modalType === 'product' ? (editingItem ? '품목 수정' : '품목 등록') :
          modalType === 'origin' ? (editingItem ? '원산지 수정' : `원산지 등록 - ${selectedProduct?.categoryName} / ${selectedProduct?.name}`) :
          modalType === 'spec' ? (editingItem ? '규격 수정' : `규격 등록 - ${selectedProduct?.categoryName} / ${selectedProduct?.name}`) :
          ''
        }
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        okText={editingItem ? '저장' : '등록'}
        cancelText="취소"
        width={500}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 20 }}>
          {modalType === 'category' && (
            <>
              <Form.Item
                label="품목분류명"
                name="name"
                rules={[
                  { required: true, message: '품목분류명을 입력해주세요' },
                  { max: 20, message: '최대 20자까지 입력 가능합니다' },
                ]}
              >
                <Input placeholder="예: 누운고기" />
              </Form.Item>
              {editingItem && (
                <Form.Item
                  label="상태"
                  name="status"
                  rules={[{ required: true }]}
                >
                  <Select>
                    <Select.Option value="active">활성</Select.Option>
                    <Select.Option value="inactive">비활성</Select.Option>
                  </Select>
                </Form.Item>
              )}
            </>
          )}

          {modalType === 'product' && (
            <>
              {!editingItem && (
                <Form.Item
                  label="품목분류"
                  name="categoryId"
                  rules={[{ required: true, message: '품목분류를 선택해주세요' }]}
                >
                  <Select placeholder="품목분류 선택">
                    {categories.filter(c => c.status === 'active').map(c => (
                      <Select.Option key={c.id} value={c.id}>
                        {c.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              )}
              <Form.Item
                label="품목명"
                name="name"
                rules={[
                  { required: true, message: '품목명을 입력해주세요' },
                  { max: 20, message: '최대 20자까지 입력 가능합니다' },
                ]}
              >
                <Input placeholder="예: 광어" />
              </Form.Item>
              <Form.Item
                label="주문단위"
                name="orderUnit"
                rules={[{ required: true, message: '주문단위를 선택해주세요' }]}
              >
                <Select placeholder="주문단위 선택">
                  <Select.Option value="통">통</Select.Option>
                  <Select.Option value="박스">박스</Select.Option>
                  <Select.Option value="kg">kg</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="주문단위당중량(kg)"
                name="unitWeight"
                rules={[
                  { required: true, message: '주문단위당중량을 입력해주세요' },
                  { type: 'number', min: 0.1, message: '0보다 큰 값을 입력해주세요' }
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0.1}
                  step={0.1}
                  placeholder="예: 1.2"
                />
              </Form.Item>
              {editingItem && (
                <Form.Item
                  label="상태"
                  name="status"
                  rules={[{ required: true }]}
                >
                  <Select>
                    <Select.Option value="active">활성</Select.Option>
                    <Select.Option value="inactive">비활성</Select.Option>
                  </Select>
                </Form.Item>
              )}
            </>
          )}

          {modalType === 'origin' && (
            <>
              <Form.Item
                label="원산지명"
                name="name"
                rules={[
                  { required: true, message: '원산지명을 입력해주세요' },
                  { max: 20, message: '최대 20자까지 입력 가능합니다' },
                ]}
              >
                <Input placeholder="예: 완도" />
              </Form.Item>
              {editingItem && (
                <Form.Item
                  label="상태"
                  name="status"
                  rules={[{ required: true }]}
                >
                  <Select>
                    <Select.Option value="active">활성</Select.Option>
                    <Select.Option value="inactive">비활성</Select.Option>
                  </Select>
                </Form.Item>
              )}
            </>
          )}

          {modalType === 'spec' && (
            <>
              <Form.Item
                label="규격명"
                name="name"
                rules={[
                  { required: true, message: '규격명을 입력해주세요' },
                  { max: 20, message: '최대 20자까지 입력 가능합니다' },
                ]}
              >
                <Input placeholder="예: 1.2kg, 4~5kg" />
              </Form.Item>
              {editingItem && (
                <Form.Item
                  label="상태"
                  name="status"
                  rules={[{ required: true }]}
                >
                  <Select>
                    <Select.Option value="active">활성</Select.Option>
                    <Select.Option value="inactive">비활성</Select.Option>
                  </Select>
                </Form.Item>
              )}
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
}

export default ProductManagement;
