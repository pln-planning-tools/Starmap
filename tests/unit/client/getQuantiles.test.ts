import { dayjs } from '../../../lib/client/dayjs'
import { getQuantiles, getQuantilesNew } from '../../../lib/client/getQuantiles'

function datesAsStrings(dates: Date[]) {
  return dates.map((v) => dayjs(v).format('YYYY-MM-DD'))
}

/**
 * The original getQuantiles function... it does some unexpected stuff.
 */
describe('getQuantiles', function() {
  it('returns the expected number of dates', function() {
    expect(getQuantiles([dayjs().startOf('year').toDate(), dayjs().endOf('year').toDate()], 1)).toHaveLength(2)
    expect(getQuantiles([dayjs().startOf('year').toDate(), dayjs().endOf('year').toDate()], 2)).toHaveLength(3)
    expect(getQuantiles([dayjs().startOf('year').toDate(), dayjs().endOf('year').toDate()], 3)).toHaveLength(4)
    expect(getQuantiles([dayjs().startOf('year').toDate(), dayjs().endOf('year').toDate()], 4)).toHaveLength(5)
    expect(getQuantiles([dayjs().startOf('year').toDate(), dayjs().endOf('year').toDate()], 5)).toHaveLength(6)
    expect(getQuantiles([dayjs().startOf('year').toDate(), dayjs().endOf('year').toDate()], 15)).toHaveLength(16)
    expect(getQuantiles([dayjs().startOf('year').toDate(), dayjs().endOf('year').toDate()], 30)).toHaveLength(31)
  })

  it('returns expected split including start and end dates', function() {
    const actual = getQuantiles([dayjs('2021-01-01').startOf('day').toDate(), dayjs('2021-01-10').startOf('day').toDate()], 3)

    const actualAsStrings = datesAsStrings(actual)
    expect(actualAsStrings).toHaveLength(4)
    expect(actualAsStrings).toEqual(expect.arrayContaining(['2021-01-01']))
    expect(actualAsStrings).toEqual(expect.arrayContaining(['2021-01-03']))
    expect(actualAsStrings).toEqual(expect.arrayContaining(['2021-01-06']))
    expect(actualAsStrings).toEqual(expect.arrayContaining(['2021-01-09']))
  })
})

describe('getQuantilesNew', function() {
  it('returns the expected number of dates', function() {
    expect(getQuantilesNew([dayjs().startOf('year').toDate(), dayjs().endOf('year').toDate()], 1)).toHaveLength(1)
    expect(getQuantilesNew([dayjs().startOf('year').toDate(), dayjs().endOf('year').toDate()], 2)).toHaveLength(2)
    expect(getQuantilesNew([dayjs().startOf('year').toDate(), dayjs().endOf('year').toDate()], 3)).toHaveLength(3)
    expect(getQuantilesNew([dayjs().startOf('year').toDate(), dayjs().endOf('year').toDate()], 4)).toHaveLength(4)
    expect(getQuantilesNew([dayjs().startOf('year').toDate(), dayjs().endOf('year').toDate()], 5)).toHaveLength(5)
    expect(getQuantilesNew([dayjs().startOf('year').toDate(), dayjs().endOf('year').toDate()], 15)).toHaveLength(15)
    expect(getQuantilesNew([dayjs().startOf('year').toDate(), dayjs().endOf('year').toDate()], 30)).toHaveLength(30)
  })

  it('returns expected split including start and end dates', function() {
    const actual = getQuantilesNew([dayjs('2021-01-01').startOf('day').toDate(), dayjs('2021-01-10').startOf('day').toDate()], 3)

    const actualAsStrings = datesAsStrings(actual)
    expect(actualAsStrings).toHaveLength(3)
    expect(actualAsStrings).toEqual(expect.arrayContaining(['2021-01-01']))
    expect(actualAsStrings).toEqual(expect.arrayContaining(['2021-01-05']))
    expect(actualAsStrings).toEqual(expect.arrayContaining(['2021-01-10']))
  })
})

