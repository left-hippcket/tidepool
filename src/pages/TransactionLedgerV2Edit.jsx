import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, InputNumber, DatePicker, Select, Modal } from 'antd';
import { ArrowLeftOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Edit2, Save, X, AlertCircle, Trash2 } from 'lucide-react';
import dayjs from 'dayjs';
import { FMButton } from '../components/ui/FMButton';
import { FMSwitch } from '../components/ui/FMSwitch';
import { transactionLedgerDataV2, sellerGroups, buyerGroups, drivers, products, origins, specifications } from '../data/mockData';

// 셀러명과 바이어명 추출 (중복 제거 및 정렬)
const getUniqueNames = (data, key) => {
  const names = [...new Set(data.map(item => item[key]).filter(Boolean))];
  return names.sort();
};

const sellerNames = getUniqueNames(transactionLedgerDataV2, '셀러명');
const buyerNames = getUniqueNames(transactionLedgerDataV2, '바이어명');
import { calculateAllFields } from '../utils/ledgerCalculations';
import toast from 'react-hot-toast';

const { TextArea } = Input;
const { Option } = Select;

const TransactionLedgerV2Edit = () => {
  const { transactionCode } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [editMode, setEditMode] = useState(true); // 바로 수정 모드로 시작
  const [transaction, setTransaction] = useState(null);
  const [calculatedFields, setCalculatedFields] = useState({});
  const [hasWarnings, setHasWarnings] = useState(false);

  // 거래 데이터 로드
  useEffect(() => {
    const found = transactionLedgerDataV2.find(
      (t) => t.거래코드 === transactionCode
    );
    if (found) {
      setTransaction(found);
      // 초기 계산 수행
      recalculate(found);
      // 바로 폼에 값 설정
      form.setFieldsValue({
        주문일: found.주문일 ? dayjs(found.주문일) : null,
        납품일: found.납품일 ? dayjs(found.납품일) : null,
        품목: found.품목,
        원산지: found.원산지,
        규격: found.규격,
        주문수량: found.주문수량,
        주문중량: found.주문중량,
        상차단가: found.상차단가,
        도착단가: found.도착단가,
        상차수수료율: found.상차수수료율,
        통당운임단가: typeof found.통당운임단가 === 'number' ? found.통당운임단가 : null,
        운송비포함여부: found.운송비포함여부,
        셀러명: found.셀러명,
        바이어명: found.바이어명,
        드라이버명: found.드라이버명,
        거래메모: found.거래메모,
      });
    } else {
      toast.error('거래 정보를 찾을 수 없습니다.');
      navigate('/transaction-ledger-v2');
    }
  }, [transactionCode, navigate, form]);

  // 실시간 계산
  const recalculate = (updatedData) => {
    const calculated = calculateAllFields(updatedData);
    setCalculatedFields(calculated);
    checkWarnings(updatedData, calculated);
  };

  // 경고 체크
  const checkWarnings = (data, calculated) => {
    const warnings = [];

    if (
      String(data.셀러명).includes('미정') ||
      String(data.바이어명).includes('미정') ||
      String(data.드라이버명).includes('미정')
    ) {
      warnings.push('미정 필드가 있습니다');
    }

    if (data.품목 === '넙치' && calculated.알파수익단가 !== null && calculated.알파수익단가 < 0) {
      warnings.push('알파수익단가가 마이너스입니다');
    }

    if (data.도착단가 < data.상차단가) {
      warnings.push('도착단가가 상차단가보다 낮습니다');
    }

    if (calculated.거래손익 < 0) {
      warnings.push('거래손익이 마이너스입니다');
    }

    setHasWarnings(warnings.length > 0);
  };

  // 이제 사용하지 않음 (바로 수정 모드로 시작)

  // Form 값 변경 시 실시간 계산
  const handleValuesChange = (changedValues, allValues) => {
    const updatedTransaction = {
      ...transaction,
      주문일: allValues.주문일 ? allValues.주문일.format('YYYY-MM-DD') : transaction.주문일,
      납품일: allValues.납품일 ? allValues.납품일.format('YYYY-MM-DD') : transaction.납품일,
      품목: allValues.품목 || transaction.품목,
      원산지: allValues.원산지 || transaction.원산지,
      규격: allValues.규격 || transaction.규격,
      주문수량: allValues.주문수량 ?? transaction.주문수량,
      주문중량: allValues.주문중량 ?? transaction.주문중량,
      상차단가: allValues.상차단가 ?? transaction.상차단가,
      도착단가: allValues.도착단가 ?? transaction.도착단가,
      상차수수료율: allValues.상차수수료율 ?? transaction.상차수수료율,
      통당운임단가: allValues.통당운임단가 ?? transaction.통당운임단가,
      운송비포함여부: allValues.운송비포함여부 ?? transaction.운송비포함여부,
      셀러명: allValues.셀러명 || transaction.셀러명,
      바이어명: allValues.바이어명 || transaction.바이어명,
      드라이버명: allValues.드라이버명 || transaction.드라이버명,
      거래메모: allValues.거래메모 || transaction.거래메모,
    };

    recalculate(updatedTransaction);
  };

  // 저장
  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      // 거래손익이 마이너스인 경우 거래메모 필수 체크
      if (calculatedFields.거래손익 < 0) {
        if (!values.거래메모 || values.거래메모.trim() === '') {
          toast.error('거래손익이 마이너스인 경우 거래메모는 필수입니다.');
          return;
        }
      }

      // 저장 확인 모달
      Modal.confirm({
        title: '거래 내역 저장 확인',
        icon: <ExclamationCircleOutlined />,
        content: (
          <div>
            <p className="mb-2">거래 내역을 수정하면 <strong>손익 및 회계 전체에 영향</strong>을 줍니다.</p>
            <p>저장하시겠습니까?</p>
          </div>
        ),
        okText: '저장',
        cancelText: '취소',
        okButtonProps: { danger: true },
        onOk: () => performSave(values),
      });
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  // 실제 저장 수행
  const performSave = async (values) => {
    try {

      const storedData = JSON.parse(
        localStorage.getItem('transactionLedgerDataV2') || '[]'
      );

      const index = storedData.findIndex((t) => t.거래코드 === transactionCode);

      const updatedTransaction = {
        ...transaction,
        주문일: values.주문일.format('YYYY-MM-DD'),
        납품일: values.납품일.format('YYYY-MM-DD'),
        품목: values.품목,
        원산지: values.원산지,
        규격: values.규격,
        주문수량: values.주문수량,
        주문중량: values.주문중량,
        상차단가: values.상차단가,
        도착단가: values.도착단가,
        상차수수료율: values.상차수수료율,
        통당운임단가: values.통당운임단가,
        운송비포함여부: values.운송비포함여부,
        셀러명: values.셀러명,
        바이어명: values.바이어명,
        드라이버명: values.드라이버명,
        거래메모: values.거래메모,
      };

      if (index >= 0) {
        storedData[index] = updatedTransaction;
      } else {
        storedData.push(updatedTransaction);
      }

      localStorage.setItem('transactionLedgerDataV2', JSON.stringify(storedData));

      toast.success('거래 정보가 수정되었습니다.');
      navigate('/transaction-ledger-v2');
    } catch (error) {
      console.error('Validation error:', error);
      toast.error('입력값을 확인해주세요.');
    }
  };

  // 취소
  const handleCancel = () => {
    navigate('/transaction-ledger-v2');
  };

  // 삭제 핸들러
  const handleDelete = () => {
    Modal.confirm({
      title: '거래 내역 삭제',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p className="mb-2 text-red-600 font-semibold">⚠️ 이 작업은 되돌릴 수 없습니다.</p>
          <p className="mb-2">거래 내역을 삭제하면 <strong>손익 및 회계 전체에 영향</strong>을 줍니다.</p>
          <p>정말 삭제하시겠습니까?</p>
        </div>
      ),
      okText: '삭제',
      cancelText: '취소',
      okButtonProps: { danger: true },
      onOk: () => performDelete(),
    });
  };

  // 실제 삭제 수행
  const performDelete = () => {
    try {
      // mockData에서 해당 거래 제거
      const index = transactionLedgerDataV2.findIndex(t => t.거래코드 === transactionCode);
      if (index > -1) {
        transactionLedgerDataV2.splice(index, 1);
        toast.success('거래 내역이 삭제되었습니다.');
        navigate('/transaction-ledger-v2');
      } else {
        toast.error('거래 정보를 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error('삭제 실패:', error);
      toast.error('삭제 중 오류가 발생했습니다.');
    }
  };

  if (!transaction) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="flex flex-col gap-6 w-full">
          <div className="flex flex-col gap-4">
            <div className="flex justify-start">
              <FMButton
                variant="indigo"
                icon={<ArrowLeftOutlined className="h-4 w-4" />}
                href="/transaction-ledger-v2"
              >
                목록으로
              </FMButton>
            </div>
            <div className="text-lg text-gray-600">거래 정보를 찾을 수 없습니다.</div>
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
            <FMButton
              variant="indigo"
              icon={<ArrowLeftOutlined className="h-4 w-4" />}
              onClick={handleCancel}
            >
              목록으로
            </FMButton>
          </div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900">거래 수정</h2>
            <span className="text-sm text-gray-600">거래코드: {transactionCode}</span>
          </div>
        </div>

        {/* 경고 메시지 */}
        {hasWarnings && (
          <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  입력 내용을 확인해주세요
                </p>
                <ul className="mt-1 text-sm text-yellow-700 list-disc list-inside">
                  {String(transaction.셀러명).includes('미정') && (
                    <li>셀러명에 "미정"이 포함되어 있습니다</li>
                  )}
                  {String(transaction.바이어명).includes('미정') && (
                    <li>바이어명에 "미정"이 포함되어 있습니다</li>
                  )}
                  {String(transaction.드라이버명).includes('미정') && (
                    <li>드라이버명에 "미정"이 포함되어 있습니다</li>
                  )}
                  {transaction.품목 === '넙치' &&
                    calculatedFields.알파수익단가 !== null &&
                    calculatedFields.알파수익단가 < 0 && (
                      <li>
                        알파수익단가가 마이너스입니다 (
                        {calculatedFields.알파수익단가?.toLocaleString()}원)
                      </li>
                    )}
                  {transaction.도착단가 < transaction.상차단가 && (
                    <li>도착단가가 상차단가보다 낮습니다</li>
                  )}
                  {calculatedFields.거래손익 < 0 && (
                    <li>
                      거래손익이 마이너스입니다 (
                      {calculatedFields.거래손익?.toLocaleString()}원)
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        <Form
          form={form}
          layout="horizontal"
          labelCol={{ flex: '20%' }}
          wrapperCol={{ flex: '80%' }}
          labelAlign="left"
          onValuesChange={handleValuesChange}
        >
          {/* 기본 정보 */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">기본 정보</h3>

            <Form.Item
              label="주문일"
              name="주문일"
              rules={[{ required: true, message: '주문일을 선택하세요' }]}
            >
              <DatePicker className="w-full" format="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item
              label="납품일"
              name="납품일"
              rules={[{ required: true, message: '납품일을 선택하세요' }]}
            >
              <DatePicker className="w-full" format="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item
              label="품목"
              name="품목"
              rules={[{ required: true, message: '품목을 선택하세요' }]}
            >
              <Select placeholder="품목 선택" showSearch>
                {products.map((p) => (
                  <Option key={p.id} value={p.name}>
                    {p.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="원산지"
              name="원산지"
              rules={[{ required: true, message: '원산지를 선택하세요' }]}
            >
              <Select placeholder="원산지 선택" showSearch>
                {origins.map((o) => (
                  <Option key={o.id} value={o.name}>
                    {o.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="규격"
              name="규격"
              rules={[{ required: true, message: '규격을 선택하세요' }]}
            >
              <Select placeholder="규격 선택" showSearch>
                {specifications.map((s) => (
                  <Option key={s.id} value={s.name}>
                    {s.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          {/* 수량/금액 정보 */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">수량/금액 정보</h3>

            <Form.Item
              label="주문수량"
              name="주문수량"
              rules={[
                { required: true, message: '주문수량을 입력하세요' },
                { type: 'number', min: 0, message: '0 이상 입력하세요' },
              ]}
            >
              <InputNumber
                className="w-full"
                placeholder="주문수량"
                addonAfter="통"
              />
            </Form.Item>
            <Form.Item
              label="주문중량(kg)"
              name="주문중량"
              rules={[
                { required: true, message: '주문중량을 입력하세요' },
                { type: 'number', min: 0, message: '0 이상 입력하세요' },
              ]}
            >
              <InputNumber
                className="w-full"
                placeholder="주문중량"
                addonAfter="kg"
              />
            </Form.Item>
            <Form.Item
              label="상차단가(원)"
              name="상차단가"
              rules={[
                { required: true, message: '상차단가를 입력하세요' },
                { type: 'number', min: 0, message: '0 이상 입력하세요' },
              ]}
            >
              <InputNumber
                className="w-full"
                placeholder="상차단가"
                formatter={(value) =>
                  value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
            <Form.Item
              label="도착단가(원)"
              name="도착단가"
              rules={[
                { required: true, message: '도착단가를 입력하세요' },
                { type: 'number', min: 0, message: '0 이상 입력하세요' },
              ]}
            >
              <InputNumber
                className="w-full"
                placeholder="도착단가"
                formatter={(value) =>
                  value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
            <Form.Item
              label="상차수수료율(%)"
              name="상차수수료율"
              rules={[
                { required: true, message: '상차수수료율을 입력하세요' },
                { type: 'number', min: 0, max: 100, message: '0-100 사이 입력' },
              ]}
            >
              <InputNumber
                className="w-full"
                placeholder="상차수수료율"
                step={0.1}
              />
            </Form.Item>
            <Form.Item
              label="통당운임단가(원)"
              name="통당운임단가"
              rules={[
                { required: true, message: '통당운임단가를 입력하세요' },
                { type: 'number', min: 0, message: '0 이상 입력하세요' },
              ]}
            >
              <InputNumber
                className="w-full"
                placeholder="통당운임단가"
                formatter={(value) =>
                  value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
            <Form.Item
              label="운송비 포함 여부"
              name="운송비포함여부"
              valuePropName="checked"
            >
              <FMSwitch onLabel="포함" offLabel="미포함" />
            </Form.Item>
          </div>

          {/* 파트너 정보 */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">파트너 정보</h3>

            <Form.Item
              label="셀러명"
              name="셀러명"
              rules={[{ required: true, message: '셀러명을 선택하세요' }]}
            >
              <Select placeholder="셀러 선택" showSearch>
                {sellerNames.map((name) => (
                  <Option key={name} value={name}>
                    {name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="바이어명"
              name="바이어명"
              rules={[{ required: true, message: '바이어명을 선택하세요' }]}
            >
              <Select placeholder="바이어 선택" showSearch>
                {buyerNames.map((name) => (
                  <Option key={name} value={name}>
                    {name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="드라이버명"
              name="드라이버명"
              rules={[{ required: true, message: '드라이버명을 선택하세요' }]}
            >
              <Select placeholder="드라이버 선택" showSearch>
                {drivers.map((d) => (
                  <Option key={d.id} value={d.name}>
                    {d.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          {/* 계산 결과 */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">계산 결과 (자동 계산)</h3>

            <div className="space-y-3">
              <div className="flex">
                <span className="w-1/5 font-medium text-gray-700">매출액:</span>
                <span className="w-4/5 text-gray-900">{calculatedFields.매출액?.toLocaleString() || '0'} 원</span>
              </div>
              <div className="flex">
                <span className="w-1/5 font-medium text-gray-700">매입액:</span>
                <span className="w-4/5 text-gray-900">{calculatedFields.매입액?.toLocaleString() || '0'} 원</span>
              </div>
              <div className="flex">
                <span className="w-1/5 font-medium text-gray-700">운송비:</span>
                <span className="w-4/5 text-gray-900">{calculatedFields.운송비?.toLocaleString() || '0'} 원</span>
              </div>
              <div className="flex">
                <span className="w-1/5 font-medium text-gray-700">거래손익:</span>
                <span className={`w-4/5 font-semibold ${
                  calculatedFields.거래손익 < 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {calculatedFields.거래손익?.toLocaleString() || '0'} 원
                </span>
              </div>
              {transaction.품목 === '넙치' && (
                <div className="flex">
                  <span className="w-1/5 font-medium text-gray-700">알파수익단가:</span>
                  <span className={`w-4/5 font-semibold ${
                    calculatedFields.알파수익단가 < 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {calculatedFields.알파수익단가?.toLocaleString() || '0'} 원
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 메모 */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">메모</h3>

            <Form.Item
              label="거래메모"
              name="거래메모"
              rules={[
                {
                  validator: (_, value) => {
                    if (calculatedFields.거래손익 < 0 && (!value || value.trim() === '')) {
                      return Promise.reject('거래손익이 마이너스인 경우 거래메모는 필수입니다');
                    }
                    return Promise.resolve();
                  }
                }
              ]}
            >
              <TextArea
                rows={4}
                placeholder={calculatedFields.거래손익 < 0 ? "거래손익이 마이너스입니다. 메모를 반드시 작성해주세요." : "거래 관련 메모를 입력하세요"}
                maxLength={500}
                showCount
              />
            </Form.Item>
          </div>
        </Form>

        {/* 하단 버튼 */}
        <div className="border-t border-gray-200 pt-6">
          <div className="grid grid-cols-3 gap-4">
            <FMButton
              variant="danger-outline"
              onClick={handleDelete}
              icon={<Trash2 className="w-4 h-4" />}
              className="w-full"
            >
              삭제하기
            </FMButton>
            <FMButton
              variant="primary"
              onClick={handleCancel}
              icon={<X className="w-4 h-4" />}
              className="w-full"
            >
              취소하기
            </FMButton>
            <FMButton
              variant="green"
              onClick={handleSave}
              icon={<Save className="w-4 h-4" />}
              className="w-full"
            >
              저장하기
            </FMButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionLedgerV2Edit;
