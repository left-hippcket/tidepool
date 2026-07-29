import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Select, Modal, Upload, Image } from 'antd';
import { MinusCircleOutlined, ArrowLeftOutlined, FileImageOutlined } from '@ant-design/icons';
import { Plus, Edit2, Save, X, Upload as UploadIcon } from 'lucide-react';
import { buyerGroups, buyerDetails, managers, territories, regions, productCategories, products } from '../data/mockData';
import { FMButton } from '../components/ui/FMButton';
import { FMInput } from '../components/ui/FMInput';
import { FMSelect } from '../components/ui/FMSelect';
import { FMTagInput } from '../components/ui/FMTagInput';
import toast from 'react-hot-toast';

function BuyerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [form] = Form.useForm();

  const buyerGroup = buyerGroups.find(b => b.id === parseInt(id));
  const detail = buyerDetails[id];

  // 주요품목분류 변경 시 주요품목 필터링
  const handleCategoryChange = (categories) => {
    setSelectedCategory(categories);
    if (!categories || categories.length === 0) {
      setAvailableProducts([]);
      form.setFieldsValue({ mainProducts: [] });
      return;
    }

    const filtered = products.filter(p =>
      categories.includes(p.categoryName)
    );
    setAvailableProducts(filtered);

    const currentProducts = form.getFieldValue('mainProducts') || [];
    const validProducts = currentProducts.filter(productName =>
      filtered.some(p => p.name === productName)
    );
    form.setFieldsValue({ mainProducts: validProducts });
  };

  // 사업자 추가
  const handleAddBusiness = () => {
    navigate(`/buyer/register?groupId=${id}&mode=add`);
  };

  // 편집 모드 진입
  const handleEditMode = () => {
    const mainCategoryArray = Array.isArray(buyerGroup.mainCategory)
      ? buyerGroup.mainCategory
      : [buyerGroup.mainCategory];

    form.setFieldsValue({
      name: buyerGroup.name,
      salesPerson: buyerGroup.salesPerson,
      mainCategory: mainCategoryArray,
      mainProducts: buyerGroup.mainProducts || [],
      territory: buyerGroup.territory,
      region: buyerGroup.region,
      status: buyerGroup.status,
      keymen: detail.keymen || [{}],
      kakaoGroupName: detail.kakaoGroupName,
      paymentCycle: detail.paymentCycle,
      complaintIntensity: detail.complaintIntensity,
      mainSuppliers: detail.mainSuppliers?.split(', ') || [],
      arrivalPricePolicy: detail.arrivalPricePolicy,
      priorityFactors: detail.priorityFactors || []
    });

    setSelectedCategory(mainCategoryArray);

    if (mainCategoryArray.length > 0) {
      const filtered = products.filter(p =>
        mainCategoryArray.includes(p.categoryName)
      );
      setAvailableProducts(filtered);
    }

    setEditMode(true);
  };

  // 저장
  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      if (values.status === 'inactive') {
        const activeBusinessCount = detail.businesses.filter(b => b.status === 'active').length;
        if (activeBusinessCount > 0) {
          Modal.error({
            title: '비활성화 불가',
            content: `소속된 사업자가 ${activeBusinessCount}개 활성 상태로 남아있어 그룹을 비활성화할 수 없습니다.`,
            onOk: () => {
              form.setFieldsValue({ status: 'active' });
            }
          });
          return;
        }
      }

      toast.success('바이어그룹 정보가 수정되었습니다.');
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

  // 클레임 강도 이모지
  const complaintEmojis = {
    '매우강함': '😡',
    '강함': '😠',
    '보통': '😐',
    '약함': '😊',
    '매우약함': '😄'
  };

  const addComplaintEmoji = (value) => {
    const emoji = complaintEmojis[value];
    return emoji ? `${emoji} ${value}` : value;
  };

  const priorityOptions = [
    { value: '로스', label: '💀 로스' },
    { value: '살밥', label: '🍚 살밥' },
    { value: '단가', label: '💰 단가' },
    { value: '색깔', label: '🎨 색깔' },
    { value: '외관', label: '✨ 외관' },
    { value: '평체', label: '📏 평체' },
    { value: '기타', label: '📝 기타' }
  ];

  const getPriorityEmoji = (value) => {
    const option = priorityOptions.find(opt => opt.value === value);
    return option ? option.label : value;
  };

  if (!buyerGroup || !detail) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="flex flex-col gap-6 w-full">
          <div className="flex flex-col gap-4">
            <div className="flex justify-start">
              <FMButton
                variant="indigo"
                icon={<ArrowLeftOutlined className="h-4 w-4" />}
                href="/buyer"
              >
                목록으로
              </FMButton>
            </div>
            <div className="text-lg text-gray-600">바이어 그룹을 찾을 수 없습니다.</div>
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
                href="/buyer"
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
            <h2 className="text-2xl font-bold text-gray-900">{buyerGroup.name}</h2>
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
              buyerGroup.status === 'active'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-700'
            }`}>
              {buyerGroup.status === 'active' ? '활성' : '비활성'}
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
        {/* 바이어그룹 기본 정보 */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">바이어그룹 기본 정보</h3>
            <span className="text-xs text-gray-500">최근 수정일: 2026-07-20</span>
          </div>

          {editMode ? (
            <>
              <Form.Item
                name="name"
                label="바이어그룹명"
                rules={[{ required: true, message: '바이어그룹명을 입력해주세요' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="salesPerson"
                label="담당영업사원"
                rules={[{ required: true, message: '담당영업사원을 선택해주세요' }]}
              >
                <Select>
                  {managers.map(m => (
                    <Select.Option key={m} value={m}>{m}</Select.Option>
                  ))}
                </Select>
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
                rules={[{ required: true, message: '상세지역을 선택해주세요' }]}
              >
                <Select>
                  {regions
                    .filter(r => r.status === 'active')
                    .sort((a, b) => a.displayOrder - b.displayOrder)
                    .map(r => (
                      <Select.Option key={r.id} value={r.name}>{r.name}</Select.Option>
                    ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="mainCategory"
                label="주요품목분류"
                rules={[{ required: true, message: '주요품목분류를 선택해주세요' }]}
              >
                <FMSelect
                  value={form.getFieldValue('mainCategory') || []}
                  onChange={(value) => {
                    form.setFieldsValue({ mainCategory: value });
                    handleCategoryChange(value);
                  }}
                  options={productCategories.map(c => ({
                    value: c.name,
                    label: c.name
                  }))}
                  placeholder="품목분류 선택 (복수 선택 가능)"
                  isSearchable={true}
                  isMulti={true}
                />
              </Form.Item>

              <Form.Item
                name="mainProducts"
                label="주요품목"
              >
                <FMSelect
                  value={form.getFieldValue('mainProducts') || []}
                  onChange={(value) => form.setFieldsValue({ mainProducts: value })}
                  options={availableProducts.map(p => ({
                    value: p.name,
                    label: p.name
                  }))}
                  placeholder="주요품목 선택 (선택사항)"
                  isSearchable={true}
                  isMulti={true}
                  isDisabled={selectedCategory.length === 0}
                />
              </Form.Item>

              <Form.Item
                name="status"
                label="상태"
                rules={[{ required: true, message: '상태를 선택해주세요' }]}
              >
                <Select>
                  <Select.Option value="active">활성</Select.Option>
                  <Select.Option value="inactive">비활성</Select.Option>
                </Select>
              </Form.Item>
            </>
          ) : (
            <div className="space-y-3">
              <div className="flex">
                <span className="w-1/5 font-medium text-gray-700">바이어그룹명:</span>
                <span className="w-4/5 text-gray-900">{buyerGroup.name}</span>
              </div>
              <div className="flex">
                <span className="w-1/5 font-medium text-gray-700">담당영업사원:</span>
                <span className="w-4/5 text-gray-900">{buyerGroup.salesPerson}</span>
              </div>
              <div className="flex">
                <span className="w-1/5 font-medium text-gray-700">사업권역:</span>
                <span className="w-4/5 text-gray-900">{buyerGroup.territory}</span>
              </div>
              <div className="flex">
                <span className="w-1/5 font-medium text-gray-700">상세지역:</span>
                <span className="w-4/5 text-gray-900">{buyerGroup.region}</span>
              </div>
              <div className="flex">
                <span className="w-1/5 font-medium text-gray-700">주요품목분류:</span>
                <span className="w-4/5 text-gray-900">
                  {Array.isArray(buyerGroup.mainCategory)
                    ? buyerGroup.mainCategory.join(', ')
                    : buyerGroup.mainCategory}
                </span>
              </div>
              <div className="flex">
                <span className="w-1/5 font-medium text-gray-700">주요품목:</span>
                <span className="w-4/5 text-gray-900">
                  {buyerGroup.mainProducts?.join(', ') || '-'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 키맨 정보 */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">키맨 정보</h3>
            <span className="text-xs text-gray-500">최근 수정일: 2026-07-18</span>
          </div>

          {editMode ? (
            <Form.List name="keymen" initialValue={detail.keymen || [{}]}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }, index) => (
                    <div key={key} className="mb-6 last:mb-0">
                      {index > 0 && <div className="my-6 border-t border-gray-200"></div>}
                      <div className="flex items-center gap-2 mb-4">
                        <h5 className="text-sm font-medium text-gray-700">키맨 #{index + 1}</h5>
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
                        name={[name, 'name']}
                        label="성명"
                      >
                        <Input placeholder="홍길동" />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'phone']}
                        label="연락처"
                      >
                        <Input placeholder="010-1234-5678" />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'role']}
                        label="역할"
                      >
                        <Input placeholder="예: 대표, 구매담당" />
                      </Form.Item>
                    </div>
                  ))}
                  <div className="flex justify-end mt-4">
                    <FMButton
                      variant="green"
                      icon={<Plus className="h-4 w-4" />}
                      onClick={() => add()}
                    >
                      키맨 추가
                    </FMButton>
                  </div>
                </>
              )}
            </Form.List>
          ) : (
            detail.keymen && detail.keymen.length > 0 ? (
              <div className="space-y-4">
                {detail.keymen.map((keyman, index) => (
                  <div key={index} className="p-4 rounded-lg bg-gray-50">
                    <div className="space-y-2">
                      <div className="flex">
                        <span className="w-1/5 font-medium text-gray-700">성명:</span>
                        <span className="w-4/5 text-gray-900">{keyman.name}</span>
                      </div>
                      <div className="flex">
                        <span className="w-1/5 font-medium text-gray-700">연락처:</span>
                        <span className="w-4/5 text-gray-900">{keyman.phone}</span>
                      </div>
                      {keyman.role && (
                        <div className="flex">
                          <span className="w-1/5 font-medium text-gray-700">역할:</span>
                          <span className="w-4/5 text-gray-900">{keyman.role}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500">등록된 키맨 정보가 없습니다.</div>
            )
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
                <Input placeholder="[노량진]소라수산 거래방" />
              </Form.Item>

              <Form.Item name="paymentCycle" label="결제주기">
                <Input placeholder="예: 월 2회 정산" />
              </Form.Item>

              <Form.Item name="complaintIntensity" label="클레임 강도">
                <Select>
                  <Select.Option value="매우강함">매우강함</Select.Option>
                  <Select.Option value="강함">강함</Select.Option>
                  <Select.Option value="보통">보통</Select.Option>
                  <Select.Option value="약함">약함</Select.Option>
                  <Select.Option value="매우약함">매우약함</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item name="mainSuppliers" label="메인공급처">
                <FMTagInput
                  value={form.getFieldValue('mainSuppliers') || []}
                  onChange={(value) => form.setFieldsValue({ mainSuppliers: value })}
                  placeholder="공급처명 입력 후 엔터키"
                />
              </Form.Item>

              <Form.Item name="arrivalPricePolicy" label="도착단가 정책">
                <Input placeholder="예: 상차단가 + 800원" />
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
                <span className="w-1/5 font-medium text-gray-700">클레임 강도:</span>
                <span className="w-4/5 text-gray-900">
                  {addComplaintEmoji(detail.complaintIntensity)}
                </span>
              </div>
              <div className="flex">
                <span className="w-1/5 font-medium text-gray-700">메인공급처:</span>
                <span className="w-4/5 text-gray-900">{detail.mainSuppliers || '-'}</span>
              </div>
              <div className="flex">
                <span className="w-1/5 font-medium text-gray-700">도착단가 정책:</span>
                <span className="w-4/5 text-gray-900">{detail.arrivalPricePolicy || '-'}</span>
              </div>
            </div>
          )}
        </div>

        {/* 중요 평가 요소 */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">중요 평가 요소 (1-7순위)</h3>
            <span className="text-xs text-gray-500">최근 수정일: 2026-07-10</span>
          </div>

          {editMode ? (
            <>
              {[1, 2, 3, 4, 5, 6, 7].map(num => (
                <Form.Item
                  key={num}
                  name={['priorityFactors', num - 1]}
                  label={`${num}순위`}
                >
                  <Select placeholder="선택" allowClear>
                    {priorityOptions.map(opt => (
                      <Select.Option key={opt.value} value={opt.value}>{opt.label}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              ))}
            </>
          ) : (
            <div className="space-y-3">
              {detail.priorityFactors && detail.priorityFactors.length > 0 ? (
                detail.priorityFactors.map((factor, index) => (
                  <div key={index} className="flex">
                    <span className="w-1/5 font-medium text-gray-700">{index + 1}순위:</span>
                    <span className="w-4/5 text-gray-900">{getPriorityEmoji(factor)}</span>
                  </div>
                ))
              ) : (
                <div className="text-gray-500">등록된 평가 요소가 없습니다.</div>
              )}
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
                  <h4 className="text-base font-semibold text-gray-900">{business.buyerName}</h4>
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
                    <span className="w-1/4 font-medium text-gray-700">바이어명:</span>
                    <Input defaultValue={business.buyerName} className="w-3/4" />
                  </div>
                  <div className="flex">
                    <span className="w-1/4 font-medium text-gray-700">ticker:</span>
                    <Input defaultValue={business.buyerId} className="w-3/4" disabled />
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
                    <span className="w-1/4 font-medium text-gray-700">하차지주소:</span>
                    <Input defaultValue={business.unloadingAddress} className="w-3/4" />
                  </div>
                  <div className="flex">
                    <span className="w-1/4 font-medium text-gray-700">세금계산서 이메일:</span>
                    <Input defaultValue={business.taxInvoiceEmail} className="w-3/4" />
                  </div>
                  <div className="flex">
                    <span className="w-1/4 font-medium text-gray-700">상태:</span>
                    <Select defaultValue={business.status} className="w-3/4">
                      <Select.Option value="active">활성</Select.Option>
                      <Select.Option value="inactive">비활성</Select.Option>
                    </Select>
                  </div>

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
                    <span className="w-3/4 text-gray-900">{business.buyerId}</span>
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
                    <span className="w-1/4 font-medium text-gray-700">하차지주소:</span>
                    <span className="w-3/4 text-gray-900">{business.unloadingAddress || '-'}</span>
                  </div>
                  <div className="flex">
                    <span className="w-1/4 font-medium text-gray-700">세금계산서 이메일:</span>
                    <span className="w-3/4 text-gray-900">{business.taxInvoiceEmail || '-'}</span>
                  </div>
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

export default BuyerDetail;
