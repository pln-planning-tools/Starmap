import { CircularProgress } from '@chakra-ui/react'
import React from 'react'

import styles from './BulletIcon.module.css'

export default function BulletIcon ({ completion_rate }: {completion_rate: number}) {
  const wrapperClassNames = [styles.bulletIcon_Wrapper]
  const iconClassNames = [styles.bulletIcon]
  let color = 'inactive'
  if (completion_rate === 100) {
    color = 'progressGreenAccent'
    iconClassNames.push(styles.completed)
    wrapperClassNames.push(styles.completed)
  } else if (completion_rate > 0) {
    iconClassNames.push(styles.inProgress)
    wrapperClassNames.push(styles.inProgress)
    color = 'progressGreen'
  } else {
    iconClassNames.push(styles.notStarted)
    wrapperClassNames.push(styles.notStarted)
  }

  return (
    <span className={wrapperClassNames.join(' ')}>
      <span className={iconClassNames.join(' ')}>
        <CircularProgress value={completion_rate} size='30px' trackColor="transparent" color={color} />
      </span>
    </span>
  )
}
