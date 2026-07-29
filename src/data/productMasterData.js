// 품목분류 데이터
export const productCategories = [
  { id: 1, icon: '🐟', name: '누운고기', itemCount: 3, status: 'active', createdAt: '2024-01-15' },
  { id: 2, icon: '🦈', name: '뜬고기', itemCount: 18, status: 'active', createdAt: '2024-01-16' },
  { id: 3, icon: '🐟', name: '연어', itemCount: 1, status: 'active', createdAt: '2024-01-17' },
];

// 품목 데이터
export const products = [
  { id: 1, categoryId: 1, categoryName: '누운고기', categoryIcon: '🐟', name: '넙치', orderUnit: '통', unitWeight: 250, originCount: 6, specCount: 37, status: 'active' },
  { id: 2, categoryId: 1, categoryName: '누운고기', categoryIcon: '🐟', name: '강도다리', orderUnit: '통', unitWeight: 250, originCount: 1, specCount: 22, status: 'active' },
  { id: 3, categoryId: 1, categoryName: '누운고기', categoryIcon: '🐟', name: '찰광어', orderUnit: '통', unitWeight: 230, originCount: 1, specCount: 11, status: 'active' },
  { id: 4, categoryId: 2, categoryName: '뜬고기', categoryIcon: '🦈', name: '방어', orderUnit: '통', unitWeight: 90, originCount: 2, specCount: 27, status: 'active' },
  { id: 5, categoryId: 2, categoryName: '뜬고기', categoryIcon: '🦈', name: '잿방어', orderUnit: '통', unitWeight: 100, originCount: 1, specCount: 1, status: 'active' },
  { id: 6, categoryId: 2, categoryName: '뜬고기', categoryIcon: '🦈', name: '도미', orderUnit: '통', unitWeight: 80, originCount: 2, specCount: 14, status: 'active' },
  { id: 7, categoryId: 2, categoryName: '뜬고기', categoryIcon: '🦈', name: '벤자리', orderUnit: '통', unitWeight: 80, originCount: 1, specCount: 2, status: 'active' },
  { id: 8, categoryId: 2, categoryName: '뜬고기', categoryIcon: '🦈', name: '시마아지', orderUnit: '통', unitWeight: 80, originCount: 1, specCount: 3, status: 'active' },
  { id: 9, categoryId: 2, categoryName: '뜬고기', categoryIcon: '🦈', name: '능성어', orderUnit: '통', unitWeight: 80, originCount: 2, specCount: 2, status: 'active' },
  { id: 10, categoryId: 2, categoryName: '뜬고기', categoryIcon: '🦈', name: '농어', orderUnit: '통', unitWeight: 80, originCount: 1, specCount: 4, status: 'active' },
  { id: 11, categoryId: 2, categoryName: '뜬고기', categoryIcon: '🦈', name: '점성어', orderUnit: '통', unitWeight: 180, originCount: 1, specCount: 2, status: 'active' },
  { id: 12, categoryId: 2, categoryName: '뜬고기', categoryIcon: '🦈', name: '감성돔', orderUnit: '통', unitWeight: 80, originCount: 1, specCount: 1, status: 'active' },
  { id: 13, categoryId: 2, categoryName: '뜬고기', categoryIcon: '🦈', name: '벵에돔', orderUnit: '통', unitWeight: 80, originCount: 1, specCount: 1, status: 'active' },
  { id: 14, categoryId: 2, categoryName: '뜬고기', categoryIcon: '🦈', name: '쥐치', orderUnit: '통', unitWeight: 80, originCount: 1, specCount: 5, status: 'active' },
  { id: 15, categoryId: 2, categoryName: '뜬고기', categoryIcon: '🦈', name: '줄돔', orderUnit: '통', unitWeight: 80, originCount: 1, specCount: 1, status: 'active' },
  { id: 16, categoryId: 2, categoryName: '뜬고기', categoryIcon: '🦈', name: '돗돔', orderUnit: '통', unitWeight: 80, originCount: 1, specCount: 2, status: 'active' },
  { id: 17, categoryId: 2, categoryName: '뜬고기', categoryIcon: '🦈', name: '자바리', orderUnit: '통', unitWeight: 80, originCount: 1, specCount: 1, status: 'active' },
  { id: 18, categoryId: 2, categoryName: '뜬고기', categoryIcon: '🦈', name: '우럭', orderUnit: '통', unitWeight: 160, originCount: 1, specCount: 1, status: 'active' },
  { id: 19, categoryId: 2, categoryName: '뜬고기', categoryIcon: '🦈', name: '참민어', orderUnit: '통', unitWeight: 80, originCount: 1, specCount: 1, status: 'active' },
  { id: 20, categoryId: 2, categoryName: '뜬고기', categoryIcon: '🦈', name: '부시리', orderUnit: '통', unitWeight: 80, originCount: 1, specCount: 1, status: 'active' },
  { id: 21, categoryId: 2, categoryName: '뜬고기', categoryIcon: '🦈', name: '문어', orderUnit: '통', unitWeight: 150, originCount: 1, specCount: 1, status: 'active' },
  { id: 22, categoryId: 3, categoryName: '연어', categoryIcon: '🐟', name: '연어HOG', orderUnit: '박스', unitWeight: 20, originCount: 1, specCount: 1, status: 'active' },
];

