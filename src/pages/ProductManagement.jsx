import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FMButton } from '../components/ui/FMButton';
import { FMInput } from '../components/ui/FMInput';
import { FMSelect } from '../components/ui/FMSelect';
import { FMSwitch } from '../components/ui/FMSwitch';
import { PlusOutlined, EditOutlined, SaveOutlined, DownloadOutlined, HolderOutlined } from '@ant-design/icons';
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

import {
  productCategories as initialCategories,
  products as initialProducts,
  origins as initialOrigins,
  specifications as initialSpecs
} from '../data/mockData';

// Sortable Item Component
function SortableItem({ id, children, disabled }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      {children(listeners)}
    </div>
  );
}

function ProductManagement() {
  // Data state
  const [categories, setCategories] = useState(initialCategories);
  const [products, setProducts] = useState(initialProducts);
  const [origins, setOrigins] = useState(initialOrigins);
  const [specs, setSpecs] = useState(initialSpecs);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Selection state
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Edit mode state
  const [editMode, setEditMode] = useState(false);
  const [editingCategories, setEditingCategories] = useState([]);
  const [editingProducts, setEditingProducts] = useState([]);
  const [editingOrigins, setEditingOrigins] = useState([]);
  const [editingSpecs, setEditingSpecs] = useState([]);
  const [originalCategories, setOriginalCategories] = useState([]);
  const [originalProducts, setOriginalProducts] = useState([]);
  const [originalOrigins, setOriginalOrigins] = useState([]);
  const [originalSpecs, setOriginalSpecs] = useState([]);

  // Add form state
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isAddingOrigin, setIsAddingOrigin] = useState(false);
  const [isAddingSpec, setIsAddingSpec] = useState(false);

  const [newCategoryData, setNewCategoryData] = useState({ name: '' });
  const [newProductData, setNewProductData] = useState({
    categoryId: '', name: '', orderUnit: '', unitWeight: ''
  });
  const [newOriginData, setNewOriginData] = useState({ productId: '', name: '' });
  const [newSpecData, setNewSpecData] = useState({ productId: '', name: '' });

  // ===== Edit Mode Handlers =====
  const handleEnterEditMode = () => {
    setOriginalCategories(JSON.parse(JSON.stringify(categories)));
    setOriginalProducts(JSON.parse(JSON.stringify(products)));
    setOriginalOrigins(JSON.parse(JSON.stringify(origins)));
    setOriginalSpecs(JSON.parse(JSON.stringify(specs)));
    setEditingCategories(JSON.parse(JSON.stringify(categories)));
    setEditingProducts(JSON.parse(JSON.stringify(products)));
    setEditingOrigins(JSON.parse(JSON.stringify(origins)));
    setEditingSpecs(JSON.parse(JSON.stringify(specs)));
    setEditMode(true);
  };

  const handleSaveEditMode = () => {
    // Validate categories
    for (const category of editingCategories) {
      if (!category.name || category.name.trim() === '') {
        toast.error('품목분류명을 입력해주세요.');
        return;
      }
      if (category.name.length > 20) {
        toast.error('품목분류명은 최대 20자까지 입력 가능합니다.');
        return;
      }

      // Check if deactivating category with active products
      if (category.status === 'inactive') {
        const activeItemCount = editingProducts.filter(
          p => p.categoryId === category.id && p.status === 'active'
        ).length;
        if (activeItemCount > 0) {
          toast.error(`${category.name} 분류에 ${activeItemCount}개의 활성 품목이 있어 비활성화할 수 없습니다.`);
          return;
        }
      }
    }

    // Validate products
    for (const product of editingProducts) {
      if (!product.name || product.name.trim() === '') {
        toast.error('품목명을 입력해주세요.');
        return;
      }
      if (product.name.length > 20) {
        toast.error('품목명은 최대 20자까지 입력 가능합니다.');
        return;
      }
      if (!product.orderUnit) {
        toast.error('주문단위를 선택해주세요.');
        return;
      }
      if (!product.unitWeight || product.unitWeight <= 0) {
        toast.error('주문단위당중량을 입력해주세요.');
        return;
      }

      // Check if deactivating product with active origins/specs
      if (product.status === 'inactive') {
        const activeOriginCount = editingOrigins.filter(
          o => o.productId === product.id && o.status === 'active'
        ).length;
        const activeSpecCount = editingSpecs.filter(
          s => s.productId === product.id && s.status === 'active'
        ).length;
        if (activeOriginCount > 0 || activeSpecCount > 0) {
          toast.error(`${product.name} 품목에 활성 원산지/규격이 ${activeOriginCount + activeSpecCount}개 있어 비활성화할 수 없습니다.`);
          return;
        }
      }
    }

    // Validate origins
    for (const origin of editingOrigins) {
      if (!origin.name || origin.name.trim() === '') {
        toast.error('원산지명을 입력해주세요.');
        return;
      }
      if (origin.name.length > 20) {
        toast.error('원산지명은 최대 20자까지 입력 가능합니다.');
        return;
      }
    }

    // Validate specs
    for (const spec of editingSpecs) {
      if (!spec.name || spec.name.trim() === '') {
        toast.error('규격명을 입력해주세요.');
        return;
      }
      if (spec.name.length > 20) {
        toast.error('규격명은 최대 20자까지 입력 가능합니다.');
        return;
      }
    }

    // Update category item counts
    const updatedCategories = editingCategories.map(cat => ({
      ...cat,
      itemCount: editingProducts.filter(p => p.categoryId === cat.id).length
    }));

    // Update product origin/spec counts
    const updatedProducts = editingProducts.map(prod => ({
      ...prod,
      originCount: editingOrigins.filter(o => o.productId === prod.id).length,
      specCount: editingSpecs.filter(s => s.productId === prod.id).length
    }));

    setCategories(updatedCategories);
    setProducts(updatedProducts);
    setOrigins(editingOrigins);
    setSpecs(editingSpecs);
    setEditMode(false);
    toast.success('변경사항이 저장되었습니다.');
  };

  const handleCancelEditMode = () => {
    setCategories(originalCategories);
    setProducts(originalProducts);
    setOrigins(originalOrigins);
    setSpecs(originalSpecs);
    setEditMode(false);
    toast('변경사항이 취소되었습니다.');
  };

  // ===== Category Handlers =====
  const handleAddCategory = () => {
    if (isAddingProduct || isAddingOrigin || isAddingSpec) {
      toast.error('먼저 진행 중인 작업을 완료해주세요.');
      return;
    }
    setNewCategoryData({ name: '' });
    setIsAddingCategory(true);
  };

  const handleSaveCategory = () => {
    if (!newCategoryData.name || newCategoryData.name.trim() === '') {
      toast.error('품목분류명을 입력해주세요.');
      return;
    }
    if (newCategoryData.name.length > 20) {
      toast.error('최대 20자까지 입력 가능합니다.');
      return;
    }

    // Check for duplicates
    if (categories.some(c => c.name === newCategoryData.name.trim())) {
      toast.error('이미 존재하는 품목분류명입니다.');
      return;
    }

    const newId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
    setCategories([...categories, {
      id: newId,
      name: newCategoryData.name.trim(),
      itemCount: 0,
      status: 'active',
    }]);
    setIsAddingCategory(false);
    setNewCategoryData({ name: '' });
    toast.success(`품목분류 '${newCategoryData.name}'이 등록되었습니다.`);
  };

  const handleCancelCategory = () => {
    setIsAddingCategory(false);
    setNewCategoryData({ name: '' });
  };

  const handleCategoryFieldChange = (id, field, value) => {
    setEditingCategories(editingCategories.map(c =>
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  // ===== Drag and Drop Handlers =====
  const handleDragEndCategory = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setEditingCategories((items) => {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  const handleDragEndProduct = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setEditingProducts((items) => {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  const handleDragEndOrigin = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setEditingOrigins((items) => {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  const handleDragEndSpec = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setEditingSpecs((items) => {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  // ===== Product Handlers =====
  const handleAddProduct = () => {
    if (!selectedCategory) {
      toast.error('먼저 품목분류를 선택해주세요.');
      return;
    }
    if (isAddingCategory || isAddingOrigin || isAddingSpec) {
      toast.error('먼저 진행 중인 작업을 완료해주세요.');
      return;
    }
    setNewProductData({
      categoryId: selectedCategory.id,
      name: '',
      orderUnit: '',
      unitWeight: ''
    });
    setIsAddingProduct(true);
  };

  const handleSaveProduct = () => {
    if (!newProductData.categoryId) {
      toast.error('품목분류를 선택해주세요.');
      return;
    }
    if (!newProductData.name || newProductData.name.trim() === '') {
      toast.error('품목명을 입력해주세요.');
      return;
    }
    if (newProductData.name.length > 20) {
      toast.error('최대 20자까지 입력 가능합니다.');
      return;
    }
    if (!newProductData.orderUnit) {
      toast.error('주문단위를 선택해주세요.');
      return;
    }
    if (!newProductData.unitWeight || newProductData.unitWeight <= 0) {
      toast.error('주문단위당중량을 입력해주세요.');
      return;
    }

    const category = categories.find(c => c.id === newProductData.categoryId);
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;

    setProducts([...products, {
      id: newId,
      categoryId: newProductData.categoryId,
      categoryName: category.name,
      name: newProductData.name.trim(),
      orderUnit: newProductData.orderUnit,
      unitWeight: parseFloat(newProductData.unitWeight),
      originCount: 0,
      specCount: 0,
      status: 'active',
    }]);

    // Update category item count
    setCategories(categories.map(c =>
      c.id === newProductData.categoryId ? { ...c, itemCount: c.itemCount + 1 } : c
    ));

    setIsAddingProduct(false);
    setNewProductData({ categoryId: '', name: '', orderUnit: '', unitWeight: '' });
    toast.success(`품목 '${category.name} / ${newProductData.name}'이 등록되었습니다.`);
  };

  const handleCancelProduct = () => {
    setIsAddingProduct(false);
    setNewProductData({ categoryId: '', name: '', orderUnit: '', unitWeight: '' });
  };

  const handleProductFieldChange = (id, field, value) => {
    setEditingProducts(editingProducts.map(p =>
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  // ===== Origin Handlers =====
  const handleAddOrigin = () => {
    if (!selectedProduct) {
      toast.error('먼저 품목을 선택해주세요.');
      return;
    }
    if (isAddingCategory || isAddingProduct || isAddingSpec) {
      toast.error('먼저 진행 중인 작업을 완료해주세요.');
      return;
    }
    setNewOriginData({ productId: selectedProduct.id, name: '' });
    setIsAddingOrigin(true);
  };

  const handleSaveOrigin = () => {
    if (!newOriginData.name || newOriginData.name.trim() === '') {
      toast.error('원산지명을 입력해주세요.');
      return;
    }

    const originName = newOriginData.name.trim();

    if (originName.length > 20) {
      toast.error('최대 20자까지 입력 가능합니다.');
      return;
    }

    // Check for duplicates
    if (origins.some(o => o.productId === selectedProduct.id && o.name === originName)) {
      toast.error('이미 존재하는 원산지명입니다.');
      return;
    }

    const newId = origins.length > 0 ? Math.max(...origins.map(o => o.id)) + 1 : 1;
    const newOrigin = {
      id: newId,
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      name: originName,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setOrigins([...origins, newOrigin]);

    // Update product origin count
    setProducts(products.map(p =>
      p.id === selectedProduct.id ? { ...p, originCount: p.originCount + 1 } : p
    ));

    setIsAddingOrigin(false);
    setNewOriginData({ productId: '', name: '' });
    toast.success(`원산지 '${originName}'이 등록되었습니다.`);
  };

  const handleCancelOrigin = () => {
    setIsAddingOrigin(false);
    setNewOriginData({ productId: '', name: '' });
  };

  const handleOriginFieldChange = (id, field, value) => {
    setEditingOrigins(editingOrigins.map(o =>
      o.id === id ? { ...o, [field]: value } : o
    ));
  };

  // ===== Spec Handlers =====
  const handleAddSpec = () => {
    if (!selectedProduct) {
      toast.error('먼저 품목을 선택해주세요.');
      return;
    }
    if (isAddingCategory || isAddingProduct || isAddingOrigin) {
      toast.error('먼저 진행 중인 작업을 완료해주세요.');
      return;
    }
    setNewSpecData({ productId: selectedProduct.id, name: '' });
    setIsAddingSpec(true);
  };

  const handleSaveSpec = () => {
    if (!newSpecData.name || newSpecData.name.trim() === '') {
      toast.error('규격명을 입력해주세요.');
      return;
    }

    const specName = newSpecData.name.trim();

    if (specName.length > 20) {
      toast.error('최대 20자까지 입력 가능합니다.');
      return;
    }

    // Check for duplicates
    if (specs.some(s => s.productId === selectedProduct.id && s.name === specName)) {
      toast.error('이미 존재하는 규격명입니다.');
      return;
    }

    const newId = specs.length > 0 ? Math.max(...specs.map(s => s.id)) + 1 : 1;
    const newSpec = {
      id: newId,
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      name: specName,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setSpecs([...specs, newSpec]);

    // Update product spec count
    setProducts(products.map(p =>
      p.id === selectedProduct.id ? { ...p, specCount: p.specCount + 1 } : p
    ));

    setIsAddingSpec(false);
    setNewSpecData({ productId: '', name: '' });
    toast.success(`규격 '${specName}'이 등록되었습니다.`);
  };

  const handleCancelSpec = () => {
    setIsAddingSpec(false);
    setNewSpecData({ productId: '', name: '' });
  };

  const handleSpecFieldChange = (id, field, value) => {
    setEditingSpecs(editingSpecs.map(s =>
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

  // ===== CSV Download Handler =====
  const handleCSVDownload = () => {
    // Prepare CSV data
    const csvRows = [];
    csvRows.push(['품목분류', '품목', '원산지', '규격', '주문단위', '주문단위별중량(kg)']);

    products.forEach(product => {
      const category = categories.find(c => c.id === product.categoryId);
      const productOrigins = origins.filter(o => o.productId === product.id && o.status === 'active');
      const productSpecs = specs.filter(s => s.productId === product.id && s.status === 'active');

      // 원산지 X 규격 조합 생성
      if (productOrigins.length === 0 && productSpecs.length === 0) {
        // 원산지도 규격도 없는 경우
        csvRows.push([
          category?.name || '',
          product.name,
          '',
          '',
          product.orderUnit,
          product.unitWeight
        ]);
      } else if (productOrigins.length === 0) {
        // 원산지는 없고 규격만 있는 경우
        productSpecs.forEach(spec => {
          csvRows.push([
            category?.name || '',
            product.name,
            '',
            spec.name,
            product.orderUnit,
            product.unitWeight
          ]);
        });
      } else if (productSpecs.length === 0) {
        // 규격은 없고 원산지만 있는 경우
        productOrigins.forEach(origin => {
          csvRows.push([
            category?.name || '',
            product.name,
            origin.name,
            '',
            product.orderUnit,
            product.unitWeight
          ]);
        });
      } else {
        // 원산지와 규격 모두 있는 경우 - 모든 조합 생성
        productOrigins.forEach(origin => {
          productSpecs.forEach(spec => {
            csvRows.push([
              category?.name || '',
              product.name,
              origin.name,
              spec.name,
              product.orderUnit,
              product.unitWeight
            ]);
          });
        });
      }
    });

    // Convert to CSV string
    const csvContent = csvRows.map(row =>
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n');

    // Add BOM for Excel UTF-8 support
    const BOM = '﻿';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `상품마스터_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV 파일이 다운로드되었습니다.');
  };

  // Filtered data
  const filteredProducts = selectedCategory
    ? (editMode ? editingProducts : products).filter(p => p.categoryId === selectedCategory.id)
    : [];

  const filteredOrigins = selectedProduct
    ? (editMode ? editingOrigins : origins).filter(o => o.productId === selectedProduct.id)
    : [];

  const filteredSpecs = selectedProduct
    ? (editMode ? editingSpecs : specs).filter(s => s.productId === selectedProduct.id)
    : [];

  const displayCategories = editMode ? editingCategories : categories;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex flex-col gap-6 w-full">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">상품 관리</h2>
          <div className="flex flex-wrap gap-2">
            {editMode ? (
              <>
                <FMButton
                  variant="primary"
                  icon={<SaveOutlined className="h-4 w-4" />}
                  onClick={handleSaveEditMode}
                >
                  저장
                </FMButton>
                <FMButton
                  variant="secondary"
                  onClick={handleCancelEditMode}
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
                  onClick={handleCSVDownload}
                >
                  상품마스터 다운로드
                </FMButton>
              </>
            )}
          </div>
        </div>

        <div className="grid gap-4" style={{ gridTemplateColumns: 'minmax(150px, 1fr) minmax(450px, 3fr) minmax(150px, 1fr) minmax(150px, 1fr)' }}>
        {/* Column 1: Categories */}
        <div>
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                품목분류 ({displayCategories.length})
              </h2>
              {!editMode && !isAddingCategory && (
                <FMButton variant="green" onClick={handleAddCategory}>
                  + 분류 추가
                </FMButton>
              )}
            </div>

            {/* Add Category Form */}
            {isAddingCategory && (
              <div className="mb-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                <label className="flex w-full items-start gap-2">
                  <span className="shrink-0 pt-2" style={{ width: '25%' }}>
                    <span className="block text-left text-sm font-medium text-gray-600">
                      분류명 <span className="text-red-500">*</span>
                    </span>
                  </span>
                  <span style={{ width: '75%' }}>
                    <FMInput
                      value={newCategoryData.name}
                      onChange={(value) => setNewCategoryData({ ...newCategoryData, name: value })}
                      placeholder="예: 누운고기"
                      maxLength={20}
                    />
                  </span>
                </label>
                <div className="mt-3 flex justify-end gap-2">
                  <FMButton variant="secondary" onClick={handleCancelCategory}>
                    취소
                  </FMButton>
                  <FMButton variant="primary" onClick={handleSaveCategory}>
                    저장
                  </FMButton>
                </div>
              </div>
            )}

            {/* Category List */}
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEndCategory}
            >
              <SortableContext
                items={displayCategories.map(c => c.id)}
                strategy={verticalListSortingStrategy}
                disabled={!editMode}
              >
                <div className="space-y-2" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                  {displayCategories.map((category) => (
                    <SortableItem key={category.id} id={category.id} disabled={!editMode}>
                      {(listeners) => (
                        <div
                          onClick={() => !editMode && setSelectedCategory(category)}
                          className={`rounded-lg border p-3 transition-all ${
                            editMode
                              ? 'cursor-default border-gray-200 bg-white'
                              : selectedCategory?.id === category.id
                              ? 'cursor-pointer border-2 border-blue-500 bg-blue-50'
                              : 'cursor-pointer border-gray-200 bg-white hover:bg-gray-50'
                          }`}
                        >
                          {editMode ? (
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <div
                                  {...listeners}
                                  className="cursor-grab active:cursor-grabbing touch-none flex-shrink-0"
                                >
                                  <HolderOutlined className="text-gray-400" />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <FMInput
                                    value={category.name}
                                    onChange={(value) => handleCategoryFieldChange(category.id, 'name', value)}
                                    placeholder="분류명"
                                    maxLength={20}
                                  />
                                </div>
                              </div>
                              <div className="flex-shrink-0">
                                <FMSwitch
                                  checked={category.status === 'active'}
                                  onChange={(checked) => handleCategoryFieldChange(category.id, 'status', checked ? 'active' : 'inactive')}
                                  onLabel="활성"
                                  offLabel="비활성"
                                  size="small"
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900">{category.name}</span>
                              <span
                                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                  category.status === 'active'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {category.status === 'active' ? '활성' : '비활성'}
                              </span>
                              <span className="text-xs text-gray-500">{category.itemCount}개 품목</span>
                            </div>
                          )}
                        </div>
                      )}
                    </SortableItem>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </div>

        {/* Column 2: Products */}
        <div>
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                품목 ({filteredProducts.length})
              </h2>
              {!editMode && selectedCategory && !isAddingProduct && (
                <FMButton variant="green" onClick={handleAddProduct}>
                  + 품목 추가
                </FMButton>
              )}
            </div>

            {!selectedCategory ? (
              <div className="py-20 text-center text-gray-400">
                <span>왼쪽에서 품목분류를 선택해주세요.</span>
              </div>
            ) : (
              <>
                {/* Add Product Form */}
                {isAddingProduct && (
                  <div className="mb-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <div className="flex flex-col gap-3">
                      <label className="flex items-start gap-2">
                        <span className="shrink-0 pt-2" style={{ width: '30%' }}>
                          <span className="block text-left text-sm font-medium text-gray-600">
                            품목명 <span className="text-red-500">*</span>
                          </span>
                        </span>
                        <span style={{ width: '70%' }}>
                          <FMInput
                            value={newProductData.name}
                            onChange={(value) => setNewProductData({ ...newProductData, name: value })}
                            placeholder="예: 광어"
                            maxLength={20}
                          />
                        </span>
                      </label>

                      <label className="flex items-start gap-2">
                        <span className="shrink-0 pt-2" style={{ width: '30%' }}>
                          <span className="block text-left text-sm font-medium text-gray-600">
                            주문단위 <span className="text-red-500">*</span>
                          </span>
                        </span>
                        <span style={{ width: '70%' }}>
                          <FMSelect
                            value={newProductData.orderUnit}
                            onChange={(value) => setNewProductData({ ...newProductData, orderUnit: value })}
                            options={[
                              { value: '통', label: '통' },
                              { value: '박스', label: '박스' },
                              { value: 'kg', label: 'kg' }
                            ]}
                            placeholder="주문단위 선택"
                          />
                        </span>
                      </label>

                      <label className="flex items-start gap-2">
                        <span className="shrink-0 pt-2" style={{ width: '30%' }}>
                          <span className="block text-left text-sm font-medium text-gray-600">
                            단위중량(kg) <span className="text-red-500">*</span>
                          </span>
                        </span>
                        <span style={{ width: '70%' }}>
                          <FMInput
                            type="number"
                            value={newProductData.unitWeight}
                            onChange={(value) => setNewProductData({ ...newProductData, unitWeight: value })}
                            placeholder="예: 1.2"
                            step="0.1"
                            min="0.1"
                          />
                        </span>
                      </label>

                      <div className="flex justify-end gap-2">
                        <FMButton variant="secondary" onClick={handleCancelProduct}>
                          취소
                        </FMButton>
                        <FMButton variant="primary" onClick={handleSaveProduct}>
                          저장
                        </FMButton>
                      </div>
                    </div>
                  </div>
                )}

                {/* Product List */}
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEndProduct}
                >
                  <SortableContext
                    items={filteredProducts.map(p => p.id)}
                    strategy={verticalListSortingStrategy}
                    disabled={!editMode}
                  >
                    <div className="space-y-2" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                      {filteredProducts.map((product) => (
                        <SortableItem key={product.id} id={product.id} disabled={!editMode}>
                          {(listeners) => (
                            <div
                              onClick={() => !editMode && setSelectedProduct(product)}
                              className={`rounded-lg border p-3 transition-all ${
                                editMode
                                  ? 'cursor-default border-gray-200 bg-white'
                                  : selectedProduct?.id === product.id
                                  ? 'cursor-pointer border-2 border-blue-500 bg-blue-50'
                                  : 'cursor-pointer border-gray-200 bg-white hover:bg-gray-50'
                              }`}
                            >
                              {editMode ? (
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <div
                                      {...listeners}
                                      className="cursor-grab active:cursor-grabbing touch-none flex-shrink-0"
                                    >
                                      <HolderOutlined className="text-gray-400" />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                      <FMInput
                                        value={product.name}
                                        onChange={(value) => handleProductFieldChange(product.id, 'name', value)}
                                        placeholder="품목명"
                                        maxLength={20}
                                      />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                      <FMSelect
                                        value={product.orderUnit}
                                        onChange={(value) => handleProductFieldChange(product.id, 'orderUnit', value)}
                                        options={[
                                          { value: '통', label: '통' },
                                          { value: '박스', label: '박스' },
                                          { value: 'kg', label: 'kg' }
                                        ]}
                                        isSearchable={false}
                                      />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                      <FMInput
                                        type="number"
                                        value={product.unitWeight}
                                        onChange={(value) => handleProductFieldChange(product.id, 'unitWeight', parseFloat(value))}
                                        placeholder="중량"
                                        step="0.1"
                                        min="0.1"
                                      />
                                    </div>
                                  </div>
                                  <div className="flex-shrink-0">
                                    <FMSwitch
                                      checked={product.status === 'active'}
                                      onChange={(checked) => handleProductFieldChange(product.id, 'status', checked ? 'active' : 'inactive')}
                                      onLabel="활성"
                                      offLabel="비활성"
                                      size="small"
                                    />
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-gray-900">{product.name}</span>
                                  <span
                                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                      product.status === 'active'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-gray-100 text-gray-700'
                                    }`}
                                  >
                                    {product.status === 'active' ? '활성' : '비활성'}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {product.orderUnit} ({product.unitWeight}kg)
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </SortableItem>
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </>
            )}
          </div>
        </div>

        {/* Column 3: Origins */}
        <div>
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                원산지 ({filteredOrigins.length})
              </h2>
              {!editMode && selectedProduct && !isAddingOrigin && (
                <FMButton variant="green" onClick={handleAddOrigin}>
                  + 원산지 추가
                </FMButton>
              )}
            </div>

            {!selectedProduct ? (
              <div className="py-20 text-center text-gray-400">
                <span>왼쪽에서 품목을 선택해주세요.</span>
              </div>
            ) : (
              <>
                {/* Add Origin Form */}
                {isAddingOrigin && (
                  <div className="mb-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <label className="flex w-full items-start gap-2">
                      <span className="shrink-0 pt-2" style={{ width: '25%' }}>
                        <span className="block text-left text-sm font-medium text-gray-600">
                          원산지명 <span className="text-red-500">*</span>
                        </span>
                      </span>
                      <span style={{ width: '75%' }}>
                        <FMInput
                          value={newOriginData.name}
                          onChange={(value) => setNewOriginData({ ...newOriginData, name: value })}
                          placeholder="예: 완도"
                          maxLength={20}
                        />
                      </span>
                    </label>
                    <div className="mt-3 flex justify-end gap-2">
                      <FMButton variant="secondary" onClick={handleCancelOrigin}>
                        취소
                      </FMButton>
                      <FMButton variant="primary" onClick={handleSaveOrigin}>
                        저장
                      </FMButton>
                    </div>
                  </div>
                )}

                {/* Origin List */}
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEndOrigin}
                >
                  <SortableContext
                    items={filteredOrigins.map(o => o.id)}
                    strategy={verticalListSortingStrategy}
                    disabled={!editMode}
                  >
                    <div className="space-y-2" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                      {filteredOrigins.length === 0 ? (
                        <div className="py-12 text-center text-gray-400">
                          <span>등록된 원산지가 없습니다.</span>
                        </div>
                      ) : (
                        filteredOrigins.map((origin) => (
                          <SortableItem key={origin.id} id={origin.id} disabled={!editMode}>
                            {(listeners) => (
                              <div
                                className={`rounded-lg border border-gray-200 p-3 ${
                                  origin.status === 'active' ? 'bg-white' : 'bg-gray-50'
                                }`}
                              >
                                {editMode ? (
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                      <div
                                        {...listeners}
                                        className="cursor-grab active:cursor-grabbing touch-none flex-shrink-0"
                                      >
                                        <HolderOutlined className="text-gray-400" />
                                      </div>
                                      <div style={{ flex: 1, minWidth: 0 }}>
                                        <FMInput
                                          value={origin.name}
                                          onChange={(value) => handleOriginFieldChange(origin.id, 'name', value)}
                                          placeholder="원산지명"
                                          maxLength={20}
                                        />
                                      </div>
                                    </div>
                                    <div className="flex-shrink-0">
                                      <FMSwitch
                                        checked={origin.status === 'active'}
                                        onChange={(checked) => handleOriginFieldChange(origin.id, 'status', checked ? 'active' : 'inactive')}
                                        onLabel="활성"
                                        offLabel="비활성"
                                        size="small"
                                      />
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-900">{origin.name}</span>
                                    <span
                                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                        origin.status === 'active'
                                          ? 'bg-green-100 text-green-700'
                                          : 'bg-gray-100 text-gray-700'
                                      }`}
                                    >
                                      {origin.status === 'active' ? '활성' : '비활성'}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                          </SortableItem>
                        ))
                      )}
                    </div>
                  </SortableContext>
                </DndContext>
              </>
            )}
          </div>
        </div>

        {/* Column 4: Specifications */}
        <div>
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                규격 ({filteredSpecs.length})
              </h2>
              {!editMode && selectedProduct && !isAddingSpec && (
                <FMButton variant="green" onClick={handleAddSpec}>
                  + 규격 추가
                </FMButton>
              )}
            </div>

            {!selectedProduct ? (
              <div className="py-20 text-center text-gray-400">
                <span>왼쪽에서 품목을 선택해주세요.</span>
              </div>
            ) : (
              <>
                {/* Add Spec Form */}
                {isAddingSpec && (
                  <div className="mb-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <label className="flex w-full items-start gap-2">
                      <span className="shrink-0 pt-2" style={{ width: '20%' }}>
                        <span className="block text-left text-sm font-medium text-gray-600">
                          규격명 <span className="text-red-500">*</span>
                        </span>
                      </span>
                      <span style={{ width: '80%' }}>
                        <FMInput
                          value={newSpecData.name}
                          onChange={(value) => setNewSpecData({ ...newSpecData, name: value })}
                          placeholder="예: 1.2kg"
                          maxLength={20}
                        />
                      </span>
                    </label>
                    <div className="mt-3 flex justify-end gap-2">
                      <FMButton variant="secondary" onClick={handleCancelSpec}>
                        취소
                      </FMButton>
                      <FMButton variant="primary" onClick={handleSaveSpec}>
                        저장
                      </FMButton>
                    </div>
                  </div>
                )}

                {/* Spec List */}
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEndSpec}
                >
                  <SortableContext
                    items={filteredSpecs.map(s => s.id)}
                    strategy={verticalListSortingStrategy}
                    disabled={!editMode}
                  >
                    <div className="space-y-2" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                      {filteredSpecs.length === 0 ? (
                        <div className="py-12 text-center text-gray-400">
                          <span>등록된 규격이 없습니다.</span>
                        </div>
                      ) : (
                        filteredSpecs.map((spec) => (
                          <SortableItem key={spec.id} id={spec.id} disabled={!editMode}>
                            {(listeners) => (
                              <div
                                className={`rounded-lg border border-gray-200 p-3 ${
                                  spec.status === 'active' ? 'bg-white' : 'bg-gray-50'
                                }`}
                              >
                                {editMode ? (
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                      <div
                                        {...listeners}
                                        className="cursor-grab active:cursor-grabbing touch-none flex-shrink-0"
                                      >
                                        <HolderOutlined className="text-gray-400" />
                                      </div>
                                      <div style={{ flex: 1, minWidth: 0 }}>
                                        <FMInput
                                          value={spec.name}
                                          onChange={(value) => handleSpecFieldChange(spec.id, 'name', value)}
                                          placeholder="규격명"
                                          maxLength={20}
                                        />
                                      </div>
                                    </div>
                                    <div className="flex-shrink-0">
                                      <FMSwitch
                                        checked={spec.status === 'active'}
                                        onChange={(checked) => handleSpecFieldChange(spec.id, 'status', checked ? 'active' : 'inactive')}
                                        onLabel="활성"
                                        offLabel="비활성"
                                        size="small"
                                      />
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-900">{spec.name}</span>
                                    <span
                                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                        spec.status === 'active'
                                          ? 'bg-green-100 text-green-700'
                                          : 'bg-gray-100 text-gray-700'
                                      }`}
                                    >
                                      {spec.status === 'active' ? '활성' : '비활성'}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                          </SortableItem>
                        ))
                      )}
                    </div>
                  </SortableContext>
                </DndContext>
              </>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

export default ProductManagement;
