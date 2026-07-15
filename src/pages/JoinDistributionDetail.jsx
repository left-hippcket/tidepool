import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Form, Input, Select, InputNumber, message, Modal } from 'antd';
import { ArrowLeftOutlined, EditOutlined, SaveOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { joinGroups, joinDetails, managers, territories } from '../data/mockData';

function JoinDistributionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [editingBusinessId, setEditingBusinessId] = useState(null);
  const [form] = Form.useForm();
  const [businessForm] = Form.useForm();

  const joinGroup = joinGroups.find(j => j.id === parseInt(id));
  const detail = joinDetails[id];

  if (!joinGroup || !detail) {
    return (
      <div className="min-h-screen bg-[#f9fafb] p-4 md:p-6">
        <button
          onClick={() => navigate('/join-distribution')}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ArrowLeftOutlined />
          목록으로 돌아가기
        </button>
        <div className="mt-8 text-lg text-gray-600">조인유통 그룹을 찾을 수 없습니다.</div>
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
      status: business.status
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
    <div className="min-h-screen bg-[#f9fafb] p-4 md:p-6">
      {/* 헤더 */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/join-distribution')}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeftOutlined />
            목록으로
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{joinGroup.name}</h1>
        </div>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          joinGroup.status === 'active'
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-gray-50 text-gray-700 border border-gray-200'
        }`}>
          {joinGroup.status === 'active' ? '활성' : '비활성'}
        </span>
      </div>

      {/* 섹션 1: 조인유통그룹 기본 정보 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">조인유통그룹 기본 정보</h2>
          {editMode ? (
            <div className="flex gap-2">
              <Button icon={<SaveOutlined />} type="primary" onClick={handleSaveGroup} size="small">
                저장
              </Button>
              <Button icon={<CloseOutlined />} onClick={handleCancelEdit} size="small">
                취소
              </Button>
            </div>
          ) : (
            <button
              onClick={handleEditGroup}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              <EditOutlined />
              수정
            </button>
          )}
        </div>

        {editMode ? (
          <Form form={form} layout="vertical">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item label="조인유통그룹명" name="name" rules={[{ required: true }]}>
                <Input maxLength={30} />
              </Form.Item>
              <Form.Item label="담당영업사원" name="salesPerson" rules={[{ required: true }]}>
                <Select>
                  {managers.map(m => (
                    <Select.Option key={m} value={m}>{m}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="사업권역" name="territory" rules={[{ required: true }]}>
                <Select>
                  {territories.filter(t => t.status === 'active').map(t => (
                    <Select.Option key={t.id} value={t.name}>{t.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="상세지역" name="region" rules={[{ required: true }]}>
                <Select>
                  <Select.Option value="서울">서울</Select.Option>
                  <Select.Option value="경기">경기</Select.Option>
                  <Select.Option value="인천">인천</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="카톡단톡방이름" name="kakaoGroupName">
                <Input maxLength={50} />
              </Form.Item>
              <Form.Item label="결제주기(조건)" name="paymentCycle">
                <Input.TextArea rows={2} maxLength={200} />
              </Form.Item>
              <Form.Item label="도착단가 정책 (상차단가+)" name="arrivalPricePolicy">
                <InputNumber style={{ width: '100%' }} min={0} addonAfter="원" />
              </Form.Item>
              <Form.Item label="상차 수수료율(%)" name="commissionRate" rules={[{ required: true }]}>
                <InputNumber style={{ width: '100%' }} min={0} max={100} step={0.1} />
              </Form.Item>
              <Form.Item label="메인공급처" name="mainSuppliers">
                <Input placeholder="쉼표로 구분" maxLength={100} />
              </Form.Item>
              <Form.Item label="메인 양식장" name="mainFarms">
                <Input placeholder="쉼표로 구분" maxLength={100} />
              </Form.Item>
              <Form.Item label="정성적 평가 - 재무상황" name="financial">
                <Select placeholder="선택">
                  <Select.Option value="좋음">좋음</Select.Option>
                  <Select.Option value="보통">보통</Select.Option>
                  <Select.Option value="나쁨">나쁨</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="상태" name="status" rules={[{ required: true }]}>
                <Select onChange={handleStatusChange}>
                  <Select.Option value="active">활성</Select.Option>
                  <Select.Option value="inactive">비활성</Select.Option>
                </Select>
              </Form.Item>
            </div>
          </Form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-gray-500 mb-1">조인유통그룹명</div>
              <div className="text-base font-semibold text-gray-900">{joinGroup.name}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">담당영업사원</div>
              <div className="text-base font-semibold text-gray-900">{joinGroup.salesPerson}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">사업권역</div>
              <div className="text-base font-semibold text-gray-900">{joinGroup.territory}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">상세지역</div>
              <div className="text-base font-semibold text-gray-900">{joinGroup.region}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">카톡단톡방이름</div>
              <div className="text-base font-semibold text-gray-900">{detail.kakaoGroupName || '-'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">결제주기</div>
              <div className="text-base font-semibold text-gray-900">{detail.paymentCycle || '-'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">도착단가 정책</div>
              <div className="text-base font-semibold text-gray-900">상차단가 + {detail.arrivalPricePolicy}원</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">상차 수수료율</div>
              <div className="text-base font-semibold text-gray-900">{detail.commissionRate}%</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">메인공급처</div>
              <div className="text-base font-semibold text-gray-900">{detail.mainSuppliers || '-'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">메인 양식장</div>
              <div className="text-base font-semibold text-gray-900">{detail.mainFarms || '-'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">재무상황</div>
              <div className="text-base font-semibold text-gray-900">{detail.financial || '-'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">사업자 수</div>
              <div className="text-base font-semibold text-gray-900">{joinGroup.businessCount}개</div>
            </div>
          </div>
        )}

        {/* 키맨 정보 */}
        <div className="mt-8">
          <h3 className="text-base font-semibold text-gray-900 mb-4">키맨 정보</h3>
          <div className="space-y-3">
            {detail.keymen.map((keyman, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">이름</div>
                    <div className="text-sm font-medium text-gray-900">{keyman.name}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">직책</div>
                    <div className="text-sm font-medium text-gray-900">{keyman.position}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">연락처</div>
                    <div className="text-sm font-medium text-gray-900">{keyman.phone}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 섹션 2: 소속 사업자 정보 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">소속 사업자 정보</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {detail.businesses.map((business) => (
            <div
              key={business.id}
              className={`rounded-lg border-2 p-4 ${
                business.status === 'inactive'
                  ? 'bg-gray-100 border-gray-300'
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-lg font-semibold text-gray-900 mb-1">{business.joinName}</div>
                  <div className="text-sm text-gray-600">ticker: {business.ticker}</div>
                </div>
                <div className="flex gap-2">
                  {business.status === 'inactive' && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-700">
                      비활성
                    </span>
                  )}
                  {editingBusinessId === business.id ? (
                    <>
                      <Button
                        icon={<SaveOutlined />}
                        type="primary"
                        onClick={() => handleSaveBusiness(business)}
                        size="small"
                      >
                        저장
                      </Button>
                      <Button
                        icon={<CloseOutlined />}
                        onClick={handleCancelBusinessEdit}
                        size="small"
                      >
                        취소
                      </Button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleEditBusiness(business)}
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-700"
                    >
                      <EditOutlined />
                      수정
                    </button>
                  )}
                </div>
              </div>

              {editingBusinessId === business.id ? (
                <Form form={businessForm} layout="vertical" className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Form.Item label="사업자등록번호" name="businessNumber" style={{ marginBottom: 0 }}>
                      <Input disabled />
                    </Form.Item>
                    <Form.Item label="ticker" name="ticker" style={{ marginBottom: 0 }}>
                      <Input disabled />
                    </Form.Item>
                    <Form.Item label="사업자등록상호" name="businessName" style={{ marginBottom: 0 }}>
                      <Input maxLength={50} />
                    </Form.Item>
                    <Form.Item label="대표자" name="representative" style={{ marginBottom: 0 }}>
                      <Input maxLength={10} />
                    </Form.Item>
                    <Form.Item label="사업자등록주소" name="businessAddress" className="md:col-span-2" style={{ marginBottom: 0 }}>
                      <Input maxLength={100} />
                    </Form.Item>
                    <Form.Item label="조인유통명" name="joinName" style={{ marginBottom: 0 }}>
                      <Input maxLength={20} />
                    </Form.Item>
                    <Form.Item label="세금계산서 이메일" name="taxInvoiceEmail" style={{ marginBottom: 0 }}>
                      <Input type="email" />
                    </Form.Item>
                    <Form.Item label="상태" name="status" style={{ marginBottom: 0 }}>
                      <Select>
                        <Select.Option value="active">활성</Select.Option>
                        <Select.Option value="inactive">비활성</Select.Option>
                      </Select>
                    </Form.Item>
                  </div>
                </Form>
              ) : (
                <div className="space-y-2 text-sm">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <div>
                      <span className="text-gray-500">사업자등록번호:</span>
                      <span className="ml-2 text-gray-900 font-medium">{business.businessNumber}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">사업자등록상호:</span>
                      <span className="ml-2 text-gray-900 font-medium">{business.businessName}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">대표자:</span>
                      <span className="ml-2 text-gray-900 font-medium">{business.representative}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500">사업자등록주소:</span>
                      <span className="ml-2 text-gray-900 font-medium">{business.businessAddress}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500">세금계산서 이메일:</span>
                      <span className="ml-2 text-gray-900 font-medium">{business.taxInvoiceEmail}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">은행계좌:</span>
                      <div className="mt-1 space-y-1">
                        {business.bankAccounts.map((account, idx) => (
                          <div key={idx} className="text-gray-900 font-medium">
                            {account.bank} {account.accountNumber} ({account.holder})
                            {idx === 0 && <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">주사용</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* 사업자 추가 카드 */}
          <button
            onClick={handleAddBusiness}
            className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400 transition-all min-h-[200px] flex flex-col items-center justify-center gap-3 text-gray-500 hover:text-gray-700"
          >
            <div className="w-16 h-16 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center">
              <PlusOutlined className="text-2xl" />
            </div>
            <span className="text-base font-medium">사업자 추가</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default JoinDistributionDetail;
