import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Select, Upload } from 'antd';
import { ArrowLeftOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Upload as UploadIcon, Plus } from 'lucide-react';
import { businessRegistry } from '../data/mockData';
import { FMButton } from '../components/ui/FMButton';
import toast from 'react-hot-toast';

function DriverRegister() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleBusinessNumberChange = (e) => {
    const value = e.target.value;

    if (/^\d{3}-\d{2}-\d{5}$/.test(value)) {
      const businessInfo = businessRegistry[value];

      if (businessInfo) {
        form.setFieldsValue({
          businessName: businessInfo.businessName,
          representative: businessInfo.representative,
          businessAddress: businessInfo.businessAddress,
        });
        toast.success('등록된 사업자 정보를 불러왔습니다.');
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const hasMinimalInfo = values.name && values.ticker;
      const hasFullInfo = values.businessNumber || values.businessName;

      if (hasMinimalInfo && !hasFullInfo) {
        toast.success(`드라이버 '${values.name}'이 등록되었습니다. 추가 정보는 상세 페이지에서 수정할 수 있습니다.`);
      } else {
        toast.success(`드라이버 '${values.name}'이 등록되었습니다.`);
      }

      setTimeout(() => {
        navigate('/driver');
      }, 500);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleCancel = () => {
    navigate('/driver');
  };

  const handleVehicleTypeChange = (value) => {
    if (value === '5.0톤') {
      form.setFieldsValue({ tankCount: 10 });
    } else if (value === '1.0톤') {
      form.setFieldsValue({ tankCount: 4 });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex flex-col gap-6 w-full">
        {/* 헤더 */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-start">
            <FMButton
              variant="indigo"
              icon={<ArrowLeftOutlined className="h-4 w-4" />}
              href="/driver"
            >
              목록으로
            </FMButton>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">드라이버 등록</h2>
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">드라이버 기본 정보</h3>

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
                placeholder="차종 선택"
                onChange={handleVehicleTypeChange}
                options={[
                  { value: '5.0톤', label: '5.0톤' },
                  { value: '1.0톤', label: '1.0톤' }
                ]}
              />
            </Form.Item>

            <Form.Item name="tankCount" label="보유통수">
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
            </Form.Item>

            <Form.Item name="driverLevel" label="Driver Level" initialValue="모름">
              <Select
                options={[
                  { value: '잘함', label: '잘함' },
                  { value: '보통', label: '보통' },
                  { value: '못함', label: '못함' },
                  { value: '모름', label: '모름' }
                ]}
              />
            </Form.Item>
          </div>

          {/* 정산사업자 정보 */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">정산사업자 정보 (선택사항)</h3>

            <Form.Item
              name="ticker"
              label="ticker"
              rules={[
                { required: true, message: 'ticker를 입력해주세요' },
                { max: 10, message: '최대 10자' },
                { pattern: /^[A-Za-z0-9]+$/, message: '영문, 숫자만 허용' }
              ]}
            >
              <Input placeholder="예: JH01" />
            </Form.Item>

            <Form.Item
              name="businessNumber"
              label="사업자등록번호"
              rules={[
                { pattern: /^\d{3}-\d{2}-\d{5}$/, message: 'XXX-XX-XXXXX 형식' }
              ]}
            >
              <Input placeholder="123-45-67890" onChange={handleBusinessNumberChange} />
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
                placeholder="선택"
                options={[
                  { value: '과세', label: '과세' },
                  { value: '면세', label: '면세' }
                ]}
              />
            </Form.Item>

            <div className="my-4 border-t border-gray-200"></div>
            <h4 className="text-base font-semibold text-gray-900 mb-4">은행계좌 정보</h4>

            <Form.List name="bankAccounts" initialValue={[{}]}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }, index) => (
                    <div key={key} className="mb-6 last:mb-0">
                      {index > 0 && <div className="my-6 border-t border-gray-200"></div>}
                      <div className="flex items-center gap-2 mb-4">
                        <h5 className="text-sm font-medium text-gray-700">계좌 #{index + 1}</h5>
                        {fields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => remove(name)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <MinusCircleOutlined />
                          </button>
                        )}
                      </div>

                      <Form.Item
                        {...restField}
                        name={[name, 'bank']}
                        label="은행명"
                        className="mb-4"
                      >
                        <Input placeholder="예: 하나은행" />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'accountNumber']}
                        label="계좌번호"
                        className="mb-4"
                      >
                        <Input placeholder="123-456789-01234" />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'holder']}
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
                      onClick={() => add()}
                    >
                      계좌 추가
                    </FMButton>
                  </div>
                </>
              )}
            </Form.List>

            <div className="my-4 border-t border-gray-200"></div>

            <Form.Item
              name="certificate"
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
        </Form>

        {/* 하단 버튼 */}
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
              onClick={handleSubmit}
              className="w-full"
            >
              저장
            </FMButton>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DriverRegister;
