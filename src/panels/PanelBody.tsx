import * as React from 'react';
import classNames from 'classnames';
import PanelContext from '../PanelContext';
import getHideStyle from '../panels/DatePanel/until';
export interface PanelBodyProps<DateType> {
  weekFirstDay?: number;
  prefixCls: string;
  disabledDate?: (date: DateType) => boolean;
  onSelect: (value: DateType) => void;

  // By panel
  headerCells?: React.ReactNode;
  rowNum: number;
  colNum: number;
  baseDate: DateType;
  getCellClassName: (date: DateType) => Record<string, boolean | undefined>;
  getCellDate: (date: DateType, offset: number) => DateType;
  getCellText: (date: DateType) => React.ReactNode;
  getCellNode?: (date: DateType) => React.ReactNode;
  titleCell?: (date: DateType) => string;

  // Used for week panel
  prefixColumn?: (date: DateType) => React.ReactNode;
  rowClassName?: (date: DateType) => string;
  showRestDay?: boolean;
  showExtraCol?: boolean;
  getCellExtraColNode?: React.ReactNode;
}

export default function PanelBody<DateType>({
  weekFirstDay,
  prefixCls,
  disabledDate,
  onSelect,
  rowNum,
  colNum,
  prefixColumn,
  rowClassName,
  baseDate,
  getCellClassName,
  getCellText,
  getCellNode,
  getCellDate,
  titleCell,
  headerCells,
  showRestDay = false,
  showExtraCol = true,
  getCellExtraColNode,
}: PanelBodyProps<DateType>) {
  const { onDateMouseEnter, onDateMouseLeave } = React.useContext(PanelContext);

  const cellPrefixCls = `${prefixCls}-cell`;

  // =============================== Body ===============================
  const rows: React.ReactNode[] = [];
  for (let i = 0; i < rowNum; i += 1) {
    const row: React.ReactNode[] = [];
    let rowStartDate: DateType;

    const extraColNode = getExtraColRender(i, { getCellDate, baseDate, getCellExtraColNode });
    const initTd = showExtraCol ? [extraColNode] : [];

    for (let j = 0; j < colNum; j += 1) {
      const offset = i * colNum + j;
      const currentDate = getCellDate(baseDate, offset);
      const disabled = disabledDate && disabledDate(currentDate);

      if (j === 0) {
        rowStartDate = currentDate;

        if (prefixColumn) {
          row.push(prefixColumn(rowStartDate));
        }
      }
      const hiddenStyle = showRestDay ? {} : getHideStyle(j, weekFirstDay);
      row.push(
        <td
          {...hiddenStyle}
          key={j}
          title={titleCell && titleCell(currentDate)}
          className={classNames(cellPrefixCls, {
            [`${cellPrefixCls}-disabled`]: disabled,
            ...getCellClassName(currentDate),
          })}
          onClick={() => {
            if (!disabled) {
              onSelect(currentDate);
            }
          }}
          onMouseEnter={() => {
            if (!disabled && onDateMouseEnter) {
              onDateMouseEnter(currentDate);
            }
          }}
          onMouseLeave={() => {
            if (!disabled && onDateMouseLeave) {
              onDateMouseLeave(currentDate);
            }
          }}
        >
          {getCellNode ? (
            getCellNode(currentDate)
          ) : (
            <div className={`${cellPrefixCls}-inner`}>{getCellText(currentDate)}</div>
          )}
        </td>,
      );
    }

    rows.push(
      <tr key={i} className={rowClassName && rowClassName(rowStartDate!)}>
        {initTd}
        {row}
      </tr>,
    );
  }

  return (
    <div className={`${prefixCls}-body`}>
      <table className={`${prefixCls}-content`}>
        {headerCells && (
          <thead>
            <tr>{headerCells}</tr>
          </thead>
        )}
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
}
function getExtraColRender(rowNumber, props) {
  const { getCellDate, baseDate, getCellExtraColNode } = props;
  const weekStartOffset = rowNumber * 7;
  const weekEndOffset = rowNumber * 7 + (7 - 1);
  const weekStartDate = getCellDate(baseDate, weekStartOffset);
  const weekEndDate = getCellDate(baseDate, weekEndOffset);
  return (
    <td>
      {getCellExtraColNode ? (
        getCellExtraColNode([weekStartDate, weekEndDate])
      ) : (
        <div style={{ textAlign: 'center' }}>自定义</div>
      )}
    </td>
  );
}
