/**
 * 거래장부 필터링 로직 유틸리티
 */

/**
 * 날짜 범위 필터
 */
export const filterByDateRange = (transactions, dateField, startDate, endDate) => {
  if (!startDate && !endDate) return transactions;

  return transactions.filter(transaction => {
    const transactionDate = new Date(transaction[dateField]);

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // 종료일 포함
      return transactionDate >= start && transactionDate <= end;
    }

    if (startDate) {
      return transactionDate >= new Date(startDate);
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      return transactionDate <= end;
    }

    return true;
  });
};

/**
 * 품목분류 필터
 */
export const filterByCategory = (transactions, categories) => {
  if (!categories || categories.length === 0) return transactions;
  return transactions.filter(t => categories.includes(t.품목분류));
};

/**
 * 품목 필터
 */
export const filterByProduct = (transactions, products) => {
  if (!products || products.length === 0) return transactions;
  return transactions.filter(t => products.includes(t.품목));
};

/**
 * 원산지 필터
 */
export const filterByOrigin = (transactions, origins) => {
  if (!origins || origins.length === 0) return transactions;
  return transactions.filter(t => origins.includes(t.원산지));
};

/**
 * 규격 필터
 */
export const filterBySpec = (transactions, specs) => {
  if (!specs || specs.length === 0) return transactions;
  return transactions.filter(t => specs.includes(t.규격));
};

/**
 * 셀러그룹 필터
 */
export const filterBySellerGroup = (transactions, sellerGroups) => {
  if (!sellerGroups || sellerGroups.length === 0) return transactions;
  return transactions.filter(t => sellerGroups.includes(t.셀러그룹명));
};

/**
 * 셀러명 필터
 */
export const filterBySellerName = (transactions, sellerNames) => {
  if (!sellerNames || sellerNames.length === 0) return transactions;
  return transactions.filter(t => sellerNames.includes(t.셀러명));
};

/**
 * 바이어그룹 필터
 */
export const filterByBuyerGroup = (transactions, buyerGroups) => {
  if (!buyerGroups || buyerGroups.length === 0) return transactions;
  return transactions.filter(t => buyerGroups.includes(t.바이어그룹명));
};

/**
 * 바이어명 필터
 */
export const filterByBuyerName = (transactions, buyerNames) => {
  if (!buyerNames || buyerNames.length === 0) return transactions;
  return transactions.filter(t => buyerNames.includes(t.바이어명));
};

/**
 * 클레임 여부 필터
 */
export const filterByClaim = (transactions, hasClaim) => {
  if (hasClaim === null || hasClaim === undefined) return transactions;
  return transactions.filter(t => t.클레임여부 === hasClaim);
};

/**
 * 미정 여부 필터
 */
export const filterByUndecided = (transactions, showOnlyUndecided) => {
  if (!showOnlyUndecided) return transactions;
  return transactions.filter(t => t.미정여부 === true);
};

/**
 * 알파수익 음수 필터
 */
export const filterByNegativeAlpha = (transactions, showOnlyNegative) => {
  if (!showOnlyNegative) return transactions;
  return transactions.filter(t => t.알파수익단가 !== null && t.알파수익단가 < 0);
};

/**
 * 거래손익 마이너스 필터
 */
export const filterByNegativeProfit = (transactions, showOnlyNegative) => {
  if (!showOnlyNegative) return transactions;
  return transactions.filter(t => t.거래손익 < 0);
};

/**
 * 키워드 검색 (거래코드, 셀러명, 바이어명, 메모)
 */
export const filterByKeyword = (transactions, keyword) => {
  if (!keyword || keyword.trim() === '') return transactions;

  const lowerKeyword = keyword.toLowerCase();

  return transactions.filter(t => {
    const searchFields = [
      t.거래코드,
      t.주문코드,
      t.셀러명,
      t.셀러그룹명,
      t.바이어명,
      t.바이어그룹명,
      t.드라이버명,
      t.거래메모,
      t['클레임/조정 내용'],
    ].filter(Boolean); // null/undefined 제거

    return searchFields.some(field =>
      String(field).toLowerCase().includes(lowerKeyword)
    );
  });
};

/**
 * 복합 필터 적용
 */
