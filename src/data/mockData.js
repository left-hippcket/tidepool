// 사업권역 및 상세지역 데이터
export const territories = [
  { id: 1, name: '수도권', displayOrder: 1, status: 'active', regionCount: 5 },
  { id: 2, name: '강원권', displayOrder: 2, status: 'active', regionCount: 1 },
  { id: 3, name: '경상권', displayOrder: 3, status: 'active', regionCount: 8 },
  { id: 4, name: '충청권', displayOrder: 4, status: 'active', regionCount: 4 },
  { id: 5, name: '호남권', displayOrder: 5, status: 'active', regionCount: 4 },
  { id: 6, name: '제주권', displayOrder: 6, status: 'active', regionCount: 1 },
  { id: 7, name: '조인유통', displayOrder: 7, status: 'active', regionCount: 1 },
];

export const regions = [
  { id: 1, territoryId: 1, territoryName: '수도권', name: '인천', displayOrder: 1, status: 'active' },
  { id: 2, territoryId: 1, territoryName: '수도권', name: '하남/미사리', displayOrder: 2, status: 'active' },
  { id: 3, territoryId: 1, territoryName: '수도권', name: '노량진', displayOrder: 3, status: 'active' },
  { id: 4, territoryId: 1, territoryName: '수도권', name: '경기북부', displayOrder: 4, status: 'active' },
  { id: 5, territoryId: 1, territoryName: '수도권', name: '경기남부', displayOrder: 5, status: 'active' },
  { id: 6, territoryId: 2, territoryName: '강원권', name: '강원', displayOrder: 1, status: 'active' },
  { id: 7, territoryId: 3, territoryName: '경상권', name: '통영', displayOrder: 1, status: 'active' },
  { id: 8, territoryId: 3, territoryName: '경상권', name: '거제', displayOrder: 2, status: 'active' },
  { id: 9, territoryId: 3, territoryName: '경상권', name: '남해/고성', displayOrder: 3, status: 'active' },
  { id: 10, territoryId: 3, territoryName: '경상권', name: '포항', displayOrder: 4, status: 'active' },
  { id: 11, territoryId: 3, territoryName: '경상권', name: '대구', displayOrder: 5, status: 'active' },
  { id: 12, territoryId: 3, territoryName: '경상권', name: '부산', displayOrder: 6, status: 'active' },
  { id: 13, territoryId: 3, territoryName: '경상권', name: '경북', displayOrder: 7, status: 'active' },
  { id: 14, territoryId: 3, territoryName: '경상권', name: '경남', displayOrder: 8, status: 'active' },
  { id: 15, territoryId: 4, territoryName: '충청권', name: '충북', displayOrder: 1, status: 'active' },
  { id: 16, territoryId: 4, territoryName: '충청권', name: '충남', displayOrder: 2, status: 'active' },
  { id: 17, territoryId: 4, territoryName: '충청권', name: '대전', displayOrder: 3, status: 'active' },
  { id: 18, territoryId: 4, territoryName: '충청권', name: '대천', displayOrder: 4, status: 'active' },
  { id: 19, territoryId: 5, territoryName: '호남권', name: '완도/진도', displayOrder: 1, status: 'active' },
  { id: 20, territoryId: 5, territoryName: '호남권', name: '고흥', displayOrder: 2, status: 'active' },
  { id: 21, territoryId: 5, territoryName: '호남권', name: '전북', displayOrder: 3, status: 'active' },
  { id: 22, territoryId: 5, territoryName: '호남권', name: '전남', displayOrder: 4, status: 'active' },
  { id: 23, territoryId: 6, territoryName: '제주권', name: '제주', displayOrder: 1, status: 'active' },
  { id: 24, territoryId: 7, territoryName: '조인유통', name: '조인유통', displayOrder: 1, status: 'active' },
];

