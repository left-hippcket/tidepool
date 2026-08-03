import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Select, Upload, Image, Modal } from 'antd';
import { ArrowLeftOutlined, MinusCircleOutlined, FileImageOutlined } from '@ant-design/icons';
import { Edit2, Plus, Upload as UploadIcon } from 'lucide-react';
import { driverDetails } from '../data/mockData';
import { FMButton } from '../components/ui/FMButton';
import { FMSwitch } from '../components/ui/FMSwitch';
import { FMRadioGroup } from '../components/ui/FMRadioGroup';
import toast from 'react-hot-toast';

function DriverDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [settlementForm] = Form.useForm();

  const driverData = driverDetails[id];

  const [editMode, setEditMode] = useState(false);

  if (!driverData) {
    return <div className="p-6">드라이버를 찾을 수 없습니다.</div>;
  }

  const { basicInfo, settlementInfo, settlementBusinesses } = driverData;

  const handleEditMode = () => {
    form.setFieldsValue({
      name: basicInfo.name,
      phone: basicInfo.phone,
      vehicleType: basicInfo.vehicleType,
      tankCount: basicInfo.tankCount,
      status: basicInfo.status
    });

    // 정산사업자 정보 로드 (배열 형태 또는 레거시 단일 정보)
    if (settlementBusinesses && settlementBusinesses.length > 0) {
      settlementForm.setFieldsValue({
        settlementBusinesses: settlementBusinesses.map(business => ({
          settlementBusinessName: business.settlementBusinessName || '',
          ticker: business.ticker || basicInfo.ticker,
          businessNumber: business.businessNumber || '',
          businessName: business.businessName || '',
          representative: business.representative || '',
          businessAddress: business.businessAddress || '',
          taxType: business.taxType || undefined,
          status: business.status || 'active',
          bankAccounts: business.bankAccounts?.map(acc => ({
            bank: acc.bank,
            accountNumber: acc.accountNumber,
            holder: acc.holder
          })) || [{}]
        }))
      });
    } else if (settlementInfo) {
      // 레거시 단일 정산사업자 정보
      settlementForm.setFieldsValue({
        settlementBusinesses: [{
          settlementBusinessName: basicInfo.name,
          ticker: basicInfo.ticker,
          businessNumber: settlementInfo.businessNumber,
          businessName: settlementInfo.businessName,
          representative: settlementInfo.representative,
          businessAddress: settlementInfo.businessAddress,
          taxType: settlementInfo.taxType,
          status: 'active',
          bankAccounts: settlementInfo.bankAccounts.map(acc => ({
            bank: acc.bank,
            accountNumber: acc.accountNumber,
            holder: acc.holder
          }))
        }]
      });
    } else {
      settlementForm.setFieldsValue({
        settlementBusinesses: [{
          settlementBusinessName: '',
          ticker: basicInfo.ticker,
          status: 'active',
          bankAccounts: [{}]
        }]
      });
    }

    setEditMode(true);
  };

  const handleSave = async () => {
    try {
      const basicValues = await form.validateFields();
      const settlementValues = await settlementForm.validateFields();

      if (basicValues.status === 'inactive' && basicInfo.status === 'active') {
        Modal.confirm({
          title: '드라이버 비활성화',
          content: '이 드라이버를 비활성화하시겠습니까? 비활성화 후에는 신규 거래 시 선택할 수 없습니다.',
          okText: '확인',
          cancelText: '취소',
          onOk: () => {
            toast.success('드라이버가 비활성화되었습니다.');
            setEditMode(false);
          }
        });
      } else if (basicValues.status === 'active' && basicInfo.status === 'inactive') {
        toast.success('드라이버가 활성화되었습니다.');
        setEditMode(false);
      } else {
        toast.success('드라이버 정보가 수정되었습니다.');
        setEditMode(false);
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    settlementForm.resetFields();
    setEditMode(false);
  };

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
                href="/driver"
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
            <h2 className="text-2xl font-bold text-gray-900">{basicInfo.name}</h2>
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
              basicInfo.status === 'active'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-700'
            }`}>
              {basicInfo.status === 'active' ? '활성' : '비활성'}
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
        {/* 드라이버 기본 정보 */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">드라이버 기본 정보</h3>
            <span className="text-xs text-gray-500">최근 수정일: 2026-07-29</span>
          </div>

          {editMode ? (
            <>
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

              <Form.Item label="상태">
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
                <span className="w-1/5 font-medium text-gray-700">드라이버명:</span>
                <span className="w-4/5 text-gray-900">{basicInfo.name}</span>
              </div>
              <div className="flex">
                <span className="w-1/5 font-medium text-gray-700">전화번호:</span>
                <span className="w-4/5 text-gray-900">{basicInfo.phone || '-'}</span>
              </div>
              <div className="flex">
                <span className="w-1/5 font-medium text-gray-700">차종:</span>
                <span className="w-4/5 text-gray-900">{basicInfo.vehicleType || '-'}</span>
              </div>
              <div className="flex">
                <span className="w-1/5 font-medium text-gray-700">보유통수:</span>
                <span className="w-4/5 text-gray-900">{basicInfo.tankCount ? `${basicInfo.tankCount}통` : '-'}</span>
              </div>
            </div>
          )}
        </div>
        </Form>

        {/* 정산사업자 정보 */}
        <Form
          form={settlementForm}
          layout="horizontal"
          labelCol={{ flex: '20%' }}
          wrapperCol={{ flex: '80%' }}
          labelAlign="left"
        >
        <div className="rounded-xl border border-gray-200 bg-white p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">정산사업자 정보</h3>
            <span className="text-xs text-gray-500">최근 수정일: 2026-07-28</span>
          </div>

          {editMode ? (
            <Form.List name="settlementBusinesses">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }, index) => (
                    <div key={key} className="mb-6 last:mb-0">
                      {index > 0 && <div className="my-6 border-t border-gray-200"></div>}
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-base font-semibold text-gray-900">정산사업자 #{index + 1}</h4>
                      </div>

                      <Form.Item
                        {...restField}
                        name={[name, 'settlementBusinessName']}
                        label="정산사업자명"
                        rules={[
                          { required: true, message: '정산사업자명을 입력해주세요' },
                          { max: 50, message: '최대 50자' }
                        ]}
                      >
                        <Input placeholder="예: 정훈" />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'ticker']}
                        label="ticker"
                        rules={[
                          { required: true, message: 'ticker를 입력해주세요' }
                        ]}
                      >
                        <Input
                          disabled
                          placeholder="예: JH01"
                          className="bg-gray-50"
                        />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'businessNumber']}
                        label="사업자등록번호"
                        rules={[
                          { pattern: /^\d{3}-\d{2}-\d{5}$/, message: 'XXX-XX-XXXXX 형식' }
                        ]}
                      >
                        <Input
                          disabled
                          placeholder="123-45-67890"
                          className="bg-gray-50"
                        />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'businessName']}
                        label="사업자등록상호"
                        rules={[{ max: 50, message: '최대 50자' }]}
                      >
                        <Input placeholder="만진수산" />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'representative']}
                        label="대표자"
                        rules={[{ max: 10, message: '최대 10자' }]}
                      >
                        <Input placeholder="김만진" />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'businessAddress']}
                        label="사업자등록주소"
                        rules={[{ max: 100, message: '최대 100자' }]}
                      >
                        <Input placeholder="경기도 수지구 동천동 230-3" />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'taxType']}
                        label="사업자 과세유형"
                      >
                        <FMRadioGroup
                          value={settlementForm.getFieldValue(['settlementBusinesses', index, 'taxType'])}
                          onChange={(value) => {
                            const businesses = settlementForm.getFieldValue('settlementBusinesses') || [];
                            businesses[index] = { ...businesses[index], taxType: value };
                            settlementForm.setFieldsValue({ settlementBusinesses: businesses });
                          }}
                          options={[
                            { label: '과세', value: '과세' },
                            { label: '면세', value: '면세' }
                          ]}
                        />
                      </Form.Item>

                      <div className="flex items-center mb-4">
                        <span className="w-1/5 font-medium text-gray-700">정산사업자 상태:</span>
                        <div className="w-4/5">
                          <Form.Item
                            {...restField}
                            name={[name, 'status']}
                            noStyle
                          >
                            <FMSwitch
                              checked={settlementForm.getFieldValue(['settlementBusinesses', index, 'status']) === 'active'}
                              onChange={(checked) => {
                                const businesses = settlementForm.getFieldValue('settlementBusinesses') || [];
                                if (checked) {
                                  // 다른 사업자를 모두 비활성화
                                  businesses.forEach((b, idx) => {
                                    if (idx !== index) {
                                      businesses[idx] = { ...b, status: 'inactive' };
                                    } else {
                                      businesses[idx] = { ...b, status: 'active' };
                                    }
                                  });
                                  settlementForm.setFieldsValue({ settlementBusinesses: businesses });
                                  toast.success('다른 정산사업자가 자동으로 비활성화되었습니다.');
                                } else {
                                  businesses[index] = { ...businesses[index], status: 'inactive' };
                                  settlementForm.setFieldsValue({ settlementBusinesses: businesses });
                                }
                              }}
                              onLabel="활성"
                              offLabel="비활성"
                            />
                          </Form.Item>
                        </div>
                      </div>

                      <div className="my-4 border-t border-gray-200"></div>
                      <h5 className="text-sm font-semibold text-gray-900 mb-4">은행계좌 정보</h5>

                      <Form.List name={[name, 'bankAccounts']}>
                        {(bankFields, { add: addBank, remove: removeBank }) => (
                          <>
                            {bankFields.map(({ key: bankKey, name: bankName, ...bankRestField }, bankIndex) => (
                              <div key={bankKey} className="mb-4 last:mb-0">
                                {bankIndex > 0 && <div className="my-4 border-t border-gray-100"></div>}
                                <div className="flex items-center gap-2 mb-3">
                                  <h6 className="text-xs font-medium text-gray-700">계좌 #{bankIndex + 1}</h6>
                                  {bankFields.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => removeBank(bankName)}
                                      className="text-red-500 hover:text-red-700 text-xs"
                                    >
                                      <MinusCircleOutlined />
                                    </button>
                                  )}
                                </div>

                                <Form.Item
                                  {...bankRestField}
                                  name={[bankName, 'bank']}
                                  label="은행명"
                                  className="mb-3"
                                >
                                  <Input placeholder="예: 하나은행" />
                                </Form.Item>

                                <Form.Item
                                  {...bankRestField}
                                  name={[bankName, 'accountNumber']}
                                  label="계좌번호"
                                  className="mb-3"
                                >
                                  <Input placeholder="123-456789-01234" />
                                </Form.Item>

                                <Form.Item
                                  {...bankRestField}
                                  name={[bankName, 'holder']}
                                  label="예금주"
                                  className="mb-0"
                                >
                                  <Input placeholder="김만진" />
                                </Form.Item>
                              </div>
                            ))}
                            <div className="flex justify-end">
                              <FMButton
                                variant="green"
                                icon={<Plus className="h-4 w-4" />}
                                onClick={() => addBank()}
                              >
                                계좌 추가
                              </FMButton>
                            </div>
                          </>
                        )}
                      </Form.List>

                      <div className="my-4 border-t border-gray-200"></div>

                      <Form.Item
                        {...restField}
                        name={[name, 'certificate']}
                        label="사업자등록증"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => e?.fileList}
                      >
                        <Upload
                          beforeUpload={() => false}
                          maxCount={1}
                          accept="image/*,.pdf"
                        >
                          <FMButton
                            variant="green"
                            icon={<UploadIcon className="h-4 w-4" />}
                          >
                            사업자등록증 첨부하기
                          </FMButton>
                        </Upload>
                      </Form.Item>
                    </div>
                  ))}
                  <div className="flex justify-end mt-4">
                    <FMButton
                      variant="green"
                      icon={<Plus className="h-4 w-4" />}
                      onClick={() => add()}
                    >
                      정산사업자 추가
                    </FMButton>
                  </div>
                </>
              )}
            </Form.List>
          ) : (settlementBusinesses && settlementBusinesses.length > 0) ? (
            <div className="space-y-6">
              {settlementBusinesses.map((business, index) => (
                <div key={index} className="space-y-3">
                  {index > 0 && <div className="my-6 border-t border-gray-200"></div>}
                  <div className="flex items-center gap-3 mb-3">
                    <h4 className="text-base font-semibold text-gray-900">정산사업자 #{index + 1}</h4>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      business.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {business.status === 'active' ? '활성' : '비활성'}
                    </span>
                  </div>

                  <div className="flex">
                    <span className="w-1/5 font-medium text-gray-700">정산사업자명:</span>
                    <span className="w-4/5 text-gray-900">{business.settlementBusinessName || '-'}</span>
                  </div>
                  <div className="flex">
                    <span className="w-1/5 font-medium text-gray-700">ticker:</span>
                    <span className="w-4/5 text-gray-900">{business.ticker || basicInfo.ticker}</span>
                  </div>
                  <div className="flex">
                    <span className="w-1/5 font-medium text-gray-700">사업자등록번호:</span>
                    <span className="w-4/5 text-gray-900">{business.businessNumber || '-'}</span>
                  </div>
                  <div className="flex">
                    <span className="w-1/5 font-medium text-gray-700">사업자등록상호:</span>
                    <span className="w-4/5 text-gray-900">{business.businessName || '-'}</span>
                  </div>
                  <div className="flex">
                    <span className="w-1/5 font-medium text-gray-700">대표자:</span>
                    <span className="w-4/5 text-gray-900">{business.representative || '-'}</span>
                  </div>
                  <div className="flex">
                    <span className="w-1/5 font-medium text-gray-700">사업자등록주소:</span>
                    <span className="w-4/5 text-gray-900">{business.businessAddress || '-'}</span>
                  </div>
                  <div className="flex">
                    <span className="w-1/5 font-medium text-gray-700">사업자 과세유형:</span>
                    <span className="w-4/5 text-gray-900">
                      {business.taxType === '과세' ? (
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">과세</span>
                      ) : business.taxType === '면세' ? (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">면세</span>
                      ) : '-'}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="w-1/5 font-medium text-gray-700">은행계좌:</span>
                    <span className="w-4/5 text-gray-900">
                      <div className="space-y-1">
                        {business.bankAccounts && business.bankAccounts.length > 0 ? (
                          business.bankAccounts.map((acc, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <span>{acc.bank} {acc.accountNumber} ({acc.holder})</span>
                              {acc.isPrimary && (
                                <span className="inline-flex items-center gap-1 rounded border font-semibold bg-yellow-100 border-yellow-300 text-yellow-600 px-2 py-0.5 text-xs">대표계좌</span>
                              )}
                            </div>
                          ))
                        ) : '-'}
                      </div>
                    </span>
                  </div>
                  <div className="flex">
                    <span className="w-1/5 font-medium text-gray-700">사업자등록증:</span>
                    <span className="w-4/5 text-gray-900">
                      {business.hasCertificate ? (
                        <Image.PreviewGroup>
                          <Image
                            src="/images/business-certificate-sample.png"
                            alt={`사업자등록증-driver-${index}`}
                            width={0}
                            height={0}
                            style={{ display: 'none' }}
                            preview={{ mask: null }}
                          />
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 rounded border font-semibold bg-blue-100 border-blue-300 text-blue-600 px-2 py-0.5 text-xs"
                            onClick={() => {
                              const img = document.querySelector(`img[alt="사업자등록증-driver-${index}"]`);
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
              ))}
            </div>
          ) : settlementInfo ? (
            <div className="space-y-3">
              <div className="flex">
                <span className="w-1/5 font-medium text-gray-700">ticker:</span>
                <span className="w-4/5 text-gray-900">{basicInfo.ticker}</span>
              </div>
              <div className="flex">
                <span className="w-1/5 font-medium text-gray-700">사업자등록번호:</span>
                <span className="w-4/5 text-gray-900">{settlementInfo.businessNumber}</span>
              </div>
              <div className="flex">
                <span className="w-1/5 font-medium text-gray-700">사업자등록상호:</span>
                <span className="w-4/5 text-gray-900">{settlementInfo.businessName}</span>
              </div>
              <div className="flex">
                <span className="w-1/5 font-medium text-gray-700">대표자:</span>
                <span className="w-4/5 text-gray-900">{settlementInfo.representative}</span>
              </div>
              <div className="flex">
                <span className="w-1/5 font-medium text-gray-700">사업자등록주소:</span>
                <span className="w-4/5 text-gray-900">{settlementInfo.businessAddress}</span>
              </div>
              <div className="flex">
                <span className="w-1/5 font-medium text-gray-700">사업자 과세유형:</span>
                <span className="w-4/5 text-gray-900">
                  {settlementInfo.taxType === '과세' ? (
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">과세</span>
                  ) : settlementInfo.taxType === '면세' ? (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">면세</span>
                  ) : '-'}
                </span>
              </div>
              <div className="flex">
                <span className="w-1/5 font-medium text-gray-700">은행계좌:</span>
                <span className="w-4/5 text-gray-900">
                  <div className="space-y-1">
                    {settlementInfo.bankAccounts.map((acc, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span>{acc.bank} {acc.accountNumber} ({acc.holder})</span>
                        {acc.isPrimary && (
                          <span className="inline-flex items-center gap-1 rounded border font-semibold bg-yellow-100 border-yellow-300 text-yellow-600 px-2 py-0.5 text-xs">대표계좌</span>
                        )}
                      </div>
                    ))}
                  </div>
                </span>
              </div>
              <div className="flex">
                <span className="w-1/5 font-medium text-gray-700">사업자등록증:</span>
                <span className="w-4/5 text-gray-900">
                  {settlementInfo.hasCertificate ? (
                    <Image.PreviewGroup>
                      <Image
                        src="/images/business-certificate-sample.png"
                        alt="사업자등록증-driver"
                        width={0}
                        height={0}
                        style={{ display: 'none' }}
                        preview={{ mask: null }}
                      />
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 rounded border font-semibold bg-blue-100 border-blue-300 text-blue-600 px-2 py-0.5 text-xs"
                        onClick={() => {
                          const img = document.querySelector(`img[alt="사업자등록증-driver"]`);
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
          ) : (
            <div className="space-y-3">
              <p className="text-gray-500">정산사업자 정보가 등록되지 않았습니다.</p>
            </div>
          )}
        </div>
        </Form>

        {/* 하단 버튼 */}
        {editMode && (
          <div className="border-t border-gray-200 pt-6">
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

export default DriverDetail;
