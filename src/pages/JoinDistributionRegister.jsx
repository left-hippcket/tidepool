import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Form, Input, Select, Button, Radio, Space, Divider,
  message, AutoComplete, Upload, InputNumber, Tag
} from 'antd';
import {
  ArrowLeftOutlined, PlusOutlined, MinusCircleOutlined, UploadOutlined
} from '@ant-design/icons';
import { joinGroups, managers, territories } from '../data/mockData';

function JoinDistributionRegister() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form] = Form.useForm();
  const [registrationType, setRegistrationType] = useState('new'); // 'new' | 'existing'
  const [selectedGroup, setSelectedGroup] = useState(null);

  // URL 쿼리 파라미터 처리
  useEffect(() => {
    const groupId = searchParams.get('groupId');
    const mode = searchParams.get('mode');

    if (groupId && mode === 'add') {
      // 기존 그룹에 사업자 추가 모드
      setRegistrationType('existing');

      // 해당 그룹 찾아서 자동 선택
      const group = joinGroups.find(g => g.id === parseInt(groupId));
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
    const group = joinGroups.find(g => g.name === value);
    setSelectedGroup(group);
  };

  // 저장
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // ticker 중복 체크 (간단 구현 - 실제로는 4개 유형 전체 체크)
      const existingTicker = joinGroups.find(g =>
        g.ticker === values.ticker && (!selectedGroup || g.id !== selectedGroup.id)
      );

      if (existingTicker) {
        message.error('이미 다른 사업자가 사용중인 ticker입니다. 변경 후 재입력 해주세요');
        return;
      }

      // 사업자등록번호 중복 체크
      // TODO: 실제 구현 필요

      if (registrationType === 'new') {
        message.success(`조인유통 그룹 '${values.groupName}'이 등록되었습니다.`);
      } else {
        message.success(`사업자가 '${selectedGroup.name}'에 추가되었습니다.`);
      }

      navigate('/join-distribution');
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] p-4 md:p-6">
      {/* 헤더 */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/join-distribution')}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeftOutlined />
            목록으로
          </button>
          <h2 className="text-2xl font-bold text-gray-900">조인유통 등록</h2>
        </div>
      </div>

      {/* 등록 유형 선택 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
        <Radio.Group value={registrationType} onChange={handleTypeChange}>
          <Radio value="new">신규 조인유통그룹 생성</Radio>
          <Radio value="existing">기존 조인유통그룹에 사업자 추가</Radio>
        </Radio.Group>
      </div>

      <Form form={form} layout="vertical">
        {/* 기존 그룹 검색 (기존 그룹 추가 시) */}
        {registrationType === 'existing' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">조인유통그룹 검색</h3>
            <Form.Item
              name="searchGroup"
              label="조인유통그룹 검색"
              rules={[{ required: true, message: '조인유통그룹을 선택해주세요' }]}
            >
              <AutoComplete
                options={joinGroups.map(g => ({
                  value: g.name,
                  label: `${g.name} (담당자: ${g.salesPerson})`
                }))}
                onSelect={handleGroupSearch}
                placeholder="조인유통그룹명 입력"
                filterOption={(inputValue, option) =>
                  option.value.toLowerCase().includes(inputValue.toLowerCase())
                }
              />
            </Form.Item>

            {selectedGroup && (
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
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

        {/* 조인유통그룹 기본 정보 (신규 생성 시) */}
        {registrationType === 'new' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">조인유통그룹 기본 정보</h3>
            <Form.Item
              name="groupName"
              label="조인유통그룹명"
              rules={[
                { required: true, message: '조인유통그룹명을 입력해주세요' },
                { max: 30, message: '최대 30자까지 입력 가능합니다' },
                { pattern: /^[가-힣0-9()]+$/, message: '한글, 숫자, 괄호()만 허용됩니다' }
              ]}
            >
              <Input placeholder="예: 호경유통 그룹" />
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
                          style={{ marginBottom: 0 }}
                        >
                          <Input placeholder="김철수" maxLength={20} />
                        </Form.Item>
                        <Form.Item
                          {...field}
                          name={[field.name, 'position']}
                          label="직책"
                          style={{ marginBottom: 0 }}
                        >
                          <Input placeholder="대표" maxLength={20} />
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
              <Select placeholder="사업권역 선택">
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
              <Select placeholder="상세지역 선택">
                <Select.Option value="서울">서울</Select.Option>
                <Select.Option value="경기">경기</Select.Option>
                <Select.Option value="인천">인천</Select.Option>
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
              name="kakaoGroupName"
              label="카톡단톡방이름"
              rules={[{ max: 50, message: '최대 50자' }]}
            >
              <Input placeholder="예: [강남]호경유통 거래방" />
            </Form.Item>

            <Form.Item
              name="paymentCycle"
              label="결제주기(조건)"
              rules={[{ max: 200, message: '최대 200자' }]}
            >
              <Input.TextArea
                rows={3}
                placeholder="예: 기본 미수 3천 요구, 3천 초과분에 대해 랜덤하게 입금"
              />
            </Form.Item>

            <Form.Item
              name="arrivalPricePolicy"
              label="도착단가 정책 (상차단가+)"
              initialValue={0}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                addonAfter="원"
                placeholder="0"
              />
            </Form.Item>

            <Form.Item
              name="commissionRate"
              label="상차 수수료율(%)"
              rules={[
                { type: 'number', min: 0, max: 100, message: '0-100% 범위 입력' }
              ]}
              initialValue={0}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                max={100}
                step={0.1}
                placeholder="0.0"
              />
            </Form.Item>

            <Form.Item
              name="mainSuppliers"
              label="메인공급처"
              rules={[{ max: 100, message: '최대 100자' }]}
            >
              <Input placeholder="쉼표로 구분 (예: 동주유통, ING)" />
            </Form.Item>

            <Form.Item
              name="mainFarms"
              label="메인 양식장"
              rules={[{ max: 100, message: '최대 100자' }]}
            >
              <Input placeholder="쉼표로 구분 (예: 성호수산, 갑운수산)" />
            </Form.Item>

            <Form.Item name="financial" label="정성적 평가 - 재무상황">
              <Select placeholder="선택">
                <Select.Option value="좋음">좋음</Select.Option>
                <Select.Option value="보통">보통</Select.Option>
                <Select.Option value="나쁨">나쁨</Select.Option>
              </Select>
            </Form.Item>
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
                { pattern: /^\d{3}-\d{2}-\d{5}$/, message: 'XXX-XX-XXXXX 형식' }
              ]}
            >
              <Input placeholder="123-45-67890" />
            </Form.Item>

            <Form.Item
              name="businessName"
              label="사업자등록상호"
              rules={[
                { max: 50, message: '최대 50자까지 입력 가능합니다' }
              ]}
            >
              <Input placeholder="(주)호경유통" />
            </Form.Item>

            <Form.Item
              name="representative"
              label="대표자"
              rules={[
                { max: 10, message: '최대 10자까지 입력 가능합니다' }
              ]}
            >
              <Input placeholder="김호경" />
            </Form.Item>

            <Form.Item
              name="businessAddress"
              label="사업장등록주소"
              rules={[{ max: 100, message: '최대 100자까지 입력 가능합니다' }]}
            >
              <Input placeholder="서울시 강남구 테헤란로 123" />
            </Form.Item>

            <Form.Item
              name="joinName"
              label="조인유통명"
              rules={[
                { required: true, message: '조인유통명을 입력해주세요' },
                { max: 20, message: '최대 20자까지 입력 가능합니다' },
                { pattern: /^[가-힣a-zA-Z0-9()]+$/, message: '한글, 영문, 숫자, 괄호()만 허용됩니다' }
              ]}
            >
              <Input placeholder="호경" />
            </Form.Item>

            <Form.Item
              name="ticker"
              label="ticker"
              rules={[
                { required: true, message: 'ticker를 입력해주세요' },
                { max: 10, message: '최대 10자' },
                { pattern: /^[A-Za-z0-9]+$/, message: '영문, 숫자만 허용' }
              ]}
            >
              <Input placeholder="HK01" />
            </Form.Item>

            <Form.Item
              name="taxInvoiceEmail"
              label="세금계산서 발행 이메일주소"
              rules={[
                { type: 'email', message: '올바른 이메일 형식이 아닙니다' }
              ]}
            >
              <Input placeholder="hokyung@email.com" />
            </Form.Item>

            <Divider orientation="left">은행계좌정보</Divider>
            <Form.List name="bankAccounts" initialValue={[{}]}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field, index) => (
                    <div key={field.key} className="bg-gray-50 rounded-lg border border-gray-200 p-4 mb-3">
                      <Space align="start" style={{ width: '100%' }}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'bank']}
                          label="은행명"
                          style={{ marginBottom: 0 }}
                        >
                          <Input placeholder="하나은행" />
                        </Form.Item>
                        <Form.Item
                          {...field}
                          name={[field.name, 'accountNumber']}
                          label="계좌번호"
                          style={{ marginBottom: 0 }}
                        >
                          <Input placeholder="39484448392049" />
                        </Form.Item>
                        <Form.Item
                          {...field}
                          name={[field.name, 'holder']}
                          label="예금주"
                          style={{ marginBottom: 0 }}
                        >
                          <Input placeholder="김호경" />
                        </Form.Item>
                        {fields.length > 1 && (
                          <MinusCircleOutlined
                            onClick={() => remove(field.name)}
                            style={{ marginTop: 30 }}
                          />
                        )}
                      </Space>
                      {index === 0 && <Tag color="gold" style={{ marginTop: 8 }}>주사용 계좌</Tag>}
                    </div>
                  ))}
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    계좌 추가하기
                  </Button>
                </>
              )}
            </Form.List>

            <Divider />

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
          <Button size="large" onClick={() => navigate('/join-distribution')}>
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

export default JoinDistributionRegister;
