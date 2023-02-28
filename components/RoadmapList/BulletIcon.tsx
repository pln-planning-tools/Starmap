import { CircularProgress, CircularProgressLabel } from '@chakra-ui/react'
import React from 'react'
import styles from './BulletIcon.module.css'

export default function BulletIcon ({ completion_rate }: {completion_rate: number}) {
  let wrapperClassNames = styles.bulletIcon_Wrapper
  let iconClassNames = styles.bulletIcon
  let color = 'inactive'
  let inProgress = false
  if (completion_rate === 100) {
    color = 'progressGreenAccent'
    iconClassNames += ` ${styles.completed}`
    wrapperClassNames += ` ${styles.completed}`
  } else if (completion_rate > 0) {
    inProgress = true
    iconClassNames += ` ${styles.inProgress}`
    wrapperClassNames += ` ${styles.inProgress}`
    color = 'progressGreen'
  } else {
    iconClassNames += ` ${styles.notStarted}`
    wrapperClassNames += ` ${styles.notStarted}`
  }

  return (
    <span className={wrapperClassNames}>
      <span className={iconClassNames}>
        <CircularProgress value={completion_rate} size='30px' trackColor="transparent" color={color}>
          <CircularProgressLabel>{inProgress ? `${completion_rate}%` : ''}</CircularProgressLabel>
        </CircularProgress>
      </span>
    </span>
  )
}
