import React from 'react'
import styles from './BulletIcon.module.css'

const InProgress = () => (<svg height="20px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>)

const BulletIconPicker = (completion_rate) => {
  if (completion_rate === 100) {
    return '✓'
  } else if (completion_rate === 0) {
    return ''
  } else {
    return <InProgress />
  }
}

export default function BulletIcon ({ completion_rate }: {completion_rate: number}) {
  const classNames = `${styles.bulletIcon} ${completion_rate === 0 ? styles.bulletIcon_notStarted : ''}`
  return (
    <span className={classNames}>
      {BulletIconPicker(completion_rate)}
    </span>
  )
}
