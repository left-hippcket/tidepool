import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Select, Modal, Upload, Image } from 'antd';
import { ArrowLeftOutlined, FileImageOutlined } from '@ant-design/icons';
import { Plus, Edit2, Upload as UploadIcon } from 'lucide-react';
import { joinGroups, joinDetails, managers, territories, regions } from '../data/mockData';
import { FMButton } from '../components/ui/FMButton';
import { FMTagInput } from '../components/ui/FMTagInput';
import { FMSwitch } from '../components/ui/FMSwitch';
import toast from 'react-hot-toast';

function JoinDistributionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [form] = Form.useForm();

  const joinGroup = joinGroups.find(j => j.id === parseInt(id));
  const detail = joinDetails[id];

  // 사업자 추가
  const handleAddBusiness = () => {
    navigate(`/join-distribution/register?groupId=${id}&mode=add`);
  };

  // 편집 모드 진입
  const handleEditMode = () => {
    form.setFieldsValue({
      name: joinGroup.name,
      salesPerson: joinGroup.salesPerson,
      salesPersons: joinGroup.salesPersons || [joinGroup.salesPerson],
      territory: joinGroup.territory,
      region: joinGroup.region,
      status: joinGroup.status,
      kakaoGroupName: detail.kakaoGroupName,
      paymentCycle: detail.paymentCycle,
      arrivalPricePolicy: detail.arrivalPricePolicy,
      commissionRate: detail.commissionRate,
      mainSuppliers: detail.mainSuppliers?.split(', ') || [],
      mainFarms: detail.mainFarms?.split(', ') || [],
      financial: detail.financial
    });
    setEditMode(true);
  };

  // 저장
  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      if (values.status === 'inactive' && joinGroup.status === 'active') {
        const activeBusinessCount = detail.businesses.filter(b => b.status === 'active').length;
        if (activeBusinessCount > 0) {
          Modal.error({
            title: '비활성화 불가',
            content: `소속된 사업자가 ${activeBusinessCount}개 활성 상태로 남아있어 그룹을 비활성화할 수 없습니다.`,
          });
          form.setFieldsValue({ status: 'active' });
          return;
        }
      }

      toast.success('조인유통 그룹 정보가 수정되었습니다.');
      setEditMode(false);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  // 취소
  const handleCancel = () => {
    setEditMode(false);
    form.resetFields();
  };

  // 재무상황 이모지
  const financialEmojis = {
    '우수': '💯',
    '양호': '👍',
    '보통': '😐',
    '주의': '⚠️'
  };

  const addFinancialEmoji = (value) => {
    const emoji = financialEmojis[value];
    return emoji ? `${emoji} ${value}` : value;
  };

  if (!joinGroup || !detail) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="flex flex-col gap-6 w-full">
          <div className="flex flex-col gap-4">
            <div className="flex justify-start">
              <FMButton
                variant="indigo"
                icon={<ArrowLeftOutlined className="h-4 w-4" />}
                href="/join-distribution"
              >
                목록으로
              </FMButton>
            </div>
            <div className="text-lg text-gray-600">조인유통 그룹을 찾을 수 없습니다.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex flex-col gap-6 w-full">
        {/* 헤더 */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            {editMode ? (
              <FMButton
                variant="indigo"
                icon={<ArrowLeftOutlined className="h-4 w-4" />}
                onClick={handleCancel}
              >
                상세페이지
              </FMButton>
            ) : (
              <FMButton
                variant="indigo"
                icon={<ArrowLeftOutlined className="h-4 w-4" />}
                href="/join-distribution"
              >
                목록으로
              </FMButton>
            )}
            {!editMode && (
              <button
                onClick={handleEditMode}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
              >
                <Edit2 className="h-4 w-4" />
                수정 모드
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900">{joinGroup.name}</h2>
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
              joinGroup.status === 'active'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-700'
            }`}>
              {joinGroup.status === 'active' ? '활성' : '비활성'}
            </span>
          </div>
        </div>

      <Form
        form={form}
        layout="horizontal"
        labelCol={{ flex: '20%' }}
        wrapperCol={{ flex: '80%' }}
        labelAlign="left"
      >
        {/* 조인유통 그룹 기본 정보 */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">조인유통 그룹 기본 정보</h3>
            <span className="text-xs text-gray-500">최근 수정일: 2026-07-20</span>
          </div>

          {editMode ? (
            <>
              <Form.Item
                name="name"
                label="조인유통 그룹명"
              >
                <Input
                  disabled
                  suffix={
                    <span className="text-xs text-gray-400">💡 자동생성 (사업자명 기반)</span>
                  }
                />
              </Form.Item>

              <Form.Item
                name="salesPersons"
                label="담당영업사원"
                rules={[{ required: true, message: '담당영업사원을 선택해주세요' }]}
              >
                <FMSelect
                  value={form.getFieldValue('salesPersons') || []}
                  onChange={(value) => {
                    form.setFieldsValue({ salesPersons: value });
                    // 첫 번째 담당자를 salesPerson에 자동 설정
                    if (value && value.length > 0) {
                      form.setFieldsValue({ salesPerson: value[0] });
                    }
                  }}
                  options={managers.map(m => ({
                    value: m,
                    label: m
                  }))}
                  placeholder="담당자 선택 (복수 가능)"
                  isSearchable={true}
                  isMulti={true}
                />
              </Form.Item>

              <Form.Item
                name="territory"
                label="사업권역"
                rules={[{ required: true, message: '사업권역을 선택해주세요' }]}
              >
                <Select>
                  {territories
                    .filter(t => t.status === 'active')
                    .sort((a, b) => a.displayOrder - b.displayOrder)
                    .map(t => (
                      <Select.Option key={t.id} value={t.name}>{t.name}</Select.Option>
                    ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="region"
                label="상세지역"
              >
                <Input placeholder="예: 노량진, 가락시장" />
              </Form.Item>

              <Form.Item
                label="상태"
              >
                <FMSwitch
                  checked={form.getFieldValue('status') === 'active'}
                  onChange={(checked) => {
                    form.setFieldsValue({ status: checked ? 'active' : 'inactive' });
                  }}
                  onLabel="활성"
                  offLabel="비활성"
                />
              </Form.Item>
            </>
          ) : (
            <div className="space-y-3">
              <div className="flex">
                <span className="w-1/5 font-medium text-gray-700">조인유통 그룹명:</span>
                <span className="w-4/5 text-gray-900">{joinGroup.name}</span>
              </div>
              <div className="flex">
                <span className="w-1/5 font-medium text-gray-700">담당영업사원:</span>
                <span className="w-4/5 text-gray-900">
                  {joinGroup.salesPersons?.length > 0
                    ? joinGroup.salesPersons.join(', ')
                    : joinGroup.salesPerson}
                </span>
              </div>
              <div className="flex">
                <span className="w-1/5 font-medium text-gray-700">사업권역:</span>
                <span className="w-4/5 text-gray-900">{joinGroup.territory}</span>
              </div>
              <div className="flex">
                <span className="w-1/5 font-medium text-gray-700">상세지역:</span>
                <span className="w-4/5 text-gray-900">{joinGroup.region || '-'}</span>
              </div>
            </div>
          )}
        </div>

        {/* 거래 정보 */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">거래 정보</h3>
            <span className="text-xs text-gray-500">최근 수정일: 2026-07-15</span>
          </div>

          {editMode ? (
            <>
              <Form.Item name="kakaoGroupName" label="카카오톡 단톡방">
                <Input placeholder="[노량진]조인유통 거래방" />
              </Form.Item>

              <Form.Item name="paymentCycle" label="결제주기">
                <Input placeholder="예: 월 2회 정산" />
              </Form.Item>

              <Form.Item name="arrivalPricePolicy" label="도착단가 정책">
                <Input placeholder="예: 상차단가 + 800원" />
              </Form.Item>

              <Form.Item name="commissionRate" label="상차 수수료율(%)">
                <Input placeholder="예: 3.0" />
              </Form.Item>

              <Form.Item name="mainSuppliers" label="메인유통사">
                <FMTagInput
                  value={form.getFieldValue('mainSuppliers') || []}
                  onChange={(value) => form.setFieldsValue({ mainSuppliers: value })}
                  placeholder="공급처명 입력 후 엔터키"
                />
              </Form.Item>

              <Form.Item name="mainFarms" label="메인소싱처">
                <FMTagInput
                  value={form.getFieldValue('mainFarms') || []}
                  onChange={(value) => form.setFieldsValue({ mainFarms: value })}
                  placeholder="양식장명 입력 후 엔터키"
                />
              </Form.Item>

              <Form.Item name="financial" label="재무상황">
                <Select>
                  <Select.Option value="우수">우수</Select.Option>
                  <Select.Option value="양호">양호</Select.Option>
                  <Select.Option value="보통">보통</Select.Option>
                  <Select.Option value="주의">주의</Select.Option>
                </Select>
              </Form.Item>
            </>
          ) : (
            <div className="space-y-3">
              <div className="flex">
                <span className="w-1/5 font-medium text-gray-700">카카오톡 단톡방:</span>
                <span className="w-4/5 text-gray-900">{detail.kakaoGroupName || '-'}</span>
              </div>
              <div className="flex">
                <span className="w-1/5 font-medium text-gray-700">결제주기:</span>
                <span className="w-4/5 text-gray-900">{detail.paymentCycle || '-'}</span>
              </div>
              <div className="flex">
                <span className="w-1/5 font-medium text-gray-700">도착단가 정책:</span>
                <span className="w-4/5 text-gray-900">{detail.arrivalPricePolicy || '-'}</span>
              </div>
              <div className="flex">
                <span className="w-1/5 font-medium text-gray-700">상차 수수료율:</span>
                <span className="w-4/5 text-gray-900">{detail.commissionRate ? `${detail.commissionRate}%` : '-'}</span>
              </div>
              <div className="flex">
                <span className="w-1/5 font-medium text-gray-700">메인유통사:</span>
                <span className="w-4/5 text-gray-900">{detail.mainSuppliers || '-'}</span>
              </div>
              <div className="flex">
                <span className="w-1/5 font-medium text-gray-700">메인소싱처:</span>
                <span className="w-4/5 text-gray-900">{detail.mainFarms || '-'}</span>
              </div>
              <div className="flex">
                <span className="w-1/5 font-medium text-gray-700">재무상황:</span>
                <span className="w-4/5 text-gray-900">
                  {addFinancialEmoji(detail.financial)}
                </span>
              </div>
            </div>
          )}
        </div>
      </Form>

      {/* 소속 사업자 목록 */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-gray-900">소속 사업자</h3>
            <span className="text-xs text-gray-500">최근 수정일: 2026-07-22</span>
          </div>
          {editMode && (
            <FMButton
              variant="green"
              icon={<Plus className="h-4 w-4" />}
              onClick={handleAddBusiness}
            >
              사업자 추가
            </FMButton>
          )}
        </div>

        <div className="space-y-4">
          {detail.businesses.map((business) => (
            <div key={business.id} className="rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <h4 className="text-base font-semibold text-gray-900">{business.joinName}</h4>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                    business.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {business.status === 'active' ? '활성' : '비활성'}
                  </span>
                </div>
              </div>

              {editMode ? (
                <div className="space-y-3">
                  <div className="flex">
                    <span className="w-1/4 font-medium text-gray-700">조인유통명:</span>
                    <Input defaultValue={business.joinName} className="w-3/4" />
                  </div>
                  <div className="flex">
                    <span className="w-1/4 font-medium text-gray-700">ticker:</span>
                    <Input defaultValue={business.ticker} className="w-3/4" disabled />
                  </div>
                  <div className="flex">
                    <span className="w-1/4 font-medium text-gray-700">사업자번호:</span>
                    <Input defaultValue={business.businessNumber} className="w-3/4" disabled />
                  </div>
                  <div className="flex">
                    <span className="w-1/4 font-medium text-gray-700">상호:</span>
                    <Input defaultValue={business.businessName} className="w-3/4" />
                  </div>
                  <div className="flex">
                    <span className="w-1/4 font-medium text-gray-700">대표자:</span>
                    <Input defaultValue={business.representative} className="w-3/4" />
                  </div>
                  <div className="flex">
                    <span className="w-1/4 font-medium text-gray-700">사업장주소:</span>
                    <Input defaultValue={business.businessAddress} className="w-3/4" />
                  </div>
                  <div className="flex">
                    <span className="w-1/4 font-medium text-gray-700">세금계산서 이메일:</span>
                    <Input defaultValue={business.taxInvoiceEmail} className="w-3/4" />
                  </div>
                  <div className="flex items-center">
                    <span className="w-1/4 font-medium text-gray-700">상태:</span>
                    <div className="w-3/4">
                      <FMSwitch
                        checked={business.status === 'active'}
                        onChange={(checked) => {}}
                        onLabel="활성"
                        offLabel="비활성"
                      />
                    </div>
                  </div>

                  {business.bankAccounts && business.bankAccounts.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="mb-4 pb-2 border-b border-gray-200">
                        <h5 className="font-medium text-gray-700">은행계좌 정보</h5>
                      </div>
                      {business.bankAccounts.map((account, idx) => (
                        <div key={idx} className="mb-6 last:mb-0">
                          {idx > 0 && <div className="my-6 border-t border-gray-200"></div>}
                          <div className="flex items-center gap-2 mb-4">
                            <h6 className="text-sm font-medium text-gray-700">계좌 #{idx + 1}</h6>
                          </div>

                          <div className="space-y-3">
                            <div className="flex">
                              <span className="w-1/4 font-medium text-gray-700">은행명:</span>
                              <Input placeholder="예: 국민은행" defaultValue={account.bank} className="w-3/4" />
                            </div>
                            <div className="flex">
                              <span className="w-1/4 font-medium text-gray-700">계좌번호:</span>
                              <Input placeholder="123456-78-901234" defaultValue={account.accountNumber} className="w-3/4" />
                            </div>
                            <div className="flex">
                              <span className="w-1/4 font-medium text-gray-700">예금주:</span>
                              <Input placeholder="홍길동" defaultValue={account.holder} className="w-3/4" />
                            </div>
                            <div className="flex">
                              <span className="w-1/4 font-medium text-gray-700">대표계좌:</span>
                              <div className="w-3/4">
                                <label className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    name={`primary_account_${business.id}`}
                                    defaultChecked={business.bankAccounts.length === 1 || account.isPrimary || idx === 0}
                                    disabled={business.bankAccounts.length === 1}
                                    className="h-4 w-4 border-gray-300"
                                  />
                                  <span className="text-gray-600">대표계좌로 설정</span>
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="flex justify-end mt-4 pt-4 border-t border-gray-200">
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 rounded-lg border border-green-600 bg-green-600 px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-green-700"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          계좌 추가
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex">
                      <span className="w-1/4 font-medium text-gray-700">사업자등록증:</span>
                      <div className="w-3/4">
                        <Upload
                          beforeUpload={() => false}
                          maxCount={1}
                          accept="image/*,.pdf"
                          defaultFileList={business.certificate ? [{
                            uid: '-1',
                            name: '사업자등록증.pdf',
                            status: 'done',
                          }] : []}
                        >
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 rounded border font-semibold bg-blue-100 border-blue-300 text-blue-600 px-2 py-0.5 text-xs"
                          >
                            <UploadIcon className="h-4 w-4" />
                            사업자등록증 첨부하기
                          </button>
                        </Upload>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex">
                    <span className="w-1/4 font-medium text-gray-700">ticker:</span>
                    <span className="w-3/4 text-gray-900">{business.ticker}</span>
                  </div>
                  <div className="flex">
                    <span className="w-1/4 font-medium text-gray-700">사업자번호:</span>
                    <span className="w-3/4 text-gray-900">{business.businessNumber || '-'}</span>
                  </div>
                  <div className="flex">
                    <span className="w-1/4 font-medium text-gray-700">상호:</span>
                    <span className="w-3/4 text-gray-900">{business.businessName || '-'}</span>
                  </div>
                  <div className="flex">
                    <span className="w-1/4 font-medium text-gray-700">대표자:</span>
                    <span className="w-3/4 text-gray-900">{business.representative || '-'}</span>
                  </div>
                  <div className="flex">
                    <span className="w-1/4 font-medium text-gray-700">사업장주소:</span>
                    <span className="w-3/4 text-gray-900">{business.businessAddress || '-'}</span>
                  </div>
                  <div className="flex">
                    <span className="w-1/4 font-medium text-gray-700">세금계산서 이메일:</span>
                    <span className="w-3/4 text-gray-900">{business.taxInvoiceEmail || '-'}</span>
                  </div>
                  {business.bankAccounts && business.bankAccounts.length > 0 && (
                    <div className="flex">
                      <span className="w-1/4 font-medium text-gray-700">은행계좌:</span>
                      <div className="w-3/4 space-y-1">
                        {business.bankAccounts.map((account, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-gray-900">
                            <span>{account.bank} {account.accountNumber} ({account.holder})</span>
                            {account.isPrimary && (
                              <span className="inline-flex items-center gap-1 rounded border font-semibold bg-yellow-100 border-yellow-300 text-yellow-600 px-2 py-0.5 text-xs">대표계좌</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex">
                    <span className="w-1/4 font-medium text-gray-700">사업자등록증:</span>
                    <span className="w-3/4 text-gray-900">
                      {business.certificate ? (
                        <Image.PreviewGroup>
                          <Image
                            src="/images/business-certificate-sample.png"
                            alt={`사업자등록증-${business.id}`}
                            width={0}
                            height={0}
                            style={{ display: 'none' }}
                            preview={{ mask: null }}
                          />
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 rounded border font-semibold bg-blue-100 border-blue-300 text-blue-600 px-2 py-0.5 text-xs"
                            onClick={() => {
                              const img = document.querySelector(`img[alt="사업자등록증-${business.id}"]`);
                              if (img) img.click();
                            }}
                          >
                            <FileImageOutlined />
                            사업자등록증 확인
                          </button>
                        </Image.PreviewGroup>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded border font-semibold bg-gray-100 border-gray-300 text-gray-600 px-2 py-0.5 text-xs">미첨부</span>
                      )}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 하단 버튼 (수정 모드일 때만 표시) */}
      {editMode && (
        <div className="mt-8 border-t border-gray-200 pt-6">
          <div className="grid grid-cols-2 gap-4">
            <FMButton
              variant="secondary"
              onClick={handleCancel}
              className="w-full"
            >
              취소
            </FMButton>
            <FMButton
              variant="primary"
              onClick={handleSave}
              className="w-full"
            >
              저장
            </FMButton>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

export default JoinDistributionDetail;
