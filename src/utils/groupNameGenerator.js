/**
 * 사업자 개수에 따라 그룹명 자동 생성
 * @param {Array} businesses - 사업자 배열
 * @param {string} entityType - 'seller' | 'buyer' | 'join'
 * @returns {string} 생성된 그룹명
 */
export function generateGroupName(businesses, entityType) {
  const fieldMap = {
    seller: 'sellerName',
    buyer: 'buyerName',
    join: 'joinName'
  };

  const nameField = fieldMap[entityType];

  // 빈 값이 아닌 사업자만 필터링
  const validBusinesses = businesses.filter(b => b?.[nameField]?.trim());

  if (validBusinesses.length === 0) return '';
  if (validBusinesses.length === 1) return validBusinesses[0][nameField].trim();

  return `${validBusinesses[0][nameField].trim()} 그룹`;
}

/**
 * 그룹명 변경 필요 여부 판단
 * @param {number} oldCount - 이전 사업자 개수
 * @param {number} newCount - 현재 사업자 개수
 * @returns {boolean} 변경 필요 여부
 */
export function shouldUpdateGroupName(oldCount, newCount) {
  // 1→2 전환 시에만 변경 (2→3, 3→2 등은 변경 안 함)
  return oldCount === 1 && newCount >= 2;
}

/**
 * 사업자명 필드명 가져오기
 * @param {string} entityType - 'seller' | 'buyer' | 'join'
 * @returns {string} 필드명
 */
export function getBusinessNameField(entityType) {
  const fieldMap = {
    seller: 'sellerName',
    buyer: 'buyerName',
    join: 'joinName'
  };

  return fieldMap[entityType] || '';
}
