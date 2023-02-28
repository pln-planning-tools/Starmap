import { CircularProgress, CircularProgressLabel } from '@chakra-ui/react'
import React from 'react'
import styles from './BulletIcon.module.css'

export default function BulletIcon ({ completion_rate }: {completion_rate: number}) {
  const classNames = `${styles.bulletIcon} ${completion_rate === 0 ? styles.bulletIcon_notStarted : ''}`
  return (
    <span className={classNames}>
      <CircularProgress value={completion_rate} size='32px' trackColor='#1e58de' color='#000'>
        <CircularProgressLabel>{completion_rate === 100 ? '✓' : `${completion_rate}%`}</CircularProgressLabel>
      </CircularProgress>
    </span>
  )
}