// 원산지 데이터
export const origins = [
  // 넙치 (productId: 1)
  { id: 1, productId: 1, productName: '넙치', name: '완도', status: 'active', createdAt: '2024-02-01' },
  { id: 2, productId: 1, productName: '넙치', name: '통영/욕지도', status: 'active', createdAt: '2024-02-02' },
  { id: 3, productId: 1, productName: '넙치', name: '거제', status: 'active', createdAt: '2024-02-03' },
  { id: 4, productId: 1, productName: '넙치', name: '구룡포', status: 'active', createdAt: '2024-02-04' },
  { id: 5, productId: 1, productName: '넙치', name: '남해/고성', status: 'active', createdAt: '2024-02-05' },
  { id: 6, productId: 1, productName: '넙치', name: '제주', status: 'active', createdAt: '2024-02-06' },
  // 강도다리 (productId: 2)
  { id: 7, productId: 2, productName: '강도다리', name: '국산', status: 'active', createdAt: '2024-02-07' },
  // 찰광어 (productId: 3)
  { id: 8, productId: 3, productName: '찰광어', name: '국산', status: 'active', createdAt: '2024-02-08' },
  // 방어 (productId: 4)
  { id: 9, productId: 4, productName: '방어', name: '일본산', status: 'active', createdAt: '2024-02-09' },
  { id: 10, productId: 4, productName: '방어', name: '국산', status: 'active', createdAt: '2024-02-10' },
  // 잿방어 (productId: 5)
  { id: 11, productId: 5, productName: '잿방어', name: '일본산', status: 'active', createdAt: '2024-02-11' },
  // 도미 (productId: 6)
  { id: 12, productId: 6, productName: '도미', name: '일본산', status: 'active', createdAt: '2024-02-12' },
  { id: 13, productId: 6, productName: '도미', name: '국산', status: 'active', createdAt: '2024-02-13' },
  // 벤자리 (productId: 7)
  { id: 14, productId: 7, productName: '벤자리', name: '일본산', status: 'active', createdAt: '2024-02-14' },
  // 시마아지 (productId: 8)
  { id: 15, productId: 8, productName: '시마아지', name: '일본산', status: 'active', createdAt: '2024-02-15' },
  // 능성어 (productId: 9)
  { id: 16, productId: 9, productName: '능성어', name: '중국산', status: 'active', createdAt: '2024-02-16' },
  { id: 17, productId: 9, productName: '능성어', name: '국산', status: 'active', createdAt: '2024-02-17' },
  // 농어 (productId: 10)
  { id: 18, productId: 10, productName: '농어', name: '중국산', status: 'active', createdAt: '2024-02-18' },
  // 점성어 (productId: 11)
  { id: 19, productId: 11, productName: '점성어', name: '중국산', status: 'active', createdAt: '2024-02-19' },
  // 감성돔 (productId: 12)
  { id: 20, productId: 12, productName: '감성돔', name: '중국산', status: 'active', createdAt: '2024-02-20' },
  // 벵에돔 (productId: 13)
  { id: 21, productId: 13, productName: '벵에돔', name: '일본산', status: 'active', createdAt: '2024-02-21' },
  // 쥐치 (productId: 14)
  { id: 22, productId: 14, productName: '쥐치', name: '국산', status: 'active', createdAt: '2024-02-22' },
  // 줄돔 (productId: 15)
  { id: 23, productId: 15, productName: '줄돔', name: '국산', status: 'active', createdAt: '2024-02-23' },
  // 돗돔 (productId: 16)
  { id: 24, productId: 16, productName: '돗돔', name: '국산', status: 'active', createdAt: '2024-02-24' },
  // 자바리 (productId: 17)
  { id: 25, productId: 17, productName: '자바리', name: '국산', status: 'active', createdAt: '2024-02-25' },
  // 우럭 (productId: 18)
  { id: 26, productId: 18, productName: '우럭', name: '국산', status: 'active', createdAt: '2024-02-26' },
  // 참민어 (productId: 19)
  { id: 27, productId: 19, productName: '참민어', name: '중국산', status: 'active', createdAt: '2024-02-27' },
  // 부시리 (productId: 20)
  { id: 28, productId: 20, productName: '부시리', name: '국산', status: 'active', createdAt: '2024-02-28' },
  // 문어 (productId: 21)
  { id: 29, productId: 21, productName: '문어', name: '국산', status: 'active', createdAt: '2024-03-01' },
  // 연어HOG (productId: 22)
  { id: 30, productId: 22, productName: '연어HOG', name: '수입', status: 'active', createdAt: '2024-03-02' },
];