// 품목분류 데이터
export const productCategories = [
  { id: 1, icon: '🐟', name: '누운고기', itemCount: 15, status: 'active', createdAt: '2024-01-15' },
  { id: 2, icon: '🦈', name: '뜬고기', itemCount: 12, status: 'active', createdAt: '2024-01-16' },
  { id: 3, icon: '🦞', name: '갑각류', itemCount: 8, status: 'active', createdAt: '2024-01-17' },
  { id: 4, icon: '🦑', name: '연체류', itemCount: 6, status: 'active', createdAt: '2024-01-18' },
  { id: 5, icon: '🐚', name: '패류', itemCount: 10, status: 'active', createdAt: '2024-01-19' },
  { id: 6, icon: '🏺', name: '건어물', itemCount: 5, status: 'active', createdAt: '2024-01-20' },
  { id: 7, icon: '🦪', name: '굴류', itemCount: 3, status: 'active', createdAt: '2024-01-21' },
  { id: 8, icon: '🍣', name: '횟감', itemCount: 20, status: 'active', createdAt: '2024-01-22' },
];

// 품목 데이터
export const products = [
  { id: 1, categoryId: 1, categoryName: '누운고기', categoryIcon: '🐟', name: '광어', orderUnit: '통', unitWeight: 1.2, originCount: 5, specCount: 8, status: 'active' },
  { id: 2, categoryId: 1, categoryName: '누운고기', categoryIcon: '🐟', name: '넙치', orderUnit: '통', unitWeight: 1.5, originCount: 4, specCount: 6, status: 'active' },
  { id: 3, categoryId: 1, categoryName: '누운고기', categoryIcon: '🐟', name: '우럭', orderUnit: '통', unitWeight: 0.8, originCount: 6, specCount: 7, status: 'active' },
  { id: 4, categoryId: 1, categoryName: '누운고기', categoryIcon: '🐟', name: '강도다리', orderUnit: '통', unitWeight: 1.0, originCount: 3, specCount: 5, status: 'active' },
  { id: 5, categoryId: 2, categoryName: '뜬고기', categoryIcon: '🦈', name: '우럭(활)', orderUnit: '통', unitWeight: 0.9, originCount: 5, specCount: 6, status: 'active' },
  { id: 6, categoryId: 2, categoryName: '뜬고기', categoryIcon: '🦈', name: '점성어', orderUnit: '통', unitWeight: 1.1, originCount: 4, specCount: 5, status: 'active' },
  { id: 7, categoryId: 2, categoryName: '뜬고기', categoryIcon: '🦈', name: '도미', orderUnit: '통', unitWeight: 1.3, originCount: 5, specCount: 7, status: 'active' },
  { id: 8, categoryId: 2, categoryName: '뜬고기', categoryIcon: '🦈', name: '농어', orderUnit: '통', unitWeight: 1.4, originCount: 4, specCount: 6, status: 'active' },
  { id: 9, categoryId: 3, categoryName: '갑각류', categoryIcon: '🦞', name: '대하', orderUnit: 'kg', unitWeight: 1.0, originCount: 3, specCount: 4, status: 'active' },
  { id: 10, categoryId: 3, categoryName: '갑각류', categoryIcon: '🦞', name: '왕새우', orderUnit: 'kg', unitWeight: 1.0, originCount: 4, specCount: 5, status: 'active' },
];

// 원산지 데이터
export const origins = [
  { id: 1, productId: 1, productName: '광어', name: '완도', status: 'active', createdAt: '2024-02-01' },
  { id: 2, productId: 1, productName: '광어', name: '통영', status: 'active', createdAt: '2024-02-02' },
  { id: 3, productId: 1, productName: '광어', name: '고흥', status: 'active', createdAt: '2024-02-03' },
  { id: 4, productId: 1, productName: '광어', name: '거제', status: 'active', createdAt: '2024-02-04' },
  { id: 5, productId: 1, productName: '광어', name: '남해', status: 'inactive', createdAt: '2024-02-05' },
  { id: 6, productId: 2, productName: '넙치', name: '제주', status: 'active', createdAt: '2024-02-06' },
  { id: 7, productId: 2, productName: '넙치', name: '완도', status: 'active', createdAt: '2024-02-07' },
  { id: 8, productId: 3, productName: '우럭', name: '통영', status: 'active', createdAt: '2024-02-08' },
];

