import React, { useState } from 'react';
import { PlusOutlined, EditOutlined, HolderOutlined, SaveOutlined, DownloadOutlined } from '@ant-design/icons';
import toast from 'react-hot-toast';
import { FMButton } from '../components/ui/FMButton';
import { FMInput } from '../components/ui/FMInput';
import { FMSelect } from '../components/ui/FMSelect';
import { FMSelectSimple } from '../components/ui/FMSelectSimple';
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
    toast('수정 모드입니다. 여러 항목을 수정한 후 상단의 저장 버튼을 클릭하세요.');
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
        toast('변경사항이 취소되었습니다.');
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
    // 권역명 유효성 검사
    for (const territory of editingTerritories) {
      if (!territory.name || !territory.name.trim()) {
        toast.error('권역명을 입력해주세요.');
        return;
      }
      if (!/^[가-힣()\/\s]+$/.test(territory.name)) {
        toast.error(`'${territory.name}': 한글, 괄호, 슬래시만 입력 가능합니다.`);
        return;
      }
    }

    // 권역명 중복 체크
    for (let i = 0; i < editingTerritories.length; i++) {
      const territory = editingTerritories[i];
      const duplicate = editingTerritories.find((t, idx) =>
        idx !== i && t.name.trim() === territory.name.trim()
      );
      if (duplicate) {
        toast.error(`'${territory.name}' 권역명이 중복되었습니다.`);
        return;
      }
    }

    // 지역명 유효성 검사
    for (const region of editingRegions) {
      if (!region.name || !region.name.trim()) {
        toast.error('지역명을 입력해주세요.');
        return;
      }
      if (!/^[가-힣()\/\s]+$/.test(region.name)) {
        toast.error(`'${region.name}': 한글, 괄호, 슬래시만 입력 가능합니다.`);
        return;
      }
    }

    // 지역명 중복 체크
    for (let i = 0; i < editingRegions.length; i++) {
      const region = editingRegions[i];
      const duplicate = editingRegions.find((r, idx) =>
        idx !== i && r.name.trim() === region.name.trim()
      );
      if (duplicate) {
        toast.error(`'${region.name}' 지역명이 중복되었습니다.`);
        return;
      }
    }

    // 권역 비활성화 제약 체크
    for (const territory of editingTerritories) {
      if (territory.status === 'inactive') {
        const activeRegionCount = editingRegions.filter(
          r => r.territoryId === territory.id && r.status === 'active'
        ).length;

        if (activeRegionCount > 0) {
          toast.error(`'${territory.name}' 권역에 속한 사용중인 지역이 ${activeRegionCount}개 있어 비활성화할 수 없습니다. 먼저 지역을 미사용으로 바꾸거나 다른 권역으로 이동해주세요.`);
          return;
        }
      }
    }

    // 지역 비활성화 시 경고 (저장은 허용)
    for (const region of editingRegions) {
      const originalRegion = originalRegions.find(r => r.id === region.id);
      if (originalRegion && originalRegion.status === 'active' && region.status === 'inactive') {
        // 실제로는 거래처 수를 확인해야 하지만, 여기서는 예시로 랜덤 값 사용
        const clientCount = Math.floor(Math.random() * 5);
        if (clientCount > 0) {
          toast(`'${region.name}' 지역에 소속된 거래처가 ${clientCount}개 있습니다. 필요시 해당 거래처의 지역을 변경하세요.`);
        }
      }
    }

    // trim 적용
    const trimmedTerritories = editingTerritories.map(t => ({
      ...t,
      name: t.name.trim()
    }));
    const trimmedRegions = editingRegions.map(r => ({
      ...r,
      name: r.name.trim()
    }));

    setTerritories(trimmedTerritories);
    setRegions(trimmedRegions);
    setEditMode(false);
    setEditingTerritories([]);
    setEditingRegions([]);
    setOriginalTerritories([]);
    setOriginalRegions([]);
    toast.success('모든 변경사항이 저장되었습니다.');
  };

  // CSV 다운로드
  const handleDownloadCSV = () => {
    try {
      // CSV 헤더
      const headers = ['사업권역', '상세지역', '상태'];

      // 사업권역별로 그룹화하여 데이터 생성
      const sortedTerritories = [...territories].sort((a, b) => a.displayOrder - b.displayOrder);
      const rows = [];

      sortedTerritories.forEach(territory => {
        // 해당 권역의 상세지역들 가져오기
        const territoryRegions = regions
          .filter(r => r.territoryId === territory.id)
          .sort((a, b) => a.displayOrder - b.displayOrder);

        if (territoryRegions.length === 0) {
          // 상세지역이 없는 경우 두 번째 열 공란
          rows.push([
            territory.name,
            '',
            territory.status === 'active' ? '활성' : '비활성'
          ]);
        } else {
          // 상세지역이 있는 경우 각 지역마다 행 추가
          territoryRegions.forEach(region => {
            rows.push([
              territory.name,
              region.name,
              region.status === 'active' ? '활성' : '비활성'
            ]);
          });
        }
      });

      // CSV 내용 생성
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');

      // BOM 추가 (한글 깨짐 방지)
      const bom = '﻿';
      const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });

      // 다운로드
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `사업권역_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('CSV 파일이 다운로드되었습니다.');
    } catch (error) {
      toast.error('CSV 다운로드 중 오류가 발생했습니다.');
      console.error(error);
    }
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
      toast('먼저 진행 중인 작업을 완료해주세요.');
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
      toast.error('권역명을 입력해주세요.');
      return;
    }
    if (!/^[가-힣()\/\s]+$/.test(newTerritoryData.name)) {
      toast.error('한글, 괄호, 슬래시만 입력 가능합니다.');
      return;
    }

    // 권역명 중복 체크 (전체 시스템)
    const isDuplicate = territories.some(t => t.name === newTerritoryData.name.trim());
    if (isDuplicate) {
      toast.error(`'${newTerritoryData.name}' 권역명이 이미 존재합니다.`);
      return;
    }

    const newId = Math.max(...territories.map(t => t.id)) + 1;
    const maxDisplayOrder = Math.max(...territories.map(t => t.displayOrder), 0);

    const newTerritory = {
      id: newId,
      name: newTerritoryData.name.trim(),
      displayOrder: maxDisplayOrder + 1,
      regionCount: 0,
      status: newTerritoryData.status,
    };

    setTerritories([...territories, newTerritory]);
    setIsAddingTerritory(false);
    setNewTerritoryData({ name: '', status: 'active' });
    toast.success(`사업권역 '${newTerritoryData.name}'이 등록되었습니다.`);
  };

  // 사업권역 추가 취소 핸들러
  const handleCancelTerritory = () => {
    setIsAddingTerritory(false);
    setNewTerritoryData({ name: '', status: 'active' });
  };

  // 상세지역 추가 핸들러
  const handleAddRegion = () => {
    if (isAddingRegion) {
      toast('먼저 진행 중인 작업을 완료해주세요.');
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
      toast.error('사업권역을 선택해주세요.');
      return;
    }
    if (!newRegionData.name) {
      toast.error('상세지역명을 입력해주세요.');
      return;
    }
    if (!/^[가-힣()\/\s]+$/.test(newRegionData.name)) {
      toast.error('한글, 괄호, 슬래시만 입력 가능합니다.');
      return;
    }

    // 지역명 중복 체크 (전체 시스템)
    const isDuplicate = regions.some(r => r.name === newRegionData.name.trim());
    if (isDuplicate) {
      toast.error(`'${newRegionData.name}' 지역명이 이미 존재합니다.`);
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
      name: newRegionData.name.trim(),
      displayOrder: maxDisplayOrder + 1,
      status: 'active',
    };

    setRegions([...regions, newRegion]);
    setTerritories(territories.map(t =>
      t.id === newRegionData.territoryId ? { ...t, regionCount: t.regionCount + 1 } : t
    ));

    setIsAddingRegion(false);
    setNewRegionData({ territoryId: '', name: '', status: 'active' });
    toast.success(`상세지역 '${newRegionData.name}'이 등록되었습니다.`);
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
        toast.success('표시순서가 변경되었습니다.');
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
        toast.success('표시순서가 변경되었습니다.');
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
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="flex flex-col gap-6 w-full">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">사업권역 관리</h2>
          <div className="flex flex-wrap gap-2">
            {editMode ? (
              <>
                <FMButton
                  variant="primary"
                  icon={<SaveOutlined className="h-4 w-4" />}
                  onClick={handleSaveAll}
                >
                  저장
                </FMButton>
                <FMButton
                  variant="secondary"
                  onClick={handleCancelEdit}
                >
                  취소
                </FMButton>
              </>
            ) : (
              <>
                <FMButton
                  variant="secondary"
                  icon={<EditOutlined className="h-4 w-4" />}
                  onClick={handleEnterEditMode}
                >
                  수정 모드
                </FMButton>
                <FMButton
                  variant="indigo"
                  icon={<DownloadOutlined className="h-4 w-4" />}
                  onClick={handleDownloadCSV}
                >
                  CSV 다운로드
                </FMButton>
              </>
            )}
          </div>
        </div>

        {editMode && (
          <div className="mb-4 rounded-md border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-center">
              <svg className="mr-4 h-4 w-4 shrink-0 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                <path d="M12 16v-4" strokeWidth="2" strokeLinecap="round" />
                <path d="M12 8h.01" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <div className="font-medium text-blue-700">
                여러 항목을 수정한 후 상단의 저장 버튼을 클릭하세요. 취소 버튼을 누르면 모든 변경사항이 취소됩니다.
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* 왼쪽: 사업권역 목록 */}
          <div>
            <div className={`rounded-xl border border-gray-200 bg-white p-5 ${editMode ? 'bg-gray-50' : ''}`}>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">사업권역 ({sortedTerritories.length})</h3>
                {!editMode && !isAddingTerritory && (
                  <FMButton
                    variant="primary"
                    icon={<PlusOutlined className="h-4 w-4" />}
                    onClick={handleAddTerritory}
                  >
                    권역 추가
                  </FMButton>
                )}
              </div>

              {!editMode && isAddingTerritory && (
                <div className="mb-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <label className="flex w-full items-start gap-2">
                    <span className="shrink-0 pt-2" style={{ width: '20%' }}>
                      <span className="block text-sm text-gray-600 text-left font-medium">
                        권역명 <span className="text-red-500">*</span>
                      </span>
                    </span>
                    <span style={{ width: '80%' }}>
                      <FMInput
                        value={newTerritoryData.name}
                        onChange={(value) => setNewTerritoryData({ ...newTerritoryData, name: value })}
                        placeholder="권역명 입력"
                      />
                    </span>
                    <div className="flex gap-2 shrink-0">
                      <FMButton variant="secondary" onClick={handleCancelTerritory}>취소</FMButton>
                      <FMButton variant="primary" onClick={handleSaveTerritory}>저장</FMButton>
                    </div>
                  </label>
                </div>
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
                  <div className="flex flex-col gap-2 max-h-[600px] overflow-auto">
                    {sortedTerritories.map(t => (
                      <SortableItem key={t.id} id={t.id}>
                        {(attributes, listeners) => (
                          <div
                            onClick={() => !editMode && setSelectedTerritory(t)}
                            className={`rounded-lg border p-3 transition-all ${
                              editMode ? 'cursor-default' : 'cursor-pointer'
                            } ${
                              selectedTerritory?.id === t.id
                                ? 'border-2 border-blue-500 bg-blue-50'
                                : 'border-gray-200 bg-white hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex flex-1 items-center gap-2">
                                <HolderOutlined
                                  {...attributes}
                                  {...listeners}
                                  className="cursor-grab text-base text-gray-400"
                                />
                                <div className="flex-1">
                                  {editMode ? (
                                    <div className="flex gap-2 items-center">
                                      <FMInput
                                        value={t.name}
                                        onChange={(value) => handleTerritoryFieldChange(t.id, 'name', value)}
                                        placeholder="권역명"
                                        className="flex-1"
                                      />
                                      <FMSelect
                                        value={t.status}
                                        onChange={(value) => handleTerritoryFieldChange(t.id, 'status', value)}
                                        options={[
                                          { value: 'active', label: '활성' },
                                          { value: 'inactive', label: '비활성' }
                                        ]}
                                        className="w-64"
                                      />
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium text-gray-900">{t.name}</span>
                                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                        t.status === 'active'
                                          ? 'bg-green-100 text-green-700'
                                          : 'bg-gray-100 text-gray-700'
                                      }`}>
                                        {t.status === 'active' ? '활성' : '비활성'}
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        {t.regionCount}개 지역
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </SortableItem>
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          </div>

          {/* 우측: 상세지역 목록 */}
          <div>
            <div className={`rounded-xl border border-gray-200 bg-white p-5 ${editMode ? 'bg-gray-50' : ''}`}>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">
                  {selectedTerritory ? `${selectedTerritory.name} - 상세지역 (${selectedRegions.length})` : '상세지역'}
                </h3>
                {!editMode && selectedTerritory && !isAddingRegion && (
                  <FMButton
                    variant="primary"
                    icon={<PlusOutlined className="h-4 w-4" />}
                    onClick={handleAddRegion}
                    disabled={selectedTerritory?.status === 'inactive'}
                  >
                    지역 추가
                  </FMButton>
                )}
              </div>

              {!selectedTerritory ? (
                <div className="text-center py-20 text-gray-400">
                  <span>왼쪽에서 사업권역을 선택해주세요.</span>
                </div>
              ) : (
                <>
                  {!editMode && isAddingRegion && (
                    <div className="mb-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <label className="flex w-full items-start gap-2">
                        <span className="shrink-0 pt-2" style={{ width: '20%' }}>
                          <span className="block text-sm text-gray-600 text-left font-medium">
                            지역명 <span className="text-red-500">*</span>
                          </span>
                        </span>
                        <span style={{ width: '80%' }}>
                          <FMInput
                            value={newRegionData.name}
                            onChange={(value) => setNewRegionData({ ...newRegionData, name: value })}
                            placeholder="지역명 입력"
                          />
                        </span>
                        <div className="flex gap-2 shrink-0">
                          <FMButton variant="secondary" onClick={handleCancelRegion}>취소</FMButton>
                          <FMButton variant="primary" onClick={handleSaveRegion}>저장</FMButton>
                        </div>
                      </label>
                    </div>
                  )}

                  {selectedRegions.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">
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
                        <div className="flex flex-col gap-2">
                          {selectedRegions.map(r => (
                            <SortableItem key={r.id} id={r.id}>
                              {(attributes, listeners) => (
                                <div className={`rounded-lg border border-gray-200 p-3 ${
                                  r.status === 'active' ? 'bg-white' : 'bg-gray-50'
                                }`}>
                                  <div className="flex items-center justify-between">
                                    <div className="flex flex-1 items-center gap-2">
                                      <HolderOutlined
                                        {...attributes}
                                        {...listeners}
                                        className="cursor-grab text-base text-gray-400"
                                      />
                                      <div className="flex-1">
                                        {editMode ? (
                                          <div className="flex gap-2 items-center">
                                            <FMInput
                                              value={r.name}
                                              onChange={(value) => handleRegionFieldChange(r.id, 'name', value)}
                                              placeholder="지역명"
                                              className="flex-1"
                                            />
                                            <FMSelect
                                              value={r.status}
                                              onChange={(value) => handleRegionFieldChange(r.id, 'status', value)}
                                              options={[
                                                { value: 'active', label: '활성' },
                                                { value: 'inactive', label: '비활성' }
                                              ]}
                                              className="w-64"
                                            />
                                          </div>
                                        ) : (
                                          <div className="flex items-center gap-2">
                                            <span className="font-medium text-gray-900">{r.name}</span>
                                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                              r.status === 'active'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-700'
                                            }`}>
                                              {r.status === 'active' ? '활성' : '비활성'}
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </SortableItem>
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TerritoryManagement;
