import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card, Form, Input, Select, Button, Radio, Space, Divider,
  message, AutoComplete, Upload, InputNumber, Tag
} from 'antd';
import {
  ArrowLeftOutlined, PlusOutlined, MinusCircleOutlined, UploadOutlined
} from '@ant-design/icons';
import { sellerGroups, managers, territories, productCategories, products } from '../data/mockData';

function SellerRegister() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [registrationType, setRegistrationType] = useState('new'); // 'new' | 'existing'
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);

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

  // 저장
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // ticker 중복 체크 (간단 구현 - 실제로는 4개 유형 전체 체크)
      const existingTicker = sellerGroups.find(g =>
        g.ticker === values.ticker && (!selectedGroup || g.id !== selectedGroup.id)
      );

      if (existingTicker) {
        message.error('이미 다른 사업자가 사용중인 ticker입니다. 변경 후 재입력 해주세요');
        return;
      }

      // 사업자등록번호 중복 체크
      // TODO: 실제 구현 필요

      if (registrationType === 'new') {
        message.success(`셀러 그룹 '${values.groupName}'이 등록되었습니다.`);
      } else {
        message.success(`사업자가 '${selectedGroup.name}'에 추가되었습니다.`);
      }

      navigate('/seller');
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <div>
      {/* 헤더 */}
      <div style={{ marginBottom: 24 }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/seller')}>
            목록으로
          </Button>
          <h2 style={{ margin: 0 }}>셀러 등록</h2>
        </Space>
      </div>

      {/* 등록 유형 선택 */}
      <Card style={{ marginBottom: 24 }}>
        <Radio.Group value={registrationType} onChange={handleTypeChange}>
          <Radio value="new">신규 셀러그룹 생성</Radio>
          <Radio value="existing">기존 셀러그룹에 사업자 추가</Radio>
        </Radio.Group>
      </Card>

      <Form form={form} layout="vertical">
        {/* 기존 그룹 검색 (기존 그룹 추가 시) */}
        {registrationType === 'existing' && (
          <Card title="셀러그룹 검색" style={{ marginBottom: 24 }}>
            <Form.Item
              name="searchGroup"
              label="셀러그룹 검색"
              rules={[{ required: true, message: '셀러그룹을 선택해주세요' }]}
            >
              <AutoComplete
                options={sellerGroups.map(g => ({
                  value: g.name,
                  label: `${g.name} (담당자: ${g.manager})`
                }))}
                onSelect={handleGroupSearch}
                placeholder="셀러그룹명 입력"
                filterOption={(inputValue, option) =>
                  option.value.toLowerCase().includes(inputValue.toLowerCase())
                }
              />
            </Form.Item>

            {selectedGroup && (
              <Card size="small" style={{ background: '#fafafa' }}>
                <div><strong>셀러그룹명:</strong> {selectedGroup.name}</div>
                <div><strong>소싱담당자:</strong> {selectedGroup.manager}</div>
                <div><strong>사업권역:</strong> {selectedGroup.territory}</div>
                <div><strong>상세지역:</strong> {selectedGroup.region}</div>
              </Card>
            )}
          </Card>
        )}

        {/* 셀러그룹 기본 정보 (신규 생성 시) */}
        {registrationType === 'new' && (
          <Card title="셀러그룹 기본 정보" style={{ marginBottom: 24 }}>
            <Form.Item
              name="groupName"
              label="셀러그룹명"
              rules={[
                { required: true, message: '셀러그룹명을 입력해주세요' },
                { max: 30, message: '최대 30자까지 입력 가능합니다' },
                { pattern: /^[가-힣0-9()]+$/, message: '한글, 숫자, 괄호()만 허용됩니다' }
              ]}
            >
              <Input placeholder="예: 성호수산" />
            </Form.Item>

            <Form.Item
              name="ticker"
              label="Ticker"
              rules={[{ required: true, message: 'Ticker를 입력해주세요' }]}
            >
              <Input placeholder="예: SH" maxLength={10} />
            </Form.Item>

            <Divider orientation="left">키맨 정보</Divider>
            <Form.List name="keymen" initialValue={[{}]}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field, index) => (
                    <Card key={field.key} size="small" style={{ marginBottom: 8 }}>
                      <Space align="start" style={{ width: '100%' }}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'name']}
                          label="이름"
                          rules={[{ required: true, message: '이름 입력' }]}
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
                          <Input placeholder="광어 사무장" maxLength={20} />
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
                    </Card>
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
                <Select.Option value="인천">인천</Select.Option>
                <Select.Option value="완도/진도">완도/진도</Select.Option>
                <Select.Option value="통영">통영</Select.Option>
                <Select.Option value="거제">거제</Select.Option>
                <Select.Option value="고흥">고흥</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="manager"
              label="소싱담당자"
              rules={[{ required: true, message: '소싱담당자를 선택해주세요' }]}
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
                mode="multiple"
                placeholder="품목분류 선택 (복수 선택 가능)"
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
                disabled={selectedCategory.length === 0}
              >
                {availableProducts.map(p => (
                  <Select.Option key={p.id} value={p.name}>
                    {p.categoryName} / {p.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Divider orientation="left">정성적 평가</Divider>
            <Form.Item name="financial" label="재무상황">
              <Select placeholder="선택">
                <Select.Option value="좋음">좋음</Select.Option>
                <Select.Option value="보통">보통</Select.Option>
                <Select.Option value="나쁨">나쁨</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="quality" label="품질수준">
              <Select placeholder="선택">
                <Select.Option value="최상">최상</Select.Option>
                <Select.Option value="좋음">좋음</Select.Option>
                <Select.Option value="보통">보통</Select.Option>
                <Select.Option value="나쁨">나쁨</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="priceCompetitive" label="가격경쟁력">
              <Select placeholder="선택">
                <Select.Option value="높음">높음</Select.Option>
                <Select.Option value="보통">보통</Select.Option>
                <Select.Option value="낮음">낮음</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="claimCooperation" label="클레임협조도">
              <Select placeholder="선택">
                <Select.Option value="좋음">좋음</Select.Option>
                <Select.Option value="보통">보통</Select.Option>
                <Select.Option value="나쁨">나쁨</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="lossProvision" label="로스제공">
              <Select placeholder="선택">
                <Select.Option value="넉넉함">넉넉함</Select.Option>
                <Select.Option value="적당함">적당함</Select.Option>
                <Select.Option value="부족함">부족함</Select.Option>
              </Select>
            </Form.Item>

            <Divider orientation="left">기타 정보</Divider>
            <Form.Item name="farmArea" label="양식장 수면적(평)">
              <InputNumber style={{ width: '100%' }} min={0} placeholder="15000" />
            </Form.Item>

            <Form.Item name="annualProduction" label="연간생산량(톤)">
              <InputNumber style={{ width: '100%' }} min={0} placeholder="120" />
            </Form.Item>

            <Form.Item name="mainDistributors" label="메인 유통사">
              <Input placeholder="노량진수산, 가락시장 (쉼표로 구분)" />
            </Form.Item>
          </Card>
        )}

        {/* 사업자 정보 (공통) */}
        {(registrationType === 'new' || selectedGroup) && (
          <Card title="사업자 정보" style={{ marginBottom: 24 }}>
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
                { max: 50, message: '최대 50자까지 입력 가능합니다' }
              ]}
            >
              <Input placeholder="영어조합법인 성호수산" />
            </Form.Item>

            <Form.Item
              name="representative"
              label="대표자"
              rules={[
                { required: true, message: '대표자를 입력해주세요' },
                { max: 10, message: '최대 10자까지 입력 가능합니다' }
              ]}
            >
              <Input placeholder="박성호" />
            </Form.Item>

            <Form.Item
              name="businessAddress"
              label="사업자등록주소"
              rules={[{ max: 100, message: '최대 100자까지 입력 가능합니다' }]}
            >
              <Input placeholder="경기도 수지구 동천동 230-3" />
            </Form.Item>

            <Form.Item
              name="sellerName"
              label="셀러명"
              rules={[
                { required: true, message: '셀러명을 입력해주세요' },
                { max: 20, message: '최대 20자까지 입력 가능합니다' },
                { pattern: /^[가-힣0-9()]+$/, message: '한글, 숫자, 괄호()만 허용됩니다' }
              ]}
            >
              <Input placeholder="성호1호" />
            </Form.Item>

            <Form.Item
              name="loadingAddress"
              label="상차지 주소"
              rules={[{ max: 100, message: '최대 100자까지 입력 가능합니다' }]}
            >
              <Input placeholder="전라남도 완도군 신지면 2-3" />
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

            <Divider orientation="left">은행계좌정보</Divider>
            <Form.List name="bankAccounts" initialValue={[{}]}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field, index) => (
                    <Card key={field.key} size="small" style={{ marginBottom: 8 }}>
                      <Space align="start" style={{ width: '100%' }}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'bank']}
                          label="은행명"
                          rules={[{ required: true, message: '은행명 입력' }]}
                          style={{ marginBottom: 0 }}
                        >
                          <Input placeholder="하나은행" />
                        </Form.Item>
                        <Form.Item
                          {...field}
                          name={[field.name, 'accountNumber']}
                          label="계좌번호"
                          rules={[{ required: true, message: '계좌번호 입력' }]}
                          style={{ marginBottom: 0 }}
                        >
                          <Input placeholder="39484448392049" />
                        </Form.Item>
                        <Form.Item
                          {...field}
                          name={[field.name, 'holder']}
                          label="예금주"
                          rules={[{ required: true, message: '예금주 입력' }]}
                          style={{ marginBottom: 0 }}
                        >
                          <Input placeholder="박성호" />
                        </Form.Item>
                        {fields.length > 1 && (
                          <MinusCircleOutlined
                            onClick={() => remove(field.name)}
                            style={{ marginTop: 30 }}
                          />
                        )}
                      </Space>
                      {index === 0 && <Tag color="gold" style={{ marginTop: 8 }}>주사용 계좌</Tag>}
                    </Card>
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
                <Button icon={<UploadOutlined />}>사업자등록증 첨부하기</Button>
              </Upload>
            </Form.Item>
          </Card>
        )}

        {/* 하단 버튼 */}
        <Space>
          <Button size="large" onClick={() => navigate('/seller')}>
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

export default SellerRegister;
