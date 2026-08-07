/**
 * 거래장부 CSV 내보내기 유틸리티
 */

/**
 * 거래장부 전체 컬럼 정의
 */
export const ALL_COLUMNS = [
  { key: '주문코드', label: '주문코드' },
  { key: '거래코드', label: '거래코드' },
  { key: '운송코드', label: '운송코드' },
  { key: '주문일', label: '주문일' },
  { key: '납품일', label: '납품일' },
  { key: '품목분류', label: '품목분류' },
  { key: '품목', label: '품목' },
  { key: '원산지', label: '원산지' },
  { key: '규격', label: '규격' },
  { key: '주문수량', label: '주문수량' },
  { key: '주문중량', label: '주문중량' },
  { key: '상차단가', label: '상차단가(원)' },
  { key: '상차수수료율', label: '상차수수료율' },
  { key: '통당운임단가', label: '통당운임단가(원)' },
  { key: '운송비포함여부', label: '운송비포함여부' },
  { key: '도착단가', label: '도착단가(원)' },
  { key: '도착단가정책', label: '도착단가정책' },
  { key: '알파수익단가', label: '알파수익단가(원)' },
  { key: '셀러명', label: '셀러명' },
  { key: '셀러그룹명', label: '셀러그룹명' },
  { key: '셀러사업권역', label: '셀러사업권역' },
  { key: '셀러상세지역', label: '셀러상세지역' },
  { key: '바이어명', label: '바이어명' },
  { key: '바이어그룹명', label: '바이어그룹명' },
  { key: '바이어사업권역', label: '바이어사업권역' },
  { key: '바이어상세지역', label: '바이어상세지역' },
  { key: '드라이버명', label: '드라이버명' },
  { key: '클레임여부', label: '클레임여부' },
  { key: '클레임/조정 유형', label: '클레임/조정 유형' },
  { key: '클레임/조정 내용', label: '클레임/조정 내용' },
  { key: '바이어정산조정금액', label: '바이어정산조정금액(원)' },
  { key: '셀러정산조정물량', label: '셀러정산조정물량' },
  { key: '셀러정산조정금액', label: '셀러정산조정금액(원)' },
  { key: '드라이버정산조정금액', label: '드라이버정산조정금액(원)' },
  { key: '회계처리용조정금액', label: '회계처리용조정금액(원)' },
  { key: '클레임조정비용합계', label: '클레임/조정비용합계(원)' },
  { key: '매출액', label: '매출액(원)' },
  { key: '매입액', label: '매입액(원)' },
  { key: '운송비', label: '운송비(원)' },
  { key: '거래손익', label: '거래손익(원)' },
  { key: '거래손익율', label: '거래손익율(%)' },
  { key: '상차수수료수익', label: '상차수수료수익(원)' },
  { key: '거래메모', label: '거래메모' },
];

/**
 * 사용자 그룹별 컬럼 프리셋
 */
export const COLUMN_PRESETS = {
  // 넙치 영업사원 뷰
  flatfishSales: [
    '주문일',
    '납품일',
    '품목',
    '원산지',
    '규격',
    '바이어그룹명',
    '상차단가',
    '도착단가정책',
    '도착단가',
    '알파수익단가',
    '통당운임단가',
  ],
  // 경영진 뷰
  executive: [
    '거래코드',
    '납품일',
    '바이어그룹명',
    '품목',
    '주문수량',
    '셀러그룹명',
    '매출액',
    '매입액',
    '운송비',
    '거래손익',
    '클레임여부',
    '클레임/조정 내용',
    '클레임조정비용합계',
    '거래메모',
  ],
  // 영업 리더 뷰 (전체)
  salesLeader: ALL_COLUMNS.map(col => col.key),
  // 기본 뷰
  default: [
    '주문일',
    '납품일',
    '거래코드',
    '품목분류',
    '품목',
    '원산지',
    '규격',
    '주문수량',
    '상차단가',
    '도착단가',
    '셀러그룹명',
    '바이어그룹명',
    '매출액',
    '매입액',
    '거래손익',
  ],
};

/**
 * 데이터를 CSV 형식으로 변환
 */
export const convertToCSV = (data, columns = ALL_COLUMNS) => {
  if (!data || data.length === 0) {
    return '';
  }

  // 헤더 행
  const headers = columns.map(col => col.label).join(',');

  // 데이터 행
  const rows = data.map(row => {
    return columns
      .map(col => {
        let value = row[col.key];

        // null, undefined 처리
        if (value === null || value === undefined) {
          value = '';
        }

        // boolean 처리
        if (typeof value === 'boolean') {
          value = value ? 'O' : 'X';
        }

        // 문자열 처리 (쉼표, 따옴표, 줄바꿈 처리)
        value = String(value);
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
          value = `"${value.replace(/"/g, '""')}"`;
        }

        return value;
      })
      .join(',');
  });

  return [headers, ...rows].join('\n');
};

/**
 * CSV 파일 다운로드
 */
export const downloadCSV = (data, filename, columns = ALL_COLUMNS) => {
  const csv = convertToCSV(data, columns);

  // BOM 추가 (Excel에서 한글 깨짐 방지)
  const BOM = '﻿';
  const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });

  // 다운로드 링크 생성
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

/**
 * 현재 날짜/시간으로 파일명 생성
 */
export const generateFilename = (prefix = '거래장부') => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${prefix}_${year}${month}${day}_${hours}${minutes}${seconds}.csv`;
};

/**
 * 선택된 컬럼 키 배열을 컬럼 객체 배열로 변환
 */
export const getColumnsByKeys = (columnKeys) => {
  return ALL_COLUMNS.filter(col => columnKeys.includes(col.key));
};

/**
 * 거래장부 데이터 CSV 내보내기 (메인 함수)
 */
export const exportLedgerToCSV = (
  data,
  selectedColumns = null,
  filename = null
) => {
  // 컬럼 선택이 없으면 전체 컬럼 사용
  const columns = selectedColumns
    ? getColumnsByKeys(selectedColumns)
    : ALL_COLUMNS;

  // 파일명 생성
  const finalFilename = filename || generateFilename('거래장부');

  // 다운로드
  downloadCSV(data, finalFilename, columns);
};

/**
 * 프리셋별 내보내기
 */
export const exportByPreset = (data, presetKey, filename = null) => {
  const columns = COLUMN_PRESETS[presetKey] || COLUMN_PRESETS.default;
  exportLedgerToCSV(data, columns, filename);
};