export const applyFilters = (transactions, filters) => {
  let filtered = [...transactions];

  // 날짜 필터
  if (filters.dateField && (filters.startDate || filters.endDate)) {
    filtered = filterByDateRange(
      filtered,
      filters.dateField,
      filters.startDate,
      filters.endDate
    );
  }

  // 품목분류 필터 (단일 선택)
  if (filters.productCategory && filters.productCategory !== '전체') {
    filtered = filtered.filter(t => t.품목분류 === filters.productCategory);
  }

  // 품목분류 필터 (다중 선택)
  if (filters.categories) {
    filtered = filterByCategory(filtered, filters.categories);
  }

  // 품목 필터
  if (filters.products) {
    filtered = filterByProduct(filtered, filters.products);
  }

  // 원산지 필터
  if (filters.origins) {
    filtered = filterByOrigin(filtered, filters.origins);
  }

  // 규격 필터
  if (filters.specs) {
    filtered = filterBySpec(filtered, filters.specs);
  }

  // 셀러그룹 필터
  if (filters.sellerGroups) {
    filtered = filterBySellerGroup(filtered, filters.sellerGroups);
  }

  // 셀러명 필터
  if (filters.sellerNames) {
    filtered = filterBySellerName(filtered, filters.sellerNames);
  }

  // 바이어그룹 필터
  if (filters.buyerGroups) {
    filtered = filterByBuyerGroup(filtered, filters.buyerGroups);
  }

  // 바이어명 필터
  if (filters.buyerNames) {
    filtered = filterByBuyerName(filtered, filters.buyerNames);
  }

  // 클레임 여부 필터
  if (filters.hasClaim !== null && filters.hasClaim !== undefined) {
    filtered = filterByClaim(filtered, filters.hasClaim);
  }

  // 미정 여부 필터
  if (filters.showOnlyUndecided) {
    filtered = filterByUndecided(filtered, filters.showOnlyUndecided);
  }

  // 알파수익 음수 필터
  if (filters.showOnlyNegativeAlpha) {
    filtered = filterByNegativeAlpha(filtered, filters.showOnlyNegativeAlpha);
  }

  // 거래손익 마이너스 필터
  if (filters.showOnlyNegativeProfit) {
    filtered = filterByNegativeProfit(filtered, filters.showOnlyNegativeProfit);
  }

  // 키워드 검색
  if (filters.keyword) {
    filtered = filterByKeyword(filtered, filters.keyword);
  }

  return filtered;
};

/**
 * 정렬 함수
 */
export const sortTransactions = (transactions, sortKey, sortOrder = 'desc') => {
  const sorted = [...transactions].sort((a, b) => {
    let aValue = a[sortKey];
    let bValue = b[sortKey];

    // 날짜 정렬
    if (sortKey === '주문일' || sortKey === '납품일') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    // 규격 정렬 (크기 순서)
    if (sortKey === '규격') {
      aValue = parseSpecWeight(aValue);
      bValue = parseSpecWeight(bValue);
    }

    // 숫자 정렬
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    }

    // 문자열 정렬
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'asc'
        ? aValue.localeCompare(bValue, 'ko')
        : bValue.localeCompare(aValue, 'ko');
    }

    // 날짜 정렬
    if (aValue instanceof Date && bValue instanceof Date) {
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  return sorted;
};

/**
 * 규격 문자열에서 무게 숫자 추출 (예: "1.2kg" -> 1.2, "500g" -> 0.5)
 */
const parseSpecWeight = (spec) => {
  if (!spec) return 0;

  const kgMatch = spec.match(/(\d+\.?\d*)kg/);
  if (kgMatch) {
    return parseFloat(kgMatch[1]);
  }

  const gMatch = spec.match(/(\d+)g/);
  if (gMatch) {
    return parseFloat(gMatch[1]) / 1000;
  }

  return 0;
};

/**
 * 다중 정렬 (주문일>납품일>바이어그룹명>품목분류>품목>규격>주문수량>주문중량)
 */
export const multiSortTransactions = (transactions) => {
  return [...transactions].sort((a, b) => {
    // 1. 주문일 내림차순
    const orderDateA = new Date(a.주문일);
    const orderDateB = new Date(b.주문일);
    if (orderDateA > orderDateB) return -1;
    if (orderDateA < orderDateB) return 1;

    // 2. 납품일 내림차순
    const deliveryDateA = new Date(a.납품일);
    const deliveryDateB = new Date(b.납품일);
    if (deliveryDateA > deliveryDateB) return -1;
    if (deliveryDateA < deliveryDateB) return 1;

    // 3. 바이어그룹명 오름차순
    const buyerCompare = (a.바이어그룹명 || '').localeCompare(b.바이어그룹명 || '', 'ko');
    if (buyerCompare !== 0) return buyerCompare;

    // 4. 품목분류 오름차순
    const categoryCompare = (a.품목분류 || '').localeCompare(b.품목분류 || '', 'ko');
    if (categoryCompare !== 0) return categoryCompare;

    // 5. 품목 오름차순
    const productCompare = (a.품목 || '').localeCompare(b.품목 || '', 'ko');
    if (productCompare !== 0) return productCompare;

    // 6. 규격 오름차순 (크기)
    const specWeightA = parseSpecWeight(a.규격);
    const specWeightB = parseSpecWeight(b.규격);
    if (specWeightA !== specWeightB) return specWeightA - specWeightB;

    // 7. 주문수량 내림차순
    const quantityA = a.주문수량 || 0;
    const quantityB = b.주문수량 || 0;
    if (quantityA !== quantityB) return quantityB - quantityA;

    // 8. 주문중량 내림차순
    const weightA = a.주문중량 || 0;
    const weightB = b.주문중량 || 0;
    return weightB - weightA;
  });
};

/**
 * 빠른 날짜 범위 계산
 */
export const getQuickDateRange = (type) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const last7Days = new Date(today);
  last7Days.setDate(last7Days.getDate() - 6);

  const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  switch (type) {
    case 'yesterday':
      return { startDate: yesterday, endDate: yesterday };
    case 'today':
      return { startDate: today, endDate: today };
    case 'tomorrow':
      return { startDate: tomorrow, endDate: tomorrow };
    case 'last7days':
      return { startDate: last7Days, endDate: today };
    case 'thisMonth':
      return { startDate: thisMonthStart, endDate: today };
    default:
      return { startDate: thisMonthStart, endDate: today };
  }
};

/**
 * 날짜를 YYYY-MM-DD 형식으로 포맷
 */
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
