// 상품마스터 데이터를 별도 파일에서 import
import {
  productCategories as importedProductCategories,
  products as importedProducts,
  origins as importedOrigins,
  specifications as importedSpecifications
} from './productMasterData.js';

export const productCategories = importedProductCategories;
export const products = importedProducts;
export const origins = importedOrigins;
export const specifications = importedSpecifications;

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
export const sellerGroups = [
  {
    "id": 1,
    "name": "거제광어 그룹",
    "businessCount": 2,
    "manager": "이시호",
    "managers": [
      "이시호"
    ],
    "mainCategory": "누운고기",
    "mainProducts": [
      "넙치"
    ],
    "territory": "경상권",
    "region": "거제",
    "commissionRate": 1.0,
    "status": "active",
    "hasCertificate": false,
    "hasCompleteBusinessInfo": true,
    "hasBankAccount": true,
    "mainDistributors": [
      "피시파더",
      "완도",
      "노량진"
    ],
    "qualityEvaluationDate": "2026-06-23"
  },
  {
    "id": 2,
    "name": "해오름 그룹",
    "businessCount": 3,
    "manager": "최용환",
    "managers": [
      "최용환"
    ],
    "mainCategory": "누운고기",
    "mainProducts": [
      "넙치"
    ],
    "territory": "호남권",
    "region": "완도/진도",
    "commissionRate": 1.0,
    "status": "active",
    "hasCertificate": false,
    "hasCompleteBusinessInfo": true,
    "hasBankAccount": true,
    "mainDistributors": [
      "준",
      "ING",
      "피시파더"
    ],
    "qualityEvaluationDate": "2026-05-12"
  },
  {
    "id": 3,
    "name": "해금 그룹",
    "businessCount": 4,
    "manager": "최용환",
    "managers": [
      "최용환",
      "박현재"
    ],
    "mainCategory": "누운고기",
    "mainProducts": [
      "넙치"
    ],
    "territory": "호남권",
    "region": "완도/진도",
    "commissionRate": 1.0,
    "status": "active",
    "hasCertificate": false,
    "hasCompleteBusinessInfo": true,
    "hasBankAccount": true,
    "mainDistributors": [
      "피시파더",
      "섬유통"
    ],
    "qualityEvaluationDate": "2026-07-07"
  },
  {
    "id": 4,
    "name": "광수수산",
    "businessCount": 1,
    "manager": "최용환",
    "managers": [
      "최용환",
      "박현재"
    ],
    "mainCategory": "누운고기",
    "mainProducts": [
      "넙치"
    ],
    "territory": "호남권",
    "region": "완도/진도",
    "commissionRate": 1.0,
    "status": "active",
    "hasCertificate": true,
    "hasCompleteBusinessInfo": true,
    "hasBankAccount": true,
    "mainDistributors": [
      "피시파더",
      "믿음유통",
      "삼도유통"
    ],
    "qualityEvaluationDate": "2026-04-19"
  },
  {
    "id": 5,
    "name": "세부수산",
    "businessCount": 1,
    "manager": "이시호",
    "managers": [
      "이시호"
    ],
    "mainCategory": "누운고기",
    "mainProducts": [
      "넙치",
      "강도다리"
    ],
    "territory": "경상권",
    "region": "포항",
    "commissionRate": 1.0,
    "status": "active",
    "hasCertificate": false,
    "hasCompleteBusinessInfo": true,
    "hasBankAccount": true,
    "mainDistributors": [
      "피시파더"
    ],
    "qualityEvaluationDate": "2026-03-29"
  },
  {
    "id": 6,
    "name": "태평양수산",
    "businessCount": 1,
    "manager": "이시호",
    "managers": [
      "이시호"
    ],
    "mainCategory": "누운고기",
    "mainProducts": [
      "넙치"
    ],
    "territory": "경상권",
    "region": "거제",
    "commissionRate": 1.0,
    "status": "active",
    "hasCertificate": true,
    "hasCompleteBusinessInfo": true,
    "hasBankAccount": true,
    "mainDistributors": [],
    "qualityEvaluationDate": null
  },
  {
    "id": 7,
    "name": "부광무역",
    "businessCount": 1,
    "manager": "노원진",
    "managers": [
      "노원진"
    ],
    "mainCategory": "뜬고기",
    "mainProducts": [
      "방어",
      "점성어",
      "도미"
    ],
    "territory": "경상권",
    "region": "통영",
    "commissionRate": 0.0,
    "status": "active",
    "hasCertificate": true,
    "hasCompleteBusinessInfo": true,
    "hasBankAccount": true,
    "mainDistributors": [],
    "qualityEvaluationDate": "2026-05-01"
  },
  {
    "id": 8,
    "name": "(완도)부성수산",
    "businessCount": 1,
    "manager": "박현재",
    "managers": [
      "박현재"
    ],
    "mainCategory": "누운고기",
    "mainProducts": [
      "넙치"
    ],
    "territory": "호남권",
    "region": "완도/진도",
    "commissionRate": 1.0,
    "status": "active",
    "hasCertificate": true,
    "hasCompleteBusinessInfo": true,
    "hasBankAccount": true,
    "mainDistributors": [],
    "qualityEvaluationDate": null
  },
  {
    "id": 9,
    "name": "삼천그룹",
    "businessCount": 3,
    "manager": "노원진",
    "managers": [
      "노원진"
    ],
    "mainCategory": "뜬고기",
    "mainProducts": [
      "방어",
      "점성어",
      "도미"
    ],
    "territory": "경상권",
    "region": "통영",
    "commissionRate": 0.0,
    "status": "active",
    "hasCertificate": false,
    "hasCompleteBusinessInfo": true,
    "hasBankAccount": true,
    "mainDistributors": [],
    "qualityEvaluationDate": null
  }
];




