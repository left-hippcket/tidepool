import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Form, Input, Select, Radio, Button,
  AutoComplete, Upload, InputNumber
} from 'antd';
import {
  ArrowLeftOutlined, PlusOutlined, MinusCircleOutlined, UploadOutlined
} from '@ant-design/icons';
import { Upload as UploadIcon, Plus, Star } from 'lucide-react';
import { buyerGroups, managers, territories, regions, productCategories, products, businessRegistry } from '../data/mockData';
import { FMButton } from '../components/ui/FMButton';
import { FMInput } from '../components/ui/FMInput';
import { FMSelect } from '../components/ui/FMSelect';
import { FMTagInput } from '../components/ui/FMTagInput';
import toast from 'react-hot-toast';
import { findPartnerByBusinessNumber, validateTicker, PARTNER_TYPE_NAMES } from '../utils/tickerValidation';
import { generateGroupName, shouldUpdateGroupName } from '../utils/groupNameGenerator';
import { addNewGroup, addBusinessToGroup, getStoredGroups, getStoredDetails, updateGroup } from '../utils/dataStorage';
import { generateTicker, extractAllTickers } from '../utils/tickerGenerator';

function BuyerRegister() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form] = Form.useForm();
  const [registrationType, setRegistrationType] = useState('new'); // 'new' | 'existing'
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [selectedTerritory, setSelectedTerritory] = useState(null);
  const [availableRegions, setAvailableRegions] = useState([]);
  const [tickerReadOnly, setTickerReadOnly] = useState(false);
  const [tickerValidationStatus, setTickerValidationStatus] = useState(null);
  const [existingTickers, setExistingTickers] = useState([]);

  // 기존 ticker 목록 로드
  useEffect(() => {
    const groups = getStoredGroups('buyer');
    const details = {};
    groups.forEach(group => {
      const detail = getStoredDetails('buyer', group.id);
      if (detail) {
        details[group.id] = detail;
      }
    });
    const tickers = extractAllTickers('buyer', groups, details);
    setExistingTickers(tickers);
  }, []);

  // URL 쿼리 파라미터 처리
  useEffect(() => {
    const groupId = searchParams.get('groupId');
    const mode = searchParams.get('mode');

    if (groupId && mode === 'add') {
      setRegistrationType('existing');
      const group = buyerGroups.find(g => g.id === parseInt(groupId));
      if (group) {
        setSelectedGroup(group);
        form.setFieldsValue({ searchGroup: group.name });
      }
    }
  }, [searchParams, form]);

  // 등록 유형 변경
  const handleTypeChange = (e) => {
    setRegistrationType(e.target.value);
    form.resetFields();
    setSelectedGroup(null);
    setSelectedCategory(null);
    setAvailableProducts([]);
    setSelectedTerritory(null);
    setAvailableRegions([]);
  };

  // 기존 그룹 검색
  const handleGroupSearch = (value) => {
    const group = buyerGroups.find(g => g.name === value);
    setSelectedGroup(group);
  };

  // 주요품목분류 변경 시 주요품목 필터링
  const handleCategoryChange = (values) => {
    setSelectedCategory(values);
    let filtered = [];
    if (values && values.length > 0) {
      filtered = products.filter(p => values.includes(p.categoryName));
      setAvailableProducts(filtered);
    } else {
      setAvailableProducts([]);
    }
    // 기존 선택된 주요품목 중 현재 카테고리에 속하지 않는 것 제거
    const currentProducts = form.getFieldValue('mainProducts') || [];
    const validProducts = currentProducts.filter(productName =>
      filtered.some(p => p.name === productName)
    );
    form.setFieldsValue({ mainProducts: validProducts });

    // categoryManagers 초기화
    const currentCategoryManagers = form.getFieldValue('categoryManagers') || [];
    const newCategoryManagers = (values || []).map(category => {
      const existing = currentCategoryManagers.find(cm => cm?.category === category);
      return existing || { category, managers: [] };
    });
    form.setFieldsValue({ categoryManagers: newCategoryManagers });
  };

  // 사업권역 변경 시 상세지역 필터링
  const handleTerritoryChange = (value) => {
    setSelectedTerritory(value);
    if (value) {
      const filtered = regions
        .filter(r => r.territoryName === value && r.status === 'active')
        .sort((a, b) => a.displayOrder - b.displayOrder);
      setAvailableRegions(filtered);
    } else {
      setAvailableRegions([]);
    }
    form.setFieldsValue({ region: undefined });
  };

  // 사업자등록번호 입력 시 자동 채우기
  const handleBusinessNumberChange = (e) => {
    const value = e.target.value;

    if (/^\d{3}-\d{2}-\d{5}$/.test(value)) {
      // 1. 국세청 DB 조회
      const businessInfo = businessRegistry[value];

      if (businessInfo) {
        form.setFieldsValue({
          businessName: businessInfo.businessName,
          representative: businessInfo.representative,
          businessAddress: businessInfo.businessAddress,
        });
        toast.success('등록된 사업자 정보를 불러왔습니다.');
      }

      // 2. 자사 DB에서 기존 등록 사업자 조회
      const existingPartners = findPartnerByBusinessNumber(value);

      if (existingPartners.length > 0) {
        const partner = existingPartners[0];
        const typeNames = {
          seller: '셀러',
          buyer: '바이어',
          driver: '드라이버',
          join: '조인유통'
        };

        // 기존 사업자 발견 안내
        toast.info(
          `기존에 등록된 사업자입니다. (${typeNames[partner.type]}: ${partner.groupName || partner.name} / Ticker: ${partner.ticker})`,
          { duration: 5000 }
        );

        // Ticker 자동 채움 + 읽기 전용
        form.setFieldsValue({
          buyerId: partner.ticker,
          buyerName: form.getFieldValue('buyerName') || partner.name,
        });

        // Ticker 읽기 전용 설정
        setTickerReadOnly(true);

        // Ticker 검증 상태 설정
        setTickerValidationStatus({
          status: 'info',
          message: `기존 사업자와 동일한 ticker를 사용합니다. (${typeNames[partner.type]}: ${partner.groupName || partner.name})`
        });
      } else {
        // 신규 사업자
        setTickerReadOnly(false);
      }
    }
  };

  // 바이어명 변경 시 ticker 자동 생성
  const handleBuyerNameChange = (e) => {
    const buyerName = e.target.value;

    if (buyerName && !tickerReadOnly) {
      // ticker 자동 생성
      const generatedTicker = generateTicker(buyerName, existingTickers);

      // 생성된 ticker 자동 입력
      form.setFieldsValue({ buyerId: generatedTicker });

      // 그룹명도 자동 업데이트 (신규 생성 모드일 때)
      if (registrationType === 'new') {
        form.setFieldsValue({ groupName: buyerName });
      }

      // 검증 상태 업데이트
      setTickerValidationStatus({
        status: 'success',
        message: '✓ 자동 생성된 ticker입니다.'
      });
    }
  };

  // Ticker 입력 시 중복 검사
  const handleTickerChange = (e) => {
    const ticker = e.target.value;
    if (!ticker) {
      setTickerValidationStatus(null);
      return;
    }

    const businessNumber = form.getFieldValue('businessNumber');
    const validation = validateTicker(ticker, businessNumber);

    setTickerValidationStatus(validation);

    if (!validation.valid) {
      if (validation.error === 'TICKER_DUPLICATE_NO_BUSINESS_NUMBER') {
        toast.error('중복된 ticker입니다. 사업자등록번호를 먼저 입력해주세요.', { duration: 4000 });
      } else if (validation.error === 'TICKER_DUPLICATE_DIFFERENT_BUSINESS') {
        toast.error(validation.message, { duration: 4000 });
      }
    } else if (validation.info === 'SAME_BUSINESS') {
      toast.success(validation.message, { duration: 4000 });
    }
  };

  // 중요 평가 요소 중복 체크
  const validatePriorityFactors = (_, value) => {
    const values = form.getFieldsValue();
    const factors = [
      values.priority1,
      values.priority2,
      values.priority3,
      values.priority4,
      values.priority5,
      values.priority6,
      values.priority7
    ].filter(Boolean);

    const uniqueFactors = new Set(factors);
    if (factors.length !== uniqueFactors.size) {
      return Promise.reject(new Error('중요 평가 요소는 중복 선택할 수 없습니다.'));
    }
    return Promise.resolve();
  };

  // 저장
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Ticker 검증
      const validation = validateTicker(values.buyerId, values.businessNumber);
      if (!validation.valid) {
        toast.error(validation.message, { duration: 5000 });
        return;
      }

      // categoryManagers에서 salesPerson 자동 설정 (첫 번째 카테고리의 첫 번째 담당자)
      if (values.categoryManagers && values.categoryManagers.length > 0) {
        const firstManager = values.categoryManagers[0]?.managers?.[0];
        if (firstManager) {
          values.salesPerson = firstManager;
        }
      }

      console.log('저장할 데이터:', values);

      if (registrationType === 'new') {
        toast.success(`바이어 그룹 '${values.groupName}'이 등록되었습니다.`);
        // TODO: 상세 페이지로 이동
        navigate('/buyer');
      } else {
        // 기존 그룹에 사업자 추가 - 1→2 전환 체크
        const oldCount = selectedGroup.businessCount || 0;
        const newCount = oldCount + 1;

        if (shouldUpdateGroupName(oldCount, newCount)) {
          // 그룹명 변경 필요 (1→2 전환)
          const newGroupName = `${selectedGroup.name} 그룹`;
          toast.success(
            `그룹명이 "${selectedGroup.name}"에서 "${newGroupName}"으로 변경되었습니다.`,
            { duration: 5000 }
          );
          // TODO: 실제 백엔드 API 호출 시 그룹명 업데이트 필요
          // updateGroupName(selectedGroup.id, newGroupName);
        } else {
          toast.success(`사업자가 '${selectedGroup.name}'에 추가되었습니다.`);
        }
        navigate(`/buyer/${selectedGroup.id}`);
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const priorityOptions = [
    { value: '로스', label: '🗑️ 로스' },
    { value: '살밥', label: '🍚 살밥' },
    { value: '단가', label: '💰 단가' },
    { value: '색깔', label: '🎨 색깔' },
    { value: '평체', label: '📏 평체' },
    { value: '외관', label: '👁️ 외관' },
    { value: '기타', label: '📌 기타' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex flex-col gap-6 w-full">
      {/* 헤더 */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-start">
          <FMButton
            variant="indigo"
            icon={<ArrowLeftOutlined className="h-4 w-4" />}
            href="/buyer"
          >
            목록으로
          </FMButton>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">바이어 등록</h2>
      </div>

      {/* 등록 유형 선택 */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <Radio.Group value={registrationType} onChange={handleTypeChange}>
          <Radio value="new">신규 바이어그룹 생성</Radio>
          <Radio value="existing">기존 바이어그룹에 사업자 추가</Radio>
        </Radio.Group>
      </div>

      <Form
        form={form}
        layout="horizontal"
        labelCol={{ flex: '20%' }}
        wrapperCol={{ flex: '80%' }}
        labelAlign="left"
      >
        {/* 기존 그룹 검색 */}
        {registrationType === 'existing' && (
          <div className="rounded-xl border border-gray-200 bg-white p-6 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">바이어그룹 검색</h3>
            <Form.Item
              name="searchGroup"
              label="바이어그룹 검색"
              rules={[{ required: true, message: '바이어그룹을 선택해주세요' }]}
            >
              <FMSelect
                value={form.getFieldValue('searchGroup')}
                onChange={(value) => {
                  form.setFieldsValue({ searchGroup: value });
                  handleGroupSearch(value);
                }}
                options={buyerGroups.map(g => ({
                  value: g.name,
                  label: `${g.name} (담당자: ${g.salesPerson})`
                }))}
                placeholder="검색 & 선택"
                isSearchable={true}
              />
            </Form.Item>

            {selectedGroup && (
              <div style={{ background: "#f5f5f5", padding: 16, borderRadius: 8, border: "1px solid #d9d9d9" }}>
                <div className="space-y-2 text-sm">
                  <div><span className="font-semibold text-gray-700">바이어그룹명:</span> <span className="text-gray-900">{selectedGroup.name}</span></div>
                  <div><span className="font-semibold text-gray-700">담당영업사원:</span> <span className="text-gray-900">{selectedGroup.salesPerson}</span></div>
                  <div><span className="font-semibold text-gray-700">사업권역:</span> <span className="text-gray-900">{selectedGroup.territory}</span></div>
                  <div><span className="font-semibold text-gray-700">상세지역:</span> <span className="text-gray-900">{selectedGroup.region}</span></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 바이어그룹 기본 정보 (신규) */}
        {registrationType === 'new' && (
          <div className="rounded-xl border border-gray-200 bg-white p-6 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">바이어그룹 기본 정보</h3>

            <Form.Item
              name="groupName"
              label="바이어그룹명 (자동생성)"
            >
              <Input
                disabled
                placeholder="바이어명 입력 시 자동 생성됩니다"
                suffix={
                  <span className="text-xs text-gray-400">💡 사업자명 기반</span>
                }
              />
            </Form.Item>

            <Form.Item
              name="territory"
              label="사업권역"
              rules={[{ required: true, message: '사업권역을 선택해주세요.' }]}
            >
              <Select
                placeholder="사업권역 선택"
                onChange={handleTerritoryChange}
              >
                {territories
                  .filter(t => t.status === 'active')
                  .sort((a, b) => a.displayOrder - b.displayOrder)
                  .map(t => (
                    <Select.Option key={t.id} value={t.name}>{t.name}</Select.Option>
                  ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="region"
              label="상세지역"
              rules={[{ required: true, message: '상세지역을 선택해주세요.' }]}
            >
              <Select
                placeholder="상세지역 선택"
                disabled={!selectedTerritory}
              >
                {availableRegions.map(r => (
                  <Select.Option key={r.id} value={r.name}>{r.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="mainCategory"
              label="주요품목분류"
              rules={[{ required: true, message: '주요품목분류를 선택해주세요' }]}
            >
              <FMSelect
                value={form.getFieldValue('mainCategory') || []}
                onChange={(value) => {
                  form.setFieldsValue({ mainCategory: value });
                  handleCategoryChange(value);
                }}
                options={productCategories.map(c => ({
                  value: c.name,
                  label: c.name
                }))}
                placeholder="품목분류 선택 (복수 선택 가능)"
                isSearchable={true}
                isMulti={true}
              />
            </Form.Item>

            {/* 품목분류별 담당영업사원 */}
            {selectedCategory && selectedCategory.length > 0 && (
              <div className="mb-4">
                <div className="mb-2 text-sm font-medium text-gray-700">품목분류별 담당영업사원</div>
                {selectedCategory.map((category, index) => (
                  <Form.Item
                    key={category}
                    name={['categoryManagers', index, 'managers']}
                    label={`${category}`}
                    rules={[{ required: true, message: `${category} 담당자를 선택해주세요` }]}
                  >
                    <FMSelect
                      value={form.getFieldValue(['categoryManagers', index, 'managers']) || []}
                      onChange={(value) => {
                        const categoryManagers = form.getFieldValue('categoryManagers') || [];
                        categoryManagers[index] = {
                          category,
                          managers: value
                        };
                        form.setFieldsValue({ categoryManagers });
                      }}
                      options={managers.map(m => ({
                        value: m,
                        label: m
                      }))}
                      placeholder="담당자 선택 (복수 가능)"
                      isSearchable={true}
                      isMulti={true}
                    />
                  </Form.Item>
                ))}
              </div>
            )}

            <Form.Item
              name="mainProducts"
              label="주요품목"
            >
              <FMSelect
                value={form.getFieldValue('mainProducts') || []}
                onChange={(value) => form.setFieldsValue({ mainProducts: value })}
                options={availableProducts.map(p => ({
                  value: p.name,
                  label: p.name
                }))}
                placeholder="주요품목 선택 (선택사항)"
                isSearchable={true}
                isMulti={true}
                isDisabled={!selectedCategory || selectedCategory.length === 0}
              />
            </Form.Item>

            <Form.Item
              name="arrivalPricePolicy"
              label="넙치 도착단가 정책"
              initialValue={900}
            >
              <div className="flex flex-col gap-1">
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="예: 800"
                  addonBefore="상차단가 +"
                  addonAfter="원"
                  step={100}
                  min={0}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/,/g, '')}
                />
                <span className="text-xs text-blue-500">상차단가에 추가할 금액을 입력하세요</span>
              </div>
            </Form.Item>

            <div className="my-4 border-t border-gray-200"></div>
            <h4 className="text-base font-semibold text-gray-900 mb-4">키맨 정보</h4>
            <Form.List name="keymen" initialValue={[{}]}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field, index) => (
                    <div key={field.key} className="mb-6">
                      <div className="flex items-center gap-2 mb-4">
                        <h5 className="text-sm font-medium text-gray-700">키맨 #{index + 1}</h5>
                        {fields.length > 1 && (
                          <Button
                            type="text"
                            icon={<MinusCircleOutlined />}
                            onClick={() => remove(field.name)}
                            danger
                            size="small"
                          />
                        )}
                      </div>

                      <Form.Item
                        {...field}
                        name={[field.name, 'name']}
                        label="성명"
                        className="mb-4"
                      >
                        <Input placeholder="홍길동" maxLength={20} />
                      </Form.Item>

                      <Form.Item
                        {...field}
                        name={[field.name, 'phone']}
                        label="연락처"
                        rules={[
                          { pattern: /^010-\d{4}-\d{4}$/, message: '010-XXXX-XXXX 형식' }
                        ]}
                        className="mb-4"
                      >
                        <Input placeholder="010-1234-5678" />
                      </Form.Item>

                      <Form.Item
                        {...field}
                        name={[field.name, 'role']}
                        label="역할"
                        rules={[{ max: 20, message: '최대 20자' }]}
                        className="mb-0"
                      >
                        <Input placeholder="예: 대표, 구매담당" />
                      </Form.Item>

                      {index < fields.length - 1 && <div className="my-6 border-t border-gray-200"></div>}
                    </div>
                  ))}
                  <div className="flex justify-end">
                    <FMButton
                      variant="green"
                      icon={<Plus className="h-4 w-4" />}
                      onClick={() => add()}
                    >
                      키맨 추가하기
                    </FMButton>
                  </div>
                </>
              )}
            </Form.List>

            <div className="my-4 border-t border-gray-200"></div>
            <h4 className="text-base font-semibold text-gray-900 mb-4">거래 정보</h4>

            <Form.Item
              name="kakaoGroupName"
              label="카톡단톡방이름"
              rules={[{ max: 50, message: '최대 50자' }]}
            >
              <Input placeholder="예: [용인]대박수산 거래방" />
            </Form.Item>

            <Form.Item
              name="paymentCycle"
              label="결제주기(조건)"
              rules={[{ max: 200, message: '최대 200자' }]}
            >
              <Input.TextArea
                rows={3}
                placeholder="예: 기본 미수 2천 요구, 2천 초과분에 대해 랜덤하게 입금"
              />
            </Form.Item>

            <Form.Item
              name="complaintIntensity"
              label="컴플레인강도"
            >
              <Select placeholder="선택">
                <Select.Option value="매우강함">매우강함</Select.Option>
                <Select.Option value="강함">강함</Select.Option>
                <Select.Option value="보통">보통</Select.Option>
                <Select.Option value="약함">약함</Select.Option>
                <Select.Option value="매우약함">매우약함</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="mainSuppliers"
              label="메인공급처"
            >
              <FMTagInput
                value={form.getFieldValue('mainSuppliers') || []}
                onChange={(value) => form.setFieldsValue({ mainSuppliers: value })}
                placeholder="공급처명 입력 후 엔터키"
              />
            </Form.Item>

            <div className="my-4 border-t border-gray-200"></div>
            <h4 className="text-base font-semibold text-gray-900 mb-4">중요 평가 요소 (1-7순위)</h4>

            {[1, 2, 3, 4, 5, 6, 7].map(num => (
              <Form.Item
                key={num}
                name={`priority${num}`}
                label={`${num}순위`}
                rules={[{ validator: validatePriorityFactors }]}
              >
                <Select placeholder="선택" allowClear>
                  {priorityOptions.map(opt => (
                    <Select.Option key={opt.value} value={opt.value}>{opt.label}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            ))}
          </div>
        )}

        {/* 사업자 정보 (공통) */}
        {(registrationType === 'new' || selectedGroup) && (
          <div className="rounded-xl border border-gray-200 bg-white p-6 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">사업자 정보</h3>

            <Form.Item
              name="businessNumber"
              label="사업자등록번호"
              rules={[
                { pattern: /^\d{3}-\d{2}-\d{5}$/, message: 'XXX-XX-XXXXX 형식' }
              ]}
              extra={<span className="text-blue-500">⭐ 사업자등록번호를 먼저 입력하시면 기존 사업자 여부를 자동으로 확인합니다.</span>}
            >
              <Input placeholder="123-45-67890" onChange={handleBusinessNumberChange} />
            </Form.Item>

            <Form.Item
              name="buyerName"
              label="바이어명"
              rules={[
                { required: true, message: '바이어명을 입력해주세요' },
                { max: 20, message: '최대 20자' },
                { pattern: /^[가-힣0-9() ]+$/, message: '한글, 숫자, 괄호()만 허용' }
              ]}
            >
              <Input
                placeholder="대박집"
                onChange={handleBuyerNameChange}
              />
            </Form.Item>

            <Form.Item
              name="buyerId"
              label="Ticker (자동생성)"
              rules={[
                { required: true, message: 'Ticker를 입력해주세요' }
              ]}
              validateStatus={tickerValidationStatus?.status}
              help={tickerValidationStatus?.message}
            >
              <Input
                readOnly
                className="bg-gray-50"
                placeholder="바이어명 입력 시 자동 생성됩니다"
                maxLength={10}
                suffix={
                  <span className="text-xs text-gray-400">💡 초성 기반</span>
                }
              />
            </Form.Item>

            <Form.Item
              name="businessName"
              label="사업자등록상호"
              rules={[
                { max: 50, message: '최대 50자' }
              ]}
            >
              <Input placeholder="(주)대박수산" />
            </Form.Item>

            <Form.Item
              name="representative"
              label="대표자"
              rules={[
                { max: 10, message: '최대 10자' }
              ]}
            >
              <Input placeholder="박대박" />
            </Form.Item>

            <Form.Item
              name="businessAddress"
              label="사업장등록주소"
              rules={[{ max: 100, message: '최대 100자' }]}
            >
              <Input placeholder="서울시 강남구 테헤란로 123" />
            </Form.Item>

            <Form.Item
              name="unloadingAddress"
              label="하차지 주소"
              rules={[{ max: 100, message: '최대 100자' }]}
            >
              <Input placeholder="서울시 용산구 한남동 339" />
            </Form.Item>

            <Form.Item
              name="taxInvoiceEmail"
              label="세금계산서 발행 이메일주소"
              rules={[
                { type: 'email', message: '올바른 이메일 형식이 아닙니다' }
              ]}
            >
              <Input placeholder="daebak@email.com" />
            </Form.Item>

            <Form.Item
              name="depositDescription"
              label="입금 적요"
            >
              <FMTagInput
                placeholder="입금시 통장에 찍히는 텍스트 입력 후 엔터"
              />
            </Form.Item>

            <Form.Item
              name="certificate"
              label="사업자등록증"
              valuePropName="fileList"
              getValueFromEvent={(e) => e?.fileList}
            >
              <Upload
                beforeUpload={() => false}
                maxCount={1}
                accept="image/*,.pdf"
              >
                <FMButton
                  variant="green"
                  icon={<UploadIcon className="h-4 w-4" />}
                >
                  사업자등록증 첨부하기 (최대 10MB)
                </FMButton>
              </Upload>
            </Form.Item>
          </div>
        )}

        {/* 하단 버튼 */}
        <div className="grid grid-cols-2 gap-3 w-full mt-6">
          <FMButton
            variant="secondary"
            onClick={() => navigate('/buyer')}
            className="w-full"
          >
            취소
          </FMButton>
          <FMButton
            onClick={handleSubmit}
            className="w-full"
          >
            저장
          </FMButton>
        </div>
      </Form>
      </div>
    </div>
  );
}

export default BuyerRegister;
