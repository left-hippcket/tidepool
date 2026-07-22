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
// Note: icon and createdAt fields are deprecated (not shown in UI)
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
  { id: 8, productId: 2, productName: '넙치', name: '1.1kg', status: 'active', createdAt: '2024-02-08' },
  { id: 9, productId: 2, productName: '넙치', name: '1.2kg', status: 'active', createdAt: '2024-02-09' },
  { id: 10, productId: 2, productName: '넙치', name: '1.3kg', status: 'active', createdAt: '2024-02-10' },
  { id: 11, productId: 2, productName: '넙치', name: '1.4kg', status: 'active', createdAt: '2024-02-11' },
  { id: 12, productId: 2, productName: '넙치', name: '1.5kg', status: 'active', createdAt: '2024-02-12' },
  { id: 13, productId: 2, productName: '넙치', name: '1.6kg', status: 'active', createdAt: '2024-02-13' },
  { id: 14, productId: 2, productName: '넙치', name: '1.7kg', status: 'active', createdAt: '2024-02-14' },
  { id: 15, productId: 2, productName: '넙치', name: '1.8kg', status: 'active', createdAt: '2024-02-15' },
  { id: 16, productId: 2, productName: '넙치', name: '1.9kg', status: 'active', createdAt: '2024-02-16' },
  { id: 17, productId: 2, productName: '넙치', name: '2.0kg', status: 'active', createdAt: '2024-02-17' },
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
    commissionRate: 1.0,
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
    commissionRate: 1.0,
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
    commissionRate: 1.2,
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
    commissionRate: 0.8,
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
    commissionRate: 1.5,
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
  },
  3: { // 성호수산 (사업자 1개)
    keymen: [
      { name: '강성호', position: '대표', phone: '010-6666-7777' }
    ],
    qualitativeRatings: {
      financial: '좋음',
      quality: '좋음',
      priceCompetitive: '높음',
      claimCooperation: '좋음',
      lossProvision: '적당함'
    },
    additionalInfo: {
      farmArea: '8000',
      annualProduction: '65',
      mainDistributors: '노량진수산, 가락시장'
    },
    businesses: [
      {
        id: 301,
        businessNumber: '789-01-23457',
        businessName: '성호수산',
        representative: '강성호',
        businessAddress: '전라남도 완도군 완도읍 항구로 567',
        sellerName: '성호1호',
        sellerId: 'SH01',
        loadingAddress: '전라남도 완도군 완도읍 양식장로 99',
        commissionRate: 1.0,
        bankAccounts: [
          { bank: '농협', accountNumber: '352-6789-0123-45', holder: '강성호', isPrimary: true }
        ],
        status: 'active',
        hasCertificate: true
      }
    ]
  },
  4: { // 거제양식 (사업자 2개)
    keymen: [
      { name: '김거제', position: '대표', phone: '010-7777-8888' },
      { name: '박양식', position: '이사', phone: '010-8888-9999' }
    ],
    qualitativeRatings: {
      financial: '보통',
      quality: '최상',
      priceCompetitive: '보통',
      claimCooperation: '좋음',
      lossProvision: '넉넉함'
    },
    additionalInfo: {
      farmArea: '18000',
      annualProduction: '140',
      mainDistributors: '부산공판장, 서울수산시장'
    },
    businesses: [
      {
        id: 401,
        businessNumber: '890-12-34568',
        businessName: '거제양식장',
        representative: '김거제',
        businessAddress: '경상남도 거제시 일운면 해안로 123',
        sellerName: '거제1호',
        sellerId: 'GJ01',
        loadingAddress: '경상남도 거제시 일운면 양식장로 78',
        commissionRate: 1.0,
        bankAccounts: [
          { bank: '농협', accountNumber: '352-7890-1234-56', holder: '김거제', isPrimary: true }
        ],
        status: 'active',
        hasCertificate: true
      },
      {
        id: 402,
        businessNumber: '901-23-45679',
        businessName: '거제수산',
        representative: '김거제',
        businessAddress: '경상남도 거제시 장목면 해안로 456',
        sellerName: '거제2호',
        sellerId: 'GJ02',
        loadingAddress: '경상남도 거제시 장목면 양식장로 90',
        commissionRate: 1.2,
        bankAccounts: [
          { bank: '농협', accountNumber: '352-8901-2345-67', holder: '김거제', isPrimary: true },
          { bank: '신한', accountNumber: '110-123-456789', holder: '박양식', isPrimary: false }
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
  },
  3: { // 명성횟집 그룹
    keymen: [
      { name: '박명성', position: '대표', phone: '010-1111-2222' },
      { name: '이명숙', position: '실장', phone: '010-2222-3333' }
    ],
    kakaoGroupName: '[용인]명성횟집 거래방',
    paymentCycle: '기본 미수 5천만원, 초과분 월 1회 정산',
    complaintIntensity: '매우강함',
    mainSuppliers: '해금 그룹, 갑운 그룹',
    priorityFactors: ['살밥', '색깔', '로스', '단가', '외관', '평체', '기타'],
    arrivalPricePolicy: '상차단가 + 900원',
    businesses: [
      {
        id: 501,
        businessNumber: '123-45-67891',
        businessName: '명성횟집',
        representative: '박명성',
        businessAddress: '경기도 용인시 수지구 성복동 123',
        buyerName: '명성본점',
        buyerId: 'MS01',
        unloadingAddress: '경기도 용인시 수지구 성복동 123',
        taxInvoiceEmail: 'myungsung@email.com',
        status: 'active',
        hasCertificate: true
      },
      {
        id: 502,
        businessNumber: '234-56-78902',
        businessName: '명성2호',
        representative: '박명성',
        businessAddress: '경기도 용인시 수지구 죽전동 456',
        buyerName: '명성2호점',
        buyerId: 'MS02',
        unloadingAddress: '경기도 용인시 수지구 죽전동 456',
        taxInvoiceEmail: 'myungsung2@email.com',
        status: 'active',
        hasCertificate: true
      }
    ]
  },
  4: { // 대박 그룹 (사업자 1개)
    keymen: [
      { name: '김대박', position: '대표', phone: '010-3333-4444' }
    ],
    kakaoGroupName: '[경기남부]대박수산 거래방',
    paymentCycle: '기본 미수 1천만원, 초과분 즉시 정산',
    complaintIntensity: '약함',
    mainSuppliers: '통영수산, 제주활어',
    priorityFactors: ['단가', '로스', '살밥', '평체', '색깔', '외관', '기타'],
    arrivalPricePolicy: '상차단가 + 700원',
    businesses: [
      {
        id: 601,
        businessNumber: '345-67-89013',
        businessName: '대박수산',
        representative: '김대박',
        businessAddress: '경기도 수원시 팔달구 인계동 789',
        buyerName: '대박수산',
        buyerId: 'DB01',
        unloadingAddress: '경기도 수원시 팔달구 인계동 789',
        taxInvoiceEmail: 'daebak@email.com',
        status: 'active',
        hasCertificate: true
      }
    ]
  },
  6: { // 대구수산 (사업자 2개)
    keymen: [
      { name: '최대구', position: '대표', phone: '010-4444-5555' }
    ],
    kakaoGroupName: '[대구]대구수산 거래방',
    paymentCycle: '기본 미수 3천만원, 초과분 월 2회 정산',
    complaintIntensity: '보통',
    mainSuppliers: '부산양식, 통영수산',
    priorityFactors: ['로스', '단가', '살밥', '색깔', '외관', '평체', '기타'],
    arrivalPricePolicy: '상차단가 + 800원',
    businesses: [
      {
        id: 701,
        businessNumber: '456-78-90124',
        businessName: '대구수산본점',
        representative: '최대구',
        businessAddress: '대구광역시 북구 칠성동 234',
        buyerName: '대구본점',
        buyerId: 'DG01',
        unloadingAddress: '대구광역시 북구 칠성동 234',
        taxInvoiceEmail: 'daegu@email.com',
        status: 'active',
        hasCertificate: true
      },
      {
        id: 702,
        businessNumber: '567-89-01235',
        businessName: '대구수산지점',
        representative: '최대구',
        businessAddress: '대구광역시 중구 동성로 567',
        buyerName: '대구2호점',
        buyerId: 'DG02',
        unloadingAddress: '대구광역시 중구 동성로 567',
        taxInvoiceEmail: 'daegu2@email.com',
        status: 'active',
        hasCertificate: false
      }
    ]
  },
  7: { // 인천횟집 (사업자 1개)
    keymen: [
      { name: '정인천', position: '대표', phone: '010-5555-6666' }
    ],
    kakaoGroupName: '[인천]인천활어센터 거래방',
    paymentCycle: '기본 미수 2천만원, 초과분 주 1회 정산',
    complaintIntensity: '강함',
    mainSuppliers: '인천양식, 해금 그룹',
    priorityFactors: ['살밥', '로스', '색깔', '단가', '외관', '평체', '기타'],
    arrivalPricePolicy: '상차단가 + 700원',
    businesses: [
      {
        id: 801,
        businessNumber: '678-90-12346',
        businessName: '인천활어센터',
        representative: '정인천',
        businessAddress: '인천광역시 남동구 구월동 890',
        buyerName: '인천활어',
        buyerId: 'IC01',
        unloadingAddress: '인천광역시 남동구 구월동 890',
        taxInvoiceEmail: 'incheon@email.com',
        status: 'active',
        hasCertificate: true
      }
    ]
  }
};

// 바이어 판매 세부내역 (P2 - 샘플 데이터)
export const buyerSalesDetails = {
  1: { // 소라 그룹
    periods: [
      { period: '4월상순', sales: 45000000, profit: 4500000, weight: 3.2, specs: '500g-1.2톤, 700g-2.0톤', sellers: '해금그룹, 갑운그룹', products: '광어, 우럭' },
      { period: '4월중순', sales: 52000000, profit: 5200000, weight: 3.7, specs: '500g-1.5톤, 700g-2.2톤', sellers: '해금그룹', products: '광어, 돔' },
      { period: '4월하순', sales: 48000000, profit: 4800000, weight: 3.4, specs: '500g-1.3톤, 700g-2.1톤', sellers: '해금그룹, 갑운그룹', products: '광어, 우럭, 돔' },
      { period: '5월상순', sales: 58000000, profit: 5800000, weight: 4.1, specs: '500g-1.7톤, 700g-2.4톤', sellers: '해금그룹', products: '광어, 우럭' },
      { period: '5월중순', sales: 62000000, profit: 6200000, weight: 4.4, specs: '500g-1.8톤, 700g-2.6톤', sellers: '해금그룹, 갑운그룹', products: '광어, 돔' },
      { period: '5월하순', sales: 55000000, profit: 5500000, weight: 3.9, specs: '500g-1.6톤, 700g-2.3톤', sellers: '해금그룹', products: '광어, 우럭, 돔' },
      { period: '6월상순', sales: 64000000, profit: 6400000, weight: 4.5, specs: '500g-1.9톤, 700g-2.6톤', sellers: '해금그룹, 갑운그룹', products: '광어, 우럭' },
      { period: '6월중순', sales: 68000000, profit: 6800000, weight: 4.8, specs: '500g-2.0톤, 700g-2.8톤', sellers: '해금그룹', products: '광어, 돔' },
      { period: '6월하순', sales: 61000000, profit: 6100000, weight: 4.3, specs: '500g-1.8톤, 700g-2.5톤', sellers: '해금그룹, 갑운그룹', products: '광어, 우럭, 돔' }
    ],
    metrics: {
      totalSales: 513000000,
      totalProfit: 51300000,
      profitRate: 10.0,
      receivable: 28000000,
      turnoverRate: 18.3
    },
    grade: {
      salesRank: 5,
      profitRank: 8,
      turnoverGrade: 'A'
    }
  },
  3: { // 명성횟집 그룹
    periods: [
      { period: '4월상순', sales: 58000000, profit: 5800000, weight: 4.2, specs: '500g-1.5톤, 700g-2.7톤', sellers: '해금그룹, 갑운그룹', products: '광어, 우럭, 돔' },
      { period: '4월중순', sales: 62000000, profit: 6200000, weight: 4.5, specs: '500g-1.6톤, 700g-2.9톤', sellers: '해금그룹', products: '광어, 우럭' },
      { period: '4월하순', sales: 60000000, profit: 6000000, weight: 4.3, specs: '500g-1.5톤, 700g-2.8톤', sellers: '해금그룹, 갑운그룹', products: '광어, 돔' },
      { period: '5월상순', sales: 70000000, profit: 7000000, weight: 5.0, specs: '500g-1.8톤, 700g-3.2톤', sellers: '해금그룹', products: '광어, 우럭, 돔' },
      { period: '5월중순', sales: 75000000, profit: 7500000, weight: 5.3, specs: '500g-1.9톤, 700g-3.4톤', sellers: '해금그룹, 갑운그룹', products: '광어, 우럭' },
      { period: '5월하순', sales: 68000000, profit: 6800000, weight: 4.8, specs: '500g-1.7톤, 700g-3.1톤', sellers: '해금그룹', products: '광어, 돔' },
      { period: '6월상순', sales: 78000000, profit: 7800000, weight: 5.5, specs: '500g-2.0톤, 700g-3.5톤', sellers: '해금그룹, 갑운그룹', products: '광어, 우럭, 돔' },
      { period: '6월중순', sales: 82000000, profit: 8200000, weight: 5.8, specs: '500g-2.1톤, 700g-3.7톤', sellers: '해금그룹', products: '광어, 우럭' },
      { period: '6월하순', sales: 74000000, profit: 7400000, weight: 5.2, specs: '500g-1.9톤, 700g-3.3톤', sellers: '해금그룹, 갑운그룹', products: '광어, 돔' }
    ],
    metrics: {
      totalSales: 627000000,
      totalProfit: 62700000,
      profitRate: 10.0,
      receivable: 45000000,
      turnoverRate: 13.9
    },
    grade: {
      salesRank: 3,
      profitRank: 4,
      turnoverGrade: 'B'
    }
  },
  4: { // 대박 그룹 (사업자 1개 - 작은 규모)
    periods: [
      { period: '4월상순', sales: 28000000, profit: 2800000, weight: 2.0, specs: '500g-0.8톤, 700g-1.2톤', sellers: '통영수산', products: '광어, 우럭' },
      { period: '4월중순', sales: 32000000, profit: 3200000, weight: 2.3, specs: '500g-0.9톤, 700g-1.4톤', sellers: '통영수산, 제주활어', products: '광어' },
      { period: '4월하순', sales: 30000000, profit: 3000000, weight: 2.1, specs: '500g-0.8톤, 700g-1.3톤', sellers: '통영수산', products: '광어, 우럭' },
      { period: '5월상순', sales: 35000000, profit: 3500000, weight: 2.5, specs: '500g-1.0톤, 700g-1.5톤', sellers: '제주활어', products: '광어, 돔' },
      { period: '5월중순', sales: 38000000, profit: 3800000, weight: 2.7, specs: '500g-1.1톤, 700g-1.6톤', sellers: '통영수산', products: '광어' },
      { period: '5월하순', sales: 33000000, profit: 3300000, weight: 2.4, specs: '500g-0.9톤, 700g-1.5톤', sellers: '통영수산, 제주활어', products: '광어, 우럭' },
      { period: '6월상순', sales: 40000000, profit: 4000000, weight: 2.8, specs: '500g-1.1톤, 700g-1.7톤', sellers: '통영수산', products: '광어, 돔' },
      { period: '6월중순', sales: 42000000, profit: 4200000, weight: 3.0, specs: '500g-1.2톤, 700g-1.8톤', sellers: '제주활어', products: '광어' },
      { period: '6월하순', sales: 37000000, profit: 3700000, weight: 2.6, specs: '500g-1.0톤, 700g-1.6톤', sellers: '통영수산', products: '광어, 우럭' }
    ],
    metrics: {
      totalSales: 315000000,
      totalProfit: 31500000,
      profitRate: 10.0,
      receivable: 18000000,
      turnoverRate: 17.5
    },
    grade: {
      salesRank: 15,
      profitRank: 18,
      turnoverGrade: 'A'
    }
  }
};

// 세일즈 히스토리 메모 (P2 - 샘플 데이터)
export const salesHistoryMemos = {
  1: [ // 소라 그룹
    {
      id: 1001,
      date: '2024-07-12',
      author: '최용환',
      content: '소라 그룹 대표와 미팅. 7월 성수기 대비 물량 증대 요청. 해금 그룹과 연결 필요.',
      images: []
    },
    {
      id: 1002,
      date: '2024-07-08',
      author: '최용환',
      content: '컴플레인 대응: 6월 30일 출고분 일부 규격 미달 클레임. 해금 그룹에 손실 분담 요청 완료. 바이어 측 양해 구함.',
      images: []
    },
    {
      id: 1003,
      date: '2024-06-25',
      author: '이시호',
      content: '대리 방문 기록. 매장 확인 결과 회전율 양호. 다음 달 광어 대량 주문 예정.',
      images: []
    },
    {
      id: 1004,
      date: '2024-06-18',
      author: '최용환',
      content: '결제 지연 안내 받음. 미수금 3천 초과분 이번 주 중 입금 예정. 특이사항 없음.',
      images: []
    }
  ],
  3: [ // 명성횟집 그룹
    {
      id: 2001,
      date: '2024-07-10',
      author: '이시호',
      content: '명성횟집 대표와 전화 통화. 성수기 대량 주문 예정. 해금 그룹 물량 확보 필요.',
      images: []
    },
    {
      id: 2002,
      date: '2024-07-05',
      author: '이시호',
      content: '용인 지점 방문. 매장 규모 확대 계획 청취. 2호점 추가 오픈 예정.',
      images: []
    },
    {
      id: 2003,
      date: '2024-06-28',
      author: '최용환',
      content: '대리 방문 기록. 살밥과 색깔에 민감한 바이어. 고품질 제품만 공급 필요.',
      images: []
    }
  ],
  4: [ // 대박 그룹
    {
      id: 3001,
      date: '2024-07-11',
      author: '최용환',
      content: '대박수산 대표 미팅. 소규모지만 회전율 우수. 단가에 민감하여 저가 라인 선호.',
      images: []
    },
    {
      id: 3002,
      date: '2024-07-03',
      author: '최용환',
      content: '결제 우수 바이어. 미수금 거의 없고 즉시 정산 선호. 안정적 거래처.',
      images: []
    }
  ],
  6: [ // 대구수산
    {
      id: 4001,
      date: '2024-07-09',
      author: '이시호',
      content: '대구수산 본점 방문. 대구 지역 최대 거래처. 로스 보상 요구 많음.',
      images: []
    }
  ],
  7: [ // 인천횟집
    {
      id: 5001,
      date: '2024-07-14',
      author: '최용환',
      content: '인천활어센터 대표와 미팅. 살밥 품질에 까다로움. 해금 그룹 제품 선호.',
      images: []
    }
  ]
};

// 조인유통 그룹
export const joinGroups = [
  {
    id: 1,
    name: '동주유통 그룹',
    businessCount: 2,
    salesPerson: '노원진',
    territory: '수도권',
    region: '서울',
    totalPurchase: 1850000000,
    totalSales: 2150000000,
    purchase3M: 450000000,
    sales3M: 520000000,
    lastTradeDate: '2024-07-12',
    status: 'active',
    hasCertificate: true
  },
  {
    id: 2,
    name: 'ING 그룹',
    businessCount: 3,
    salesPerson: '노원진',
    territory: '수도권',
    region: '경기',
    totalPurchase: 2950000000,
    totalSales: 3250000000,
    purchase3M: 780000000,
    sales3M: 850000000,
    lastTradeDate: '2024-07-14',
    status: 'active',
    hasCertificate: true
  },
  {
    id: 3,
    name: '호경유통 그룹',
    businessCount: 1,
    salesPerson: '노원진',
    territory: '수도권',
    region: '서울',
    totalPurchase: 850000000,
    totalSales: 950000000,
    purchase3M: 220000000,
    sales3M: 250000000,
    lastTradeDate: '2024-07-11',
    status: 'active',
    hasCertificate: true
  }
];

// 조인유통 상세 정보
export const joinDetails = {
  1: { // 동주유통 그룹
    keymen: [
      { name: '김동주', position: '대표', phone: '010-1111-2222' },
      { name: '박과장', position: '영업담당', phone: '010-2222-3333' }
    ],
    kakaoGroupName: '[강남]동주유통 거래방',
    paymentCycle: '기본 미수 2천 요구, 2천 초과분에 대해 랜덤하게 입금',
    arrivalPricePolicy: 0,
    commissionRate: 0.0,
    mainSuppliers: '해금 그룹, 갑운 그룹',
    mainFarms: '성호수산, 거제양식',
    financial: '좋음',
    businesses: [
      {
        id: 1,
        businessNumber: '123-45-67890',
        businessName: '(주)동주유통',
        representative: '김동주',
        businessAddress: '서울시 강남구 테헤란로 123',
        joinName: '동주본점',
        ticker: 'DJ01',
        taxInvoiceEmail: 'dongju@email.com',
        bankAccounts: [
          { bank: '하나은행', accountNumber: '39484448392049', holder: '김동주' }
        ],
        status: 'active'
      },
      {
        id: 2,
        businessNumber: '345-67-89012',
        businessName: '동주수산',
        representative: '김동주',
        businessAddress: '서울시 강서구 공항대로 45-2',
        joinName: '동주2호',
        ticker: 'DJ02',
        taxInvoiceEmail: 'dongju2@email.com',
        bankAccounts: [
          { bank: '농협', accountNumber: '123-456-789-012', holder: '김동주' }
        ],
        status: 'active'
      }
    ]
  },
  2: { // ING 그룹
    keymen: [
      { name: '이인규', position: '대표', phone: '010-3333-4444' },
      { name: '최팀장', position: '물류팀장', phone: '010-4444-5555' }
    ],
    kakaoGroupName: '[경기]ING 거래방',
    paymentCycle: '월 2회 결제 (15일, 말일)',
    arrivalPricePolicy: 0,
    commissionRate: 0.0,
    mainSuppliers: '통영수산 그룹',
    mainFarms: '해금수산, 성호수산',
    financial: '보통',
    businesses: [
      {
        id: 3,
        businessNumber: '567-89-01234',
        businessName: '(주)아이앤지',
        representative: '이인규',
        businessAddress: '경기도 용인시 기흥구 동백로 456',
        joinName: 'ING본점',
        ticker: 'ING01',
        taxInvoiceEmail: 'ing@email.com',
        bankAccounts: [
          { bank: '신한은행', accountNumber: '110-234-567890', holder: '이인규' }
        ],
        status: 'active'
      },
      {
        id: 4,
        businessNumber: '678-90-12345',
        businessName: 'ING유통',
        representative: '이인규',
        businessAddress: '경기도 성남시 분당구 판교로 789',
        joinName: 'ING분당',
        ticker: 'ING02',
        taxInvoiceEmail: 'ing-bd@email.com',
        bankAccounts: [
          { bank: '국민은행', accountNumber: '987-654-321098', holder: '이인규' }
        ],
        status: 'active'
      },
      {
        id: 5,
        businessNumber: '789-01-23456',
        businessName: 'ING수산',
        representative: '이인규',
        businessAddress: '경기도 수원시 영통구 광교로 101',
        joinName: 'ING수원',
        ticker: 'ING03',
        taxInvoiceEmail: 'ing-sw@email.com',
        bankAccounts: [
          { bank: '우리은행', accountNumber: '1002-345-678901', holder: '이인규' }
        ],
        status: 'active'
      }
    ]
  },
  3: { // 호경유통 그룹
    keymen: [
      { name: '김호경', position: '대표', phone: '010-2222-3424' },
      { name: '박과장', position: '영업담당', phone: '010-3333-4444' }
    ],
    kakaoGroupName: '[강남]호경유통 거래방',
    paymentCycle: '기본 미수 3천 요구, 3천 초과분에 대해 랜덤하게 입금',
    arrivalPricePolicy: 0,
    commissionRate: 0.0,
    mainSuppliers: '동주유통, ING',
    mainFarms: '성호수산, 갑운수산',
    financial: '좋음',
    businesses: [
      {
        id: 6,
        businessNumber: '890-12-34567',
        businessName: '(주)호경유통',
        representative: '김호경',
        businessAddress: '서울시 강남구 테헤란로 123',
        joinName: '호경',
        ticker: 'HK01',
        taxInvoiceEmail: 'hokyung@email.com',
        bankAccounts: [
          { bank: '하나은행', accountNumber: '39484448392049', holder: '김호경' }
        ],
        status: 'active'
      }
    ]
  }
};

// 조인유통 거래 세부내역 (P2)
export const joinSalesDetails = {
  1: { // 동주유통 그룹
    periods: [
      { period: '4월상순', purchase: 45000000, sales: 52000000, profit: 7000000, purchaseWeight: 18, salesWeight: 20, specs: '500g, 700g, 1.0kg', sellers: '해금 그룹', buyers: '소라 그룹', products: '광어' },
      { period: '4월중순', purchase: 48000000, sales: 55000000, profit: 7000000, purchaseWeight: 19, salesWeight: 21, specs: '500g, 700g', sellers: '해금 그룹', buyers: '소라 그룹', products: '광어' },
      { period: '4월하순', purchase: 50000000, sales: 58000000, profit: 8000000, purchaseWeight: 20, salesWeight: 22, specs: '500g, 700g, 1.0kg', sellers: '해금 그룹, 갑운 그룹', buyers: '소라 그룹', products: '광어' },
      { period: '5월상순', purchase: 52000000, sales: 60000000, profit: 8000000, purchaseWeight: 21, salesWeight: 23, specs: '500g, 1.0kg', sellers: '해금 그룹', buyers: '소라 그룹, 명성횟집', products: '광어' },
      { period: '5월중순', purchase: 48000000, sales: 56000000, profit: 8000000, purchaseWeight: 19, salesWeight: 21, specs: '700g, 1.0kg', sellers: '갑운 그룹', buyers: '소라 그룹', products: '광어' },
      { period: '5월하순', purchase: 50000000, sales: 57000000, profit: 7000000, purchaseWeight: 20, salesWeight: 22, specs: '500g, 700g', sellers: '해금 그룹', buyers: '명성횟집', products: '광어' },
      { period: '6월상순', purchase: 55000000, sales: 63000000, profit: 8000000, purchaseWeight: 22, salesWeight: 24, specs: '500g, 700g, 1.0kg', sellers: '해금 그룹', buyers: '소라 그룹', products: '광어' },
      { period: '6월중순', purchase: 53000000, sales: 61000000, profit: 8000000, purchaseWeight: 21, salesWeight: 23, specs: '700g, 1.0kg', sellers: '해금 그룹, 갑운 그룹', buyers: '소라 그룹', products: '광어' },
      { period: '6월하순', purchase: 49000000, sales: 58000000, profit: 9000000, purchaseWeight: 20, salesWeight: 22, specs: '500g, 1.0kg', sellers: '해금 그룹', buyers: '소라 그룹, 명성횟집', products: '광어' }
    ],
    metrics: {
      totalPurchase: 450000000,
      totalSales: 520000000,
      adjustedProfit: 70000000,
      adjustedProfitRate: 13.5,
      receivable: 28000000,
      turnoverRate: 18.6
    },
    grade: {
      purchaseRank: 15,
      salesRank: 12,
      profitRank: 8,
      turnoverGrade: 'A'
    }
  },
  2: { // ING 그룹
    periods: [
      { period: '4월상순', purchase: 75000000, sales: 82000000, profit: 7000000, purchaseWeight: 30, salesWeight: 33, specs: '500g, 700g, 1.0kg', sellers: '통영수산 그룹', buyers: '소라 그룹, 대박', products: '광어, 우럭' },
      { period: '4월중순', purchase: 78000000, sales: 85000000, profit: 7000000, purchaseWeight: 31, salesWeight: 34, specs: '500g, 700g', sellers: '통영수산 그룹', buyers: '소라 그룹', products: '광어' },
      { period: '4월하순', purchase: 80000000, sales: 88000000, profit: 8000000, purchaseWeight: 32, salesWeight: 35, specs: '700g, 1.0kg', sellers: '통영수산 그룹', buyers: '대박', products: '광어, 우럭' },
      { period: '5월상순', purchase: 85000000, sales: 93000000, profit: 8000000, purchaseWeight: 34, salesWeight: 37, specs: '500g, 1.0kg', sellers: '통영수산 그룹, 해금 그룹', buyers: '소라 그룹', products: '광어' },
      { period: '5월중순', purchase: 82000000, sales: 90000000, profit: 8000000, purchaseWeight: 33, salesWeight: 36, specs: '500g, 700g, 1.0kg', sellers: '통영수산 그룹', buyers: '소라 그룹, 대박', products: '광어, 우럭' },
      { period: '5월하순', purchase: 80000000, sales: 87000000, profit: 7000000, purchaseWeight: 32, salesWeight: 35, specs: '700g, 1.0kg', sellers: '통영수산 그룹', buyers: '소라 그룹', products: '광어' },
      { period: '6월상순', purchase: 88000000, sales: 96000000, profit: 8000000, purchaseWeight: 35, salesWeight: 38, specs: '500g, 700g, 1.0kg', sellers: '통영수산 그룹, 해금 그룹', buyers: '소라 그룹, 대박', products: '광어, 우럭' },
      { period: '6월중순', purchase: 85000000, sales: 93000000, profit: 8000000, purchaseWeight: 34, salesWeight: 37, specs: '500g, 1.0kg', sellers: '통영수산 그룹', buyers: '소라 그룹', products: '광어' },
      { period: '6월하순', purchase: 87000000, sales: 96000000, profit: 9000000, purchaseWeight: 35, salesWeight: 38, specs: '700g, 1.0kg', sellers: '통영수산 그룹', buyers: '대박', products: '광어, 우럭' }
    ],
    metrics: {
      totalPurchase: 740000000,
      totalSales: 810000000,
      adjustedProfit: 70000000,
      adjustedProfitRate: 8.6,
      receivable: 45000000,
      turnoverRate: 18.0
    },
    grade: {
      purchaseRank: 8,
      salesRank: 5,
      profitRank: 10,
      turnoverGrade: 'A'
    }
  },
  3: { // 호경유통 그룹
    periods: [
      { period: '4월상순', purchase: 22000000, sales: 25000000, profit: 3000000, purchaseWeight: 9, salesWeight: 10, specs: '500g, 700g', sellers: '동주유통', buyers: '명성횟집', products: '광어' },
      { period: '4월중순', purchase: 24000000, sales: 27000000, profit: 3000000, purchaseWeight: 10, salesWeight: 11, specs: '700g, 1.0kg', sellers: 'ING', buyers: '명성횟집', products: '광어' },
      { period: '4월하순', purchase: 23000000, sales: 26000000, profit: 3000000, purchaseWeight: 9, salesWeight: 10, specs: '500g, 1.0kg', sellers: '동주유통', buyers: '명성횟집', products: '광어' },
      { period: '5월상순', purchase: 25000000, sales: 28000000, profit: 3000000, purchaseWeight: 10, salesWeight: 11, specs: '500g, 700g', sellers: '동주유통, ING', buyers: '명성횟집', products: '광어' },
      { period: '5월중순', purchase: 24000000, sales: 27000000, profit: 3000000, purchaseWeight: 10, salesWeight: 11, specs: '700g, 1.0kg', sellers: '동주유통', buyers: '명성횟집', products: '광어' },
      { period: '5월하순', purchase: 23000000, sales: 26000000, profit: 3000000, purchaseWeight: 9, salesWeight: 10, specs: '500g, 700g', sellers: 'ING', buyers: '명성횟집', products: '광어' },
      { period: '6월상순', purchase: 26000000, sales: 29000000, profit: 3000000, purchaseWeight: 10, salesWeight: 12, specs: '500g, 700g, 1.0kg', sellers: '동주유통', buyers: '명성횟집', products: '광어' },
      { period: '6월중순', purchase: 25000000, sales: 28000000, profit: 3000000, purchaseWeight: 10, salesWeight: 11, specs: '700g, 1.0kg', sellers: '동주유통, ING', buyers: '명성횟집', products: '광어' },
      { period: '6월하순', purchase: 24000000, sales: 27000000, profit: 3000000, purchaseWeight: 10, salesWeight: 11, specs: '500g, 1.0kg', sellers: '동주유통', buyers: '명성횟집', products: '광어' }
    ],
    metrics: {
      totalPurchase: 216000000,
      totalSales: 243000000,
      adjustedProfit: 27000000,
      adjustedProfitRate: 11.1,
      receivable: 15000000,
      turnoverRate: 16.2
    },
    grade: {
      purchaseRank: 25,
      salesRank: 28,
      profitRank: 18,
      turnoverGrade: 'B'
    }
  }
};

// 조인유통 세일즈 히스토리 메모 (P2)
export const joinSalesHistoryMemos = {
  1: [ // 동주유통 그룹
    {
      id: 1001,
      date: '2024-07-10',
      author: '노원진',
      content: '김동주 대표와 미팅. 하반기 물량 20% 증량 요청. 해금 그룹 공급 안정성 확인.',
      images: []
    },
    {
      id: 1002,
      date: '2024-06-25',
      author: '노원진',
      content: '동주2호 신규 사업자 추가 완료. 세금계산서 발행 이메일 변경 요청 받음.',
      images: []
    }
  ],
  2: [ // ING 그룹
    {
      id: 2001,
      date: '2024-07-12',
      author: '노원진',
      content: 'ING수원 지점 방문. 수원 지역 바이어 확대 가능성 논의. 통영수산과 직거래 선호.',
      images: []
    },
    {
      id: 2002,
      date: '2024-07-05',
      author: '노원진',
      content: '이인규 대표 전화 통화. 7월 물량 30% 증량 확정. 소라 그룹 외 대박 그룹 추가 납품.',
      images: []
    }
  ],
  3: [ // 호경유통 그룹
    {
      id: 3001,
      date: '2024-07-08',
      author: '노원진',
      content: '호경유통 신규 거래 시작. 명성횟집 단독 공급. 품질 요구사항 까다로움.',
      images: []
    }
  ]
};

// 드라이버 데이터
export const drivers = [
  {
    id: 1,
    name: '정훈',
    ticker: 'JH01',
    vehicleType: '5.0톤',
    tankCount: 10,
    phone: '010-1234-5678',
    settlementBusiness: '만진수산',
    taxType: '과세',
    driverLevel: '잘함',
    status: 'active'
  },
  {
    id: 2,
    name: '영민',
    ticker: 'YM01',
    vehicleType: '5.0톤',
    tankCount: 10,
    phone: '010-2345-6789',
    settlementBusiness: '영민운송',
    taxType: '면세',
    driverLevel: '보통',
    status: 'active'
  },
  {
    id: 3,
    name: '호붕',
    ticker: 'HB01',
    vehicleType: '1.0톤',
    tankCount: 4,
    phone: '010-3456-7890',
    settlementBusiness: '호붕물류',
    taxType: '과세',
    driverLevel: '잘함',
    status: 'active'
  },
  {
    id: 4,
    name: '성훈',
    ticker: 'SH02',
    vehicleType: '5.0톤',
    tankCount: 10,
    phone: '010-4567-8901',
    settlementBusiness: '만진수산',
    taxType: '과세',
    driverLevel: '못함',
    status: 'active'
  },
  {
    id: 5,
    name: '민수',
    ticker: 'MS01',
    vehicleType: '1.0톤',
    tankCount: 4,
    phone: '010-5678-9012',
    settlementBusiness: null,
    taxType: null,
    driverLevel: '모름',
    status: 'active'
  },
  {
    id: 6,
    name: '철호',
    ticker: 'CH01',
    vehicleType: '5.0톤',
    tankCount: 10,
    phone: '010-6789-0123',
    settlementBusiness: '철호운송',
    taxType: '면세',
    driverLevel: '보통',
    status: 'inactive'
  }
];

// 드라이버 상세 정보
export const driverDetails = {
  1: { // 정훈
    basicInfo: {
      name: '정훈',
      ticker: 'JH01',
      phone: '010-1234-5678',
      vehicleType: '5.0톤',
      tankCount: 10,
      driverLevel: '잘함',
      status: 'active'
    },
    settlementInfo: {
      businessNumber: '123-45-67890',
      businessName: '만진수산',
      representative: '김만진',
      businessAddress: '경기도 수지구 동천동 230-3',
      taxType: '과세',
      bankAccounts: [
        { bank: '하나은행', accountNumber: '123-456789-01234', holder: '김만진', isPrimary: true },
        { bank: '농협', accountNumber: '352-1234-5678-90', holder: '김만진', isPrimary: false }
      ],
      hasCertificate: true
    }
  },
  2: { // 영민
    basicInfo: {
      name: '영민',
      ticker: 'YM01',
      phone: '010-2345-6789',
      vehicleType: '5.0톤',
      tankCount: 10,
      driverLevel: '보통',
      status: 'active'
    },
    settlementInfo: {
      businessNumber: '234-56-78901',
      businessName: '영민운송',
      representative: '이영민',
      businessAddress: '서울시 강남구 테헤란로 456',
      taxType: '면세',
      bankAccounts: [
        { bank: '신한은행', accountNumber: '110-987-654321', holder: '이영민', isPrimary: true }
      ],
      hasCertificate: true
    }
  },
  3: { // 호붕
    basicInfo: {
      name: '호붕',
      ticker: 'HB01',
      phone: '010-3456-7890',
      vehicleType: '1.0톤',
      tankCount: 4,
      driverLevel: '잘함',
      status: 'active'
    },
    settlementInfo: {
      businessNumber: '345-67-89012',
      businessName: '호붕물류',
      representative: '박호붕',
      businessAddress: '인천광역시 남동구 구월동 789',
      taxType: '과세',
      bankAccounts: [
        { bank: '농협', accountNumber: '352-2345-6789-01', holder: '박호붕', isPrimary: true }
      ],
      hasCertificate: true
    }
  },
  4: { // 성훈
    basicInfo: {
      name: '성훈',
      ticker: 'SH02',
      phone: '010-4567-8901',
      vehicleType: '5.0톤',
      tankCount: 10,
      driverLevel: '못함',
      status: 'active'
    },
    settlementInfo: {
      businessNumber: '123-45-67890',
      businessName: '만진수산',
      representative: '김만진',
      businessAddress: '경기도 수지구 동천동 230-3',
      taxType: '과세',
      bankAccounts: [
        { bank: '하나은행', accountNumber: '123-456789-01234', holder: '김만진', isPrimary: true }
      ],
      hasCertificate: true
    }
  },
  5: { // 민수 (정산사업자 미등록)
    basicInfo: {
      name: '민수',
      ticker: 'MS01',
      phone: '010-5678-9012',
      vehicleType: '1.0톤',
      tankCount: 4,
      driverLevel: '모름',
      status: 'active'
    },
    settlementInfo: null
  },
  6: { // 철호 (비활성)
    basicInfo: {
      name: '철호',
      ticker: 'CH01',
      phone: '010-6789-0123',
      vehicleType: '5.0톤',
      tankCount: 10,
      driverLevel: '보통',
      status: 'inactive'
    },
    settlementInfo: {
      businessNumber: '456-78-90123',
      businessName: '철호운송',
      representative: '최철호',
      businessAddress: '경기도 용인시 수지구 성복동 123',
      taxType: '면세',
      bankAccounts: [
        { bank: '국민은행', accountNumber: '987-654-321098', holder: '최철호', isPrimary: true }
      ],
      hasCertificate: true
    }
  }
};

// 클레임/사고 이력
export const claimHistory = {
  1: [ // 정훈
    {
      id: 1001,
      occurredAt: '2024-07-10 14:30',
      author: '노원진',
      incidentType: '산소농도 조절 실패',
      content: '5.0톤 차량으로 여수에서 인천까지 운송 중 산소농도 조절 실패로 광어 2마리(약 2.4kg) 폐사. 바이어(소라수산)에게 로스 보상 처리함. 드라이버에게 산소 관리 재교육 필요.',
      images: []
    },
    {
      id: 1002,
      occurredAt: '2024-06-25 09:15',
      author: '최용환',
      incidentType: '운송 지연',
      content: '교통체증으로 30분 지연 도착. 바이어 측 양해 구함. 특이사항 없음.',
      images: []
    }
  ],
  2: [ // 영민
    {
      id: 2001,
      occurredAt: '2024-07-05 16:45',
      author: '이시호',
      incidentType: '교통사고',
      content: '고속도로 접촉사고 발생. 차량 경미한 손상. 활어 상태 정상. 보험 처리 진행중.',
      images: []
    }
  ],
  3: [], // 호붕 (이력 없음)
  4: [ // 성훈
    {
      id: 4001,
      occurredAt: '2024-07-12 11:20',
      author: '노원진',
      incidentType: '활어 폐사',
      content: '운송 중 급정거로 인한 활어 폐사 2마리. 운전 주의 필요.',
      images: []
    },
    {
      id: 4002,
      occurredAt: '2024-06-28 15:00',
      author: '고영석',
      incidentType: '산소농도 조절 실패',
      content: '산소통 교체 지연으로 활어 상태 불량. 바이어 클레임 접수. 재교육 완료.',
      images: []
    }
  ],
  5: [], // 민수 (이력 없음)
  6: [] // 철호 (이력 없음)
};

// 드라이버 거래 세부내역 (P2)
export const driverTransactionDetails = {
  1: { // 정훈
    periods: [
      { period: '4월상순', freight: 2500000, tripCount: 5, sellers: '해금 그룹, 갑운 그룹', buyers: '소라 그룹', products: '광어, 우럭' },
      { period: '4월중순', freight: 3000000, tripCount: 6, sellers: '해금 그룹', buyers: '소라 그룹, 명성횟집', products: '광어' },
      { period: '4월하순', freight: 2800000, tripCount: 5, sellers: '해금 그룹, 갑운 그룹', buyers: '소라 그룹', products: '광어, 돔' },
      { period: '5월상순', freight: 3200000, tripCount: 6, sellers: '해금 그룹', buyers: '소라 그룹', products: '광어, 우럭' },
      { period: '5월중순', freight: 3500000, tripCount: 7, sellers: '해금 그룹, 갑운 그룹', buyers: '소라 그룹, 명성횟집', products: '광어' },
      { period: '5월하순', freight: 3000000, tripCount: 6, sellers: '해금 그룹', buyers: '소라 그룹', products: '광어, 돔' },
      { period: '6월상순', freight: 3800000, tripCount: 7, sellers: '해금 그룹, 갑운 그룹', buyers: '소라 그룹', products: '광어, 우럭' },
      { period: '6월중순', freight: 4000000, tripCount: 8, sellers: '해금 그룹', buyers: '소라 그룹, 명성횟집', products: '광어' },
      { period: '6월하순', freight: 3500000, tripCount: 7, sellers: '해금 그룹', buyers: '소라 그룹', products: '광어, 돔' }
    ],
    metrics: {
      totalFreight: 29300000,
      totalTripCount: 57,
      averageFreight: 514035
    }
  },
  2: { // 영민
    periods: [
      { period: '4월상순', freight: 2000000, tripCount: 4, sellers: '통영수산 그룹', buyers: '대박 그룹', products: '광어' },
      { period: '4월중순', freight: 2200000, tripCount: 4, sellers: '통영수산 그룹', buyers: '대박 그룹', products: '광어, 우럭' },
      { period: '4월하순', freight: 2100000, tripCount: 4, sellers: '통영수산 그룹', buyers: '대박 그룹', products: '광어' },
      { period: '5월상순', freight: 2400000, tripCount: 5, sellers: '통영수산 그룹', buyers: '대박 그룹', products: '광어, 돔' },
      { period: '5월중순', freight: 2500000, tripCount: 5, sellers: '통영수산 그룹', buyers: '대박 그룹', products: '광어' },
      { period: '5월하순', freight: 2200000, tripCount: 4, sellers: '통영수산 그룹', buyers: '대박 그룹', products: '광어, 우럭' },
      { period: '6월상순', freight: 2600000, tripCount: 5, sellers: '통영수산 그룹', buyers: '대박 그룹', products: '광어' },
      { period: '6월중순', freight: 2800000, tripCount: 6, sellers: '통영수산 그룹', buyers: '대박 그룹', products: '광어, 돔' },
      { period: '6월하순', freight: 2500000, tripCount: 5, sellers: '통영수산 그룹', buyers: '대박 그룹', products: '광어' }
    ],
    metrics: {
      totalFreight: 21300000,
      totalTripCount: 42,
      averageFreight: 507143
    }
  },
  3: { // 호붕
    periods: [
      { period: '4월상순', freight: 800000, tripCount: 4, sellers: '인천수산', buyers: '인천횟집', products: '광어' },
      { period: '4월중순', freight: 900000, tripCount: 4, sellers: '인천수산', buyers: '인천횟집', products: '광어, 우럭' },
      { period: '4월하순', freight: 850000, tripCount: 4, sellers: '인천수산', buyers: '인천횟집', products: '광어' },
      { period: '5월상순', freight: 950000, tripCount: 5, sellers: '인천수산', buyers: '인천횟집', products: '광어' },
      { period: '5월중순', freight: 1000000, tripCount: 5, sellers: '인천수산', buyers: '인천횟집', products: '광어, 돔' },
      { period: '5월하순', freight: 900000, tripCount: 4, sellers: '인천수산', buyers: '인천횟집', products: '광어' },
      { period: '6월상순', freight: 1050000, tripCount: 5, sellers: '인천수산', buyers: '인천횟집', products: '광어, 우럭' },
      { period: '6월중순', freight: 1100000, tripCount: 6, sellers: '인천수산', buyers: '인천횟집', products: '광어' },
      { period: '6월하순', freight: 1000000, tripCount: 5, sellers: '인천수산', buyers: '인천횟집', products: '광어' }
    ],
    metrics: {
      totalFreight: 8550000,
      totalTripCount: 42,
      averageFreight: 203571
    }
  }
};

// 사업자 정보 데이터베이스
// 사업자등록번호를 키로 하여 사업자 정보를 저장
export const businessRegistry = {
  '123-45-67890': {
    businessNumber: '123-45-67890',
    businessName: '영어조합법인 성호수산',
    representative: '박성호',
    businessAddress: '경기도 수지구 동천동 230-3',
    taxType: '일반과세',
  },
  '234-56-78901': {
    businessNumber: '234-56-78901',
    businessName: '주식회사 해양수산',
    representative: '김철수',
    businessAddress: '부산광역시 수영구 광안동 123-45',
    taxType: '일반과세',
  },
  '345-67-89012': {
    businessNumber: '345-67-89012',
    businessName: '완도수산',
    representative: '이영희',
    businessAddress: '전라남도 완도군 완도읍 해변로 100',
    taxType: '간이과세',
  },
  '456-78-90123': {
    businessNumber: '456-78-90123',
    businessName: '제주활어유통',
    representative: '최민수',
    businessAddress: '제주특별자치도 제주시 해안로 456',
    taxType: '일반과세',
  },
  '567-89-01234': {
    businessNumber: '567-89-01234',
    businessName: '통영수협',
    representative: '정수진',
    businessAddress: '경상남도 통영시 중앙로 789',
    taxType: '일반과세',
  },
  '678-90-12345': {
    businessNumber: '678-90-12345',
    businessName: '인천종합수산',
    representative: '강동훈',
    businessAddress: '인천광역시 연수구 송도동 101-202',
    taxType: '일반과세',
  },
  '789-01-23456': {
    businessNumber: '789-01-23456',
    businessName: '노량진수산',
    representative: '윤지영',
    businessAddress: '서울특별시 동작구 노량진로 321',
    taxType: '간이과세',
  },
  '890-12-34567': {
    businessNumber: '890-12-34567',
    businessName: '거제활어센터',
    representative: '임태호',
    businessAddress: '경상남도 거제시 고현동 567-8',
    taxType: '일반과세',
  },
};

// 거래장부 데이터
export const transactionLedgerData = [
  {
    key: 1,
    주문코드: 'ORD-20260722-001',
    거래코드: 'TXN-20260722-001',
    운송코드: 'TRANS-20260722-001',
    주문일: '2026-07-22',
    납품일: '2026-07-22',
    품목: '넙치',
    원산지: '완도',
    규격: '1.2kg',
    주문수량: 10,
    주문단위: '통',
    주문중량: 12.0,
    상차단가: 15000,
    상차수수료율: 5,
    통당운임단가: 300,
    운송비포함여부: '포함',
    도착단가: 16200,
    알파수익단가: 500,
    셀러명: '완도수산',
    셀러그룹명: '완도수산그룹',
    바이어명: '노량진상회',
    바이어그룹명: '노량진상회그룹',
    바이어사업권역: '수도권',
    드라이버명: '김기사',
    '클레임/조정 유형': '',
    '클레임/조정 내용': '',
    바이어정산조정금액: 0,
    셀러정산조정물량: '',
    셀러정산조정금액: 0,
    드라이버정산조정금액: 0,
    회계처리용조정금액: 0,
    매출액: 162000,
    매입액: 150000,
    '운송비(비용)': 3000,
    거래손익: 9000,
    상차수수료수익: 7500,
    셀러조정손익: 0,
    바이어조정손익: 0,
    거래메모: '정상 거래',
  },
  {
    key: 2,
    주문코드: 'ORD-20260722-002',
    거래코드: 'TXN-20260722-002',
    운송코드: 'TRANS-20260722-002',
    주문일: '2026-07-22',
    납품일: '2026-07-22',
    품목: '넙치',
    원산지: '제주',
    규격: '1.5kg',
    주문수량: 8,
    주문단위: '통',
    주문중량: 12.0,
    상차단가: 18000,
    상차수수료율: 5,
    통당운임단가: 350,
    운송비포함여부: '포함',
    도착단가: 19500,
    알파수익단가: 800,
    셀러명: '제주수산',
    셀러그룹명: '제주수산그룹',
    바이어명: '대박수산',
    바이어그룹명: '대박수산그룹',
    바이어사업권역: '경상권',
    드라이버명: '이기사',
    '클레임/조정 유형': '폐사에 따른 조정',
    '클레임/조정 내용': '운송 중 1통 폐사',
    바이어정산조정금액: -19500,
    셀러정산조정물량: '-1통',
    셀러정산조정금액: -18000,
    드라이버정산조정금액: -350,
    회계처리용조정금액: -10000,
    매출액: 156000,
    매입액: 144000,
    '운송비(비용)': 2800,
    거래손익: -800,
    상차수수료수익: 7200,
    셀러조정손익: -18000,
    바이어조정손익: -19500,
    거래메모: '운송 중 1통 폐사로 인한 조정 처리',
  },
  {
    key: 3,
    주문코드: 'ORD-20260721-001',
    거래코드: 'TXN-20260721-001',
    운송코드: 'TRANS-20260721-001',
    주문일: '2026-07-21',
    납품일: '2026-07-21',
    품목: '광어',
    원산지: '제주',
    규격: '1.0kg',
    주문수량: 15,
    주문단위: '통',
    주문중량: 15.0,
    상차단가: 12000,
    상차수수료율: 5,
    통당운임단가: 280,
    운송비포함여부: '포함',
    도착단가: 13000,
    알파수익단가: 300,
    셀러명: '제주활어',
    셀러그룹명: '제주활어그룹',
    바이어명: '인천수산',
    바이어그룹명: '인천수산그룹',
    바이어사업권역: '수도권',
    드라이버명: '박기사',
    '클레임/조정 유형': '',
    '클레임/조정 내용': '',
    바이어정산조정금액: 0,
    셀러정산조정물량: '',
    셀러정산조정금액: 0,
    드라이버정산조정금액: 0,
    회계처리용조정금액: 0,
    매출액: 195000,
    매입액: 180000,
    '운송비(비용)': 4200,
    거래손익: 10800,
    상차수수료수익: 9000,
    셀러조정손익: 0,
    바이어조정손익: 0,
    거래메모: '',
  },
  {
    key: 4,
    주문코드: 'ORD-20260720-001',
    거래코드: 'TXN-20260720-001',
    운송코드: 'TRANS-20260720-001',
    주문일: '2026-07-20',
    납품일: '2026-07-20',
    품목: '우럭',
    원산지: '통영',
    규격: '1.0kg',
    주문수량: 20,
    주문단위: '통',
    주문중량: 20.0,
    상차단가: 10000,
    상차수수료율: 5,
    통당운임단가: 250,
    운송비포함여부: '포함',
    도착단가: 11000,
    알파수익단가: 400,
    셀러명: '통영활어',
    셀러그룹명: '통영활어그룹',
    바이어명: '거제상회',
    바이어그룹명: '거제상회그룹',
    바이어사업권역: '경상권',
    드라이버명: '최기사',
    '클레임/조정 유형': '',
    '클레임/조정 내용': '',
    바이어정산조정금액: 0,
    셀러정산조정물량: '',
    셀러정산조정금액: 0,
    드라이버정산조정금액: 0,
    회계처리용조정금액: 0,
    매출액: 220000,
    매입액: 200000,
    '운송비(비용)': 5000,
    거래손익: 15000,
    상차수수료수익: 10000,
    셀러조정손익: 0,
    바이어조정손익: 0,
    거래메모: '',
  },
  {
    key: 5,
    주문코드: 'ORD-20260719-001',
    거래코드: 'TXN-20260719-001',
    운송코드: 'TRANS-20260719-001',
    주문일: '2026-07-19',
    납품일: '2026-07-19',
    품목: '돔',
    원산지: '남해',
    규격: '1.5kg',
    주문수량: 6,
    주문단위: '통',
    주문중량: 9.0,
    상차단가: 22000,
    상차수수료율: 5,
    통당운임단가: 320,
    운송비포함여부: '포함',
    도착단가: 24000,
    알파수익단가: 1200,
    셀러명: '남해수산',
    셀러그룹명: '남해수산그룹',
    바이어명: '부산횟집',
    바이어그룹명: '부산횟집그룹',
    바이어사업권역: '경상권',
    드라이버명: '정기사',
    '클레임/조정 유형': '',
    '클레임/조정 내용': '',
    바이어정산조정금액: 0,
    셀러정산조정물량: '',
    셀러정산조정금액: 0,
    드라이버정산조정금액: 0,
    회계처리용조정금액: 0,
    매출액: 144000,
    매입액: 132000,
    '운송비(비용)': 1920,
    거래손익: 10080,
    상차수수료수익: 6600,
    셀러조정손익: 0,
    바이어조정손익: 0,
    거래메모: '바이어가 품질에 만족함',
  },
  {
    key: 6,
    주문코드: 'ORD-20260718-001',
    거래코드: 'TXN-20260718-001',
    운송코드: 'TRANS-20260718-001',
    주문일: '2026-07-18',
    납품일: '2026-07-18',
    품목: '농어',
    원산지: '거제',
    규격: '2.0kg',
    주문수량: 5,
    주문단위: '통',
    주문중량: 10.0,
    상차단가: 25000,
    상차수수료율: 5,
    통당운임단가: 350,
    운송비포함여부: '미포함',
    도착단가: 27000,
    알파수익단가: 1500,
    셀러명: '거제활어',
    셀러그룹명: '거제활어그룹',
    바이어명: '대구상회',
    바이어그룹명: '대구상회그룹',
    바이어사업권역: '경상권',
    드라이버명: '김기사',
    '클레임/조정 유형': '',
    '클레임/조정 내용': '',
    바이어정산조정금액: 0,
    셀러정산조정물량: '',
    셀러정산조정금액: 0,
    드라이버정산조정금액: 0,
    회계처리용조정금액: 0,
    매출액: 135000,
    매입액: 125000,
    '운송비(비용)': 0,
    거래손익: 10000,
    상차수수료수익: 6250,
    셀러조정손익: 0,
    바이어조정손익: 0,
    거래메모: '',
  },
  {
    key: 7,
    주문코드: 'ORD-20260717-001',
    거래코드: 'TXN-20260717-001',
    운송코드: 'TRANS-20260717-001',
    주문일: '2026-07-17',
    납품일: '2026-07-17',
    품목: '넙치',
    원산지: '완도',
    규격: '1.0kg',
    주문수량: 12,
    주문단위: '통',
    주문중량: 12.0,
    상차단가: 13000,
    상차수수료율: 5,
    통당운임단가: 290,
    운송비포함여부: '포함',
    도착단가: 14200,
    알파수익단가: 600,
    셀러명: '완도활어',
    셀러그룹명: '완도활어그룹',
    바이어명: '하남상회',
    바이어그룹명: '하남상회그룹',
    바이어사업권역: '수도권',
    드라이버명: '이기사',
    '클레임/조정 유형': '',
    '클레임/조정 내용': '',
    바이어정산조정금액: 0,
    셀러정산조정물량: '',
    셀러정산조정금액: 0,
    드라이버정산조정금액: 0,
    회계처리용조정금액: 0,
    매출액: 170400,
    매입액: 156000,
    '운송비(비용)': 3480,
    거래손익: 10920,
    상차수수료수익: 7800,
    셀러조정손익: 0,
    바이어조정손익: 0,
    거래메모: '',
  },
  {
    key: 8,
    주문코드: 'ORD-20260716-001',
    거래코드: 'TXN-20260716-001',
    운송코드: 'TRANS-20260716-001',
    주문일: '2026-07-16',
    납품일: '2026-07-16',
    품목: '광어',
    원산지: '제주',
    규격: '1.2kg',
    주문수량: 9,
    주문단위: '통',
    주문중량: 10.8,
    상차단가: 14000,
    상차수수료율: 5,
    통당운임단가: 310,
    운송비포함여부: '포함',
    도착단가: 15200,
    알파수익단가: 500,
    셀러명: '제주활어센터',
    셀러그룹명: '제주활어센터그룹',
    바이어명: '경기수산',
    바이어그룹명: '경기수산그룹',
    바이어사업권역: '수도권',
    드라이버명: '박기사',
    '클레임/조정 유형': '색깔 불량',
    '클레임/조정 내용': '바이어가 색깔 불량 요청',
    바이어정산조정금액: -15200,
    셀러정산조정물량: '',
    셀러정산조정금액: 0,
    드라이버정산조정금액: 0,
    회계처리용조정금액: -5000,
    매출액: 136800,
    매입액: 126000,
    '운송비(비용)': 2790,
    거래손익: 3010,
    상차수수료수익: 6300,
    셀러조정손익: 0,
    바이어조정손익: -15200,
    거래메모: '색깔 불량으로 바이어 조정',
  },
];