// 바이어 그룹 데이터
export const buyerGroups = [
  {
    "id": 1,
    "name": "소라그룹",
    "businessCount": 2,
    "salesPerson": "최용환",
    "salesPersons": [
      "최용환",
      "고영석"
    ],
    "mainCategory": [
      "누운고기",
      "연어"
    ],
    "mainProducts": [
      "넙치",
      "강도다리",
      "연어HOG"
    ],
    "territory": "수도권",
    "region": "하남/미사리",
    "status": "active",
    "hasCertificate": false,
    "hasCompleteBusinessInfo": true,
    "categoryManagers": [
      {
        "category": "“누운고기”",
        "managers": [
          "최용환"
        ]
      },
      {
        "category": "”연어”",
        "managers": [
          "고영석"
        ]
      }
    ]
  },
  {
    "id": 2,
    "name": "대일그룹",
    "businessCount": 2,
    "salesPerson": "고영석",
    "salesPersons": [
      "고영석",
      "노원진"
    ],
    "mainCategory": [
      "누운고기",
      "뜬고기"
    ],
    "mainProducts": [
      "넙치",
      "강도다리",
      "도미",
      "점성어"
    ],
    "territory": "수도권",
    "region": "인천",
    "status": "active",
    "hasCertificate": true,
    "hasCompleteBusinessInfo": true,
    "categoryManagers": [
      {
        "category": "“누운고기”",
        "managers": [
          "고영석"
        ]
      },
      {
        "category": "”뜬고기",
        "managers": [
          "노원진"
        ]
      }
    ]
  },
  {
    "id": 3,
    "name": "해양그룹",
    "businessCount": 2,
    "salesPerson": "이시호",
    "salesPersons": [
      "이시호"
    ],
    "mainCategory": [
      "누운고기"
    ],
    "mainProducts": [
      "넙치",
      "강도다리"
    ],
    "territory": "경상권",
    "region": "대구",
    "status": "active",
    "hasCertificate": false,
    "hasCompleteBusinessInfo": true,
    "categoryManagers": [
      {
        "category": "“누운고기”",
        "managers": [
          "이시호"
        ]
      }
    ]
  },
  {
    "id": 4,
    "name": "영광그룹",
    "businessCount": 2,
    "salesPerson": "최용환",
    "salesPersons": [
      "최용환"
    ],
    "mainCategory": [
      "누운고기"
    ],
    "mainProducts": [
      "넙치"
    ],
    "territory": "수도권",
    "region": "하남/미사리",
    "status": "active",
    "hasCertificate": true,
    "hasCompleteBusinessInfo": true,
    "categoryManagers": [
      {
        "category": "“누운고기”",
        "managers": [
          "최용환"
        ]
      }
    ]
  },
  {
    "id": 5,
    "name": "굿모닝씨푸드",
    "businessCount": 1,
    "salesPerson": "고영석",
    "salesPersons": [
      "고영석",
      "노원진"
    ],
    "mainCategory": [
      "누운고기",
      "뜬고기"
    ],
    "mainProducts": [
      "넙치",
      "강도다리",
      "농어",
      "점성어"
    ],
    "territory": "수도권",
    "region": "노량진",
    "status": "active",
    "hasCertificate": true,
    "hasCompleteBusinessInfo": true,
    "categoryManagers": [
      {
        "category": "“누운고기”",
        "managers": [
          "고영석"
        ]
      },
      {
        "category": "”뜬고기",
        "managers": [
          "노원진"
        ]
      }
    ]
  },
  {
    "id": 6,
    "name": "(인천)세희유통",
    "businessCount": 1,
    "salesPerson": "고영석",
    "salesPersons": [
      "고영석",
      "노원진"
    ],
    "mainCategory": [
      "누운고기",
      "뜬고기"
    ],
    "mainProducts": [
      "넙치",
      "강도다리",
      "농어",
      "점성어"
    ],
    "territory": "수도권",
    "region": "인천",
    "status": "active",
    "hasCertificate": false,
    "hasCompleteBusinessInfo": true,
    "categoryManagers": [
      {
        "category": "“누운고기”",
        "managers": [
          "고영석"
        ]
      },
      {
        "category": "”뜬고기",
        "managers": [
          "노원진"
        ]
      }
    ]
  },
  {
    "id": 7,
    "name": "완도전복",
    "businessCount": 1,
    "salesPerson": "고영석",
    "salesPersons": [
      "고영석"
    ],
    "mainCategory": [
      "누운고기"
    ],
    "mainProducts": [
      "넙치"
    ],
    "territory": "수도권",
    "region": "인천",
    "status": "active",
    "hasCertificate": true,
    "hasCompleteBusinessInfo": true,
    "categoryManagers": [
      {
        "category": "“누운고기”",
        "managers": [
          "고영석"
        ]
      }
    ]
  },
  {
    "id": 8,
    "name": "어부수산",
    "businessCount": 1,
    "salesPerson": "노원진",
    "salesPersons": [
      "노원진"
    ],
    "mainCategory": [
      "뜬고기"
    ],
    "mainProducts": [
      "도미",
      "농어",
      "점성어"
    ],
    "territory": "수도권",
    "region": "인천",
    "status": "active",
    "hasCertificate": true,
    "hasCompleteBusinessInfo": true,
    "categoryManagers": [
      {
        "category": "“뜬고기”",
        "managers": [
          "노원진"
        ]
      }
    ]
  },
  {
    "id": 9,
    "name": "바다로수산",
    "businessCount": 1,
    "salesPerson": "고영석",
    "salesPersons": [
      "고영석"
    ],
    "mainCategory": [
      "누운고기"
    ],
    "mainProducts": [
      "넙치"
    ],
    "territory": "수도권",
    "region": "인천",
    "status": "active",
    "hasCertificate": false,
    "hasCompleteBusinessInfo": true,
    "categoryManagers": [
      {
        "category": "“누운고기”",
        "managers": [
          "고영석"
        ]
      }
    ]
  },
  {
    "id": 10,
    "name": "나인씨월드",
    "businessCount": 1,
    "salesPerson": "최용환",
    "salesPersons": [
      "최용환",
      "노원진"
    ],
    "mainCategory": [
      "누운고기",
      "뜬고기"
    ],
    "mainProducts": [
      "넙치",
      "강도다리",
      "농어",
      "점성어"
    ],
    "territory": "수도권",
    "region": "노량진",
    "status": "active",
    "hasCertificate": true,
    "hasCompleteBusinessInfo": true,
    "categoryManagers": [
      {
        "category": "“누운고기”",
        "managers": [
          "최용환"
        ]
      },
      {
        "category": "”뜬고기",
        "managers": [
          "노원진"
        ]
      }
    ]
  },
  {
    "id": 11,
    "name": "백두회수산",
    "businessCount": 1,
    "salesPerson": "최용환",
    "salesPersons": [
      "최용환"
    ],
    "mainCategory": [
      "누운고기"
    ],
    "mainProducts": [
      "넙치"
    ],
    "territory": "충청권",
    "region": "충남",
    "status": "active",
    "hasCertificate": true,
    "hasCompleteBusinessInfo": true,
    "categoryManagers": [
      {
        "category": "“누운고기”",
        "managers": [
          "최용환"
        ]
      }
    ]
  }
];

// 담당자 목록
export const managers = ['최용환', '이시호', '노원진', '고영석', '박현재'];

