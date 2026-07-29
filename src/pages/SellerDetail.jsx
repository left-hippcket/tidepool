import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Select, InputNumber, Modal, Upload, Image } from 'antd';
import { MinusCircleOutlined, ArrowLeftOutlined, FileImageOutlined } from '@ant-design/icons';
import { Plus, Edit2, Save, X, Upload as UploadIcon } from 'lucide-react';
import { sellerGroups, sellerDetails, managers, territories, regions, productCategories, products } from '../data/mockData';
import { FMButton } from '../components/ui/FMButton';
import { FMInput } from '../components/ui/FMInput';
import { FMSelect } from '../components/ui/FMSelect';
import { FMTagInput } from '../components/ui/FMTagInput';
import { FMSwitch } from '../components/ui/FMSwitch';
import toast from 'react-hot-toast';

function SellerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [form] = Form.useForm();

  const sellerGroup = sellerGroups.find(s => s.id === parseInt(id));
  const detail = sellerDetails[id];

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

    // 기존 선택된 주요품목 중 현재 카테고리에 속하지 않는 것 제거
    const currentProducts = form.getFieldValue('mainProducts') || [];
    const validProducts = currentProducts.filter(productName =>
      filtered.some(p => p.name === productName)
    );
    form.setFieldsValue({ mainProducts: validProducts });
  };

  // 사업자 추가
  const handleAddBusiness = () => {
    navigate(`/seller/register?groupId=${id}&mode=add`);
  };

  // 편집 모드 진입
  const handleEditMode = () => {
    const mainCategoryArray = Array.isArray(sellerGroup.mainCategory)
      ? sellerGroup.mainCategory
      : [sellerGroup.mainCategory];

    form.setFieldsValue({
      name: sellerGroup.name,
      manager: sellerGroup.manager,
      mainCategory: mainCategoryArray,
      mainProducts: sellerGroup.mainProducts || [],
      territory: sellerGroup.territory,
      region: sellerGroup.region,
      commissionRate: sellerGroup.commissionRate,
      status: sellerGroup.status,
      keymen: detail.keymen || [{}],
      financial: detail.qualitativeRatings.financial,
      quality: detail.qualitativeRatings.quality,
      priceCompetitive: detail.qualitativeRatings.priceCompetitive,
      claimCooperation: detail.qualitativeRatings.claimCooperation,
      lossProvision: detail.qualitativeRatings.lossProvision,
      farmArea: detail.additionalInfo.farmArea,
      annualProduction: detail.additionalInfo.annualProduction,
      mainDistributors: detail.additionalInfo.mainDistributors?.split(', ') || []
    });

    setSelectedCategory(mainCategoryArray);

    // 품목분류에 맞는 품목 필터링
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
      toast.success('셀러그룹 정보가 수정되었습니다.');
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

  // 상태 변경 핸들러
  const handleStatusChange = (value) => {
    if (value === 'inactive') {
      const hasActiveBusiness = detail.businesses.some(b => b.status === 'active');
      if (hasActiveBusiness) {
        Modal.warning({
          title: '비활성화 불가',
          content: '소속 사업자 중 활성 상태인 사업자가 있습니다. 모든 사업자를 먼저 비활성화해주세요.',
          onOk: () => {
            form.setFieldsValue({ status: 'active' });
          }
        });
      }
    }
  };



  const qualitativeLabels = {
    financial: '재무상황',
    quality: '품질수준',
    priceCompetitive: '가격경쟁력',
    claimCooperation: '클레임협조도',
    lossProvision: '로스제공'
  };

  const qualitativeEmojis = {
    '최상': '👑',
    '좋음': '👍',
    '보통': '😐',
    '나쁨': '👎',
    '높음': '🔥',
    '낮음': '❄️',
    '넉넉함': '💯',
    '적당함': '⭐',
    '부족함': '⚠️'
  };

  const addEmoji = (value) => {
    const emoji = qualitativeEmojis[value];
    return emoji ? `${emoji} ${value}` : value;
  };

  if (!sellerGroup || !detail) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="flex flex-col gap-6 w-full">
          <div className="flex flex-col gap-4">
            <div className="flex justify-start">
              <FMButton
                variant="indigo"
                icon={<ArrowLeftOutlined className="h-4 w-4" />}
                href="/seller"
              >
                목록으로
              </FMButton>
            </div>
            <div className="text-lg text-gray-600">셀러 그룹을 찾을 수 없습니다.</div>
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
                href="/seller"
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
            <h2 className="text-2xl font-bold text-gray-900">{sellerGroup.name}</h2>
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
              sellerGroup.status === 'active'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-700'
            }`}>
              {sellerGroup.status === 'active' ? '활성' : '비활성'}
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
        {/* 셀러그룹 기본 정보 */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">셀러그룹 기본 정보</h3>
            <span className="text-xs text-gray-500">최근 수정일: 2026-07-20</span>
          </div>

          {editMode ? (
            <>
              <Form.Item
                name="name"
                label="셀러그룹명"
                rules={[{ required: true, message: '셀러그룹명을 입력해주세요' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="manager"
                label="소싱담당자"
                rules={[{ required: true, message: '소싱담당자를 선택해주세요' }]}
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
                <Select>
                  {productCategories.map(c => (
                    <Select.Option key={c.id} value={c.name}>{c.name}</Select.Option>
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
                name="commissionRate"
                label="상차 수수료율(%)"
                rules={[{ required: true, message: '수수료율을 입력해주세요' }]}
              >
                <InputNumber style={{ width: '100%' }} min={0} max={100} step={0.1} />
              </Form.Item>

              <Form.Item
                label="상태"
              >
                <FMSwitch
                  checked={form.getFieldValue('status') === 'active'}
                  onChange={(checked) => {
                    const newStatus = checked ? 'active' : 'inactive';
                    form.setFieldsValue({ status: newStatus });
                    handleStatusChange(newStatus);
                  }}
                  onLabel="활성"
                  offLabel="비활성"
                />
              </Form.Item>
            </>
          ) : (
            <div className="space-y-3">
              <div className="flex">
                <span className="w-1/5 font-medium text-gray-700">셀러그룹명:</span>
                <span className="w-4/5 text-gray-900">{sellerGroup.name}</span>
              </div>
              <div className="flex">
                <span className="w-1/5 font-medium text-gray-700">소싱담당자:</span>
                <span className="w-4/5 text-gray-900">{sellerGroup.manager}</span>
              </div>
              <div className="flex">
                <span className="w-1/5 font-medium text-gray-700">사업권역:</span>
                <span className="w-4/5 text-gray-900">{sellerGroup.territory}</span>
              </div>
              <div className="flex">
                <span className="w-1/5 font-medium text-gray-700">상세지역:</span>
                <span className="w-4/5 text-gray-900">{sellerGroup.region}</span>
              </div>
              <div className="flex">
                <span className="w-1/5 font-medium text-gray-700">주요품목분류:</span>
                <span className="w-4/5 text-gray-900">
                  {Array.isArray(sellerGroup.mainCategory)
                    ? sellerGroup.mainCategory.join(', ')
                    : sellerGroup.mainCategory}
                </span>
              </div>
              <div className="flex">
                <span className="w-1/5 font-medium text-gray-700">주요품목:</span>
                <span className="w-4/5 text-gray-900">
                  {sellerGroup.mainProducts?.join(', ') || '-'}
                </span>
              </div>
              <div className="flex">
                <span className="w-1/5 font-medium text-gray-700">상차 수수료율:</span>
                <span className="w-4/5 text-gray-900">{sellerGroup.commissionRate}%</span>
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
                        <Input placeholder="예: 대표, 영업담당" />
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
              <div className="text-sm text-gray-500">등록된 키맨 정보가 없습니다.</div>
            )
          )}
        </div>

        {/* 정성평가 */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">정성평가</h3>
            <span className="text-xs text-gray-500">최근 수정일: 2026-07-15</span>
          </div>

          {editMode ? (
            <>

            <Form.Item name="financial" label="재무상황">
              <Select>
                <Select.Option value="최상">최상</Select.Option>
                <Select.Option value="좋음">좋음</Select.Option>
                <Select.Option value="보통">보통</Select.Option>
                <Select.Option value="나쁨">나쁨</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="quality" label="품질수준">
              <Select>
                <Select.Option value="최상">최상</Select.Option>
                <Select.Option value="좋음">좋음</Select.Option>
                <Select.Option value="보통">보통</Select.Option>
                <Select.Option value="나쁨">나쁨</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="priceCompetitive" label="가격경쟁력">
              <Select>
                <Select.Option value="높음">높음</Select.Option>
                <Select.Option value="보통">보통</Select.Option>
                <Select.Option value="낮음">낮음</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="claimCooperation" label="클레임협조도">
              <Select>
                <Select.Option value="높음">높음</Select.Option>
                <Select.Option value="보통">보통</Select.Option>
                <Select.Option value="낮음">낮음</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="lossProvision" label="로스제공">
              <Select>
                <Select.Option value="넉넉함">넉넉함</Select.Option>
                <Select.Option value="적당함">적당함</Select.Option>
                <Select.Option value="부족함">부족함</Select.Option>
              </Select>
            </Form.Item>
            </>
          ) : (
            <div className="space-y-3">
              {Object.entries(qualitativeLabels).map(([key, label]) => (
                <div key={key} className="flex">
                  <span className="w-1/5 font-medium text-gray-700">{label}:</span>
                  <span className="w-4/5 text-gray-900">
                    {addEmoji(detail.qualitativeRatings[key])}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 기타 정보 */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">기타 정보</h3>
            <span className="text-xs text-gray-500">최근 수정일: 2026-07-10</span>
          </div>

          {editMode ? (
            <>

            <Form.Item name="farmArea" label="양식장 면적">
              <Input placeholder="예: 10,000평" />
            </Form.Item>

            <Form.Item name="annualProduction" label="연간 생산량">
              <Input placeholder="예: 150톤" />
            </Form.Item>

            <Form.Item name="mainDistributors" label="주요 납품처">
              <FMTagInput
                value={form.getFieldValue('mainDistributors') || []}
                onChange={(value) => form.setFieldsValue({ mainDistributors: value })}
                placeholder="납품처명 입력 후 엔터키"
              />
            </Form.Item>
            </>
          ) : (
            <div className="space-y-3">
              <div className="flex">
                <span className="w-1/5 font-medium text-gray-700">양식장 면적:</span>
                <span className="w-4/5 text-gray-900">{detail.additionalInfo.farmArea || '-'}</span>
              </div>
              <div className="flex">
                <span className="w-1/5 font-medium text-gray-700">연간 생산량:</span>
                <span className="w-4/5 text-gray-900">{detail.additionalInfo.annualProduction || '-'}</span>
              </div>
              <div className="flex">
                <span className="w-1/5 font-medium text-gray-700">주요 납품처:</span>
                <span className="w-4/5 text-gray-900">{detail.additionalInfo.mainDistributors || '-'}</span>
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
          {detail.businesses.map((business, businessIndex) => (
            <div key={business.id} className="rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <h4 className="text-base font-semibold text-gray-900">{business.sellerName}</h4>
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
                    <span className="w-1/4 font-medium text-gray-700">셀러명:</span>
                    <Input defaultValue={business.sellerName} className="w-3/4" />
                  </div>
                  <div className="flex">
                    <span className="w-1/4 font-medium text-gray-700">ticker:</span>
                    <Input defaultValue={business.sellerId} className="w-3/4" disabled />
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
                    <span className="w-1/4 font-medium text-gray-700">상차지주소:</span>
                    <Input defaultValue={business.loadingAddress} className="w-3/4" />
                  </div>
                  <div className="flex items-center">
                    <span className="w-1/4 font-medium text-gray-700">상태:</span>
                    <div className="w-3/4">
                      <FMSwitch
                        checked={business.status === 'active'}
                        onChange={(checked) => {
                          // 상태 변경 로직 (실제 구현 시 업데이트 필요)
                        }}
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
                          className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100"
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
                            className="inline-flex items-center gap-1 rounded border font-semibold bg-blue-100 border-blue-300 text-blue-600 px-2.5 py-1 text-sm"
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
                    <span className="w-3/4 text-gray-900">{business.sellerId}</span>
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
                    <span className="w-1/4 font-medium text-gray-700">상차지주소:</span>
                    <span className="w-3/4 text-gray-900">{business.loadingAddress || '-'}</span>
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

export default SellerDetail;
