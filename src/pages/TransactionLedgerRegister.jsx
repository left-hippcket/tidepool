import React, { useState, useEffect } from 'react';
import { useNavigate, unstable_useBlocker as useBlocker } from 'react-router-dom';
import {
  Card,
  Button,
  Space,
  Form,
  AutoComplete,
  DatePicker,
  InputNumber,
  Input,
  Checkbox,
  Select,
  message,
  Modal,
  Typography,
} from 'antd';
import {
  ArrowLeftOutlined,
  PlusOutlined,
  CopyOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { products as productsData, origins as originsData, specifications } from '../data/mockData';

const { Text } = Typography;

const TransactionLedgerRegister = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [rows, setRows] = useState([{ id: 1 }]);
  const [buyerOptions, setBuyerOptions] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [sellerOptions, setSellerOptions] = useState([]);
  const [driverOptions, setDriverOptions] = useState([]);
  const [, forceUpdate] = useState({});

  // 네비게이션 방지
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) => {
      try {
        return form && form.isFieldsTouched() &&
          currentLocation.pathname !== nextLocation.pathname;
      } catch {
        return false;
      }
    }
  );

  // beforeunload 이벤트 (브라우저 새로고침, 탭 닫기)
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (form.isFieldsTouched()) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [form]);

  // blocker 상태 감지 및 모달 표시
  useEffect(() => {
    if (blocker.state === 'blocked') {
      Modal.confirm({
        title: '입력한 내용이 저장되지 않습니다. 페이지를 떠나시겠습니까?',
        content: '이 페이지를 떠나면 입력한 모든 데이터가 손실됩니다.',
        okText: '떠나기',
        cancelText: '머무르기',
        onOk: () => {
          blocker.proceed();
        },
        onCancel: () => {
          blocker.reset();
        }
      });
    }
  }, [blocker]);

  // 바이어 데이터 (mockData에서 가져오기 - 추후 API 연동)
  const buyers = [
    { name: '박노량', group: '노량진상회', region: '서울', arrivalPricePolicy: 900 },
    { name: '박가락', group: '가락시장상회', region: '서울', arrivalPricePolicy: 800 },
    { name: '김노량', group: '노량진상회', region: '서울', arrivalPricePolicy: 900 },
    { name: '이대박', group: '대박수산그룹', region: '부산', arrivalPricePolicy: 900 },
  ];

  // mockData에서 가져온 품목 데이터를 컴포넌트에서 사용할 형식으로 변환
  const products = productsData
    .filter(p => p.status === 'active')
    .map(p => ({
      name: p.name,
      category: p.categoryName,
      unit: p.orderUnit,
      weightPerUnit: p.unitWeight
    }));

  // 원산지 데이터를 품목별로 그룹화
  const getOriginsByProduct = (productName) => {
    const product = productsData.find(p => p.name === productName);
    if (!product) return [];

    return originsData
      .filter(o => o.productId === product.id && o.status === 'active')
      .map(o => o.name);
  };

  // 규격 데이터를 품목별로 그룹화
  const getSpecsByProduct = (productName) => {
    const product = productsData.find(p => p.name === productName);
    if (!product) return [];

    return specifications
      .filter(s => s.productId === product.id && s.status === 'active')
      .map(s => s.name);
  };

  // 셀러 데이터
  const sellers = [
    { name: '김완도', group: '완도수산그룹', commissionRate: 1.0 },
    { name: '김통영', group: '통영활어그룹', commissionRate: 0.8 },
    { name: '김여수', group: '여수수산그룹', commissionRate: 1.2 },
    { name: '완도수산', group: '완도수산그룹', commissionRate: 1.0 },
    { name: '제주수산', group: '제주수산그룹', commissionRate: 0.5 },
  ];

  // 드라이버 데이터 (taxType: 'taxable'(과세) or 'tax-free'(면세))
  const drivers = [
    { name: '김기사', taxType: 'taxable' },
    { name: '김운전', taxType: 'taxable' },
    { name: '김배달', taxType: 'tax-free' },
    { name: '이기사', taxType: 'taxable' },
    { name: '박기사', taxType: 'tax-free' },
  ];

  // 표준가격 데이터 (넙치만)
  const standardPrices = {
    '넙치-완도-1.0kg': 13500,
    '넙치-완도-1.1kg': 14000,
    '넙치-완도-1.2kg': 15000,
    '넙치-완도-1.3kg(특대)': 16000,
    '넙치-완도-1.4kg': 15200,
    '넙치-완도-1.5kg': 15000,
    '넙치-완도-1.6kg': 15500,
    '넙치-완도-1.7kg': 16000,
    '넙치-완도-1.8kg': 16500,
    '넙치-완도-1.9kg': 17000,
    '넙치-완도-2.0kg': 17500,
    '넙치-완도(거문도)-1.2kg': 15500,
    '넙치-통영-1.2kg': 14500,
    '넙치-여수-1.2kg': 14800,
    '넙치-제주-1.2kg': 15200,
  };

  // 바이어 검색
  const handleBuyerSearch = (value, rowId) => {
    if (!value) {
      setBuyerOptions([]);
      return;
    }
    const filtered = buyers
      .filter(buyer => buyer.name.includes(value))
      .map(buyer => ({ value: buyer.name, label: buyer.name }));
    setBuyerOptions(filtered);
  };

  // 바이어 선택
  const handleBuyerSelect = (value, rowId) => {
    const buyer = buyers.find(b => b.name === value);
    if (buyer) {
      form.setFieldValue([`buyer_${rowId}`, 'group'], buyer.group);
      form.setFieldValue([`buyer_${rowId}`, 'region'], buyer.region);
      form.setFieldValue([`buyer_${rowId}`, 'arrivalPricePolicy'], buyer.arrivalPricePolicy);
    }
  };

  // 품목 검색
  const handleProductSearch = (value, rowId) => {
    if (!value) {
      setProductOptions([]);
      return;
    }
    const filtered = products
      .filter(product => product.name.includes(value))
      .map(product => ({ value: product.name, label: product.name }));
    setProductOptions(filtered);
  };

  // 품목 선택
  const handleProductSelect = (value, rowId) => {
    const product = products.find(p => p.name === value);
    if (product) {
      // 납품일 자동 입력
      const deliveryDate = product.category === '누운고기'
        ? dayjs().add(1, 'day')
        : dayjs();
      form.setFieldValue([`row_${rowId}`, 'deliveryDate'], deliveryDate);

      // 품목 정보 저장
      form.setFieldValue([`product_${rowId}`, 'category'], product.category);
      form.setFieldValue([`product_${rowId}`, 'unit'], product.unit);
      form.setFieldValue([`product_${rowId}`, 'weightPerUnit'], product.weightPerUnit);

      // 운송단가 자동 입력
      const shippingPrice = product.category === '누운고기' ? 150000 :
                            product.category === '뜬고기' ? 120000 : 0;
      form.setFieldValue([`row_${rowId}`, 'shippingPrice'], shippingPrice);

      // 원산지, 규격 초기화
      form.setFieldValue([`row_${rowId}`, 'origin'], undefined);
      form.setFieldValue([`row_${rowId}`, 'spec'], undefined);
      form.setFieldValue([`row_${rowId}`, 'loadingPrice'], undefined);
      form.setFieldValue([`row_${rowId}`, 'arrivalPrice'], undefined);

      // 넙치가 아닌 경우 알파수익반영 필드만 초기화
      if (product.name !== '넙치') {
        form.setFieldValue([`row_${rowId}`, 'alphaProfitTarget'], undefined);
      }
    }
  };

  // 주문수량 변경
  const handleQuantityChange = (value, rowId) => {
    const product = form.getFieldValue([`row_${rowId}`, 'product']);
    const productData = products.find(p => p.name === product);

    if (productData && value) {
      // 주문중량 = 주문수량 × 주문단위당중량
      // 넙치: 2통 × 250kg = 500kg
      const weight = value * productData.weightPerUnit;
      form.setFieldValue([`row_${rowId}`, 'weight'], weight);
    }
  };

  // 셀러 검색
  const handleSellerSearch = (value, rowId) => {
    if (!value) {
      setSellerOptions([]);
      return;
    }
    const filtered = sellers
      .filter(seller => seller.name.includes(value))
      .map(seller => ({ value: seller.name, label: seller.name }));
    setSellerOptions(filtered);
  };

  // 셀러 선택
  const handleSellerSelect = (value, rowId) => {
    const seller = sellers.find(s => s.name === value);
    if (seller) {
      form.setFieldValue([`seller_${rowId}`, 'group'], seller.group);
      form.setFieldValue([`row_${rowId}`, 'commissionRate'], seller.commissionRate);
    }
  };

  // 원산지/규격 선택 후 상차단가 자동 입력 (넙치만)
  const handleOriginOrSpecChange = (rowId) => {
    const product = form.getFieldValue([`row_${rowId}`, 'product']);
    const origin = form.getFieldValue([`row_${rowId}`, 'origin']);
    const spec = form.getFieldValue([`row_${rowId}`, 'spec']);

    if (product === '넙치' && origin && spec) {
      const key = `${product}-${origin}-${spec}`;
      const standardPrice = standardPrices[key];
      if (standardPrice) {
        form.setFieldValue([`row_${rowId}`, 'loadingPrice'], standardPrice);
        // 상차단가가 설정되면 도착단가도 자동 계산
        handleLoadingPriceChange(standardPrice, rowId);
      }
    }

    // 주문중량 재계산
    const quantity = form.getFieldValue([`row_${rowId}`, 'quantity']);
    if (quantity) {
      handleQuantityChange(quantity, rowId);
    }
  };

  // 상차단가 변경 시 도착단가 자동 계산 (넙치만)
  const handleLoadingPriceChange = (value, rowId) => {
    const product = form.getFieldValue([`row_${rowId}`, 'product']);
    const buyerName = form.getFieldValue([`row_${rowId}`, 'buyer']);

    if (product === '넙치' && buyerName && value) {
      const buyer = buyers.find(b => b.name === buyerName);
      if (buyer && buyer.arrivalPricePolicy) {
        const arrivalPrice = value + buyer.arrivalPricePolicy;
        form.setFieldValue([`row_${rowId}`, 'arrivalPrice'], arrivalPrice);
      }
    }
  };

  // 드라이버 검색
  const handleDriverSearch = (value, rowId) => {
    if (!value) {
      setDriverOptions([]);
      return;
    }
    const filtered = drivers
      .filter(driver => driver.name.includes(value))
      .map(driver => ({ value: driver.name, label: driver.name }));
    setDriverOptions(filtered);
  };

  // 드라이버 선택
  const handleDriverSelect = (value, rowId) => {
    const driver = drivers.find(d => d.name === value);
    if (driver) {
      form.setFieldValue([`driver_${rowId}`, 'taxType'], driver.taxType);
    }
  };

  // 빈 행 추가
  const handleAddEmptyRow = (currentRowId) => {
    if (rows.length >= 10) {
      message.warning('최대 10개 행까지 추가할 수 있습니다.');
      return;
    }
    const newRowId = Math.max(...rows.map(r => r.id)) + 1;
    const currentIndex = rows.findIndex(r => r.id === currentRowId);
    const newRows = [
      ...rows.slice(0, currentIndex + 1),
      { id: newRowId },
      ...rows.slice(currentIndex + 1)
    ];
    setRows(newRows);
  };

  // 행 복사 추가
  const handleCopyRow = (sourceRowId) => {
    if (rows.length >= 10) {
      message.warning('최대 10개 행까지 추가할 수 있습니다.');
      return;
    }

    const newRowId = Math.max(...rows.map(r => r.id)) + 1;
    const currentIndex = rows.findIndex(r => r.id === sourceRowId);

    // 현재 행의 모든 값 복사
    const sourceValues = form.getFieldValue([`row_${sourceRowId}`]);
    const sourceBuyerValues = form.getFieldValue([`buyer_${sourceRowId}`]);
    const sourceSellerValues = form.getFieldValue([`seller_${sourceRowId}`]);
    const sourceProductValues = form.getFieldValue([`product_${sourceRowId}`]);

    const newRows = [
      ...rows.slice(0, currentIndex + 1),
      { id: newRowId },
      ...rows.slice(currentIndex + 1)
    ];
    setRows(newRows);

    // 다음 렌더링 사이클에서 값 설정
    setTimeout(() => {
      if (sourceValues) {
        form.setFieldValue([`row_${newRowId}`], { ...sourceValues });
      }
      if (sourceBuyerValues) {
        form.setFieldValue([`buyer_${newRowId}`], { ...sourceBuyerValues });
      }
      if (sourceSellerValues) {
        form.setFieldValue([`seller_${newRowId}`], { ...sourceSellerValues });
      }
      if (sourceProductValues) {
        form.setFieldValue([`product_${newRowId}`], { ...sourceProductValues });
      }
    }, 0);
  };

  // 행 삭제
  const handleDeleteRow = (rowId) => {
    if (rows.length === 1) {
      message.warning('최소 1개 행은 유지해야 합니다.');
      return;
    }

    Modal.confirm({
      title: '이 행을 삭제하시겠습니까?',
      onOk: () => {
        setRows(rows.filter(r => r.id !== rowId));
        // Form 값도 제거
        form.setFieldValue([`row_${rowId}`], undefined);
        form.setFieldValue([`buyer_${rowId}`], undefined);
        form.setFieldValue([`seller_${rowId}`], undefined);
        form.setFieldValue([`product_${rowId}`], undefined);
      }
    });
  };

  // 거래손익 계산
  // 거래손익 = (도착단가*주문중량)-(상차단가*주문중량)-(통당운임단가*주문수량*과세여부배수)-(회계처리조정액)
  const calculateProfit = (rowId) => {
    const quantity = form.getFieldValue([`row_${rowId}`, 'quantity']) || 0;
    const weight = form.getFieldValue([`row_${rowId}`, 'weight']) || 0;
    const loadingPrice = form.getFieldValue([`row_${rowId}`, 'loadingPrice']) || 0;
    const arrivalPrice = form.getFieldValue([`row_${rowId}`, 'arrivalPrice']) || 0;
    const includeShipping = form.getFieldValue([`row_${rowId}`, 'includeShipping']) || false;
    const shippingPrice = form.getFieldValue([`row_${rowId}`, 'shippingPrice']) || 0;
    const driverTaxType = form.getFieldValue([`driver_${rowId}`, 'taxType']);

    // 매출액 = 도착단가 * 주문중량
    const revenue = arrivalPrice * weight;

    // 매입액 = 상차단가 * 주문중량
    const cost = loadingPrice * weight;

    // 운송비 = 통당운임단가 * 주문수량 * 과세여부배수(과세:1.1, 면세:1.0)
    let shippingCost = 0;
    if (includeShipping) {
      const taxMultiplier = driverTaxType === 'taxable' ? 1.1 : 1.0;
      shippingCost = shippingPrice * quantity * taxMultiplier;
    }

    // 회계처리조정액 (추후 개발 예정, 현재는 0)
    const adjustmentAmount = 0;

    // 거래손익 = 매출액 - 매입액 - 운송비 - 회계처리조정액
    const profit = revenue - cost - shippingCost - adjustmentAmount;

    return profit;
  };

  // 등록 처리
  const handleSubmit = async () => {
    try {
      await form.validateFields();

      // 거래손익 검증
      for (const row of rows) {
        const profit = calculateProfit(row.id);
        const memo = form.getFieldValue([`row_${row.id}`, 'memo']);

        if (profit < 0 && !memo) {
          const rowIndex = rows.indexOf(row) + 1;
          message.error(
            `${rowIndex}번째 행: 거래손익이 ${profit.toLocaleString()}원으로 마이너스입니다. 거래메모에 사유를 입력해주세요.`
          );
          // 해당 행으로 스크롤
          document.getElementById(`row-${row.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          return;
        }
      }

      // 등록 처리 (실제로는 API 호출)
      message.success(
        rows.length === 1
          ? '거래가 등록되었습니다.'
          : `${rows.length}건의 거래가 등록되었습니다.`
      );

      // 등록 성공 후 form 리셋하여 blocker 우회
      form.resetFields();

      // 장부 조회 페이지로 이동
      navigate('/transaction-ledger');
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  // 취소
  const handleCancel = () => {
    const hasValues = form.isFieldsTouched();

    if (hasValues) {
      Modal.confirm({
        title: '입력한 내용이 저장되지 않습니다. 취소하시겠습니까?',
        onOk: () => {
          navigate('/transaction-ledger');
        }
      });
    } else {
      navigate('/transaction-ledger');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={handleCancel}>
          목록으로
        </Button>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>장부 등록</h2>
      </div>

      <Card>
        <Form form={form} layout="vertical">
          <div style={{ overflowX: 'auto' }}>
            {rows.map((row, index) => (
              <div
                key={row.id}
                id={`row-${row.id}`}
                style={{
                  display: 'flex',
                  gap: 8,
                  marginBottom: 16,
                  paddingBottom: 16,
                  borderBottom: index < rows.length - 1 ? '1px solid #f0f0f0' : 'none'
                }}
              >
                {/* 바이어명 */}
                <Form.Item
                  name={[`row_${row.id}`, 'buyer']}
                  label={index === 0 ? '바이어명' : ''}
                  rules={[{ required: true, message: '바이어를 선택해주세요.' }]}
                  style={{ minWidth: 150 }}
                >
                  <AutoComplete
                    options={buyerOptions}
                    onSearch={(value) => handleBuyerSearch(value, row.id)}
                    onSelect={(value) => handleBuyerSelect(value, row.id)}
                    placeholder="바이어명"
                  />
                </Form.Item>

                {/* 품목 */}
                <Form.Item
                  name={[`row_${row.id}`, 'product']}
                  label={index === 0 ? '품목' : ''}
                  rules={[{ required: true, message: '품목을 선택해주세요.' }]}
                  style={{ minWidth: 120 }}
                  trigger="onChange"
                  getValueFromEvent={(value) => {
                    // 값이 변경될 때마다 handleProductSelect 호출
                    if (value) {
                      setTimeout(() => handleProductSelect(value, row.id), 0);
                    }
                    return value;
                  }}
                >
                  <AutoComplete
                    options={productOptions}
                    onSearch={(value) => handleProductSearch(value, row.id)}
                    placeholder="품목"
                  />
                </Form.Item>

                {/* 납품일 */}
                <Form.Item
                  name={[`row_${row.id}`, 'deliveryDate']}
                  label={index === 0 ? '납품일' : ''}
                  rules={[
                    { required: true, message: '납품일을 선택해주세요.' },
                    {
                      validator: (_, value) => {
                        if (value && value.isBefore(dayjs(), 'day')) {
                          return Promise.reject('납품일은 주문일(오늘) 이후여야 합니다.');
                        }
                        return Promise.resolve();
                      }
                    }
                  ]}
                  style={{ minWidth: 140 }}
                >
                  <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
                </Form.Item>

                {/* 원산지 */}
                <Form.Item noStyle shouldUpdate={(prev, curr) => prev[`row_${row.id}`]?.product !== curr[`row_${row.id}`]?.product}>
                  {() => {
                    const currentProduct = form.getFieldValue([`row_${row.id}`, 'product']);
                    const originOptions = currentProduct ? getOriginsByProduct(currentProduct).map(o => ({ value: o, label: o })) : [];

                    return (
                      <Form.Item
                        name={[`row_${row.id}`, 'origin']}
                        label={index === 0 ? '원산지' : ''}
                        rules={[{ required: true, message: '원산지를 선택해주세요.' }]}
                        style={{ minWidth: 120 }}
                      >
                        <AutoComplete
                          options={originOptions}
                          onSelect={() => handleOriginOrSpecChange(row.id)}
                          placeholder="원산지"
                          disabled={!currentProduct}
                        />
                      </Form.Item>
                    );
                  }}
                </Form.Item>

                {/* 규격 */}
                <Form.Item noStyle shouldUpdate={(prev, curr) => prev[`row_${row.id}`]?.product !== curr[`row_${row.id}`]?.product}>
                  {() => {
                    const currentProduct = form.getFieldValue([`row_${row.id}`, 'product']);
                    const specOptions = currentProduct ? getSpecsByProduct(currentProduct).map(s => ({ value: s, label: s })) : [];

                    return (
                      <Form.Item
                        name={[`row_${row.id}`, 'spec']}
                        label={index === 0 ? '규격' : ''}
                        rules={[{ required: true, message: '규격을 선택해주세요.' }]}
                        style={{ minWidth: 120 }}
                      >
                        <AutoComplete
                          options={specOptions}
                          onSelect={() => handleOriginOrSpecChange(row.id)}
                          placeholder="규격"
                          disabled={!currentProduct}
                        />
                      </Form.Item>
                    );
                  }}
                </Form.Item>

                {/* 주문수량 */}
                <Form.Item
                  name={[`row_${row.id}`, 'quantity']}
                  label={index === 0 ? '주문수량' : ''}
                  rules={[
                    { required: true, message: '주문수량을 입력해주세요.' },
                    { type: 'number', min: 0.01, message: '주문수량은 0보다 커야 합니다.' }
                  ]}
                  style={{ minWidth: 120 }}
                >
                  <InputNumber
                    min={0}
                    style={{ width: '100%' }}
                    placeholder="수량"
                    addonAfter={form.getFieldValue([`product_${row.id}`, 'unit']) || ''}
                    onChange={(value) => handleQuantityChange(value, row.id)}
                  />
                </Form.Item>

                {/* 주문중량 */}
                <Form.Item
                  name={[`row_${row.id}`, 'weight']}
                  label={index === 0 ? '주문중량' : ''}
                  style={{ minWidth: 120 }}
                >
                  <InputNumber
                    min={0}
                    style={{ width: '100%' }}
                    placeholder="중량"
                    addonAfter="kg"
                  />
                </Form.Item>

                {/* 셀러명 */}
                <Form.Item
                  name={[`row_${row.id}`, 'seller']}
                  label={index === 0 ? '셀러명' : ''}
                  rules={[{ required: true, message: '셀러를 선택해주세요.' }]}
                  style={{ minWidth: 120 }}
                >
                  <AutoComplete
                    options={sellerOptions}
                    onSearch={(value) => handleSellerSearch(value, row.id)}
                    onSelect={(value) => handleSellerSelect(value, row.id)}
                    placeholder="셀러명"
                  />
                </Form.Item>

                {/* 상차단가 */}
                <Form.Item
                  name={[`row_${row.id}`, 'loadingPrice']}
                  label={index === 0 ? '상차단가' : ''}
                  rules={[
                    { required: true, message: '상차단가를 입력해주세요.' },
                    { type: 'number', min: 0.01, message: '상차단가는 0보다 커야 합니다.' }
                  ]}
                  style={{ minWidth: 130 }}
                >
                  <InputNumber
                    min={0}
                    style={{ width: '100%' }}
                    placeholder="상차단가"
                    addonAfter="원"
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/,/g, '')}
                    onChange={(value) => handleLoadingPriceChange(value, row.id)}
                  />
                </Form.Item>

                {/* 도착단가 */}
                <Form.Item
                  name={[`row_${row.id}`, 'arrivalPrice']}
                  label={index === 0 ? '도착단가' : ''}
                  rules={[
                    { required: true, message: '도착단가를 입력해주세요.' },
                    { type: 'number', min: 0.01, message: '도착단가는 0보다 커야 합니다.' }
                  ]}
                  style={{ minWidth: 130 }}
                >
                  <InputNumber
                    min={0}
                    style={{ width: '100%' }}
                    placeholder="도착단가"
                    addonAfter="원"
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/,/g, '')}
                  />
                </Form.Item>

                {/* 알파수익단가 */}
                <Form.Item noStyle shouldUpdate={(prev, curr) =>
                  prev[`row_${row.id}`]?.product !== curr[`row_${row.id}`]?.product ||
                  prev[`row_${row.id}`]?.loadingPrice !== curr[`row_${row.id}`]?.loadingPrice ||
                  prev[`row_${row.id}`]?.arrivalPrice !== curr[`row_${row.id}`]?.arrivalPrice ||
                  prev[`buyer_${row.id}`]?.arrivalPricePolicy !== curr[`buyer_${row.id}`]?.arrivalPricePolicy
                }>
                  {() => {
                    const product = form.getFieldValue([`row_${row.id}`, 'product']);
                    const loadingPrice = form.getFieldValue([`row_${row.id}`, 'loadingPrice']) || 0;
                    const arrivalPrice = form.getFieldValue([`row_${row.id}`, 'arrivalPrice']) || 0;
                    const arrivalPricePolicy = form.getFieldValue([`buyer_${row.id}`, 'arrivalPricePolicy']) || 0;

                    const alphaProfit = product === '넙치'
                      ? arrivalPrice - loadingPrice - arrivalPricePolicy
                      : null;

                    return (
                      <Form.Item
                        label={index === 0 ? '알파수익단가' : ''}
                        style={{ minWidth: 130 }}
                      >
                        <InputNumber
                          disabled={product !== '넙치'}
                          value={alphaProfit}
                          style={{
                            width: '100%',
                            color: alphaProfit && alphaProfit < 0 ? '#ff4d4f' : undefined
                          }}
                          placeholder={product === '넙치' ? '자동계산' : '-'}
                          addonAfter="원"
                          formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          parser={value => value.replace(/,/g, '')}
                          readOnly
                        />
                      </Form.Item>
                    );
                  }}
                </Form.Item>

                {/* 알파수익반영 */}
                <Form.Item noStyle shouldUpdate={(prev, curr) =>
                  prev[`row_${row.id}`]?.product !== curr[`row_${row.id}`]?.product ||
                  prev[`row_${row.id}`]?.loadingPrice !== curr[`row_${row.id}`]?.loadingPrice ||
                  prev[`row_${row.id}`]?.arrivalPrice !== curr[`row_${row.id}`]?.arrivalPrice ||
                  prev[`buyer_${row.id}`]?.arrivalPricePolicy !== curr[`buyer_${row.id}`]?.arrivalPricePolicy
                }>
                  {() => {
                    const product = form.getFieldValue([`row_${row.id}`, 'product']);
                    const loadingPrice = form.getFieldValue([`row_${row.id}`, 'loadingPrice']) || 0;
                    const arrivalPrice = form.getFieldValue([`row_${row.id}`, 'arrivalPrice']) || 0;
                    const arrivalPricePolicy = form.getFieldValue([`buyer_${row.id}`, 'arrivalPricePolicy']) || 0;

                    // alphaProfit 재계산
                    const alphaProfit = product === '넙치'
                      ? arrivalPrice - loadingPrice - arrivalPricePolicy
                      : null;

                    const isEnabled = product === '넙치' && alphaProfit !== 0 && alphaProfit !== null;

                    return (
                      <Form.Item
                        name={[`row_${row.id}`, 'alphaProfitTarget']}
                        label={index === 0 ? '알파수익반영' : ''}
                        style={{ minWidth: 120 }}
                      >
                        <Select
                          disabled={!isEnabled}
                          placeholder="선택"
                          options={[
                            { value: 'buyer', label: '바이어' },
                            { value: 'seller', label: '셀러' }
                          ]}
                        />
                      </Form.Item>
                    );
                  }}
                </Form.Item>

                {/* 상차수수료율 */}
                <Form.Item
                  name={[`row_${row.id}`, 'commissionRate']}
                  label={index === 0 ? '상차수수료율' : ''}
                  rules={[
                    { type: 'number', min: 0, max: 100, message: '상차수수료율은 0~100 사이여야 합니다.' }
                  ]}
                  style={{ minWidth: 130 }}
                >
                  <InputNumber
                    min={0}
                    max={100}
                    style={{ width: '100%' }}
                    placeholder="수수료율"
                    addonAfter="%"
                  />
                </Form.Item>

                {/* 드라이버명 */}
                <Form.Item
                  name={[`row_${row.id}`, 'driver']}
                  label={index === 0 ? '드라이버명' : ''}
                  style={{ minWidth: 120 }}
                  trigger="onChange"
                  getValueFromEvent={(value) => {
                    if (value) {
                      setTimeout(() => handleDriverSelect(value, row.id), 0);
                    }
                    return value;
                  }}
                >
                  <AutoComplete
                    options={driverOptions}
                    onSearch={(value) => handleDriverSearch(value, row.id)}
                    placeholder="드라이버명"
                  />
                </Form.Item>

                {/* 운송비포함여부 */}
                <Form.Item
                  name={[`row_${row.id}`, 'includeShipping']}
                  label={index === 0 ? '운송비포함' : ''}
                  valuePropName="checked"
                  style={{ minWidth: 100 }}
                >
                  <Checkbox>포함</Checkbox>
                </Form.Item>

                {/* 운송단가 */}
                <Form.Item
                  name={[`row_${row.id}`, 'shippingPrice']}
                  label={index === 0 ? '운송단가' : ''}
                  rules={[
                    {
                      validator: (_, value) => {
                        const includeShipping = form.getFieldValue([`row_${row.id}`, 'includeShipping']);
                        if (includeShipping && (!value || value <= 0)) {
                          return Promise.reject('운송단가를 입력해주세요.');
                        }
                        return Promise.resolve();
                      }
                    }
                  ]}
                  style={{ minWidth: 130 }}
                >
                  <InputNumber
                    min={0}
                    style={{ width: '100%' }}
                    placeholder="운송단가"
                    addonAfter="원"
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/,/g, '')}
                  />
                </Form.Item>

                {/* 거래메모 */}
                <Form.Item
                  name={[`row_${row.id}`, 'memo']}
                  label={index === 0 ? '거래메모' : ''}
                  rules={[
                    {
                      validator: (_, value) => {
                        const profit = calculateProfit(row.id);
                        if (profit < 0 && !value) {
                          return Promise.reject('거래손익이 마이너스인 경우 거래메모를 입력해주세요.');
                        }
                        return Promise.resolve();
                      }
                    }
                  ]}
                  style={{ minWidth: 200 }}
                >
                  <Input placeholder="거래메모" maxLength={500} />
                </Form.Item>

                {/* 행 관리 버튼 */}
                <div style={{ display: 'flex', gap: 4, alignItems: index === 0 ? 'flex-end' : 'center', paddingBottom: index === 0 ? 8 : 0 }}>
                  <Button
                    size="small"
                    icon={<PlusOutlined />}
                    onClick={() => handleAddEmptyRow(row.id)}
                  >
                    빈 행
                  </Button>
                  <Button
                    size="small"
                    type="primary"
                    icon={<CopyOutlined />}
                    onClick={() => handleCopyRow(row.id)}
                  >
                    복사
                  </Button>
                  {rows.length > 1 && (
                    <Button
                      size="small"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleDeleteRow(row.id)}
                    >
                      삭제
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button size="large" onClick={handleCancel}>
              취소
            </Button>
            <Button type="primary" size="large" onClick={handleSubmit}>
              등록
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default TransactionLedgerRegister;