// 규격 데이터
export const specifications = [
  // 넙치 (productId: 1) - 완도 기준 전체 규격
  { id: 1, productId: 1, productName: '넙치', name: '400g', status: 'active', createdAt: '2024-02-01' },
  { id: 2, productId: 1, productName: '넙치', name: '500g', status: 'active', createdAt: '2024-02-02' },
  { id: 3, productId: 1, productName: '넙치', name: '550g', status: 'active', createdAt: '2024-02-03' },
  { id: 4, productId: 1, productName: '넙치', name: '600g', status: 'active', createdAt: '2024-02-04' },
  { id: 5, productId: 1, productName: '넙치', name: '650g', status: 'active', createdAt: '2024-02-05' },
  { id: 6, productId: 1, productName: '넙치', name: '700g', status: 'active', createdAt: '2024-02-06' },
  { id: 7, productId: 1, productName: '넙치', name: '750g', status: 'active', createdAt: '2024-02-07' },
  { id: 8, productId: 1, productName: '넙치', name: '800g', status: 'active', createdAt: '2024-02-08' },
  { id: 9, productId: 1, productName: '넙치', name: '850g', status: 'active', createdAt: '2024-02-09' },
  { id: 10, productId: 1, productName: '넙치', name: '900g', status: 'active', createdAt: '2024-02-10' },
  { id: 11, productId: 1, productName: '넙치', name: '950g', status: 'active', createdAt: '2024-02-11' },
  { id: 12, productId: 1, productName: '넙치', name: '1.0kg', status: 'active', createdAt: '2024-02-12' },
  { id: 13, productId: 1, productName: '넙치', name: '1.1kg', status: 'active', createdAt: '2024-02-13' },
  { id: 14, productId: 1, productName: '넙치', name: '1.2kg', status: 'active', createdAt: '2024-02-14' },
  { id: 15, productId: 1, productName: '넙치', name: '1.3kg', status: 'active', createdAt: '2024-02-15' },
  { id: 16, productId: 1, productName: '넙치', name: '1.4kg', status: 'active', createdAt: '2024-02-16' },
  { id: 17, productId: 1, productName: '넙치', name: '1.5kg', status: 'active', createdAt: '2024-02-17' },
  { id: 18, productId: 1, productName: '넙치', name: '1.6kg', status: 'active', createdAt: '2024-02-18' },
  { id: 19, productId: 1, productName: '넙치', name: '1.7kg', status: 'active', createdAt: '2024-02-19' },
  { id: 20, productId: 1, productName: '넙치', name: '1.8kg', status: 'active', createdAt: '2024-02-20' },
  { id: 21, productId: 1, productName: '넙치', name: '1.9kg', status: 'active', createdAt: '2024-02-21' },
  { id: 22, productId: 1, productName: '넙치', name: '2.0kg', status: 'active', createdAt: '2024-02-22' },
  { id: 23, productId: 1, productName: '넙치', name: '2.1kg', status: 'active', createdAt: '2024-02-23' },
  { id: 24, productId: 1, productName: '넙치', name: '2.2kg', status: 'active', createdAt: '2024-02-24' },
  { id: 25, productId: 1, productName: '넙치', name: '2.3kg', status: 'active', createdAt: '2024-02-25' },
  { id: 26, productId: 1, productName: '넙치', name: '2.4kg', status: 'active', createdAt: '2024-02-26' },
  { id: 27, productId: 1, productName: '넙치', name: '2.5kg', status: 'active', createdAt: '2024-02-27' },
  { id: 28, productId: 1, productName: '넙치', name: '2.6kg', status: 'active', createdAt: '2024-02-28' },
  { id: 29, productId: 1, productName: '넙치', name: '2.7kg', status: 'active', createdAt: '2024-03-01' },
  { id: 30, productId: 1, productName: '넙치', name: '2.8kg', status: 'active', createdAt: '2024-03-02' },
  { id: 31, productId: 1, productName: '넙치', name: '2.9kg', status: 'active', createdAt: '2024-03-03' },
  { id: 32, productId: 1, productName: '넙치', name: '3.0kg', status: 'active', createdAt: '2024-03-04' },
  { id: 33, productId: 1, productName: '넙치', name: '3.1kg', status: 'active', createdAt: '2024-03-05' },
  { id: 34, productId: 1, productName: '넙치', name: '3.2kg', status: 'active', createdAt: '2024-03-06' },
  { id: 35, productId: 1, productName: '넙치', name: '3.3kg', status: 'active', createdAt: '2024-03-07' },
  { id: 36, productId: 1, productName: '넙치', name: '3.5kg', status: 'active', createdAt: '2024-03-08' },
  { id: 37, productId: 1, productName: '넙치', name: 'B급', status: 'active', createdAt: '2024-03-09' },

  // 강도다리 (productId: 2)
  { id: 38, productId: 2, productName: '강도다리', name: '250g', status: 'active', createdAt: '2024-03-10' },
  { id: 39, productId: 2, productName: '강도다리', name: '260g', status: 'active', createdAt: '2024-03-11' },
  { id: 40, productId: 2, productName: '강도다리', name: '270g', status: 'active', createdAt: '2024-03-12' },
  { id: 41, productId: 2, productName: '강도다리', name: '280g', status: 'active', createdAt: '2024-03-13' },
  { id: 42, productId: 2, productName: '강도다리', name: '290g', status: 'active', createdAt: '2024-03-14' },
  { id: 43, productId: 2, productName: '강도다리', name: '300g', status: 'active', createdAt: '2024-03-15' },
  { id: 44, productId: 2, productName: '강도다리', name: '310g', status: 'active', createdAt: '2024-03-16' },
  { id: 45, productId: 2, productName: '강도다리', name: '320g', status: 'active', createdAt: '2024-03-17' },
  { id: 46, productId: 2, productName: '강도다리', name: '330g', status: 'active', createdAt: '2024-03-18' },
  { id: 47, productId: 2, productName: '강도다리', name: '340g', status: 'active', createdAt: '2024-03-19' },
  { id: 48, productId: 2, productName: '강도다리', name: '350g', status: 'active', createdAt: '2024-03-20' },
  { id: 49, productId: 2, productName: '강도다리', name: '380g', status: 'active', createdAt: '2024-03-21' },
  { id: 50, productId: 2, productName: '강도다리', name: '400g', status: 'active', createdAt: '2024-03-22' },
  { id: 51, productId: 2, productName: '강도다리', name: '450g', status: 'active', createdAt: '2024-03-23' },
  { id: 52, productId: 2, productName: '강도다리', name: '500g', status: 'active', createdAt: '2024-03-24' },
  { id: 53, productId: 2, productName: '강도다리', name: '520g', status: 'active', createdAt: '2024-03-25' },
  { id: 54, productId: 2, productName: '강도다리', name: '600g', status: 'active', createdAt: '2024-03-26' },
  { id: 55, productId: 2, productName: '강도다리', name: '650g', status: 'active', createdAt: '2024-03-27' },
  { id: 56, productId: 2, productName: '강도다리', name: '850g', status: 'active', createdAt: '2024-03-28' },
  { id: 57, productId: 2, productName: '강도다리', name: '900g', status: 'active', createdAt: '2024-03-29' },
  { id: 58, productId: 2, productName: '강도다리', name: '950g', status: 'active', createdAt: '2024-03-30' },
  { id: 59, productId: 2, productName: '강도다리', name: '1.0kg', status: 'active', createdAt: '2024-03-31' },

  // 찰광어 (productId: 3)
  { id: 60, productId: 3, productName: '찰광어', name: '1.0kg', status: 'active', createdAt: '2024-04-01' },
  { id: 61, productId: 3, productName: '찰광어', name: '1.1kg', status: 'active', createdAt: '2024-04-02' },
  { id: 62, productId: 3, productName: '찰광어', name: '1.2kg', status: 'active', createdAt: '2024-04-03' },
  { id: 63, productId: 3, productName: '찰광어', name: '1.3kg', status: 'active', createdAt: '2024-04-04' },
  { id: 64, productId: 3, productName: '찰광어', name: '1.4kg', status: 'active', createdAt: '2024-04-05' },
  { id: 65, productId: 3, productName: '찰광어', name: '1.5kg', status: 'active', createdAt: '2024-04-06' },
  { id: 66, productId: 3, productName: '찰광어', name: '1.6kg', status: 'active', createdAt: '2024-04-07' },
  { id: 67, productId: 3, productName: '찰광어', name: '1.7kg', status: 'active', createdAt: '2024-04-08' },
  { id: 68, productId: 3, productName: '찰광어', name: '1.8kg', status: 'active', createdAt: '2024-04-09' },
  { id: 69, productId: 3, productName: '찰광어', name: '1.9kg', status: 'active', createdAt: '2024-04-10' },
  { id: 70, productId: 3, productName: '찰광어', name: '2.0kg', status: 'active', createdAt: '2024-04-11' },

  // 방어 (productId: 4) - 일본산
  { id: 71, productId: 4, productName: '방어', name: '3.8kg', status: 'active', createdAt: '2024-04-12' },
  { id: 72, productId: 4, productName: '방어', name: '4.0kg', status: 'active', createdAt: '2024-04-13' },
  { id: 73, productId: 4, productName: '방어', name: '4~5kg', status: 'active', createdAt: '2024-04-14' },
  { id: 74, productId: 4, productName: '방어', name: '4.5~5.5kg', status: 'active', createdAt: '2024-04-15' },
  { id: 75, productId: 4, productName: '방어', name: '5.0kg', status: 'active', createdAt: '2024-04-16' },
  { id: 76, productId: 4, productName: '방어', name: '5~5.5kg', status: 'active', createdAt: '2024-04-17' },
  { id: 77, productId: 4, productName: '방어', name: '5.5kg', status: 'active', createdAt: '2024-04-18' },
  { id: 78, productId: 4, productName: '방어', name: '5.5~6.5kg', status: 'active', createdAt: '2024-04-19' },
  { id: 79, productId: 4, productName: '방어', name: '5~6kg', status: 'active', createdAt: '2024-04-20' },
  { id: 80, productId: 4, productName: '방어', name: '5.7kg', status: 'active', createdAt: '2024-04-21' },
  { id: 81, productId: 4, productName: '방어', name: '5.8kg', status: 'active', createdAt: '2024-04-22' },
  { id: 82, productId: 4, productName: '방어', name: '6.0kg', status: 'active', createdAt: '2024-04-23' },
  { id: 83, productId: 4, productName: '방어', name: '6.2kg', status: 'active', createdAt: '2024-04-24' },
  { id: 84, productId: 4, productName: '방어', name: '6.4kg', status: 'active', createdAt: '2024-04-25' },
  { id: 85, productId: 4, productName: '방어', name: '6.5kg', status: 'active', createdAt: '2024-04-26' },
  { id: 86, productId: 4, productName: '방어', name: '6~7kg', status: 'active', createdAt: '2024-04-27' },
  { id: 87, productId: 4, productName: '방어', name: '6.8kg', status: 'active', createdAt: '2024-04-28' },
  { id: 88, productId: 4, productName: '방어', name: '7.0kg', status: 'active', createdAt: '2024-04-29' },
  { id: 89, productId: 4, productName: '방어', name: '7~8kg', status: 'active', createdAt: '2024-04-30' },
  { id: 90, productId: 4, productName: '방어', name: '8.0kg', status: 'active', createdAt: '2024-05-01' },
  { id: 91, productId: 4, productName: '방어', name: '8~9kg', status: 'active', createdAt: '2024-05-02' },
  { id: 92, productId: 4, productName: '방어', name: '8~10kg', status: 'active', createdAt: '2024-05-03' },
  { id: 93, productId: 4, productName: '방어', name: '9.0kg', status: 'active', createdAt: '2024-05-04' },
  { id: 94, productId: 4, productName: '방어', name: '9~10kg', status: 'active', createdAt: '2024-05-05' },
  { id: 95, productId: 4, productName: '방어', name: '10.0kg', status: 'active', createdAt: '2024-05-06' },
  { id: 96, productId: 4, productName: '방어', name: 'B급', status: 'active', createdAt: '2024-05-07' },

  // 잿방어 (productId: 5)
  { id: 97, productId: 5, productName: '잿방어', name: '4~5kg', status: 'active', createdAt: '2024-05-08' },

  // 도미 (productId: 6)
  { id: 98, productId: 6, productName: '도미', name: '1~1.5kg', status: 'active', createdAt: '2024-05-09' },
  { id: 99, productId: 6, productName: '도미', name: '1.4~1.6kg', status: 'active', createdAt: '2024-05-10' },
  { id: 100, productId: 6, productName: '도미', name: '1.4~1.8kg', status: 'active', createdAt: '2024-05-11' },
  { id: 101, productId: 6, productName: '도미', name: '1.5kg', status: 'active', createdAt: '2024-05-12' },
  { id: 102, productId: 6, productName: '도미', name: '1.5~1.7kg', status: 'active', createdAt: '2024-05-13' },
  { id: 103, productId: 6, productName: '도미', name: '1.5~2kg', status: 'active', createdAt: '2024-05-14' },
  { id: 104, productId: 6, productName: '도미', name: '1.6kg', status: 'active', createdAt: '2024-05-15' },
  { id: 105, productId: 6, productName: '도미', name: '1.7kg', status: 'active', createdAt: '2024-05-16' },
  { id: 106, productId: 6, productName: '도미', name: '1.78kg', status: 'active', createdAt: '2024-05-17' },
  { id: 107, productId: 6, productName: '도미', name: '1.8kg', status: 'active', createdAt: '2024-05-18' },
  { id: 108, productId: 6, productName: '도미', name: '2kg', status: 'active', createdAt: '2024-05-19' },
  { id: 109, productId: 6, productName: '도미', name: '2~2.5kg', status: 'active', createdAt: '2024-05-20' },
  { id: 110, productId: 6, productName: '도미', name: '2.3kg', status: 'active', createdAt: '2024-05-21' },
  { id: 111, productId: 6, productName: '도미', name: '2.5kg', status: 'active', createdAt: '2024-05-22' },

  // 벤자리 (productId: 7)
  { id: 112, productId: 7, productName: '벤자리', name: '550g', status: 'active', createdAt: '2024-05-23' },
  { id: 113, productId: 7, productName: '벤자리', name: '600g', status: 'active', createdAt: '2024-05-24' },

  // 시마아지 (productId: 8)
  { id: 114, productId: 8, productName: '시마아지', name: '1.5kg', status: 'active', createdAt: '2024-05-25' },
  { id: 115, productId: 8, productName: '시마아지', name: '1.8kg', status: 'active', createdAt: '2024-05-26' },
  { id: 116, productId: 8, productName: '시마아지', name: '2.1kg', status: 'active', createdAt: '2024-05-27' },

  // 능성어 (productId: 9)
  { id: 117, productId: 9, productName: '능성어', name: '1.89kg', status: 'active', createdAt: '2024-05-28' },
  { id: 118, productId: 9, productName: '능성어', name: '2.0kg', status: 'active', createdAt: '2024-05-29' },

  // 농어 (productId: 10)
  { id: 119, productId: 10, productName: '농어', name: '1.5kg', status: 'active', createdAt: '2024-05-30' },
  { id: 120, productId: 10, productName: '농어', name: '2.0kg', status: 'active', createdAt: '2024-05-31' },
  { id: 121, productId: 10, productName: '농어', name: '2.5kg', status: 'active', createdAt: '2024-06-01' },
  { id: 122, productId: 10, productName: '농어', name: '3.0kg', status: 'active', createdAt: '2024-06-02' },

  // 점성어 (productId: 11)
  { id: 123, productId: 11, productName: '점성어', name: '4~5kg', status: 'active', createdAt: '2024-06-03' },
  { id: 124, productId: 11, productName: '점성어', name: 'B급', status: 'active', createdAt: '2024-06-04' },

  // 감성돔 (productId: 12)
  { id: 125, productId: 12, productName: '감성돔', name: '1.0kg', status: 'active', createdAt: '2024-06-05' },

  // 벵에돔 (productId: 13)
  { id: 126, productId: 13, productName: '벵에돔', name: '600g', status: 'active', createdAt: '2024-06-06' },

  // 쥐치 (productId: 14)
  { id: 127, productId: 14, productName: '쥐치', name: '4미', status: 'active', createdAt: '2024-06-07' },
  { id: 128, productId: 14, productName: '쥐치', name: '5미', status: 'active', createdAt: '2024-06-08' },
  { id: 129, productId: 14, productName: '쥐치', name: '5~6미', status: 'active', createdAt: '2024-06-09' },
  { id: 130, productId: 14, productName: '쥐치', name: '6미', status: 'active', createdAt: '2024-06-10' },
  { id: 131, productId: 14, productName: '쥐치', name: '7미', status: 'active', createdAt: '2024-06-11' },

  // 줄돔 (productId: 15)
  { id: 132, productId: 15, productName: '줄돔', name: '320g', status: 'active', createdAt: '2024-06-12' },

  // 돗돔 (productId: 16)
  { id: 133, productId: 16, productName: '돗돔', name: '1.0kg', status: 'active', createdAt: '2024-06-13' },
  { id: 134, productId: 16, productName: '돗돔', name: '1.5kg', status: 'active', createdAt: '2024-06-14' },

  // 자바리 (productId: 17)
  { id: 135, productId: 17, productName: '자바리', name: '2~3kg', status: 'active', createdAt: '2024-06-15' },

  // 우럭 (productId: 18)
  { id: 136, productId: 18, productName: '우럭', name: '530g', status: 'active', createdAt: '2024-06-16' },

  // 참민어 (productId: 19)
  { id: 137, productId: 19, productName: '참민어', name: '3~4kg', status: 'active', createdAt: '2024-06-17' },

  // 부시리 (productId: 20)
  { id: 138, productId: 20, productName: '부시리', name: '3~4kg', status: 'active', createdAt: '2024-06-18' },

  // 문어 (productId: 21)
  { id: 139, productId: 21, productName: '문어', name: '1kg', status: 'active', createdAt: '2024-06-19' },

  // 연어HOG (productId: 22)
  { id: 140, productId: 22, productName: '연어HOG', name: '6~7kg', status: 'active', createdAt: '2024-06-20' },
];