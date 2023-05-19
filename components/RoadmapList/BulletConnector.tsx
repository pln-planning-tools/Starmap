import React from 'react'

import styles from './BulletConnector.module.css'

/**
 * The vertical line connecting each bulletIcon across all rows
 * @returns
 */
export default function BulletConnector ({ isLast, children }: {isLast: boolean, children?: React.ReactNode}) {
  if (isLast) {
    return null
  }
  return (
    <span className={styles.bulletConnector}>{children}</span>
  )
}
