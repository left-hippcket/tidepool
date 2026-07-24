import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Form, Input, Select, message, Modal, Image, Upload, Space, Card, Tag, Flex, Descriptions, Row, Col, Statistic, Table, Typography } from 'antd';
import { ArrowLeftOutlined, EditOutlined, SaveOutlined, CloseOutlined, PlusOutlined, MinusCircleOutlined, FileImageOutlined, UploadOutlined } from '@ant-design/icons';
import { buyerGroups, buyerDetails, managers, territories, regions, productCategories, products, buyerSalesDetails, salesHistoryMemos } from '../data/mockData';

const { Title, Text } = Typography;

function BuyerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [editingBusinessId, setEditingBusinessId] = useState(null);
  const [form] = Form.useForm();
  const [businessForm] = Form.useForm();

  // P2: 기간 필터 state
  const [selectedPeriod, setSelectedPeriod] = useState('최근 3개월');

  // P2: 메모 추가/수정 state
  const [isAddingMemo, setIsAddingMemo] = useState(false);
  const [editingMemoId, setEditingMemoId] = useState(null);
  const [memoContent, setMemoContent] = useState('');

  const buyerGroup = buyerGroups.find(b => b.id === parseInt(id));
  const detail = buyerDetails[id];
  const salesDetail = buyerSalesDetails[id];
  const memos = salesHistoryMemos[id] || [];

  if (!buyerGroup || !detail) {
    return (
      <div style={{ minHeight: '100vh', padding: 24, background: '#f5f5f5' }}>
        <Button onClick={() => navigate('/buyer')} icon={<ArrowLeftOutlined />}>
          목록으로 돌아가기
        </Button>
        <Card style={{ marginTop: 24 }}>
          <Text type="secondary">바이어 그룹을 찾을 수 없습니다.</Text>
        </Card>
      </div>
    );
  }

  // 사업자 추가
  const handleAddBusiness = () => {
    navigate(`/buyer/register?groupId=${id}&mode=add`);
  };

  // 편집 모드 진입
  const handleEditGroup = () => {
    form.setFieldsValue({
      name: buyerGroup.name,
      salesPerson: buyerGroup.salesPerson,
      mainCategory: buyerGroup.mainCategory,
      territory: buyerGroup.territory,
      region: buyerGroup.region,
      kakaoGroupName: detail.kakaoGroupName,
      paymentCycle: detail.paymentCycle,
      complaintIntensity: detail.complaintIntensity,
      mainSuppliers: detail.mainSuppliers,
      status: buyerGroup.status,
      keymen: detail.keymen,
      priorityFactors: detail.priorityFactors
    });
    setEditMode(true);
  };

  // 저장
  const handleSaveGroup = async () => {
    try {
      const values = await form.validateFields();

      // 비활성화 체크
      if (values.status === 'inactive') {
        const activeBusinessCount = detail.businesses.filter(b => b.status === 'active').length;

        if (activeBusinessCount > 0) {
          Modal.error({
            title: '비활성화 불가',
            content: `소속된 사업자가 ${activeBusinessCount}개 활성 상태로 남아있어 그룹을 비활성화할 수 없습니다. 먼저 모든 사업자를 비활성화해주세요.`,
            onOk: () => {
              form.setFieldsValue({ status: 'active' });
            }
          });
          return;
        }

        Modal.confirm({
          title: '바이어 그룹 비활성화',
          content: '이 바이어 그룹을 비활성화하시겠습니까? 비활성화 후에는 목록에서 \'비활성\' 필터를 통해서만 조회할 수 있습니다.',
          onOk: () => {
            message.success('바이어 그룹이 비활성화되었습니다.');
            navigate('/buyer');
          }
        });
        return;
      }

      message.success('바이어 그룹 정보가 수정되었습니다.');
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

  // 사업자 편집 모드 진입
  const handleEditBusiness = (business) => {
    businessForm.setFieldsValue({
      businessNumber: business.businessNumber,
      buyerId: business.buyerId,
      businessName: business.businessName,
      representative: business.representative,
      businessAddress: business.businessAddress,
      buyerName: business.buyerName,
      unloadingAddress: business.unloadingAddress,
      taxInvoiceEmail: business.taxInvoiceEmail,
      status: business.status,
      certificate: business.hasCertificate ? [{ uid: '-1', name: '사업자등록증.pdf', status: 'done' }] : []
    });
    setEditingBusinessId(business.id);
  };

  // 사업자 저장
  const handleSaveBusiness = async (businessId) => {
    try {
      const values = await businessForm.validateFields();

      // 비활성화 체크
      if (values.status === 'inactive') {
        Modal.confirm({
          title: '사업자 비활성화',
          content: '이 사업자를 비활성화하시겠습니까? 비활성화 후에는 신규 거래 시 선택할 수 없습니다.',
          onOk: () => {
            message.success('사업자가 비활성화되었습니다.');
            setEditingBusinessId(null);
          }
        });
        return;
      }

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

  const priorityOptions = ['로스', '살밥', '단가', '색깔', '평체', '외관', '기타'];

  // 중요 평가 요소 이모지 매핑
  const priorityEmojis = {
    '로스': '🗑️',
    '살밥': '🍚',
    '단가': '💰',
    '색깔': '🎨',
    '평체': '📏',
    '외관': '👁️',
    '기타': '📌'
  };

  return (
    <div style={{ minHeight: '100vh', padding: '16px 24px', background: '#f5f5f5' }}>
      {/* 헤더 */}
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Flex justify="space-between" align="center" wrap="wrap" gap="middle">
          <Space size="middle">
            <Button onClick={() => navigate('/buyer')} icon={<ArrowLeftOutlined />}>
              목록으로
            </Button>
            <Title level={2} style={{ margin: 0 }}>{buyerGroup.name}</Title>
          </Space>
          <Tag color={buyerGroup.status === 'active' ? 'success' : 'default'}>
            {buyerGroup.status === 'active' ? '활성' : '비활성'}
          </Tag>
        </Flex>

      {/* 섹션 1: 바이어그룹 기본 정보 */}
      <Card
        title="바이어그룹 기본 정보"
        extra={
          !editMode ? (
            <Button type="link" onClick={handleEditGroup} icon={<EditOutlined />}>
              수정
            </Button>
          ) : (
            <Space>
              <Button onClick={handleCancelEdit} icon={<CloseOutlined />}>
                취소
              </Button>
              <Button type="primary" onClick={handleSaveGroup} icon={<SaveOutlined />}>
                저장
              </Button>
            </Space>
          )
        }
      >

        {!editMode ? (
          <>
            <Descriptions column={{ xs: 1, sm: 2, md: 3 }} bordered>
              <Descriptions.Item label="바이어그룹명">{buyerGroup.name}</Descriptions.Item>
              <Descriptions.Item label="담당영업사원">{buyerGroup.salesPerson}</Descriptions.Item>
              <Descriptions.Item label="주요품목분류">{buyerGroup.mainCategory}</Descriptions.Item>
              <Descriptions.Item label="사업권역">{buyerGroup.territory}</Descriptions.Item>
              <Descriptions.Item label="상세지역">{buyerGroup.region}</Descriptions.Item>
              <Descriptions.Item label="사업자 수">{buyerGroup.businessCount}개</Descriptions.Item>
            </Descriptions>

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

            {/* 거래 정보 */}
            <Title level={5} style={{ marginTop: 24 }}>거래 정보</Title>
            <Descriptions column={{ xs: 1, sm: 2 }} bordered>
              <Descriptions.Item label="카톡단톡방이름">{detail.kakaoGroupName}</Descriptions.Item>
              <Descriptions.Item label="결제주기">{detail.paymentCycle}</Descriptions.Item>
              <Descriptions.Item label="컴플레인강도">{detail.complaintIntensity}</Descriptions.Item>
              <Descriptions.Item label="도착단가 정책">{detail.arrivalPricePolicy}</Descriptions.Item>
              <Descriptions.Item label="메인공급처" span={2}>{detail.mainSuppliers}</Descriptions.Item>
            </Descriptions>

            {/* 중요 평가 요소 */}
            <Title level={5} style={{ marginTop: 24 }}>중요 평가 요소 (우선순위)</Title>
            <Space wrap>
              {detail.priorityFactors.map((factor, index) => (
                <Tag key={index} color="blue">
                  {priorityEmojis[factor]} {index + 1}순위: {factor}
                </Tag>
              ))}
            </Space>
          </>
        ) : (
          <Form form={form} layout="vertical">
            <Form.Item name="name" label="바이어그룹명" rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.Item name="salesPerson" label="담당영업사원" rules={[{ required: true }]}>
              <Select>
                {managers.map(m => (
                  <Select.Option key={m} value={m}>{m}</Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="mainCategory" label="주요품목분류" rules={[{ required: true }]}>
              <Select>
                {productCategories.map(c => (
                  <Select.Option key={c.id} value={c.name}>{c.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="territory" label="사업권역" rules={[{ required: true }]}>
              <Select>
                {territories
                  .filter(t => t.status === 'active')
                  .sort((a, b) => a.displayOrder - b.displayOrder)
                  .map(t => (
                    <Select.Option key={t.id} value={t.name}>{t.name}</Select.Option>
                  ))}
              </Select>
            </Form.Item>

            <Form.Item name="region" label="상세지역" rules={[{ required: true }]}>
              <Select>
                {regions
                  .filter(r => r.status === 'active')
                  .sort((a, b) => a.displayOrder - b.displayOrder)
                  .map(r => (
                    <Select.Option key={r.id} value={r.name}>{r.name}</Select.Option>
                  ))}
              </Select>
            </Form.Item>

            <Form.List name="keymen">
              {(fields, { add, remove }) => (
                <>
                  <Title level={5} style={{ marginBottom: 16 }}>키맨 정보</Title>
                  {fields.map((field) => (
                    <Card key={field.key} size="small" style={{ marginBottom: 12, background: '#fafafa' }}>
                      <Row gutter={16}>
                        <Col span={8}>
                          <Form.Item
                            {...field}
                            name={[field.name, 'name']}
                            label="이름"
                            rules={[{ required: true }]}
                          >
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            {...field}
                            name={[field.name, 'position']}
                            label="직책"
                          >
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            {...field}
                            name={[field.name, 'phone']}
                            label="연락처"
                          >
                            <Input />
                          </Form.Item>
                        </Col>
                      </Row>
                      {fields.length > 1 && (
                        <Button onClick={() => remove(field.name)} icon={<MinusCircleOutlined />}>
                          삭제
                        </Button>
                      )}
                    </Card>
                  ))}
                  <Button onClick={() => add()} icon={<PlusOutlined />} block>
                    키맨 추가
                  </Button>
                </>
              )}
            </Form.List>

            <Form.Item name="kakaoGroupName" label="카톡단톡방이름" style={{ marginTop: 16 }}>
              <Input />
            </Form.Item>

            <Form.Item name="paymentCycle" label="결제주기">
              <Input.TextArea rows={2} />
            </Form.Item>

            <Form.Item name="complaintIntensity" label="컴플레인강도">
              <Select>
                <Select.Option value="매우강함">매우강함</Select.Option>
                <Select.Option value="강함">강함</Select.Option>
                <Select.Option value="보통">보통</Select.Option>
                <Select.Option value="약함">약함</Select.Option>
                <Select.Option value="매우약함">매우약함</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="mainSuppliers" label="메인공급처">
              <Input />
            </Form.Item>

            {/* 중요 평가 요소 편집 */}
            <Title level={5} style={{ marginTop: 24 }}>중요 평가 요소 (우선순위)</Title>
            <Form.List name="priorityFactors">
                {(fields, { add, remove, move }) => (
                  <>
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      {fields.map((field, index) => (
                        <Flex key={field.key} align="center" gap="small">
                          <Text style={{ width: 64 }}>{index + 1}순위</Text>
                          <Form.Item
                            {...field}
                            style={{ flex: 1, marginBottom: 0 }}
                            rules={[{ required: true, message: '평가 요소를 선택해주세요' }]}
                          >
                            <Select placeholder="평가 요소 선택">
                              {priorityOptions.map(option => (
                                <Select.Option key={option} value={option}>
                                  {priorityEmojis[option]} {option}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                          <Space size="small">
                            {index > 0 && (
                              <Button
                                size="small"
                                icon={<span>↑</span>}
                                onClick={() => move(index, index - 1)}
                              />
                            )}
                            {index < fields.length - 1 && (
                              <Button
                                size="small"
                                icon={<span>↓</span>}
                                onClick={() => move(index, index + 1)}
                              />
                            )}
                            {fields.length > 1 && (
                              <Button
                                size="small"
                                danger
                                icon={<MinusCircleOutlined />}
                                onClick={() => remove(field.name)}
                              />
                            )}
                          </Space>
                        </Flex>
                      ))}
                    </Space>
                    {fields.length < priorityOptions.length && (
                      <Button
                        onClick={() => add()}
                        icon={<PlusOutlined />}
                        block
                        type="dashed"
                        style={{ marginTop: 12 }}
                      >
                        평가 요소 추가
                      </Button>
                    )}
                  </>
                )}
              </Form.List>

            <Form.Item name="status" label="상태" rules={[{ required: true }]} style={{ marginTop: 16 }}>
              <Select>
                <Select.Option value="active">활성</Select.Option>
                <Select.Option value="inactive">비활성</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        )}
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
                    <Text strong>{business.buyerName}</Text>
                    <Tag color={business.status === 'active' ? 'success' : 'default'}>
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
                    <Tag>사업자등록증 미첨부</Tag>
                  )}
                  </Space>
                }
                extra={
                  editingBusinessId !== business.id ? (
                    <Button type="link" onClick={() => handleEditBusiness(business)} icon={<EditOutlined />}>
                      수정
                    </Button>
                  ) : (
                    <Space>
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
                        onClick={handleCancelBusinessEdit}
                      >
                        취소
                      </Button>
                    </Space>
                  )
                }
              >
                {editingBusinessId !== business.id ? (
                  <Descriptions column={{ xs: 1, md: 2 }} size="small" bordered>
                    <Descriptions.Item label="사업자등록번호">{business.businessNumber}</Descriptions.Item>
                    <Descriptions.Item label="ticker">{business.buyerId}</Descriptions.Item>
                    <Descriptions.Item label="사업자등록상호">{business.businessName}</Descriptions.Item>
                    <Descriptions.Item label="대표자">{business.representative}</Descriptions.Item>
                    <Descriptions.Item label="사업장등록주소" span={2}>{business.businessAddress}</Descriptions.Item>
                    <Descriptions.Item label="하차지 주소" span={2}>{business.unloadingAddress}</Descriptions.Item>
                    <Descriptions.Item label="세금계산서 발행 이메일" span={2}>{business.taxInvoiceEmail}</Descriptions.Item>
                  </Descriptions>
                ) : (
                  <Form form={businessForm} layout="vertical">
                    <Row gutter={16}>
                      <Col span={24}>
                        <Form.Item name="buyerName" label="바이어명" rules={[{ required: true }]}>
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item
                          name="buyerId"
                          label="ticker"
                          rules={[{ required: true }]}
                          help="티커는 수정할 수 없습니다"
                        >
                          <Input disabled style={{ background: '#f5f5f5' }} />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item name="businessNumber" label="사업자등록번호">
                          <Input disabled style={{ background: '#f5f5f5' }} />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item name="businessName" label="사업자등록상호">
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item name="representative" label="대표자">
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item name="businessAddress" label="사업장등록주소">
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item name="unloadingAddress" label="하차지 주소">
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item name="taxInvoiceEmail" label="세금계산서 발행 이메일">
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item name="status" label="상태">
                          <Select>
                            <Select.Option value="active">활성</Select.Option>
                            <Select.Option value="inactive">비활성</Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>

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

      {/* 섹션 3: 거래 실적 */}
      <Card title="거래 실적 (P2 예정)" style={{ opacity: 0.6 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Statistic
              title="매출액 (누적)"
              value={(buyerGroup.totalSales / 100000000).toFixed(1)}
              suffix="억"
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Statistic
              title="매출액 (최근 3개월)"
              value={(buyerGroup.sales3M / 100000000).toFixed(1)}
              suffix="억"
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Statistic
              title="매출액 (최근 1개월)"
              value={(buyerGroup.sales1M / 100000000).toFixed(1)}
              suffix="억"
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Statistic
              title="최근거래일"
              value={buyerGroup.lastTradeDate}
            />
          </Col>
        </Row>
      </Card>

      {/* P2 섹션: 등급 정보 & 판매 세부내역 */}
      {salesDetail && (
        <div style={{ opacity: 0.6 }}>
          {/* 기간 필터 */}
          <Card size="small">
            <Space wrap>
              {['최근 1개월', '최근 3개월', '최근 6개월', '이번달', '이번분기', '올해', '누적'].map(period => (
                <Button
                  key={period}
                  type={selectedPeriod === period ? 'primary' : 'default'}
                  onClick={() => setSelectedPeriod(period)}
                >
                  {period}
                </Button>
              ))}
            </Space>
          </Card>

          {/* 통합 지표 & 등급 카드 */}
          <Row gutter={[16, 16]}>
            {/* 통합 지표 */}
            <Col xs={24} lg={12}>
              <Card title={`통합 지표 (P2 예정) (${selectedPeriod})`}>
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <Flex justify="space-between">
                    <Text type="secondary">매출액</Text>
                    <Text strong>{(salesDetail.metrics.totalSales / 100000000).toFixed(1)}억원</Text>
                  </Flex>
                  <Flex justify="space-between">
                    <Text type="secondary">조정손익액</Text>
                    <Text strong>{(salesDetail.metrics.totalProfit / 10000000).toFixed(1)}백만원</Text>
                  </Flex>
                  <Flex justify="space-between">
                    <Text type="secondary">조정손익률</Text>
                    <Text strong>{salesDetail.metrics.profitRate.toFixed(1)}%</Text>
                  </Flex>
                  <Flex justify="space-between">
                    <Text type="secondary">기말미수금</Text>
                    <Text strong>{(salesDetail.metrics.receivable / 10000000).toFixed(1)}백만원</Text>
                  </Flex>
                  <Flex justify="space-between">
                    <Text type="secondary">자본회전율</Text>
                    <Text strong>{salesDetail.metrics.turnoverRate.toFixed(1)}회</Text>
                  </Flex>
                </Space>
              </Card>
            </Col>

            {/* 등급 정보 */}
            <Col xs={24} lg={12}>
              <Card title="바이어 등급 (P2 예정)">
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <Statistic
                    title="매출액 순위"
                    value={salesDetail.grade.salesRank}
                    suffix="%"
                    prefix="상위"
                  />
                  <Statistic
                    title="거래손익 순위"
                    value={salesDetail.grade.profitRank}
                    suffix="%"
                    prefix="상위"
                  />
                  <Statistic
                    title="자본회전율 등급"
                    value={salesDetail.grade.turnoverGrade}
                  />
                </Space>
              </Card>
            </Col>
          </Row>

          {/* 판매 세부내역 테이블 */}
          <Card title="판매 세부내역 (P2 예정)">
            <Table
              dataSource={salesDetail.periods}
              rowKey={(record, idx) => idx}
              scroll={{ x: 800 }}
              pagination={false}
              size="small"
              columns={[
                {
                  title: '기간',
                  dataIndex: 'period',
                  key: 'period',
                  fixed: 'left',
                  width: 100,
                },
                {
                  title: '매출액',
                  dataIndex: 'sales',
                  key: 'sales',
                  align: 'right',
                  width: 100,
                  render: (val) => `${(val / 10000000).toFixed(1)}백만`,
                },
                {
                  title: '조정손익액',
                  dataIndex: 'profit',
                  key: 'profit',
                  align: 'right',
                  width: 120,
                  render: (val) => <Text strong>{(val / 10000000).toFixed(1)}백만</Text>,
                },
                {
                  title: '매출총중량',
                  dataIndex: 'weight',
                  key: 'weight',
                  align: 'right',
                  width: 100,
                  render: (val) => `${val}톤`,
                },
                {
                  title: '판매규격별 중량',
                  dataIndex: 'specs',
                  key: 'specs',
                  width: 200,
                  render: (val) => <Text type="secondary" style={{ fontSize: 12 }}>{val}</Text>,
                },
                {
                  title: '판매 셀러',
                  dataIndex: 'sellers',
                  key: 'sellers',
                  width: 150,
                  render: (val) => <Text type="secondary" style={{ fontSize: 12 }}>{val}</Text>,
                },
                {
                  title: '판매 품목',
                  dataIndex: 'products',
                  key: 'products',
                  width: 150,
                  render: (val) => <Text type="secondary" style={{ fontSize: 12 }}>{val}</Text>,
                },
              ]}
            />

            {/* 매출액 차트 (세로 막대 시각화) */}
            <div style={{ marginTop: 32 }}>
              <Title level={5}>매출액 추이</Title>
              <div style={{ position: 'relative' }}>
                {/* Y축 라벨 */}
                <div style={{ position: 'absolute', left: -32, top: 0, bottom: 64, display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: '#8c8c8c', transform: 'rotate(-90deg)', whiteSpace: 'nowrap' }}>
                    매출액 (백만원)
                  </span>
                </div>

                {/* 차트 영역 */}
                <div style={{ paddingLeft: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8, height: 256, borderLeft: '2px solid #bfbfbf', borderBottom: '2px solid #bfbfbf', paddingLeft: 8, paddingBottom: 8, position: 'relative' }}>
                    {salesDetail.periods.map((p, idx) => {
                      const maxSales = Math.max(...salesDetail.periods.map(period => period.sales));
                      const heightPercent = (p.sales / maxSales) * 100;
                      return (
                        <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: '100%' }}>
                          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                            <div style={{ fontSize: 12, color: '#8c8c8c', fontWeight: 500, marginBottom: 4 }}>
                              {(p.sales / 10000000).toFixed(1)}
                            </div>
                            <div
                              style={{
                                width: '100%',
                                background: 'linear-gradient(to top, #8c8c8c, #bfbfbf)',
                                borderTopLeftRadius: 8,
                                borderTopRightRadius: 8,
                                boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)',
                                height: `${heightPercent}%`,
                                minHeight: '4px'
                              }}
                              title={`${p.period}: ${(p.sales / 10000000).toFixed(1)}백만원`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* X축 라벨 */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginTop: 8, paddingLeft: 8 }}>
                    {salesDetail.periods.map((p, idx) => (
                      <div key={idx} style={{ flex: 1, textAlign: 'center' }}>
                        <span style={{ fontSize: 12, color: '#8c8c8c', display: 'inline-block', transform: 'rotate(-45deg)', transformOrigin: 'center', whiteSpace: 'nowrap' }}>
                          {p.period}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* X축 라벨 제목 */}
                  <div style={{ textAlign: 'center', fontSize: 12, color: '#8c8c8c', marginTop: 32 }}>기간</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* P2 섹션: 세일즈 히스토리 */}
      <Card
        title="세일즈 히스토리 (P2 예정)"
        style={{ opacity: 0.6 }}
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setIsAddingMemo(true);
              setMemoContent('');
            }}
          >
            메모 추가
          </Button>
        }
      >

        {/* 메모 추가 폼 */}
        {isAddingMemo && (
          <Card size="small" style={{ marginBottom: 16, background: '#fafafa' }}>
            <Input.TextArea
              rows={4}
              placeholder="영업 활동 내역을 입력하세요..."
              value={memoContent}
              onChange={(e) => setMemoContent(e.target.value)}
              style={{ marginBottom: 12 }}
            />
            <Space>
              <Button
                onClick={() => {
                  setIsAddingMemo(false);
                  setMemoContent('');
                }}
              >
                취소
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  if (!memoContent.trim()) {
                    message.warning('메모 내용을 입력해주세요.');
                    return;
                  }
                  message.success('메모가 추가되었습니다.');
                  setIsAddingMemo(false);
                  setMemoContent('');
                }}
              >
                저장
              </Button>
            </Space>
          </Card>
        )}

        {/* 메모 타임라인 */}
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          {memos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <Text type="secondary">등록된 메모가 없습니다.</Text>
            </div>
          ) : (
            memos.map((memo) => (
              <Card key={memo.id} size="small" hoverable>
                <Flex justify="space-between" align="start" style={{ marginBottom: 8 }}>
                  <Space>
                    <Tag color="blue">{memo.date}</Tag>
                    <Text strong>{memo.author}</Text>
                  </Space>
                  {memo.author === '최용환' && (
                    <Space>
                      <Button
                        type="link"
                        size="small"
                        onClick={() => {
                          setEditingMemoId(memo.id);
                          setMemoContent(memo.content);
                        }}
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
                            }
                          });
                        }}
                      >
                        삭제
                      </Button>
                    </Space>
                  )}
                </Flex>

                {editingMemoId === memo.id ? (
                  <div>
                    <Input.TextArea
                      rows={4}
                      value={memoContent}
                      onChange={(e) => setMemoContent(e.target.value)}
                      style={{ marginBottom: 12 }}
                    />
                    <Space>
                      <Button
                        size="small"
                        onClick={() => {
                          setEditingMemoId(null);
                          setMemoContent('');
                        }}
                      >
                        취소
                      </Button>
                      <Button
                        type="primary"
                        size="small"
                        onClick={() => {
                          message.success('메모가 수정되었습니다.');
                          setEditingMemoId(null);
                          setMemoContent('');
                        }}
                      >
                        저장
                      </Button>
                    </Space>
                  </div>
                ) : (
                  <Text>{memo.content}</Text>
                )}
              </Card>
            ))
          )}
        </Space>
      </Card>
      </Space>
    </div>
  );
}

export default BuyerDetail;