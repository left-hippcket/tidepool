import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card, Button, Tag, Form, Input, Select, Space, message, Modal,
  Upload, Timeline, InputNumber, DatePicker
} from 'antd';
import {
  ArrowLeftOutlined, EditOutlined, UploadOutlined, PlusOutlined,
  MinusCircleOutlined
} from '@ant-design/icons';
import { driverDetails, claimHistory } from '../data/mockData';
import dayjs from 'dayjs';

const { TextArea } = Input;

function DriverDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [settlementForm] = Form.useForm();
  const [claimForm] = Form.useForm();

  const driverData = driverDetails[id];

  const [editingBasic, setEditingBasic] = useState(false);
  const [editingSettlement, setEditingSettlement] = useState(false);
  const [claimModalVisible, setClaimModalVisible] = useState(false);
  const [editingClaimId, setEditingClaimId] = useState(null);
  const [claims, setClaims] = useState(claimHistory[id] || []);

  if (!driverData) {
    return <div className="p-6">드라이버를 찾을 수 없습니다.</div>;
  }

  const { basicInfo, settlementInfo } = driverData;

  // 기본 정보 수정
  const handleBasicEdit = () => {
    form.setFieldsValue({
      name: basicInfo.name,
      phone: basicInfo.phone,
      vehicleType: basicInfo.vehicleType,
      tankCount: basicInfo.tankCount,
      driverLevel: basicInfo.driverLevel,
      status: basicInfo.status
    });
    setEditingBasic(true);
  };

  const handleBasicSave = async () => {
    try {
      const values = await form.validateFields();

      // 비활성화 확인
      if (values.status === 'inactive' && basicInfo.status === 'active') {
        Modal.confirm({
          title: '드라이버 비활성화',
          content: '이 드라이버를 비활성화하시겠습니까? 비활성화 후에는 신규 거래 시 선택할 수 없습니다.',
          okText: '확인',
          cancelText: '취소',
          onOk: () => {
            message.success('드라이버가 비활성화되었습니다.');
            setEditingBasic(false);
          }
        });
      } else if (values.status === 'active' && basicInfo.status === 'inactive') {
        message.success('드라이버가 활성화되었습니다.');
        setEditingBasic(false);
      } else {
        message.success('드라이버 정보가 수정되었습니다.');
        setEditingBasic(false);
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleBasicCancel = () => {
    form.resetFields();
    setEditingBasic(false);
  };

  // 정산사업자 수정
  const handleSettlementEdit = () => {
    if (!settlementInfo) {
      settlementForm.setFieldsValue({
        businessNumber: '',
        businessName: '',
        representative: '',
        businessAddress: '',
        taxType: undefined,
        bankAccounts: [{ bank: '', accountNumber: '', holder: '' }]
      });
    } else {
      settlementForm.setFieldsValue({
        businessNumber: settlementInfo.businessNumber,
        businessName: settlementInfo.businessName,
        representative: settlementInfo.representative,
        businessAddress: settlementInfo.businessAddress,
        taxType: settlementInfo.taxType,
        bankAccounts: settlementInfo.bankAccounts.map(acc => ({
          bank: acc.bank,
          accountNumber: acc.accountNumber,
          holder: acc.holder
        }))
      });
    }
    setEditingSettlement(true);
  };

  const handleSettlementSave = async () => {
    try {
      const values = await settlementForm.validateFields();
      message.success('정산사업자 정보가 수정되었습니다.');
      setEditingSettlement(false);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleSettlementCancel = () => {
    settlementForm.resetFields();
    setEditingSettlement(false);
  };

  // 클레임/사고 이력 추가/수정
  const handleClaimAdd = () => {
    claimForm.resetFields();
    claimForm.setFieldsValue({
      occurredAt: dayjs(),
      incidentType: undefined,
      content: ''
    });
    setEditingClaimId(null);
    setClaimModalVisible(true);
  };

  const handleClaimEdit = (claim) => {
    claimForm.setFieldsValue({
      occurredAt: dayjs(claim.occurredAt, 'YYYY-MM-DD HH:mm'),
      incidentType: claim.incidentType,
      content: claim.content
    });
    setEditingClaimId(claim.id);
    setClaimModalVisible(true);
  };

  const handleClaimSave = async () => {
    try {
      const values = await claimForm.validateFields();
      if (editingClaimId) {
        message.success('클레임/사고 이력이 수정되었습니다.');
      } else {
        message.success('클레임/사고 이력이 등록되었습니다.');
      }
      setClaimModalVisible(false);
      claimForm.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleClaimDelete = (claimId) => {
    Modal.confirm({
      title: '이력 삭제',
      content: '이 이력을 삭제하시겠습니까?',
      okText: '확인',
      cancelText: '취소',
      onOk: () => {
        setClaims(prev => prev.filter(c => c.id !== claimId));
        message.success('클레임/사고 이력이 삭제되었습니다.');
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] p-4 md:p-6">
      {/* 헤더 */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/driver')}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors mb-4"
        >
          <ArrowLeftOutlined />
          목록으로
        </button>
        <h2 className="text-2xl font-bold text-gray-900">드라이버 상세</h2>
      </div>

      {/* 드라이버 기본 정보 */}
      <Card
        title="드라이버 기본 정보"
        extra={
          editingBasic ? (
            <Space>
              <Button onClick={handleBasicCancel}>취소</Button>
              <Button type="primary" onClick={handleBasicSave}>저장</Button>
            </Space>
          ) : (
            <Button icon={<EditOutlined />} onClick={handleBasicEdit}>수정</Button>
          )
        }
        className="mb-4"
        style={{ opacity: basicInfo.status === 'inactive' ? 0.6 : 1 }}
      >
        {editingBasic ? (
          <Form form={form} layout="vertical">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                name="name"
                label="드라이버명"
                rules={[
                  { required: true, message: '드라이버명을 입력해주세요' },
                  { max: 20, message: '최대 20자' }
                ]}
              >
                <Input placeholder="예: 정훈" />
              </Form.Item>

              <Form.Item label="Ticker">
                <Input value={basicInfo.ticker} disabled />
              </Form.Item>

              <Form.Item
                name="phone"
                label="전화번호"
                rules={[
                  { pattern: /^010-\d{4}-\d{4}$/, message: '010-XXXX-XXXX 형식' }
                ]}
              >
                <Input placeholder="010-1234-5678" />
              </Form.Item>

              <Form.Item name="vehicleType" label="차종">
                <Select
                  options={[
                    { value: '5.0톤', label: '5.0톤' },
                    { value: '1.0톤', label: '1.0톤' }
                  ]}
                  onChange={(value) => {
                    if (value === '5.0톤') {
                      form.setFieldsValue({ tankCount: 10 });
                    } else if (value === '1.0톤') {
                      form.setFieldsValue({ tankCount: 4 });
                    }
                  }}
                />
              </Form.Item>

              <Form.Item name="tankCount" label="보유통수">
                <Select
                  options={[
                    { value: 4, label: '4통' },
                    { value: 5, label: '5통' },
                    { value: 6, label: '6통' },
                    { value: 7, label: '7통' },
                    { value: 8, label: '8통' },
                    { value: 9, label: '9통' },
                    { value: 10, label: '10통' }
                  ]}
                />
              </Form.Item>

              <Form.Item name="driverLevel" label="Driver Level">
                <Select
                  options={[
                    { value: '잘함', label: '잘함' },
                    { value: '보통', label: '보통' },
                    { value: '못함', label: '못함' },
                    { value: '모름', label: '모름' }
                  ]}
                />
              </Form.Item>

              <Form.Item name="status" label="상태">
                <Select
                  options={[
                    { value: 'active', label: '활성' },
                    { value: 'inactive', label: '비활성' }
                  ]}
                />
              </Form.Item>
            </div>
          </Form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-500">드라이버명</span>
              <p className="text-base text-gray-900 mt-1">{basicInfo.name}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Ticker</span>
              <p className="text-base text-gray-900 mt-1">{basicInfo.ticker}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">전화번호</span>
              <p className="text-base text-gray-900 mt-1">{basicInfo.phone || '-'}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">차종</span>
              <p className="text-base text-gray-900 mt-1">{basicInfo.vehicleType || '-'}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">보유통수</span>
              <p className="text-base text-gray-900 mt-1">{basicInfo.tankCount ? `${basicInfo.tankCount}통` : '-'}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Driver Level</span>
              <p className="text-base text-gray-900 mt-1">{basicInfo.driverLevel || '-'}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">상태</span>
              <p className="text-base text-gray-900 mt-1">
                {basicInfo.status === 'active' ? (
                  <Tag color="green">활성</Tag>
                ) : (
                  <Tag color="default">비활성</Tag>
                )}
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* 정산사업자 정보 */}
      <Card
        title="정산사업자 정보"
        extra={
          editingSettlement ? (
            <Space>
              <Button onClick={handleSettlementCancel}>취소</Button>
              <Button type="primary" onClick={handleSettlementSave}>저장</Button>
            </Space>
          ) : (
            <Button icon={<EditOutlined />} onClick={handleSettlementEdit}>수정</Button>
          )
        }
        className="mb-4"
      >
        {editingSettlement ? (
          <Form form={settlementForm} layout="vertical">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                rules={[{ max: 50, message: '최대 50자' }]}
              >
                <Input placeholder="만진수산" />
              </Form.Item>

              <Form.Item
                name="representative"
                label="대표자"
                rules={[{ max: 10, message: '최대 10자' }]}
              >
                <Input placeholder="김만진" />
              </Form.Item>

              <Form.Item
                name="businessAddress"
                label="사업자등록주소"
                rules={[{ max: 100, message: '최대 100자' }]}
              >
                <Input placeholder="경기도 수지구 동천동 230-3" />
              </Form.Item>

              <Form.Item name="taxType" label="사업자 과세유형">
                <Select
                  options={[
                    { value: '과세', label: '과세' },
                    { value: '면세', label: '면세' }
                  ]}
                />
              </Form.Item>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">은행계좌정보</label>
              <Form.List name="bankAccounts">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map((field, index) => (
                      <div key={field.key} className="bg-gray-50 rounded-lg border border-gray-200 p-4 mb-3">
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
                            <Input placeholder="123-456789-01234" />
                          </Form.Item>
                          <Form.Item
                            {...field}
                            name={[field.name, 'holder']}
                            label="예금주"
                            rules={[{ required: true, message: '예금주 입력' }]}
                            style={{ marginBottom: 0 }}
                          >
                            <Input placeholder="김만진" />
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
            </div>

            <Form.Item name="certificate" label="사업자등록증" valuePropName="fileList" getValueFromEvent={(e) => e?.fileList} className="mt-4">
              <Upload beforeUpload={() => false} maxCount={1} accept="image/*,.pdf">
                <Button icon={<UploadOutlined />}>사업자등록증 첨부하기 (최대 10MB)</Button>
              </Upload>
            </Form.Item>
          </Form>
        ) : settlementInfo ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-500">사업자등록번호</span>
              <p className="text-base text-gray-900 mt-1">{settlementInfo.businessNumber}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">사업자등록상호</span>
              <p className="text-base text-gray-900 mt-1">{settlementInfo.businessName}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">대표자</span>
              <p className="text-base text-gray-900 mt-1">{settlementInfo.representative}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">사업자등록주소</span>
              <p className="text-base text-gray-900 mt-1">{settlementInfo.businessAddress}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">사업자 과세유형</span>
              <p className="text-base text-gray-900 mt-1">
                {settlementInfo.taxType === '과세' ? (
                  <Tag color="#1890FF">과세</Tag>
                ) : settlementInfo.taxType === '면세' ? (
                  <Tag color="#52C41A">면세</Tag>
                ) : (
                  '-'
                )}
              </p>
            </div>
            <div className="md:col-span-2">
              <span className="text-sm font-medium text-gray-500">은행계좌정보</span>
              <div className="mt-2 space-y-2">
                {settlementInfo.bankAccounts.map((acc, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-sm text-gray-900">{acc.bank} {acc.accountNumber} ({acc.holder})</span>
                    {acc.isPrimary && <Tag color="gold">주사용</Tag>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">정산사업자 정보가 등록되지 않았습니다.</p>
        )}
      </Card>

      {/* 클레임/사고 이력 */}
      <Card
        title="클레임/사고 이력"
        extra={<Button icon={<PlusOutlined />} onClick={handleClaimAdd}>이력 추가</Button>}
      >
        {claims.length > 0 ? (
          <Timeline>
            {claims.map((claim) => (
              <Timeline.Item key={claim.id}>
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="text-sm font-medium text-gray-900">{claim.occurredAt}</span>
                      <span className="text-xs text-gray-500 ml-2">작성자: {claim.author}</span>
                    </div>
                    <Space>
                      <Button size="small" onClick={() => handleClaimEdit(claim)}>수정</Button>
                      <Button size="small" danger onClick={() => handleClaimDelete(claim.id)}>삭제</Button>
                    </Space>
                  </div>
                  <Tag color="red" style={{ marginBottom: 8 }}>{claim.incidentType}</Tag>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{claim.content}</p>
                </div>
              </Timeline.Item>
            ))}
          </Timeline>
        ) : (
          <p className="text-gray-500">등록된 클레임/사고 이력이 없습니다.</p>
        )}
      </Card>

      {/* 클레임/사고 이력 추가/수정 모달 */}
      <Modal
        title={editingClaimId ? '클레임/사고 이력 수정' : '클레임/사고 이력 추가'}
        open={claimModalVisible}
        onOk={handleClaimSave}
        onCancel={() => {
          setClaimModalVisible(false);
          claimForm.resetFields();
        }}
        okText="저장"
        cancelText="취소"
        width={600}
      >
        <Form form={claimForm} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="occurredAt"
            label="발생일시"
            rules={[{ required: true, message: '발생일시를 선택해주세요' }]}
          >
            <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="incidentType"
            label="사고유형"
            rules={[{ required: true, message: '사고유형을 선택해주세요' }]}
          >
            <Select
              options={[
                { value: '산소농도 조절 실패', label: '산소농도 조절 실패' },
                { value: '운송 지연', label: '운송 지연' },
                { value: '활어 폐사', label: '활어 폐사' },
                { value: '교통사고', label: '교통사고' },
                { value: '기타', label: '기타' }
              ]}
            />
          </Form.Item>

          <Form.Item
            name="content"
            label="내용"
            rules={[
              { required: true, message: '내용을 입력해주세요' },
              { max: 500, message: '최대 500자' }
            ]}
          >
            <TextArea rows={5} placeholder="사고 내용을 입력하세요" />
          </Form.Item>

          <Form.Item name="images" label="이미지" valuePropName="fileList" getValueFromEvent={(e) => e?.fileList}>
            <Upload beforeUpload={() => false} maxCount={5} accept="image/*,.pdf" listType="picture">
              <Button icon={<UploadOutlined />}>이미지 첨부 (최대 5개, 10MB)</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default DriverDetail;
