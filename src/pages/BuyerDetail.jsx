import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Form, Input, Select, message, Modal, Image } from 'antd';
import { ArrowLeftOutlined, EditOutlined, SaveOutlined, CloseOutlined, PlusOutlined, MinusCircleOutlined, FileImageOutlined } from '@ant-design/icons';
import { buyerGroups, buyerDetails, managers, territories, regions, productCategories, products, buyerSalesDetails, salesHistoryMemos } from '../data/mockData';

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
      <div className="min-h-screen bg-[#f9fafb] p-6">
        <button
          onClick={() => navigate('/buyer')}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ArrowLeftOutlined />
          목록으로 돌아가기
        </button>
        <div className="mt-8 text-lg text-gray-600">바이어 그룹을 찾을 수 없습니다.</div>
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
      status: business.status
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
    <div className="min-h-screen bg-[#f9fafb] p-4 md:p-6">
      {/* 헤더 */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/buyer')}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeftOutlined />
            목록으로
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{buyerGroup.name}</h1>
        </div>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          buyerGroup.status === 'active'
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-gray-50 text-gray-700 border border-gray-200'
        }`}>
          {buyerGroup.status === 'active' ? '활성' : '비활성'}
        </span>
      </div>

      {/* 섹션 1: 바이어그룹 기본 정보 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">바이어그룹 기본 정보</h2>
          {!editMode ? (
            <button
              onClick={handleEditGroup}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              <EditOutlined />
              수정
            </button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleCancelEdit} icon={<CloseOutlined />}>
                취소
              </Button>
              <Button type="primary" onClick={handleSaveGroup} icon={<SaveOutlined />}>
                저장
              </Button>
            </div>
          )}
        </div>

        {!editMode ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-sm text-gray-500 mb-1">바이어그룹명</div>
                <div className="text-base font-semibold text-gray-900">{buyerGroup.name}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">담당영업사원</div>
                <div className="text-base font-semibold text-gray-900">{buyerGroup.salesPerson}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">주요품목분류</div>
                <div className="text-base font-semibold text-gray-900">{buyerGroup.mainCategory}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">사업권역</div>
                <div className="text-base font-semibold text-gray-900">{buyerGroup.territory}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">상세지역</div>
                <div className="text-base font-semibold text-gray-900">{buyerGroup.region}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">사업자 수</div>
                <div className="text-base font-semibold text-gray-900">{buyerGroup.businessCount}개</div>
              </div>
            </div>

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

            {/* 거래 정보 */}
            <div className="mt-8">
              <h3 className="text-base font-semibold text-gray-900 mb-4">거래 정보</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-gray-500 mb-1">카톡단톡방이름</div>
                  <div className="text-base font-semibold text-gray-900">{detail.kakaoGroupName}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">결제주기</div>
                  <div className="text-base font-semibold text-gray-900">{detail.paymentCycle}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">컴플레인강도</div>
                  <div className="text-base font-semibold text-gray-900">{detail.complaintIntensity}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">도착단가 정책</div>
                  <div className="text-base font-semibold text-gray-900">{detail.arrivalPricePolicy}</div>
                </div>
                <div className="md:col-span-2">
                  <div className="text-sm text-gray-500 mb-1">메인공급처</div>
                  <div className="text-base font-semibold text-gray-900">{detail.mainSuppliers}</div>
                </div>
              </div>
            </div>

            {/* 중요 평가 요소 */}
            <div className="mt-8">
              <h3 className="text-base font-semibold text-gray-900 mb-4">중요 평가 요소 (우선순위)</h3>
              <div className="flex flex-wrap gap-2">
                {detail.priorityFactors.map((factor, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200"
                  >
                    <span>{priorityEmojis[factor]}</span>
                    <span>{index + 1}순위: {factor}</span>
                  </span>
                ))}
              </div>
            </div>
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
                {territories.filter(t => t.status === 'active').map(t => (
                  <Select.Option key={t.id} value={t.name}>{t.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="region" label="상세지역" rules={[{ required: true }]}>
              <Select>
                {regions.filter(r => r.status === 'active').map(r => (
                  <Select.Option key={r.id} value={r.name}>{r.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.List name="keymen">
              {(fields, { add, remove }) => (
                <>
                  <h3 className="text-base font-semibold text-gray-900 mb-4">키맨 정보</h3>
                  {fields.map((field) => (
                    <div key={field.key} className="bg-gray-50 rounded-lg border border-gray-200 p-4 mb-3">
                      <div className="grid grid-cols-3 gap-4">
                        <Form.Item
                          {...field}
                          name={[field.name, 'name']}
                          label="이름"
                          rules={[{ required: true }]}
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item
                          {...field}
                          name={[field.name, 'position']}
                          label="직책"
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item
                          {...field}
                          name={[field.name, 'phone']}
                          label="연락처"
                        >
                          <Input />
                        </Form.Item>
                      </div>
                      {fields.length > 1 && (
                        <Button onClick={() => remove(field.name)} icon={<MinusCircleOutlined />}>
                          삭제
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button onClick={() => add()} icon={<PlusOutlined />} block>
                    키맨 추가
                  </Button>
                </>
              )}
            </Form.List>

            <Form.Item name="kakaoGroupName" label="카톡단톡방이름" className="mt-4">
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
            <div className="mt-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">중요 평가 요소 (우선순위)</h3>
              <Form.List name="priorityFactors">
                {(fields, { add, remove, move }) => (
                  <>
                    <div className="space-y-2">
                      {fields.map((field, index) => (
                        <div key={field.key} className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700 w-16">{index + 1}순위</span>
                          <Form.Item
                            {...field}
                            className="flex-1 mb-0"
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
                          <div className="flex gap-1">
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
                          </div>
                        </div>
                      ))}
                    </div>
                    {fields.length < priorityOptions.length && (
                      <Button
                        onClick={() => add()}
                        icon={<PlusOutlined />}
                        block
                        type="dashed"
                        className="mt-3"
                      >
                        평가 요소 추가
                      </Button>
                    )}
                  </>
                )}
              </Form.List>
            </div>

            <Form.Item name="status" label="상태" rules={[{ required: true }]} className="mt-4">
              <Select>
                <Select.Option value="active">활성</Select.Option>
                <Select.Option value="inactive">비활성</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        )}
      </div>

      {/* 섹션 2: 소속 사업자 정보 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">소속 사업자 정보</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {detail.businesses.map((business) => (
            <div key={business.id} className={`rounded-lg border overflow-hidden ${
              business.status === 'inactive' ? 'bg-gray-50 border-gray-300' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="bg-white px-4 py-3 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-gray-900">{business.buyerName}</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    business.status === 'active'
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {business.status === 'active' ? '활성' : '비활성'}
                  </span>
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
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-500 border border-gray-300">
                      사업자등록증 미첨부
                    </span>
                  )}
                </div>
                {editingBusinessId !== business.id ? (
                  <button
                    onClick={() => handleEditBusiness(business)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <EditOutlined />
                    수정
                  </button>
                ) : (
                  <div className="flex gap-2">
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
                  </div>
                )}
              </div>

              <div className="p-4">
                {editingBusinessId !== business.id ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">사업자등록번호</div>
                      <div className="text-base font-medium text-gray-900">{business.businessNumber}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">ticker</div>
                      <div className="text-base font-medium text-gray-900">{business.buyerId}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">사업자등록상호</div>
                      <div className="text-base font-medium text-gray-900">{business.businessName}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">대표자</div>
                      <div className="text-base font-medium text-gray-900">{business.representative}</div>
                    </div>
                    <div className="md:col-span-2">
                      <div className="text-sm text-gray-500 mb-1">사업장등록주소</div>
                      <div className="text-base font-medium text-gray-900">{business.businessAddress}</div>
                    </div>
                    <div className="md:col-span-2">
                      <div className="text-sm text-gray-500 mb-1">하차지 주소</div>
                      <div className="text-base font-medium text-gray-900">{business.unloadingAddress}</div>
                    </div>
                    <div className="md:col-span-2">
                      <div className="text-sm text-gray-500 mb-1">세금계산서 발행 이메일</div>
                      <div className="text-base font-medium text-gray-900">{business.taxInvoiceEmail}</div>
                    </div>
                  </div>
                ) : (
                  <Form form={businessForm} layout="vertical">
                    <Form.Item name="businessNumber" label="사업자등록번호" rules={[{ required: true }]}>
                      <Input />
                    </Form.Item>
                    <Form.Item name="buyerId" label="ticker" rules={[{ required: true }]}>
                      <Input />
                    </Form.Item>
                    <Form.Item name="businessName" label="사업자등록상호" rules={[{ required: true }]}>
                      <Input />
                    </Form.Item>
                    <Form.Item name="representative" label="대표자" rules={[{ required: true }]}>
                      <Input />
                    </Form.Item>
                    <Form.Item name="businessAddress" label="사업장등록주소">
                      <Input />
                    </Form.Item>
                    <Form.Item name="buyerName" label="바이어명" rules={[{ required: true }]}>
                      <Input />
                    </Form.Item>
                    <Form.Item name="unloadingAddress" label="하차지 주소">
                      <Input />
                    </Form.Item>
                    <Form.Item name="taxInvoiceEmail" label="세금계산서 발행 이메일" rules={[{ required: true }]}>
                      <Input />
                    </Form.Item>
                    <Form.Item name="status" label="상태" rules={[{ required: true }]}>
                      <Select>
                        <Select.Option value="active">활성</Select.Option>
                        <Select.Option value="inactive">비활성</Select.Option>
                      </Select>
                    </Form.Item>
                  </Form>
                )}
              </div>
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

      {/* 섹션 3: 거래 실적 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">거래 실적</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-100">
            <div className="text-xs text-blue-600 mb-2">매출액 (누적)</div>
            <div className="text-2xl font-bold text-blue-700">
              {(buyerGroup.totalSales / 100000000).toFixed(1)}억
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center border border-green-100">
            <div className="text-xs text-green-600 mb-2">매출액 (최근 3개월)</div>
            <div className="text-2xl font-bold text-green-700">
              {(buyerGroup.sales3M / 100000000).toFixed(1)}억
            </div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 text-center border border-yellow-100">
            <div className="text-xs text-yellow-600 mb-2">매출액 (최근 1개월)</div>
            <div className="text-2xl font-bold text-yellow-700">
              {(buyerGroup.sales1M / 100000000).toFixed(1)}억
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
            <div className="text-xs text-gray-600 mb-2">최근거래일</div>
            <div className="text-2xl font-bold text-gray-900">
              {buyerGroup.lastTradeDate}
            </div>
          </div>
        </div>

      </div>

      {/* P2 섹션: 등급 정보 & 판매 세부내역 */}
      {salesDetail && (
        <>
          {/* 기간 필터 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-wrap gap-2">
              {['최근 1개월', '최근 3개월', '최근 6개월', '이번달', '이번분기', '올해', '누적'].map(period => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedPeriod === period
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          {/* 통합 지표 & 등급 카드 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* 통합 지표 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">통합 지표 ({selectedPeriod})</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">매출액</span>
                  <span className="text-lg font-bold text-gray-900">
                    {(salesDetail.metrics.totalSales / 100000000).toFixed(1)}억원
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">조정손익액</span>
                  <span className="text-lg font-bold text-green-700">
                    {(salesDetail.metrics.totalProfit / 10000000).toFixed(1)}백만원
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">조정손익률</span>
                  <span className="text-lg font-bold text-green-700">
                    {salesDetail.metrics.profitRate.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">기말미수금</span>
                  <span className="text-lg font-bold text-orange-600">
                    {(salesDetail.metrics.receivable / 10000000).toFixed(1)}백만원
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">자본회전율</span>
                  <span className="text-lg font-bold text-blue-700">
                    {salesDetail.metrics.turnoverRate.toFixed(1)}회
                  </span>
                </div>
              </div>
            </div>

            {/* 등급 정보 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">바이어 등급</h3>
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="text-sm text-blue-600 mb-1">매출액 순위</div>
                  <div className="text-3xl font-bold text-blue-700">
                    상위 {salesDetail.grade.salesRank}%
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="text-sm text-green-600 mb-1">거래손익 순위</div>
                  <div className="text-3xl font-bold text-green-700">
                    상위 {salesDetail.grade.profitRank}%
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <div className="text-sm text-purple-600 mb-1">자본회전율 등급</div>
                  <div className="text-3xl font-bold text-purple-700">
                    {salesDetail.grade.turnoverGrade}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 판매 세부내역 테이블 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">판매 세부내역</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">기간</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">매출액</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">조정손익액</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">매출총중량</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">판매규격별 중량</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">판매 셀러</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">판매 품목</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {salesDetail.periods.map((p, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{p.period}</td>
                      <td className="px-4 py-3 text-right text-gray-900">
                        {(p.sales / 10000000).toFixed(1)}백만
                      </td>
                      <td className="px-4 py-3 text-right text-green-700 font-medium">
                        {(p.profit / 10000000).toFixed(1)}백만
                      </td>
                      <td className="px-4 py-3 text-right text-gray-900">{p.weight}톤</td>
                      <td className="px-4 py-3 text-gray-700 text-xs">{p.specs}</td>
                      <td className="px-4 py-3 text-gray-700 text-xs">{p.sellers}</td>
                      <td className="px-4 py-3 text-gray-700 text-xs">{p.products}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 매출액 차트 (세로 막대 시각화) */}
            <div className="mt-8">
              <h3 className="text-base font-semibold text-gray-900 mb-4">매출액 추이</h3>
              <div className="relative">
                {/* Y축 라벨 */}
                <div className="absolute -left-8 top-0 bottom-16 flex items-center">
                  <span className="text-xs text-gray-500 transform -rotate-90 whitespace-nowrap">
                    매출액 (백만원)
                  </span>
                </div>

                {/* 차트 영역 */}
                <div className="pl-4">
                  <div className="flex items-end justify-between gap-2 h-64 border-l-2 border-b-2 border-gray-300 pl-2 pb-2 relative">
                    {salesDetail.periods.map((p, idx) => {
                      const maxSales = Math.max(...salesDetail.periods.map(period => period.sales));
                      const heightPercent = (p.sales / maxSales) * 100;
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full">
                          <div className="w-full flex flex-col items-center justify-end h-full">
                            <div className="text-xs text-gray-700 font-medium mb-1">
                              {(p.sales / 10000000).toFixed(1)}
                            </div>
                            <div
                              className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg hover:from-blue-700 hover:to-blue-500 transition-all cursor-pointer shadow-sm"
                              style={{ height: `${heightPercent}%`, minHeight: '4px' }}
                              title={`${p.period}: ${(p.sales / 10000000).toFixed(1)}백만원`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* X축 라벨 */}
                  <div className="flex justify-between gap-2 mt-2 pl-2">
                    {salesDetail.periods.map((p, idx) => (
                      <div key={idx} className="flex-1 text-center">
                        <span className="text-xs text-gray-600 inline-block transform -rotate-45 origin-center whitespace-nowrap">
                          {p.period}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* X축 라벨 제목 */}
                  <div className="text-center text-xs text-gray-500 mt-8">기간</div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* P2 섹션: 세일즈 히스토리 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">세일즈 히스토리</h2>
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
        </div>

        {/* 메모 추가 폼 */}
        {isAddingMemo && (
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 mb-4">
            <Input.TextArea
              rows={4}
              placeholder="영업 활동 내역을 입력하세요..."
              value={memoContent}
              onChange={(e) => setMemoContent(e.target.value)}
              className="mb-3"
            />
            <div className="flex gap-2">
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
            </div>
          </div>
        )}

        {/* 메모 타임라인 */}
        <div className="space-y-4">
          {memos.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              등록된 메모가 없습니다.
            </div>
          ) : (
            memos.map((memo) => (
              <div key={memo.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                      {memo.date}
                    </span>
                    <span className="text-sm font-medium text-gray-700">{memo.author}</span>
                  </div>
                  {memo.author === '최용환' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingMemoId(memo.id);
                          setMemoContent(memo.content);
                        }}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => {
                          Modal.confirm({
                            title: '메모 삭제',
                            content: '이 메모를 삭제하시겠습니까?',
                            onOk: () => {
                              message.success('메모가 삭제되었습니다.');
                            }
                          });
                        }}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        삭제
                      </button>
                    </div>
                  )}
                </div>

                {editingMemoId === memo.id ? (
                  <div>
                    <Input.TextArea
                      rows={4}
                      value={memoContent}
                      onChange={(e) => setMemoContent(e.target.value)}
                      className="mb-3"
                    />
                    <div className="flex gap-2">
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
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-700 leading-relaxed">{memo.content}</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default BuyerDetail;