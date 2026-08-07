import React, { useState, useEffect } from 'react';
import { Table, Tabs } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Check, X, AlertCircle } from 'lucide-react';
import { FMButton } from '../components/ui/FMButton';
import LedgerV2FilterSection from '../components/ledger/LedgerV2FilterSection';
import LedgerV2ColumnSelector from '../components/ledger/LedgerV2ColumnSelector';
import LedgerV2ExportModal from '../components/ledger/LedgerV2ExportModal';
import { transactionLedgerDataV2 } from '../data/mockData';
import { enrichTransactionData } from '../utils/ledgerCalculations';
import { applyFilters, multiSortTransactions, getQuickDateRange } from '../utils/ledgerFilters';
import { ALL_COLUMNS } from '../utils/ledgerExport';

const TransactionLedgerV2 = () => {
  const navigate = useNavigate();

  // 데이터 상태
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [displayData, setDisplayData] = useState([]);

  // 활성 탭 (localStorage에서 복원)
  const [activeTab, setActiveTab] = useState(() => {
    const saved = localStorage.getItem('ledgerV2ActiveTab');
    return saved || 'full';
  });

  // 필터 상태
  const [filters, setFilters] = useState(() => {
    const { startDate, endDate } = getQuickDateRange('thisMonth');
    return {
      productCategory: '전체',
      dateField: '주문일',
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    };
  });

  // 컬럼 선택 (전체내역 조회용)
  const [selectedColumns, setSelectedColumns] = useState(() => {
    const saved = localStorage.getItem('ledgerV2SelectedColumns');
    if (saved) return JSON.parse(saved);
    return [
      '주문일', '납품일', '바이어명', '품목', '원산지', '규격', '주문수량', '주문중량',
      '셀러명', '상차수수료율', '상차단가', '도착단가', '알파수익단가',
      '드라이버명', '통당운임단가', '운송비포함여부',
      '클레임여부', '클레임조정비용합계',
      '매출액', '매입액', '운송비', '거래손익',
      '거래메모'
    ];
  });

  // 모달 상태
  const [columnSelectorVisible, setColumnSelectorVisible] = useState(false);
  const [exportModalVisible, setExportModalVisible] = useState(false);

  // 데이터 초기화
  useEffect(() => {
    const enrichedData = enrichTransactionData(transactionLedgerDataV2);
    setAllData(enrichedData);
  }, []);

  // 필터 적용
  useEffect(() => {
    const filtered = applyFilters(allData, filters);
    setFilteredData(filtered);
  }, [allData, filters]);

  // 자동 정렬 적용
  useEffect(() => {
    const sorted = multiSortTransactions(filteredData);
    setDisplayData(sorted);
  }, [filteredData]);

  // 컬럼 선택 저장
  useEffect(() => {
    localStorage.setItem('ledgerV2SelectedColumns', JSON.stringify(selectedColumns));
  }, [selectedColumns]);

  // 활성 탭 저장
  useEffect(() => {
    localStorage.setItem('ledgerV2ActiveTab', activeTab);
  }, [activeTab]);

  // 필터 변경
  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // 필터 초기화
  const handleResetFilters = () => {
    const { startDate, endDate } = getQuickDateRange('thisMonth');
    setFilters({
      productCategory: '전체',
      dateField: '주문일',
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    });
  };

  // 수정 페이지로 이동
  const handleEdit = (record) => {
    navigate(`/transaction-ledger-v2/${record.거래코드}/edit`);
  };

  // 컬럼 선택 적용
  const handleApplyColumns = (columns) => {
    setSelectedColumns(columns);
  };

  // 품목분류 목록 가져오기
  const productCategories = [...new Set(allData.map(item => item.품목분류).filter(Boolean))].sort();

  // 숫자 포맷
  const formatNumber = (num) => {
    if (num === null || num === undefined) return '-';
    return num.toLocaleString();
  };

  // 주문수량 렌더링 (단위 포함)
  const renderQuantityWithUnit = (value, record) => {
    if (value === null || value === undefined) return '-';
    const unit = record.주문단위 || '';
    return `${value.toLocaleString()}${unit}`;
  };

  // 주문중량 렌더링 (kg 포함)
  const renderWeightWithUnit = (value) => {
    if (value === null || value === undefined) return '-';
    return `${formatNumber(value)}kg`;
  };

  // 상차수수료율 렌더링 (% 포함)
  const renderCommissionRate = (value) => {
    if (value === null || value === undefined) return '-';
    return `${value}%`;
  };

  // 필터 옵션 생성 헬퍼 함수
  const getUniqueFilterOptions = (data, key) => {
    const uniqueValues = [...new Set(data.map(item => item[key]).filter(Boolean))];
    return uniqueValues.sort().map(value => ({
      text: value,
      value: value,
    }));
  };

  // 금액 렌더링 (음수는 빨간색)
  const renderAmount = (amount) => {
    if (amount === null || amount === undefined) return '-';
    const formatted = formatNumber(amount);
    const color = amount < 0 ? 'text-red-600 font-semibold' : '';
    return <span className={color}>{formatted}</span>;
  };

  // 퍼센트 렌더링
  const renderPercent = (value) => {
    if (value === null || value === undefined) return '-';
    const color = value < 0 ? 'text-red-600 font-semibold' : '';
    return <span className={color}>{value.toFixed(1)}%</span>;
  };

  // Boolean 렌더링
  const renderBoolean = (value) => {
    return value ? (
      <Check className="w-4 h-4 text-green-600" />
    ) : (
      <X className="w-4 h-4 text-gray-900" />
    );
  };

  // 수정 링크 렌더링
  const renderEditLink = (_, record) => (
    <a
      onClick={() => handleEdit(record)}
      className="text-blue-600 hover:text-blue-800 cursor-pointer underline"
    >
      수정
    </a>
  );

  // 공통 컬럼 정의
  const createColumn = (key, title, width, options = {}) => {
    return {
      title,
      dataIndex: key,
      key,
      width,
      ...options,
    };
  };

  // 단가입력 검증 탭
  const pricingColumns = [
    createColumn('주문일', '주문일', 120),
    createColumn('납품일', '납품일', 120),
    createColumn('품목', '품목', 100, {
      filters: getUniqueFilterOptions(displayData, '품목'),
      onFilter: (value, record) => record.품목 === value,
      filterSearch: true,
    }),
    createColumn('원산지', '원산지', 100, {
      filters: getUniqueFilterOptions(displayData, '원산지'),
      onFilter: (value, record) => record.원산지 === value,
      filterSearch: true,
      render: (value) => {
        if (String(value).includes('미정')) {
          return <span className="inline-block px-2 py-1 bg-red-500 bg-opacity-70 text-white rounded">{value}</span>;
        }
        return value;
      },
    }),
    createColumn('규격', '규격', 100, {
      render: (value) => {
        if (String(value).includes('미정')) {
          return <span className="inline-block px-2 py-1 bg-red-500 bg-opacity-70 text-white rounded">{value}</span>;
        }
        return value;
      },
    }),
    createColumn('주문중량', '주문중량', 120, {
      align: 'right',
      render: (value) => {
        if (String(value).includes('미정') || value === null || value === undefined) {
          return <span className="inline-block px-2 py-1 bg-red-500 bg-opacity-70 text-white rounded">미정</span>;
        }
        return renderWeightWithUnit(value);
      },
    }),
    createColumn('셀러명', '셀러명', 150, {
      filters: getUniqueFilterOptions(displayData, '셀러명'),
      onFilter: (value, record) => record.셀러명 === value,
      filterSearch: true,
      render: (value) => {
        if (String(value).includes('미정')) {
          return <span className="inline-block px-2 py-1 bg-red-500 bg-opacity-70 text-white rounded">{value}</span>;
        }
        return value;
      },
    }),
    createColumn('바이어명', '바이어명', 150, {
      filters: getUniqueFilterOptions(displayData, '바이어명'),
      onFilter: (value, record) => record.바이어명 === value,
      filterSearch: true,
      render: (value) => {
        if (String(value).includes('미정')) {
          return <span className="inline-block px-2 py-1 bg-red-500 bg-opacity-70 text-white rounded">{value}</span>;
        }
        return value;
      },
    }),
    createColumn('상차단가', '상차단가(원)', 120, {
      align: 'right',
      render: (value) => {
        if (String(value).includes('미정')) {
          return <span className="inline-block px-2 py-1 bg-red-500 bg-opacity-70 text-white rounded">미정</span>;
        }
        return renderAmount(value);
      },
    }),
    createColumn('도착단가', '도착단가(원)', 120, {
      align: 'right',
      render: (value) => {
        if (String(value).includes('미정')) {
          return <span className="inline-block px-2 py-1 bg-red-500 bg-opacity-70 text-white rounded">미정</span>;
        }
        return renderAmount(value);
      },
    }),
    createColumn('도착단가정책', '도착단가정책', 120),
    createColumn('알파수익단가', '알파수익단가(원)', 140, {
      align: 'right',
      render: (value) => value === null ? '-' : renderAmount(value),
    }),
    createColumn('셀러상세지역', '셀러상세지역', 120),
    createColumn('바이어상세지역', '바이어상세지역', 120),
    createColumn('드라이버명', '드라이버명', 120, {
      filters: getUniqueFilterOptions(displayData, '드라이버명'),
      onFilter: (value, record) => record.드라이버명 === value,
      filterSearch: true,
      render: (value) => {
        if (String(value).includes('미정')) {
          return <span className="inline-block px-2 py-1 bg-red-500 bg-opacity-70 text-white rounded">{value}</span>;
        }
        return value;
      },
    }),
    createColumn('운송비포함여부', '운송비포함', 100, { align: 'center', render: renderBoolean }),
    createColumn('통당운임단가', '통당운임단가(원)', 150, {
      align: 'right',
      render: (value) => {
        if (String(value).includes('미정')) {
          return <span className="text-yellow-600 font-medium flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />{value}
          </span>;
        }
        return renderAmount(value);
      },
    }),
    createColumn('거래메모', '거래메모', 200),
    createColumn('actions', '수정', 80, { render: renderEditLink }),
  ];

  // 미확정 정보 조회 탭 (미정 포함 거래만)
  const undecidedData = displayData.filter(t => t.미정여부);
  const undecidedColumns = [
    createColumn('주문일', '주문일', 120),
    createColumn('납품일', '납품일', 120),
    createColumn('품목', '품목', 100, {
      filters: getUniqueFilterOptions(undecidedData, '품목'),
      onFilter: (value, record) => record.품목 === value,
      filterSearch: true,
    }),
    createColumn('원산지', '원산지', 100, {
      filters: getUniqueFilterOptions(undecidedData, '원산지'),
      onFilter: (value, record) => record.원산지 === value,
      filterSearch: true,
    }),
    createColumn('규격', '규격', 100),
    createColumn('주문수량', '주문수량', 100, { align: 'right', render: renderQuantityWithUnit }),
    createColumn('주문중량', '주문중량', 120, { align: 'right', render: renderWeightWithUnit }),
    createColumn('셀러명', '셀러명', 150, {
      filters: getUniqueFilterOptions(undecidedData, '셀러명'),
      onFilter: (value, record) => record.셀러명 === value,
      filterSearch: true,
      render: (value) => {
        if (String(value).includes('미정')) {
          return <span className="text-yellow-600 font-medium flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />{value}
          </span>;
        }
        return value;
      },
    }),
    createColumn('바이어명', '바이어명', 150, {
      filters: getUniqueFilterOptions(undecidedData, '바이어명'),
      onFilter: (value, record) => record.바이어명 === value,
      filterSearch: true,
      render: (value) => {
        if (String(value).includes('미정')) {
          return <span className="text-red-600 font-bold">{value}</span>;
        }
        return value;
      },
    }),
    createColumn('상차단가', '상차단가(원)', 120, {
      align: 'right',
      render: (value) => {
        if (String(value).includes('미정')) {
          return <span className="text-yellow-600 font-medium flex items-center justify-end gap-1">
            <AlertCircle className="w-3 h-3" />{value}
          </span>;
        }
        return renderAmount(value);
      },
    }),
    createColumn('도착단가', '도착단가(원)', 120, {
      align: 'right',
      render: (value) => {
        if (String(value).includes('미정')) {
          return <span className="text-yellow-600 font-medium flex items-center justify-end gap-1">
            <AlertCircle className="w-3 h-3" />{value}
          </span>;
        }
        return renderAmount(value);
      },
    }),
    createColumn('드라이버명', '드라이버명', 120, {
      filters: getUniqueFilterOptions(undecidedData, '드라이버명'),
      onFilter: (value, record) => record.드라이버명 === value,
      filterSearch: true,
      render: (value) => {
        if (String(value).includes('미정')) {
          return <span className="text-yellow-600 font-medium flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />{value}
          </span>;
        }
        return value;
      },
    }),
    createColumn('운송비포함여부', '운송비포함', 100, { align: 'center', render: renderBoolean }),
    createColumn('통당운임단가', '통당운임단가(원)', 150, {
      align: 'right',
      render: (value) => {
        if (String(value).includes('미정')) {
          return <span className="text-yellow-600 font-medium flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />{value}
          </span>;
        }
        return renderAmount(value);
      },
    }),
    createColumn('actions', '수정', 80, { render: renderEditLink }),
  ];

  // 거래손익 조회 탭
  const profitColumns = [
    createColumn('주문일', '주문일', 120),
    createColumn('납품일', '납품일', 120),
    createColumn('바이어그룹명', '바이어그룹명', 150, {
      filters: getUniqueFilterOptions(displayData, '바이어그룹명'),
      onFilter: (value, record) => record.바이어그룹명 === value,
      filterSearch: true,
    }),
    createColumn('셀러그룹명', '셀러그룹명', 150, {
      filters: getUniqueFilterOptions(displayData, '셀러그룹명'),
      onFilter: (value, record) => record.셀러그룹명 === value,
      filterSearch: true,
    }),
    createColumn('품목', '품목', 100, {
      filters: getUniqueFilterOptions(displayData, '품목'),
      onFilter: (value, record) => record.품목 === value,
      filterSearch: true,
    }),
    createColumn('규격', '규격', 100),
    createColumn('주문수량', '주문수량', 100, { align: 'right', render: renderQuantityWithUnit }),
    createColumn('매출액', '매출액(원)', 120, { align: 'right', render: renderAmount }),
    createColumn('매입액', '매입액(원)', 120, { align: 'right', render: renderAmount }),
    createColumn('운송비', '운송비(원)', 120, { align: 'right', render: renderAmount }),
    createColumn('거래손익', '거래손익(원)', 120, { align: 'right', render: renderAmount }),
    createColumn('거래손익율', '거래손익율(%)', 120, { align: 'right', render: renderPercent }),
    createColumn('클레임조정비용합계', '클레임조정액합계(원)', 160, { align: 'right', render: renderAmount }),
    createColumn('claimDetail', '클레임세부내역', 120, {
      render: (_, record) => {
        if (!record.클레임여부) return '-';
        return (
          <a className="text-blue-600 hover:text-blue-800 cursor-pointer underline">
            상세보기
          </a>
        );
      },
    }),
    createColumn('거래메모', '거래메모', 200),
    createColumn('actions', '수정', 80, { render: renderEditLink }),
  ];

  // 전체내역 조회 탭 (컬럼 선택 가능)
  const getFullColumns = () => {
    const columnMap = {
      주문코드: createColumn('주문코드', '주문코드', 150),
      거래코드: createColumn('거래코드', '거래코드', 150),
      운송코드: createColumn('운송코드', '운송코드', 150),
      주문일: createColumn('주문일', '주문일', 120),
      납품일: createColumn('납품일', '납품일', 120),
      품목분류: createColumn('품목분류', '품목분류', 100, {
        filters: getUniqueFilterOptions(displayData, '품목분류'),
        onFilter: (value, record) => record.품목분류 === value,
        filterSearch: true,
      }),
      품목: createColumn('품목', '품목', 100, {
        filters: getUniqueFilterOptions(displayData, '품목'),
        onFilter: (value, record) => record.품목 === value,
        filterSearch: true,
      }),
      원산지: createColumn('원산지', '원산지', 100, {
        filters: getUniqueFilterOptions(displayData, '원산지'),
        onFilter: (value, record) => record.원산지 === value,
        filterSearch: true,
      }),
      규격: createColumn('규격', '규격', 100),
      주문수량: createColumn('주문수량', '주문수량', 100, { align: 'right', render: renderQuantityWithUnit }),
      주문중량: createColumn('주문중량', '주문중량', 120, { align: 'right', render: renderWeightWithUnit }),
      상차단가: createColumn('상차단가', '상차단가(원)', 120, { align: 'right', render: renderAmount }),
      상차수수료율: createColumn('상차수수료율', '상차수수료율', 140, { align: 'right', render: renderCommissionRate }),
      도착단가: createColumn('도착단가', '도착단가(원)', 120, { align: 'right', render: renderAmount }),
      도착단가정책: createColumn('도착단가정책', '도착단가정책', 120),
      알파수익단가: createColumn('알파수익단가', '알파수익단가(원)', 140, {
        align: 'right',
        render: (value) => value === null ? '-' : renderAmount(value),
      }),
      통당운임단가: createColumn('통당운임단가', '통당운임단가(원)', 150, {
        align: 'right',
        render: (value) => {
          if (String(value).includes('미정')) {
            return <span className="text-yellow-600 font-medium">{value}</span>;
          }
          return renderAmount(value);
        },
      }),
      운송비포함여부: createColumn('운송비포함여부', '운송비포함', 100, { align: 'center', render: renderBoolean }),
      셀러그룹명: createColumn('셀러그룹명', '셀러그룹명', 150, {
        filters: getUniqueFilterOptions(displayData, '셀러그룹명'),
        onFilter: (value, record) => record.셀러그룹명 === value,
        filterSearch: true,
      }),
      셀러명: createColumn('셀러명', '셀러명', 150, {
        filters: getUniqueFilterOptions(displayData, '셀러명'),
        onFilter: (value, record) => record.셀러명 === value,
        filterSearch: true,
      }),
      셀러사업권역: createColumn('셀러사업권역', '셀러사업권역', 120, {
        filters: getUniqueFilterOptions(displayData, '셀러사업권역'),
        onFilter: (value, record) => record.셀러사업권역 === value,
        filterSearch: true,
      }),
      셀러상세지역: createColumn('셀러상세지역', '셀러상세지역', 120),
      바이어그룹명: createColumn('바이어그룹명', '바이어그룹명', 150, {
        filters: getUniqueFilterOptions(displayData, '바이어그룹명'),
        onFilter: (value, record) => record.바이어그룹명 === value,
        filterSearch: true,
      }),
      바이어명: createColumn('바이어명', '바이어명', 150, {
        filters: getUniqueFilterOptions(displayData, '바이어명'),
        onFilter: (value, record) => record.바이어명 === value,
        filterSearch: true,
        render: (value) => {
          if (String(value).includes('미정')) {
            return <span className="text-red-600 font-bold">{value}</span>;
          }
          return value;
        },
      }),
      바이어사업권역: createColumn('바이어사업권역', '바이어사업권역', 120, {
        filters: getUniqueFilterOptions(displayData, '바이어사업권역'),
        onFilter: (value, record) => record.바이어사업권역 === value,
        filterSearch: true,
      }),
      바이어상세지역: createColumn('바이어상세지역', '바이어상세지역', 120),
      드라이버명: createColumn('드라이버명', '드라이버명', 120, {
        filters: getUniqueFilterOptions(displayData, '드라이버명'),
        onFilter: (value, record) => record.드라이버명 === value,
        filterSearch: true,
      }),
      클레임여부: createColumn('클레임여부', '클레임여부', 100, {
        align: 'center',
        render: renderBoolean,
        filters: [
          { text: '클레임 있음', value: true },
          { text: '클레임 없음', value: false },
        ],
        onFilter: (value, record) => record.클레임여부 === value,
      }),
      '클레임/조정 유형': createColumn('클레임/조정 유형', '클레임/조정 유형', 120),
      '클레임/조정 내용': createColumn('클레임/조정 내용', '클레임/조정 내용', 200),
      바이어정산조정금액: createColumn('바이어정산조정금액', '바이어정산조정금액(원)', 160, { align: 'right', render: renderAmount }),
      셀러정산조정물량: createColumn('셀러정산조정물량', '셀러정산조정물량', 140, { align: 'right', render: formatNumber }),
      셀러정산조정금액: createColumn('셀러정산조정금액', '셀러정산조정금액(원)', 160, { align: 'right', render: renderAmount }),
      드라이버정산조정금액: createColumn('드라이버정산조정금액', '드라이버정산조정금액(원)', 180, { align: 'right', render: renderAmount }),
      회계처리용조정금액: createColumn('회계처리용조정금액', '회계처리용조정금액(원)', 180, { align: 'right', render: renderAmount }),
      클레임조정비용합계: createColumn('클레임조정비용합계', '클레임조정액합계(원)', 180, { align: 'right', render: renderAmount }),
      매출액: createColumn('매출액', '매출액(원)', 120, { align: 'right', render: renderAmount }),
      매입액: createColumn('매입액', '매입액(원)', 120, { align: 'right', render: renderAmount }),
      운송비: createColumn('운송비', '운송비(원)', 120, { align: 'right', render: renderAmount }),
      거래손익: createColumn('거래손익', '거래손익(원)', 120, { align: 'right', render: renderAmount }),
      거래손익율: createColumn('거래손익율', '거래손익율(%)', 120, { align: 'right', render: renderPercent }),
      상차수수료수익: createColumn('상차수수료수익', '상차수수료수익(원)', 150, { align: 'right', render: renderAmount }),
      거래메모: createColumn('거래메모', '거래메모', 200),
    };

    const columns = selectedColumns.map(key => columnMap[key]).filter(Boolean);

    // 클레임세부보기 컬럼 추가
    columns.push(createColumn('claimDetail', '클레임세부보기', 120, {
      render: (_, record) => {
        if (!record.클레임여부) return '-';
        return (
          <a className="text-blue-600 hover:text-blue-800 cursor-pointer underline">
            상세보기
          </a>
        );
      },
    }));

    // 수정 컬럼 추가
    columns.push(createColumn('actions', '수정', 80, { render: renderEditLink }));

    return columns;
  };

  const tabItems = [
    {
      key: 'full',
      label: '📒 전체내역 조회',
      children: (
        <Table
          columns={getFullColumns()}
          dataSource={displayData}
          rowKey="거래코드"
          scroll={{ x: 'max-content', y: 600 }}
          pagination={{
            pageSize: 50,
            showSizeChanger: true,
            showTotal: (total) => `총 ${total}건`,
            pageSizeOptions: ['20', '50', '100', '200'],
          }}
          size="middle"
          bordered
        />
      ),
    },
    {
      key: 'pricing',
      label: '🔍 미정/단가 검증',
      children: (
        <Table
          columns={pricingColumns}
          dataSource={displayData}
          rowKey="거래코드"
          scroll={{ x: 'max-content', y: 600 }}
          pagination={{
            pageSize: 50,
            showSizeChanger: true,
            showTotal: (total) => `총 ${total}건`,
            pageSizeOptions: ['20', '50', '100', '200'],
          }}
          size="middle"
          bordered
        />
      ),
    },
    {
      key: 'profit',
      label: '🧮 거래지표 조회',
      children: (
        <Table
          columns={profitColumns}
          dataSource={displayData}
          rowKey="거래코드"
          scroll={{ x: 'max-content', y: 600 }}
          pagination={{
            pageSize: 50,
            showSizeChanger: true,
            showTotal: (total) => `총 ${total}건`,
            pageSizeOptions: ['20', '50', '100', '200'],
          }}
          size="middle"
          bordered
        />
      ),
    },
  ];

  return (
    <div className="p-6">
      {/* 헤더 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          거래장부
        </h1>
      </div>

      {/* 필터 섹션 */}
      <LedgerV2FilterSection
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        productCategories={productCategories}
      />

      {/* 테이블 섹션 */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        {/* 액션 버튼 */}
        <div className="flex items-center justify-end gap-2 mb-4">
          {activeTab === 'full' && (
            <FMButton
              onClick={() => setColumnSelectorVisible(true)}
              variant="yellow"
            >
              컬럼 선택 ({selectedColumns.length})
            </FMButton>
          )}
          <FMButton
            onClick={() => setExportModalVisible(true)}
            variant="indigo"
          >
            CSV 다운로드
          </FMButton>
        </div>

        {/* 탭 */}
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
        />
      </div>

      {/* 컬럼 선택 모달 */}
      <LedgerV2ColumnSelector
        visible={columnSelectorVisible}
        onClose={() => setColumnSelectorVisible(false)}
        selectedColumns={selectedColumns}
        onApply={handleApplyColumns}
      />

      {/* CSV 다운로드 모달 */}
      <LedgerV2ExportModal
        visible={exportModalVisible}
        onClose={() => setExportModalVisible(false)}
        currentData={displayData}
        allData={allData}
        selectedColumns={selectedColumns}
      />
    </div>
  );
};

export default TransactionLedgerV2;
