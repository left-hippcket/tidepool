/**
 * ticker 중복 검사 및 사업자 조회 유틸리티
 *
 * 핵심 원칙:
 * - ticker는 사업자등록번호당 1개
 * - 같은 사업자는 모든 역할(바이어/셀러/드라이버/조인유통)에서 동일한 ticker 사용
 * - 다른 사업자는 절대 같은 ticker 사용 불가
 */

import { sellerGroups, sellerDetails, buyerGroups, joinGroups, drivers, driverDetails } from '../data/mockData';

/**
 * 모든 파트너 데이터를 ticker로 조회
 * @param {string} ticker
 * @returns {Array} 해당 ticker를 사용하는 모든 파트너 목록
 */
export function findAllPartnersByTicker(ticker) {
  if (!ticker) return [];

  const tickerLower = ticker.toLowerCase();
  const partners = [];

  // 셀러 조회
  sellerGroups.forEach(group => {
    const detail = sellerDetails[group.id];
    if (detail?.businesses) {
      detail.businesses.forEach(business => {
        if (business.sellerId?.toLowerCase() === tickerLower) {
          partners.push({
            type: 'seller',
            ticker: business.sellerId,
            businessNumber: business.businessNumber,
            name: business.sellerName,
            groupName: group.name,
            groupId: group.id
          });
        }
      });
    }
  });

  // 바이어 조회
  buyerGroups.forEach(group => {
    // buyerGroups에는 ticker 필드가 없으므로 상세 정보에서 조회해야 함
    // TODO: buyerDetails 구조 확인 필요
    if (group.ticker?.toLowerCase() === tickerLower) {
      partners.push({
        type: 'buyer',
        ticker: group.ticker,
        businessNumber: group.businessNumber,
        name: group.name,
        groupId: group.id
      });
    }
  });

  // 조인유통 조회
  joinGroups.forEach(group => {
    if (group.ticker?.toLowerCase() === tickerLower) {
      partners.push({
        type: 'join',
        ticker: group.ticker,
        businessNumber: group.businessNumber,
        name: group.name,
        groupId: group.id
      });
    }
  });

  // 드라이버 조회
  drivers.forEach(driver => {
    if (driver.ticker?.toLowerCase() === tickerLower) {
      const detail = driverDetails[driver.id];
      partners.push({
        type: 'driver',
        ticker: driver.ticker,
        businessNumber: detail?.settlementInfo?.businessNumber,
        name: driver.name,
        driverId: driver.id
      });
    }
  });

  return partners;
}

/**
 * 사업자등록번호로 모든 파트너 조회
 * @param {string} businessNumber
 * @returns {Array} 해당 사업자등록번호를 가진 모든 파트너 목록
 */
export function findPartnerByBusinessNumber(businessNumber) {
  if (!businessNumber) return [];

  const partners = [];

  // 셀러 조회
  sellerGroups.forEach(group => {
    const detail = sellerDetails[group.id];
    if (detail?.businesses) {
      detail.businesses.forEach(business => {
        if (business.businessNumber === businessNumber) {
          partners.push({
            type: 'seller',
            ticker: business.sellerId,
            businessNumber: business.businessNumber,
            name: business.sellerName,
            groupName: group.name,
            groupId: group.id,
            businessName: business.businessName,
            representative: business.representative,
            businessAddress: business.businessAddress
          });
        }
      });
    }
  });

  // 바이어 조회
  buyerGroups.forEach(group => {
    if (group.businessNumber === businessNumber) {
      partners.push({
        type: 'buyer',
        ticker: group.ticker,
        businessNumber: group.businessNumber,
        name: group.name,
        groupId: group.id
      });
    }
  });

  // 조인유통 조회
  joinGroups.forEach(group => {
    if (group.businessNumber === businessNumber) {
      partners.push({
        type: 'join',
        ticker: group.ticker,
        businessNumber: group.businessNumber,
        name: group.name,
        groupId: group.id
      });
    }
  });

  // 드라이버 조회
  drivers.forEach(driver => {
    const detail = driverDetails[driver.id];
    if (detail?.settlementInfo?.businessNumber === businessNumber) {
      partners.push({
        type: 'driver',
        ticker: driver.ticker,
        businessNumber: detail.settlementInfo.businessNumber,
        name: driver.name,
        driverId: driver.id
      });
    }
  });

  return partners;
}

/**
 * ticker 중복 검사
 * @param {string} ticker
 * @param {string} businessNumber
 * @param {string} currentGroupId - 수정 모드일 때 현재 그룹 ID (중복 검사에서 제외)
 * @returns {Object} { valid: boolean, error?: string, message: string, info?: Object }
 */
export function validateTicker(ticker, businessNumber = null, currentGroupId = null) {
  if (!ticker) {
    return {
      valid: false,
      error: 'TICKER_REQUIRED',
      message: 'Ticker를 입력해주세요.'
    };
  }

  // 1. ticker 중복 조회 (모든 유형)
  const existingPartners = findAllPartnersByTicker(ticker);

  // 현재 편집 중인 항목 제외
  const filteredPartners = existingPartners.filter(p => {
    if (currentGroupId && p.groupId) {
      return p.groupId !== parseInt(currentGroupId);
    }
    return true;
  });

  if (filteredPartners.length === 0) {
    // 신규 ticker → 허용
    return {
      valid: true,
      message: '사용 가능한 ticker입니다.'
    };
  }

  // 2. 중복된 ticker 발견
  const existingPartner = filteredPartners[0];

  if (!businessNumber) {
    // 사업자등록번호 없음 → 거부
    return {
      valid: false,
      error: 'TICKER_DUPLICATE_NO_BUSINESS_NUMBER',
      message: '중복된 ticker입니다. 기존 사업자와 동일한 경우 사업자등록번호를 입력해주세요.',
      existingPartner
    };
  }

  // 3. 사업자등록번호로 비교
  const existingBusinessNumber = existingPartner.businessNumber;

  if (!existingBusinessNumber) {
    // 기존 파트너에 사업자등록번호가 없는 경우
    return {
      valid: false,
      error: 'EXISTING_PARTNER_NO_BUSINESS_NUMBER',
      message: `이미 사용 중인 ticker입니다. 기존 등록 정보(${existingPartner.type}: ${existingPartner.name})에 사업자등록번호가 없어 동일 사업자 여부를 확인할 수 없습니다. 다른 ticker를 사용해주세요.`,
      existingPartner
    };
  }

  if (businessNumber === existingBusinessNumber) {
    // 같은 사업자 → 허용
    const typeNames = {
      seller: '셀러',
      buyer: '바이어',
      driver: '드라이버',
      join: '조인유통'
    };

    return {
      valid: true,
      info: 'SAME_BUSINESS',
      message: `기존 사업자와 동일한 ticker를 사용합니다. (${typeNames[existingPartner.type]}: ${existingPartner.name})`,
      existingPartner
    };
  } else {
    // 다른 사업자 → 거부
    return {
      valid: false,
      error: 'TICKER_DUPLICATE_DIFFERENT_BUSINESS',
      message: `이미 다른 사업자(${existingBusinessNumber})가 사용 중인 ticker입니다. Ticker를 변경해주세요.`,
      existingPartner
    };
  }
}

/**
 * 파트너 타입명 한글 변환
 */
export const PARTNER_TYPE_NAMES = {
  seller: '셀러',
  buyer: '바이어',
  driver: '드라이버',
  join: '조인유통'
};
