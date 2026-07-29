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
