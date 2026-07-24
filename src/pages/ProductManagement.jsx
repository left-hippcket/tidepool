import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, message, Tag, Space } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import {
  productCategories as initialCategories,
  products as initialProducts,
  origins as initialOrigins,
  specifications as initialSpecs
} from '../data/mockData';

function ProductManagement() {
  const [categories, setCategories] = useState(initialCategories);
  const [products, setProducts] = useState(initialProducts);
  const [origins, setOrigins] = useState(initialOrigins);
  const [specs, setSpecs] = useState(initialSpecs);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(''); // 'product' | 'origin' | 'spec'
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();

  const [activeTab, setActiveTab] = useState('category');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);

  // 품목분류 인라인 편집 state
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryData, setNewCategoryData] = useState({ name: '' });
  const [editingCategoryData, setEditingCategoryData] = useState({});

  // ===== 탭 1: 품목분류 관리 =====
  const categoryColumns = [
    {
      title: '품목분류명',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text, record) => {
        if (record.id === 'new') {
          return (
            <Input
              value={newCategoryData.name}
              onChange={(e) => setNewCategoryData({ ...newCategoryData, name: e.target.value })}
              placeholder="품목분류명 입력"
              maxLength={20}
            />
          );
        }
        if (record.id === editingCategoryId) {
          return (
            <Input
              value={editingCategoryData.name}
              onChange={(e) => setEditingCategoryData({ ...editingCategoryData, name: e.target.value })}
              maxLength={20}
            />
          );
        }
        return text;
      },
    },
    {
      title: '품목수',
      dataIndex: 'itemCount',
      key: 'itemCount',
      width: 100,
      render: (count, record) => {
        if (record.id === 'new') {
          return '0개';
        }
        return `${count}개`;
      },
    },
    {
      title: '상태',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status, record) => {
        if (record.id === 'new') {
          return <Tag color="green">활성</Tag>;
        }
        if (record.id === editingCategoryId) {
          return (
            <Select
              value={editingCategoryData.status}
              onChange={(value) => setEditingCategoryData({ ...editingCategoryData, status: value })}
              style={{ width: 80 }}
            >
              <Select.Option value="active">활성</Select.Option>
              <Select.Option value="inactive">비활성</Select.Option>
            </Select>
          );
        }
        return (
          <Tag color={status === 'active' ? 'green' : 'default'}>
            {status === 'active' ? '활성' : '비활성'}
          </Tag>
        );
      },
    },
    {
      title: '액션',
      key: 'action',
      width: 150,
      render: (_, record) => {
        if (record.id === 'new' || record.id === editingCategoryId) {
          return (
            <Space>
              <Button
                type="primary"
                size="small"
                onClick={() => handleSaveCategory(record)}
              >
                저장
              </Button>
              <Button
                size="small"
                onClick={() => handleCancelCategory(record)}
              >
                취소
              </Button>
            </Space>
          );
        }
        return (
          <Button type="link" onClick={() => handleEditCategory(record)}>
            수정
          </Button>
        );
      },
    },
  ];

  const handleAddCategory = () => {
    if (isAddingCategory || editingCategoryId !== null) {
      message.warning('먼저 진행 중인 작업을 완료해주세요.');
      return;
    }
    setNewCategoryData({ name: '' });
    setIsAddingCategory(true);
  };

  const handleEditCategory = (record) => {
    if (isAddingCategory || editingCategoryId !== null) {
      message.warning('먼저 진행 중인 작업을 완료해주세요.');
      return;
    }
    setEditingCategoryId(record.id);
    setEditingCategoryData({
      name: record.name,
      status: record.status,
    });
  };

  const handleSaveCategory = (record) => {
    if (record.id === 'new') {
      if (!newCategoryData.name || newCategoryData.name.trim() === '') {
        message.error('품목분류명을 입력해주세요.');
        return;
      }
      if (newCategoryData.name.length > 20) {
        message.error('최대 20자까지 입력 가능합니다.');
        return;
      }

      const newId = Math.max(...categories.map(c => c.id)) + 1;
      setCategories([...categories, {
        id: newId,
        name: newCategoryData.name,
        itemCount: 0,
        status: 'active',
      }]);
      setIsAddingCategory(false);
      setNewCategoryData({ name: '' });
      message.success(`품목분류 '${newCategoryData.name}'이 등록되었습니다.`);
    } else {
      if (!editingCategoryData.name || editingCategoryData.name.trim() === '') {
        message.error('품목분류명을 입력해주세요.');
        return;
      }
      if (editingCategoryData.name.length > 20) {
        message.error('최대 20자까지 입력 가능합니다.');
        return;
      }

      const activeItemCount = products.filter(
        p => p.categoryId === record.id && p.status === 'active'
      ).length;

      if (editingCategoryData.status === 'inactive' && activeItemCount > 0) {
        message.error(`해당 분류에 ${activeItemCount}개의 품목이 사용중이어서 비활성화할 수 없습니다. 먼저 모든 품목을 비활성화해주세요.`);
        return;
      }

      setCategories(categories.map(c =>
        c.id === record.id ? { ...c, ...editingCategoryData } : c
      ));
      setEditingCategoryId(null);
      setEditingCategoryData({});
      message.success('품목분류 정보가 수정되었습니다.');
    }
  };

  const handleCancelCategory = (record) => {
    if (record.id === 'new') {
      setIsAddingCategory(false);
      setNewCategoryData({ name: '' });
    } else {
      setEditingCategoryId(null);
      setEditingCategoryData({});
    }
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

      if (modalType === 'product') {
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
          // 쉼표로 구분된 여러 원산지명 처리
          const originNames = values.name
            .split(',')
            .map(name => name.trim())
            .filter(name => name.length > 0);

          if (originNames.length === 0) {
            message.error('원산지명을 입력해주세요.');
            return;
          }

          let newId = Math.max(...origins.map(o => o.id)) + 1;
          const newOrigins = originNames.map(name => ({
            id: newId++,
            productId: selectedProduct.id,
            productName: selectedProduct.name,
            name: name,
            status: 'active',
            createdAt: new Date().toISOString().split('T')[0],
          }));

          setOrigins([...origins, ...newOrigins]);

          if (originNames.length === 1) {
            message.success(`원산지 '${originNames[0]}'이 등록되었습니다.`);
          } else {
            message.success(`${originNames.length}개의 원산지가 등록되었습니다.`);
          }
        }
      } else if (modalType === 'spec') {
        if (editingItem) {
          setSpecs(specs.map(s =>
            s.id === editingItem.id ? { ...s, ...values } : s
          ));
          message.success('규격 정보가 수정되었습니다.');
        } else {
          // 쉼표로 구분된 여러 규격명 처리
          const specNames = values.name
            .split(',')
            .map(name => name.trim())
            .filter(name => name.length > 0);

          if (specNames.length === 0) {
            message.error('규격명을 입력해주세요.');
            return;
          }

          let newId = Math.max(...specs.map(s => s.id)) + 1;
          const newSpecs = specNames.map(name => ({
            id: newId++,
            productId: selectedProduct.id,
            productName: selectedProduct.name,
            name: name,
            status: 'active',
            createdAt: new Date().toISOString().split('T')[0],
          }));

          setSpecs([...specs, ...newSpecs]);

          if (specNames.length === 1) {
            message.success(`규격 '${specNames[0]}'이 등록되었습니다.`);
          } else {
            message.success(`${specNames.length}개의 규격이 등록되었습니다.`);
          }
        }
      }

      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] p-4 md:p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">상품 관리</h2>

      {/* 탭 버튼 */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('category')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'category'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          품목분류 관리
        </button>
        <button
          onClick={() => setActiveTab('product')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'product'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          품목 관리
        </button>
        <button
          onClick={() => setActiveTab('origin-spec')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'origin-spec'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          원산지/규격 관리
        </button>
      </div>

      {/* 탭 1: 품목분류 관리 */}
      {activeTab === 'category' && (
        <div>
          <div className="flex justify-end mb-4">
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddCategory}>
              품목분류 등록
            </Button>
          </div>
          <Table
            columns={categoryColumns}
            dataSource={
              isAddingCategory
                ? [...categories, { id: 'new', ...newCategoryData, itemCount: 0, status: 'active' }]
                : categories
            }
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </div>
      )}

      {/* 탭 2: 품목 관리 */}
      {activeTab === 'product' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <Space>
              <span className="text-sm text-gray-700">품목분류:</span>
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
        </div>
      )}

      {/* 탭 3: 원산지/규격 관리 */}
      {activeTab === 'origin-spec' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* 왼쪽: 품목 선택 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-base font-semibold text-gray-900 mb-4">품목 선택</h3>
              <div className="mb-3">
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
              <div className="max-h-[500px] overflow-auto space-y-2">
                {filteredProducts.map(p => (
                  <div
                    key={p.id}
                    onClick={() => handleProductSelect(p)}
                    className={`p-3 cursor-pointer rounded-lg border transition-colors ${
                      selectedProduct?.id === p.id
                        ? 'bg-blue-50 border-blue-500'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-sm font-medium text-gray-900">
                      {p.categoryName} / {p.name}
                    </div>
                    {p.status === 'inactive' && (
                      <Tag size="small" className="mt-1">비활성</Tag>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 중앙: 원산지 관리 */}
          <div className="lg:col-span-1.5">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-semibold text-gray-900">
                  {selectedProduct ? `${selectedProduct.categoryName} / ${selectedProduct.name}` : '원산지 관리'}
                </h3>
                {selectedProduct && (
                  <Button
                    type="primary"
                    size="small"
                    icon={<PlusOutlined />}
                    onClick={handleAddOrigin}
                    disabled={selectedProduct?.status === 'inactive'}
                  >
                    원산지 추가
                  </Button>
                )}
              </div>
              {!selectedProduct ? (
                <div className="text-center py-10 text-gray-500">
                  왼쪽에서 품목을 선택해주세요.
                </div>
              ) : (
                <div className="max-h-[500px] overflow-auto space-y-2">
                  {selectedOrigins.length === 0 ? (
                    <div className="text-center py-6 text-gray-500">
                      등록된 원산지가 없습니다.
                    </div>
                  ) : (
                    selectedOrigins.map(origin => (
                      <div
                        key={origin.id}
                        className={`p-3 rounded-lg border ${
                          origin.status === 'active' ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium text-gray-900">{origin.name}</span>
                            <Tag
                              color={origin.status === 'active' ? 'green' : 'default'}
                              className="ml-2"
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
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 우측: 규격 관리 */}
          <div className="lg:col-span-1.5">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-semibold text-gray-900">
                  {selectedProduct ? `${selectedProduct.categoryName} / ${selectedProduct.name}` : '규격 관리'}
                </h3>
                {selectedProduct && (
                  <Button
                    type="primary"
                    size="small"
                    icon={<PlusOutlined />}
                    onClick={handleAddSpec}
                    disabled={selectedProduct?.status === 'inactive'}
                  >
                    규격 추가
                  </Button>
                )}
              </div>
              {!selectedProduct ? (
                <div className="text-center py-10 text-gray-500">
                  왼쪽에서 품목을 선택해주세요.
                </div>
              ) : (
                <div className="max-h-[500px] overflow-auto space-y-2">
                  {selectedSpecs.length === 0 ? (
                    <div className="text-center py-6 text-gray-500">
                      등록된 규격이 없습니다.
                    </div>
                  ) : (
                    selectedSpecs.map(spec => (
                      <div
                        key={spec.id}
                        className={`p-3 rounded-lg border ${
                          spec.status === 'active' ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium text-gray-900">{spec.name}</span>
                            <Tag
                              color={spec.status === 'active' ? 'green' : 'default'}
                              className="ml-2"
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
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 공통 모달 */}
      <Modal
        title={
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
              {editingItem ? (
                // 수정 모드: 단일 원산지명
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
                </>
              ) : (
                // 추가 모드: 여러 원산지명을 쉼표로 구분 입력
                <>
                  <Form.Item
                    label="원산지명 (여러 개 입력 시 쉼표로 구분)"
                    name="name"
                    rules={[
                      { required: true, message: '원산지명을 입력해주세요' },
                    ]}
                  >
                    <Input.TextArea
                      placeholder="예: 완도, 진도, 통영, 거제&#10;(쉼표로 구분하여 여러 개를 한 번에 등록할 수 있습니다)"
                      rows={4}
                    />
                  </Form.Item>
                  <div className="text-xs text-gray-500 mt-1 -mt-4 mb-4">
                    💡 팁: 쉼표(,)로 구분하여 여러 원산지를 한 번에 등록할 수 있습니다.
                  </div>
                </>
              )}
            </>
          )}

          {modalType === 'spec' && (
            <>
              {editingItem ? (
                // 수정 모드: 단일 규격명
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
                </>
              ) : (
                // 추가 모드: 여러 규격명을 쉼표로 구분 입력
                <>
                  <Form.Item
                    label="규격명 (여러 개 입력 시 쉼표로 구분)"
                    name="name"
                    rules={[
                      { required: true, message: '규격명을 입력해주세요' },
                    ]}
                  >
                    <Input.TextArea
                      placeholder="예: 500g, 700g, 1.0kg, 1.2kg&#10;(쉼표로 구분하여 여러 개를 한 번에 등록할 수 있습니다)"
                      rows={4}
                    />
                  </Form.Item>
                  <div className="text-xs text-gray-500 mt-1 -mt-4 mb-4">
                    💡 팁: 쉼표(,)로 구분하여 여러 규격을 한 번에 등록할 수 있습니다.
                  </div>
                </>
              )}
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
}

export default ProductManagement;
