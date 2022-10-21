import { closestIndexTo } from 'date-fns'

import { formatDate } from '../../utils/general'

const getClosest = (dueDate, dates) => {
  const closest = (closestIndexTo(formatDate(dueDate), dates) ?? 0) + 1
  return (closest > 1 && closest) || 2
}

export {
  getClosest,
}
