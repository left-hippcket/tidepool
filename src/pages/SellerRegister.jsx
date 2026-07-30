import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Form, Input, Select, Radio, Button,
  AutoComplete, Upload, InputNumber, Tag
} from 'antd';
import {
  ArrowLeftOutlined, PlusOutlined, MinusCircleOutlined, UploadOutlined
} from '@ant-design/icons';
import { Upload as UploadIcon, Plus } from 'lucide-react';
import { sellerGroups, managers, territories, regions, productCategories, products, businessRegistry } from '../data/mockData';
import { FMButton } from '../components/ui/FMButton';
import { FMInput } from '../components/ui/FMInput';
import { FMSelect } from '../components/ui/FMSelect';
import { FMTagInput } from '../components/ui/FMTagInput';
import { Star } from 'lucide-react';
import toast from 'react-hot-toast';

function SellerRegister() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form] = Form.useForm();
  const [registrationType, setRegistrationType] = useState('new'); // 'new' | 'existing'
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [selectedTerritory, setSelectedTerritory] = useState(null);
  const [availableRegions, setAvailableRegions] = useState([]);

  // URL 쿼리 파라미터 처리
  useEffect(() => {
    const groupId = searchParams.get('groupId');
    const mode = searchParams.get('mode');

    if (groupId && mode === 'add') {
      // 기존 그룹에 사업자 추가 모드
      setRegistrationType('existing');

      // 해당 그룹 찾아서 자동 선택
      const group = sellerGroups.find(g => g.id === parseInt(groupId));
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
  };

  // 기존 그룹 검색
  const handleGroupSearch = (value) => {
    const group = sellerGroups.find(g => g.name === value);
    setSelectedGroup(group);
  };

  // 주요품목분류 변경 시 주요품목 필터링
  const handleCategoryChange = (values) => {
    setSelectedCategory(values);
    // 선택된 품목분류에 해당하는 품목만 필터링
    if (values && values.length > 0) {
      const filtered = products.filter(p =>
        values.includes(p.categoryName)
      );
      setAvailableProducts(filtered);
    } else {
      setAvailableProducts([]);
    }
    // 기존 선택된 주요품목 초기화
    form.setFieldsValue({ mainProducts: [] });
  };

  // 사업자등록번호 입력 시 자동 채우기
  const handleBusinessNumberChange = (e) => {
    const value = e.target.value;

    // 형식이 완성되면 (XXX-XX-XXXXX) DB 조회
    if (/^\d{3}-\d{2}-\d{5}$/.test(value)) {
      const businessInfo = businessRegistry[value];

      if (businessInfo) {
        // 등록된 사업자 정보가 있으면 자동으로 채우기
        form.setFieldsValue({
          businessName: businessInfo.businessName,
          representative: businessInfo.representative,
          businessAddress: businessInfo.businessAddress,
        });
        toast.success('등록된 사업자 정보를 불러왔습니다.');
      } else {
        // 등록된 정보가 없으면 필드 초기화
        form.setFieldsValue({
          businessName: undefined,
          representative: undefined,
          businessAddress: undefined,
        });
      }
    }
  };

  // 저장
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // ticker 중복 체크 (간단 구현 - 실제로는 4개 유형 전체 체크)
      const existingTicker = sellerGroups.find(g =>
        g.ticker === values.ticker && (!selectedGroup || g.id !== selectedGroup.id)
      );

      if (existingTicker) {
        toast.error('이미 다른 사업자가 사용중인 ticker입니다. 변경 후 재입력 해주세요');
        return;
      }

      // 사업자등록번호 중복 체크
      // TODO: 실제 구현 필요

      if (registrationType === 'new') {
        toast.success(`셀러 그룹 '${values.groupName}'이 등록되었습니다.`);
      } else {
        toast.success(`사업자가 '${selectedGroup.name}'에 추가되었습니다.`);
      }

      navigate('/seller');
    } catch (error) {
      console.error('Validation failed:', error);
    }
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
            href="/seller"
          >
            목록으로
          </FMButton>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">셀러 등록</h2>
      </div>

      {/* 등록 유형 선택 */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <Radio.Group value={registrationType} onChange={handleTypeChange}>
          <Radio value="new">신규 셀러그룹 생성</Radio>
          <Radio value="existing">기존 셀러그룹에 사업자 추가</Radio>
        </Radio.Group>
      </div>

      <Form
        form={form}
        layout="horizontal"
        labelCol={{ flex: '20%' }}
        wrapperCol={{ flex: '80%' }}
        labelAlign="left"
      >
        {/* 기존 그룹 검색 (기존 그룹 추가 시) */}
        {registrationType === 'existing' && (
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">기존 셀러그룹 선택</h3>
            <Form.Item
              name="searchGroup"
              label="셀러그룹 검색"
              rules={[{ required: true, message: '셀러그룹을 선택해주세요' }]}
            >
              <FMSelect
                value={form.getFieldValue('searchGroup')}
                onChange={(value) => {
                  form.setFieldsValue({ searchGroup: value });
                  handleGroupSearch(value);
                }}
                options={sellerGroups.map(g => ({
                  value: g.name,
                  label: `${g.name} (담당자: ${g.manager})`
                }))}
                placeholder="검색 & 선택"
                isSearchable={true}
              />
            </Form.Item>

            {selectedGroup && (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="space-y-2 text-sm">
                  <div><span className="font-semibold text-gray-700">셀러그룹명:</span> <span className="text-gray-900">{selectedGroup.name}</span></div>
                  <div><span className="font-semibold text-gray-700">소싱담당자:</span> <span className="text-gray-900">{selectedGroup.manager}</span></div>
                  <div><span className="font-semibold text-gray-700">사업권역:</span> <span className="text-gray-900">{selectedGroup.territory}</span></div>
                  <div><span className="font-semibold text-gray-700">상세지역:</span> <span className="text-gray-900">{selectedGroup.region}</span></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 셀러그룹 기본 정보 (신규 생성 시) */}
        {registrationType === 'new' && (
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">셀러그룹 기본 정보</h3>
            <Form.Item
              name="groupName"
              label="셀러그룹명"
              rules={[
                { required: true, message: '셀러그룹명을 입력해주세요' },
                { max: 30, message: '최대 30자까지 입력 가능합니다' },
                { pattern: /^[가-힣0-9() ]+$/, message: '한글, 숫자, 괄호()만 허용됩니다' }
              ]}
            >
              <Input placeholder="예: 성호수산" />
            </Form.Item>

            <Form.Item
              name="territory"
              label="사업권역"
              rules={[{ required: true, message: '사업권역을 선택해주세요.' }]}
            >
              <Select
                placeholder="사업권역 선택"
                onChange={(value) => {
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

            <Form.Item
              name="manager"
              label="소싱담당자"
              rules={[{ required: true, message: '소싱담당자를 선택해주세요' }]}
            >
              <FMSelect
                value={form.getFieldValue('manager') || []}
                onChange={(value) => form.setFieldsValue({ manager: value })}
                options={managers.map(m => ({
                  value: m,
                  label: m
                }))}
                placeholder="담당자 선택 (복수 선택 가능)"
                isSearchable={true}
                isMulti={true}
              />
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
                isDisabled={selectedCategory.length === 0}
              />
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
                        rules={[{ required: true, message: '성명을 입력해주세요' }]}
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
                        className="mb-0"
                      >
                        <Input placeholder="예: 대표, 사무장, 광어담당" maxLength={20} />
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
            <h4 className="text-base font-semibold text-gray-900 mb-4">정성적 평가</h4>
            <Form.Item name="financial" label="재무상황">
              <Select placeholder="선택">
                <Select.Option value="좋음">👍 좋음</Select.Option>
                <Select.Option value="보통">😐 보통</Select.Option>
                <Select.Option value="나쁨">👎 나쁨</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="quality" label="품질수준">
              <Select placeholder="선택">
                <Select.Option value="최상">👑 최상</Select.Option>
                <Select.Option value="좋음">👍 좋음</Select.Option>
                <Select.Option value="보통">😐 보통</Select.Option>
                <Select.Option value="나쁨">👎 나쁨</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="priceCompetitive" label="가격경쟁력">
              <Select placeholder="선택">
                <Select.Option value="높음">🔥 높음</Select.Option>
                <Select.Option value="보통">😐 보통</Select.Option>
                <Select.Option value="낮음">❄️ 낮음</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="claimCooperation" label="클레임협조도">
              <Select placeholder="선택">
                <Select.Option value="좋음">👍 좋음</Select.Option>
                <Select.Option value="보통">😐 보통</Select.Option>
                <Select.Option value="나쁨">👎 나쁨</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="lossProvision" label="로스제공">
              <Select placeholder="선택">
                <Select.Option value="넉넉함">💯 넉넉함</Select.Option>
                <Select.Option value="적당함">⭐ 적당함</Select.Option>
                <Select.Option value="부족함">⚠️ 부족함</Select.Option>
              </Select>
            </Form.Item>

            <div className="my-4 border-t border-gray-200"></div>
            <h4 className="text-base font-semibold text-gray-900 mb-4">기타 정보</h4>
            <Form.Item name="farmArea" label="양식장 수면적(평)">
              <InputNumber style={{ width: '100%' }} min={0} placeholder="15000" />
            </Form.Item>

            <Form.Item name="annualProduction" label="연간생산량(톤)">
              <InputNumber style={{ width: '100%' }} min={0} placeholder="120" />
            </Form.Item>

            <Form.Item
              name="mainDistributors"
              label="메인 유통사"
              getValueFromEvent={(value) => value}
              getValueProps={(value) => ({ value: value || [] })}
            >
              <FMTagInput placeholder="유통사명 입력 후 엔터" />
            </Form.Item>

            <Form.Item
              name="commissionRate"
              label="상차 수수료율(%)"
              rules={[
                { required: true, message: '상차 수수료율을 입력해주세요' },
                { type: 'number', min: 0, max: 100, message: '0-100% 범위 입력' }
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                max={100}
                step={0.1}
                placeholder="1.0"
              />
            </Form.Item>
          </div>
        )}

        {/* 사업자 정보 (공통) */}
        {(registrationType === 'new' || selectedGroup) && (
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">사업자 정보</h3>
            </div>

            <Form.List name="businesses" initialValue={[{}]}>
              {(businessFields, { add: addBusiness, remove: removeBusiness }) => (
                <>
                  {businessFields.map((businessField, businessIndex) => (
                    <div key={businessField.key} className="mb-8">
                      <div className="flex items-center gap-2 mb-4">
                        <h4 className="text-base font-semibold text-gray-900">사업자 #{businessIndex + 1}</h4>
                        {businessFields.length > 1 && (
                          <Button
                            type="text"
                            icon={<MinusCircleOutlined />}
                            onClick={() => removeBusiness(businessField.name)}
                            danger
                            size="small"
                          />
                        )}
                      </div>

                      <Form.Item
                        {...businessField}
                        name={[businessField.name, 'sellerName']}
                        label="셀러명"
                        rules={[
                          { required: true, message: '셀러명을 입력해주세요' },
                          { max: 20, message: '최대 20자까지 입력 가능합니다' },
                          { pattern: /^[가-힣0-9() ]+$/, message: '한글, 숫자, 괄호()만 허용됩니다' }
                        ]}
                      >
                        <Input placeholder="성호1호" />
                      </Form.Item>

                      <Form.Item
                        {...businessField}
                        name={[businessField.name, 'ticker']}
                        label="Ticker"
                        rules={[{ required: true, message: 'Ticker를 입력해주세요' }]}
                      >
                        <Input placeholder="예: SH" maxLength={10} />
                      </Form.Item>

                      <Form.Item
                        {...businessField}
                        name={[businessField.name, 'businessNumber']}
                        label="사업자등록번호"
                        rules={[
                          { pattern: /^\d{3}-\d{2}-\d{5}$/, message: 'XXX-XX-XXXXX 형식' }
                        ]}
                      >
                        <Input placeholder="123-45-67890" onChange={handleBusinessNumberChange} />
                      </Form.Item>

                      <Form.Item
                        {...businessField}
                        name={[businessField.name, 'businessName']}
                        label="사업자등록상호"
                        rules={[
                          { max: 50, message: '최대 50자까지 입력 가능합니다' }
                        ]}
                      >
                        <Input placeholder="영어조합법인 성호수산" />
                      </Form.Item>

                      <Form.Item
                        {...businessField}
                        name={[businessField.name, 'representative']}
                        label="대표자"
                        rules={[
                          { max: 10, message: '최대 10자까지 입력 가능합니다' }
                        ]}
                      >
                        <Input placeholder="박성호" />
                      </Form.Item>

                      <Form.Item
                        {...businessField}
                        name={[businessField.name, 'businessAddress']}
                        label="사업자등록주소"
                        rules={[{ max: 100, message: '최대 100자까지 입력 가능합니다' }]}
                      >
                        <Input placeholder="경기도 수지구 동천동 230-3" />
                      </Form.Item>

                      <Form.Item
                        {...businessField}
                        name={[businessField.name, 'loadingAddress']}
                        label="상차지 주소"
                        rules={[{ max: 100, message: '최대 100자까지 입력 가능합니다' }]}
                      >
                        <Input placeholder="전라남도 완도군 신지면 2-3" />
                      </Form.Item>

                      <div className="my-4 border-t border-gray-200"></div>
                      <h5 className="text-sm font-semibold text-gray-900 mb-4">은행계좌정보</h5>
                      <Form.List name={[businessField.name, 'bankAccounts']} initialValue={[{}]}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field, index) => (
                    <div key={field.key} className="mb-6">
                      <div className="flex items-center gap-2 mb-4">
                        <h5 className="text-sm font-medium text-gray-700">계좌 #{index + 1}</h5>
                        {index === 0 && (
                          <span className="inline-flex items-center gap-1 rounded border font-semibold bg-purple-100 border-purple-300 text-purple-600 px-2.5 py-1 text-xs">
                            <Star className="h-3 w-3" />
                            주사용계좌
                          </span>
                        )}
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
                        name={[field.name, 'bank']}
                        label="은행명"
                        className="mb-4"
                      >
                        <Input placeholder="하나은행" />
                      </Form.Item>

                      <Form.Item
                        {...field}
                        name={[field.name, 'accountNumber']}
                        label="계좌번호"
                        className="mb-4"
                      >
                        <Input placeholder="39484448392049" />
                      </Form.Item>

                      <Form.Item
                        {...field}
                        name={[field.name, 'holder']}
                        label="예금주"
                        className="mb-4"
                      >
                        <Input placeholder="박성호" />
                      </Form.Item>

                      <Form.Item
                        {...field}
                        name={[field.name, 'depositDescription']}
                        label="입금 적요"
                        className="mb-0"
                        getValueFromEvent={(value) => value}
                        getValueProps={(value) => ({ value: value || [] })}
                      >
                        <FMTagInput placeholder="입금시 통장에 찍히는 텍스트 입력 후 엔터" />
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
                      계좌 추가하기
                    </FMButton>
                  </div>
                </>
              )}
            </Form.List>

                      <div className="my-4 border-t border-gray-200"></div>

                      <Form.Item
                        {...businessField}
                        name={[businessField.name, 'certificate']}
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

                      {businessIndex < businessFields.length - 1 && (
                        <div className="my-8 border-t-2 border-gray-300"></div>
                      )}
                    </div>
                  ))}

                  <div className="flex justify-end mt-6">
                    <FMButton
                      variant="green"
                      icon={<Plus className="h-4 w-4" />}
                      onClick={() => addBusiness()}
                    >
                      사업자 추가하기
                    </FMButton>
                  </div>
                </>
              )}
            </Form.List>
          </div>
        )}

        {/* 하단 버튼 */}
        <div className="grid grid-cols-2 gap-3 w-full mt-6">
          <FMButton
            variant="secondary"
            onClick={() => navigate('/seller')}
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

export default SellerRegister;
