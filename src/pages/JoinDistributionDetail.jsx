import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Form, Input, Select, InputNumber, message, Modal, Image, Upload, Space, Card, Tag, Flex, Descriptions, Row, Col, Statistic, Table, Typography } from 'antd';
import { ArrowLeftOutlined, EditOutlined, SaveOutlined, CloseOutlined, PlusOutlined, FileImageOutlined, MinusCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { joinGroups, joinDetails, managers, territories, joinSalesDetails, joinSalesHistoryMemos } from '../data/mockData';

const { Title, Text } = Typography;

function JoinDistributionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [editingBusinessId, setEditingBusinessId] = useState(null);
  const [periodFilter, setPeriodFilter] = useState('3M');
  const [isAddingMemo, setIsAddingMemo] = useState(false);
  const [editingMemoId, setEditingMemoId] = useState(null);
  const [memoContent, setMemoContent] = useState('');
  const [form] = Form.useForm();
  const [businessForm] = Form.useForm();

  const joinGroup = joinGroups.find(j => j.id === parseInt(id));
  const detail = joinDetails[id];

  if (!joinGroup || !detail) {
    return (
      <div style={{ minHeight: '100vh', padding: 24, background: '#f5f5f5' }}>
        <Button onClick={() => navigate('/join-distribution')} icon={<ArrowLeftOutlined />}>
          목록으로 돌아가기
        </Button>
        <Card style={{ marginTop: 24 }}>
          <Text type="secondary">조인유통 그룹을 찾을 수 없습니다.</Text>
        </Card>
      </div>
    );
  }

  // 사업자 추가
  const handleAddBusiness = () => {
    navigate(`/join-distribution/register?groupId=${id}&mode=add`);
  };

  // 편집 모드 진입
  const handleEditGroup = () => {
    form.setFieldsValue({
      name: joinGroup.name,
      salesPerson: joinGroup.salesPerson,
      territory: joinGroup.territory,
      region: joinGroup.region,
      kakaoGroupName: detail.kakaoGroupName,
      paymentCycle: detail.paymentCycle,
      arrivalPricePolicy: detail.arrivalPricePolicy,
      commissionRate: detail.commissionRate,
      mainSuppliers: detail.mainSuppliers,
      mainFarms: detail.mainFarms,
      financial: detail.financial,
      status: joinGroup.status
    });
    setEditMode(true);
  };

  // 저장
  const handleSaveGroup = async () => {
    try {
      const values = await form.validateFields();

      // 비활성화 시도 시 조건 체크
      if (values.status === 'inactive' && joinGroup.status === 'active') {
        const activeBusinessCount = detail.businesses.filter(b => b.status === 'active').length;
        if (activeBusinessCount > 0) {
          Modal.error({
            title: '비활성화 불가',
            content: `소속된 사업자가 ${activeBusinessCount}개 활성 상태로 남아있어 그룹을 비활성화할 수 없습니다. 먼저 모든 사업자를 비활성화해주세요.`,
          });
          form.setFieldsValue({ status: 'active' });
          return;
        }

        Modal.confirm({
          title: '조인유통 그룹 비활성화',
          content: '이 조인유통 그룹을 비활성화하시겠습니까? 비활성화 후에는 목록에서 \'비활성\' 필터를 통해서만 조회할 수 있습니다.',
          onOk: () => {
            message.success('조인유통 그룹이 비활성화되었습니다.');
            setEditMode(false);
            navigate('/join-distribution');
          },
        });
      } else {
        message.success('조인유통 그룹 정보가 수정되었습니다.');
        setEditMode(false);
      }
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
      // 비활성화 확인은 저장 버튼 클릭 시 처리
    }
  };

  // 사업자 편집 모드 진입
  const handleEditBusiness = (business) => {
    businessForm.setFieldsValue({
      businessNumber: business.businessNumber,
      ticker: business.ticker,
      businessName: business.businessName,
      representative: business.representative,
      businessAddress: business.businessAddress,
      joinName: business.joinName,
      taxInvoiceEmail: business.taxInvoiceEmail,
      status: business.status,
      bankAccounts: business.bankAccounts || [{ bank: '', accountNumber: '', holder: '', isPrimary: false }],
      certificate: business.hasCertificate ? [{ uid: '-1', name: '사업자등록증.pdf', status: 'done' }] : []
    });
    setEditingBusinessId(business.id);
  };

  // 사업자 저장
  const handleSaveBusiness = async (business) => {
    try {
      const values = await businessForm.validateFields();

      // 비활성화 시도 시 확인
      if (values.status === 'inactive' && business.status === 'active') {
        Modal.confirm({
          title: '사업자 비활성화',
          content: '이 사업자를 비활성화하시겠습니까? 비활성화 후에는 신규 거래 시 선택할 수 없습니다.',
          onOk: () => {
            message.success('사업자가 비활성화되었습니다.');
            setEditingBusinessId(null);
          },
        });
      } else if (values.status === 'active' && business.status === 'inactive') {
        message.success('사업자가 활성화되었습니다.');
        setEditingBusinessId(null);
      } else {
        message.success('사업자 정보가 수정되었습니다.');
        setEditingBusinessId(null);
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  // 사업자 편집 취소
  const handleCancelBusinessEdit = () => {
    setEditingBusinessId(null);
    businessForm.resetFields();
  };

  return (
    <div style={{ minHeight: '100vh', padding: '16px 24px', background: '#f5f5f5' }}>
      {/* 헤더 */}
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Flex justify="space-between" align="center" wrap="wrap" gap="middle">
          <Space size="middle">
            <Button onClick={() => navigate('/join-distribution')} icon={<ArrowLeftOutlined />}>
              목록으로
            </Button>
            <Title level={2} style={{ margin: 0 }}>{joinGroup.name}</Title>
          </Space>
          <Tag color={joinGroup.status === 'active' ? 'success' : 'default'}>
            {joinGroup.status === 'active' ? '활성' : '비활성'}
          </Tag>
        </Flex>

      {/* 섹션 1: 조인유통그룹 기본 정보 */}
      <Card
        title="조인유통그룹 기본 정보"
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
              <Col xs={24} md={12}>
                <Form.Item label="조인유통그룹명" name="name" rules={[{ required: true }]}>
                  <Input maxLength={30} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="담당영업사원" name="salesPerson" rules={[{ required: true }]}>
                  <Select>
                    {managers.map(m => (
                      <Select.Option key={m} value={m}>{m}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="사업권역" name="territory" rules={[{ required: true }]}>
                  <Select>
                    {territories.filter(t => t.status === 'active').map(t => (
                      <Select.Option key={t.id} value={t.name}>{t.name}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="상세지역" name="region" rules={[{ required: true }]}>
                  <Select>
                    <Select.Option value="서울">서울</Select.Option>
                    <Select.Option value="경기">경기</Select.Option>
                    <Select.Option value="인천">인천</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="카톡단톡방이름" name="kakaoGroupName">
                  <Input maxLength={50} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="결제주기(조건)" name="paymentCycle">
                  <Input.TextArea rows={2} maxLength={200} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="도착단가 정책 (상차단가+)" name="arrivalPricePolicy">
                  <InputNumber style={{ width: '100%' }} min={0} addonAfter="원" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="상차 수수료율(%)" name="commissionRate" rules={[{ required: true }]}>
                  <InputNumber style={{ width: '100%' }} min={0} max={100} step={0.1} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="메인판매처" name="mainSuppliers">
                  <Input placeholder="쉼표로 구분" maxLength={100} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="메인 양식장" name="mainFarms">
                  <Input placeholder="쉼표로 구분" maxLength={100} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="정성적 평가 - 재무상황" name="financial">
                  <Select placeholder="선택">
                    <Select.Option value="좋음">좋음</Select.Option>
                    <Select.Option value="보통">보통</Select.Option>
                    <Select.Option value="나쁨">나쁨</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="상태" name="status" rules={[{ required: true }]}>
                  <Select onChange={handleStatusChange}>
                    <Select.Option value="active">활성</Select.Option>
                    <Select.Option value="inactive">비활성</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        ) : (
          <Descriptions column={{ xs: 1, sm: 2, md: 3 }} bordered>
            <Descriptions.Item label="조인유통그룹명">{joinGroup.name}</Descriptions.Item>
            <Descriptions.Item label="담당영업사원">{joinGroup.salesPerson}</Descriptions.Item>
            <Descriptions.Item label="사업권역">{joinGroup.territory}</Descriptions.Item>
            <Descriptions.Item label="상세지역">{joinGroup.region}</Descriptions.Item>
            <Descriptions.Item label="카톡단톡방이름">{detail.kakaoGroupName || '-'}</Descriptions.Item>
            <Descriptions.Item label="결제주기">{detail.paymentCycle || '-'}</Descriptions.Item>
            <Descriptions.Item label="도착단가 정책">상차단가 + {detail.arrivalPricePolicy}원</Descriptions.Item>
            <Descriptions.Item label="상차 수수료율">{detail.commissionRate}%</Descriptions.Item>
            <Descriptions.Item label="메인판매처">{detail.mainSuppliers || '-'}</Descriptions.Item>
            <Descriptions.Item label="메인 양식장">{detail.mainFarms || '-'}</Descriptions.Item>
            <Descriptions.Item label="재무상황">{detail.financial || '-'}</Descriptions.Item>
            <Descriptions.Item label="사업자 수">{joinGroup.businessCount}개</Descriptions.Item>
          </Descriptions>
        )}

        {/* 키맨 정보 */}
        <Title level={5} style={{ marginTop: 24 }}>키맨 정보</Title>
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          {detail.keymen.map((keyman, index) => (
            <Card key={index} size="small" style={{ background: '#fafafa' }}>
              <Row gutter={16}>
                <Col xs={24} sm={8}>
                  <Text type="secondary" style={{ fontSize: 12 }}>이름</Text>
                  <div><Text strong>{keyman.name}</Text></div>
                </Col>
                <Col xs={24} sm={8}>
                  <Text type="secondary" style={{ fontSize: 12 }}>직책</Text>
                  <div><Text strong>{keyman.position}</Text></div>
                </Col>
                <Col xs={24} sm={8}>
                  <Text type="secondary" style={{ fontSize: 12 }}>연락처</Text>
                  <div><Text strong>{keyman.phone}</Text></div>
                </Col>
              </Row>
            </Card>
          ))}
        </Space>
      </Card>

      {/* 섹션 2: 소속 사업자 정보 */}
      <Card title="소속 사업자 정보">
        <Row gutter={[16, 16]}>
          {detail.businesses.map((business) => (
            <Col xs={24} lg={12} key={business.id}>
              <Card
                size="small"
                title={
                  <Space>
                    <Text strong>{business.joinName}</Text>
                    <Tag color={business.status === 'active' ? 'success' : 'default'}>
                      {business.status === 'active' ? '활성' : '비활성'}
                    </Tag>
                  <Image.PreviewGroup>
                    <Image
                      src="/images/business-certificate-sample.png"
                      alt={`사업자등록증-${business.id}`}
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
                        const img = document.querySelector(`img[alt="사업자등록증-${business.id}"]`);
                        if (img) img.click();
                      }}
                    >
                      사업자등록증
                    </Button>
                  </Image.PreviewGroup>
                  </Space>
                }
                extra={
                  editingBusinessId === business.id ? (
                    <Space>
                    <Button
                      icon={<SaveOutlined />}
                      type="primary"
                      size="small"
                      onClick={() => handleSaveBusiness(business)}
                    >
                      저장
                    </Button>
                    <Button
                      icon={<CloseOutlined />}
                      size="small"
                      onClick={handleCancelBusinessEdit}
                    >
                      취소
                    </Button>
                  </Space>
                  ) : (
                    <Button type="link" onClick={() => handleEditBusiness(business)} icon={<EditOutlined />}>
                      수정
                    </Button>
                  )
                }
              >
              {editingBusinessId === business.id ? (
                <Form form={businessForm} layout="vertical">
                  <Row gutter={16}>
                      <Col span={24}>
                        <Form.Item label="조인유통명" name="joinName">
                          <Input maxLength={20} />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item label="사업자등록번호" name="businessNumber">
                          <Input disabled style={{ background: '#f5f5f5' }} />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item label="ticker" name="ticker">
                          <Input disabled style={{ background: '#f5f5f5' }} />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item label="사업자등록상호" name="businessName">
                          <Input maxLength={50} />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item label="대표자" name="representative">
                          <Input maxLength={10} />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item label="사업자등록주소" name="businessAddress">
                          <Input maxLength={100} />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item label="세금계산서 이메일" name="taxInvoiceEmail">
                          <Input type="email" />
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
                              <div key={field.key} className="bg-gray-50 rounded-lg border border-gray-200 p-4 mb-3">
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
                                    <Input placeholder="김호경" />
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
                    <div className="mt-6">
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
              ) : (
                  <Descriptions column={{ xs: 1, md: 2 }} size="small" bordered>
                    <Descriptions.Item label="사업자등록번호">{business.businessNumber}</Descriptions.Item>
                    <Descriptions.Item label="ticker">{business.ticker}</Descriptions.Item>
                    <Descriptions.Item label="사업자등록상호">{business.businessName}</Descriptions.Item>
                    <Descriptions.Item label="대표자">{business.representative}</Descriptions.Item>
                    <Descriptions.Item label="사업자등록주소" span={2}>{business.businessAddress}</Descriptions.Item>
                    <Descriptions.Item label="세금계산서 이메일" span={2}>{business.taxInvoiceEmail}</Descriptions.Item>
                    <Descriptions.Item label="은행계좌">
                      <Space direction="vertical" size="small">
                        {business.bankAccounts.map((account, idx) => (
                          <div key={idx}>
                            <Text>{account.bank} {account.accountNumber} ({account.holder})</Text>
                            {idx === 0 && <Tag color="gold" style={{ marginLeft: 8 }}>주사용</Tag>}
                          </div>
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
            <Card
              onClick={handleAddBusiness}
              hoverable
              style={{
                height: 200,
                borderStyle: 'dashed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              bodyStyle={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <PlusOutlined style={{ fontSize: 32, marginBottom: 8 }} />
              <Text>사업자 추가</Text>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* P2 섹션 시작 */}
      {joinSalesDetails[id] && (
        <div className="opacity-60">
          {/* 기간 필터 버튼 */}
          <div className="bg-gray-50 rounded-lg shadow-sm border border-gray-300 p-4 mb-6">
            <div className="flex flex-wrap gap-2">
              {['1M', '3M', '6M', 'thisMonth', 'thisQuarter', 'thisYear', 'all'].map((period) => (
                <button
                  key={period}
                  onClick={() => setPeriodFilter(period)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    periodFilter === period
                      ? 'bg-gray-400 text-gray-700'
                      : 'bg-gray-200 text-gray-600 border border-gray-300'
                  }`}
                >
                  {period === '1M' && '최근 1개월'}
                  {period === '3M' && '최근 3개월'}
                  {period === '6M' && '최근 6개월'}
                  {period === 'thisMonth' && '이번달'}
                  {period === 'thisQuarter' && '이번분기'}
                  {period === 'thisYear' && '올해'}
                  {period === 'all' && '누적'}
                </button>
              ))}
            </div>
          </div>

          {/* 섹션 3: 통합지표 & 등급 정보 */}
          <Row gutter={24} style={{ marginBottom: 24 }}>
            {/* 통합지표 */}
            <Col xs={24} lg={12}>
              <Card style={{ backgroundColor: '#fafafa' }}>
                <Title level={5} style={{ color: '#8c8c8c', marginBottom: 16 }}>통합지표 (P2 예정) (최근 3개월)</Title>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Text style={{ display: 'block', fontSize: 14, color: '#8c8c8c', marginBottom: 4 }}>매입액</Text>
                    <Text style={{ display: 'block', fontSize: 20, fontWeight: 'bold', color: '#595959' }}>
                      {(joinSalesDetails[id].metrics.totalPurchase / 100000000).toFixed(1)}억
                    </Text>
                  </Col>
                  <Col span={12}>
                    <Text style={{ display: 'block', fontSize: 14, color: '#8c8c8c', marginBottom: 4 }}>매출액</Text>
                    <Text style={{ display: 'block', fontSize: 20, fontWeight: 'bold', color: '#595959' }}>
                      {(joinSalesDetails[id].metrics.totalSales / 100000000).toFixed(1)}억
                    </Text>
                  </Col>
                  <Col span={12}>
                    <Text style={{ display: 'block', fontSize: 14, color: '#8c8c8c', marginBottom: 4 }}>조정손익액</Text>
                    <Text style={{ display: 'block', fontSize: 20, fontWeight: 'bold', color: '#595959' }}>
                      {(joinSalesDetails[id].metrics.adjustedProfit / 100000000).toFixed(1)}억
                    </Text>
                  </Col>
                  <Col span={12}>
                    <Text style={{ display: 'block', fontSize: 14, color: '#8c8c8c', marginBottom: 4 }}>조정손익률</Text>
                    <Text style={{ display: 'block', fontSize: 20, fontWeight: 'bold', color: '#595959' }}>
                      {joinSalesDetails[id].metrics.adjustedProfitRate}%
                    </Text>
                  </Col>
                  <Col span={12}>
                    <Text style={{ display: 'block', fontSize: 14, color: '#8c8c8c', marginBottom: 4 }}>기말미수금</Text>
                    <Text style={{ display: 'block', fontSize: 20, fontWeight: 'bold', color: '#595959' }}>
                      {(joinSalesDetails[id].metrics.receivable / 100000000).toFixed(1)}억
                    </Text>
                  </Col>
                  <Col span={12}>
                    <Text style={{ display: 'block', fontSize: 14, color: '#8c8c8c', marginBottom: 4 }}>자본회전율</Text>
                    <Text style={{ display: 'block', fontSize: 20, fontWeight: 'bold', color: '#595959' }}>
                      {joinSalesDetails[id].metrics.turnoverRate}
                    </Text>
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* 등급 정보 */}
            <Col xs={24} lg={12}>
              <Card style={{ backgroundColor: '#fafafa' }}>
                <Title level={5} style={{ color: '#8c8c8c', marginBottom: 16 }}>조인유통 등급 (P2 예정)</Title>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <div style={{ backgroundColor: '#f5f5f5', borderRadius: 8, padding: 16, border: '1px solid #d9d9d9' }}>
                      <Text style={{ display: 'block', fontSize: 14, color: '#8c8c8c', marginBottom: 4 }}>매입액 순위</Text>
                      <Text style={{ display: 'block', fontSize: 24, fontWeight: 'bold', color: '#595959' }}>
                        상위 {joinSalesDetails[id].grade.purchaseRank}%
                      </Text>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div style={{ backgroundColor: '#f5f5f5', borderRadius: 8, padding: 16, border: '1px solid #d9d9d9' }}>
                      <Text style={{ display: 'block', fontSize: 14, color: '#8c8c8c', marginBottom: 4 }}>매출액 순위</Text>
                      <Text style={{ display: 'block', fontSize: 24, fontWeight: 'bold', color: '#595959' }}>
                        상위 {joinSalesDetails[id].grade.salesRank}%
                      </Text>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div style={{ backgroundColor: '#f5f5f5', borderRadius: 8, padding: 16, border: '1px solid #d9d9d9' }}>
                      <Text style={{ display: 'block', fontSize: 14, color: '#8c8c8c', marginBottom: 4 }}>거래손익 순위</Text>
                      <Text style={{ display: 'block', fontSize: 24, fontWeight: 'bold', color: '#595959' }}>
                        상위 {joinSalesDetails[id].grade.profitRank}%
                      </Text>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div style={{ backgroundColor: '#f5f5f5', borderRadius: 8, padding: 16, border: '1px solid #d9d9d9' }}>
                      <Text style={{ display: 'block', fontSize: 14, color: '#8c8c8c', marginBottom: 4 }}>자본회전율 등급</Text>
                      <Text style={{ display: 'block', fontSize: 24, fontWeight: 'bold', color: '#595959' }}>
                        {joinSalesDetails[id].grade.turnoverGrade}
                      </Text>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>

          {/* 섹션 4: 거래 세부내역 */}
          <Card style={{ backgroundColor: '#fafafa', marginBottom: 24 }}>
            <Title level={5} style={{ color: '#8c8c8c', marginBottom: 24 }}>거래 세부내역 (P2 예정)</Title>

            {/* 테이블 */}
            <div style={{ marginBottom: 24 }}>
              <Table
                dataSource={joinSalesDetails[id].periods}
                rowKey={(record, idx) => idx}
                pagination={false}
                size="small"
                scroll={{ x: 'max-content' }}
                columns={[
                  {
                    title: '기간',
                    dataIndex: 'period',
                    key: 'period',
                    fixed: 'left',
                  },
                  {
                    title: '매입액',
                    dataIndex: 'purchase',
                    key: 'purchase',
                    align: 'right',
                    render: (val) => `${(val / 10000000).toFixed(1)}백만`
                  },
                  {
                    title: '매출액',
                    dataIndex: 'sales',
                    key: 'sales',
                    align: 'right',
                    render: (val) => `${(val / 10000000).toFixed(1)}백만`
                  },
                  {
                    title: '조정손익액',
                    dataIndex: 'profit',
                    key: 'profit',
                    align: 'right',
                    render: (val) => <Text strong>{(val / 10000000).toFixed(1)}백만</Text>
                  },
                  {
                    title: '매입총중량(톤)',
                    dataIndex: 'purchaseWeight',
                    key: 'purchaseWeight',
                    align: 'right',
                  },
                  {
                    title: '매출총중량(톤)',
                    dataIndex: 'salesWeight',
                    key: 'salesWeight',
                    align: 'right',
                  },
                  {
                    title: '출하규격',
                    dataIndex: 'specs',
                    key: 'specs',
                  },
                  {
                    title: '출하셀러',
                    dataIndex: 'sellers',
                    key: 'sellers',
                  },
                  {
                    title: '판매바이어',
                    dataIndex: 'buyers',
                    key: 'buyers',
                  },
                  {
                    title: '거래품목',
                    dataIndex: 'products',
                    key: 'products',
                  },
                ]}
              />
            </div>

            {/* 차트 */}
            <div style={{ marginTop: 24 }}>
              <Title level={5} style={{ color: '#8c8c8c', marginBottom: 16 }}>매입액/매출액 추이</Title>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8, height: 256, borderLeft: '2px solid #8c8c8c', borderBottom: '2px solid #8c8c8c', paddingLeft: 8, paddingBottom: 8, position: 'relative' }}>
                <div style={{ position: 'absolute', left: -64, top: 0, bottom: 48, display: 'flex', alignItems: 'center' }}>
                  <Text style={{ fontSize: 14, color: '#8c8c8c', transform: 'rotate(-90deg)', whiteSpace: 'nowrap' }}>금액 (백만원)</Text>
                </div>
                {joinSalesDetails[id].periods.map((p, idx) => {
                  const maxAmount = Math.max(...joinSalesDetails[id].periods.map(period => Math.max(period.purchase, period.sales)));
                  const purchaseHeight = (p.purchase / maxAmount) * 100;
                  const salesHeight = (p.sales / maxAmount) * 100;

                  return (
                    <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: '100%' }}>
                      <div style={{ width: '100%', display: 'flex', gap: 4, alignItems: 'flex-end', justifyContent: 'center', height: '100%' }}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                          <Text style={{ fontSize: 12, color: '#8c8c8c', fontWeight: 500, marginBottom: 4 }}>
                            {(p.purchase / 10000000).toFixed(0)}
                          </Text>
                          <div
                            style={{
                              width: '100%',
                              background: 'linear-gradient(to top, #8c8c8c, #bfbfbf)',
                              borderRadius: '4px 4px 0 0',
                              height: `${purchaseHeight}%`,
                              minHeight: 4
                            }}
                            title={`매입: ${(p.purchase / 10000000).toFixed(1)}백만원`}
                          />
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                          <Text style={{ fontSize: 12, color: '#8c8c8c', fontWeight: 500, marginBottom: 4 }}>
                            {(p.sales / 10000000).toFixed(0)}
                          </Text>
                          <div
                            style={{
                              width: '100%',
                              background: 'linear-gradient(to top, #595959, #8c8c8c)',
                              borderRadius: '4px 4px 0 0',
                              height: `${salesHeight}%`,
                              minHeight: 4
                            }}
                            title={`매출: ${(p.sales / 10000000).toFixed(1)}백만원`}
                          />
                        </div>
                      </div>
                      <Text style={{ fontSize: 12, color: '#8c8c8c', marginTop: 8, transform: 'rotate(-45deg)', transformOrigin: 'top left', whiteSpace: 'nowrap' }}>
                        {p.period}
                      </Text>
                    </div>
                  );
                })}
              </div>
              <Flex justify="center" gap="large" style={{ marginTop: 24 }}>
                <Flex align="center" gap="small">
                  <div style={{ width: 16, height: 16, background: 'linear-gradient(to top, #8c8c8c, #bfbfbf)', borderRadius: 4 }}></div>
                  <Text style={{ fontSize: 14, color: '#8c8c8c' }}>매입액</Text>
                </Flex>
                <Flex align="center" gap="small">
                  <div style={{ width: 16, height: 16, background: 'linear-gradient(to top, #595959, #8c8c8c)', borderRadius: 4 }}></div>
                  <Text style={{ fontSize: 14, color: '#8c8c8c' }}>매출액</Text>
                </Flex>
              </Flex>
            </div>
          </Card>
        </div>
      )}

      {/* 섹션 5: 세일즈 히스토리 (P2) */}
      {joinSalesHistoryMemos[id] && (
        <Card style={{ backgroundColor: '#fafafa', opacity: 0.6 }}>
          <Flex justify="space-between" align="center" style={{ marginBottom: 24 }}>
            <Title level={5} style={{ color: '#8c8c8c', margin: 0 }}>세일즈 히스토리 (P2 예정)</Title>
            <Button
              type="link"
              icon={<PlusOutlined />}
              onClick={() => {
                setIsAddingMemo(true);
                setMemoContent('');
              }}
            >
              메모 추가
            </Button>
          </Flex>

          {/* 메모 추가 폼 */}
          {isAddingMemo && (
            <Card size="small" style={{ backgroundColor: '#e6f7ff', border: '1px solid #91d5ff', marginBottom: 16 }}>
              <Input.TextArea
                value={memoContent}
                onChange={(e) => setMemoContent(e.target.value)}
                placeholder="영업 활동 내역을 입력하세요..."
                rows={4}
              />
              <Space style={{ marginTop: 12 }}>
                <Button
                  type="primary"
                  size="small"
                  onClick={() => {
                    if (memoContent.trim()) {
                      message.success('메모가 추가되었습니다.');
                      setIsAddingMemo(false);
                      setMemoContent('');
                    }
                  }}
                >
                  저장
                </Button>
                <Button
                  size="small"
                  onClick={() => {
                    setIsAddingMemo(false);
                    setMemoContent('');
                  }}
                >
                  취소
                </Button>
              </Space>
            </Card>
          )}

          {/* 메모 타임라인 */}
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            {joinSalesHistoryMemos[id].map((memo) => (
              <div key={memo.id} style={{ borderLeft: '2px solid #1890ff', paddingLeft: 16, paddingTop: 8, paddingBottom: 8 }}>
                <Flex justify="space-between" align="flex-start" style={{ marginBottom: 8 }}>
                  <div>
                    <Text style={{ fontSize: 14, fontWeight: 500 }}>{memo.author}</Text>
                    <br />
                    <Text style={{ fontSize: 12, color: '#8c8c8c' }}>{memo.date}</Text>
                  </div>
                  {editingMemoId === memo.id ? (
                    <Space size="small">
                      <Button
                        type="primary"
                        size="small"
                        onClick={() => {
                          message.success('메모가 수정되었습니다.');
                          setEditingMemoId(null);
                        }}
                      >
                        저장
                      </Button>
                      <Button
                        size="small"
                        onClick={() => setEditingMemoId(null)}
                      >
                        취소
                      </Button>
                    </Space>
                  ) : (
                    <Space size="small">
                      <Button
                        type="link"
                        size="small"
                        onClick={() => setEditingMemoId(memo.id)}
                      >
                        수정
                      </Button>
                      <Button
                        type="link"
                        size="small"
                        danger
                        onClick={() => {
                          Modal.confirm({
                            title: '메모 삭제',
                            content: '이 메모를 삭제하시겠습니까?',
                            onOk: () => {
                              message.success('메모가 삭제되었습니다.');
                            },
                          });
                        }}
                      >
                        삭제
                      </Button>
                    </Space>
                  )}
                </Flex>
                {editingMemoId === memo.id ? (
                  <Input.TextArea
                    defaultValue={memo.content}
                    rows={3}
                  />
                ) : (
                  <Text style={{ fontSize: 14, color: '#262626' }}>{memo.content}</Text>
                )}
              </div>
            ))}
          </Space>
        </Card>
      )}
      </Space>
    </div>
  );
}

export default JoinDistributionDetail;
