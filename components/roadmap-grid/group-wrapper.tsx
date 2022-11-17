import { useViewMode } from '../../hooks/useViewMode';
import { ViewMode } from '../../lib/enums';
import styles from './Roadmap.module.css';

export function GroupWrapper({ children, cssName = '' }) {
  const viewMode = useViewMode();
  let viewModeClass = 'simpleView';
  if (viewMode === ViewMode.Detail) {
    viewModeClass = 'detailedView';
  }

  return (
    <div
      className={`${styles.nested} ${styles.subgrid} ${styles.groupWrapper} ${styles[viewModeClass]} ${styles[cssName]}`}
    >
      {children}
    </div>
  );
}
