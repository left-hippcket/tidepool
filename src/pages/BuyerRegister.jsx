import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Form, Input, Select, Button, Radio, Space, Divider,
  message, AutoComplete, Upload
} from 'antd';
import {
  ArrowLeftOutlined, PlusOutlined, MinusCircleOutlined, UploadOutlined
} from '@ant-design/icons';
import { buyerGroups, managers, territories, regions, productCategories, products } from '../data/mockData';

function BuyerRegister() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form] = Form.useForm();
  const [registrationType, setRegistrationType] = useState('new'); // 'new' | 'existing'
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [selectedTerritory, setSelectedTerritory] = useState(null);
  const [availableRegions, setAvailableRegions] = useState([]);

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
  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    if (value) {
      const filtered = products.filter(p => p.categoryName === value);
      setAvailableProducts(filtered);
    } else {
      setAvailableProducts([]);
    }
    form.setFieldsValue({ mainProducts: [] });
  };

  // 사업권역 변경 시 상세지역 필터링
  const handleTerritoryChange = (value) => {
    setSelectedTerritory(value);
    if (value) {
      const filtered = regions.filter(r => r.territoryName === value && r.status === 'active');
      setAvailableRegions(filtered);
    } else {
      setAvailableRegions([]);
    }
    form.setFieldsValue({ region: undefined });
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

      // ticker 중복 체크
      const existingTicker = buyerGroups.find(g =>
        g.ticker === values.ticker && (!selectedGroup || g.id !== selectedGroup.id)
      );

      if (existingTicker) {
        message.error('이미 다른 사업자가 사용중인 ticker입니다. 변경 후 재입력 해주세요');
        return;
      }

      if (registrationType === 'new') {
        message.success(`바이어 그룹 '${values.groupName}'이 등록되었습니다.`);
        // TODO: 상세 페이지로 이동
        navigate('/buyer');
      } else {
        message.success(`사업자가 '${selectedGroup.name}'에 추가되었습니다.`);
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
    <div className="min-h-screen bg-[#f9fafb] p-4 md:p-6">
      {/* 헤더 */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/buyer')}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeftOutlined />
            목록으로
          </button>
          <h2 className="text-2xl font-bold text-gray-900">바이어 등록</h2>
        </div>
      </div>

      {/* 등록 유형 선택 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
        <Radio.Group value={registrationType} onChange={handleTypeChange}>
          <Radio value="new">신규 바이어그룹 생성</Radio>
          <Radio value="existing">기존 바이어그룹에 사업자 추가</Radio>
        </Radio.Group>
      </div>

      <Form form={form} layout="vertical">
        {/* 기존 그룹 검색 */}
        {registrationType === 'existing' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">바이어그룹 검색</h3>
            <Form.Item
              name="searchGroup"
              label="바이어그룹 검색"
              rules={[{ required: true, message: '바이어그룹을 선택해주세요' }]}
            >
              <AutoComplete
                options={buyerGroups.map(g => ({
                  value: g.name,
                  label: `${g.name} (담당자: ${g.salesPerson})`
                }))}
                onSelect={handleGroupSearch}
                placeholder="바이어그룹명 입력"
                filterOption={(inputValue, option) =>
                  option.value.toLowerCase().includes(inputValue.toLowerCase())
                }
              />
            </Form.Item>

            {selectedGroup && (
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
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
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">바이어그룹 기본 정보</h3>

            <Form.Item
              name="groupName"
              label="바이어그룹명"
              rules={[
                { required: true, message: '바이어그룹명을 입력해주세요' },
                { max: 30, message: '최대 30자까지 입력 가능합니다' },
                { pattern: /^[가-힣0-9()]+$/, message: '한글, 숫자, 괄호()만 허용됩니다' }
              ]}
            >
              <Input placeholder="예: 명성횟집 그룹" />
            </Form.Item>

            <Divider orientation="left">키맨 정보</Divider>
            <Form.List name="keymen" initialValue={[{}]}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field, index) => (
                    <div key={field.key} className="bg-gray-50 rounded-lg border border-gray-200 p-4 mb-3">
                      <Space align="start" style={{ width: '100%' }}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'name']}
                          label="이름"
                          rules={[{ required: true, message: '이름 입력' }, { max: 20, message: '최대 20자' }]}
                          style={{ marginBottom: 0 }}
                        >
                          <Input placeholder="김철수" />
                        </Form.Item>
                        <Form.Item
                          {...field}
                          name={[field.name, 'position']}
                          label="직책"
                          rules={[{ max: 20, message: '최대 20자' }]}
                          style={{ marginBottom: 0 }}
                        >
                          <Input placeholder="대표" />
                        </Form.Item>
                        <Form.Item
                          {...field}
                          name={[field.name, 'phone']}
                          label="연락처"
                          rules={[
                            { pattern: /^010-\d{4}-\d{4}$/, message: '010-XXXX-XXXX 형식' }
                          ]}
                          style={{ marginBottom: 0 }}
                        >
                          <Input placeholder="010-1234-5678" />
                        </Form.Item>
                        {fields.length > 1 && (
                          <MinusCircleOutlined
                            onClick={() => remove(field.name)}
                            style={{ marginTop: 30 }}
                          />
                        )}
                      </Space>
                    </div>
                  ))}
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    키맨 추가하기
                  </Button>
                </>
              )}
            </Form.List>

            <Divider />

            <Form.Item
              name="territory"
              label="사업권역"
              rules={[{ required: true, message: '사업권역을 선택해주세요' }]}
            >
              <Select
                placeholder="사업권역 선택"
                onChange={handleTerritoryChange}
              >
                {territories.filter(t => t.status === 'active').map(t => (
                  <Select.Option key={t.id} value={t.name}>{t.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="region"
              label="상세지역"
              rules={[{ required: true, message: '상세지역을 선택해주세요' }]}
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
              name="salesPerson"
              label="담당영업사원"
              rules={[{ required: true, message: '담당영업사원을 선택해주세요' }]}
            >
              <Select placeholder="담당자 선택">
                {managers.map(m => (
                  <Select.Option key={m} value={m}>{m}</Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="mainCategory"
              label="주요품목분류"
              rules={[{ required: true, message: '주요품목분류를 선택해주세요' }]}
            >
              <Select
                placeholder="품목분류 선택"
                onChange={handleCategoryChange}
              >
                {productCategories.map(c => (
                  <Select.Option key={c.id} value={c.name}>{c.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="mainProducts"
              label="주요품목"
            >
              <Select
                mode="multiple"
                placeholder="주요품목 선택 (선택사항)"
                disabled={!selectedCategory}
              >
                {availableProducts.map(p => (
                  <Select.Option key={p.id} value={p.name}>
                    {p.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="arrivalPricePolicy"
              label="도착단가 정책"
            >
              <Select placeholder="선택">
                <Select.Option value="상차단가 + 0원">상차단가 + 0원</Select.Option>
                <Select.Option value="상차단가 + 700원">상차단가 + 700원</Select.Option>
                <Select.Option value="상차단가 + 800원">상차단가 + 800원</Select.Option>
                <Select.Option value="상차단가 + 900원">상차단가 + 900원</Select.Option>
              </Select>
            </Form.Item>

            <Divider orientation="left">거래 정보</Divider>

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
              rules={[{ max: 100, message: '최대 100자' }]}
            >
              <Input placeholder="쉼표로 구분 (예: 호경유통, ING)" />
            </Form.Item>

            <Divider orientation="left">중요 평가 요소 (1-7순위)</Divider>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
        )}

        {/* 사업자 정보 (공통) */}
        {(registrationType === 'new' || selectedGroup) && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">사업자 정보</h3>

            <Form.Item
              name="businessNumber"
              label="사업자등록번호"
              rules={[
                { required: true, message: '사업자등록번호를 입력해주세요' },
                { pattern: /^\d{3}-\d{2}-\d{5}$/, message: 'XXX-XX-XXXXX 형식' }
              ]}
            >
              <Input placeholder="123-45-67890" />
            </Form.Item>

            <Form.Item
              name="businessName"
              label="사업자등록상호"
              rules={[
                { required: true, message: '사업자등록상호를 입력해주세요' },
                { max: 50, message: '최대 50자' }
              ]}
            >
              <Input placeholder="(주)대박수산" />
            </Form.Item>

            <Form.Item
              name="representative"
              label="대표자"
              rules={[
                { required: true, message: '대표자를 입력해주세요' },
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
              name="buyerName"
              label="바이어명"
              rules={[
                { required: true, message: '바이어명을 입력해주세요' },
                { max: 20, message: '최대 20자' },
                { pattern: /^[가-힣0-9()]+$/, message: '한글, 숫자, 괄호()만 허용' }
              ]}
            >
              <Input placeholder="대박집" />
            </Form.Item>

            <Form.Item
              name="buyerId"
              label="ticker (ticker)"
              rules={[
                { required: true, message: 'ticker를 입력해주세요' },
                { max: 10, message: '최대 10자' },
                { pattern: /^[A-Za-z0-9]+$/, message: '영문, 숫자만 허용' }
              ]}
            >
              <Input placeholder="DBBK01" />
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
                { required: true, message: '이메일주소를 입력해주세요' },
                { type: 'email', message: '올바른 이메일 형식이 아닙니다' }
              ]}
            >
              <Input placeholder="daebak@email.com" />
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
                <Button icon={<UploadOutlined />}>사업자등록증 첨부하기 (최대 10MB)</Button>
              </Upload>
            </Form.Item>
          </div>
        )}

        {/* 하단 버튼 */}
        <Space>
          <Button size="large" onClick={() => navigate('/buyer')}>
            취소
          </Button>
          <Button type="primary" size="large" onClick={handleSubmit}>
            저장
          </Button>
        </Space>
      </Form>
    </div>
  );
}

export default BuyerRegister;
