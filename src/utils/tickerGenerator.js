/**
 * 한글 이름 -> Ticker 자동 생성기
 *
 * 규칙:
 * 1) 괄호 안 지역명, 업종 접미어(수산/유통/활어/씨푸드 등)를 제거해 '핵심 이름'을 뽑는다
 * 2) 핵심 이름의 초성을 알파벳으로 변환한다 (예: 삼광 -> SG, 활주로 -> HJR)
 * 3) 기본 2자리로 만들고, 이미 쓰는 티커면 3자리 -> 4자리로 늘린다
 * 4) 그래도 겹치면 뒤에 숫자를 붙인다 (SH -> SH2 -> SH3)
 */

// 한글 초성 -> 알파벳 매핑
const CHO_MAP = {
  'ㄱ': 'G', 'ㄲ': 'G', 'ㄴ': 'N', 'ㄷ': 'D', 'ㄸ': 'D', 'ㄹ': 'R',
  'ㅁ': 'M', 'ㅂ': 'B', 'ㅃ': 'B', 'ㅅ': 'S', 'ㅆ': 'S', 'ㅇ': '',
  'ㅈ': 'J', 'ㅉ': 'J', 'ㅊ': 'C', 'ㅋ': 'K', 'ㅌ': 'T', 'ㅍ': 'P', 'ㅎ': 'H',
};

// 초성이 'ㅇ'이면 모음으로 알파벳을 정한다 (영광 -> YG, 완도 -> WD)
const JUNG_MAP = {
  'ㅏ': 'A', 'ㅐ': 'A', 'ㅑ': 'Y', 'ㅒ': 'Y', 'ㅓ': 'E', 'ㅔ': 'E',
  'ㅕ': 'Y', 'ㅖ': 'Y', 'ㅗ': 'O', 'ㅘ': 'W', 'ㅙ': 'W', 'ㅚ': 'O',
  'ㅛ': 'Y', 'ㅜ': 'U', 'ㅝ': 'W', 'ㅞ': 'W', 'ㅟ': 'W', 'ㅠ': 'Y',
  'ㅡ': 'E', 'ㅢ': 'E', 'ㅣ': 'I',
};

// 잘라낼 업종 접미어 (긴 것부터 검사)
const SUFFIXES = [
  '글로벌씨푸드', '종합수산', '씨푸드', '씨월드', '홀딩스', '수산물',
  '활어유통', '수산', '유통', '활어', '물산', '식품', '상회', '수협',
  '무역', '산업', '농산', '축산', '직판장', '판매장', '종합', '글로벌',
];

/**
 * 한글 음절 1자 -> 알파벳 1자
 */
function syllableToLetter(ch) {
  const code = ch.charCodeAt(0);
  const base = 0xAC00;

  if (code < base || code > 0xD7A3) {
    return ch.toUpperCase();
  }

  const offset = code - base;
  const choIndex = Math.floor(offset / 588);
  const jungIndex = Math.floor((offset % 588) / 28);

  const cho = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'][choIndex];
  const jung = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'][jungIndex];

  const choLetter = CHO_MAP[cho];
  if (choLetter) {
    return choLetter;
  }

  return JUNG_MAP[jung] || 'X';
}

/**
 * 괄호, 공백, 특수문자, 업종 접미어 제거
 */
function cleanName(name) {
  if (!name) return '';

  // 괄호 안 내용 제거 (창원), (김영호) 등
  let core = name.replace(/[(（\[].*?[)）\]]/g, '');

  // 공백/기호 제거
  core = core.replace(/[^0-9A-Za-z가-힣]/g, '');

  // 접미어 제거 (한 번만)
  for (const suffix of SUFFIXES) {
    if (core.endsWith(suffix) && core.length > suffix.length) {
      core = core.slice(0, -suffix.length);
      break;
    }
  }

  return core || name.replace(/[^0-9A-Za-z가-힣]/g, '');
}

/**
 * 거래처명 -> 초성 알파벳 문자열 (예: '노량진 청산' -> 'CS', 'MK씨푸드' -> 'MK')
 */
