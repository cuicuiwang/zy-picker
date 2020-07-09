/**
 * @flow
 * @Description:
 * @author cuixia wang
 * @date 2020-07-04
 */
import { WEEK_DAY_COUNT } from '../../utils/dateUtil';

export default function getHideStyle(i, weekFirstDay) {
  let hiddenStyle = {};
  const hideNode =
    i % (WEEK_DAY_COUNT - weekFirstDay) === 0 || i % (WEEK_DAY_COUNT - (weekFirstDay + 1)) === 0;
  const hidRuler = weekFirstDay === 0 ? hideNode : i > 0 && hideNode;
  if (hidRuler) {
    hiddenStyle = { style: { display: 'none' } };
  }
  return hiddenStyle;
}
