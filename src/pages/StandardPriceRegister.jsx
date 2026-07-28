import React, { useState, useEffect } from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { productCategories, products, origins, specifications } from '../data/mockData';
import { FMSelectSimple } from '../components/ui/FMSelectSimpleSimple';
import { FMButton } from '../components/ui/FMButton';

function StandardPriceRegister() {
  const navigate = useNavigate();
  const [allPriceData, setAllPriceData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(1); // 누운고기
  const [selectedProduct, setSelectedProduct] = useState(2); // 넙치
  const [selectedOrigin, setSelectedOrigin] = useState(null);
  const [applyDate, setApplyDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [source, setSource] = useState('피시파더');
  const [priceItems, setPriceItems] = useState([]);

  // 기존 가격 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/data/standard-price-data.json');
        if (!response.ok) {
          throw new Error('데이터 로드 실패');
        }
        const data = await response.json();
        setAllPriceData(data);
      } catch (error) {
        console.error('가격 데이터 로드 실패:', error);
        setAllPriceData([]);
      }
    };
    loadData();
  }, []);

  // 초기 로드 시 넙치-완도 자동 설정
  useEffect(() => {
    if (selectedProduct === 2 && allPriceData.length > 0) {
      const wandoOrigin = origins.find(o => o.productId === 2 && o.name === '완도' && o.status === 'active');
      if (wandoOrigin) {
        setSelectedOrigin(wandoOrigin.id);
        onOriginChange(wandoOrigin.id);
      }
    }
  }, [allPriceData]);

  const onCategoryChange = (value) => {
    setSelectedCategory(parseInt(value));
    setSelectedProduct(null);
    setSelectedOrigin(null);
    setPriceItems([]);
  };

  const onProductChange = (value) => {
    setSelectedProduct(parseInt(value));
    setSelectedOrigin(null);
    setPriceItems([]);
  };

  const onOriginChange = (originId) => {
    setSelectedOrigin(originId);
    const origin = origins.find(o => o.id === originId);

    const productSpecs = specifications.filter(s => s.productId === selectedProduct && s.status === 'active');

    const getRecentPrice = (specName) => {
      const recentRecord = allPriceData
        .filter(item =>
          item.productId === selectedProduct &&
          item.originName === origin?.name &&
          item.spec === specName
        )
        .sort((a, b) => b.applyDate.localeCompare(a.applyDate))[0];

      return recentRecord?.price;
    };

    const items = productSpecs.map(spec => ({
      specId: spec.id,
      specName: spec.name,
      price: getRecentPrice(spec.name) || '',
    }));

    setPriceItems(items);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validItems = priceItems.filter(item => item.price !== undefined && item.price !== null && item.price !== '');

    if (validItems.length === 0) {
      toast('최소 1개 이상의 규격에 가격을 입력해주세요.');
      return;
    }

    toast.success(`${validItems.length}개의 표준가격이 등록되었습니다.`);
    navigate('/standard-price');
  };

  const handlePriceChange = (index, value) => {
    const newItems = [...priceItems];
    newItems[index].price = value;
    setPriceItems(newItems);
  };

  return (
    <div>
      {/* 상단 헤더 */}
      <div className="mb-6 flex items-center gap-4">
        <FMButton
          onClick={() => navigate('/standard-price')}
          variant="secondary"
          icon={<ArrowLeftOutlined className="h-4 w-4" />}
        >
          목록으로
        </FMButton>
        <h2 className="text-2xl font-bold text-gray-900">표준가격 등록</h2>
      </div>

      {/* 등록 상품 선택 필터 */}
      <div className="mb-4 rounded-xl border border-gray-200 bg-white p-5">
        <h3 className="mb-4 text-base font-semibold text-gray-900">🔍 등록 상품 선택</h3>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-gray-700">적용일자</label>
            <input
              type="date"
              value={applyDate}
              onChange={(e) => setApplyDate(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500"
              required
            />
          </div>

          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-gray-700">가격출처</label>
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="가격출처"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500"
              required
            />
          </div>

          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-gray-700">품목분류</label>
            <FMSelectSimple
              value={selectedCategory}
              onChange={(value) => onCategoryChange(value)}
              options={productCategories.map(cat => ({ value: cat.id, label: cat.name }))}
              placeholder="품목분류"
            />
          </div>

          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-gray-700">품목</label>
            <FMSelectSimple
              value={selectedProduct || ''}
              onChange={(value) => onProductChange(value)}
              options={[
                { value: '', label: '선택' },
                ...(selectedCategory ? products.filter(p => p.categoryId === selectedCategory).map(p => ({ value: p.id, label: p.name })) : [])
              ]}
              placeholder="품목"
            />
          </div>

          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-gray-700">원산지</label>
            <FMSelectSimple
              value={selectedOrigin || ''}
              onChange={(value) => onOriginChange(parseInt(value))}
              options={[
                { value: '', label: '선택' },
                ...(selectedProduct ? origins.filter(o => o.productId === selectedProduct && o.status === 'active').map(o => ({ value: o.id, label: o.name })) : [])
              ]}
              placeholder="원산지"
            />
          </div>
        </div>
      </div>

      {/* 등록 폼 */}
      <form onSubmit={handleSubmit}>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          {selectedOrigin && (
            <div className="mb-8">
              <h3 className="mb-2 text-base font-semibold text-gray-900">규격별 가격</h3>
              <div className="mb-4 text-sm text-gray-600">
                최근 가격이 자동 입력됩니다. 수정 가능하며, 빈 칸은 업데이트되지 않습니다.
              </div>

              <div className="flex flex-col gap-2">
                {priceItems.map((item, index) => (
                  <div key={item.specId} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={item.specName}
                      disabled
                      className="w-40 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-600"
                    />
                    <div className="flex-1 flex gap-2 items-center">
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) => handlePriceChange(index, e.target.value)}
                        placeholder="가격 입력 (선택)"
                        step={500}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500"
                      />
                      <span className="text-sm text-gray-600">원</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 하단 버튼 */}
          <div className="flex flex-wrap justify-end gap-2 border-t border-gray-200 pt-6">
            <FMButton
              type="button"
              onClick={() => navigate('/standard-price')}
              variant="secondary"
            >
              취소
            </FMButton>
            <FMButton
              type="submit"
              variant="primary"
            >
              등록
            </FMButton>
          </div>
        </div>
      </form>
    </div>
  );
}

export default StandardPriceRegister;
