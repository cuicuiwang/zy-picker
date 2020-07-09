import * as React from 'react';
import { GenerateConfig } from '../../generate';
import { WEEK_DAY_COUNT, getWeekStartDate, isSameDate, isSameMonth } from '../../utils/dateUtil';
import { Locale } from '../../interface';
import RangeContext from '../../RangeContext';
import useCellClassName from '../../hooks/useCellClassName';
import PanelBody from '../PanelBody';
import getHideStyle from './until';
export type DateRender<DateType> = (currentDate: DateType, today: DateType) => React.ReactNode;
export type ExtraColRender<DateType> = (currentDate: DateType, today: DateType) => React.ReactNode;

export interface DateBodyPassProps<DateType> {
  dateRender?: DateRender<DateType>;
  extraColRender?: ExtraColRender<DateType>;
  disabledDate?: (date: DateType) => boolean;

  // Used for week panel
  prefixColumn?: (date: DateType) => React.ReactNode;
  rowClassName?: (date: DateType) => string;
}

export interface DateBodyProps<DateType> extends DateBodyPassProps<DateType> {
  prefixCls: string;
  generateConfig: GenerateConfig<DateType>;
  value?: DateType | null;
  viewDate: DateType;
  locale: Locale;
  rowCount: number;
  onSelect: (value: DateType) => void;
  showRestDay?: boolean;
  showExtraCol?: boolean;
}

function DateBody<DateType>(props: DateBodyProps<DateType>) {
  const {
    prefixCls,
    generateConfig,
    prefixColumn,
    locale,
    rowCount,
    viewDate,
    value,
    dateRender,
    extraColRender,
    showRestDay = false,
    showExtraCol = true,
  } = props;

  const { rangedValue, hoverRangedValue } = React.useContext(RangeContext);

  const baseDate = getWeekStartDate(locale.locale, generateConfig, viewDate);
  const cellPrefixCls = `${prefixCls}-cell`;
  const weekFirstDay = generateConfig.locale.getWeekFirstDay(locale.locale);
  const today = generateConfig.getNow();

  // ============================== Header ==============================
  const init = showExtraCol
    ? [
        <th>
          <div style={{ textAlign: 'center' }}>周总结</div>
        </th>,
      ]
    : [];
  const headerCells: React.ReactNode[] = [...init];
  const weekDaysLocale: string[] =
    locale.shortWeekDays ||
    (generateConfig.locale.getShortWeekDays
      ? generateConfig.locale.getShortWeekDays(locale.locale)
      : []);

  if (prefixColumn) {
    headerCells.push(<th key="empty" aria-label="empty cell" />);
  }
  for (let i = 0; i < WEEK_DAY_COUNT; i += 1) {
    const style = showRestDay ? {} : getHideStyle(i, weekFirstDay);
    headerCells.push(
      <th {...style} key={i}>
        {weekDaysLocale[(i + weekFirstDay) % WEEK_DAY_COUNT]}
      </th>,
    );
  }

  // =============================== Body ===============================
  const getCellClassName = useCellClassName({
    cellPrefixCls,
    today,
    value,
    generateConfig,
    rangedValue: prefixColumn ? null : rangedValue,
    hoverRangedValue: prefixColumn ? null : hoverRangedValue,
    isSameCell: (current, target) => isSameDate(generateConfig, current, target),
    isInView: (date) => isSameMonth(generateConfig, date, viewDate),
    offsetCell: (date, offset) => generateConfig.addDate(date, offset),
  });

  const getCellNode = dateRender ? (date: DateType) => dateRender(date, today) : undefined;
  const getCellExtraColNode = extraColRender
    ? (date: DateType) => extraColRender(date, today)
    : undefined;

  return (
    <PanelBody
      {...props}
      rowNum={rowCount}
      colNum={WEEK_DAY_COUNT}
      baseDate={baseDate}
      getCellNode={getCellNode}
      getCellText={generateConfig.getDate}
      getCellClassName={getCellClassName}
      getCellDate={generateConfig.addDate}
      titleCell={(date) => generateConfig.locale.format(locale.locale, date, 'YYYY-MM-DD')}
      headerCells={headerCells}
      weekFirstDay={weekFirstDay}
      showExtraCol={showExtraCol}
      getCellExtraColNode={getCellExtraColNode}
    />
  );
}

export default DateBody;
