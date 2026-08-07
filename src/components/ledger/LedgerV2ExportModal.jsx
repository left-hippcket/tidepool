import React, { useState } from 'react';
import { Modal, Radio, Checkbox } from 'antd';
import { FMButton } from '../ui/FMButton';
import { exportLedgerToCSV, COLUMN_PRESETS } from '../../utils/ledgerExport';

const LedgerV2ExportModal = ({
  visible,
  onClose,
  currentData,
  allData,
  selectedColumns,
}) => {
  const [exportRange, setExportRange] = useState('current'); // 'current' or 'all'
  const [exportColumns, setExportColumns] = useState('selected'); // 'selected' or 'all'

  const handleExport = () => {
    const dataToExport = exportRange === 'current' ? currentData : allData;
    const columnsToExport =
      exportColumns === 'selected' ? selectedColumns : null;

    exportLedgerToCSV(dataToExport, columnsToExport);
    onClose();
  };

  const dataCount = exportRange === 'current' ? currentData.length : allData.length;
  const columnCount =
    exportColumns === 'selected' ? selectedColumns.length : '전체';

  return (
    <Modal
      title="CSV 다운로드"
      open={visible}
      onCancel={onClose}
      width={500}
      footer={[
        <FMButton key="cancel" onClick={onClose} variant="secondary">
          취소
        </FMButton>,
        <FMButton key="export" onClick={handleExport} variant="primary">
          다운로드
        </FMButton>,
      ]}
    >
      <div className="space-y-6">
        {/* 데이터 범위 선택 */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            데이터 범위
          </h4>
          <Radio.Group
            value={exportRange}
            onChange={(e) => setExportRange(e.target.value)}
          >
            <div className="space-y-2">
              <Radio value="current">
                <span className="text-sm">
                  현재 조회 결과 ({currentData.length}건)
                </span>
              </Radio>
              <Radio value="all">
                <span className="text-sm">전체 데이터 ({allData.length}건)</span>
              </Radio>
            </div>
          </Radio.Group>
        </div>

        {/* 컬럼 선택 */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            내보낼 컬럼
          </h4>
          <Radio.Group
            value={exportColumns}
            onChange={(e) => setExportColumns(e.target.value)}
          >
            <div className="space-y-2">
              <Radio value="selected">
                <span className="text-sm">
                  현재 선택된 컬럼 ({selectedColumns.length}개)
                </span>
              </Radio>
              <Radio value="all">
                <span className="text-sm">전체 컬럼</span>
              </Radio>
            </div>
          </Radio.Group>
        </div>

        {/* 요약 정보 */}
        <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
          <p className="text-sm text-gray-700">
            <strong>다운로드 내용:</strong>
          </p>
          <ul className="mt-2 text-sm text-gray-600 space-y-1">
            <li>• 데이터: {dataCount}건</li>
            <li>• 컬럼: {columnCount}개</li>
            <li>• 파일형식: CSV (UTF-8 with BOM)</li>
          </ul>
        </div>

        {/* 안내 메시지 */}
        <div className="text-xs text-gray-500 bg-gray-50 rounded p-3">
          <p className="font-medium mb-1">💡 안내사항</p>
          <ul className="space-y-1 ml-4 list-disc">
            <li>Excel에서 한글이 깨지지 않도록 UTF-8 BOM이 포함됩니다.</li>
            <li>파일명은 자동으로 생성됩니다 (거래장부_날짜_시간.csv)</li>
            <li>계산 필드(매출액, 손익 등)도 함께 내보내집니다.</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};

export default LedgerV2ExportModal;