// 규격 데이터
export const specifications = [
  { id: 1, productId: 1, productName: '광어', name: '1.2kg', status: 'active', createdAt: '2024-02-01' },
  { id: 2, productId: 1, productName: '광어', name: '1.5kg', status: 'active', createdAt: '2024-02-02' },
  { id: 3, productId: 1, productName: '광어', name: '2.0kg', status: 'active', createdAt: '2024-02-03' },
  { id: 4, productId: 1, productName: '광어', name: '2.5kg', status: 'active', createdAt: '2024-02-04' },
  { id: 5, productId: 1, productName: '광어', name: '3.0kg', status: 'inactive', createdAt: '2024-02-05' },
  { id: 6, productId: 1, productName: '광어', name: '4~5kg', status: 'active', createdAt: '2024-02-06' },
  { id: 7, productId: 2, productName: '넙치', name: '1.0kg', status: 'active', createdAt: '2024-02-07' },
  { id: 8, productId: 2, productName: '넙치', name: '1.5kg', status: 'active', createdAt: '2024-02-08' },
];

// 셀러 그룹 데이터
export const sellerGroups = [
  {
    id: 1,
    name: '해금 그룹',
    businessCount: 3,
    manager: '최용환',
    mainCategory: '누운고기',
    territory: '호남권',
    region: '완도/진도',
    totalPurchase: 2850000000,
    purchase3M: 650000000,
    purchase1M: 220000000,
    lastTradeDate: '2024-07-12',
    status: 'active',
    hasCertificate: true
  },
  {
    id: 2,
    name: '갑운 그룹',
    businessCount: 2,
    manager: '최용환',
    mainCategory: '누운고기',
    territory: '호남권',
    region: '완도/진도',
    totalPurchase: 1920000000,
    purchase3M: 480000000,
    purchase1M: 160000000,
    lastTradeDate: '2024-07-13',
    status: 'active',
    hasCertificate: true
  },
  {
    id: 3,
    name: '성호수산',
    businessCount: 1,
    manager: '최용환',
    mainCategory: '누운고기',
    territory: '수도권',
    region: '인천',
    totalPurchase: 1650000000,
    purchase3M: 420000000,
    purchase1M: 140000000,
    lastTradeDate: '2024-07-11',
    status: 'active',
    hasCertificate: true
  },
  {
    id: 4,
    name: '통영수산 그룹',
    businessCount: 2,
    manager: '이시호',
    mainCategory: '뜬고기',
    territory: '경상권',
    region: '통영',
    totalPurchase: 1480000000,
    purchase3M: 380000000,
    purchase1M: 125000000,
    lastTradeDate: '2024-07-10',
    status: 'active',
    hasCertificate: true
  },
  {
    id: 5,
    name: '거제양식',
    businessCount: 1,
    manager: '이시호',
    mainCategory: '뜬고기',
    territory: '경상권',
    region: '거제',
    totalPurchase: 1320000000,
    purchase3M: 340000000,
    purchase1M: 115000000,
    lastTradeDate: '2024-07-14',
    status: 'active',
    hasCertificate: false
  },
  {
    id: 6,
    name: '남해수산',
    businessCount: 2,
    manager: '노원진',
    mainCategory: '누운고기',
    territory: '경상권',
    region: '남해/고성',
    totalPurchase: 1180000000,
    purchase3M: 310000000,
    purchase1M: 105000000,
    lastTradeDate: '2024-07-09',
    status: 'active',
    hasCertificate: true
  },
  {
    id: 7,
    name: '제주활어',
    businessCount: 1,
    manager: '박현재',
    mainCategory: '뜬고기',
    territory: '제주권',
    region: '제주',
    totalPurchase: 980000000,
    purchase3M: 260000000,
    purchase1M: 88000000,
    lastTradeDate: '2024-07-08',
    status: 'active',
    hasCertificate: true
  },
  {
    id: 8,
    name: '고흥양식장',
    businessCount: 1,
    manager: '최용환',
    mainCategory: '누운고기',
    territory: '호남권',
    region: '고흥',
    totalPurchase: 850000000,
    purchase3M: 230000000,
    purchase1M: 78000000,
    lastTradeDate: '2024-07-13',
    status: 'active',
    hasCertificate: true
  },
  {
    id: 9,
    name: '포항수산',
    businessCount: 2,
    manager: '이시호',
    mainCategory: '갑각류',
    territory: '경상권',
    region: '포항',
    totalPurchase: 720000000,
    purchase3M: 195000000,
    purchase1M: 68000000,
    lastTradeDate: '2024-07-12',
    status: 'active',
    hasCertificate: false
  },
  {
    id: 10,
    name: '인천수산',
    businessCount: 1,
    manager: '고영석',
    mainCategory: '뜬고기',
    territory: '수도권',
    region: '인천',
    totalPurchase: 650000000,
    purchase3M: 170000000,
    purchase1M: 58000000,
    lastTradeDate: '2024-07-11',
    status: 'active',
    hasCertificate: true
  }
];

