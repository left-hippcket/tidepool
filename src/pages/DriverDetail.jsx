import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Select, Upload, InputNumber, DatePicker, Image, Modal } from 'antd';
import { ArrowLeftOutlined, MinusCircleOutlined, UploadOutlined, FileImageOutlined } from '@ant-design/icons';
import { Edit2, Plus, Upload as UploadIcon } from 'lucide-react';
import { driverDetails, claimHistory, driverTransactionDetails } from '../data/mockData';
import { FMButton } from '../components/ui/FMButton';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const { TextArea } = Input;

function DriverDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [settlementForm] = Form.useForm();
  const [claimForm] = Form.useForm();

  const driverData = driverDetails[id];
  const transactionData = driverTransactionDetails[id];

  const [editMode, setEditMode] = useState(false);
  const [claimModalVisible, setClaimModalVisible] = useState(false);
  const [editingClaimId, setEditingClaimId] = useState(null);
  const [claims, setClaims] = useState(claimHistory[id] || []);
  const [periodFilter, setPeriodFilter] = useState('최근 3개월');

  if (!driverData) {
    return <div className="p-6">드라이버를 찾을 수 없습니다.</div>;
  }

  const { basicInfo, settlementInfo } = driverData;

  // 기간별 데이터 계산
  const filteredPeriods = useMemo(() => {
    if (!transactionData) return [];

    const allPeriods = transactionData.periods;
    const now = dayjs();

    switch (periodFilter) {
      case '최근 1개월':
        return allPeriods.slice(-3);
      case '최근 3개월':
        return allPeriods.slice(-9);
      case '최근 6개월':
        return allPeriods.slice(-18);
      case '이번달':
        const thisMonth = now.format('M월');
        return allPeriods.filter(p => p.period.startsWith(thisMonth));
      case '이번분기':
        const thisQuarter = Math.ceil(now.month() / 3);
        const quarterMonths = [thisQuarter * 3 - 2, thisQuarter * 3 - 1, thisQuarter * 3];
        return allPeriods.filter(p => {
          const month = parseInt(p.period);
          return quarterMonths.includes(month);
        });
      case '올해':
        return allPeriods;
      case '누적':
        return allPeriods;
      default:
        return allPeriods.slice(-9);
    }
  }, [transactionData, periodFilter]);

  const metrics = useMemo(() => {
    if (!filteredPeriods.length) return { totalFreight: 0, totalTripCount: 0, averageFreight: 0 };

    const totalFreight = filteredPeriods.reduce((sum, p) => sum + p.freight, 0);
    const totalTripCount = filteredPeriods.reduce((sum, p) => sum + p.tripCount, 0);
    const averageFreight = totalTripCount > 0 ? Math.round(totalFreight / totalTripCount) : 0;

    return { totalFreight, totalTripCount, averageFreight };
  }, [filteredPeriods]);

  const handleEditMode = () => {
    form.setFieldsValue({
      name: basicInfo.name,
      phone: basicInfo.phone,
      vehicleType: basicInfo.vehicleType,
      tankCount: basicInfo.tankCount,
      status: basicInfo.status
    });

    if (settlementInfo) {
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
    } else {
      settlementForm.setFieldsValue({
        businessNumber: '',
        businessName: '',
        representative: '',
        businessAddress: '',
        taxType: undefined,
        bankAccounts: [{ bank: '', accountNumber: '', holder: '' }]
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

  // 이슈 히스토리
  const handleClaimAdd = () => {
    claimForm.resetFields();
    claimForm.setFieldsValue({
      occurredAt: dayjs(),
      content: ''
    });
    setEditingClaimId(null);
    setClaimModalVisible(true);
  };

  const handleClaimEdit = (claim) => {
    claimForm.setFieldsValue({
      occurredAt: dayjs(claim.occurredAt.split(' ')[0], 'YYYY-MM-DD'),
      content: claim.content
    });
    setEditingClaimId(claim.id);
    setClaimModalVisible(true);
  };

  const handleClaimSave = async () => {
    try {
      const values = await claimForm.validateFields();
      if (editingClaimId) {
        toast.success('이슈 히스토리가 수정되었습니다.');
      } else {
        toast.success('이슈 히스토리가 등록되었습니다.');
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
        toast.success('이슈 히스토리가 삭제되었습니다.');
      }
    });
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

              <Form.Item name="status" label="상태">
                <Select
                  options={[
                    { value: 'active', label: '활성' },
                    { value: 'inactive', label: '비활성' }
                  ]}
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

        {/* 정산사업자 정보 */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">정산사업자 정보</h3>
            <span className="text-xs text-gray-500">최근 수정일: 2026-07-28</span>
          </div>

          {editMode ? (
            <>
              <Form.Item label="ticker">
                <Input value={basicInfo.ticker} disabled className="bg-gray-100" />
              </Form.Item>

              <Form.Item
                name="businessNumber"
                label="사업자등록번호"
                rules={[
                  { pattern: /^\d{3}-\d{2}-\d{5}$/, message: 'XXX-XX-XXXXX 형식' }
                ]}
              >
                <Input
                  placeholder="123-45-67890"
                  disabled={!!settlementInfo}
                  className={settlementInfo ? "bg-gray-100" : ""}
                />
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

              <div className="my-4 border-t border-gray-200"></div>
              <h4 className="text-base font-semibold text-gray-900 mb-4">은행계좌 정보</h4>

              <Form.List name="bankAccounts">
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
            </>
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

        {/* 이슈 히스토리 */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 mb-4 opacity-60">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-semibold text-gray-700">이슈 히스토리 (P2 예정)</h3>
            </div>
            <div className="flex items-center gap-4">
              <FMButton
                variant="secondary"
                icon={<Plus className="h-4 w-4" />}
                onClick={handleClaimAdd}
              >
                이력 추가
              </FMButton>
            </div>
          </div>

          {claims.length > 0 ? (
            <div className="space-y-4">
              {claims.map((claim) => (
                <div key={claim.id} className="border-l-2 border-gray-300 pl-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="text-sm font-medium text-gray-900">{claim.occurredAt.split(' ')[0]}</span>
                      <span className="text-xs text-gray-500 ml-2">작성자: {claim.author}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleClaimEdit(claim)}
                        className="px-3 py-1 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-50"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleClaimDelete(claim.id)}
                        className="px-3 py-1 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{claim.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">등록된 이슈 히스토리가 없습니다.</p>
          )}
        </div>

        {/* 거래 실적 (P2) */}
        {transactionData && (
          <div className="opacity-60 space-y-4">
            {/* 기간 필터 */}
            <div className="rounded-xl border border-gray-300 bg-gray-50 p-4">
              <div className="flex flex-wrap gap-2">
                {['최근 1개월', '최근 3개월', '최근 6개월', '이번달', '이번분기', '올해', '누적'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setPeriodFilter(period)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      periodFilter === period
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600 border border-gray-300 hover:bg-gray-300'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            {/* 통합 지표 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl border border-gray-300 bg-gray-100 p-5">
                <div className="text-sm text-gray-500 mb-1">운임 (총액)</div>
                <div className="text-2xl font-semibold text-gray-400">{metrics.totalFreight.toLocaleString()}원</div>
              </div>
              <div className="rounded-xl border border-gray-300 bg-gray-100 p-5">
                <div className="text-sm text-gray-500 mb-1">운송횟수</div>
                <div className="text-2xl font-semibold text-gray-400">{metrics.totalTripCount}회</div>
              </div>
              <div className="rounded-xl border border-gray-300 bg-gray-100 p-5">
                <div className="text-sm text-gray-500 mb-1">평균 운임</div>
                <div className="text-2xl font-semibold text-gray-400">{metrics.averageFreight.toLocaleString()}원</div>
              </div>
            </div>

            {/* 거래 상세 테이블 */}
            <div className="rounded-xl border border-gray-300 bg-gray-50 p-6">
              <h4 className="text-base font-semibold text-gray-500 mb-4">거래 상세 내역 (P2 예정)</h4>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-gray-100">
                    <tr className="border-b border-gray-300">
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">기간</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">운임</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">운송횟수</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">운송 셀러</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">운송 바이어</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">운송 품목</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPeriods.map((item) => (
                      <tr key={item.period} className="border-b border-gray-200">
                        <td className="px-4 py-3 text-sm text-gray-500">{item.period}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{item.freight.toLocaleString()}원</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{item.tripCount}회</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{item.sellers}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{item.buyers}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{item.products}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 운임 차트 */}
            <div className="rounded-xl border border-gray-300 bg-gray-50 p-6">
              <h4 className="text-base font-semibold text-gray-500 mb-4">운임 추이 (P2 예정)</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={filteredPeriods}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#D1D5DB" />
                  <XAxis dataKey="period" tick={{ fill: '#6B7280' }} />
                  <YAxis tick={{ fill: '#6B7280' }} />
                  <Tooltip
                    formatter={(value) => `${value.toLocaleString()}원`}
                    contentStyle={{ backgroundColor: '#F3F4F6', border: '1px solid #D1D5DB' }}
                  />
                  <Legend wrapperStyle={{ color: '#6B7280' }} />
                  <Bar dataKey="freight" name="운임" fill="#9CA3AF" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

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

        {/* 이슈 히스토리 모달 */}
        <Modal
          title={editingClaimId ? '이슈 히스토리 수정' : '이슈 히스토리 추가'}
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
              label="발생일"
              rules={[{ required: true, message: '발생일을 선택해주세요' }]}
            >
              <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="content"
              label="내용"
              rules={[
                { required: true, message: '내용을 입력해주세요' },
                { max: 500, message: '최대 500자' }
              ]}
            >
              <TextArea rows={5} placeholder="이슈 내용을 입력하세요" />
            </Form.Item>

            <Form.Item name="images" label="이미지" valuePropName="fileList" getValueFromEvent={(e) => e?.fileList}>
              <Upload beforeUpload={() => false} maxCount={5} accept="image/*,.pdf" listType="picture">
                <FMButton variant="secondary" icon={<UploadOutlined />}>
                  이미지 첨부 (최대 5개, 10MB)
                </FMButton>
              </Upload>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
}

export default DriverDetail;