function toInitials(name) {
  const cleaned = cleanName(name);
  const letters = [];

  for (const ch of cleaned) {
    if (ch >= '가' && ch <= '힣') {
      letters.push(syllableToLetter(ch));
    } else if (/[A-Za-z0-9]/.test(ch)) {
      letters.push(ch.toUpperCase());
    }
  }

  return letters.join('') || 'CO';
}

/**
 * 중복되지 않는 티커 1개를 반환한다.
 *
 * @param {string} name - 신규 거래처명
 * @param {Array<string>} existingTickers - 기존 티커 배열
 * @param {number} maxLen - 티커 최대 길이 (기본 4)
 * @param {string} prefix - 지역 구분용 접두어 (선택)
 * @returns {string} 생성된 티커
 */
export function generateTicker(name, existingTickers = [], maxLen = 4, prefix = '') {
  if (!name || !name.trim()) {
    return '';
  }

  // 기존 티커를 대문자로 정규화
  const used = new Set(
    existingTickers
      .filter(t => t && t.trim())
      .map(t => t.trim().toUpperCase())
  );

  const initials = (prefix.toUpperCase() + toInitials(name)).slice(0, 12);
  const baseLength = Math.min(initials.length, maxLen);
  let base = initials.slice(0, baseLength);

  // 기본 길이로 사용 가능하면 반환
  if (!used.has(base)) {
    return base;
  }

  // 이름에 음절이 더 남아 있으면 한 자씩 늘려본다
  for (let n = baseLength + 1; n <= Math.min(initials.length, maxLen + 2); n++) {
    const candidate = initials.slice(0, n);
    if (!used.has(candidate)) {
      return candidate;
    }
  }

  // 그래도 겹치면 숫자를 붙인다 (SH -> SH2 -> SH3)
  let i = 2;
  while (used.has(`${base}${i}`)) {
    i++;
  }

  return `${base}${i}`;
}

/**
 * 이름 변경 시 실시간으로 ticker 미리보기 생성
 *
 * @param {string} name - 입력된 이름
 * @param {Array<string>} existingTickers - 기존 티커 배열
 * @returns {string} 생성될 ticker 미리보기
 */
export function previewTicker(name, existingTickers = []) {
  if (!name || !name.trim()) {
    return '';
  }

  return generateTicker(name, existingTickers);
}

/**
 * 기존 데이터에서 모든 ticker 추출
 *
 * @param {string} type - 'seller' | 'buyer' | 'join' | 'driver'
 * @param {Array} groups - 그룹 배열
 * @param {Object} details - 상세 정보 객체
 * @returns {Array<string>} 모든 ticker 배열
 */
export function extractAllTickers(type, groups, details) {
  const tickers = [];

  if (type === 'seller') {
    // sellerDetails에서 모든 사업자의 sellerId 추출
    Object.values(details || {}).forEach(detail => {
      if (detail.businesses) {
        detail.businesses.forEach(business => {
          if (business.sellerId) {
            tickers.push(business.sellerId);
          }
        });
      }
    });
  } else if (type === 'buyer') {
    // buyerDetails에서 모든 사업자의 buyerId 추출
    Object.values(details || {}).forEach(detail => {
      if (detail.businesses) {
        detail.businesses.forEach(business => {
          if (business.buyerId) {
            tickers.push(business.buyerId);
          }
        });
      }
    });
  } else if (type === 'join') {
    // joinDetails에서 모든 사업자의 ticker 추출
    Object.values(details || {}).forEach(detail => {
      if (detail.businesses) {
        detail.businesses.forEach(business => {
          if (business.ticker) {
            tickers.push(business.ticker);
          }
        });
      }
    });
  } else if (type === 'driver') {
    // driverDetails에서 모든 정산사업자의 ticker 추출
    Object.values(details || {}).forEach(detail => {
      if (detail.settlementBusinesses) {
        detail.settlementBusinesses.forEach(business => {
          if (business.ticker) {
            tickers.push(business.ticker);
          }
        });
      }
      // 레거시 단일 정산사업자
      if (detail.settlementInfo?.ticker) {
        tickers.push(detail.settlementInfo.ticker);
      }
    });
  }

  return tickers;
}
