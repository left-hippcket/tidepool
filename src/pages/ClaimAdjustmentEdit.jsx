import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Form, Input, Select, Button, Radio, Space, Card, Steps, Table, DatePicker, AutoComplete,
  InputNumber, Checkbox, Alert, Descriptions, message, Divider, Modal, Row, Col
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { claimAdjustmentData } from '../data/mockData';

const { TextArea } = Input;

function ClaimAdjustmentEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [claimData, setClaimData] = useState(null);

  // Step 2 상태
  const [needsLedgerUpdate, setNeedsLedgerUpdate] = useState(true);
  const [originalNeedsLedgerUpdate, setOriginalNeedsLedgerUpdate] = useState(true);
  const [enabledAdjustments, setEnabledAdjustments] = useState({
    buyer: false,
    seller: false,
    driver: false,
    accounting: false,
  });
  const [sellerAdjustmentType, setSellerAdjustmentType] = useState('quantity'); // 'quantity' | 'amount'
  const [finalLoss, setFinalLoss] = useState(0);
  const [accountabilityType, setAccountabilityType] = useState('single'); // 'single' | 'shared'
  const [sharedAccountability, setSharedAccountability] = useState({ buyer: 0, seller: 0 });

  // 데이터 로드
  useEffect(() => {
    const claim = claimAdjustmentData.find(c => c.id === parseInt(id));

    if (!claim) {
      message.error('클레임/조정 정보를 찾을 수 없습니다.');
      navigate('/claim-adjustment');
      return;
    }

    setClaimData(claim);

    // Step 1 필드 채우기 (읽기 전용)
    form.setFieldsValue({
      deliveryDate: dayjs(claim.납품일),
      buyerGroupName: claim.바이어그룹명,
      sellerGroupName: claim.셀러그룹명,
      product: claim.품목,
      spec: claim.규격,
      claimType: claim.클레임유형,
      severity: claim.심각도,
      claimContent: claim.클레임내용,
    });

    // Step 2 필드 채우기
    const ledgerUpdateNeeded = claim.장부반영여부;
    setNeedsLedgerUpdate(ledgerUpdateNeeded);
    setOriginalNeedsLedgerUpdate(ledgerUpdateNeeded);

    form.setFieldsValue({
      needsLedgerUpdate: ledgerUpdateNeeded,
    });

    if (ledgerUpdateNeeded) {
      // 조정 활성화 상태 설정
      const adjustments = {
        buyer: claim.바이어조정액 !== 0,
        seller: claim.셀러조정액 !== 0,
        driver: claim.드라이버조정액 !== 0,
        accounting: claim.회계처리조정액 !== 0,
      };
      setEnabledAdjustments(adjustments);

      // 셀러 조정 타입 판단
      if (adjustments.seller) {
        const type = claim.셀러조정물량 ? 'quantity' : 'amount';
        setSellerAdjustmentType(type);
        form.setFieldValue('sellerAdjustmentType', type);

        if (type === 'quantity') {
          form.setFieldsValue({
            sellerAdjustmentQuantity: claim.셀러조정물량,
            sellerAdjustmentAmount: claim.셀러조정액,
          });
        } else {
          form.setFieldValue('sellerAdjustmentAmount', claim.셀러조정액);
        }
      }

      // 조정액 필드 채우기
      if (adjustments.buyer) {
        // 바이어 조정물량 역산 (조정액 / 도착단가)
        const quantity = claim.바이어조정액 / claim.도착단가;
        form.setFieldsValue({
          buyerAdjustmentQuantity: quantity,
          buyerAdjustmentAmount: claim.바이어조정액,
        });
      }

      if (adjustments.driver) {
        form.setFieldValue('driverAdjustmentAmount', claim.드라이버조정액);
      }

      if (adjustments.accounting) {
        form.setFieldValue('accountingAdjustmentAmount', claim.회계처리조정액);
      }

      // 최종 손실 및 귀책
      const loss = claim.최종손실 || 0;
      setFinalLoss(loss);

      if (loss < 0 && claim.귀책) {
        // 귀책이 "공동"이고 바이어/셀러 귀책액이 있으면 shared, 아니면 single
        if (claim.귀책 === '공동' && claim.바이어귀책액 && claim.셀러귀책액) {
          setAccountabilityType('shared');
          form.setFieldsValue({
            accountabilityType: 'shared',
            buyerAccountabilityAmount: claim.바이어귀책액,
            sellerAccountabilityAmount: claim.셀러귀책액,
          });
          setSharedAccountability({ buyer: claim.바이어귀책액, seller: claim.셀러귀책액 });
        } else {
          setAccountabilityType('single');
          const accountabilityMap = {
            '바이어': 'buyer',
            '셀러': 'seller',
          };
          form.setFieldsValue({
            accountabilityType: 'single',
            accountability: accountabilityMap[claim.귀책] || 'buyer',
          });
        }
      }
    }
  }, [id, form, navigate]);

  // 금액 포맷
  const formatCurrency = (value) => {
    if (value === null || value === undefined) return '-';
    return `${value.toLocaleString()}원`;
  };

  // Step 1 → Step 2
  const handleNextStep = async () => {
    try {
      await form.validateFields(['claimType', 'severity', 'claimContent']);
      setCurrentStep(1);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  // Step 2 → Step 1
  const handlePrevStep = () => {
    setCurrentStep(0);
  };

  // 조정액 자동 계산
  const calculateAdjustments = () => {
    if (!claimData) return;

    const values = form.getFieldsValue();
    let total = 0;

    // 바이어 조정액 (매출 조정 = 그대로 반영)
    if (enabledAdjustments.buyer && values.buyerAdjustmentQuantity) {
      const buyerAmount = values.buyerAdjustmentQuantity * claimData.도착단가;
      form.setFieldValue('buyerAdjustmentAmount', buyerAmount);
      total += buyerAmount;
    }

    // 셀러 조정액 (물량 방식) - 매입 조정 = 부호 반대로 반영
    if (enabledAdjustments.seller && sellerAdjustmentType === 'quantity' && values.sellerAdjustmentQuantity) {
      const sellerAmount = values.sellerAdjustmentQuantity * claimData.상차단가;
      form.setFieldValue('sellerAdjustmentAmount', sellerAmount);
      total -= sellerAmount;
    }

    // 셀러 조정액 (금액 방식) - 매입 조정 = 부호 반대로 반영
    if (enabledAdjustments.seller && sellerAdjustmentType === 'amount' && values.sellerAdjustmentAmount) {
      total -= values.sellerAdjustmentAmount;
    }

    // 드라이버 조정액 (운송비 조정 = 부호 반대로 반영)
    if (enabledAdjustments.driver && values.driverAdjustmentAmount) {
      total -= values.driverAdjustmentAmount;
    }

    // 회계처리 조정액 (그대로 반영)
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

  // 장부 반영 변경 핸들러
  const handleLedgerUpdateChange = (value) => {
    // 필요함 → 불필요로 변경 시 확인 메시지
    if (originalNeedsLedgerUpdate && !value) {
      Modal.confirm({
        title: '장부 반영 변경',
        content: '장부 반영을 \'불필요\'로 변경하면 거래장부의 조정액이 모두 제거됩니다. 계속하시겠습니까?',
        okText: '확인',
        cancelText: '취소',
        onOk: () => {
          setNeedsLedgerUpdate(value);
          form.setFieldValue('needsLedgerUpdate', value);
        },
        onCancel: () => {
          form.setFieldValue('needsLedgerUpdate', needsLedgerUpdate);
        },
      });
    } else {
      setNeedsLedgerUpdate(value);
    }
  };

  // 수정 완료
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // 장부 반영 필요 시 최소 하나의 조정 항목 필요
      if (needsLedgerUpdate) {
        const hasAnyAdjustment = Object.values(enabledAdjustments).some(v => v);
        if (!hasAnyAdjustment) {
          message.error('최소 하나의 조정 항목을 선택해주세요.');
          return;
        }

        // 최종 손실 < 0일 때 귀책 선택 필수
        if (finalLoss < 0) {
          if (!values.accountabilityType) {
            message.error('귀책 유형을 선택해주세요.');
            return;
          }
          if (values.accountabilityType === 'single' && !values.accountability) {
            message.error('귀책 대상을 선택해주세요.');
            return;
          }
          if (values.accountabilityType === 'shared') {
            const buyerAmount = values.buyerAccountabilityAmount || 0;
            const sellerAmount = values.sellerAccountabilityAmount || 0;
            if (buyerAmount + sellerAmount !== finalLoss) {
              message.error('공동 귀책 금액의 합계가 최종 손실과 일치하지 않습니다.');
              return;
            }
          }
        }
      }

      // TODO: API 호출하여 클레임 수정 및 거래장부 업데이트

      message.success('클레임/조정이 수정되었습니다.');
      navigate('/claim-adjustment');
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  // 취소
  const handleCancel = () => {
    const hasChanges = form.isFieldsTouched();

    if (hasChanges) {
      Modal.confirm({
        title: '수정 취소',
        content: '수정한 내용이 저장되지 않습니다. 취소하시겠습니까?',
        okText: '확인',
        cancelText: '취소',
        onOk: () => navigate('/claim-adjustment'),
      });
    } else {
      navigate('/claim-adjustment');
    }
  };

  if (!claimData) {
    return <div style={{ padding: 24 }}>로딩 중...</div>;
  }

  return (
    <div style={{ padding: '24px' }}>
      {/* 헤더 */}
      <div style={{ marginBottom: 24 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={handleCancel}
          style={{ marginBottom: 16 }}
        >
          목록으로
        </Button>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>클레임/조정 수정</h2>
      </div>

      {/* Steps */}
      <Steps
        current={currentStep}
        items={[
          { title: '거래 찾기' },
          { title: '장부 반영' },
        ]}
        style={{ marginBottom: 24 }}
      />

      <Form form={form} layout="vertical">
        {/* Step 1: 거래 찾기 (읽기 전용) */}
        {currentStep === 0 && (
          <>
            {/* 거래 찾기 섹션 (읽기 전용) */}
            <Card title="거래 찾기 (변경 불가)" style={{ marginBottom: 16, backgroundColor: '#f5f5f5' }}>
              <Form.Item name="deliveryDate" label="납품일">
                <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} disabled />
              </Form.Item>

              <Form.Item name="buyerGroupName" label="바이어그룹명">
                <Input disabled />
              </Form.Item>

              <Form.Item name="sellerGroupName" label="셀러그룹명">
                <Input disabled />
              </Form.Item>

              <Form.Item name="product" label="품목">
                <Input disabled />
              </Form.Item>

              <Form.Item name="spec" label="규격">
                <Input disabled />
              </Form.Item>
            </Card>

            {/* 클레임 내용 섹션 (수정 가능) */}
            <Card title="클레임 내용" style={{ marginBottom: 16 }}>
              <Form.Item
                name="claimType"
                label="클레임/조정 유형"
                rules={[{ required: true, message: '클레임/조정 유형을 선택해주세요.' }]}
              >
                <Select placeholder="클레임 유형을 선택해주세요">
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

              <Form.Item
                name="severity"
                label="심각도"
                rules={[{ required: true, message: '심각도를 선택해주세요.' }]}
              >
                <Radio.Group>
                  <Radio value="매우심각">매우심각</Radio>
                  <Radio value="심각">심각</Radio>
                  <Radio value="보통">보통</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                name="claimContent"
                label="클레임/조정 내용"
                rules={[
                  { required: true, message: '클레임/조정 내용을 입력해주세요.' },
                  { min: 5, message: '클레임/조정 내용을 5자 이상 입력해주세요.' }
                ]}
              >
                <TextArea
                  rows={3}
                  maxLength={500}
                  placeholder="클레임 또는 조정 사유를 입력해주세요"
                />
              </Form.Item>
            </Card>

            {/* 하단 버튼 */}
            <Space>
              <Button size="large" onClick={handleCancel}>
                목록으로
              </Button>
              <Button type="primary" size="large" onClick={handleNextStep}>
                다음 →
              </Button>
            </Space>
          </>
        )}

        {/* Step 2: 장부 반영 */}
        {currentStep === 1 && (
          <>
            {/* 거래 정보 요약 */}
            <Card title="거래 정보 요약" style={{ marginBottom: 16 }}>
              <Descriptions bordered size="small" column={3}>
                <Descriptions.Item label="거래코드">{claimData.거래코드}</Descriptions.Item>
                <Descriptions.Item label="품목 정보">
                  {claimData.품목} / {claimData.규격} / {claimData.원산지}
                </Descriptions.Item>
                <Descriptions.Item label="주문 정보">
                  {claimData.주문수량}통 ({claimData.주문중량}kg)
                </Descriptions.Item>
                <Descriptions.Item label="거래 주체" span={2}>
                  {claimData.바이어명} → {claimData.셀러명} ({claimData.드라이버명})
                </Descriptions.Item>
                <Descriptions.Item label="단가 정보">
                  <span style={{ color: '#8c8c8c' }}>
                    상차단가 {formatCurrency(claimData.상차단가)} /
                    도착단가 {formatCurrency(claimData.도착단가)} /
                    통당운임 {formatCurrency(claimData.통당운임단가)}
                  </span>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* 장부 반영 */}
            <Card title="장부 반영" style={{ marginBottom: 16 }}>
              <Form.Item
                name="needsLedgerUpdate"
                label="장부 반영 여부"
                rules={[{ required: true, message: '장부 반영 여부를 선택해주세요.' }]}
              >
                <Radio.Group onChange={(e) => handleLedgerUpdateChange(e.target.value)}>
                  <Radio value={true}>필요함</Radio>
                  <Radio value={false}>불필요</Radio>
                </Radio.Group>
              </Form.Item>
            </Card>

            {/* 조정 내역 */}
            <Card
              title="조정 내역"
              style={{
                marginBottom: 16,
                opacity: needsLedgerUpdate ? 1 : 0.5
              }}
            >
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
                      도착단가: {formatCurrency(claimData.도착단가)}
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
                    <Form.Item name="sellerAdjustmentType" label="조정 방식">
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
                          상차단가: {formatCurrency(claimData.상차단가)}
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
                      통당운임: {formatCurrency(claimData.통당운임단가)}
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
            </Card>

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
                      name="accountabilityType"
                      rules={[{ required: true, message: '필수' }]}
                    >
                      <Radio.Group onChange={(e) => {
                        setAccountabilityType(e.target.value);
                        if (e.target.value === 'single') {
                          setSharedAccountability({ buyer: 0, seller: 0 });
                        }
                      }}>
                        <Space direction="vertical">
                          <Radio value="single">단일 귀책</Radio>
                          <Radio value="shared">공동 귀책 (비율 입력)</Radio>
                        </Space>
                      </Radio.Group>
                    </Form.Item>

                    {accountabilityType === 'single' && (
                      <Form.Item
                        name="accountability"
                        rules={[{ required: true, message: '귀책 대상을 선택해주세요.' }]}
                      >
                        <Radio.Group>
                          <Space direction="vertical">
                            <Radio value="buyer">바이어 귀책</Radio>
                            <Radio value="seller">셀러 귀책</Radio>
                          </Space>
                        </Radio.Group>
                      </Form.Item>
                    )}

                    {accountabilityType === 'shared' && (
                      <div style={{ marginTop: 16 }}>
                        <div style={{ marginBottom: 12, fontWeight: 500 }}>공동 귀책 배분 (합계: {formatCurrency(finalLoss)})</div>
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item
                              name="buyerAccountabilityAmount"
                              label="바이어 귀책 금액"
                              rules={[
                                { required: true, message: '필수' },
                                {
                                  validator: (_, value) => {
                                    const buyerAmount = value || 0;
                                    const sellerAmount = form.getFieldValue('sellerAccountabilityAmount') || 0;
                                    if (buyerAmount + sellerAmount !== finalLoss) {
                                      return Promise.reject('바이어 + 셀러 귀책 금액의 합계가 최종 손실과 일치해야 합니다.');
                                    }
                                    return Promise.resolve();
                                  }
                                }
                              ]}
                            >
                              <InputNumber
                                style={{ width: '100%' }}
                                addonAfter="원"
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/[^\d-]/g, '')}
                                onChange={(value) => {
                                  setSharedAccountability(prev => ({ ...prev, buyer: value || 0 }));
                                  form.validateFields(['sellerAccountabilityAmount']);
                                }}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              name="sellerAccountabilityAmount"
                              label="셀러 귀책 금액"
                              rules={[
                                { required: true, message: '필수' },
                                {
                                  validator: (_, value) => {
                                    const sellerAmount = value || 0;
                                    const buyerAmount = form.getFieldValue('buyerAccountabilityAmount') || 0;
                                    if (buyerAmount + sellerAmount !== finalLoss) {
                                      return Promise.reject('바이어 + 셀러 귀책 금액의 합계가 최종 손실과 일치해야 합니다.');
                                    }
                                    return Promise.resolve();
                                  }
                                }
                              ]}
                            >
                              <InputNumber
                                style={{ width: '100%' }}
                                addonAfter="원"
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/[^\d-]/g, '')}
                                onChange={(value) => {
                                  setSharedAccountability(prev => ({ ...prev, seller: value || 0 }));
                                  form.validateFields(['buyerAccountabilityAmount']);
                                }}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                        <div style={{ color: '#8c8c8c', fontSize: 12 }}>
                          합계: {formatCurrency(sharedAccountability.buyer + sharedAccountability.seller)}
                          {(sharedAccountability.buyer + sharedAccountability.seller) === finalLoss && (
                            <span style={{ color: '#52c41a', marginLeft: 8 }}>✓ 정합성 확인됨</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                }
                style={{ marginBottom: 16 }}
              />
            )}

            {/* 하단 버튼 */}
            <Space>
              <Button size="large" onClick={handlePrevStep}>
                ← 이전
              </Button>
              <Button type="primary" size="large" onClick={handleSubmit}>
                수정 완료
              </Button>
            </Space>
          </>
        )}
      </Form>
    </div>
  );
}

export default ClaimAdjustmentEdit;