// 바이어 그룹 데이터
export const buyerGroups = [
  {
    id: 1,
    name: '소라 그룹',
    businessCount: 3,
    salesPerson: '최용환',
    mainCategory: '누운고기',
    territory: '수도권',
    region: '노량진',
    totalSales: 3250000000,
    sales3M: 780000000,
    sales1M: 265000000,
    lastTradeDate: '2024-07-13',
    status: 'active',
    hasCertificate: true
  },
  {
    id: 2,
    name: '대일 그룹',
    businessCount: 2,
    salesPerson: '노원진',
    mainCategory: '뜬고기',
    territory: '수도권',
    region: '하남/미사리',
    totalSales: 2890000000,
    sales3M: 690000000,
    sales1M: 235000000,
    lastTradeDate: '2024-07-14',
    status: 'active',
    hasCertificate: true
  },
  {
    id: 3,
    name: '명성횟집 그룹',
    businessCount: 2,
    salesPerson: '고영석',
    mainCategory: '누운고기',
    territory: '수도권',
    region: '경기남부',
    totalSales: 2450000000,
    sales3M: 620000000,
    sales1M: 210000000,
    lastTradeDate: '2024-07-12',
    status: 'active',
    hasCertificate: true
  },
  {
    id: 4,
    name: '대박 그룹',
    businessCount: 1,
    salesPerson: '노원진',
    mainCategory: '뜬고기',
    territory: '수도권',
    region: '경기북부',
    totalSales: 2180000000,
    sales3M: 560000000,
    sales1M: 192000000,
    lastTradeDate: '2024-07-11',
    status: 'active',
    hasCertificate: true
  },
  {
    id: 5,
    name: '부산횟집연합',
    businessCount: 4,
    salesPerson: '이시호',
    mainCategory: '누운고기',
    territory: '경상권',
    region: '부산',
    totalSales: 1950000000,
    sales3M: 510000000,
    sales1M: 175000000,
    lastTradeDate: '2024-07-10',
    status: 'active',
    hasCertificate: true
  },
  {
    id: 6,
    name: '대구수산',
    businessCount: 2,
    salesPerson: '이시호',
    mainCategory: '뜬고기',
    territory: '경상권',
    region: '대구',
    totalSales: 1720000000,
    sales3M: 460000000,
    sales1M: 158000000,
    lastTradeDate: '2024-07-13',
    status: 'active',
    hasCertificate: false
  },
  {
    id: 7,
    name: '인천횟집',
    businessCount: 1,
    salesPerson: '최용환',
    mainCategory: '누운고기',
    territory: '수도권',
    region: '인천',
    totalSales: 1480000000,
    sales3M: 410000000,
    sales1M: 142000000,
    lastTradeDate: '2024-07-14',
    status: 'active',
    hasCertificate: true
  },
  {
    id: 8,
    name: '제주유통',
    businessCount: 2,
    salesPerson: '박현재',
    mainCategory: '뜬고기',
    territory: '제주권',
    region: '제주',
    totalSales: 1320000000,
    sales3M: 370000000,
    sales1M: 128000000,
    lastTradeDate: '2024-07-09',
    status: 'active',
    hasCertificate: true
  },
  {
    id: 9,
    name: '강원활어',
    businessCount: 1,
    salesPerson: '고영석',
    mainCategory: '뜬고기',
    territory: '강원권',
    region: '강원',
    totalSales: 1150000000,
    sales3M: 330000000,
    sales1M: 115000000,
    lastTradeDate: '2024-07-12',
    status: 'active',
    hasCertificate: true
  },
  {
    id: 10,
    name: '대전수산시장',
    businessCount: 3,
    salesPerson: '노원진',
    mainCategory: '누운고기',
    territory: '충청권',
    region: '대전',
    totalSales: 980000000,
    sales3M: 290000000,
    sales1M: 102000000,
    lastTradeDate: '2024-07-11',
    status: 'active',
    hasCertificate: false
  }
];

