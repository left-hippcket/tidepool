import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Form, Input, Select, InputNumber, message, Modal, Tag, Image, Upload, Space, Card, Flex, Descriptions, Row, Col, Statistic, Typography } from 'antd';
import { ArrowLeftOutlined, EditOutlined, SaveOutlined, CloseOutlined, PlusOutlined, FileImageOutlined, MinusCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { sellerGroups, sellerDetails, managers, territories, regions, productCategories } from '../data/mockData';
import { Column } from '@ant-design/charts';

const { Title, Text } = Typography;

function SellerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [periodFilter, setPeriodFilter] = useState('3M');
  const [editMode, setEditMode] = useState(false);
  const [editingBusinessId, setEditingBusinessId] = useState(null);
  const [form] = Form.useForm();
  const [businessForm] = Form.useForm();

  const sellerGroup = sellerGroups.find(s => s.id === parseInt(id));
  const detail = sellerDetails[id];

  // 사업자 추가
  const handleAddBusiness = () => {
    navigate(`/seller/register?groupId=${id}&mode=add`);
  };

  // 편집 모드 진입
  const handleEditGroup = () => {
    form.setFieldsValue({
      name: sellerGroup.name,
      manager: sellerGroup.manager,
      mainCategory: sellerGroup.mainCategory,
      territory: sellerGroup.territory,
      region: sellerGroup.region,
      commissionRate: sellerGroup.commissionRate,
      status: sellerGroup.status,
      keymen: detail.keymen,
      financial: detail.qualitativeRatings.financial,
      quality: detail.qualitativeRatings.quality,
      priceCompetitive: detail.qualitativeRatings.priceCompetitive,
      claimCooperation: detail.qualitativeRatings.claimCooperation,
      lossProvision: detail.qualitativeRatings.lossProvision,
      farmArea: detail.additionalInfo.farmArea,
      annualProduction: detail.additionalInfo.annualProduction,
      mainDistributors: detail.additionalInfo.mainDistributors
    });
    setEditMode(true);
  };

  // 저장
  const handleSaveGroup = async () => {
    try {
      const values = await form.validateFields();
      message.success('셀러그룹 정보가 수정되었습니다.');
      setEditMode(false);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  // 취소
  const handleCancelEdit = () => {
    setEditMode(false);
    form.resetFields();
  };

  // 상태 변경 핸들러
  const handleStatusChange = (value) => {
    if (value === 'inactive') {
      const hasActiveBusiness = detail.businesses.some(b => b.status === 'active');
      if (hasActiveBusiness) {
        Modal.warning({
          title: '비활성화 불가',
          content: '소속 사업자 중 활성 상태인 사업자가 있습니다. 모든 사업자를 먼저 비활성화해주세요.',
          onOk: () => {
            form.setFieldsValue({ status: 'active' });
          }
        });
      }
    }
  };

  // 사업자 편집 모드 진입
  const handleEditBusiness = (business) => {
    businessForm.setFieldsValue({
      sellerName: business.sellerName,
      businessNumber: business.businessNumber,
      sellerId: business.sellerId,
      businessName: business.businessName,
      representative: business.representative,
      businessAddress: business.businessAddress,
      loadingAddress: business.loadingAddress,
      status: business.status,
      bankAccounts: business.bankAccounts || [{ bank: '', accountNumber: '', holder: '', isPrimary: false }],
      certificate: business.hasCertificate ? [{ uid: '-1', name: '사업자등록증.pdf', status: 'done' }] : []
    });
    setEditingBusinessId(business.id);
  };

  // 사업자 저장
  const handleSaveBusiness = async (businessId) => {
    try {
      const values = await businessForm.validateFields();
      message.success('사업자 정보가 수정되었습니다.');
      setEditingBusinessId(null);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  // 사업자 편집 취소
  const handleCancelBusinessEdit = () => {
    setEditingBusinessId(null);
    businessForm.resetFields();
  };

  // P2 샘플 데이터: 기간별 실적
  const samplePerformanceData = {
    '3M': [
      { period: '4월상순', purchase: 120000000, profit: 5400000, weight: 48, specs: '500g, 700g, 1.0kg', buyers: '노량진수산, 가락시장' },
      { period: '4월중순', purchase: 135000000, profit: 6100000, weight: 54, specs: '500g, 700g, 1.0kg', buyers: '노량진수산' },
      { period: '4월하순', purchase: 110000000, profit: 4950000, weight: 44, specs: '500g, 700g', buyers: '가락시장' },
      { period: '5월상순', purchase: 145000000, profit: 6525000, weight: 58, specs: '500g, 700g, 1.0kg, 1.2kg', buyers: '노량진수산, 가락시장, 부산공판장' },
      { period: '5월중순', purchase: 130000000, profit: 5850000, weight: 52, specs: '500g, 700g, 1.0kg', buyers: '노량진수산, 가락시장' },
      { period: '5월하순', purchase: 125000000, profit: 5625000, weight: 50, specs: '500g, 700g', buyers: '노량진수산' },
      { period: '6월상순', purchase: 150000000, profit: 6750000, weight: 60, specs: '500g, 700g, 1.0kg', buyers: '노량진수산, 가락시장' },
      { period: '6월중순', purchase: 140000000, profit: 6300000, weight: 56, specs: '500g, 700g, 1.0kg', buyers: '가락시장' },
      { period: '6월하순', purchase: 135000000, profit: 6075000, weight: 54, specs: '500g, 1.0kg', buyers: '노량진수산, 부산공판장' },
    ],
    'thisYear': [
      { period: '1월', purchase: 380000000, profit: 17100000, weight: 152, specs: '500g, 700g, 1.0kg', buyers: '노량진수산, 가락시장' },
      { period: '2월', purchase: 360000000, profit: 16200000, weight: 144, specs: '500g, 700g', buyers: '노량진수산' },
      { period: '3월', purchase: 410000000, profit: 18450000, weight: 164, specs: '500g, 700g, 1.0kg, 1.2kg', buyers: '노량진수산, 가락시장, 부산공판장' },
      { period: '4월', purchase: 365000000, profit: 16425000, weight: 146, specs: '500g, 700g, 1.0kg', buyers: '노량진수산, 가락시장' },
      { period: '5월', purchase: 400000000, profit: 18000000, weight: 160, specs: '500g, 700g, 1.0kg', buyers: '노량진수산, 가락시장' },
      { period: '6월', purchase: 425000000, profit: 19125000, weight: 170, specs: '500g, 700g, 1.0kg, 1.2kg', buyers: '노량진수산, 가락시장, 부산공판장' },
      { period: '7월', purchase: 180000000, profit: 8100000, weight: 72, specs: '500g, 700g', buyers: '노량진수산' },
    ]
  };

  const currentData = samplePerformanceData[periodFilter] || samplePerformanceData['3M'];

  const chartData = currentData.map(d => ({
    period: d.period,
    value: d.purchase / 100000000,
    type: '매입액'
  }));

  const chartConfig = {
    data: chartData,
    xField: 'period',
    yField: 'value',
    color: '#9CA3AF',
    columnStyle: {
      fill: '#9CA3AF',
    },
    label: {
      position: 'top',
      style: { fill: '#6B7280', fontSize: 10 }
    },
    xAxis: {
      label: { autoRotate: false, style: { fill: '#6B7280' } }
    },
    yAxis: {
      title: { text: '매입액 (억원)', style: { fill: '#6B7280' } },
      label: { style: { fill: '#6B7280' } }
    },
  };

  const qualitativeLabels = {
    financial: '재무상황',
    quality: '품질수준',
    priceCompetitive: '가격경쟁력',
    claimCooperation: '클레임협조도',
    lossProvision: '로스제공'
  };

  // 정성평가 값에 이모지 추가
  const qualitativeEmojis = {
    '최상': '👑',
    '좋음': '👍',
    '보통': '😐',
    '나쁨': '👎',
    '높음': '🔥',
    '낮음': '❄️',
    '넉넉함': '💯',
    '적당함': '⭐',
    '부족함': '⚠️'
  };

  const addEmoji = (value) => {
    const emoji = qualitativeEmojis[value];
    return emoji ? `${emoji} ${value}` : value;
  };

  if (!sellerGroup || !detail) {
    return (
      <div className="min-h-screen bg-[#f9fafb] p-6">
        <button
          onClick={() => navigate('/seller')}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ArrowLeftOutlined />
          목록으로 돌아가기
        </button>
        <div className="mt-8 text-lg text-gray-600">셀러 그룹을 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '16px 24px', background: '#f5f5f5' }}>
      {/* 헤더 */}
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Flex justify="space-between" align="center" wrap="wrap" gap="middle">
          <Space size="middle">
            <Button onClick={() => navigate('/seller')} icon={<ArrowLeftOutlined />}>
              목록으로
            </Button>
            <Title level={2} style={{ margin: 0 }}>{sellerGroup.name}</Title>
          </Space>
          <Tag color={sellerGroup.status === 'active' ? 'success' : 'default'}>
            {sellerGroup.status === 'active' ? '활성' : '비활성'}
          </Tag>
        </Flex>

      {/* 섹션 1: 셀러그룹 기본 정보 */}
      <Card
        title="셀러그룹 기본 정보"
        extra={
          editMode ? (
            <Space>
              <Button icon={<SaveOutlined />} type="primary" onClick={handleSaveGroup} size="small">
                저장
              </Button>
              <Button icon={<CloseOutlined />} onClick={handleCancelEdit} size="small">
                취소
              </Button>
            </Space>
          ) : (
            <Button type="link" onClick={handleEditGroup} icon={<EditOutlined />}>
              수정
            </Button>
          )
        }
      >
        {editMode ? (
          <Form form={form} layout="vertical">
            <Row gutter={16}>
              <Form.Item label="셀러그룹명" name="name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item label="소싱담당자" name="manager" rules={[{ required: true }]}>
                <Select>
                  {managers.map(m => (
                    <Select.Option key={m} value={m}>{m}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="주요품목분류" name="mainCategory" rules={[{ required: true }]}>
                <Select>
                  {productCategories.map(c => (
                    <Select.Option key={c.id} value={c.name}>{c.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="사업권역" name="territory" rules={[{ required: true }]}>
                <Select>
                  {territories
                    .filter(t => t.status === 'active')
                    .sort((a, b) => a.displayOrder - b.displayOrder)
                    .map(t => (
                      <Select.Option key={t.id} value={t.name}>{t.name}</Select.Option>
                    ))}
                </Select>
              </Form.Item>
              <Form.Item label="상세지역" name="region" rules={[{ required: true }]}>
                <Select>
                  {regions
                    .filter(r => r.status === 'active')
                    .sort((a, b) => a.displayOrder - b.displayOrder)
                    .map(r => (
                      <Select.Option key={r.id} value={r.name}>{r.name}</Select.Option>
                    ))}
                </Select>
              </Form.Item>
              <Form.Item label="상차 수수료율(%)" name="commissionRate" rules={[{ required: true }]}>
                <InputNumber style={{ width: '100%' }} min={0} max={100} step={0.1} />
              </Form.Item>
              <Form.Item label="상태" name="status" rules={[{ required: true }]}>
                <Select onChange={handleStatusChange}>
                  <Select.Option value="active">활성</Select.Option>
                  <Select.Option value="inactive">비활성</Select.Option>
                </Select>
              </Form.Item>
            </Row>

            {/* 키맨 정보 편집 */}
            <div style={{ marginTop: 24 }}>
              <Title level={5} style={{ marginBottom: 16 }}>키맨 정보</Title>
              <Form.List name="keymen">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map((field) => (
                      <div key={field.key} className="bg-gray-50 rounded-lg border border-gray-200 p-4 mb-3">
                        <div className="grid grid-cols-3 gap-4">
                          <Form.Item
                            {...field}
                            name={[field.name, 'name']}
                            label="이름"
                            rules={[{ required: true, message: '이름을 입력해주세요' }]}
                          >
                            <Input placeholder="김철수" />
                          </Form.Item>
                          <Form.Item
                            {...field}
                            name={[field.name, 'position']}
                            label="직책"
                          >
                            <Input placeholder="대표" />
                          </Form.Item>
                          <Form.Item
                            {...field}
                            name={[field.name, 'phone']}
                            label="연락처"
                            rules={[{ pattern: /^010-\d{4}-\d{4}$/, message: '010-XXXX-XXXX 형식' }]}
                          >
                            <Input placeholder="010-1234-5678" />
                          </Form.Item>
                        </div>
                        {fields.length > 1 && (
                          <Button onClick={() => remove(field.name)} icon={<MinusCircleOutlined />} size="small">
                            삭제
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button onClick={() => add()} icon={<PlusOutlined />} block type="dashed">
                      키맨 추가
                    </Button>
                  </>
                )}
              </Form.List>
            </div>

            {/* 정성적 평가 편집 */}
            <div className="mt-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">정성적 평가</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item label="재무상황" name="financial">
                  <Select>
                    <Select.Option value="최상">최상</Select.Option>
                    <Select.Option value="좋음">좋음</Select.Option>
                    <Select.Option value="보통">보통</Select.Option>
                    <Select.Option value="나쁨">나쁨</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item label="품질수준" name="quality">
                  <Select>
                    <Select.Option value="최상">최상</Select.Option>
                    <Select.Option value="좋음">좋음</Select.Option>
                    <Select.Option value="보통">보통</Select.Option>
                    <Select.Option value="나쁨">나쁨</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item label="가격경쟁력" name="priceCompetitive">
                  <Select>
                    <Select.Option value="높음">높음</Select.Option>
                    <Select.Option value="보통">보통</Select.Option>
                    <Select.Option value="낮음">낮음</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item label="클레임협조도" name="claimCooperation">
                  <Select>
                    <Select.Option value="좋음">좋음</Select.Option>
                    <Select.Option value="보통">보통</Select.Option>
                    <Select.Option value="나쁨">나쁨</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item label="로스제공" name="lossProvision">
                  <Select>
                    <Select.Option value="넉넉함">넉넉함</Select.Option>
                    <Select.Option value="적당함">적당함</Select.Option>
                    <Select.Option value="부족함">부족함</Select.Option>
                  </Select>
                </Form.Item>
              </div>
            </div>

            {/* 기타 정보 편집 */}
            <div className="mt-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">기타 정보</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Form.Item label="양식장 수면적(평)" name="farmArea">
                  <Input placeholder="15000" />
                </Form.Item>
                <Form.Item label="연간생산량(톤)" name="annualProduction">
                  <Input placeholder="120" />
                </Form.Item>
                <Form.Item label="메인 유통사" name="mainDistributors">
                  <Input placeholder="노량진수산, 가락시장" />
                </Form.Item>
              </div>
            </div>
          </Form>
        ) : (
          <>
            <Descriptions bordered column={{ xs: 1, sm: 2, md: 3 }} size="middle" style={{ marginBottom: 24 }}>
              <Descriptions.Item label="셀러그룹명">{sellerGroup.name}</Descriptions.Item>
              <Descriptions.Item label="소싱담당자">{sellerGroup.manager}</Descriptions.Item>
              <Descriptions.Item label="주요품목분류">{sellerGroup.mainCategory}</Descriptions.Item>
              <Descriptions.Item label="사업권역">{sellerGroup.territory}</Descriptions.Item>
              <Descriptions.Item label="상세지역">{sellerGroup.region}</Descriptions.Item>
              <Descriptions.Item label="상차 수수료율">{sellerGroup.commissionRate}%</Descriptions.Item>
              <Descriptions.Item label="사업자 수">{sellerGroup.businessCount}개</Descriptions.Item>
            </Descriptions>

            {/* 키맨 정보 */}
          <div className="mt-8">
            <h3 className="text-base font-semibold text-gray-900 mb-4">키맨 정보</h3>
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              {detail.keymen.map((keyman, index) => (
                <Col xs={24} md={12} key={index}>
                  <Card size="small">
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label="이름">{keyman.name}</Descriptions.Item>
                      <Descriptions.Item label="직책">{keyman.position}</Descriptions.Item>
                      <Descriptions.Item label="연락처">{keyman.phone}</Descriptions.Item>
                    </Descriptions>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>

          {/* 정성적 평가 */}
          <div style={{ marginTop: 32 }}>
            <Title level={5} style={{ marginBottom: 16 }}>정성적 평가</Title>
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              {Object.entries(detail.qualitativeRatings).map(([key, value]) => (
                <Col xs={12} sm={8} md={4} key={key}>
                  <Card size="small" style={{ textAlign: 'center', background: '#e6f4ff', borderColor: '#91caff' }}>
                    <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>{qualitativeLabels[key]}</Text>
                    <Text strong style={{ fontSize: 14, color: '#0958d9' }}>{addEmoji(value)}</Text>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>

          {/* 기타 정보 */}
          <div style={{ marginTop: 32 }}>
            <Title level={5} style={{ marginBottom: 16 }}>기타 정보</Title>
            <Descriptions bordered column={{ xs: 1, md: 3 }} size="small">
              <Descriptions.Item label="양식장 수면적">{detail.additionalInfo.farmArea}평</Descriptions.Item>
              <Descriptions.Item label="연간생산량">{detail.additionalInfo.annualProduction}톤</Descriptions.Item>
              <Descriptions.Item label="메인 유통사">{detail.additionalInfo.mainDistributors}</Descriptions.Item>
            </Descriptions>
          </div>
          </>
        )}
      </Card>

      {/* 섹션 2: 소속 사업자 정보 */}
      <Card title="소속 사업자 정보">
        <Row gutter={16}>
          {detail.businesses.map((business, index) => (
            <Col key={business.id} xs={24} lg={12}>
              <Card size="small" style={{ marginBottom: 16 }}>
              <Flex justify="space-between" align="center" wrap="wrap" gap="small" style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0', marginBottom: 16 }}>
                <Flex wrap="wrap" align="center" gap="small">
                  <Text strong>{business.sellerName}</Text>
                  <Tag
                    color={business.status === 'active' ? 'success' : 'default'}
                    style={{
                      border: business.status === 'active' ? '1px solid #b7eb8f' : 'none'
                    }}
                  >
                    {business.status === 'active' ? '활성' : '비활성'}
                  </Tag>
                  {business.hasCertificate ? (
                    <Image.PreviewGroup>
                      <Image
                        src="/images/business-certificate-sample.png"
                        alt="사업자등록증"
                        width={0}
                        height={0}
                        style={{ display: 'none' }}
                        preview={{
                          mask: null
                        }}
                      />
                      <Button
                        size="small"
                        icon={<FileImageOutlined />}
                        type="primary"
                        ghost
                        onClick={() => {
                          const img = document.querySelector(`img[alt="사업자등록증"]`);
                          if (img) img.click();
                        }}
                      >
                        사업자등록증
                      </Button>
                    </Image.PreviewGroup>
                  ) : (
                    <Tag style={{ backgroundColor: '#f5f5f5', color: '#8c8c8c', border: '1px solid #d9d9d9' }}>
                      사업자등록증 미첨부
                    </Tag>
                  )}
                </Flex>

                {editingBusinessId === business.id ? (
                  <Flex gap="small">
                    <Button
                      icon={<SaveOutlined />}
                      type="primary"
                      size="small"
                      onClick={() => handleSaveBusiness(business.id)}
                    >
                      저장
                    </Button>
                    <Button
                      icon={<CloseOutlined />}
                      size="small"
                      onClick={() => handleCancelBusinessEdit()}
                    >
                      취소
                    </Button>
                  </Flex>
                ) : (
                  <Button
                    type="link"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => handleEditBusiness(business)}
                  >
                    수정
                  </Button>
                )}
              </Flex>

              {editingBusinessId === business.id ? (
                <div style={{ padding: 16 }}>
                  <Form form={businessForm} layout="vertical">
                    <Row gutter={16}>
                      <Col xs={24}>
                        <Form.Item label="셀러명" name="sellerName">
                          <Input maxLength={20} />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item label="사업자등록번호" name="businessNumber">
                          <Input disabled style={{ backgroundColor: '#f5f5f5' }} />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item
                          label="ticker"
                          name="sellerId"
                          help="티커는 수정할 수 없습니다"
                        >
                          <Input disabled style={{ backgroundColor: '#f5f5f5' }} />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item label="사업자등록상호" name="businessName">
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item label="대표자" name="representative">
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col xs={24}>
                        <Form.Item label="사업자등록주소" name="businessAddress">
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col xs={24}>
                        <Form.Item label="상차지 주소" name="loadingAddress">
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item label="상태" name="status">
                          <Select>
                            <Select.Option value="active">활성</Select.Option>
                            <Select.Option value="inactive">비활성</Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>

                    {/* 은행계좌정보 */}
                    <div style={{ marginTop: 24 }}>
                      <Title level={5} style={{ marginBottom: 16 }}>은행계좌정보</Title>
                      <Form.List name="bankAccounts">
                        {(fields, { add, remove }) => (
                          <>
                            {fields.map((field, index) => (
                              <div key={field.key} style={{ background: '#fafafa', border: '1px solid #d9d9d9', borderRadius: 8, padding: 16, marginBottom: 12 }}>
                                <Space align="start" style={{ width: '100%', display: 'flex', flexWrap: 'wrap' }}>
                                  <Form.Item
                                    {...field}
                                    name={[field.name, 'bank']}
                                    label="은행명"
                                    style={{ marginBottom: 0, minWidth: 120 }}
                                  >
                                    <Input placeholder="하나은행" />
                                  </Form.Item>
                                  <Form.Item
                                    {...field}
                                    name={[field.name, 'accountNumber']}
                                    label="계좌번호"
                                    style={{ marginBottom: 0, minWidth: 180 }}
                                  >
                                    <Input placeholder="123-456789-01234" />
                                  </Form.Item>
                                  <Form.Item
                                    {...field}
                                    name={[field.name, 'holder']}
                                    label="예금주"
                                    style={{ marginBottom: 0, minWidth: 120 }}
                                  >
                                    <Input placeholder="박성호" />
                                  </Form.Item>
                                  <Form.Item
                                    {...field}
                                    name={[field.name, 'isPrimary']}
                                    valuePropName="checked"
                                    style={{ marginBottom: 0, marginTop: 24 }}
                                  >
                                    <Button type={index === 0 ? "primary" : "default"} size="small">
                                      {index === 0 ? "주사용" : "일반"}
                                    </Button>
                                  </Form.Item>
                                  {fields.length > 1 && (
                                    <MinusCircleOutlined
                                      onClick={() => remove(field.name)}
                                      style={{ marginTop: 30, color: '#ff4d4f', fontSize: 20 }}
                                    />
                                  )}
                                </Space>
                              </div>
                            ))}
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                              계좌 추가하기
                            </Button>
                          </>
                        )}
                      </Form.List>
                    </div>

                    {/* 사업자등록증 */}
                    <div style={{ marginTop: 24 }}>
                      <Form.Item
                        name="certificate"
                        label="사업자등록증"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => e?.fileList}
                      >
                        <Upload beforeUpload={() => false} maxCount={1} accept="image/*,.pdf">
                          <Button icon={<UploadOutlined />}>사업자등록증 업데이트 (최대 10MB)</Button>
                        </Upload>
                      </Form.Item>
                    </div>
                  </Form>
                </div>
              ) : (
                <Descriptions bordered column={{ xs: 1, md: 2 }} size="small">
                  <Descriptions.Item label="사업자등록번호">{business.businessNumber}</Descriptions.Item>
                  <Descriptions.Item label="ticker">{business.sellerId}</Descriptions.Item>
                  <Descriptions.Item label="사업자등록상호">{business.businessName}</Descriptions.Item>
                  <Descriptions.Item label="대표자">{business.representative}</Descriptions.Item>
                  <Descriptions.Item label="사업자등록주소" span={2}>{business.businessAddress}</Descriptions.Item>
                  <Descriptions.Item label="상차지 주소" span={2}>{business.loadingAddress}</Descriptions.Item>
                  <Descriptions.Item label="은행계좌" span={2}>
                    <Space direction="vertical" size="small">
                      {business.bankAccounts.map((account, idx) => (
                        <Flex key={idx} gap="small" align="center" wrap="wrap">
                          <Text>{account.bank} {account.accountNumber} ({account.holder})</Text>
                          {account.isPrimary && (
                            <Tag color="gold">주사용</Tag>
                          )}
                        </Flex>
                      ))}
                    </Space>
                  </Descriptions.Item>
                </Descriptions>
              )}
            </Card>
          </Col>
          ))}

          {/* 사업자 추가 카드 */}
          <Col xs={24} lg={12}>
            <Button
              onClick={handleAddBusiness}
              style={{
                width: '100%',
                minHeight: 200,
                borderStyle: 'dashed',
                borderWidth: 2
              }}
            >
              <Space direction="vertical" align="center">
                <div style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  border: '2px solid #d9d9d9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#fff'
                }}>
                  <PlusOutlined style={{ fontSize: 24 }} />
                </div>
                <Text style={{ fontSize: 16, fontWeight: 500 }}>사업자 추가</Text>
              </Space>
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 섹션 3: 거래 실적 (P2 샘플) */}
      <div className="bg-gray-50 rounded-lg shadow-sm border border-gray-300 p-6 opacity-60">
        <h2 className="text-lg font-semibold text-gray-500 mb-6">거래 실적 (P2 예정)</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-100 rounded-lg p-4 text-center border border-gray-300">
            <div className="text-xs text-gray-500 mb-2">매입액 (누적)</div>
            <div className="text-2xl font-bold text-gray-600">
              {(sellerGroup.totalPurchase / 100000000).toFixed(1)}억
            </div>
          </div>
          <div className="bg-gray-100 rounded-lg p-4 text-center border border-gray-300">
            <div className="text-xs text-gray-500 mb-2">매입액 (최근 3개월)</div>
            <div className="text-2xl font-bold text-gray-600">
              {(sellerGroup.purchase3M / 100000000).toFixed(1)}억
            </div>
          </div>
          <div className="bg-gray-100 rounded-lg p-4 text-center border border-gray-300">
            <div className="text-xs text-gray-500 mb-2">매입액 (최근 1개월)</div>
            <div className="text-2xl font-bold text-gray-600">
              {(sellerGroup.purchase1M / 100000000).toFixed(1)}억
            </div>
          </div>
          <div className="bg-gray-100 rounded-lg p-4 text-center border border-gray-300">
            <div className="text-xs text-gray-500 mb-2">최근거래일</div>
            <div className="text-2xl font-bold text-gray-600">
              {sellerGroup.lastTradeDate}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 mb-6"></div>

        {/* 기간 필터 */}
        <div className="mb-6 flex flex-wrap gap-2">
          {[
            { key: '1M', label: '최근 1개월' },
            { key: '3M', label: '최근 3개월' },
            { key: '6M', label: '최근 6개월' },
            { key: 'thisMonth', label: '이번달' },
            { key: 'thisQuarter', label: '이번분기' },
            { key: 'thisYear', label: '올해' },
            { key: 'total', label: '누적' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setPeriodFilter(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                periodFilter === key
                  ? 'bg-gray-400 text-gray-700 shadow-sm'
                  : 'bg-gray-200 text-gray-600 border border-gray-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* 기간별 실적 표 */}
        <div style={{ marginBottom: 24 }}>
          <Table
            dataSource={currentData}
            rowKey={(record, idx) => idx}
            pagination={false}
            size="small"
            columns={[
              {
                title: '기간',
                dataIndex: 'period',
                key: 'period',
              },
              {
                title: '매입액',
                dataIndex: 'purchase',
                key: 'purchase',
                align: 'right',
                render: (val) => `${(val / 100000000).toFixed(1)}억`
              },
              {
                title: '조정손익액',
                dataIndex: 'profit',
                key: 'profit',
                align: 'right',
                render: (val) => `${(val / 10000).toFixed(0)}만`
              },
              {
                title: '매입총중량(톤)',
                dataIndex: 'weight',
                key: 'weight',
                align: 'right',
              },
              {
                title: '출하규격',
                dataIndex: 'specs',
                key: 'specs',
              },
              {
                title: '출하바이어',
                dataIndex: 'buyers',
                key: 'buyers',
              },
            ]}
          />
        </div>

        {/* 매입액 막대차트 */}
        <div>
          <h3 className="text-base font-semibold text-gray-500 mb-4">매입액 추이</h3>
          <div className="bg-gray-100 rounded-lg p-4 border border-gray-300">
            <Column {...chartConfig} />
          </div>
        </div>
      </div>
      </Space>
    </div>
  );
}

export default SellerDetail;
