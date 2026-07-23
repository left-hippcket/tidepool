import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card, Table, Button, DatePicker, Space, Typography, Badge, message, Divider
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { claimAdjustmentData } from '../data/mockData';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const { Title } = Typography;
const { RangePicker } = DatePicker;

function ClaimAdjustmentList() {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState([dayjs().subtract(29, 'day'), dayjs()]);
  const [expandedRowKey, setExpandedRowKey] = useState(null);

  // 날짜 범위 필터링
  const getFilteredData = () => {
    if (!dateRange || dateRange.length !== 2) return claimAdjustmentData;

    const [start, end] = dateRange;
    return claimAdjustmentData.filter(item => {
      const deliveryDate = dayjs(item.납품일);
      return deliveryDate.isSameOrAfter(start, 'day') && deliveryDate.isSameOrBefore(end, 'day');
    });
  };

  const filteredData = getFilteredData();

  // 빠른 날짜 선택
  const handleQuickDate = (type) => {
    const today = dayjs();
    switch(type) {
      case 'today':
        setDateRange([today, today]);
        break;
      case 'yesterday':
        setDateRange([today.subtract(1, 'day'), today.subtract(1, 'day')]);
        break;
      case '7days':
        setDateRange([today.subtract(6, 'day'), today]);
        break;
      case '30days':
        setDateRange([today.subtract(29, 'day'), today]);
        break;
      default:
        break;
    }
  };

  // 금액 포맷
  const formatCurrency = (value) => {
    if (value === null || value === undefined) return '-';
    return `${value.toLocaleString()}원`;
  };

  // 유니크 값 추출 (필터용)
  const getUniqueValues = (data, field) => {
    const unique = [...new Set(data.map(item => item[field]))].filter(Boolean);
    return unique.sort().map(value => ({ text: value, value }));
  };

  // 액션 핸들러 (P2에서 구현)
  const handleEdit = (e, id) => {
    e.stopPropagation();
    message.info('수정 기능은 P2 단계에서 구현됩니다.');
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    message.info('삭제 기능은 P2 단계에서 구현됩니다.');
  };

  const handleRegister = () => {
    navigate('/claim-adjustment/register');
  };

  // 아코디언 상세 패널
  const renderExpandedRow = (record) => {
    const Field = ({ label, value, span = 1, isAmount = false }) => (
      <div style={{ gridColumn: `span ${span}` }}>
        <div style={{ fontSize: '11px', color: '#8c8c8c', marginBottom: '4px' }}>
          {label}
        </div>
        <div style={{
          fontSize: isAmount ? '14px' : '13px',
          fontWeight: isAmount ? 600 : 500,
          color: typeof value === 'number' && value < 0 ? '#ff4d4f' : 'inherit'
        }}>
          {value}
        </div>
      </div>
    );

    const hasAdjustment = record.장부반영여부;

    return (
      <div style={{ maxHeight: '600px', overflowY: 'auto', padding: '16px', backgroundColor: '#fff' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(8, 1fr)',
          gap: '12px 12px',
          marginBottom: hasAdjustment ? '16px' : '0'
        }}>
          {/* 1행 - 기본정보 */}
          <Field label="거래코드" value={record.거래코드} />
          <Field label="주문일" value={record.주문일} />
          <Field label="납품일" value={record.납품일} />
          <Field label="품목" value={record.품목} />
          <Field label="원산지" value={record.원산지} />
          <Field label="규격" value={record.규격} />
          <Field label="셀러그룹명" value={record.셀러그룹명} />
          <Field label="바이어그룹명" value={record.바이어그룹명} />

          {/* 2행 - 파트너 */}
          <Field label="셀러명" value={record.셀러명} />
          <Field label="바이어명" value={record.바이어명} />
          <Field label="바이어사업권역" value={record.바이어사업권역} />
          <Field label="드라이버명" value={record.드라이버명} />
          <Field label="주문수량" value={`${record.주문수량}통`} />
          <Field label="주문중량" value={`${record.주문중량}kg`} />
          <Field label="상차단가" value={formatCurrency(record.상차단가)} isAmount />
          <Field label="상차수수료율" value={`${record.상차수수료율}%`} />

          {/* 3행 - 단가/운송 */}
          <Field label="통당운임단가" value={formatCurrency(record.통당운임단가)} isAmount />
          <Field label="운송비포함여부" value={record.운송비포함여부} />
          <Field label="도착단가" value={formatCurrency(record.도착단가)} isAmount />
          <Field
            label="알파수익단가"
            value={formatCurrency(record.알파수익단가)}
            isAmount
          />
          <Field label="매출액" value={formatCurrency(record.매출액)} isAmount />
          <Field label="매입액" value={formatCurrency(record.매입액)} isAmount />
          <Field label="운송비(비용)" value={formatCurrency(record['운송비(비용)'])} isAmount />
          <Field
            label="거래손익"
            value={formatCurrency(record.거래손익)}
            isAmount
          />

          {/* 4행 - 손익 */}
          <Field label="상차수수료수익" value={formatCurrency(record.상차수수료수익)} isAmount />
          <Field
            label="셀러조정손익"
            value={formatCurrency(record.셀러조정손익)}
            isAmount
          />
          <Field
            label="바이어조정손익"
            value={formatCurrency(record.바이어조정손익)}
            isAmount
          />
        </div>

        {/* 조정·클레임 섹션 (조건부) */}
        {hasAdjustment && (
          <div style={{
            backgroundColor: '#fff7e6',
            padding: '12px',
            borderRadius: '4px',
            marginBottom: record.거래메모 ? '16px' : '0'
          }}>
            <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '12px', color: '#d46b08' }}>
              ⚠️ 조정·클레임 정보
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(8, 1fr)',
              gap: '12px 12px'
            }}>
              <Field label="유형" value={record.클레임유형} span={1} />
              <Field label="심각도" value={record.심각도} span={1} />
              <Field label="내용" value={record.클레임내용} span={3} />
              <Field
                label="바이어조정액"
                value={formatCurrency(record.바이어조정액)}
                isAmount
              />
              <Field label="셀러조정물량" value={record.셀러조정물량 || '-'} />
              <Field
                label="셀러조정액"
                value={formatCurrency(record.셀러조정액)}
                isAmount
              />
              <Field
                label="기사조정액"
                value={formatCurrency(record.드라이버조정액)}
                isAmount
              />
              <Field
                label="회계처리조정액"
                value={formatCurrency(record.회계처리조정액)}
                isAmount
              />
              <Field
                label="최종손실"
                value={formatCurrency(record.최종손실)}
                isAmount
              />
              <Field label="손실귀책" value={record.귀책 || '-'} />
            </div>
          </div>
        )}

        {/* 거래메모 섹션 (조건부) */}
        {record.거래메모 && (
          <div style={{
            backgroundColor: '#e6f7ff',
            padding: '12px',
            borderRadius: '4px'
          }}>
            <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: '#1890ff' }}>
              📝 거래메모
            </div>
            <div style={{ fontSize: '13px', color: '#595959' }}>
              {record.거래메모}
            </div>
          </div>
        )}
      </div>
    );
  };

  // 테이블 칼럼
  const columns = [
    {
      title: '납품일',
      dataIndex: '납품일',
      key: '납품일',
      width: 120,
      sorter: (a, b) => dayjs(a.납품일).unix() - dayjs(b.납품일).unix(),
      defaultSortOrder: 'descend',
    },
    {
      title: '거래코드',
      dataIndex: '거래코드',
      key: '거래코드',
      width: 160,
    },
    {
      title: '품목',
      dataIndex: '품목',
      key: '품목',
      width: 80,
    },
    {
      title: '규격',
      dataIndex: '규격',
      key: '규격',
      width: 100,
    },
    {
      title: '바이어그룹명',
      dataIndex: '바이어그룹명',
      key: '바이어그룹명',
      width: 140,
      filters: getUniqueValues(filteredData, '바이어그룹명'),
      onFilter: (value, record) => record.바이어그룹명 === value,
    },
    {
      title: '셀러그룹명',
      dataIndex: '셀러그룹명',
      key: '셀러그룹명',
      width: 140,
      filters: getUniqueValues(filteredData, '셀러그룹명'),
      onFilter: (value, record) => record.셀러그룹명 === value,
    },
    {
      title: '클레임유형',
      dataIndex: '클레임유형',
      key: '클레임유형',
      width: 120,
    },
    {
      title: '심각도',
      dataIndex: '심각도',
      key: '심각도',
      width: 100,
      render: (value) => {
        const colorMap = {
          '매우심각': 'red',
          '심각': 'orange',
          '보통': 'default',
        };
        return <Badge color={colorMap[value]} text={value} />;
      },
    },
    {
      title: '클레임내용',
      dataIndex: '클레임내용',
      key: '클레임내용',
      width: 250,
      render: (text) => {
        if (!text) return '-';
        return text.length > 50 ? text.substring(0, 50) + '...' : text;
      },
    },
    {
      title: '장부반영',
      dataIndex: '장부반영여부',
      key: '장부반영여부',
      width: 100,
      align: 'center',
      render: (value) => value ? '✓' : '',
    },
    {
      title: '최종손실',
      dataIndex: '최종손실',
      key: '최종손실',
      width: 120,
      align: 'right',
      render: (value, record) => {
        if (!record.장부반영여부) return '-';
        if (!value && value !== 0) return '-';
        const color = value < 0 ? '#ff4d4f' : undefined;
        return <span style={{ color }}>{formatCurrency(value)}</span>;
      },
    },
    {
      title: '액션',
      key: 'action',
      align: 'center',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button size="small" onClick={(e) => handleEdit(e, record.id)}>
            수정
          </Button>
          <Button size="small" danger onClick={(e) => handleDelete(e, record.id)}>
            삭제
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* 헤더 */}
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Title level={2} style={{ margin: 0 }}>클레임/조정 관리</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleRegister}
        >
          클레임/조정 등록
        </Button>
      </div>

      {/* 날짜 필터 */}
      <Card style={{ marginBottom: 16 }}>
        <Space wrap>
          <Button onClick={() => handleQuickDate('today')}>오늘</Button>
          <Button onClick={() => handleQuickDate('yesterday')}>어제</Button>
          <Button onClick={() => handleQuickDate('7days')}>최근 7일</Button>
          <Button onClick={() => handleQuickDate('30days')}>최근 30일</Button>
          <RangePicker
            value={dateRange}
            onChange={setDateRange}
            format="YYYY-MM-DD"
            style={{ width: 300 }}
          />
        </Space>
      </Card>

      {/* 테이블 */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{
            defaultPageSize: 20,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTotal: (total) => `전체 ${total}건`,
          }}
          expandable={{
            expandedRowKeys: expandedRowKey ? [expandedRowKey] : [],
            expandedRowRender: renderExpandedRow,
            showExpandColumn: false,
          }}
          onRow={(record) => ({
            onClick: () => {
              setExpandedRowKey(expandedRowKey === record.id ? null : record.id);
            },
            style: { cursor: 'pointer' },
          })}
          scroll={{ x: 1800 }}
        />
      </Card>
    </div>
  );
}

export default ClaimAdjustmentList;