// 담당자 목록
export const managers = ['최용환', '이시호', '노원진', '고영석', '박현재'];

// 셀러 상세 정보 (소속 사업자 및 키맨 정보)
export const sellerDetails = {
  1: { // 해금 그룹
    keymen: [
      { name: '김이수', position: '대표', phone: '010-1234-5678' },
      { name: '김철호', position: '사무장', phone: '010-2345-6789' }
    ],
    qualitativeRatings: {
      financial: '좋음',
      quality: '최상',
      priceCompetitive: '높음',
      claimCooperation: '좋음',
      lossProvision: '넉넉함'
    },
    additionalInfo: {
      farmArea: '15000',
      annualProduction: '120',
      mainDistributors: '노량진수산, 가락시장'
    },
    businesses: [
      {
        id: 101,
        businessNumber: '123-45-67890',
        businessName: '해금수산',
        representative: '김이수',
        businessAddress: '전라남도 완도군 완도읍 해변로 123',
        sellerName: '해금1호',
        sellerId: 'HG01',
        loadingAddress: '전라남도 완도군 완도읍 양식장로 45',
        commissionRate: 1.0,
        bankAccounts: [
          { bank: '농협', accountNumber: '352-1234-5678-90', holder: '김이수', isPrimary: true },
          { bank: '신한', accountNumber: '110-987-654321', holder: '김이수', isPrimary: false }
        ],
        status: 'active',
        hasCertificate: true
      },
      {
        id: 102,
        businessNumber: '234-56-78901',
        businessName: '해금수산 제2사업소',
        representative: '김철호',
        businessAddress: '전라남도 완도군 완도읍 해변로 125',
        sellerName: '해금2호',
        sellerId: 'HG02',
        loadingAddress: '전라남도 완도군 완도읍 양식장로 47',
        commissionRate: 1.0,
        bankAccounts: [
          { bank: '농협', accountNumber: '352-2345-6789-01', holder: '김철호', isPrimary: true }
        ],
        status: 'active',
        hasCertificate: true
      },
      {
        id: 103,
        businessNumber: '345-67-89012',
        businessName: '해금양식장',
        representative: '김이수',
        businessAddress: '전라남도 완도군 신지면 해안로 89',
        sellerName: '해금3호',
        sellerId: 'HG03',
        loadingAddress: '전라남도 완도군 신지면 양식장로 12',
        commissionRate: 1.2,
        bankAccounts: [
          { bank: '농협', accountNumber: '352-3456-7890-12', holder: '김이수', isPrimary: true }
        ],
        status: 'active',
        hasCertificate: true
      }
    ]
  },
  2: { // 갑운 그룹
    keymen: [
      { name: '박갑운', position: '대표', phone: '010-3456-7890' }
    ],
    qualitativeRatings: {
      financial: '보통',
      quality: '좋음',
      priceCompetitive: '보통',
      claimCooperation: '보통',
      lossProvision: '적당함'
    },
    additionalInfo: {
      farmArea: '12000',
      annualProduction: '95',
      mainDistributors: '노량진수산'
    },
    businesses: [
      {
        id: 201,
        businessNumber: '456-78-90123',
        businessName: '갑운수산',
        representative: '박갑운',
        businessAddress: '전라남도 완도군 고금면 해안로 234',
        sellerName: '갑운1호',
        sellerId: 'GW01',
        loadingAddress: '전라남도 완도군 고금면 양식장로 56',
        commissionRate: 1.0,
        bankAccounts: [
          { bank: '농협', accountNumber: '352-4567-8901-23', holder: '박갑운', isPrimary: true }
        ],
        status: 'active',
        hasCertificate: true
      },
      {
        id: 202,
        businessNumber: '567-89-01234',
        businessName: '갑운양식',
        representative: '박갑운',
        businessAddress: '전라남도 완도군 고금면 해안로 236',
        sellerName: '갑운2호',
        sellerId: 'GW02',
        loadingAddress: '전라남도 완도군 고금면 양식장로 58',
        commissionRate: 1.0,
        bankAccounts: [
          { bank: '농협', accountNumber: '352-5678-9012-34', holder: '박갑운', isPrimary: true }
        ],
        status: 'active',
        hasCertificate: true
      }
    ]
  }
};

