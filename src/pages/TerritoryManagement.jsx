import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Tag, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { territories as initialTerritories, regions as initialRegions } from '../data/mockData';

function TerritoryManagement() {
  const [territories, setTerritories] = useState(initialTerritories);
  const [regions, setRegions] = useState(initialRegions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(''); // 'territory' | 'region'
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('territory');
  const [selectedTerritoryFilter, setSelectedTerritoryFilter] = useState('all');

  // 사업권역 컬럼 정의
  const territoryColumns = [
    {
      title: '권역명',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '표시순서',
      dataIndex: 'displayOrder',
      key: 'displayOrder',
      width: 120,
    },
    {
      title: '소속 지역 수',
      dataIndex: 'regionCount',
      key: 'regionCount',
      width: 120,
      render: (count) => <span>{count}개</span>,
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
      width: 100,
      render: (_, record) => (
        <Button type="link" onClick={() => handleEditTerritory(record)}>
          수정
        </Button>
      ),
    },
  ];

  // 상세지역 컬럼 정의
  const regionColumns = [
    {
      title: '사업권역',
      dataIndex: 'territoryName',
      key: 'territoryName',
      width: 150,
    },
    {
      title: '상세지역',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '표시순서',
      dataIndex: 'displayOrder',
      key: 'displayOrder',
      width: 120,
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
      width: 100,
      render: (_, record) => (
        <Button type="link" onClick={() => handleEditRegion(record)}>
          수정
        </Button>
      ),
    },
  ];

  // 사업권역 추가 핸들러
  const handleAddTerritory = () => {
    setModalType('territory');
    setEditingItem(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  // 사업권역 수정 핸들러
  const handleEditTerritory = (record) => {
    setModalType('territory');
    setEditingItem(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  // 상세지역 추가 핸들러
  const handleAddRegion = () => {
    setModalType('region');
    setEditingItem(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  // 상세지역 수정 핸들러
  const handleEditRegion = (record) => {
    setModalType('region');
    setEditingItem(record);
    form.setFieldsValue({
      territoryId: record.territoryId,
      name: record.name,
      displayOrder: record.displayOrder,
      status: record.status,
    });
    setIsModalOpen(true);
  };

  // 폼 제출 핸들러
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (modalType === 'territory') {
        if (editingItem) {
          // 수정
          const activeRegionCount = regions.filter(
            r => r.territoryId === editingItem.id && r.status === 'active'
          ).length;

          if (values.status === 'inactive' && activeRegionCount > 0) {
            message.error(`이 권역에 속한 지역이 ${activeRegionCount}개 있어 비활성화할 수 없습니다. 먼저 지역을 비활성화하거나 다른 권역으로 이동해주세요.`);
            return;
          }

          setTerritories(territories.map(t =>
            t.id === editingItem.id ? { ...t, ...values } : t
          ));
          message.success('사업권역 정보가 수정되었습니다.');
        } else {
          // 추가
          const newId = Math.max(...territories.map(t => t.id)) + 1;
          const newDisplayOrder = Math.max(...territories.map(t => t.displayOrder)) + 1;
          setTerritories([...territories, {
            id: newId,
            ...values,
            displayOrder: newDisplayOrder,
            regionCount: 0,
            status: 'active',
          }]);
          message.success(`사업권역 '${values.name}'이 등록되었습니다.`);
        }
      } else {
        // 상세지역
        if (editingItem) {
          // 수정
          setRegions(regions.map(r =>
            r.id === editingItem.id ? {
              ...r,
              ...values,
              territoryName: territories.find(t => t.id === values.territoryId)?.name || r.territoryName
            } : r
          ));
          message.success('상세지역 정보가 수정되었습니다.');
        } else {
          // 추가
          const newId = Math.max(...regions.map(r => r.id)) + 1;
          const territory = territories.find(t => t.id === values.territoryId);
          const maxOrder = Math.max(
            0,
            ...regions.filter(r => r.territoryId === values.territoryId).map(r => r.displayOrder)
          );

          setRegions([...regions, {
            id: newId,
            territoryId: values.territoryId,
            territoryName: territory.name,
            name: values.name,
            displayOrder: maxOrder + 1,
            status: 'active',
          }]);

          // 권역의 지역 수 업데이트
          setTerritories(territories.map(t =>
            t.id === values.territoryId ? { ...t, regionCount: t.regionCount + 1 } : t
          ));

          message.success(`상세지역 '${values.name}'이 등록되었습니다.`);
        }
      }

      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  // 필터링 및 정렬된 상세지역 목록
  const filteredRegions = (selectedTerritoryFilter === 'all'
    ? regions
    : regions.filter(r => r.territoryId === parseInt(selectedTerritoryFilter))
  ).sort((a, b) => {
    // 1차: 사업권역 ID로 정렬
    if (a.territoryId !== b.territoryId) {
      return a.territoryId - b.territoryId;
    }
    // 2차: 표시순서로 정렬
    return a.displayOrder - b.displayOrder;
  });

  // 사업권역별 색상 맵 생성
  const getTerritoryColor = (territoryId) => {
    const colors = ['#ffffff', '#f5f5f5']; // 흰색과 회색 번갈아가며
    const uniqueTerritoryIds = [...new Set(filteredRegions.map(r => r.territoryId))].sort();
    const index = uniqueTerritoryIds.indexOf(territoryId);
    return colors[index % 2];
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] p-4 md:p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">사업권역 관리</h2>

      {/* 탭 버튼 */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('territory')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'territory'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          사업권역 ({territories.length})
        </button>
        <button
          onClick={() => setActiveTab('region')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'region'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          상세지역 ({regions.length})
        </button>
      </div>

      {/* 탭 1: 사업권역 */}
      {activeTab === 'territory' && (
        <div>
          <div className="flex justify-end mb-4">
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddTerritory}>
              권역 추가
            </Button>
          </div>
          <Table
            columns={territoryColumns}
            dataSource={territories}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </div>
      )}

      {/* 탭 2: 상세지역 */}
      {activeTab === 'region' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <Space>
              <span className="text-sm text-gray-700">권역 필터:</span>
              <Select
                style={{ width: 150 }}
                value={selectedTerritoryFilter}
                onChange={setSelectedTerritoryFilter}
              >
                <Select.Option value="all">전체</Select.Option>
                {territories.map(t => (
                  <Select.Option key={t.id} value={t.id}>
                    {t.name}
                  </Select.Option>
                ))}
              </Select>
            </Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddRegion}>
              지역 추가
            </Button>
          </div>
          <Table
            columns={regionColumns}
            dataSource={filteredRegions}
            rowKey="id"
            pagination={{
              defaultPageSize: 10,
              pageSizeOptions: ['10', '20', '50', '100'],
              showSizeChanger: true,
              showTotal: (total) => `전체 ${total}건`,
            }}
            rowClassName={(record) => {
              const backgroundColor = getTerritoryColor(record.territoryId);
              return backgroundColor === '#f5f5f5' ? 'bg-gray-50' : '';
            }}
          />
        </div>
      )}

      <Modal
        title={
          modalType === 'territory'
            ? (editingItem ? '사업권역 수정' : '새 사업권역 추가')
            : (editingItem ? '상세지역 수정' : '새 지역 추가')
        }
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        okText={editingItem ? '저장' : '추가'}
        cancelText="취소"
        width={500}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 20 }}>
          {modalType === 'territory' ? (
            <>
              <Form.Item
                label="권역명"
                name="name"
                rules={[
                  { required: true, message: '권역명을 입력해주세요' },
                  { max: 20, message: '최대 20자까지 입력 가능합니다' },
                  { pattern: /^[가-힣()\/\s]+$/, message: '한글, (), / 만 입력할 수 있습니다' }
                ]}
              >
                <Input placeholder="예: 수도권" />
              </Form.Item>

              {editingItem && (
                <>
                  <Form.Item
                    label="표시순서"
                    name="displayOrder"
                    rules={[{ required: true, message: '표시순서를 입력해주세요' }]}
                  >
                    <Input type="number" min={0} />
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
              )}
            </>
          ) : (
            <>
              <Form.Item
                label="사업권역"
                name="territoryId"
                rules={[{ required: true, message: '사업권역을 선택해주세요' }]}
              >
                <Select placeholder="권역 선택">
                  {territories.filter(t => t.status === 'active').map(t => (
                    <Select.Option key={t.id} value={t.id}>
                      {t.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="상세지역명"
                name="name"
                rules={[
                  { required: true, message: '상세지역명을 입력해주세요' },
                  { max: 20, message: '최대 20자까지 입력 가능합니다' },
                  { pattern: /^[가-힣()\/\s]+$/, message: '한글, (), / 만 입력할 수 있습니다' }
                ]}
              >
                <Input placeholder="예: 인천" />
              </Form.Item>

              {editingItem && (
                <>
                  <Form.Item
                    label="표시순서"
                    name="displayOrder"
                    rules={[{ required: true, message: '표시순서를 입력해주세요' }]}
                  >
                    <Input type="number" min={0} />
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
              )}
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
}

export default TerritoryManagement;
