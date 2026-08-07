import React, { useState } from 'react';
import { Modal, Checkbox } from 'antd';
import { FMButton } from '../ui/FMButton';
import { ALL_COLUMNS } from '../../utils/ledgerExport';

const LedgerV2ColumnSelector = ({ visible, onClose, selectedColumns, onApply }) => {
  const [localSelected, setLocalSelected] = useState(selectedColumns);

  const handleCheckboxChange = (columnKey, checked) => {
    if (checked) {
      setLocalSelected([...localSelected, columnKey]);
    } else {
      setLocalSelected(localSelected.filter((key) => key !== columnKey));
    }
  };

  const handleSelectAll = () => {
    setLocalSelected(ALL_COLUMNS.map((col) => col.key));
  };

  const handleDeselectAll = () => {
    setLocalSelected([]);
  };

  const handleApply = () => {
    // ALL_COLUMNS의 순서대로 정렬
    const sortedSelected = ALL_COLUMNS
      .filter(col => localSelected.includes(col.key))
      .map(col => col.key);

    onApply(sortedSelected);
    onClose();
  };

  const handleCancel = () => {
    setLocalSelected(selectedColumns);
    onClose();
  };

  // 컬럼을 그룹별로 분류
  const columnGroups = {
    기본정보: [
      '주문코드',
      '거래코드',
      '운송코드',
      '주문일',
      '납품일',
      '거래메모',
    ],
    상품정보: ['품목분류', '품목', '원산지', '규격'],
    수량금액: [
      '주문수량',
      '주문중량',
      '상차단가',
      '도착단가',
      '알파수익단가',
      '상차수수료율',
      '통당운임단가',
      '운송비포함여부',
      '도착단가정책',
    ],
    파트너정보: [
      '셀러명',
      '셀러그룹명',
      '셀러사업권역',
      '셀러상세지역',
      '바이어명',
      '바이어그룹명',
      '바이어사업권역',
      '바이어상세지역',
      '드라이버명',
    ],
    클레임정보: [
      '클레임여부',
      '클레임/조정 유형',
      '클레임/조정 내용',
      '바이어정산조정금액',
      '셀러정산조정물량',
      '셀러정산조정금액',
      '드라이버정산조정금액',
      '회계처리용조정금액',
      '클레임조정비용합계',
    ],
    손익정보: [
      '매출액',
      '매입액',
      '운송비',
      '거래손익',
      '거래손익율',
      '상차수수료수익',
    ],
  };

  const renderColumnGroup = (groupName, columnKeys) => {
    return (
      <div key={groupName} className="mb-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">
          {groupName}
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {columnKeys.map((key) => {
            const column = ALL_COLUMNS.find((col) => col.key === key);
            if (!column) return null;
            return (
              <Checkbox
                key={key}
                checked={localSelected.includes(key)}
                onChange={(e) => handleCheckboxChange(key, e.target.checked)}
              >
                <span className="text-sm">{column.label}</span>
              </Checkbox>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Modal
      title="컬럼 선택"
      open={visible}
      onCancel={handleCancel}
      width={800}
      footer={[
        <FMButton key="cancel" onClick={handleCancel} variant="primary">
          취소
        </FMButton>,
        <FMButton key="apply" onClick={handleApply} variant="green">
          적용 ({localSelected.length}개 선택)
        </FMButton>,
      ]}
    >
      <div className="max-h-96 overflow-y-auto pr-2">
        <div className="flex gap-2 mb-4">
          <FMButton onClick={handleSelectAll} size="small" variant="green">
            전체 선택
          </FMButton>
          <FMButton
            onClick={handleDeselectAll}
            size="small"
            variant="outline"
          >
            전체 해제
          </FMButton>
        </div>
        {Object.entries(columnGroups).map(([groupName, columnKeys]) =>
          renderColumnGroup(groupName, columnKeys)
        )}
      </div>
    </Modal>
  );
};

export default LedgerV2ColumnSelector;
