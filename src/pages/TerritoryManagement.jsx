import React, { useState } from 'react';
import { Table, Button, Input, InputNumber, Select, message, Tag, Space, Card, Flex, Typography, Tabs } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
import { territories as initialTerritories, regions as initialRegions } from '../data/mockData';

function TerritoryManagement() {
  const [territories, setTerritories] = useState(initialTerritories);
  const [regions, setRegions] = useState(initialRegions);
  const [activeTab, setActiveTab] = useState('territory');
  const [selectedTerritoryFilter, setSelectedTerritoryFilter] = useState('all');

  // 사업권역 인라인 편집 state
  const [editingTerritoryId, setEditingTerritoryId] = useState(null);
  const [isAddingTerritory, setIsAddingTerritory] = useState(false);
  const [newTerritoryData, setNewTerritoryData] = useState({ name: '', displayOrder: '', status: 'active' });
  const [editingTerritoryData, setEditingTerritoryData] = useState({});

  // 상세지역 인라인 편집 state
  const [editingRegionId, setEditingRegionId] = useState(null);
  const [isAddingRegion, setIsAddingRegion] = useState(false);
  const [newRegionData, setNewRegionData] = useState({ territoryId: '', name: '', displayOrder: '', status: 'active' });
  const [editingRegionData, setEditingRegionData] = useState({});

  // 표시순서 재정렬 함수 (사업권역)
  const reorderTerritories = (updatedList, targetId, newOrder) => {
    const oldOrder = updatedList.find(t => t.id === targetId)?.displayOrder;

    if (oldOrder === newOrder) return updatedList;

    let reordered = [...updatedList];

    if (newOrder < oldOrder) {
      reordered = reordered.map(t => {
        if (t.id === targetId) {
          return { ...t, displayOrder: newOrder };
        }
        if (t.displayOrder >= newOrder && t.displayOrder < oldOrder) {
          return { ...t, displayOrder: t.displayOrder + 1 };
        }
        return t;
      });
    } else {
      reordered = reordered.map(t => {
        if (t.id === targetId) {
          return { ...t, displayOrder: newOrder };
        }
        if (t.displayOrder > oldOrder && t.displayOrder <= newOrder) {
          return { ...t, displayOrder: t.displayOrder - 1 };
        }
        return t;
      });
    }

    return reordered;
  };

  // 표시순서 재정렬 함수 (상세지역)
  const reorderRegions = (updatedList, targetId, newOrder, territoryId) => {
    const sameTerritoryRegions = updatedList.filter(r => r.territoryId === territoryId);
    const oldOrder = sameTerritoryRegions.find(r => r.id === targetId)?.displayOrder;

    if (oldOrder === newOrder) return updatedList;

    let reordered = [...updatedList];

    if (newOrder < oldOrder) {
      reordered = reordered.map(r => {
        if (r.territoryId !== territoryId) return r;
        if (r.id === targetId) {
          return { ...r, displayOrder: newOrder };
        }
        if (r.displayOrder >= newOrder && r.displayOrder < oldOrder) {
          return { ...r, displayOrder: r.displayOrder + 1 };
        }
        return r;
      });
    } else {
      reordered = reordered.map(r => {
        if (r.territoryId !== territoryId) return r;
        if (r.id === targetId) {
          return { ...r, displayOrder: newOrder };
        }
        if (r.displayOrder > oldOrder && r.displayOrder <= newOrder) {
          return { ...r, displayOrder: r.displayOrder - 1 };
        }
        return r;
      });
    }

    return reordered;
  };

  // 사업권역 추가 핸들러
  const handleAddTerritory = () => {
    if (isAddingTerritory || editingTerritoryId !== null) {
      message.warning('먼저 진행 중인 작업을 완료해주세요.');
      return;
    }
    setNewTerritoryData({ name: '', displayOrder: '', status: 'active' });
    setIsAddingTerritory(true);
  };

  // 사업권역 수정 핸들러
  const handleEditTerritory = (record) => {
    if (isAddingTerritory || editingTerritoryId !== null) {
      message.warning('먼저 진행 중인 작업을 완료해주세요.');
      return;
    }
    setEditingTerritoryId(record.id);
    setEditingTerritoryData({
      name: record.name,
      displayOrder: record.displayOrder,
      status: record.status,
    });
  };

  // 사업권역 저장 핸들러
  const handleSaveTerritory = (record) => {
    if (!record || record.id === editingTerritoryId) {
      // 기존 항목 수정
      if (!editingTerritoryData.name) {
        message.error('권역명을 입력해주세요.');
        return;
      }
      if (!/^[가-힣()\/\s]+$/.test(editingTerritoryData.name)) {
        message.error('한글, 괄호, 슬래시만 입력 가능합니다.');
        return;
      }

      const activeRegionCount = regions.filter(
        r => r.territoryId === record.id && r.status === 'active'
      ).length;

      if (editingTerritoryData.status === 'inactive' && activeRegionCount > 0) {
        message.error(`이 권역에 속한 지역이 ${activeRegionCount}개 있어 비활성화할 수 없습니다. 먼저 지역을 비활성화하거나 다른 권역으로 이동해주세요.`);
        return;
      }

      let updatedTerritories = territories.map(t =>
        t.id === record.id ? { ...t, ...editingTerritoryData } : t
      );

      if (editingTerritoryData.displayOrder !== record.displayOrder) {
        updatedTerritories = reorderTerritories(updatedTerritories, record.id, parseInt(editingTerritoryData.displayOrder));
      }

      setTerritories(updatedTerritories);
      setEditingTerritoryId(null);
      setEditingTerritoryData({});
      message.success('사업권역 정보가 수정되었습니다.');
    } else {
      // 신규 추가 (고정 폼에서)
      if (!newTerritoryData.name) {
        message.error('권역명을 입력해주세요.');
        return;
      }
      if (!newTerritoryData.displayOrder) {
        message.error('표시순서를 입력해주세요.');
        return;
      }
      if (!/^[가-힣()\/\s]+$/.test(newTerritoryData.name)) {
        message.error('한글, 괄호, 슬래시만 입력 가능합니다.');
        return;
      }

      const newId = Math.max(...territories.map(t => t.id)) + 1;

      let updatedTerritories = [...territories, {
        id: newId,
        name: newTerritoryData.name,
        displayOrder: parseInt(newTerritoryData.displayOrder),
        regionCount: 0,
        status: newTerritoryData.status,
      }];

      updatedTerritories = reorderTerritories(updatedTerritories, newId, parseInt(newTerritoryData.displayOrder));

      setTerritories(updatedTerritories);
      setIsAddingTerritory(false);
      setNewTerritoryData({ name: '', displayOrder: '', status: 'active' });
      message.success(`사업권역 '${newTerritoryData.name}'이 등록되었습니다.`);
    }
  };

  // 사업권역 취소 핸들러
  const handleCancelTerritory = (record) => {
    if (record && record.id === editingTerritoryId) {
      setEditingTerritoryId(null);
      setEditingTerritoryData({});
    } else {
      setIsAddingTerritory(false);
      setNewTerritoryData({ name: '', displayOrder: '', status: 'active' });
    }
  };

  // 상세지역 추가 핸들러
  const handleAddRegion = () => {
    if (isAddingRegion || editingRegionId !== null) {
      message.warning('먼저 진행 중인 작업을 완료해주세요.');
      return;
    }
    setNewRegionData({ territoryId: '', name: '', displayOrder: '', status: 'active' });
    setIsAddingRegion(true);
  };

  // 상세지역 수정 핸들러
  const handleEditRegion = (record) => {
    if (isAddingRegion || editingRegionId !== null) {
      message.warning('먼저 진행 중인 작업을 완료해주세요.');
      return;
    }
    setEditingRegionId(record.id);
    setEditingRegionData({
      territoryId: record.territoryId,
      name: record.name,
      displayOrder: record.displayOrder,
      status: record.status,
    });
  };

  // 상세지역 저장 핸들러
  const handleSaveRegion = (record) => {
    if (!record || record.id === editingRegionId) {
      // 기존 항목 수정
      if (!editingRegionData.name) {
        message.error('상세지역명을 입력해주세요.');
        return;
      }
      if (!/^[가-힣()\/\s]+$/.test(editingRegionData.name)) {
        message.error('한글, 괄호, 슬래시만 입력 가능합니다.');
        return;
      }

      let updatedRegions = regions.map(r =>
        r.id === record.id ? {
          ...r,
          ...editingRegionData,
          territoryName: territories.find(t => t.id === editingRegionData.territoryId)?.name || r.territoryName
        } : r
      );

      if (editingRegionData.displayOrder !== record.displayOrder) {
        updatedRegions = reorderRegions(updatedRegions, record.id, parseInt(editingRegionData.displayOrder), editingRegionData.territoryId);
      }

      setRegions(updatedRegions);
      setEditingRegionId(null);
      setEditingRegionData({});
      message.success('상세지역 정보가 수정되었습니다.');
    } else {
      // 신규 추가 (고정 폼에서)
      if (!newRegionData.territoryId) {
        message.error('사업권역을 선택해주세요.');
        return;
      }
      if (!newRegionData.name) {
        message.error('상세지역명을 입력해주세요.');
        return;
      }
      if (!newRegionData.displayOrder) {
        message.error('표시순서를 입력해주세요.');
        return;
      }
      if (!/^[가-힣()\/\s]+$/.test(newRegionData.name)) {
        message.error('한글, 괄호, 슬래시만 입력 가능합니다.');
        return;
      }

      const newId = Math.max(...regions.map(r => r.id)) + 1;
      const territory = territories.find(t => t.id === newRegionData.territoryId);

      let updatedRegions = [...regions, {
        id: newId,
        territoryId: newRegionData.territoryId,
        territoryName: territory.name,
        name: newRegionData.name,
        displayOrder: parseInt(newRegionData.displayOrder),
        status: 'active',
      }];

      updatedRegions = reorderRegions(updatedRegions, newId, parseInt(newRegionData.displayOrder), newRegionData.territoryId);

      setRegions(updatedRegions);

      setTerritories(territories.map(t =>
        t.id === newRegionData.territoryId ? { ...t, regionCount: t.regionCount + 1 } : t
      ));

      setIsAddingRegion(false);
      setNewRegionData({ territoryId: '', name: '', displayOrder: '', status: 'active' });
      message.success(`상세지역 '${newRegionData.name}'이 등록되었습니다.`);
    }
  };

  // 상세지역 취소 핸들러
  const handleCancelRegion = (record) => {
    if (record && record.id === editingRegionId) {
      setEditingRegionId(null);
      setEditingRegionData({});
    } else {
      setIsAddingRegion(false);
      setNewRegionData({ territoryId: '', name: '', displayOrder: '', status: 'active' });
    }
  };

  // 사업권역 컬럼 정의 (인라인 편집 지원)
  const territoryColumns = [
    {
      title: '권역명',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text, record) => {
        if (record.id === editingTerritoryId) {
          return (
            <Input
              value={editingTerritoryData.name}
              onChange={(e) => setEditingTerritoryData({ ...editingTerritoryData, name: e.target.value })}
              maxLength={20}
            />
          );
        }
        return text;
      },
    },
    {
      title: '표시순서',
      dataIndex: 'displayOrder',
      key: 'displayOrder',
      width: 120,
      render: (text, record) => {
        if (record.id === editingTerritoryId) {
          return (
            <Input
              type="number"
              value={editingTerritoryData.displayOrder}
              onChange={(e) => setEditingTerritoryData({ ...editingTerritoryData, displayOrder: parseInt(e.target.value) || 0 })}
              min={1}
              style={{ width: 80 }}
            />
          );
        }
        return text;
      },
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
      render: (status, record) => {
        if (record.id === editingTerritoryId) {
          return (
            <Select
              value={editingTerritoryData.status}
              onChange={(value) => setEditingTerritoryData({ ...editingTerritoryData, status: value })}
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
        if (record.id === editingTerritoryId) {
          return (
            <Space>
              <Button
                type="primary"
                size="small"
                onClick={() => handleSaveTerritory(record)}
              >
                저장
              </Button>
              <Button
                size="small"
                onClick={() => handleCancelTerritory(record)}
              >
                취소
              </Button>
            </Space>
          );
        }
        return (
          <Button
            type="link"
            onClick={() => handleEditTerritory(record)}
          >
            수정
          </Button>
        );
      },
    },
  ];

  // 상세지역 컬럼 정의 (인라인 편집 지원)
  const regionColumns = [
    {
      title: '사업권역',
      dataIndex: 'territoryName',
      key: 'territoryName',
      width: 150,
      render: (text, record) => {
        if (record.id === editingRegionId) {
          return (
            <Select
              value={editingRegionData.territoryId}
              onChange={(value) => setEditingRegionData({ ...editingRegionData, territoryId: value })}
              style={{ width: '100%' }}
            >
              {territories.filter(t => t.status === 'active').map(t => (
                <Select.Option key={t.id} value={t.id}>
                  {t.name}
                </Select.Option>
              ))}
            </Select>
          );
        }
        return text;
      },
    },
    {
      title: '상세지역',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text, record) => {
        if (record.id === editingRegionId) {
          return (
            <Input
              value={editingRegionData.name}
              onChange={(e) => setEditingRegionData({ ...editingRegionData, name: e.target.value })}
              maxLength={20}
            />
          );
        }
        return text;
      },
    },
    {
      title: '표시순서',
      dataIndex: 'displayOrder',
      key: 'displayOrder',
      width: 120,
      render: (text, record) => {
        if (record.id === editingRegionId) {
          return (
            <Input
              type="number"
              value={editingRegionData.displayOrder}
              onChange={(e) => setEditingRegionData({ ...editingRegionData, displayOrder: parseInt(e.target.value) || 0 })}
              min={1}
              style={{ width: 80 }}
            />
          );
        }
        return text;
      },
    },
    {
      title: '상태',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status, record) => {
        if (record.id === editingRegionId) {
          return (
            <Select
              value={editingRegionData.status}
              onChange={(value) => setEditingRegionData({ ...editingRegionData, status: value })}
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
        if (record.id === editingRegionId) {
          return (
            <Space>
              <Button
                type="primary"
                size="small"
                onClick={() => handleSaveRegion(record)}
              >
                저장
              </Button>
              <Button
                size="small"
                onClick={() => handleCancelRegion(record)}
              >
                취소
              </Button>
            </Space>
          );
        }
        return (
          <Button
            type="link"
            onClick={() => handleEditRegion(record)}
          >
            수정
          </Button>
        );
      },
    },
  ];

  // 필터링 및 정렬된 상세지역 목록
  const filteredRegions = (selectedTerritoryFilter === 'all'
    ? regions
    : regions.filter(r => r.territoryId === parseInt(selectedTerritoryFilter))
  ).sort((a, b) => {
    if (a.territoryId !== b.territoryId) {
      return a.territoryId - b.territoryId;
    }
    return a.displayOrder - b.displayOrder;
  });

  // 사업권역별 색상 맵 생성
  const getTerritoryColor = (territoryId) => {
    const colors = ['#ffffff', '#f5f5f5'];
    const uniqueTerritoryIds = [...new Set(filteredRegions.map(r => r.territoryId))].sort();
    const index = uniqueTerritoryIds.indexOf(territoryId);
    return colors[index % 2];
  };

  // 사업권역별 색상 맵 생성 (상세지역용)

  return (
    <div style={{ minHeight: '100vh', padding: '16px 24px', background: '#f5f5f5' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Title level={2}>사업권역 관리</Title>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          { key: 'territory', label: `사업권역 (${territories.length})` },
          { key: 'region', label: `상세지역 (${regions.length})` }
        ]}
      />

      {/* 탭 1: 사업권역 */}
      {activeTab === 'territory' && (
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          {!isAddingTerritory && (
            <Flex justify="flex-end">
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddTerritory}>
                권역 추가
              </Button>
            </Flex>
          )}

          {isAddingTerritory && (
            <Card>
              <Title level={5} style={{ marginBottom: 16 }}>사업권역 등록</Title>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Flex gap="middle" wrap="wrap">
                <div>
                  <label>
                    권역명 <span>*</span>
                  </label>
                  <Input
                    value={newTerritoryData.name}
                    onChange={(e) => setNewTerritoryData({ ...newTerritoryData, name: e.target.value })}
                    placeholder="권역명 입력"
                    maxLength={20}
                  />
                </div>
                <div>
                  <label>
                    표시순서 <span>*</span>
                  </label>
                  <InputNumber
                    value={newTerritoryData.displayOrder}
                    onChange={(value) => setNewTerritoryData({ ...newTerritoryData, displayOrder: value })}
                    placeholder="표시순서"
                    style={{ width: '100%' }}
                    min={1}
                  />
                </div>
                <div>
                  <label>
                    상태
                  </label>
                  <Select
                    value={newTerritoryData.status}
                    onChange={(value) => setNewTerritoryData({ ...newTerritoryData, status: value })}
                    style={{ width: '100%' }}
                  >
                    <Select.Option value="active">활성</Select.Option>
                    <Select.Option value="inactive">비활성</Select.Option>
                  </Select>
                </div>
                </Flex>
                <Flex justify="flex-end" gap="small">
                  <Button onClick={handleCancelTerritory}>취소</Button>
                  <Button type="primary" onClick={handleSaveTerritory}>저장</Button>
                </Flex>
              </Space>
            </Card>
          )}

          <Card>
            <Table
              columns={territoryColumns}
              dataSource={territories}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </Space>
      )}

      {/* 탭 2: 상세지역 */}
      {activeTab === 'region' && (
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Flex justify="space-between" align="center">
            <Space>
              <Text>권역 필터:</Text>
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
            {!isAddingRegion && (
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddRegion}>
                지역 추가
              </Button>
            )}
          </Flex>

          {isAddingRegion && (
            <Card>
              <Title level={5} style={{ marginBottom: 16 }}>상세지역 등록</Title>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Flex gap="middle" wrap="wrap">
                <div>
                  <label>
                    사업권역 <span>*</span>
                  </label>
                  <Select
                    value={newRegionData.territoryId}
                    onChange={(value) => {
                      const territory = territories.find(t => t.id === value);
                      setNewRegionData({
                        ...newRegionData,
                        territoryId: value,
                        territoryName: territory?.name || ''
                      });
                    }}
                    placeholder="사업권역 선택"
                    style={{ width: '100%' }}
                  >
                    {territories.filter(t => t.status === 'active').map(t => (
                      <Select.Option key={t.id} value={t.id}>{t.name}</Select.Option>
                    ))}
                  </Select>
                </div>
                <div>
                  <label>
                    지역명 <span>*</span>
                  </label>
                  <Input
                    value={newRegionData.name}
                    onChange={(e) => setNewRegionData({ ...newRegionData, name: e.target.value })}
                    placeholder="지역명 입력"
                    maxLength={20}
                  />
                </div>
                <div>
                  <label>
                    표시순서 <span>*</span>
                  </label>
                  <InputNumber
                    value={newRegionData.displayOrder}
                    onChange={(value) => setNewRegionData({ ...newRegionData, displayOrder: value })}
                    placeholder="표시순서"
                    style={{ width: '100%' }}
                    min={1}
                  />
                </div>
                </Flex>
                <Flex justify="flex-end" gap="small">
                  <Button onClick={handleCancelRegion}>취소</Button>
                  <Button type="primary" onClick={handleSaveRegion}>저장</Button>
                </Flex>
              </Space>
            </Card>
          )}

          <Card>
            <Table
            columns={regionColumns}
            dataSource={filteredRegions}
            rowKey="id"
            pagination={false}
            rowClassName={(record) => {
              const backgroundColor = getTerritoryColor(record.territoryId);
              return backgroundColor === '#f5f5f5' ? 'bg-gray-50' : '';
            }}
            />
          </Card>
        </Space>
      )}
      </Space>
    </div>
  );
}

export default TerritoryManagement;