// 바이어 상세 정보 (소속 사업자 및 키맨 정보)
export const buyerDetails = {
  1: { // 소라 그룹
    keymen: [
      { name: '최소라', position: '대표', phone: '010-5678-9012' },
      { name: '김영수', position: '구매담당', phone: '010-6789-0123' }
    ],
    kakaoGroupName: '[노량진]소라수산 거래방',
    paymentCycle: '기본 미수 3천만원, 초과분 월 2회 정산',
    complaintIntensity: '강함',
    mainSuppliers: '해금 그룹, 통영수산 그룹',
    priorityFactors: ['로스', '살밥', '단가', '색깔', '외관', '평체', '기타'],
    arrivalPricePolicy: '상차단가 + 800원',
    businesses: [
      {
        id: 301,
        businessNumber: '678-90-12345',
        businessName: '소라수산',
        representative: '최소라',
        businessAddress: '서울시 동작구 노량진로 123',
        buyerName: '소라본점',
        buyerId: 'SR01',
        unloadingAddress: '서울시 동작구 노량진수산시장 A동 12호',
        taxInvoiceEmail: 'sora@email.com',
        status: 'active',
        hasCertificate: true
      },
      {
        id: 302,
        businessNumber: '789-01-23456',
        businessName: '소라진조',
        representative: '최소라',
        businessAddress: '서울시 동작구 노량진로 125',
        buyerName: '소라2호점',
        buyerId: 'SR02',
        unloadingAddress: '서울시 동작구 노량진수산시장 B동 5호',
        taxInvoiceEmail: 'sora2@email.com',
        status: 'active',
        hasCertificate: true
      },
      {
        id: 303,
        businessNumber: '890-12-34567',
        businessName: '소라유통',
        representative: '김영수',
        businessAddress: '서울시 동작구 노량진로 127',
        buyerName: '소라3호점',
        buyerId: 'SR03',
        unloadingAddress: '서울시 동작구 노량진수산시장 C동 8호',
        taxInvoiceEmail: 'sora3@email.com',
        status: 'active',
        hasCertificate: true
      }
    ]
  },
  2: { // 대일 그룹
    keymen: [
      { name: '이대일', position: '대표', phone: '010-7890-1234' }
    ],
    kakaoGroupName: '[미사리]대일횟집 거래방',
    paymentCycle: '기본 미수 2천만원, 초과분 주 1회 정산',
    complaintIntensity: '보통',
    mainSuppliers: '거제양식, 제주활어',
    priorityFactors: ['단가', '살밥', '로스', '색깔', '외관', '평체', '기타'],
    arrivalPricePolicy: '상차단가 + 700원',
    businesses: [
      {
        id: 401,
        businessNumber: '901-23-45678',
        businessName: '대일수산',
        representative: '이대일',
        businessAddress: '경기도 하남시 미사강변동로 456',
        buyerName: '대일본점',
        buyerId: 'DI01',
        unloadingAddress: '경기도 하남시 미사강변동로 456',
        taxInvoiceEmail: 'daeil@email.com',
        status: 'active',
        hasCertificate: true
      },
      {
        id: 402,
        businessNumber: '012-34-56789',
        businessName: '대일유통',
        representative: '이대일',
        businessAddress: '경기도 하남시 미사강변동로 458',
        buyerName: '대일2호점',
        buyerId: 'DI02',
        unloadingAddress: '경기도 하남시 미사강변동로 458',
        taxInvoiceEmail: 'daeil2@email.com',
        status: 'active',
        hasCertificate: true
      }
    ]
  }
};
