import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Tag, Button, Row, Col, Space, Divider } from 'antd';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import { buyerGroups, buyerDetails } from '../data/mockData';

function BuyerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const buyerGroup = buyerGroups.find(b => b.id === parseInt(id));
  const detail = buyerDetails[id];

  if (!buyerGroup || !detail) {
    return (
      <div>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/buyer')}>
          목록으로 돌아가기
        </Button>
        <div style={{ marginTop: 20, fontSize: 18 }}>바이어 그룹을 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div>
      {/* 헤더 */}
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/buyer')}>
            목록으로
          </Button>
          <h2 style={{ margin: 0 }}>{buyerGroup.name} 상세 정보</h2>
        </Space>
        <Tag color={buyerGroup.status === 'active' ? 'green' : 'default'} style={{ fontSize: 14, padding: '4px 12px' }}>
          {buyerGroup.status === 'active' ? '활성' : '비활성'}
        </Tag>
      </div>

      {/* 섹션 1: 바이어그룹 기본 정보 */}
      <Card
        title="바이어그룹 기본 정보"
        extra={<Button icon={<EditOutlined />} type="link">수정</Button>}
        style={{ marginBottom: 24 }}
      >
        <Descriptions bordered column={2}>
          <Descriptions.Item label="바이어그룹명">{buyerGroup.name}</Descriptions.Item>
          <Descriptions.Item label="담당영업사원">{buyerGroup.salesPerson}</Descriptions.Item>
          <Descriptions.Item label="주요품목분류">{buyerGroup.mainCategory}</Descriptions.Item>
          <Descriptions.Item label="사업권역">{buyerGroup.territory}</Descriptions.Item>
          <Descriptions.Item label="상세지역">{buyerGroup.region}</Descriptions.Item>
          <Descriptions.Item label="사업자 수">{buyerGroup.businessCount}개</Descriptions.Item>
        </Descriptions>

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

        <Divider orientation="left">거래 정보</Divider>
        <Descriptions bordered column={2}>
          <Descriptions.Item label="카톡단톡방이름">{detail.kakaoGroupName}</Descriptions.Item>
          <Descriptions.Item label="결제주기">{detail.paymentCycle}</Descriptions.Item>
          <Descriptions.Item label="컴플레인강도">{detail.complaintIntensity}</Descriptions.Item>
          <Descriptions.Item label="도착단가 정책">{detail.arrivalPricePolicy}</Descriptions.Item>
          <Descriptions.Item label="메인공급처" span={2}>{detail.mainSuppliers}</Descriptions.Item>
        </Descriptions>

        <Divider orientation="left">중요 평가 요소 (우선순위)</Divider>
        <Space>
          {detail.priorityFactors.map((factor, index) => (
            <Tag key={index} color="blue" style={{ fontSize: 14, padding: '4px 12px' }}>
              {index + 1}순위: {factor}
            </Tag>
          ))}
        </Space>
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
                    <span>{business.buyerName}</span>
                    <Tag color={business.status === 'active' ? 'green' : 'default'}>
                      {business.status === 'active' ? '활성' : '비활성'}
                    </Tag>
                    {business.hasCertificate && <Tag color="blue">사업자등록증 첨부</Tag>}
                  </Space>
                }
                extra={<Button icon={<EditOutlined />} type="link" size="small">수정</Button>}
              >
                <Descriptions bordered column={2} size="small">
                  <Descriptions.Item label="사업자등록번호">{business.businessNumber}</Descriptions.Item>
                  <Descriptions.Item label="바이어ID">{business.buyerId}</Descriptions.Item>
                  <Descriptions.Item label="사업자등록상호">{business.businessName}</Descriptions.Item>
                  <Descriptions.Item label="대표자">{business.representative}</Descriptions.Item>
                  <Descriptions.Item label="사업장등록주소" span={2}>{business.businessAddress}</Descriptions.Item>
                  <Descriptions.Item label="하차지 주소" span={2}>{business.unloadingAddress}</Descriptions.Item>
                  <Descriptions.Item label="세금계산서 발행 이메일" span={2}>{business.taxInvoiceEmail}</Descriptions.Item>
                </Descriptions>
              </Card>
              {index < detail.businesses.length - 1 && <Divider />}
            </Col>
          ))}
        </Row>
        <Button type="dashed" block style={{ marginTop: 16 }}>
          + 사업자 추가
        </Button>
      </Card>

      {/* 섹션 3: 거래 실적 (준비중) */}
      <Card title="거래 실적" style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Card size="small" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 12, color: '#999' }}>매출액 (누적)</div>
              <div style={{ fontSize: 20, fontWeight: 'bold', color: '#1890ff' }}>
                {(buyerGroup.totalSales / 100000000).toFixed(1)}억
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 12, color: '#999' }}>매출액 (최근 3개월)</div>
              <div style={{ fontSize: 20, fontWeight: 'bold', color: '#52c41a' }}>
                {(buyerGroup.sales3M / 100000000).toFixed(1)}억
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 12, color: '#999' }}>매출액 (최근 1개월)</div>
              <div style={{ fontSize: 20, fontWeight: 'bold', color: '#faad14' }}>
                {(buyerGroup.sales1M / 100000000).toFixed(1)}억
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 12, color: '#999' }}>최근거래일</div>
              <div style={{ fontSize: 20, fontWeight: 'bold' }}>
                {buyerGroup.lastTradeDate}
              </div>
            </Card>
          </Col>
        </Row>
        <div style={{ marginTop: 16, padding: 20, background: '#fafafa', textAlign: 'center', borderRadius: 8 }}>
          상세 거래 내역 및 판매 세부내역은 추후 구현 예정
        </div>
      </Card>
    </div>
  );
}

export default BuyerDetail;
