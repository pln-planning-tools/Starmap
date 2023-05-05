import { ScaleTime } from 'd3';
import { useContext } from 'react';

import { dayjs } from '../../lib/client/dayjs';
import { PanContext } from './contexts';
import styles from '../roadmap-grid/today-marker.module.css';
import { setShowTodayMarker, useShowTodayMarker } from '../../hooks/useShowTodayMarker';

function TodayLine({ scale, height }: { scale: ScaleTime<number, number>; height: number, transform?: string }) {
  const todayX = scale(dayjs().toDate());
  const panX = useContext(PanContext)
  const showTodayMarker = useShowTodayMarker();

  if (!showTodayMarker) {
    return null;
  }

  const size = 5;
  const yMin = 0
  /**
   * Draws a filled triangle + rectangle, centered at the top center of the
   * todayLine, that kind of looks like:
   *  .-----.
   *  |     |
   *  .     .
   *
   *     .
   *
   * The '.' in the above are the points of the polygon defined below.
   */
  const polygonPointArray = [
    [todayX-size, yMin], // the top left point
    [todayX-size, yMin + size], // the bottom left point (end of rectangle)
    [todayX, yMin + size*2], // the bottom tip of the triangle
    [todayX+size, yMin + size], // the bottom right point (end of the rectangle)
    [todayX+size, yMin], // the top right point
  ]
  const points = polygonPointArray.map(point => point.join(',')).join(' ')

  return (
    <g transform={`translate(${panX}, 0)`} className={styles.todayMarkerWrapper} onClick={() => setShowTodayMarker(!showTodayMarker)}>
      <line x1={todayX} x2={todayX} y1={yMin} y2={height} strokeWidth={1} style={{ stroke: 'var(--chakra-colors-orangeAccent)' }} />
      <polygon points={points} style={{ fill: 'var(--chakra-colors-orangeAccent)' }}/>
    </g>
  );
}

export default TodayLine;
