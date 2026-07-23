import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Form, Input, Select, Button, Radio, Space, Card, Table, DatePicker, AutoComplete,
  InputNumber, Checkbox, Alert, Descriptions, message, Modal, Row, Col
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { transactionLedgerData, buyerGroups, sellerGroups } from '../data/mockData';

const { TextArea } = Input;

function ClaimAdjustmentRegister() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // 상태
  const [searchResults, setSearchResults] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [needsLedgerUpdate, setNeedsLedgerUpdate] = useState(true);
  const [enabledAdjustments, setEnabledAdjustments] = useState({
    buyer: false,
    seller: false,
    driver: false,
    accounting: false,
  });
  const [sellerAdjustmentType, setSellerAdjustmentType] = useState('quantity'); // 'quantity' | 'amount'
  const [finalLoss, setFinalLoss] = useState(0);

  // 금액 포맷
  const formatCurrency = (value) => {
    if (value === null || value === undefined) return '-';
    return `${value.toLocaleString()}원`;
  };

  // Step 1: 거래 검색
  const handleSearch = () => {
    const searchValues = form.getFieldsValue(['deliveryDate', 'buyerGroupName', 'sellerGroupName', 'product', 'spec']);

    if (!searchValues.deliveryDate) {
      message.error('납품일을 선택해주세요.');
      return;
    }
    if (!searchValues.buyerGroupName) {
      message.error('바이어그룹명을 입력해주세요.');
      return;
    }

    const deliveryDateStr = searchValues.deliveryDate.format('YYYY-MM-DD');

    const results = transactionLedgerData.filter(item => {
      if (item.납품일 !== deliveryDateStr) return false;
      if (searchValues.buyerGroupName && item.바이어그룹명 !== searchValues.buyerGroupName) return false;
      if (searchValues.sellerGroupName && item.셀러그룹명 !== searchValues.sellerGroupName) return false;
      if (searchValues.product && item.품목 !== searchValues.product) return false;
      if (searchValues.spec && item.규격 !== searchValues.spec) return false;
      return true;
    });

    if (results.length === 0) {
      message.warning('검색 결과가 없습니다. 검색 조건을 확인해주세요.');
    }

    setSearchResults(results);
  };

  // 거래 선택
  const handleSelectTransaction = (record) => {
    setSelectedTransaction(record);
  };


  // 조정액 자동 계산
  const calculateAdjustments = () => {
    const values = form.getFieldsValue();
    let total = 0;

    // 바이어 조정액
    if (enabledAdjustments.buyer && values.buyerAdjustmentQuantity) {
      const buyerAmount = values.buyerAdjustmentQuantity * selectedTransaction.도착단가;
      form.setFieldValue('buyerAdjustmentAmount', buyerAmount);
      total += buyerAmount;
    }

    // 셀러 조정액 (물량 방식)
    if (enabledAdjustments.seller && sellerAdjustmentType === 'quantity' && values.sellerAdjustmentQuantity) {
      const sellerAmount = values.sellerAdjustmentQuantity * selectedTransaction.상차단가;
      form.setFieldValue('sellerAdjustmentAmount', sellerAmount);
      total += sellerAmount;
    }

    // 셀러 조정액 (금액 방식)
    if (enabledAdjustments.seller && sellerAdjustmentType === 'amount' && values.sellerAdjustmentAmount) {
      total += values.sellerAdjustmentAmount;
    }

    // 드라이버 조정액
    if (enabledAdjustments.driver && values.driverAdjustmentAmount) {
      total += values.driverAdjustmentAmount;
    }

    // 회계처리 조정액
    if (enabledAdjustments.accounting && values.accountingAdjustmentAmount) {
      total += values.accountingAdjustmentAmount;
    }

    setFinalLoss(total);
  };

  // 조정 체크박스 변경
  const handleAdjustmentCheckChange = (type, checked) => {
    setEnabledAdjustments(prev => ({ ...prev, [type]: checked }));

    // 체크 해제 시 필드 초기화
    if (!checked) {
      if (type === 'buyer') {
        form.setFieldsValue({ buyerAdjustmentQuantity: undefined, buyerAdjustmentAmount: undefined });
      } else if (type === 'seller') {
        form.setFieldsValue({ sellerAdjustmentQuantity: undefined, sellerAdjustmentAmount: undefined });
      } else if (type === 'driver') {
        form.setFieldValue('driverAdjustmentAmount', undefined);
      } else if (type === 'accounting') {
        form.setFieldValue('accountingAdjustmentAmount', undefined);
      }
    }

    // 재계산
    setTimeout(calculateAdjustments, 0);
  };

  // 등록 완료
  const handleSubmit = async () => {
    try {
      // 거래 선택 확인
      if (!selectedTransaction) {
        message.error('거래를 선택해주세요.');
        return;
      }

      const values = await form.validateFields();

      // 장부 반영 필요 시 최소 하나의 조정 항목 필요
      if (needsLedgerUpdate) {
        const hasAnyAdjustment = Object.values(enabledAdjustments).some(v => v);
        if (!hasAnyAdjustment) {
          message.error('최소 하나의 조정 항목을 선택해주세요.');
          return;
        }

        // 최종 손실 < 0일 때 귀책 선택 필수
        if (finalLoss < 0 && !values.accountability) {
          message.error('손실의 귀책 사유를 선택해주세요.');
          return;
        }
      }

      // TODO: API 호출하여 클레임 등록 및 거래장부 업데이트

      message.success('클레임/조정이 등록되었습니다.');
      navigate('/claim-adjustment');
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  // 취소
  const handleCancel = () => {
    const hasInput = form.isFieldsTouched();

    if (hasInput) {
      Modal.confirm({
        title: '등록 취소',
        content: '입력한 내용이 저장되지 않습니다. 취소하시겠습니까?',
        okText: '확인',
        cancelText: '취소',
        onOk: () => navigate('/claim-adjustment'),
      });
    } else {
      navigate('/claim-adjustment');
    }
  };

  // 검색 결과 테이블 칼럼
  const searchColumns = [
    {
      title: '거래코드',
      dataIndex: '거래코드',
      key: '거래코드',
      width: 160,
    },
    {
      title: '바이어명',
      dataIndex: '바이어명',
      key: '바이어명',
      width: 100,
    },
    {
      title: '셀러명',
      dataIndex: '셀러명',
      key: '셀러명',
      width: 100,
    },
    {
      title: '품목',
      dataIndex: '품목',
      key: '품목',
      width: 80,
    },
    {
      title: '규격',
      dataIndex: '규격',
      key: '규격',
      width: 100,
    },
    {
      title: '상차단가',
      dataIndex: '상차단가',
      key: '상차단가',
      width: 100,
      align: 'right',
      render: (value) => formatCurrency(value),
    },
    {
      title: '도착단가',
      dataIndex: '도착단가',
      key: '도착단가',
      width: 100,
      align: 'right',
      render: (value) => formatCurrency(value),
    },
    {
      title: '주문수량',
      dataIndex: '주문수량',
      key: '주문수량',
      width: 100,
      render: (value, record) => `${value}${record.주문단위}`,
    },
    {
      title: '주문중량',
      dataIndex: '주문중량',
      key: '주문중량',
      width: 100,
      render: (value) => `${value}kg`,
    },
    {
      title: '드라이버명',
      dataIndex: '드라이버명',
      key: '드라이버명',
      width: 100,
    },
    {
      title: '통당운임',
      dataIndex: '통당운임단가',
      key: '통당운임단가',
      width: 100,
      align: 'right',
      render: (value) => formatCurrency(value),
    },
    {
      title: '매출액',
      dataIndex: '매출액',
      key: '매출액',
      width: 120,
      align: 'right',
      render: (value) => formatCurrency(value),
    },
    {
      title: '매입액',
      dataIndex: '매입액',
      key: '매입액',
      width: 120,
      align: 'right',
      render: (value) => formatCurrency(value),
    },
    {
      title: '운송비',
      dataIndex: '운송비(비용)',
      key: '운송비(비용)',
      width: 100,
      align: 'right',
      render: (value) => formatCurrency(value),
    },
  ];

  const uniqueProducts = [...new Set(transactionLedgerData.map(item => item.품목))].filter(Boolean);
  const uniqueSpecs = [...new Set(transactionLedgerData.map(item => item.규격))].filter(Boolean);

  return (
    <div style={{ padding: '24px' }}>
      {/* 헤더 */}
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={handleCancel}
          >
            목록으로
          </Button>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>클레임/조정 등록</h2>
        </div>
        <Space>
          <Button size="large" onClick={handleCancel}>
            취소
          </Button>
          <Button type="primary" size="large" onClick={handleSubmit}>
            등록
          </Button>
        </Space>
      </div>

      <Form form={form} layout="vertical">
        {/* 거래 찾기 섹션 */}
        <Card title="거래 찾기" style={{ marginBottom: 16 }} size="small">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="deliveryDate"
                    label="납품일"
                    rules={[{ required: true, message: '납품일을 선택해주세요.' }]}
                  >
                    <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="buyerGroupName"
                    label="바이어그룹명"
                    rules={[{ required: true, message: '바이어그룹명을 입력해주세요.' }]}
                  >
                    <AutoComplete
                      options={buyerGroups.map(g => ({ value: g.name }))}
                      placeholder="필수"
                      filterOption={(inputValue, option) =>
                        option.value.toLowerCase().includes(inputValue.toLowerCase())
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name="sellerGroupName" label="셀러그룹명">
                    <AutoComplete
                      options={sellerGroups.map(g => ({ value: g.name }))}
                      placeholder="선택"
                      filterOption={(inputValue, option) =>
                        option.value.toLowerCase().includes(inputValue.toLowerCase())
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="product" label="품목">
                    <AutoComplete
                      options={uniqueProducts.map(p => ({ value: p }))}
                      placeholder="선택"
                      filterOption={(inputValue, option) =>
                        option.value.toLowerCase().includes(inputValue.toLowerCase())
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="spec" label="규격">
                    <AutoComplete
                      options={uniqueSpecs.map(s => ({ value: s }))}
                      placeholder="선택"
                      filterOption={(inputValue, option) =>
                        option.value.toLowerCase().includes(inputValue.toLowerCase())
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Button type="primary" onClick={handleSearch} block>
                검색
              </Button>

              {searchResults.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <Table
                    columns={searchColumns}
                    dataSource={searchResults}
                    rowKey="key"
                    pagination={{ defaultPageSize: 5, pageSize: 5 }}
                    rowSelection={{
                      type: 'radio',
                      selectedRowKeys: selectedTransaction ? [selectedTransaction.key] : [],
                      onChange: (_, selectedRows) => handleSelectTransaction(selectedRows[0]),
                    }}
                    scroll={{ x: 1600 }}
                    size="small"
                  />
                </div>
              )}
            </Card>

        {/* 클레임 내용 섹션 */}
        <Card title="클레임 내용" style={{ marginBottom: 16 }} size="small">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="claimType"
                label="클레임/조정 유형"
                rules={[{ required: true, message: '필수' }]}
              >
                <Select placeholder="선택">
                  <Select.Option value="살밥">살밥</Select.Option>
                  <Select.Option value="로스">로스</Select.Option>
                  <Select.Option value="사이즈">사이즈</Select.Option>
                  <Select.Option value="폐사">폐사</Select.Option>
                  <Select.Option value="외관">외관</Select.Option>
                  <Select.Option value="기형">기형</Select.Option>
                  <Select.Option value="기타">기타</Select.Option>
                  <Select.Option value="회계처리용">회계처리용</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="severity"
                label="심각도"
                rules={[{ required: true, message: '필수' }]}
              >
                <Radio.Group>
                  <Radio value="매우심각">매우심각</Radio>
                  <Radio value="심각">심각</Radio>
                  <Radio value="보통">보통</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="claimContent"
            label="클레임/조정 내용"
            rules={[
              { required: true, message: '필수' },
              { min: 5, message: '5자 이상' }
            ]}
          >
            <TextArea
              rows={4}
              maxLength={500}
              placeholder="클레임 또는 조정 사유를 입력해주세요"
              showCount
            />
          </Form.Item>
        </Card>

        {/* 거래 정보 요약 (선택 시에만 표시) */}
        {selectedTransaction && (
          <Card title="선택된 거래 정보" style={{ marginBottom: 16 }} size="small">
              <Descriptions bordered size="small" column={3}>
                <Descriptions.Item label="거래코드">{selectedTransaction.거래코드}</Descriptions.Item>
                <Descriptions.Item label="품목 정보">
                  {selectedTransaction.품목} / {selectedTransaction.규격} / {selectedTransaction.원산지}
                </Descriptions.Item>
                <Descriptions.Item label="주문 정보">
                  {selectedTransaction.주문수량}{selectedTransaction.주문단위} ({selectedTransaction.주문중량}kg)
                </Descriptions.Item>
                <Descriptions.Item label="거래 주체" span={2}>
                  {selectedTransaction.바이어명} → {selectedTransaction.셀러명} ({selectedTransaction.드라이버명})
                </Descriptions.Item>
                <Descriptions.Item label="단가 정보">
                  <span style={{ color: '#8c8c8c' }}>
                    상차단가 {formatCurrency(selectedTransaction.상차단가)} /
                    도착단가 {formatCurrency(selectedTransaction.도착단가)} /
                    통당운임 {formatCurrency(selectedTransaction.통당운임단가)}
                  </span>
                </Descriptions.Item>
              </Descriptions>
            </Card>
        )}

        {/* 장부 반영 설정 (거래 선택 시에만 표시) */}
        {selectedTransaction && (
          <Card title="장부 반영 설정" style={{ marginBottom: 16 }}>
            <Form.Item
              name="needsLedgerUpdate"
              label="장부 반영 여부"
              rules={[{ required: true, message: '필수' }]}
              initialValue={true}
            >
              <Radio.Group onChange={(e) => setNeedsLedgerUpdate(e.target.value)}>
                <Radio value={true}>필요함</Radio>
                <Radio value={false}>불필요</Radio>
              </Radio.Group>
            </Form.Item>

            {/* 조정 내역 */}
            <div style={{ marginTop: 16 }}>
              <div style={{
                marginBottom: 12,
                fontWeight: 600,
                fontSize: 14,
                opacity: needsLedgerUpdate ? 1 : 0.5
              }}>
                조정 내역
              </div>
              {/* 바이어 매출 조정 */}
              <div style={{ marginBottom: 24 }}>
                <Checkbox
                  checked={enabledAdjustments.buyer}
                  onChange={(e) => handleAdjustmentCheckChange('buyer', e.target.checked)}
                  disabled={!needsLedgerUpdate}
                >
                  바이어 매출 조정
                </Checkbox>

                {enabledAdjustments.buyer && needsLedgerUpdate && (
                  <div style={{ marginTop: 12, marginLeft: 24 }}>
                    <Form.Item
                      name="buyerAdjustmentQuantity"
                      label="조정물량"
                      rules={[{ required: true, message: '조정물량을 입력해주세요.' }]}
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        step={0.1}
                        addonAfter="kg"
                        placeholder="차감은 마이너스(-), 추가는 플러스(+)"
                        onChange={calculateAdjustments}
                      />
                    </Form.Item>
                    <div style={{ color: '#8c8c8c', marginBottom: 8 }}>
                      도착단가: {formatCurrency(selectedTransaction.도착단가)}
                    </div>
                    <Form.Item name="buyerAdjustmentAmount" label="조정액">
                      <InputNumber
                        style={{ width: '100%' }}
                        disabled
                        addonAfter="원"
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      />
                    </Form.Item>
                  </div>
                )}
              </div>

              {/* 셀러 조정 */}
              <div style={{ marginBottom: 24 }}>
                <Checkbox
                  checked={enabledAdjustments.seller}
                  onChange={(e) => handleAdjustmentCheckChange('seller', e.target.checked)}
                  disabled={!needsLedgerUpdate}
                >
                  셀러 조정
                </Checkbox>

                {enabledAdjustments.seller && needsLedgerUpdate && (
                  <div style={{ marginTop: 12, marginLeft: 24 }}>
                    <Form.Item name="sellerAdjustmentType" label="조정 방식" initialValue="quantity">
                      <Radio.Group onChange={(e) => {
                        setSellerAdjustmentType(e.target.value);
                        form.setFieldsValue({ sellerAdjustmentQuantity: undefined, sellerAdjustmentAmount: undefined });
                        setTimeout(calculateAdjustments, 0);
                      }}>
                        <Radio value="quantity">물량 조정</Radio>
                        <Radio value="amount">금액 조정</Radio>
                      </Radio.Group>
                    </Form.Item>

                    {sellerAdjustmentType === 'quantity' && (
                      <>
                        <Form.Item
                          name="sellerAdjustmentQuantity"
                          label="조정물량"
                          rules={[{ required: true, message: '조정물량을 입력해주세요.' }]}
                        >
                          <InputNumber
                            style={{ width: '100%' }}
                            step={0.1}
                            addonAfter="kg"
                            placeholder="차감은 마이너스(-), 추가는 플러스(+)"
                            onChange={calculateAdjustments}
                          />
                        </Form.Item>
                        <div style={{ color: '#8c8c8c', marginBottom: 8 }}>
                          상차단가: {formatCurrency(selectedTransaction.상차단가)}
                        </div>
                        <Form.Item name="sellerAdjustmentAmount" label="조정액">
                          <InputNumber
                            style={{ width: '100%' }}
                            disabled
                            addonAfter="원"
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          />
                        </Form.Item>
                        <div style={{ color: '#8c8c8c', fontSize: 12 }}>
                          주문중량도 ±{form.getFieldValue('sellerAdjustmentQuantity') || 0}kg 반영됩니다
                        </div>
                      </>
                    )}

                    {sellerAdjustmentType === 'amount' && (
                      <>
                        <Form.Item
                          name="sellerAdjustmentAmount"
                          label="조정액"
                          rules={[{ required: true, message: '조정액을 입력해주세요.' }]}
                        >
                          <InputNumber
                            style={{ width: '100%' }}
                            addonAfter="원"
                            placeholder="차감은 마이너스(-) 직접 입력"
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/[^\d-]/g, '')}
                            onChange={calculateAdjustments}
                          />
                        </Form.Item>
                        <div style={{ color: '#8c8c8c', fontSize: 12 }}>
                          주문중량은 변동 없습니다
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* 드라이버 운임 조정 */}
              <div style={{ marginBottom: 24 }}>
                <Checkbox
                  checked={enabledAdjustments.driver}
                  onChange={(e) => handleAdjustmentCheckChange('driver', e.target.checked)}
                  disabled={!needsLedgerUpdate}
                >
                  드라이버 운임 조정
                </Checkbox>

                {enabledAdjustments.driver && needsLedgerUpdate && (
                  <div style={{ marginTop: 12, marginLeft: 24 }}>
                    <div style={{ color: '#8c8c8c', marginBottom: 8 }}>
                      통당운임: {formatCurrency(selectedTransaction.통당운임단가)}
                    </div>
                    <Form.Item
                      name="driverAdjustmentAmount"
                      label="조정액"
                      rules={[{ required: true, message: '조정액을 입력해주세요.' }]}
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        addonAfter="원"
                        placeholder="차감은 마이너스(-) 직접 입력"
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/[^\d-]/g, '')}
                        onChange={calculateAdjustments}
                      />
                    </Form.Item>
                  </div>
                )}
              </div>

              {/* 회계처리 조정 */}
              <div style={{ marginBottom: 24 }}>
                <Checkbox
                  checked={enabledAdjustments.accounting}
                  onChange={(e) => handleAdjustmentCheckChange('accounting', e.target.checked)}
                  disabled={!needsLedgerUpdate}
                >
                  회계처리 조정 (잡손실/잡이익)
                </Checkbox>

                {enabledAdjustments.accounting && needsLedgerUpdate && (
                  <div style={{ marginTop: 12, marginLeft: 24 }}>
                    <Form.Item
                      name="accountingAdjustmentAmount"
                      label="조정액"
                      rules={[{ required: true, message: '조정액을 입력해주세요.' }]}
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        addonAfter="원"
                        placeholder="차감은 마이너스(-), 추가는 플러스(+)"
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/[^\d-]/g, '')}
                        onChange={calculateAdjustments}
                      />
                    </Form.Item>
                  </div>
                )}
              </div>
            </div>

            {/* 손실 귀책 지정 (조건부) */}
            {needsLedgerUpdate && finalLoss < 0 && (
          <Alert
            type="warning"
            message="손실 귀책 지정"
            description={
              <div>
                <div style={{ color: '#ff4d4f', fontWeight: 600, marginBottom: 12 }}>
                  최종 손실: {formatCurrency(finalLoss)} (모든 조정액 합계)
                </div>
                <div style={{ marginBottom: 8 }}>이 손실의 귀책은 누구에게 있나요?</div>
                <Form.Item
                  name="accountability"
                  rules={[{ required: true, message: '필수' }]}
                >
                  <Radio.Group>
                    <Space direction="vertical">
                      <Radio value="buyer">바이어 귀책</Radio>
                      <Radio value="seller">셀러 귀책</Radio>
                      <Radio value="shared">공동 귀책 (50:50)</Radio>
                    </Space>
                  </Radio.Group>
                </Form.Item>
              </div>
            }
            style={{ marginBottom: 16 }}
          />
            )}
          </Card>
        )}
      </Form>
    </div>
  );
}

export default ClaimAdjustmentRegister;
