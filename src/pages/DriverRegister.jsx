import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Form, Input, Select, Button, Space, message, Upload, Tag, Card, Flex, Typography, Row, Col
} from 'antd';
import {
  ArrowLeftOutlined, PlusOutlined, MinusCircleOutlined, UploadOutlined
} from '@ant-design/icons';
import { businessRegistry } from '../data/mockData';

const { Title } = Typography;

function DriverRegister() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // 사업자등록번호 입력 시 자동 채우기
  const handleBusinessNumberChange = (e) => {
    const value = e.target.value;

    if (/^\d{3}-\d{2}-\d{5}$/.test(value)) {
      const businessInfo = businessRegistry[value];

      if (businessInfo) {
        form.setFieldsValue({
          businessName: businessInfo.businessName,
          representative: businessInfo.representative,
          businessAddress: businessInfo.businessAddress,
          taxType: businessInfo.taxType,
        });
        message.success('등록된 사업자 정보를 불러왔습니다.');
      } else {
        form.setFieldsValue({
          businessName: undefined,
          representative: undefined,
          businessAddress: undefined,
          taxType: undefined,
        });
      }
    }
  };

  // 저장
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Ticker 중복 체크 (간단 구현)
      // 실제로는 바이어, 셀러, 조인유통, 드라이버 전체 유형에서 중복 체크 필요

      // 최소 정보 등록 여부 확인
      const hasMinimalInfo = values.name && values.ticker;
      const hasFullInfo = values.businessNumber || values.businessName;

      if (hasMinimalInfo && !hasFullInfo) {
        message.success(`드라이버 '${values.name}'이 등록되었습니다. 추가 정보는 상세 페이지에서 수정할 수 있습니다.`);
      } else {
        message.success(`드라이버 '${values.name}'이 등록되었습니다.`);
      }

      // 상세 페이지로 이동 (실제로는 생성된 ID로)
      setTimeout(() => {
        navigate('/driver/1');
      }, 500);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  // 차종 변경 시 보유통수 자동 설정
  const handleVehicleTypeChange = (value) => {
    if (value === '5.0톤') {
      form.setFieldsValue({ tankCount: 10 });
    } else if (value === '1.0톤') {
      form.setFieldsValue({ tankCount: 4 });
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '16px 24px', background: '#f5f5f5' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 헤더 */}
        <div>
          <Button onClick={() => navigate('/driver')} icon={<ArrowLeftOutlined />} style={{ marginBottom: 16 }}>
            목록으로
          </Button>
          <Title level={2}>드라이버 등록</Title>
        </div>

      <Form form={form} layout="vertical">
        {/* 드라이버 기본 정보 */}
        <Card title="드라이버 기본 정보">
          <Row gutter={16}>
            <Col xs={24} md={12}><Form.Item
              name="name"
              label="드라이버명"
              rules={[
                { required: true, message: '드라이버명을 입력해주세요' },
                { max: 20, message: '최대 20자' }
              ]}
            >
              <Input placeholder="예: 정훈" />
            </Form.Item></Col>

            <Col xs={24} md={12}><Form.Item
              name="phone"
              label="전화번호"
              rules={[
                { pattern: /^010-\d{4}-\d{4}$/, message: '010-XXXX-XXXX 형식' }
              ]}
            >
              <Input placeholder="010-1234-5678" />
            </Form.Item></Col>

            <Col xs={24} md={12}><Form.Item name="vehicleType" label="차종">
              <Select
                placeholder="차종 선택"
                onChange={handleVehicleTypeChange}
                options={[
                  { value: '5.0톤', label: '5.0톤' },
                  { value: '1.0톤', label: '1.0톤' }
                ]}
              />
            </Form.Item></Col>

            <Col xs={24} md={12}><Form.Item name="tankCount" label="보유통수">
              <Select
                placeholder="보유통수 선택"
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
            </Form.Item></Col>

            <Col xs={24} md={12}><Form.Item name="driverLevel" label="Driver Level" initialValue="모름">
              <Select
                options={[
                  { value: '잘함', label: '잘함' },
                  { value: '보통', label: '보통' },
                  { value: '못함', label: '못함' },
                  { value: '모름', label: '모름' }
                ]}
              />
            </Form.Item></Col>
          </Row>
        </Card>

        {/* 정산사업자 정보 (선택사항) */}
        <Card title="정산사업자 정보 (선택사항)">
          <Row gutter={16}>
            <Col xs={24} md={12}><Form.Item
              name="businessNumber"
              label="사업자등록번호"
              rules={[
                { pattern: /^\d{3}-\d{2}-\d{5}$/, message: 'XXX-XX-XXXXX 형식' }
              ]}
              extra="등록된 사업자번호 입력 시 상호, 대표자, 주소, 과세유형이 자동으로 입력됩니다"
            >
              <Input placeholder="123-45-67890" onChange={handleBusinessNumberChange} />
            </Form.Item></Col>

            <Col xs={24} md={12}><Form.Item
              name="ticker"
              label="Ticker"
              rules={[
                { required: true, message: 'Ticker를 입력해주세요' },
                { max: 10, message: '최대 10자' },
                { pattern: /^[A-Za-z0-9]+$/, message: '영문, 숫자만 허용' }
              ]}
            >
              <Input placeholder="예: JH01" />
            </Form.Item></Col>

            <Col xs={24} md={12}><Form.Item
              name="businessName"
              label="사업자등록상호"
              rules={[{ max: 50, message: '최대 50자' }]}
            >
              <Input placeholder="만진수산" />
            </Form.Item></Col>

            <Col xs={24} md={12}><Form.Item
              name="representative"
              label="대표자"
              rules={[{ max: 10, message: '최대 10자' }]}
            >
              <Input placeholder="김만진" />
            </Form.Item></Col>

            <Col xs={24} md={12}><Form.Item
              name="businessAddress"
              label="사업자등록주소"
              rules={[{ max: 100, message: '최대 100자' }]}
            >
              <Input placeholder="경기도 수지구 동천동 230-3" />
            </Form.Item></Col>

            <Col xs={24} md={12}><Form.Item name="taxType" label="사업자 과세유형">
              <Select
                placeholder="선택"
                options={[
                  { value: '일반과세', label: '일반과세' },
                  { value: '간이과세', label: '간이과세' },
                  { value: '면세', label: '면세' }
                ]}
              />
            </Form.Item></Col>
          </Row>

          <div style={{ marginTop: 16 }}>
            <label className="block text-sm font-medium text-gray-700 mb-2">은행계좌정보</label>
            <Form.List name="bankAccounts" initialValue={[{}]}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field, index) => (
                    <div key={field.key} className="bg-gray-50 rounded-lg border border-gray-200 p-4 mb-3">
                      <Space align="start" style={{ width: '100%' }}>
                        <Col xs={24} md={12}><Form.Item
                          {...field}
                          name={[field.name, 'bank']}
                          label="은행명"
                          style={{ marginBottom: 0 }}
                        >
                          <Input placeholder="하나은행" />
                        </Form.Item></Col>
                        <Col xs={24} md={12}><Form.Item
                          {...field}
                          name={[field.name, 'accountNumber']}
                          label="계좌번호"
                          style={{ marginBottom: 0 }}
                        >
                          <Input placeholder="123-456789-01234" />
                        </Form.Item></Col>
                        <Col xs={24} md={12}><Form.Item
                          {...field}
                          name={[field.name, 'holder']}
                          label="예금주"
                          style={{ marginBottom: 0 }}
                        >
                          <Input placeholder="김만진" />
                        </Form.Item></Col>
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

          <Form.Item name="certificate" label="사업자등록증" valuePropName="fileList" getValueFromEvent={(e) => e?.fileList} style={{ marginTop: 16 }}>
            <Upload beforeUpload={() => false} maxCount={1} accept="image/*,.pdf">
              <Button icon={<UploadOutlined />}>사업자등록증 첨부하기 (최대 10MB)</Button>
            </Upload>
          </Form.Item>
        </Card>

        {/* 하단 버튼 */}
        <Space>
          <Button size="large" onClick={() => navigate('/driver')}>
            취소
          </Button>
          <Button type="primary" size="large" onClick={handleSubmit}>
            저장
          </Button>
        </Space>
      </Form>
      </Space>
    </div>
  );
}

export default DriverRegister;
