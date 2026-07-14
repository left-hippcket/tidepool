import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Tag, Button, Row, Col, Space, Divider, Table, Form, Input, Select, InputNumber, message, Modal } from 'antd';
import { ArrowLeftOutlined, EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { sellerGroups, sellerDetails, managers, territories, productCategories } from '../data/mockData';
import { Column } from '@ant-design/charts';

function SellerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [periodFilter, setPeriodFilter] = useState('3M'); // '1M' | '3M' | '6M' | 'thisMonth' | 'thisQuarter' | 'thisYear' | 'total'
  const [editMode, setEditMode] = useState(false);
  const [editingBusinessId, setEditingBusinessId] = useState(null);
  const [form] = Form.useForm();
  const [businessForm] = Form.useForm();

  const sellerGroup = sellerGroups.find(s => s.id === parseInt(id));
  const detail = sellerDetails[id];

  // 편집 모드 진입
  const handleEditGroup = () => {
    form.setFieldsValue({
      name: sellerGroup.name,
      manager: sellerGroup.manager,
      mainCategory: sellerGroup.mainCategory,
      territory: sellerGroup.territory,
      region: sellerGroup.region,
      status: sellerGroup.status
    });
    setEditMode(true);
  };

  // 저장
  const handleSaveGroup = async () => {
    try {
      const values = await form.validateFields();
      // TODO: 실제 API 호출
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
      // 소속 사업자 중 활성 사업자가 있는지 체크
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
      businessNumber: business.businessNumber,
      sellerId: business.sellerId,
      businessName: business.businessName,
      representative: business.representative,
      businessAddress: business.businessAddress,
      loadingAddress: business.loadingAddress,
      commissionRate: business.commissionRate,
      status: business.status
    });
    setEditingBusinessId(business.id);
  };

  // 사업자 저장
  const handleSaveBusiness = async (businessId) => {
    try {
      const values = await businessForm.validateFields();
      // TODO: 실제 API 호출
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

  const performanceColumns = [
    {
      title: '기간',
      dataIndex: 'period',
      key: 'period',
      width: 100,
    },
    {
      title: '매입액',
      dataIndex: 'purchase',
      key: 'purchase',
      width: 120,
      render: (val) => `${(val / 100000000).toFixed(1)}억`,
    },
    {
      title: '조정손익액',
      dataIndex: 'profit',
      key: 'profit',
      width: 120,
      render: (val) => `${(val / 10000).toFixed(0)}만`,
    },
    {
      title: '매입총중량(톤)',
      dataIndex: 'weight',
      key: 'weight',
      width: 120,
    },
    {
      title: '출하규격',
      dataIndex: 'specs',
      key: 'specs',
      width: 150,
    },
    {
      title: '출하바이어',
      dataIndex: 'buyers',
      key: 'buyers',
      width: 200,
    },
  ];

  const chartData = currentData.map(d => ({
    period: d.period,
    value: d.purchase / 100000000,
    type: '매입액'
  }));

  const chartConfig = {
    data: chartData,
    xField: 'period',
    yField: 'value',
    label: {
      position: 'top',
      style: { fill: '#000', fontSize: 10 }
    },
    xAxis: {
      label: { autoRotate: false }
    },
    yAxis: {
      title: { text: '매입액 (억원)' }
    },
  };

  if (!sellerGroup || !detail) {
    return (
      <div>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/seller')}>
          목록으로 돌아가기
        </Button>
        <div style={{ marginTop: 20, fontSize: 18 }}>셀러 그룹을 찾을 수 없습니다.</div>
      </div>
    );
  }

  const qualitativeLabels = {
    financial: '재무상황',
    quality: '품질수준',
    priceCompetitive: '가격경쟁력',
    claimCooperation: '클레임협조도',
    lossProvision: '로스제공'
  };

  return (
    <div>
      {/* 헤더 */}
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/seller')}>
            목록으로
          </Button>
          <h2 style={{ margin: 0 }}>{sellerGroup.name} 상세 정보</h2>
        </Space>
        <Tag color={sellerGroup.status === 'active' ? 'green' : 'default'} style={{ fontSize: 14, padding: '4px 12px' }}>
          {sellerGroup.status === 'active' ? '활성' : '비활성'}
        </Tag>
      </div>

      {/* 섹션 1: 셀러그룹 기본 정보 */}
      <Card
        title="셀러그룹 기본 정보"
        extra={
          editMode ? (
            <Space>
              <Button icon={<SaveOutlined />} type="primary" onClick={handleSaveGroup}>
                저장
              </Button>
              <Button icon={<CloseOutlined />} onClick={handleCancelEdit}>
                취소
              </Button>
            </Space>
          ) : (
            <Button icon={<EditOutlined />} type="link" onClick={handleEditGroup}>
              수정
            </Button>
          )
        }
        style={{ marginBottom: 24 }}
      >
        {editMode ? (
          <Form form={form} layout="vertical">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="셀러그룹명" name="name" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="소싱담당자" name="manager" rules={[{ required: true }]}>
                  <Select>
                    {managers.map(m => (
                      <Select.Option key={m} value={m}>{m}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="주요품목분류" name="mainCategory" rules={[{ required: true }]}>
                  <Select>
                    {productCategories.map(c => (
                      <Select.Option key={c.id} value={c.name}>{c.name}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="사업권역" name="territory" rules={[{ required: true }]}>
                  <Select>
                    {territories.filter(t => t.status === 'active').map(t => (
                      <Select.Option key={t.id} value={t.name}>{t.name}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="상세지역" name="region" rules={[{ required: true }]}>
                  <Select>
                    <Select.Option value="인천">인천</Select.Option>
                    <Select.Option value="완도/진도">완도/진도</Select.Option>
                    <Select.Option value="통영">통영</Select.Option>
                    <Select.Option value="거제">거제</Select.Option>
                    <Select.Option value="고흥">고흥</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
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
          <Descriptions bordered column={2}>
            <Descriptions.Item label="셀러그룹명">{sellerGroup.name}</Descriptions.Item>
            <Descriptions.Item label="소싱담당자">{sellerGroup.manager}</Descriptions.Item>
            <Descriptions.Item label="주요품목분류">{sellerGroup.mainCategory}</Descriptions.Item>
            <Descriptions.Item label="사업권역">{sellerGroup.territory}</Descriptions.Item>
            <Descriptions.Item label="상세지역">{sellerGroup.region}</Descriptions.Item>
            <Descriptions.Item label="사업자 수">{sellerGroup.businessCount}개</Descriptions.Item>
          </Descriptions>
        )}

        <Divider orientation="left">키맨 정보</Divider>
        {detail.keymen.map((keyman, index) => (
          <Card key={index} size="small" style={{ marginBottom: 8, backgroundColor: '#fafafa' }}>
            <Space size="large">
              <span><strong>이름:</strong> {keyman.name}</span>
              <span><strong>직책:</strong> {keyman.position}</span>
              <span><strong>연락처:</strong> {keyman.phone}</span>
            </Space>
          </Card>
        ))}

        <Divider orientation="left">정성적 평가</Divider>
        <Row gutter={[16, 16]}>
          {Object.entries(detail.qualitativeRatings).map(([key, value]) => (
            <Col span={8} key={key}>
              <Card size="small" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>{qualitativeLabels[key]}</div>
                <div style={{ fontSize: 16, fontWeight: 'bold', color: '#1890ff' }}>{value}</div>
              </Card>
            </Col>
          ))}
        </Row>

        <Divider orientation="left">기타 정보</Divider>
        <Descriptions bordered column={2}>
          <Descriptions.Item label="양식장 수면적">{detail.additionalInfo.farmArea}평</Descriptions.Item>
          <Descriptions.Item label="연간생산량">{detail.additionalInfo.annualProduction}톤</Descriptions.Item>
          <Descriptions.Item label="메인 유통사" span={2}>{detail.additionalInfo.mainDistributors}</Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 섹션 2: 소속 사업자 정보 */}
      <Card title="소속 사업자 정보" style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          {detail.businesses.map((business, index) => (
            <Col span={24} key={business.id}>
              <Card
                size="small"
                type="inner"
                title={
                  <Space>
                    <span>{business.sellerName}</span>
                    <Tag color={business.status === 'active' ? 'green' : 'default'}>
                      {business.status === 'active' ? '활성' : '비활성'}
                    </Tag>
                    {business.hasCertificate && <Tag color="blue">사업자등록증 첨부</Tag>}
                  </Space>
                }
                extra={
                  editingBusinessId === business.id ? (
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
                        onClick={() => handleCancelBusinessEdit()}
                      >
                        취소
                      </Button>
                    </Space>
                  ) : (
                    <Button
                      icon={<EditOutlined />}
                      type="link"
                      size="small"
                      onClick={() => handleEditBusiness(business)}
                    >
                      수정
                    </Button>
                  )
                }
              >
                {editingBusinessId === business.id ? (
                  <Form form={businessForm} layout="vertical">
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item label="사업자등록번호" name="businessNumber">
                          <Input disabled style={{ color: '#999' }} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="ticker" name="sellerId">
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="사업자등록상호" name="businessName">
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="대표자" name="representative">
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item label="사업자등록주소" name="businessAddress">
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item label="상차지 주소" name="loadingAddress">
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="상차 수수료율(%)" name="commissionRate">
                          <InputNumber min={0} max={100} step={0.1} style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="상태" name="status">
                          <Select>
                            <Select.Option value="active">활성</Select.Option>
                            <Select.Option value="inactive">비활성</Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                ) : (
                  <Descriptions bordered column={2} size="small">
                    <Descriptions.Item label="사업자등록번호">{business.businessNumber}</Descriptions.Item>
                    <Descriptions.Item label="ticker">{business.sellerId}</Descriptions.Item>
                    <Descriptions.Item label="사업자등록상호">{business.businessName}</Descriptions.Item>
                    <Descriptions.Item label="대표자">{business.representative}</Descriptions.Item>
                    <Descriptions.Item label="사업자등록주소" span={2}>{business.businessAddress}</Descriptions.Item>
                    <Descriptions.Item label="상차지 주소" span={2}>{business.loadingAddress}</Descriptions.Item>
                    <Descriptions.Item label="상차 수수료율">{business.commissionRate}%</Descriptions.Item>
                    <Descriptions.Item label="은행계좌">
                      {business.bankAccounts.map((account, idx) => (
                        <div key={idx}>
                          {account.bank} {account.accountNumber} ({account.holder})
                          {account.isPrimary && <Tag color="gold" size="small" style={{ marginLeft: 8 }}>주사용</Tag>}
                        </div>
                      ))}
                    </Descriptions.Item>
                  </Descriptions>
                )}
              </Card>
              {index < detail.businesses.length - 1 && <Divider />}
            </Col>
          ))}
        </Row>
        <Button type="dashed" block style={{ marginTop: 16 }}>
          + 사업자 추가
        </Button>
      </Card>

      {/* 섹션 3: 거래 실적 (P2 샘플) */}
      <Card title="거래 실적 (P2 샘플)" style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Card size="small" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 12, color: '#999' }}>매입액 (누적)</div>
              <div style={{ fontSize: 20, fontWeight: 'bold', color: '#1890ff' }}>
                {(sellerGroup.totalPurchase / 100000000).toFixed(1)}억
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 12, color: '#999' }}>매입액 (최근 3개월)</div>
              <div style={{ fontSize: 20, fontWeight: 'bold', color: '#52c41a' }}>
                {(sellerGroup.purchase3M / 100000000).toFixed(1)}억
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 12, color: '#999' }}>매입액 (최근 1개월)</div>
              <div style={{ fontSize: 20, fontWeight: 'bold', color: '#faad14' }}>
                {(sellerGroup.purchase1M / 100000000).toFixed(1)}억
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 12, color: '#999' }}>최근거래일</div>
              <div style={{ fontSize: 20, fontWeight: 'bold' }}>
                {sellerGroup.lastTradeDate}
              </div>
            </Card>
          </Col>
        </Row>

        <Divider />

        {/* 기간 필터 */}
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Button
              type={periodFilter === '1M' ? 'primary' : 'default'}
              onClick={() => setPeriodFilter('1M')}
            >
              최근 1개월
            </Button>
            <Button
              type={periodFilter === '3M' ? 'primary' : 'default'}
              onClick={() => setPeriodFilter('3M')}
            >
              최근 3개월
            </Button>
            <Button
              type={periodFilter === '6M' ? 'primary' : 'default'}
              onClick={() => setPeriodFilter('6M')}
            >
              최근 6개월
            </Button>
            <Button
              type={periodFilter === 'thisMonth' ? 'primary' : 'default'}
              onClick={() => setPeriodFilter('thisMonth')}
            >
              이번달
            </Button>
            <Button
              type={periodFilter === 'thisQuarter' ? 'primary' : 'default'}
              onClick={() => setPeriodFilter('thisQuarter')}
            >
              이번분기
            </Button>
            <Button
              type={periodFilter === 'thisYear' ? 'primary' : 'default'}
              onClick={() => setPeriodFilter('thisYear')}
            >
              올해
            </Button>
            <Button
              type={periodFilter === 'total' ? 'primary' : 'default'}
              onClick={() => setPeriodFilter('total')}
            >
              누적
            </Button>
          </Space>
        </div>

        {/* 기간별 실적 표 */}
        <Table
          columns={performanceColumns}
          dataSource={currentData}
          rowKey="period"
          pagination={false}
          size="small"
          bordered
        />

        {/* 매입액 막대차트 */}
        <div style={{ marginTop: 24 }}>
          <h4>매입액 추이</h4>
          <Column {...chartConfig} />
        </div>
      </Card>
    </div>
  );
}

export default SellerDetail;