// 셀러 상세 정보 (소속 사업자 및 키맨 정보)
export const sellerDetails = {
  "1": {
    "keymen": [
      {
        "name": "유춘안",
        "phone": "010-3849-1171",
        "role": "대표"
      }
    ],
    "qualitativeRatings": {
      "financial": "좋음",
      "quality": "좋음",
      "priceCompetitive": "보통",
      "claimCooperation": "보통",
      "lossProvision": "넉넉함"
    },
    "additionalInfo": {
      "farmArea": 3000,
      "annualProduction": 300,
      "mainDistributors": [
        "피시파더",
        "완도",
        "노량진"
      ]
    },
    "businesses": [
      {
        "sellerId": "SGJ",
        "sellerName": "거제광어",
        "businessNumber": "368-88-02367",
        "businessName": "어업회사법인 거제광어 주식회사",
        "representative": "유춘안",
        "businessAddress": "경상남도 거제시 동부면 함박금길 395-1",
        "loadingAddress": "경상남도 거제시 동부면 함박금길 395-1",
        "bankAccounts": [
          {
            "bank": "수협",
            "accountNumber": "1010-2313-2737",
            "holder": "거제광어(주)",
            "isPrimary": true
          }
        ],
        "certificate": {
          "uploaded": false,
          "filename": null
        },
        "status": "inactive"
      },
      {
        "sellerId": "NHB",
        "sellerName": "뉴함박수산",
        "businessNumber": "663-92-00198",
        "businessName": "뉴함박수산",
        "representative": "유춘안",
        "businessAddress": "경상남도 거제시 동부면 함박금길 397",
        "loadingAddress": "경상남도 거제시 동부면 함박금길 397",
        "bankAccounts": [
          {
            "bank": "수협",
            "accountNumber": "1010-2237-9291",
            "holder": "유춘안",
            "isPrimary": true
          },
          {
            "bank": "수협",
            "accountNumber": "2020-4428-4616",
            "holder": "유춘안",
            "isPrimary": false
          }
        ],
        "certificate": {
          "uploaded": true,
          "filename": null
        },
        "status": "active"
      }
    ]
  },
  "2": {
    "keymen": [
      {
        "name": "배수영",
        "phone": "010-8799-7744",
        "role": "대표"
      }
    ],
    "qualitativeRatings": {
      "financial": "보통",
      "quality": "보통",
      "priceCompetitive": "좋음",
      "claimCooperation": "보통",
      "lossProvision": "보통"
    },
    "additionalInfo": {
      "farmArea": 3000,
      "annualProduction": 300,
      "mainDistributors": [
        "준",
        "ING",
        "피시파더"
      ]
    },
    "businesses": [
      {
        "sellerId": "HOR",
        "sellerName": "해오름수산",
        "businessNumber": "413-98-85560",
        "businessName": "해오름수산2",
        "representative": "배수영",
        "businessAddress": "전남 완도군 고금면 봉명111번길 16-127, 외 7필지",
        "loadingAddress": "전라남도 완도군 봉명111번길 16-115",
        "bankAccounts": [
          {
            "bank": "수협",
            "accountNumber": "1010-2154-2320",
            "holder": "배수영",
            "isPrimary": true
          }
        ],
        "certificate": {
          "uploaded": false,
          "filename": null
        },
        "status": "inactive"
      },
      {
        "sellerId": "SSB",
        "sellerName": "서비수산",
        "businessNumber": "717-90-01428",
        "businessName": "서비수산",
        "representative": "김희섭",
        "businessAddress": "전라남도 완도군 완도읍 대야일구길43",
        "loadingAddress": "전라남도 완도군 완도읍 대야일구길43",
        "bankAccounts": [
          {
            "bank": "농협",
            "accountNumber": "312-0208-6683-61",
            "holder": "김희섭",
            "isPrimary": true
          }
        ],
        "certificate": {
          "uploaded": true,
          "filename": null
        },
        "status": "active"
      },
      {
        "sellerId": "SHL",
        "sellerName": "현이수산",
        "businessNumber": "101-93-02507",
        "businessName": "현이수산",
        "representative": "김희섭",
        "businessAddress": "전라남도 완도군 완도읍 청해진로 1277-168",
        "loadingAddress": "전라남도 완도군 완도읍 청해진로 1277-168",
        "bankAccounts": [
          {
            "bank": "농협",
            "accountNumber": "312-0208-6683-61",
            "holder": "김희섭",
            "isPrimary": true
          }
        ],
        "certificate": {
          "uploaded": true,
          "filename": null
        },
        "status": "active"
      }
    ]
  },
  "3": {
    "keymen": [
      {
        "name": "김이수",
        "phone": "010-3815-9501",
        "role": "대표"
      },
      {
        "name": "김삼수",
        "phone": "010-3815-9502",
        "role": "전무"
      }
    ],
    "qualitativeRatings": {
      "financial": "보통",
      "quality": "보통",
      "priceCompetitive": "나쁨",
      "claimCooperation": "비협조",
      "lossProvision": "부족함"
    },
    "additionalInfo": {
      "farmArea": 6000,
      "annualProduction": 500,
      "mainDistributors": [
        "피시파더",
        "섬유통"
      ]
    },
    "businesses": [
      {
        "sellerId": "HK",
        "sellerName": "해금수산",
        "businessNumber": "415-81-41901",
        "businessName": "해금수산영어조합법인",
        "representative": "정현희",
        "businessAddress": "전라남도 완도군 약산면 득암리 26-14",
        "loadingAddress": "전라남도 완도군 약산면 득암리 26-14",
        "bankAccounts": [
          {
            "bank": "수협",
            "accountNumber": "1010-0961-6865",
            "holder": "해금수산영어조합법인",
            "isPrimary": true
          }
        ],
        "certificate": {
          "uploaded": true,
          "filename": null
        },
        "status": "active"
      },
      {
        "sellerId": "HD3",
        "sellerName": "(완도)해동수산",
        "businessNumber": "835-92-01792",
        "businessName": "해동수산",
        "representative": "김건욱",
        "businessAddress": "전라남도 완도군 약산면 득암4번길 48-1",
        "loadingAddress": "전라남도 완도군 약산면 득암4번길 48-1",
        "bankAccounts": [
          {
            "bank": "수협",
            "accountNumber": "0100-8060-8144",
            "holder": "김건옥",
            "isPrimary": true
          }
        ],
        "certificate": {
          "uploaded": true,
          "filename": null
        },
        "status": "active"
      },
      {
        "sellerId": "HW2",
        "sellerName": "해왕수산",
        "businessNumber": "558-91-00230",
        "businessName": "해왕수산",
        "representative": "김종신",
        "businessAddress": "전라남도 완도군 약산면 해동리 17 외",
        "loadingAddress": "전라남도 완도군 약산면 해동리 17 외",
        "bankAccounts": [
          {
            "bank": "수협",
            "accountNumber": "0010-3844-2170",
            "holder": "김종신",
            "isPrimary": true
          }
        ],
        "certificate": {
          "uploaded": true,
          "filename": null
        },
        "status": "active"
      },
      {
        "sellerId": "HWW",
        "sellerName": "해왕수산2",
        "businessNumber": "256-92-00985",
        "businessName": "해왕수산2",
        "representative": "김이수",
        "businessAddress": "전라남도 완도군 약산면 해동리 17 외 2필지",
        "loadingAddress": "전라남도 완도군 약산면 해동리 17 외 2필지",
        "bankAccounts": [
          {
            "bank": "수협",
            "accountNumber": "0100-3815-9501",
            "holder": "김이수",
            "isPrimary": true
          }
        ],
        "certificate": {
          "uploaded": false,
          "filename": null
        },
        "status": "active"
      }
    ]
  },
  "4": {
    "keymen": [
      {
        "name": "전무님",
        "phone": "010-3693-2227",
        "role": "전무"
      },
      {
        "name": "사모님",
        "phone": "010-3693-0000",
        "role": "사모"
      }
    ],
    "qualitativeRatings": {
      "financial": "최상",
      "quality": "좋음",
      "priceCompetitive": "좋음",
      "claimCooperation": "보통",
      "lossProvision": "부족함"
    },
    "additionalInfo": {
      "farmArea": 5000,
      "annualProduction": 400,
      "mainDistributors": [
        "피시파더",
        "믿음유통",
        "삼도유통"
      ]
    },
    "businesses": [
      {
        "sellerId": "SGS",
        "sellerName": "광수수산",
        "businessNumber": "241-86-03086",
        "businessName": "광수물산 영어조합법인",
        "representative": "한광수",
        "businessAddress": "전라남도 진도군 의신면 웰빙길 192",
        "loadingAddress": "전라남도 진도군 의신면 웰빙길 192",
        "bankAccounts": [
          {
            "bank": "수협",
            "accountNumber": "0000-2025-9999",
            "holder": "광수물산영어조합법인",
            "isPrimary": true
          }
        ],
        "certificate": {
          "uploaded": true,
          "filename": null
        },
        "status": "active"
      }
    ]
  },
  "5": {
    "keymen": [
      {
        "name": "사모님",
        "phone": "010-3328-1777",
        "role": "대표"
      }
    ],
    "qualitativeRatings": {
      "financial": "보통",
      "quality": "좋음",
      "priceCompetitive": "최상",
      "claimCooperation": "협조적",
      "lossProvision": "넉넉함"
    },
    "additionalInfo": {
      "farmArea": 1000,
      "annualProduction": 150,
      "mainDistributors": [
        "피시파더"
      ]
    },
    "businesses": [
      {
        "sellerId": "SB2",
        "sellerName": "세부수산",
        "businessNumber": "506-91-78284",
        "businessName": "세부수산",
        "representative": "박성배",
        "businessAddress": "경상북도 포항시 남구 구룡포읍 땅끝마을길 65, 1층",
        "loadingAddress": "경상북도 포항시 남구 구룡포읍 땅끝마을길 65, 1층",
        "bankAccounts": [
          {
            "bank": "수협",
            "accountNumber": "1010-1094-9306",
            "holder": "세부수산",
            "isPrimary": true
          }
        ],
        "certificate": {
          "uploaded": false,
          "filename": null
        },
        "status": "active"
      }
    ]
  },
  "6": {
    "keymen": [],
    "qualitativeRatings": {
      "financial": "",
      "quality": "",
      "priceCompetitive": "",
      "claimCooperation": "",
      "lossProvision": ""
    },
    "additionalInfo": {
      "farmArea": 700,
      "annualProduction": 60,
      "mainDistributors": []
    },
    "businesses": [
      {
        "sellerId": "TFY",
        "sellerName": "태평양수산",
        "businessNumber": "612-91-99643",
        "businessName": "태평양수산",
        "representative": "배정희 외1",
        "businessAddress": "경상남도 거제시 동부면 함박금길 165-15",
        "loadingAddress": "경상남도 거제시 동부면 함박금길 165-15",
        "bankAccounts": [
          {
            "bank": "국민",
            "accountNumber": "867301-01-539565",
            "holder": "배정희",
            "isPrimary": true
          },
          {
            "bank": "농협",
            "accountNumber": "301-0253-1281-41",
            "holder": "선상갑",
            "isPrimary": false
          }
        ],
        "certificate": {
          "uploaded": true,
          "filename": null
        },
        "status": "active"
      }
    ]
  },
  "7": {
    "keymen": [
      {
        "name": "최희종",
        "phone": "010-4772-8750",
        "role": "대표"
      }
    ],
    "qualitativeRatings": {
      "financial": "좋음",
      "quality": "좋음",
      "priceCompetitive": "나쁨",
      "claimCooperation": "비협조",
      "lossProvision": "부족함"
    },
    "additionalInfo": {
      "farmArea": null,
      "annualProduction": null,
      "mainDistributors": []
    },
    "businesses": [
      {
        "sellerId": "BK",
        "sellerName": "부광무역",
        "businessNumber": "805-88-01246",
        "businessName": "어업회사법인 한울주식회사",
        "representative": "최희종",
        "businessAddress": "경상남도 통영시 미우지해안로 93",
        "loadingAddress": "경상남도 통영시 미우지해안로 93",
        "bankAccounts": [
          {
            "bank": "기업",
            "accountNumber": "175-085861-01-017",
            "holder": "한울",
            "isPrimary": true
          }
        ],
        "certificate": {
          "uploaded": true,
          "filename": null
        },
        "status": "active"
      }
    ]
  },
  "8": {
    "keymen": [
      {
        "name": "김경록",
        "phone": "010-6478-0981",
        "role": "대표"
      }
    ],
    "qualitativeRatings": {
      "financial": "",
      "quality": "",
      "priceCompetitive": "",
      "claimCooperation": "",
      "lossProvision": ""
    },
    "additionalInfo": {
      "farmArea": null,
      "annualProduction": null,
      "mainDistributors": []
    },
    "businesses": [
      {
        "sellerId": "SBS2",
        "sellerName": "(완도)부성수산",
        "businessNumber": "415-81-48976",
        "businessName": "2부성영어조합법인",
        "representative": "김경록",
        "businessAddress": "전라남도 완도군 고금면 교성길 31",
        "loadingAddress": "전라남도 완도군 고금면 교성길 31",
        "bankAccounts": [
          {
            "bank": "수협",
            "accountNumber": "0000-6478-0981",
            "holder": "2부성영어조합법인",
            "isPrimary": true
          }
        ],
        "certificate": {
          "uploaded": true,
          "filename": null
        },
        "status": "active"
      }
    ]
  },
  "9": {
    "keymen": [
      {
        "name": "최광록",
        "phone": "010-8380-7871",
        "role": "대표"
      },
      {
        "name": "모상남",
        "phone": "010-8380-7871",
        "role": "반장"
      }
    ],
    "qualitativeRatings": {
      "financial": "",
      "quality": "",
      "priceCompetitive": "",
      "claimCooperation": "",
      "lossProvision": ""
    },
    "additionalInfo": {
      "farmArea": null,
      "annualProduction": null,
      "mainDistributors": []
    },
    "businesses": [
      {
        "sellerId": "SC2",
        "sellerName": "삼천",
        "businessNumber": "294-88-02862",
        "businessName": "주식회사 삼천",
        "representative": "최광록",
        "businessAddress": "경상남도 통영시 동호안길 122(동호동)",
        "loadingAddress": "경상남도 통영시 동호안길 122(동호동)",
        "bankAccounts": [
          {
            "bank": "기업",
            "accountNumber": "175-104380-04-011",
            "holder": "주식회사 삼천",
            "isPrimary": true
          }
        ],
        "certificate": {
          "uploaded": true,
          "filename": null
        },
        "status": "active"
      },
      {
        "sellerId": "SC",
        "sellerName": "삼천해운",
        "businessNumber": "160-10-03254",
        "businessName": "삼천해운",
        "representative": "모상남",
        "businessAddress": "경상남도 통영시 동호안길 122(동호동)",
        "loadingAddress": "경상남도 통영시 동호안길 122(동호동)",
        "bankAccounts": [
          {
            "bank": "기업은행",
            "accountNumber": "175-103583-01-015",
            "holder": "모상남",
            "isPrimary": true
          }
        ],
        "certificate": {
          "uploaded": true,
          "filename": null
        },
        "status": "active"
      },
      {
        "sellerId": "SC3",
        "sellerName": "수호수산(삼천)",
        "businessNumber": "869-97-01669",
        "businessName": "수호수산",
        "representative": "LI ZHUHU",
        "businessAddress": "경상남도 통영시 동호안길 122(동호동)",
        "loadingAddress": "경상남도 통영시 동호안길 122(동호동)",
        "bankAccounts": [
          {
            "bank": "기업",
            "accountNumber": "175-104572-04-012",
            "holder": "LI ZHUHU(수호수산)",
            "isPrimary": true
          }
        ],
        "certificate": {
          "uploaded": false,
          "filename": null
        },
        "status": "inactive"
      }
    ]
  }
};


