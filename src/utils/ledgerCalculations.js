/**
 * 거래장부 계산 로직 유틸리티
 */

/**
 * 매출액 계산
 * 매출액 = (도착단가 × 주문중량) + 바이어정산조정액
 */
export const calculateRevenue = (arrivalPrice, orderWeight, buyerAdjustment = 0) => {
  return (arrivalPrice * orderWeight) + buyerAdjustment;
};

/**
 * 매입액 계산
 * 매입액 = (상차단가 × (주문중량 + 셀러정산조정물량)) × (1 - 상차수수료율) + 셀러정산조정액
 */
export const calculateCost = (
  loadingPrice,
  orderWeight,
  sellerAdjustmentQuantity = 0,
  commissionRate = 0,
  sellerAdjustmentAmount = 0
) => {
  const totalWeight = orderWeight + sellerAdjustmentQuantity;
  const costBeforeCommission = loadingPrice * totalWeight;
  const costAfterCommission = costBeforeCommission * (1 - commissionRate / 100);
  return costAfterCommission + sellerAdjustmentAmount;
};

/**
 * 운송비 계산
 * 운송비 = (통당운임단가 × 주문수량) × (과세유형에 따라 1.1 또는 1.0)
 */
export const calculateFreight = (
  freightPerUnit,
  orderQuantity,
  taxType = null,
  isFreightIncluded = true
) => {
  if (!isFreightIncluded) return 0;

  const baseFreight = freightPerUnit * orderQuantity;

  // 과세유형이 '과세'이면 1.1, '면세' 또는 null이면 1.0
  const taxMultiplier = taxType === '과세' ? 1.1 : 1.0;

  return baseFreight * taxMultiplier;
};

/**
 * 거래손익 계산
 * 거래손익 = 매출액 - 매입액 - 운송비(비용) + 회계조정액
 */
export const calculateProfit = (
  revenue,
  cost,
  freight,
  accountingAdjustment = 0
) => {
  return revenue - cost - freight + accountingAdjustment;
};

/**
 * 알파수익단가 계산 (넙치 전용)
 * 알파수익단가 = 도착단가 - 상차단가 - 넙치도착가정책금액
 */
export const calculateAlphaProfit = (
  product,
  arrivalPrice,
  loadingPrice,
  arrivalPricePolicy
) => {
  // 넙치가 아니면 null 반환
  if (product !== '넙치') return null;

  // 도착단가정책이 "+800원" 같은 형태로 되어 있으면 숫자만 추출
  let policyAmount = 0;
  if (arrivalPricePolicy) {
    // 숫자인 경우 그대로 사용
    if (typeof arrivalPricePolicy === 'number') {
      policyAmount = arrivalPricePolicy;
    } else if (typeof arrivalPricePolicy === 'string') {
      // 문자열인 경우 정규식으로 숫자 추출
      const match = arrivalPricePolicy.match(/[+-]?\d+/);
      if (match) {
        policyAmount = parseInt(match[0]);
      }
    }
  }

  return arrivalPrice - loadingPrice - policyAmount;
};

/**
 * 상차수수료수익 계산
 * 상차수수료수익 = 상차단가 × 주문중량 × 상차수수료율
 */
export const calculateCommissionRevenue = (
  loadingPrice,
  orderWeight,
  commissionRate
) => {
  return loadingPrice * orderWeight * (commissionRate / 100);
};

/**
 * 셀러기여손익 계산
 * 셀러기여손익 = 거래손익 - (클레임 중 셀러 귀책 손익액)
 * 현재는 클레임 귀책 미구현으로 거래손익과 동일
 */
export const calculateSellerProfit = (profit, sellerClaimLoss = 0) => {
  return profit - sellerClaimLoss;
};

/**
 * 바이어기여손익 계산
 * 바이어기여손익 = 거래손익 - (클레임 중 바이어 귀책 손익액)
 * 현재는 클레임 귀책 미구현으로 거래손익과 동일
 */
export const calculateBuyerProfit = (profit, buyerClaimLoss = 0) => {
  return profit - buyerClaimLoss;
};

/**
 * 클레임/조정비용 합계 계산
 * 클레임/조정비용합계 = 바이어정산조정액 - 셀러정산조정금액 - 드라이버정산조정금액 + 회계처리용조정금액 - (셀러정산조정물량 × 상차단가)
 */
