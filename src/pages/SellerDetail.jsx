import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Form, Input, Select, InputNumber, message, Modal, Tag, Image, Upload, Space } from 'antd';
import { ArrowLeftOutlined, EditOutlined, SaveOutlined, CloseOutlined, PlusOutlined, FileImageOutlined, MinusCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { sellerGroups, sellerDetails, managers, territories, productCategories } from '../data/mockData';
import { Column } from '@ant-design/charts';

function SellerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [periodFilter, setPeriodFilter] = useState('3M');
  const [editMode, setEditMode] = useState(false);
  const [editingBusinessId, setEditingBusinessId] = useState(null);
  const [form] = Form.useForm();
  const [businessForm] = Form.useForm();

  const sellerGroup = sellerGroups.find(s => s.id === parseInt(id));
  const detail = sellerDetails[id];

  // 사업자 추가
  const handleAddBusiness = () => {
    navigate(`/seller/register?groupId=${id}&mode=add`);
  };

  // 편집 모드 진입
  const handleEditGroup = () => {
    form.setFieldsValue({
      name: sellerGroup.name,
      manager: sellerGroup.manager,
      mainCategory: sellerGroup.mainCategory,
      territory: sellerGroup.territory,
      region: sellerGroup.region,
      commissionRate: sellerGroup.commissionRate,
      status: sellerGroup.status,
      keymen: detail.keymen,
      financial: detail.qualitativeRatings.financial,
      quality: detail.qualitativeRatings.quality,
      priceCompetitive: detail.qualitativeRatings.priceCompetitive,
      claimCooperation: detail.qualitativeRatings.claimCooperation,
      lossProvision: detail.qualitativeRatings.lossProvision,
      farmArea: detail.additionalInfo.farmArea,
      annualProduction: detail.additionalInfo.annualProduction,
      mainDistributors: detail.additionalInfo.mainDistributors
    });
    setEditMode(true);
  };

  // 저장
  const handleSaveGroup = async () => {
    try {
      const values = await form.validateFields();
      message.success('셀러그룹 정보가 수정되었습니다.');
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

  // 사업자 편집 모드 진입
  const handleEditBusiness = (business) => {
    businessForm.setFieldsValue({
      sellerName: business.sellerName,
      businessNumber: business.businessNumber,
      sellerId: business.sellerId,
      businessName: business.businessName,
      representative: business.representative,
      businessAddress: business.businessAddress,
      loadingAddress: business.loadingAddress,
      status: business.status,
      bankAccounts: business.bankAccounts || [{ bank: '', accountNumber: '', holder: '', isPrimary: false }],
      certificate: business.hasCertificate ? [{ uid: '-1', name: '사업자등록증.pdf', status: 'done' }] : []
    });
    setEditingBusinessId(business.id);
  };

  // 사업자 저장
  const handleSaveBusiness = async (businessId) => {
    try {
      const values = await businessForm.validateFields();
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

  // P2 샘플 데이터: 기간별 실적
  const samplePerformanceData = {
    '3M': [
      { period: '4월상순', purchase: 120000000, profit: 5400000, weight: 48, specs: '500g, 700g, 1.0kg', buyers: '노량진수산, 가락시장' },
      { period: '4월중순', purchase: 135000000, profit: 6100000, weight: 54, specs: '500g, 700g, 1.0kg', buyers: '노량진수산' },
      { period: '4월하순', purchase: 110000000, profit: 4950000, weight: 44, specs: '500g, 700g', buyers: '가락시장' },
      { period: '5월상순', purchase: 145000000, profit: 6525000, weight: 58, specs: '500g, 700g, 1.0kg, 1.2kg', buyers: '노량진수산, 가락시장, 부산공판장' },
      { period: '5월중순', purchase: 130000000, profit: 5850000, weight: 52, specs: '500g, 700g, 1.0kg', buyers: '노량진수산, 가락시장' },
      { period: '5월하순', purchase: 125000000, profit: 5625000, weight: 50, specs: '500g, 700g', buyers: '노량진수산' },
      { period: '6월상순', purchase: 150000000, profit: 6750000, weight: 60, specs: '500g, 700g, 1.0kg', buyers: '노량진수산, 가락시장' },
      { period: '6월중순', purchase: 140000000, profit: 6300000, weight: 56, specs: '500g, 700g, 1.0kg', buyers: '가락시장' },
      { period: '6월하순', purchase: 135000000, profit: 6075000, weight: 54, specs: '500g, 1.0kg', buyers: '노량진수산, 부산공판장' },
    ],
    'thisYear': [
      { period: '1월', purchase: 380000000, profit: 17100000, weight: 152, specs: '500g, 700g, 1.0kg', buyers: '노량진수산, 가락시장' },
      { period: '2월', purchase: 360000000, profit: 16200000, weight: 144, specs: '500g, 700g', buyers: '노량진수산' },
      { period: '3월', purchase: 410000000, profit: 18450000, weight: 164, specs: '500g, 700g, 1.0kg, 1.2kg', buyers: '노량진수산, 가락시장, 부산공판장' },
      { period: '4월', purchase: 365000000, profit: 16425000, weight: 146, specs: '500g, 700g, 1.0kg', buyers: '노량진수산, 가락시장' },
      { period: '5월', purchase: 400000000, profit: 18000000, weight: 160, specs: '500g, 700g, 1.0kg', buyers: '노량진수산, 가락시장' },
      { period: '6월', purchase: 425000000, profit: 19125000, weight: 170, specs: '500g, 700g, 1.0kg, 1.2kg', buyers: '노량진수산, 가락시장, 부산공판장' },
      { period: '7월', purchase: 180000000, profit: 8100000, weight: 72, specs: '500g, 700g', buyers: '노량진수산' },
    ]
  };

  const currentData = samplePerformanceData[periodFilter] || samplePerformanceData['3M'];

  const chartData = currentData.map(d => ({
    period: d.period,
    value: d.purchase / 100000000,
    type: '매입액'
  }));

  const chartConfig = {
    data: chartData,
    xField: 'period',
    yField: 'value',
    color: '#9CA3AF',
    columnStyle: {
      fill: '#9CA3AF',
    },
    label: {
      position: 'top',
      style: { fill: '#6B7280', fontSize: 10 }
    },
    xAxis: {
      label: { autoRotate: false, style: { fill: '#6B7280' } }
    },
    yAxis: {
      title: { text: '매입액 (억원)', style: { fill: '#6B7280' } },
      label: { style: { fill: '#6B7280' } }
    },
  };

  const qualitativeLabels = {
    financial: '재무상황',
    quality: '품질수준',
    priceCompetitive: '가격경쟁력',
    claimCooperation: '클레임협조도',
    lossProvision: '로스제공'
  };

  // 정성평가 값에 이모지 추가
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
      <div className="min-h-screen bg-[#f9fafb] p-6">
        <button
          onClick={() => navigate('/seller')}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ArrowLeftOutlined />
          목록으로 돌아가기
        </button>
        <div className="mt-8 text-lg text-gray-600">셀러 그룹을 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] p-4 md:p-6">
      {/* 헤더 */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/seller')}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeftOutlined />
            목록으로
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{sellerGroup.name}</h1>
        </div>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          sellerGroup.status === 'active'
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-gray-50 text-gray-700 border border-gray-200'
        }`}>
          {sellerGroup.status === 'active' ? '활성' : '비활성'}
        </span>
      </div>

      {/* 섹션 1: 셀러그룹 기본 정보 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">셀러그룹 기본 정보</h2>
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
              <Form.Item label="셀러그룹명" name="name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item label="소싱담당자" name="manager" rules={[{ required: true }]}>
                <Select>
                  {managers.map(m => (
                    <Select.Option key={m} value={m}>{m}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="주요품목분류" name="mainCategory" rules={[{ required: true }]}>
                <Select>
                  {productCategories.map(c => (
                    <Select.Option key={c.id} value={c.name}>{c.name}</Select.Option>
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
                  <Select.Option value="인천">인천</Select.Option>
                  <Select.Option value="완도/진도">완도/진도</Select.Option>
                  <Select.Option value="통영">통영</Select.Option>
                  <Select.Option value="거제">거제</Select.Option>
                  <Select.Option value="고흥">고흥</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="상차 수수료율(%)" name="commissionRate" rules={[{ required: true }]}>
                <InputNumber style={{ width: '100%' }} min={0} max={100} step={0.1} />
              </Form.Item>
              <Form.Item label="상태" name="status" rules={[{ required: true }]}>
                <Select onChange={handleStatusChange}>
                  <Select.Option value="active">활성</Select.Option>
                  <Select.Option value="inactive">비활성</Select.Option>
                </Select>
              </Form.Item>
            </div>

            {/* 키맨 정보 편집 */}
            <div className="mt-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">키맨 정보</h3>
              <Form.List name="keymen">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map((field) => (
                      <div key={field.key} className="bg-gray-50 rounded-lg border border-gray-200 p-4 mb-3">
                        <div className="grid grid-cols-3 gap-4">
                          <Form.Item
                            {...field}
                            name={[field.name, 'name']}
                            label="이름"
                            rules={[{ required: true, message: '이름을 입력해주세요' }]}
                          >
                            <Input placeholder="김철수" />
                          </Form.Item>
                          <Form.Item
                            {...field}
                            name={[field.name, 'position']}
                            label="직책"
                          >
                            <Input placeholder="대표" />
                          </Form.Item>
                          <Form.Item
                            {...field}
                            name={[field.name, 'phone']}
                            label="연락처"
                            rules={[{ pattern: /^010-\d{4}-\d{4}$/, message: '010-XXXX-XXXX 형식' }]}
                          >
                            <Input placeholder="010-1234-5678" />
                          </Form.Item>
                        </div>
                        {fields.length > 1 && (
                          <Button onClick={() => remove(field.name)} icon={<MinusCircleOutlined />} size="small">
                            삭제
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button onClick={() => add()} icon={<PlusOutlined />} block type="dashed">
                      키맨 추가
                    </Button>
                  </>
                )}
              </Form.List>
            </div>

            {/* 정성적 평가 편집 */}
            <div className="mt-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">정성적 평가</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item label="재무상황" name="financial">
                  <Select>
                    <Select.Option value="최상">최상</Select.Option>
                    <Select.Option value="좋음">좋음</Select.Option>
                    <Select.Option value="보통">보통</Select.Option>
                    <Select.Option value="나쁨">나쁨</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item label="품질수준" name="quality">
                  <Select>
                    <Select.Option value="최상">최상</Select.Option>
                    <Select.Option value="좋음">좋음</Select.Option>
                    <Select.Option value="보통">보통</Select.Option>
                    <Select.Option value="나쁨">나쁨</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item label="가격경쟁력" name="priceCompetitive">
                  <Select>
                    <Select.Option value="높음">높음</Select.Option>
                    <Select.Option value="보통">보통</Select.Option>
                    <Select.Option value="낮음">낮음</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item label="클레임협조도" name="claimCooperation">
                  <Select>
                    <Select.Option value="좋음">좋음</Select.Option>
                    <Select.Option value="보통">보통</Select.Option>
                    <Select.Option value="나쁨">나쁨</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item label="로스제공" name="lossProvision">
                  <Select>
                    <Select.Option value="넉넉함">넉넉함</Select.Option>
                    <Select.Option value="적당함">적당함</Select.Option>
                    <Select.Option value="부족함">부족함</Select.Option>
                  </Select>
                </Form.Item>
              </div>
            </div>

            {/* 기타 정보 편집 */}
            <div className="mt-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">기타 정보</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Form.Item label="양식장 수면적(평)" name="farmArea">
                  <Input placeholder="15000" />
                </Form.Item>
                <Form.Item label="연간생산량(톤)" name="annualProduction">
                  <Input placeholder="120" />
                </Form.Item>
                <Form.Item label="메인 유통사" name="mainDistributors">
                  <Input placeholder="노량진수산, 가락시장" />
                </Form.Item>
              </div>
            </div>
          </Form>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-sm text-gray-500 mb-1">셀러그룹명</div>
                <div className="text-base font-semibold text-gray-900">{sellerGroup.name}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">소싱담당자</div>
                <div className="text-base font-semibold text-gray-900">{sellerGroup.manager}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">주요품목분류</div>
                <div className="text-base font-semibold text-gray-900">{sellerGroup.mainCategory}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">사업권역</div>
                <div className="text-base font-semibold text-gray-900">{sellerGroup.territory}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">상세지역</div>
                <div className="text-base font-semibold text-gray-900">{sellerGroup.region}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">상차 수수료율</div>
                <div className="text-base font-semibold text-gray-900">{sellerGroup.commissionRate}%</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">사업자 수</div>
                <div className="text-base font-semibold text-gray-900">{sellerGroup.businessCount}개</div>
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

          {/* 정성적 평가 */}
          <div className="mt-8">
            <h3 className="text-base font-semibold text-gray-900 mb-4">정성적 평가</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(detail.qualitativeRatings).map(([key, value]) => (
                <div key={key} className="bg-blue-50 rounded-lg p-4 text-center border border-blue-100">
                  <div className="text-xs text-blue-600 mb-2">{qualitativeLabels[key]}</div>
                  <div className="text-base font-bold text-blue-700">{addEmoji(value)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 기타 정보 */}
          <div className="mt-8">
            <h3 className="text-base font-semibold text-gray-900 mb-4">기타 정보</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-sm text-gray-500 mb-1">양식장 수면적</div>
                <div className="text-base font-semibold text-gray-900">{detail.additionalInfo.farmArea}평</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">연간생산량</div>
                <div className="text-base font-semibold text-gray-900">{detail.additionalInfo.annualProduction}톤</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">메인 유통사</div>
                <div className="text-base font-semibold text-gray-900">{detail.additionalInfo.mainDistributors}</div>
              </div>
            </div>
          </div>
          </>
        )}
      </div>

      {/* 섹션 2: 소속 사업자 정보 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">소속 사업자 정보</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {detail.businesses.map((business, index) => (
            <div key={business.id} className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-white px-4 py-3 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-gray-900">{business.sellerName}</span>
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

                {editingBusinessId === business.id ? (
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
                      onClick={() => handleCancelBusinessEdit()}
                    >
                      취소
                    </Button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEditBusiness(business)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <EditOutlined />
                    수정
                  </button>
                )}
              </div>

              {editingBusinessId === business.id ? (
                <div className="p-4">
                  <Form form={businessForm} layout="vertical">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Form.Item label="셀러명" name="sellerName" className="md:col-span-2">
                        <Input maxLength={20} />
                      </Form.Item>
                      <Form.Item label="사업자등록번호" name="businessNumber">
                        <Input disabled className="bg-gray-100" />
                      </Form.Item>
                      <Form.Item
                        label="ticker"
                        name="sellerId"
                        help="티커는 수정할 수 없습니다"
                      >
                        <Input disabled className="bg-gray-100" />
                      </Form.Item>
                      <Form.Item label="사업자등록상호" name="businessName">
                        <Input />
                      </Form.Item>
                      <Form.Item label="대표자" name="representative">
                        <Input />
                      </Form.Item>
                      <Form.Item label="사업자등록주소" name="businessAddress" className="md:col-span-2">
                        <Input />
                      </Form.Item>
                      <Form.Item label="상차지 주소" name="loadingAddress" className="md:col-span-2">
                        <Input />
                      </Form.Item>
                      <Form.Item label="상태" name="status">
                        <Select>
                          <Select.Option value="active">활성</Select.Option>
                          <Select.Option value="inactive">비활성</Select.Option>
                        </Select>
                      </Form.Item>
                    </div>

                    {/* 은행계좌정보 */}
                    <div className="mt-6">
                      <h4 className="text-sm font-semibold text-gray-900 mb-4">은행계좌정보</h4>
                      <Form.List name="bankAccounts">
                        {(fields, { add, remove }) => (
                          <>
                            {fields.map((field, index) => (
                              <div key={field.key} className="bg-gray-50 rounded-lg border border-gray-200 p-4 mb-3">
                                <Space align="start" style={{ width: '100%', display: 'flex', flexWrap: 'wrap' }}>
                                  <Form.Item
                                    {...field}
                                    name={[field.name, 'bank']}
                                    label="은행명"
                                    style={{ marginBottom: 0, minWidth: 120 }}
                                  >
                                    <Input placeholder="하나은행" />
                                  </Form.Item>
                                  <Form.Item
                                    {...field}
                                    name={[field.name, 'accountNumber']}
                                    label="계좌번호"
                                    style={{ marginBottom: 0, minWidth: 180 }}
                                  >
                                    <Input placeholder="123-456789-01234" />
                                  </Form.Item>
                                  <Form.Item
                                    {...field}
                                    name={[field.name, 'holder']}
                                    label="예금주"
                                    style={{ marginBottom: 0, minWidth: 120 }}
                                  >
                                    <Input placeholder="박성호" />
                                  </Form.Item>
                                  <Form.Item
                                    {...field}
                                    name={[field.name, 'isPrimary']}
                                    valuePropName="checked"
                                    style={{ marginBottom: 0, marginTop: 24 }}
                                  >
                                    <Button type={index === 0 ? "primary" : "default"} size="small">
                                      {index === 0 ? "주사용" : "일반"}
                                    </Button>
                                  </Form.Item>
                                  {fields.length > 1 && (
                                    <MinusCircleOutlined
                                      onClick={() => remove(field.name)}
                                      style={{ marginTop: 30, color: '#ff4d4f', fontSize: 20 }}
                                    />
                                  )}
                                </Space>
                              </div>
                            ))}
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                              계좌 추가하기
                            </Button>
                          </>
                        )}
                      </Form.List>
                    </div>

                    {/* 사업자등록증 */}
                    <div className="mt-6">
                      <Form.Item
                        name="certificate"
                        label="사업자등록증"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => e?.fileList}
                      >
                        <Upload beforeUpload={() => false} maxCount={1} accept="image/*,.pdf">
                          <Button icon={<UploadOutlined />}>사업자등록증 업데이트 (최대 10MB)</Button>
                        </Upload>
                      </Form.Item>
                    </div>
                  </Form>
                </div>
              ) : (
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">사업자등록번호</div>
                      <div className="text-base font-medium text-gray-900">{business.businessNumber}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">ticker</div>
                      <div className="text-base font-medium text-gray-900">{business.sellerId}</div>
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
                      <div className="text-sm text-gray-500 mb-1">사업자등록주소</div>
                      <div className="text-base font-medium text-gray-900">{business.businessAddress}</div>
                    </div>
                    <div className="md:col-span-2">
                      <div className="text-sm text-gray-500 mb-1">상차지 주소</div>
                      <div className="text-base font-medium text-gray-900">{business.loadingAddress}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">은행계좌</div>
                      <div className="space-y-1">
                        {business.bankAccounts.map((account, idx) => (
                          <div key={idx} className="text-base font-medium text-gray-900 flex items-center gap-2 flex-wrap">
                            <span>{account.bank} {account.accountNumber} ({account.holder})</span>
                            {account.isPrimary && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
                                주사용
                              </span>
                            )}
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

      {/* 섹션 3: 거래 실적 (P2 샘플) */}
      <div className="bg-gray-50 rounded-lg shadow-sm border border-gray-300 p-6 opacity-60">
        <h2 className="text-lg font-semibold text-gray-500 mb-6">거래 실적 (P2 예정)</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-100 rounded-lg p-4 text-center border border-gray-300">
            <div className="text-xs text-gray-500 mb-2">매입액 (누적)</div>
            <div className="text-2xl font-bold text-gray-600">
              {(sellerGroup.totalPurchase / 100000000).toFixed(1)}억
            </div>
          </div>
          <div className="bg-gray-100 rounded-lg p-4 text-center border border-gray-300">
            <div className="text-xs text-gray-500 mb-2">매입액 (최근 3개월)</div>
            <div className="text-2xl font-bold text-gray-600">
              {(sellerGroup.purchase3M / 100000000).toFixed(1)}억
            </div>
          </div>
          <div className="bg-gray-100 rounded-lg p-4 text-center border border-gray-300">
            <div className="text-xs text-gray-500 mb-2">매입액 (최근 1개월)</div>
            <div className="text-2xl font-bold text-gray-600">
              {(sellerGroup.purchase1M / 100000000).toFixed(1)}억
            </div>
          </div>
          <div className="bg-gray-100 rounded-lg p-4 text-center border border-gray-300">
            <div className="text-xs text-gray-500 mb-2">최근거래일</div>
            <div className="text-2xl font-bold text-gray-600">
              {sellerGroup.lastTradeDate}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 mb-6"></div>

        {/* 기간 필터 */}
        <div className="mb-6 flex flex-wrap gap-2">
          {[
            { key: '1M', label: '최근 1개월' },
            { key: '3M', label: '최근 3개월' },
            { key: '6M', label: '최근 6개월' },
            { key: 'thisMonth', label: '이번달' },
            { key: 'thisQuarter', label: '이번분기' },
            { key: 'thisYear', label: '올해' },
            { key: 'total', label: '누적' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setPeriodFilter(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                periodFilter === key
                  ? 'bg-gray-400 text-gray-700 shadow-sm'
                  : 'bg-gray-200 text-gray-600 border border-gray-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* 기간별 실적 표 - 모바일 대응 */}
        <div className="mb-6 overflow-x-auto">
          <div className="hidden md:block">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b border-gray-300">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500">기간</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-500">매입액</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-500">조정손익액</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-500">매입총중량(톤)</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500">출하규격</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500">출하바이어</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300">
                {currentData.map((row, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-3 font-medium text-gray-600">{row.period}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{(row.purchase / 100000000).toFixed(1)}억</td>
                    <td className="px-4 py-3 text-right text-gray-600">{(row.profit / 10000).toFixed(0)}만</td>
                    <td className="px-4 py-3 text-right text-gray-600">{row.weight}</td>
                    <td className="px-4 py-3 text-gray-500">{row.specs}</td>
                    <td className="px-4 py-3 text-gray-500">{row.buyers}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 모바일 카드 뷰 */}
          <div className="md:hidden space-y-3">
            {currentData.map((row, idx) => (
              <div key={idx} className="bg-gray-100 rounded-lg p-4 border border-gray-300">
                <div className="font-semibold text-gray-600 mb-3">{row.period}</div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-gray-500 text-xs mb-0.5">매입액</div>
                    <div className="font-medium text-gray-600">{(row.purchase / 100000000).toFixed(1)}억</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs mb-0.5">조정손익액</div>
                    <div className="font-medium text-gray-600">{(row.profit / 10000).toFixed(0)}만</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs mb-0.5">매입총중량</div>
                    <div className="font-medium text-gray-600">{row.weight}톤</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs mb-0.5">출하규격</div>
                    <div className="font-medium text-gray-600 text-xs">{row.specs}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-gray-500 text-xs mb-0.5">출하바이어</div>
                    <div className="font-medium text-gray-600 text-xs">{row.buyers}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 매입액 막대차트 */}
        <div>
          <h3 className="text-base font-semibold text-gray-500 mb-4">매입액 추이</h3>
          <div className="bg-gray-100 rounded-lg p-4 border border-gray-300">
            <Column {...chartConfig} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellerDetail;
