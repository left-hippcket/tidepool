import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Form, Input, Select, Radio, Upload, InputNumber } from 'antd';
import { ArrowLeftOutlined, MinusCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { Upload as UploadIcon, Plus } from 'lucide-react';
import { joinGroups, managers, territories, regions, businessRegistry } from '../data/mockData';
import { FMButton } from '../components/ui/FMButton';
import { FMInput } from '../components/ui/FMInput';
import { FMSelect } from '../components/ui/FMSelect';
import { FMTagInput } from '../components/ui/FMTagInput';
import toast from 'react-hot-toast';
import { findPartnerByBusinessNumber, validateTicker, PARTNER_TYPE_NAMES } from '../utils/tickerValidation';

function JoinDistributionRegister() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form] = Form.useForm();
  const [registrationType, setRegistrationType] = useState('new');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedTerritory, setSelectedTerritory] = useState(null);
  const [availableRegions, setAvailableRegions] = useState([]);
  const [tickerReadOnly, setTickerReadOnly] = useState(false);
  const [tickerValidationStatus, setTickerValidationStatus] = useState(null);

  useEffect(() => {
    const groupId = searchParams.get('groupId');
    const mode = searchParams.get('mode');

    if (groupId && mode === 'add') {
      setRegistrationType('existing');
      const group = joinGroups.find(g => g.id === parseInt(groupId));
      if (group) {
        setSelectedGroup(group);
        form.setFieldsValue({ searchGroup: group.name });
      }
    }
  }, [searchParams, form]);

  const handleTypeChange = (e) => {
    setRegistrationType(e.target.value);
    form.resetFields();
    setSelectedGroup(null);
  };

  const handleGroupSearch = (value) => {
    const group = joinGroups.find(g => g.name === value);
    setSelectedGroup(group);
  };

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
          ticker: partner.ticker,
          joinName: form.getFieldValue('joinName') || partner.name,
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

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Ticker 검증
      const validation = validateTicker(values.ticker, values.businessNumber);
      if (!validation.valid) {
        toast.error(validation.message, { duration: 5000 });
        return;
      }

      if (registrationType === 'new') {
        toast.success(`조인유통 그룹 '${values.groupName}'이 등록되었습니다.`);
      } else {
        toast.success(`사업자가 '${selectedGroup.name}'에 추가되었습니다.`);
      }

      navigate('/join-distribution');
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleCancel = () => {
    navigate('/join-distribution');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex flex-col gap-6 w-full">
      {/* 헤더 */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-start">
          <FMButton
            variant="indigo"
            icon={<ArrowLeftOutlined className="h-4 w-4" />}
            href="/join-distribution"
          >
            목록으로
          </FMButton>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">조인유통 등록</h2>
      </div>

      {/* 등록 유형 선택 */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <Radio.Group onChange={handleTypeChange} value={registrationType}>
          <Radio value="new">신규 조인유통그룹 생성</Radio>
          <Radio value="existing">기존 조인유통그룹에 사업자 추가</Radio>
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
          <div className="rounded-xl border border-gray-200 bg-white p-5 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">조인유통그룹 검색</h3>
            <Form.Item
              name="searchGroup"
              label="조인유통그룹 검색"
              rules={[{ required: true, message: '조인유통그룹을 선택해주세요' }]}
            >
              <FMSelect
                value={form.getFieldValue('searchGroup')}
                onChange={(value) => {
                  form.setFieldsValue({ searchGroup: value });
                  handleGroupSearch(value);
                }}
                options={joinGroups.map(g => ({
                  value: g.name,
                  label: `${g.name} (담당자: ${g.salesPerson})`
                }))}
                placeholder="검색 & 선택"
                isSearchable={true}
              />
            </Form.Item>

            {selectedGroup && (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="space-y-2 text-sm">
                  <div><span className="font-semibold text-gray-700">조인유통그룹명:</span> <span className="text-gray-900">{selectedGroup.name}</span></div>
                  <div><span className="font-semibold text-gray-700">담당영업사원:</span> <span className="text-gray-900">{selectedGroup.salesPerson}</span></div>
                  <div><span className="font-semibold text-gray-700">사업권역:</span> <span className="text-gray-900">{selectedGroup.territory}</span></div>
                  <div><span className="font-semibold text-gray-700">상세지역:</span> <span className="text-gray-900">{selectedGroup.region}</span></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 조인유통 그룹 기본 정보 */}
        {registrationType === 'new' && (
          <div className="rounded-xl border border-gray-200 bg-white p-5 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">조인유통그룹 기본 정보</h3>

            <Form.Item
              name="groupName"
              label="조인유통그룹명"
              rules={[
                { required: true, message: '조인유통그룹명을 입력해주세요' },
                { max: 30, message: '최대 30자까지 입력 가능합니다' },
              ]}
            >
              <Input placeholder="동주유통" />
            </Form.Item>

            <Form.Item
              name="salesPersons"
              label="담당영업사원"
              rules={[{ required: true, message: '담당영업사원을 선택해주세요' }]}
            >
              <FMSelect
                value={form.getFieldValue('salesPersons') || []}
                onChange={(value) => {
                  form.setFieldsValue({ salesPersons: value });
                  // 첫 번째 담당자를 salesPerson에 자동 설정
                  if (value && value.length > 0) {
                    form.setFieldsValue({ salesPerson: value[0] });
                  }
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

            <Form.Item
              name="territory"
              label="사업권역"
              rules={[{ required: true, message: '사업권역을 선택해주세요' }]}
            >
              <Select
                onChange={(value) => {
                  setSelectedTerritory(value);
                  const territory = territories.find(t => t.name === value);
                  if (territory) {
                    const filtered = regions
                      .filter(r => r.territoryId === territory.id && r.status === 'active')
                      .sort((a, b) => a.displayOrder - b.displayOrder);
                    setAvailableRegions(filtered);
                  } else {
                    setAvailableRegions([]);
                  }
                  form.setFieldsValue({ region: undefined });
                }}
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

            <div className="my-4 border-t border-gray-200"></div>
            <h4 className="text-base font-semibold text-gray-900 mb-4">거래 정보</h4>

            <Form.Item name="kakaoGroupName" label="카카오톡 단톡방">
              <Input placeholder="[노량진]동주유통 거래방" />
            </Form.Item>

            <Form.Item name="paymentCycle" label="결제주기">
              <Input placeholder="예: 월 2회 정산" />
            </Form.Item>

            <Form.Item name="arrivalPricePolicy" label="넙치 도착단가 정책">
              <div className="flex flex-col gap-1">
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="900"
                  step={100}
                  min={0}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
                <span className="text-xs text-blue-500">상차단가에 추가할 금액을 입력하세요</span>
              </div>
            </Form.Item>

            <Form.Item name="commissionRate" label="상차 수수료율(%)">
              <InputNumber style={{ width: '100%' }} min={0} max={100} step={0.1} placeholder="예: 1" />
            </Form.Item>

            <Form.Item name="mainSuppliers" label="주요 공급처">
              <FMTagInput
                value={form.getFieldValue('mainSuppliers') || []}
                onChange={(value) => form.setFieldsValue({ mainSuppliers: value })}
                placeholder="공급처명 입력 후 엔터키"
              />
            </Form.Item>

            <Form.Item name="mainFarms" label="주요 양식장">
              <FMTagInput
                value={form.getFieldValue('mainFarms') || []}
                onChange={(value) => form.setFieldsValue({ mainFarms: value })}
                placeholder="양식장명 입력 후 엔터키"
              />
            </Form.Item>

            <Form.Item name="financial" label="재무상황">
              <Select placeholder="선택">
                <Select.Option value="우수">우수</Select.Option>
                <Select.Option value="양호">양호</Select.Option>
                <Select.Option value="보통">보통</Select.Option>
                <Select.Option value="주의">주의</Select.Option>
              </Select>
            </Form.Item>
          </div>
        )}

        {/* 사업자 정보 */}
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
              name="joinName"
              label="조인유통명"
              rules={[
                { required: true, message: '조인유통명을 입력해주세요' },
                { max: 20, message: '최대 20자' },
                { pattern: /^[가-힣0-9() ]+$/, message: '한글, 숫자, 괄호()만 허용' }
              ]}
            >
              <Input placeholder="동주본점" />
            </Form.Item>

            <Form.Item
              name="ticker"
              label="Ticker"
              rules={[
                { required: true, message: 'Ticker를 입력해주세요' },
                { max: 10, message: '최대 10자' },
                { pattern: /^[A-Za-z0-9]+$/, message: '영문, 숫자만 허용' }
              ]}
              validateStatus={
                tickerValidationStatus
                  ? tickerValidationStatus.valid
                    ? 'success'
                    : 'error'
                  : undefined
              }
              help={tickerValidationStatus?.message}
            >
              <Input
                placeholder="DJ01"
                disabled={tickerReadOnly}
                onChange={handleTickerChange}
                suffix={
                  tickerReadOnly ? (
                    <span className="text-xs text-gray-500">🔒 자동</span>
                  ) : null
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
              <Input placeholder="(주)동주유통" />
            </Form.Item>

            <Form.Item
              name="representative"
              label="대표자"
              rules={[
                { max: 10, message: '최대 10자' }
              ]}
            >
              <Input placeholder="김동주" />
            </Form.Item>

            <Form.Item
              name="businessAddress"
              label="사업장등록주소"
              rules={[{ max: 100, message: '최대 100자' }]}
            >
              <Input placeholder="서울시 강남구 테헤란로 123" />
            </Form.Item>

            <Form.Item
              name="taxInvoiceEmail"
              label="세금계산서 이메일"
              rules={[
                { type: 'email', message: '올바른 이메일 형식이 아닙니다' }
              ]}
            >
              <Input placeholder="dongju@email.com" />
            </Form.Item>

            <div className="my-4 border-t border-gray-200"></div>
            <h4 className="text-base font-semibold text-gray-900 mb-4">은행계좌 정보</h4>

            <Form.List name="bankAccounts" initialValue={[{}]}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }, index) => (
                    <div key={key} className="mb-6 last:mb-0">
                      {index > 0 && <div className="my-6 border-t border-gray-200"></div>}
                      <div className="flex items-center gap-2 mb-4">
                        <h5 className="text-sm font-medium text-gray-700">계좌 #{index + 1}</h5>
                        {fields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => remove(name)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <MinusCircleOutlined />
                          </button>
                        )}
                      </div>

                      <Form.Item
                        {...restField}
                        name={[name, 'bank']}
                        label="은행명"
                        className="mb-4"
                      >
                        <Input placeholder="예: 국민은행" />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'accountNumber']}
                        label="계좌번호"
                        className="mb-4"
                      >
                        <Input placeholder="123456-78-901234" />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'holder']}
                        label="예금주"
                        className="mb-0"
                      >
                        <Input placeholder="홍길동" />
                      </Form.Item>
                    </div>
                  ))}
                  <div className="flex justify-end">
                    <FMButton
                      variant="green"
                      icon={<Plus className="h-4 w-4" />}
                      onClick={() => add()}
                    >
                      계좌 추가
                    </FMButton>
                  </div>
                </>
              )}
            </Form.List>

            <div className="my-4 border-t border-gray-200"></div>

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
                  사업자등록증 첨부하기
                </FMButton>
              </Upload>
            </Form.Item>
          </div>
        )}
      </Form>

      {/* 하단 버튼 */}
      {(registrationType === 'new' || selectedGroup) && (
        <div className="mt-8 border-t border-gray-200 pt-6">
          <div className="grid grid-cols-2 gap-4">
            <FMButton
              variant="secondary"
              onClick={handleCancel}
              className="w-full"
            >
              취소
            </FMButton>
            <FMButton
              variant="primary"
              onClick={handleSubmit}
              className="w-full"
            >
              저장
            </FMButton>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

export default JoinDistributionRegister;
