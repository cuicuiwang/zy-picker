import React from 'react';
import { Moment } from 'moment';
import Picker from '../src/Picker';
import PickerPanel from '../src/PickerPanel';
import momentGenerateConfig from '../src/generate/moment';
import zhCN from '../src/locale/zh_CN';
import '../assets/index.less';

function dateRender(date: Moment, today: Moment) {
  return (
    <div
      style={{
        width: 80,
        height: 80,
        borderTop: '3px solid #CCC',
        borderTopColor: date.isSame(today, 'date') ? 'blue' : '#CCC',
      }}
    >
      {date.date()}
    </div>
  );
}
function extraColRender(date: Moment) {
  if (date[0].date() === 29) {
    return (
      <div
        style={{
          width: 80,
          height: 80,
          borderTop: '3px solid #CCC',
        }}
      >
        <div>2222</div>
      </div>
    );
  }
  return '自定义';
}
export default () => (
  <div style={{ display: 'flex', flexWrap: 'wrap' }}>
    <div>
      <PickerPanel<Moment>
        locale={zhCN}
        // picker="month"
        generateConfig={momentGenerateConfig}
        dateRender={dateRender}
        extraColRender={extraColRender}
        showRestDay
        showExtraCol
      />
    </div>
    <div>
      <Picker<Moment> locale={zhCN} generateConfig={momentGenerateConfig} dateRender={dateRender} />
    </div>
  </div>
);
