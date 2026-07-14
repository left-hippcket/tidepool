import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Tag, Button, Row, Col, Space, Divider } from 'antd';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import { sellerGroups, sellerDetails } from '../data/mockData';

function SellerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const sellerGroup = sellerGroups.find(s => s.id === parseInt(id));
  const detail = sellerDetails[id];

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
        extra={<Button icon={<EditOutlined />} type="link">수정</Button>}
        style={{ marginBottom: 24 }}
      >
        <Descriptions bordered column={2}>
          <Descriptions.Item label="셀러그룹명">{sellerGroup.name}</Descriptions.Item>
          <Descriptions.Item label="소싱담당자">{sellerGroup.manager}</Descriptions.Item>
          <Descriptions.Item label="주요품목분류">{sellerGroup.mainCategory}</Descriptions.Item>
          <Descriptions.Item label="사업권역">{sellerGroup.territory}</Descriptions.Item>
          <Descriptions.Item label="상세지역">{sellerGroup.region}</Descriptions.Item>
          <Descriptions.Item label="사업자 수">{sellerGroup.businessCount}개</Descriptions.Item>
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
                extra={<Button icon={<EditOutlined />} type="link" size="small">수정</Button>}
              >
                <Descriptions bordered column={2} size="small">
                  <Descriptions.Item label="사업자등록번호">{business.businessNumber}</Descriptions.Item>
                  <Descriptions.Item label="셀러ID">{business.sellerId}</Descriptions.Item>
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
        <div style={{ marginTop: 16, padding: 20, background: '#fafafa', textAlign: 'center', borderRadius: 8 }}>
          상세 거래 내역 및 출하 세부내역은 추후 구현 예정
        </div>
      </Card>
    </div>
  );
}

export default SellerDetail;
