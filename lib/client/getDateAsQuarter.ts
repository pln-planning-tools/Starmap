import type { Dayjs } from 'dayjs'
import { dayjs } from './dayjs'

function getDateAsQuarter (inputDate: Dayjs | Date | string) {
  const date = dayjs(inputDate)
  const quarterNum = date.quarter()
  const year = date.format('YY')

  return `Q${quarterNum}'${year}`
}
export default getDateAsQuarter