export const calculateTotalClaimCost = (
  buyerAdjustment = 0,
  sellerAdjustment = 0,
  driverAdjustment = 0,
  accountingAdjustment = 0,
  sellerAdjustmentQuantity = 0,
  loadingPrice = 0
) => {
  return buyerAdjustment - sellerAdjustment - driverAdjustment + accountingAdjustment - (sellerAdjustmentQuantity * loadingPrice);
};

/**
 * 거래손익율 계산
 * 거래손익율(%) = (거래손익 / 매출액) × 100
 */
export const calculateProfitRate = (profit, revenue) => {
  if (!revenue || revenue === 0) return 0;
  return (profit / revenue) * 100;
};

/**
 * 거래 데이터의 모든 계산 필드를 한번에 계산
 */
export const calculateAllFields = (transaction) => {
  const {
    품목,
    주문수량,
    주문중량,
    상차단가,
    도착단가,
    상차수수료율,
    통당운임단가,
    운송비포함여부,
    도착단가정책,
    바이어정산조정금액 = 0,
    셀러정산조정물량 = 0,
    셀러정산조정금액 = 0,
    드라이버정산조정금액 = 0,
    회계처리용조정금액 = 0,
    드라이버과세유형,
  } = transaction;

  // 미정인 경우 0으로 처리
  const 상차단가_숫자 = String(상차단가).includes('미정') ? 0 : 상차단가;
  const 도착단가_숫자 = String(도착단가).includes('미정') ? 0 : 도착단가;
  const 통당운임단가_숫자 = String(통당운임단가).includes('미정') ? 0 : 통당운임단가;

  // 매출액 (주문중량 사용)
  const 매출액 = calculateRevenue(도착단가_숫자, 주문중량, 바이어정산조정금액);

  // 매입액 (주문중량 사용)
  const 매입액 = calculateCost(
    상차단가_숫자,
    주문중량,
    셀러정산조정물량,
    상차수수료율,
    셀러정산조정금액
  );

  // 운송비 (주문수량 사용)
  const 운송비 = calculateFreight(
    통당운임단가_숫자,
    주문수량,
    드라이버과세유형,
    운송비포함여부
  );

  // 거래손익
  const 거래손익 = calculateProfit(매출액, 매입액, 운송비, 회계처리용조정금액);

  // 거래손익율
  const 거래손익율 = calculateProfitRate(거래손익, 매출액);

  // 상차수수료수익 (주문중량 사용)
  const 상차수수료수익 = calculateCommissionRevenue(상차단가_숫자, 주문중량, 상차수수료율);

  // 알파수익단가 (넙치만)
  const 알파수익단가 = calculateAlphaProfit(품목, 도착단가_숫자, 상차단가_숫자, 도착단가정책);

  // 셀러/바이어 기여손익 (현재는 거래손익과 동일)
  const 셀러기여손익 = calculateSellerProfit(거래손익);
  const 바이어기여손익 = calculateBuyerProfit(거래손익);

  // 클레임/조정비용 합계
  const 클레임조정비용합계 = calculateTotalClaimCost(
    바이어정산조정금액,
    셀러정산조정금액,
    드라이버정산조정금액,
    회계처리용조정금액,
    셀러정산조정물량,
    상차단가_숫자
  );

  return {
    매출액,
    매입액,
    운송비,
    거래손익,
    거래손익율,
    상차수수료수익,
    알파수익단가,
    셀러기여손익,
    바이어기여손익,
    클레임조정비용합계,
  };
};

/**
 * "미정" 키워드가 포함되어 있는지 확인
 */
export const hasUndecided = (transaction) => {
  const fieldsToCheck = [
    transaction.셀러명,
    transaction.바이어명,
    transaction.드라이버명,
    transaction.상차단가,
    transaction.도착단가,
    transaction.통당운임단가,
  ];

  return fieldsToCheck.some(field =>
    field && String(field).includes('미정')
  );
};

/**
 * 거래 데이터에 계산 필드 추가
 */
export const enrichTransactionData = (transactions) => {
  return transactions.map(transaction => {
    const calculatedFields = calculateAllFields(transaction);
    const hasUndecidedField = hasUndecided(transaction);

    return {
      ...transaction,
      ...calculatedFields,
      미정여부: hasUndecidedField,
    };
  });
};
