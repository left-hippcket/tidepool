import React, { useState } from 'react';
import { Button, Input, Select, message, Tag, Space, Card, Flex, Typography, Row, Col, Alert } from 'antd';
import { PlusOutlined, EditOutlined, HolderOutlined, SaveOutlined } from '@ant-design/icons';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const { Text } = Typography;
import { territories as initialTerritories, regions as initialRegions } from '../data/mockData';

// Sortable Item Component
function SortableItem({ id, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children(attributes, listeners)}
    </div>
  );
}

function TerritoryManagement() {
  const [territories, setTerritories] = useState(initialTerritories);
  const [regions, setRegions] = useState(initialRegions);
  const [selectedTerritory, setSelectedTerritory] = useState(null);

  // 수정 모드 state
  const [editMode, setEditMode] = useState(false);
  const [editingTerritories, setEditingTerritories] = useState([]);
  const [editingRegions, setEditingRegions] = useState([]);
  const [originalTerritories, setOriginalTerritories] = useState([]);
  const [originalRegions, setOriginalRegions] = useState([]);

  // 추가 폼 state
  const [isAddingTerritory, setIsAddingTerritory] = useState(false);
  const [newTerritoryData, setNewTerritoryData] = useState({ name: '', status: 'active' });
  const [isAddingRegion, setIsAddingRegion] = useState(false);
  const [newRegionData, setNewRegionData] = useState({ territoryId: '', name: '', status: 'active' });

  // Drag and Drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 수정 모드 진입
  const handleEnterEditMode = () => {
    setOriginalTerritories([...territories]);
    setOriginalRegions([...regions]);
    setEditingTerritories([...territories]);
    setEditingRegions([...regions]);
    setEditMode(true);
    message.info('수정 모드입니다. 여러 항목을 수정한 후 상단의 저장 버튼을 클릭하세요.');
  };

  // 수정 모드 취소
  const handleCancelEdit = () => {
    const hasChanges = JSON.stringify(editingTerritories) !== JSON.stringify(originalTerritories) ||
                       JSON.stringify(editingRegions) !== JSON.stringify(originalRegions);

    if (hasChanges) {
      if (window.confirm('변경사항이 있습니다. 취소하시겠습니까?')) {
        setTerritories(originalTerritories);
        setRegions(originalRegions);
        setEditMode(false);
        setEditingTerritories([]);
        setEditingRegions([]);
        setOriginalTerritories([]);
        setOriginalRegions([]);
        message.info('변경사항이 취소되었습니다.');
      }
    } else {
      setEditMode(false);
      setEditingTerritories([]);
      setEditingRegions([]);
      setOriginalTerritories([]);
      setOriginalRegions([]);
    }
  };

  // 전체 저장
  const handleSaveAll = () => {
    setTerritories(editingTerritories);
    setRegions(editingRegions);
    setEditMode(false);
    setEditingTerritories([]);
    setEditingRegions([]);
    setOriginalTerritories([]);
    setOriginalRegions([]);
    message.success('모든 변경사항이 저장되었습니다.');
  };

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
    if (isAddingTerritory) {
      message.warning('먼저 진행 중인 작업을 완료해주세요.');
      return;
    }
    setNewTerritoryData({ name: '', status: 'active' });
    setIsAddingTerritory(true);
  };

  // 사업권역 필드 변경 핸들러 (수정 모드)
  const handleTerritoryFieldChange = (id, field, value) => {
    setEditingTerritories(editingTerritories.map(t =>
      t.id === id ? { ...t, [field]: value } : t
    ));
  };

  // 사업권역 저장 핸들러 (추가)
  const handleSaveTerritory = () => {
    if (!newTerritoryData.name) {
      message.error('권역명을 입력해주세요.');
      return;
    }
    if (!/^[가-힣()\/\s]+$/.test(newTerritoryData.name)) {
      message.error('한글, 괄호, 슬래시만 입력 가능합니다.');
      return;
    }

    const newId = Math.max(...territories.map(t => t.id)) + 1;
    const maxDisplayOrder = Math.max(...territories.map(t => t.displayOrder), 0);

    const newTerritory = {
      id: newId,
      name: newTerritoryData.name,
      displayOrder: maxDisplayOrder + 1,
      regionCount: 0,
      status: newTerritoryData.status,
    };

    setTerritories([...territories, newTerritory]);
    setIsAddingTerritory(false);
    setNewTerritoryData({ name: '', status: 'active' });
    message.success(`사업권역 '${newTerritoryData.name}'이 등록되었습니다.`);
  };

  // 사업권역 추가 취소 핸들러
  const handleCancelTerritory = () => {
    setIsAddingTerritory(false);
    setNewTerritoryData({ name: '', status: 'active' });
  };

  // 상세지역 추가 핸들러
  const handleAddRegion = () => {
    if (isAddingRegion) {
      message.warning('먼저 진행 중인 작업을 완료해주세요.');
      return;
    }
    setNewRegionData({
      territoryId: selectedTerritory.id,
      name: '',
      status: 'active'
    });
    setIsAddingRegion(true);
  };

  // 상세지역 필드 변경 핸들러 (수정 모드)
  const handleRegionFieldChange = (id, field, value) => {
    setEditingRegions(editingRegions.map(r =>
      r.id === id ? { ...r, [field]: value } : r
    ));
  };

  // 상세지역 저장 핸들러 (추가)
  const handleSaveRegion = () => {
    if (!newRegionData.territoryId) {
      message.error('사업권역을 선택해주세요.');
      return;
    }
    if (!newRegionData.name) {
      message.error('상세지역명을 입력해주세요.');
      return;
    }
    if (!/^[가-힣()\/\s]+$/.test(newRegionData.name)) {
      message.error('한글, 괄호, 슬래시만 입력 가능합니다.');
      return;
    }

    const newId = Math.max(...regions.map(r => r.id)) + 1;
    const territory = territories.find(t => t.id === newRegionData.territoryId);
    const currentRegions = regions.filter(r => r.territoryId === newRegionData.territoryId);
    const maxDisplayOrder = Math.max(...currentRegions.map(r => r.displayOrder), 0);

    const newRegion = {
      id: newId,
      territoryId: newRegionData.territoryId,
      territoryName: territory.name,
      name: newRegionData.name,
      displayOrder: maxDisplayOrder + 1,
      status: 'active',
    };

    setRegions([...regions, newRegion]);
    setTerritories(territories.map(t =>
      t.id === newRegionData.territoryId ? { ...t, regionCount: t.regionCount + 1 } : t
    ));

    setIsAddingRegion(false);
    setNewRegionData({ territoryId: '', name: '', status: 'active' });
    message.success(`상세지역 '${newRegionData.name}'이 등록되었습니다.`);
  };

  // 상세지역 추가 취소 핸들러
  const handleCancelRegion = () => {
    setIsAddingRegion(false);
    setNewRegionData({ territoryId: '', name: '', status: 'active' });
  };

  // 사업권역 드래그 핸들러
  const handleTerritoryDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const dataSource = editMode ? editingTerritories : territories;
      const sortedData = [...dataSource].sort((a, b) => a.displayOrder - b.displayOrder);

      const oldIndex = sortedData.findIndex(t => t.id === active.id);
      const newIndex = sortedData.findIndex(t => t.id === over.id);

      const newOrder = arrayMove(sortedData, oldIndex, newIndex);
      const updatedTerritories = newOrder.map((t, index) => ({
        ...t,
        displayOrder: index + 1
      }));

      if (editMode) {
        setEditingTerritories(updatedTerritories);
      } else {
        setTerritories(updatedTerritories);
        message.success('표시순서가 변경되었습니다.');
      }
    }
  };

  // 상세지역 드래그 핸들러
  const handleRegionDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const dataSource = editMode ? editingRegions : regions;
      const currentRegions = dataSource
        .filter(r => r.territoryId === selectedTerritory.id)
        .sort((a, b) => a.displayOrder - b.displayOrder);

      const oldIndex = currentRegions.findIndex(r => r.id === active.id);
      const newIndex = currentRegions.findIndex(r => r.id === over.id);

      const newOrder = arrayMove(currentRegions, oldIndex, newIndex);
      const updatedSelectedRegions = newOrder.map((r, index) => ({
        ...r,
        displayOrder: index + 1
      }));

      // 전체 regions 배열 업데이트
      const updatedRegions = dataSource.map(r => {
        const found = updatedSelectedRegions.find(usr => usr.id === r.id);
        return found || r;
      });

      if (editMode) {
        setEditingRegions(updatedRegions);
      } else {
        setRegions(updatedRegions);
        message.success('표시순서가 변경되었습니다.');
      }
    }
  };

  // 현재 작업 중인 데이터 소스
  const workingTerritories = editMode ? editingTerritories : territories;
  const workingRegions = editMode ? editingRegions : regions;

  // 정렬된 사업권역 목록
  const sortedTerritories = [...workingTerritories].sort((a, b) => a.displayOrder - b.displayOrder);

  // 선택된 권역의 상세지역 목록
  const selectedRegions = selectedTerritory
    ? workingRegions.filter(r => r.territoryId === selectedTerritory.id)
                   .sort((a, b) => a.displayOrder - b.displayOrder)
    : [];

  return (
    <div style={{ minHeight: '100vh', padding: '16px 24px', background: '#f5f5f5' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="text-2xl font-bold text-gray-900" style={{ margin: 0 }}>사업권역 관리</h2>
          <Space>
            {editMode ? (
              <>
                <Button type="primary" icon={<SaveOutlined />} onClick={handleSaveAll}>
                  저장
                </Button>
                <Button onClick={handleCancelEdit}>
                  취소
                </Button>
              </>
            ) : (
              <Button icon={<EditOutlined />} onClick={handleEnterEditMode}>
                수정 모드
              </Button>
            )}
          </Space>
        </div>

        {editMode && (
          <Alert
            message="수정 모드"
            description="여러 항목을 수정한 후 상단의 저장 버튼을 클릭하세요. 취소 버튼을 누르면 모든 변경사항이 취소됩니다."
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <Row gutter={16}>
          {/* 왼쪽: 사업권역 목록 */}
          <Col xs={24} lg={12}>
            <Card
              title={<span style={{ fontSize: 16, fontWeight: 600 }}>사업권역 ({sortedTerritories.length})</span>}
              extra={
                !editMode && !isAddingTerritory && (
                  <Button
                    type="primary"
                    size="small"
                    icon={<PlusOutlined />}
                    onClick={handleAddTerritory}
                  >
                    권역 추가
                  </Button>
                )
              }
              style={editMode ? { backgroundColor: '#f9fafb' } : {}}
            >

              {!editMode && isAddingTerritory && (
                <Card size="small" style={{ marginBottom: 12, backgroundColor: '#fafafa' }}>
                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <div>
                      <label>권역명 <span style={{ color: 'red' }}>*</span></label>
                      <Input
                        value={newTerritoryData.name}
                        onChange={(e) => setNewTerritoryData({ ...newTerritoryData, name: e.target.value })}
                        placeholder="권역명 입력"
                        maxLength={20}
                      />
                    </div>
                    <Flex justify="flex-end" gap="small">
                      <Button size="small" onClick={handleCancelTerritory}>취소</Button>
                      <Button size="small" type="primary" onClick={handleSaveTerritory}>저장</Button>
                    </Flex>
                  </Space>
                </Card>
              )}

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleTerritoryDragEnd}
              >
                <SortableContext
                  items={sortedTerritories.map(t => t.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <Space direction="vertical" size="small" style={{ width: '100%', maxHeight: 600, overflow: 'auto' }}>
                    {sortedTerritories.map(t => (
                      <SortableItem key={t.id} id={t.id}>
                        {(attributes, listeners) => (
                          <Card
                            size="small"
                            onClick={() => !editMode && setSelectedTerritory(t)}
                            style={{
                              cursor: editMode ? 'default' : 'pointer',
                              border: selectedTerritory?.id === t.id ? '2px solid #1890ff' : '1px solid #d9d9d9',
                              backgroundColor: selectedTerritory?.id === t.id ? '#e6f7ff' : '#fff',
                              transition: 'all 0.3s'
                            }}
                          >
                            <Flex justify="space-between" align="center">
                              <Flex align="center" gap="small" style={{ flex: 1 }}>
                                <HolderOutlined
                                  {...attributes}
                                  {...listeners}
                                  style={{ cursor: 'grab', fontSize: 16, color: '#999' }}
                                />
                                <div style={{ flex: 1 }}>
                                  {editMode ? (
                                    <Space size="small" style={{ width: '100%' }}>
                                      <Input
                                        value={t.name}
                                        onChange={(e) => handleTerritoryFieldChange(t.id, 'name', e.target.value)}
                                        placeholder="권역명"
                                        maxLength={20}
                                        style={{ flex: 1 }}
                                      />
                                      <Select
                                        value={t.status}
                                        onChange={(value) => handleTerritoryFieldChange(t.id, 'status', value)}
                                        style={{ width: 80 }}
                                      >
                                        <Select.Option value="active">활성</Select.Option>
                                        <Select.Option value="inactive">비활성</Select.Option>
                                      </Select>
                                    </Space>
                                  ) : (
                                    <>
                                      <Text style={{ fontWeight: 500 }}>{t.name}</Text>
                                      <Tag color={t.status === 'active' ? 'green' : 'default'} style={{ marginLeft: 8 }}>
                                        {t.status === 'active' ? '활성' : '비활성'}
                                      </Tag>
                                      <Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>
                                        {t.regionCount}개 지역
                                      </Text>
                                    </>
                                  )}
                                </div>
                              </Flex>
                            </Flex>
                          </Card>
                        )}
                      </SortableItem>
                    ))}
                  </Space>
                </SortableContext>
              </DndContext>
            </Card>
          </Col>

          {/* 우측: 상세지역 목록 */}
          <Col xs={24} lg={12}>
            <Card
              title={
                <span style={{ fontSize: 16, fontWeight: 600 }}>
                  {selectedTerritory ? `${selectedTerritory.name} - 상세지역 (${selectedRegions.length})` : '상세지역'}
                </span>
              }
              extra={
                !editMode && selectedTerritory && !isAddingRegion && (
                  <Button
                    type="primary"
                    size="small"
                    icon={<PlusOutlined />}
                    onClick={handleAddRegion}
                    disabled={selectedTerritory?.status === 'inactive'}
                  >
                    지역 추가
                  </Button>
                )
              }
              style={editMode ? { backgroundColor: '#f9fafb' } : {}}
            >

              {!selectedTerritory ? (
                <div style={{ textAlign: 'center', padding: '80px 0', color: '#8c8c8c' }}>
                  <Text>왼쪽에서 사업권역을 선택해주세요.</Text>
                </div>
              ) : (
                <>
                  {!editMode && isAddingRegion && (
                    <Card size="small" style={{ marginBottom: 12, backgroundColor: '#fafafa' }}>
                      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                        <div>
                          <label>지역명 <span style={{ color: 'red' }}>*</span></label>
                          <Input
                            value={newRegionData.name}
                            onChange={(e) => setNewRegionData({ ...newRegionData, name: e.target.value })}
                            placeholder="지역명 입력"
                            maxLength={20}
                          />
                        </div>
                        <Flex justify="flex-end" gap="small">
                          <Button size="small" onClick={handleCancelRegion}>취소</Button>
                          <Button size="small" type="primary" onClick={handleSaveRegion}>저장</Button>
                        </Flex>
                      </Space>
                    </Card>
                  )}

                  {selectedRegions.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: '#8c8c8c' }}>
                      등록된 지역이 없습니다.
                    </div>
                  ) : (
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleRegionDragEnd}
                    >
                      <SortableContext
                        items={selectedRegions.map(r => r.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <Space direction="vertical" size="small" style={{ width: '100%' }}>
                          {selectedRegions.map(r => (
                            <SortableItem key={r.id} id={r.id}>
                              {(attributes, listeners) => (
                                <Card
                                  size="small"
                                  style={{
                                    backgroundColor: r.status === 'active' ? '#fff' : '#fafafa'
                                  }}
                                >
                                  <Flex justify="space-between" align="center">
                                    <Flex align="center" gap="small" style={{ flex: 1 }}>
                                      <HolderOutlined
                                        {...attributes}
                                        {...listeners}
                                        style={{ cursor: 'grab', fontSize: 16, color: '#999' }}
                                      />
                                      <div style={{ flex: 1 }}>
                                        {editMode ? (
                                          <Space size="small" style={{ width: '100%' }}>
                                            <Input
                                              value={r.name}
                                              onChange={(e) => handleRegionFieldChange(r.id, 'name', e.target.value)}
                                              placeholder="지역명"
                                              maxLength={20}
                                              style={{ flex: 1 }}
                                            />
                                            <Select
                                              value={r.status}
                                              onChange={(value) => handleRegionFieldChange(r.id, 'status', value)}
                                              style={{ width: 80 }}
                                            >
                                              <Select.Option value="active">활성</Select.Option>
                                              <Select.Option value="inactive">비활성</Select.Option>
                                            </Select>
                                          </Space>
                                        ) : (
                                          <>
                                            <Text style={{ fontWeight: 500 }}>{r.name}</Text>
                                            <Tag color={r.status === 'active' ? 'green' : 'default'} style={{ marginLeft: 8 }}>
                                              {r.status === 'active' ? '활성' : '비활성'}
                                            </Tag>
                                          </>
                                        )}
                                      </div>
                                    </Flex>
                                  </Flex>
                                </Card>
                              )}
                            </SortableItem>
                          ))}
                        </Space>
                      </SortableContext>
                    </DndContext>
                  )}
                </>
              )}
            </Card>
          </Col>
        </Row>
      </Space>
    </div>
  );
}

export default TerritoryManagement;