// 바이어 상세 정보 (소속 사업자 및 키맨 정보)
export const buyerDetails = {
  "1": {
    "keymen": [
      {
        "name": "임종오",
        "phone": "010-3779-5470",
        "role": "대표"
      }
    ],
    "kakaoGroupName": "[하남] 소라수산 거래(판매) 단톡방",
    "paymentCycle": "알아서 제때 잘 줌. 2천만원 넘으면 대표에게만 연락. 단톡방 메세지 금지",
    "complaintIntensity": "강함",
    "mainSuppliers": [
      "상무",
      "피시파더"
    ],
    "priorityFactors": {
      "priority1": "로스",
      "priority2": "살밥",
      "priority3": "단가",
      "priority4": "색깔",
      "priority5": "평체",
      "priority6": "외관",
      "priority7": "기타"
    },
    "arrivalPricePolicy": 800,
    "businesses": [
      {
        "buyerName": "소라수산",
        "buyerId": "SR",
        "businessNumber": "293-88-02840",
        "businessName": "주식회사 소라수산",
        "representative": "임정우",
        "businessAddress": "경기도 하남시 안터로 40-3, 에이4동 202호(풍산동)",
        "unloadingAddress": "경기도 하남시 안터로 40-3, 에이4동 202호(풍산동)",
        "taxInvoiceEmail": "fifabuyer@tidepool.kr",
        "hasCertificate": true,
        "status": "active"
      },
      {
        "buyerName": "소라진조",
        "buyerId": "SRJJ",
        "businessNumber": "126-17-31079",
        "businessName": "소라 진조미식품",
        "representative": "임종호",
        "businessAddress": "경기도 하남시 인터로 40-3",
        "unloadingAddress": "경기도 하남시 인터로 40-3",
        "taxInvoiceEmail": "fifabuyer@tidepool.kr",
        "hasCertificate": false,
        "status": "active"
      }
    ]
  },
  "2": {
    "keymen": [
      {
        "name": "김상남",
        "phone": "010-5278-0347",
        "role": "사무장"
      }
    ],
    "kakaoGroupName": "[인천] 대일유통 거래(판매) 단톡방",
    "paymentCycle": "주 1~2회 정도로 알아서 잘 입금함",
    "complaintIntensity": "매우강함",
    "mainSuppliers": [
      "피시파더",
      "믿음"
    ],
    "priorityFactors": {
      "priority1": "평체",
      "priority2": "살밥",
      "priority3": "로스",
      "priority4": "외관",
      "priority5": "단가"
    },
    "arrivalPricePolicy": 800,
    "businesses": [
      {
        "buyerName": "대일수산",
        "buyerId": "DISS",
        "businessNumber": "786-99-00622",
        "businessName": "대일수산물유통",
        "representative": "김상남외 2인",
        "businessAddress": "인천광역시 중구 연안부두로 109, 제17호(항동7가)",
        "unloadingAddress": "인천광역시 중구 연안부두로 109, 제17호(항동7가)",
        "taxInvoiceEmail": null,
        "hasCertificate": true,
        "status": "active"
      },
      {
        "buyerName": "대일유통",
        "buyerId": "DIYT",
        "businessNumber": "121-99-20705",
        "businessName": "대일유통",
        "representative": "박경서외 2인",
        "businessAddress": "인천광역시 중구 연안부두로 109, 제17호(항동7가)",
        "unloadingAddress": "인천광역시 중구 연안부두로 109, 제17호(항동7가)",
        "taxInvoiceEmail": null,
        "hasCertificate": true,
        "status": "inactive"
      }
    ]
  },
  "3": {
    "keymen": [
      {
        "name": "진은우",
        "phone": "010-4040-0650",
        "role": "대표"
      }
    ],
    "kakaoGroupName": "[대구] 해양수산 거래(판매) 단톡방",
    "paymentCycle": "월초에 미수 갚고, 월말에 쌓이는 패턴 / 2주 정도마다 입금",
    "complaintIntensity": "보통",
    "mainSuppliers": [
      "신화유통"
    ],
    "priorityFactors": {},
    "arrivalPricePolicy": 900,
    "businesses": [
      {
        "buyerName": "진주수산",
        "buyerId": "JJSS",
        "businessNumber": "425-91-01579",
        "businessName": "진주수산",
        "representative": "진승희",
        "businessAddress": "대구광역시 북구 동변로18길 37(동변동)",
        "unloadingAddress": "대구광역시 북구 동변로18길 37(동변동)",
        "taxInvoiceEmail": "fifabuyer@tidepool.kr",
        "hasCertificate": true,
        "status": "active"
      },
      {
        "buyerName": "해양수산",
        "buyerId": "HYSS",
        "businessNumber": "404-91-03696",
        "businessName": "해양종합수산",
        "representative": "진은우",
        "businessAddress": "대구광역시 북구 동변로18길 37(동변동)",
        "unloadingAddress": "대구광역시 북구 동변로18길 37(동변동)",
        "taxInvoiceEmail": "fifabuyer@tidepool.kr",
        "hasCertificate": false,
        "status": "active"
      }
    ]
  },
  "4": {
    "keymen": [
      {
        "name": "가낙현",
        "phone": "010-4113-8966",
        "role": "대표"
      },
      {
        "name": "김아무개",
        "phone": "010-7458-2223",
        "role": "사무장"
      }
    ],
    "kakaoGroupName": "[하남] 영광수산 거래(판매) 단톡방",
    "paymentCycle": "2주 정도 미수 깔고 감",
    "complaintIntensity": "매우강함",
    "mainSuppliers": [
      "진유통",
      "동주유통"
    ],
    "priorityFactors": {},
    "arrivalPricePolicy": 900,
    "businesses": [
      {
        "buyerName": "영광수산",
        "buyerId": "YGSS",
        "businessNumber": "666-86-00503",
        "businessName": "어업회사법인 영광수산 주식회사",
        "representative": "가낙현",
        "businessAddress": "서울특별시 강동구 초광로294번길 144(삼일동)",
        "unloadingAddress": "서울특별시 강동구 초광로294번길 144(삼일동)",
        "taxInvoiceEmail": "fifabuyer@tidepool.kr",
        "hasCertificate": true,
        "status": "active"
      },
      {
        "buyerName": "YG씨푸드",
        "buyerId": "YGSFD",
        "businessNumber": "544-88-03126",
        "businessName": "주식회사 와이지씨푸드",
        "representative": "가낙현",
        "businessAddress": "경기도 하남시 초이로44번길 75, 1층(초이동)",
        "unloadingAddress": "경기도 하남시 초이로44번길 75, 1층(초이동)",
        "taxInvoiceEmail": null,
        "hasCertificate": true,
        "status": "active"
      }
    ]
  },
  "5": {
    "keymen": [
      {
        "name": "김명식",
        "phone": "010-2343-2334",
        "role": "대표"
      },
      {
        "name": "최사무",
        "phone": "010-5235-9824",
        "role": "사무장"
      }
    ],
    "kakaoGroupName": "[노량진] 굿모닝씨푸드 결제 단톡방",
    "paymentCycle": "월말 마감, 익월 5일 결제",
    "complaintIntensity": "보통",
    "mainSuppliers": [
      "피시파더"
    ],
    "priorityFactors": {
      "priority1": "가격"
    },
    "arrivalPricePolicy": null,
    "businesses": [
      {
        "buyerName": "굿모닝씨푸드",
        "buyerId": "GMN",
        "businessNumber": "538-86-02676",
        "businessName": "주식회사 굿모닝씨푸드",
        "representative": "김명식",
        "businessAddress": "서울특별시 동작구 노들로 674, 지하1층 가공처리장 8호",
        "unloadingAddress": "서울특별시 동작구 노들로 674, 지하1층 가공처리장 8호",
        "taxInvoiceEmail": null,
        "hasCertificate": true,
        "status": "active"
      }
    ]
  },
  "6": {
    "keymen": [
      {
        "name": "김세영",
        "phone": "010-4324-2532",
        "role": "대표"
      }
    ],
    "kakaoGroupName": "피시파더/(인천)세희유통 단톡방",
    "paymentCycle": "매주 독촉하지 않으면 안줌. 미수 5천 유지 목표로 계속 추심",
    "complaintIntensity": "낮음",
    "mainSuppliers": [
      "ING",
      "피시파더"
    ],
    "priorityFactors": {},
    "arrivalPricePolicy": null,
    "businesses": [
      {
        "buyerName": "(인천)세희유통",
        "buyerId": "SH3",
        "businessNumber": "121-81-80668",
        "businessName": "주식회사 세희유통",
        "representative": "김세영",
        "businessAddress": "인천광역시 중구 항동7가 65-33",
        "unloadingAddress": "인천광역시 중구 항동7가 65-33",
        "taxInvoiceEmail": null,
        "hasCertificate": false,
        "status": "active"
      }
    ]
  },
  "7": {
    "keymen": [
      {
        "name": "김용범",
        "phone": "010-4443-7744",
        "role": "사무장"
      }
    ],
    "kakaoGroupName": "[인천] 완도전복 거래(판매) 단톡방",
    "paymentCycle": "주 1회 완납",
    "complaintIntensity": "보통",
    "mainSuppliers": [
      "피시파더"
    ],
    "priorityFactors": {},
    "arrivalPricePolicy": 900,
    "businesses": [
      {
        "buyerName": "완도전복",
        "buyerId": "WDJB",
        "businessNumber": "121-86-25485",
        "businessName": "주식회사 완도전복",
        "representative": "김용범",
        "businessAddress": "인천 중구 연안부두로 115번길 17(항동7가)",
        "unloadingAddress": "인천 중구 연안부두로 115번길 17(항동7가)",
        "taxInvoiceEmail": null,
        "hasCertificate": true,
        "status": "active"
      }
    ]
  },
  "8": {
    "keymen": [
      {
        "name": "최정환",
        "phone": "010-9932-3834",
        "role": "상무"
      }
    ],
    "kakaoGroupName": "[인천] 어부수산 거래(판매) 단톡방",
    "paymentCycle": "미수 2천깔고 약 5천 넘어가면 한번씩 입금함",
    "complaintIntensity": "강함",
    "mainSuppliers": [
      "믿음",
      "진"
    ],
    "priorityFactors": {},
    "arrivalPricePolicy": null,
    "businesses": [
      {
        "buyerName": "어부수산",
        "buyerId": "UBSS",
        "businessNumber": "413-86-02343",
        "businessName": "주식회사 어부수산유통",
        "representative": "조미연",
        "businessAddress": "인천광역시 중구 연안부두로 115번길 8",
        "unloadingAddress": "인천광역시 중구 연안부두로 115번길 8",
        "taxInvoiceEmail": "fifabuyer@tidepool.kr",
        "hasCertificate": true,
        "status": "active"
      }
    ]
  },
  "9": {
    "keymen": [
      {
        "name": "박정식",
        "phone": "010-9842-9874",
        "role": "대표"
      }
    ],
    "kakaoGroupName": "[인천] 바다로수산 거래(판매) 단톡방",
    "paymentCycle": "미수 5천 쌓이면 완납",
    "complaintIntensity": null,
    "mainSuppliers": [
      "섬유통"
    ],
    "priorityFactors": {},
    "arrivalPricePolicy": 800,
    "businesses": [
      {
        "buyerName": "바다로수산",
        "buyerId": "BDRSS",
        "businessNumber": "297-88-02217",
        "businessName": "주식회사 바다로수산",
        "representative": "정기혁",
        "businessAddress": "인천광역시 중구 연안부두로 97",
        "unloadingAddress": "인천광역시 중구 연안부두로 97",
        "taxInvoiceEmail": null,
        "hasCertificate": false,
        "status": "active"
      }
    ]
  },
  "10": {
    "keymen": [
      {
        "name": "김병한",
        "phone": "010-2343-2343",
        "role": "대표"
      }
    ],
    "kakaoGroupName": "[노량진]나인씨월드 거래(판매) 단톡방",
    "paymentCycle": "납품 후 4일 이내 완납",
    "complaintIntensity": "보통",
    "mainSuppliers": [],
    "priorityFactors": {},
    "arrivalPricePolicy": 800,
    "businesses": [
      {
        "buyerName": "나인씨월드",
        "buyerId": "NISWD",
        "businessNumber": "899-81-00471",
        "businessName": "주식회사 나인씨월드",
        "representative": "김병한",
        "businessAddress": "서울특별시 동작구 노들로 674, 지하 1층 7,8호(노량진동, 활어보관장)",
        "unloadingAddress": "서울특별시 동작구 노들로 674, 지하 1층 7,8호(노량진동, 활어보관장)",
        "taxInvoiceEmail": null,
        "hasCertificate": true,
        "status": "active"
      }
    ]
  },
  "11": {
    "keymen": [
      {
        "name": "백경식",
        "phone": "010-2342-3242",
        "role": "사무장"
      }
    ],
    "kakaoGroupName": "[세종] 백두회수산 거래(판매) 단톡방",
    "paymentCycle": "납품 후 일주일 이내 일부 입금(미수 1천씩 깔고 감0",
    "complaintIntensity": "보통",
    "mainSuppliers": [
      "세은",
      "믿음"
    ],
    "priorityFactors": {},
    "arrivalPricePolicy": 800,
    "businesses": [
      {
        "buyerName": "백두회수산",
        "buyerId": "BDHSS",
        "businessNumber": "483-94-01732",
        "businessName": "백두회수산",
        "representative": "박종열",
        "businessAddress": "세종특별자치시 고운서4길 7,1층일부(고운동)",
        "unloadingAddress": "세종특별자치시 고운서4길 7,1층일부(고운동)",
        "taxInvoiceEmail": "fifabuyer@tidepool.kr",
        "hasCertificate": true,
        "status": "active"
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
    salesPersons: ['노원진'],
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
    salesPersons: ['노원진', '고영석'],
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
    salesPersons: ['노원진'],
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
    주문중량: 2500,
    상차단가: 15000,
    상차수수료율: 5,
    통당운임단가: 150000,
    운송비포함여부: '포함',
    도착단가: 16200,
    도착단가정책: '+800원',
    알파수익단가: 400,
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
    주문중량: 2000,
    상차단가: 18000,
    상차수수료율: 5,
    통당운임단가: 150000,
    운송비포함여부: '포함',
    도착단가: 18900,
    도착단가정책: '+900원',
    알파수익단가: 0,
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
    주문중량: 3750,
    상차단가: 12000,
    상차수수료율: 5,
    통당운임단가: 150000,
    운송비포함여부: '포함',
    도착단가: 13000,
    도착단가정책: null,
    알파수익단가: null,
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
    주문중량: 1600,
    상차단가: 10000,
    상차수수료율: 5,
    통당운임단가: 120000,
    운송비포함여부: '포함',
    도착단가: 11000,
    도착단가정책: null,
    알파수익단가: null,
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
    주문중량: 480,
    상차단가: 22000,
    상차수수료율: 5,
    통당운임단가: 120000,
    운송비포함여부: '포함',
    도착단가: 24000,
    도착단가정책: null,
    알파수익단가: null,
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
    주문중량: 400,
    상차단가: 25000,
    상차수수료율: 5,
    통당운임단가: 120000,
    운송비포함여부: '미포함',
    도착단가: 27000,
    도착단가정책: null,
    알파수익단가: null,
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
    주문중량: 3000,
    상차단가: 13000,
    상차수수료율: 5,
    통당운임단가: 150000,
    운송비포함여부: '포함',
    도착단가: 13900,
    도착단가정책: '+900원',
    알파수익단가: 0,
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
    주문중량: 2250,
    상차단가: 14000,
    상차수수료율: 5,
    통당운임단가: 150000,
    운송비포함여부: '포함',
    도착단가: 15200,
    도착단가정책: null,
    알파수익단가: null,
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
  // 2026-07-24 테스트 데이터 (클레임 등록 테스트용)
  {
    key: 2053,
    주문코드: 'ORD-20260724-001',
    거래코드: 'TXN-20260724-001',
    운송코드: 'TRANS-20260724-001',
    주문일: '2026-07-23',
    납품일: '2026-07-24',
    품목: '넙치',
    원산지: '완도',
    규격: '1.2kg',
    주문수량: 12,
    주문단위: '통',
    주문중량: 3000,
    상차단가: 16000,
    상차수수료율: 3,
    통당운임단가: 12000,
    운송비포함여부: '포함',
    도착단가: 17200,
    도착단가정책: '+1200원',
    알파수익단가: 500,
    셀러명: '김소라',
    셀러그룹명: '소라 그룹',
    바이어명: '대일수산',
    바이어그룹명: '대일 그룹',
    바이어사업권역: '수도권',
    드라이버명: '최기사',
    '클레임/조정 유형': '',
    '클레임/조정 내용': '',
    바이어정산조정금액: 0,
    셀러정산조정물량: '',
    셀러정산조정금액: 0,
    드라이버정산조정금액: 0,
    회계처리용조정금액: 0,
    매출액: 206400,
    매입액: 192000,
    '운송비(비용)': 2880,
    거래손익: 11520,
    상차수수료수익: 5760,
    셀러조정손익: 0,
    바이어조정손익: 0,
    거래메모: '',
  },
  {
    key: 2054,
    주문코드: 'ORD-20260724-002',
    거래코드: 'TXN-20260724-002',
    운송코드: 'TRANS-20260724-002',
    주문일: '2026-07-23',
    납품일: '2026-07-24',
    품목: '광어',
    원산지: '통영',
    규격: '1.5kg',
    주문수량: 8,
    주문단위: '통',
    주문중량: 2000,
    상차단가: 21000,
    상차수수료율: 3,
    통당운임단가: 12000,
    운송비포함여부: '포함',
    도착단가: 22500,
    도착단가정책: '+1500원',
    알파수익단가: 500,
    셀러명: '김소라',
    셀러그룹명: '소라 그룹',
    바이어명: '대일수산',
    바이어그룹명: '대일 그룹',
    바이어사업권역: '수도권',
    드라이버명: '정기사',
    '클레임/조정 유형': '',
    '클레임/조정 내용': '',
    바이어정산조정금액: 0,
    셀러정산조정물량: '',
    셀러정산조정금액: 0,
    드라이버정산조정금액: 0,
    회계처리용조정금액: 0,
    매출액: 180000,
    매입액: 168000,
    '운송비(비용)': 1920,
    거래손익: 10080,
    상차수수료수익: 5040,
    셀러조정손익: 0,
    바이어조정손익: 0,
    거래메모: '',
  },
  {
    key: 2055,
    주문코드: 'ORD-20260724-003',
    거래코드: 'TXN-20260724-003',
    운송코드: 'TRANS-20260724-003',
    주문일: '2026-07-23',
    납품일: '2026-07-24',
    품목: '우럭',
    원산지: '통영',
    규격: '0.8kg',
    주문수량: 20,
    주문단위: '통',
    주문중량: 1600,
    상차단가: 13000,
    상차수수료율: 3,
    통당운임단가: 10000,
    운송비포함여부: '포함',
    도착단가: 14500,
    도착단가정책: '+1500원',
    알파수익단가: 500,
    셀러명: '김소라',
    셀러그룹명: '소라 그룹',
    바이어명: '대일수산',
    바이어그룹명: '대일 그룹',
    바이어사업권역: '수도권',
    드라이버명: '최기사',
    '클레임/조정 유형': '',
    '클레임/조정 내용': '',
    바이어정산조정금액: 0,
    셀러정산조정물량: '',
    셀러정산조정금액: 0,
    드라이버정산조정금액: 0,
    회계처리용조정금액: 0,
    매출액: 232000,
    매입액: 208000,
    '운송비(비용)': 4000,
    거래손익: 20000,
    상차수수료수익: 6240,
    셀러조정손익: 0,
    바이어조정손익: 0,
    거래메모: '',
  },
];

// 클레임/조정 데이터
export const claimAdjustmentData = [
  {
    id: 1,
    거래코드: 'TXN-20260718-001',
    납품일: '2026-07-18',
    주문일: '2026-07-17',
    품목: '넙치',
    원산지: '완도',
    규격: '1.2kg',
    바이어명: '박노량',
    바이어그룹명: '노량진상회',
    바이어사업권역: '서울',
    셀러명: '김완도',
    셀러그룹명: '해금 그룹',
    드라이버명: '김기사',
    클레임유형: '폐사',
    심각도: '심각',
    클레임내용: '운송 중 1통 폐사, 외관 상처 多',
    장부반영여부: true,
    주문수량: 10,
    주문중량: 250,
    상차단가: 18000,
    상차수수료율: 0.5,
    도착단가: 19500,
    알파수익단가: 600,
    통당운임단가: 15000,
    운송비포함여부: '포함',
    매출액: 4875000,
    매입액: 4500000,
    '운송비(비용)': 150000,
    상차수수료수익: 22500,
    바이어조정액: -19500,
    셀러조정물량: '-1통',
    셀러조정액: -18000,
    드라이버조정액: -350,
    회계처리조정액: -10000,
    최종손실: -47850,
    귀책: '셀러',
    거래손익: 199650,
    셀러조정손익: 71975,
    바이어조정손익: 127675,
    거래메모: '',
  },
  {
    id: 2,
    거래코드: 'TXN-20260719-002',
    납품일: '2026-07-19',
    주문일: '2026-07-18',
    품목: '우럭',
    원산지: '통영',
    규격: '1kg',
    바이어명: '이대박',
    바이어그룹명: '대박수산그룹',
    바이어사업권역: '부산',
    셀러명: '박통영',
    셀러그룹명: '갑운 그룹',
    드라이버명: '이기사',
    클레임유형: '사이즈',
    심각도: '보통',
    클레임내용: '규격이 약간 작음, 바이어 요청으로 일부 환불',
    장부반영여부: true,
    주문수량: 15,
    주문중량: 1200,
    상차단가: 12000,
    상차수수료율: 1.0,
    도착단가: 13500,
    알파수익단가: 0,
    통당운임단가: 12000,
    운송비포함여부: '포함',
    매출액: 16200000,
    매입액: 14400000,
    '운송비(비용)': 180000,
    상차수수료수익: 144000,
    바이어조정액: -27000,
    셀러조정물량: '-2통',
    셀러조정액: -24000,
    드라이버조정액: 0,
    회계처리조정액: 0,
    최종손실: -51000,
    귀책: '셀러',
    거래손익: 1713000,
    셀러조정손익: 805500,
    바이어조정손익: 907500,
    거래메모: '사이즈 미달로 조정',
  },
  {
    id: 3,
    거래코드: 'TXN-20260720-003',
    납품일: '2026-07-20',
    주문일: '2026-07-19',
    품목: '넙치',
    원산지: '제주',
    규격: '1.5kg',
    바이어명: '김노량',
    바이어그룹명: '노량진상회',
    바이어사업권역: '서울',
    셀러명: '제주수산',
    셀러그룹명: '제주수산그룹',
    드라이버명: '박기사',
    클레임유형: '외관',
    심각도: '매우심각',
    클레임내용: '외관 불량 심각, 스크래치 多, 바이어 재판매 불가 판정으로 전량 환불 요구',
    장부반영여부: true,
    주문수량: 8,
    주문중량: 2000,
    상차단가: 16000,
    상차수수료율: 0.5,
    도착단가: 17200,
    알파수익단가: 300,
    통당운임단가: 15000,
    운송비포함여부: '포함',
    매출액: 34400000,
    매입액: 32000000,
    '운송비(비용)': 120000,
    상차수수료수익: 160000,
    바이어조정액: -68800,
    셀러조정물량: '-4통',
    셀러조정액: -64000,
    드라이버조정액: 0,
    회계처리조정액: -20000,
    최종손실: -152800,
    귀책: '셀러',
    거래손익: 2287200,
    셀러조정손익: 1067200,
    바이어조정손익: 1220000,
    거래메모: '외관 불량 심각',
  },
  {
    id: 4,
    거래코드: 'TXN-20260715-004',
    납품일: '2026-07-15',
    주문일: '2026-07-14',
    품목: '광어',
    원산지: '완도',
    규격: '2.0kg',
    바이어명: '박가락',
    바이어그룹명: '가락시장상회',
    바이어사업권역: '서울',
    셀러명: '김여수',
    셀러그룹명: '여수수산그룹',
    드라이버명: '김기사',
    클레임유형: '로스',
    심각도: '심각',
    클레임내용: '운송 중 로스 발생 3kg, 포장 불량으로 추정',
    장부반영여부: true,
    주문수량: 6,
    주문중량: 1500,
    상차단가: 20000,
    상차수수료율: 1.2,
    도착단가: 22000,
    알파수익단가: 0,
    통당운임단가: 18000,
    운송비포함여부: '포함',
    매출액: 33000000,
    매입액: 30000000,
    '운송비(비용)': 108000,
    상차수수료수익: 360000,
    바이어조정액: -66000,
    셀러조정물량: '-3kg',
    셀러조정액: -60000,
    드라이버조정액: -5000,
    회계처리조정액: -15000,
    최종손실: -146000,
    귀책: '공동',
    거래손익: 3179000,
    셀러조정손익: 1516500,
    바이어조정손익: 1662500,
    거래메모: '포장 불량으로 로스 발생',
  },
  {
    id: 5,
    거래코드: 'TXN-20260714-005',
    납품일: '2026-07-14',
    주문일: '2026-07-13',
    품목: '도미',
    원산지: '고흥',
    규격: '0.8kg',
    바이어명: '최대구',
    바이어그룹명: '대구수산상회',
    바이어사업권역: '경상권',
    셀러명: '박고흥',
    셀러그룹명: '고흥수산그룹',
    드라이버명: '이기사',
    클레임유형: '기타',
    심각도: '보통',
    클레임내용: '구두 경고 - 다음부터 더 신경써달라는 요청만 있음',
    장부반영여부: false,
    주문수량: 20,
    주문중량: 1600,
    상차단가: 8000,
    상차수수료율: 0.8,
    도착단가: 9000,
    알파수익단가: 0,
    통당운임단가: 12000,
    운송비포함여부: '포함',
    매출액: 14400000,
    매입액: 12800000,
    '운송비(비용)': 240000,
    상차수수료수익: 102400,
    바이어조정액: 0,
    셀러조정물량: '0통',
    셀러조정액: 0,
    드라이버조정액: 0,
    회계처리조정액: 0,
    최종손실: 0,
    귀책: null,
    거래손익: 1462400,
    셀러조정손익: 731200,
    바이어조정손익: 731200,
    거래메모: '구두 경고만',
  },
  {
    id: 6,
    거래코드: 'TXN-20260721-006',
    납품일: '2026-07-21',
    주문일: '2026-07-20',
    품목: '넙치',
    원산지: '완도',
    규격: '1.3kg(특대)',
    바이어명: '박노량',
    바이어그룹명: '노량진상회',
    바이어사업권역: '서울',
    셀러명: '완도수산',
    셀러그룹명: '완도수산그룹',
    드라이버명: '박기사',
    클레임유형: '살밥',
    심각도: '심각',
    클레임내용: '살밥 불량 지적, 바이어 재판매 시 가격 낮게 책정되어 일부 환불',
    장부반영여부: true,
    주문수량: 12,
    주문중량: 3000,
    상차단가: 19000,
    상차수수료율: 1.0,
    도착단가: 20500,
    알파수익단가: 600,
    통당운임단가: 15000,
    운송비포함여부: '포함',
    매출액: 61500000,
    매입액: 57000000,
    '운송비(비용)': 180000,
    상차수수료수익: 570000,
    바이어조정액: -41000,
    셀러조정물량: '0통',
    셀러조정액: -30000,
    드라이버조정액: 0,
    회계처리조정액: 0,
    최종손실: -71000,
    귀책: '바이어',
    거래손익: 4819000,
    셀러조정손익: 2445000,
    바이어조정손익: 2374000,
    거래메모: '살밥 불량',
  },
];

// 표준가격 데이터
export const standardPriceData = [
  // 2026-07-09 - 넙치 제주 (피시파더)
  { date: '2026-07-09', product: '넙치', origin: '제주', spec: '400g', price: 13000, supplier: '피시파더' },
  { date: '2026-07-09', product: '넙치', origin: '제주', spec: '500g', price: 14000, supplier: '피시파더' },
  { date: '2026-07-09', product: '넙치', origin: '제주', spec: '600g', price: 14000, supplier: '피시파더' },
  { date: '2026-07-09', product: '넙치', origin: '제주', spec: '650g', price: 14500, supplier: '피시파더' },
  { date: '2026-07-09', product: '넙치', origin: '제주', spec: '700g', price: 14500, supplier: '피시파더' },
  { date: '2026-07-09', product: '넙치', origin: '제주', spec: '750g', price: 15000, supplier: '피시파더' },
  { date: '2026-07-09', product: '넙치', origin: '제주', spec: '800g', price: 15000, supplier: '피시파더' },
  { date: '2026-07-09', product: '넙치', origin: '제주', spec: '850g', price: 15500, supplier: '피시파더' },
  { date: '2026-07-09', product: '넙치', origin: '제주', spec: '900g', price: 15500, supplier: '피시파더' },
  { date: '2026-07-09', product: '넙치', origin: '제주', spec: '950g', price: 15500, supplier: '피시파더' },
  { date: '2026-07-09', product: '넙치', origin: '제주', spec: '1.0kg', price: 16500, supplier: '피시파더' },
  { date: '2026-07-09', product: '넙치', origin: '제주', spec: '1.1kg', price: 17000, supplier: '피시파더' },
  { date: '2026-07-09', product: '넙치', origin: '제주', spec: '1.2kg', price: 17000, supplier: '피시파더' },
  { date: '2026-07-09', product: '넙치', origin: '제주', spec: '1.3kg', price: 17500, supplier: '피시파더' },
  { date: '2026-07-09', product: '넙치', origin: '제주', spec: '1.4kg', price: 18000, supplier: '피시파더' },
  { date: '2026-07-09', product: '넙치', origin: '제주', spec: '1.5kg', price: 18500, supplier: '피시파더' },
  { date: '2026-07-09', product: '넙치', origin: '제주', spec: '1.6kg', price: 19000, supplier: '피시파더' },
  { date: '2026-07-09', product: '넙치', origin: '제주', spec: '1.7kg', price: 19500, supplier: '피시파더' },
  { date: '2026-07-09', product: '넙치', origin: '제주', spec: '1.8kg', price: 20000, supplier: '피시파더' },
  { date: '2026-07-09', product: '넙치', origin: '제주', spec: '1.9kg', price: 21000, supplier: '피시파더' },
  { date: '2026-07-09', product: '넙치', origin: '제주', spec: '2.0kg', price: 22500, supplier: '피시파더' },
  { date: '2026-07-09', product: '넙치', origin: '제주', spec: '2.1kg', price: 22500, supplier: '피시파더' },
  { date: '2026-07-09', product: '넙치', origin: '제주', spec: '2.2kg', price: 22500, supplier: '피시파더' },
  { date: '2026-07-09', product: '넙치', origin: '제주', spec: '2.3kg', price: 23500, supplier: '피시파더' },
  { date: '2026-07-09', product: '넙치', origin: '제주', spec: '2.4kg', price: 24000, supplier: '피시파더' },
  { date: '2026-07-09', product: '넙치', origin: '제주', spec: '2.5kg', price: 26500, supplier: '피시파더' },
  { date: '2026-07-09', product: '넙치', origin: '제주', spec: '2.6kg', price: 26500, supplier: '피시파더' },
  { date: '2026-07-09', product: '넙치', origin: '제주', spec: '2.7kg', price: 26500, supplier: '피시파더' },
  { date: '2026-07-09', product: '넙치', origin: '제주', spec: '2.8kg', price: 28000, supplier: '피시파더' },
  { date: '2026-07-09', product: '넙치', origin: '제주', spec: '2.9kg', price: 28000, supplier: '피시파더' },
  { date: '2026-07-09', product: '넙치', origin: '제주', spec: '3.0kg', price: 29500, supplier: '피시파더' },
  // 2026-07-09 - 넙치 완도 (피시파더)
  { date: '2026-07-09', product: '넙치', origin: '완도', spec: '600g', price: 16500, supplier: '피시파더' },
  { date: '2026-07-09', product: '넙치', origin: '완도', spec: '650g', price: 16500, supplier: '피시파더' },
  { date: '2026-07-09', product: '넙치', origin: '완도', spec: '700g', price: 17000, supplier: '피시파더' },
  { date: '2026-07-09', product: '넙치', origin: '완도', spec: '750g', price: 17500, supplier: '피시파더' },
  { date: '2026-07-09', product: '넙치', origin: '완도', spec: '800g', price: 18000, supplier: '피시파더' },
  { date: '2026-07-09', product: '넙치', origin: '완도', spec: '850g', price: 18000, supplier: '피시파더' },
  { date: '2026-07-09', product: '넙치', origin: '완도', spec: '900g', price: 19000, supplier: '피시파더' },
  { date: '2026-07-09', product: '넙치', origin: '완도', spec: '950g', price: 19000, supplier: '피시파더' },
  { date: '2026-07-09', product: '넙치', origin: '완도', spec: '1.0kg', price: 19000, supplier: '피시파더' },
  { date: '2026-07-09', product: '넙치', origin: '완도', spec: '1.1kg', price: 19500, supplier: '피시파더' },
  { date: '2026-07-09', product: '넙치', origin: '완도', spec: '1.2kg', price: 19500, supplier: '피시파더' },
  { date: '2026-07-09', product: '넙치', origin: '완도', spec: '1.3kg', price: 19500, supplier: '피시파더' },
  { date: '2026-07-09', product: '넙치', origin: '완도', spec: '1.4kg', price: 20000, supplier: '피시파더' },
  { date: '2026-07-09', product: '넙치', origin: '완도', spec: '1.5kg', price: 21000, supplier: '피시파더' },
  { date: '2026-07-09', product: '넙치', origin: '완도', spec: '1.6kg', price: 21000, supplier: '피시파더' },
  { date: '2026-07-09', product: '넙치', origin: '완도', spec: '1.7kg', price: 22000, supplier: '피시파더' },
  { date: '2026-07-09', product: '넙치', origin: '완도', spec: '1.8kg', price: 22000, supplier: '피시파더' },
  { date: '2026-07-09', product: '넙치', origin: '완도', spec: '1.9kg', price: 23000, supplier: '피시파더' },
  { date: '2026-07-09', product: '넙치', origin: '완도', spec: '2.0kg', price: 23000, supplier: '피시파더' },
  { date: '2026-07-09', product: '넙치', origin: '완도', spec: '2.1kg', price: 24000, supplier: '피시파더' },
  { date: '2026-07-09', product: '넙치', origin: '완도', spec: '2.2kg', price: 24000, supplier: '피시파더' },
  { date: '2026-07-09', product: '넙치', origin: '완도', spec: '2.3kg', price: 25000, supplier: '피시파더' },
  { date: '2026-07-09', product: '넙치', origin: '완도', spec: '2.4kg', price: 26000, supplier: '피시파더' },
  { date: '2026-07-09', product: '넙치', origin: '완도', spec: '2.5kg', price: 28000, supplier: '피시파더' },
  { date: '2026-07-09', product: '넙치', origin: '완도', spec: '2.6kg', price: 29000, supplier: '피시파더' },
  { date: '2026-07-09', product: '넙치', origin: '완도', spec: '2.7kg', price: 30000, supplier: '피시파더' },
  { date: '2026-07-09', product: '넙치', origin: '완도', spec: '2.8kg', price: 30000, supplier: '피시파더' },
  { date: '2026-07-09', product: '넙치', origin: '완도', spec: '2.9kg', price: 30000, supplier: '피시파더' },
  { date: '2026-07-09', product: '넙치', origin: '완도', spec: '3.0kg', price: 31000, supplier: '피시파더' },
];
