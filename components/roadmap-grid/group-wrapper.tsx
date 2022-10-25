import styles from './Roadmap.module.css';

export function GroupWrapper({ children, cssName = '', showGroupRowTitle = false }) {
  let viewModeClass = 'simpleView';
  if (!!showGroupRowTitle) {
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
