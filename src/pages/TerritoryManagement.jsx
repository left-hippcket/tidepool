import React, { useState } from 'react';
import { Tabs, Table, Button, Modal, Form, Input, Select, message, Tag, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { territories as initialTerritories, regions as initialRegions } from '../data/mockData';

const { TabPane } = Tabs;

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

  // 필터링된 상세지역 목록
  const filteredRegions = selectedTerritoryFilter === 'all'
    ? regions
    : regions.filter(r => r.territoryId === parseInt(selectedTerritoryFilter));

  return (
    <div>
      <h2>사업권역 관리</h2>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab={`사업권역 (${territories.length})`} key="territory">
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
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
        </TabPane>

        <TabPane tab={`상세지역 (${regions.length})`} key="region">
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
            <Space>
              <span>권역 필터:</span>
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
            pagination={{ pageSize: 10 }}
          />
        </TabPane>
      </Tabs>

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
