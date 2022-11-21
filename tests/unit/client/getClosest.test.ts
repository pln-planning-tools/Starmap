import { dayjs } from '../../../lib/client/dayjs';
import { getClosest } from '../../../lib/client/getClosest';


function getTest(currentDateString, startingDateString, endingDateString, totalTimelineTicks, expectedIndex) {
  it(`returns index ${expectedIndex} for ${currentDateString} between ${startingDateString} & ${endingDateString}`, function() {
    const dates = [dayjs(startingDateString), dayjs(endingDateString)].map((v) => v.startOf('day').toDate());
    expect(getClosest({
      currentDate: dayjs(currentDateString).toDate(),
      dates,
      totalTimelineTicks,
    })).toEqual(expectedIndex);
  })
}

function testDateSpread(year, month, startingDate, endingDate) {

}
describe('getClosest', function() {
  describe('10 day spread', function() {
    describe('10 total timeline ticks', function() {
      getTest('2021-01-01', '2021-01-01', '2021-01-10', 10, 0);
      getTest('2021-01-02', '2021-01-01', '2021-01-10', 10, 1);
      getTest('2021-01-03', '2021-01-01', '2021-01-10', 10, 2);
      getTest('2021-01-04', '2021-01-01', '2021-01-10', 10, 3);
      getTest('2021-01-05', '2021-01-01', '2021-01-10', 10, 4);
      // TODO: WHERE IS 5!?!
      getTest('2021-01-06', '2021-01-01', '2021-01-10', 10, 6);
      getTest('2021-01-07', '2021-01-01', '2021-01-10', 10, 7);
      getTest('2021-01-08', '2021-01-01', '2021-01-10', 10, 8);
      getTest('2021-01-09', '2021-01-01', '2021-01-10', 10, 9);
      getTest('2021-01-10', '2021-01-01', '2021-01-10', 10, 10);
    })
    describe('20 total timeline ticks', function() {
      getTest('2021-01-01', '2021-01-01', '2021-01-10', 20, 0);
      getTest('2021-01-02', '2021-01-01', '2021-01-10', 20, 2);
      getTest('2021-01-03', '2021-01-01', '2021-01-10', 20, 4);
      getTest('2021-01-04', '2021-01-01', '2021-01-10', 20, 7);
      getTest('2021-01-05', '2021-01-01', '2021-01-10', 20, 9);
      // TODO: WHERE IS 10!?!
      getTest('2021-01-06', '2021-01-01', '2021-01-10', 20, 11);
      getTest('2021-01-07', '2021-01-01', '2021-01-10', 20, 13);
      getTest('2021-01-08', '2021-01-01', '2021-01-10', 20, 16);
      getTest('2021-01-09', '2021-01-01', '2021-01-10', 20, 18);
      getTest('2021-01-10', '2021-01-01', '2021-01-10', 20, 20);
    })
  });

  describe('10 month spread', function() {
    describe('10 total timeline ticks', function() {
      getTest('2021-01-01', '2021-01-01', '2021-10-01', 10, 0);
      getTest('2021-02-01', '2021-01-01', '2021-10-01', 10, 1);
      getTest('2021-03-01', '2021-01-01', '2021-10-01', 10, 2);
      getTest('2021-04-01', '2021-01-01', '2021-10-01', 10, 3);
      getTest('2021-05-01', '2021-01-01', '2021-10-01', 10, 4);
      // TODO: WHERE IS 5!?!
      getTest('2021-06-01', '2021-01-01', '2021-10-01', 10, 6);
      getTest('2021-07-01', '2021-01-01', '2021-10-01', 10, 7);
      getTest('2021-08-01', '2021-01-01', '2021-10-01', 10, 8);
      getTest('2021-09-01', '2021-01-01', '2021-10-01', 10, 9);
      getTest('2021-10-01', '2021-01-01', '2021-10-01', 10, 10);
    });

    describe('20 total timeline ticks', function() {
      getTest('2021-01-01', '2021-01-01', '2021-10-01', 20, 0);
      getTest('2021-02-01', '2021-01-01', '2021-10-01', 20, 2);
      getTest('2021-03-01', '2021-01-01', '2021-10-01', 20, 4);
      getTest('2021-04-01', '2021-01-01', '2021-10-01', 20, 7);
      getTest('2021-05-01', '2021-01-01', '2021-10-01', 20, 9);
      // TODO: WHERE IS 5!?!
      getTest('2021-06-01', '2021-01-01', '2021-10-01', 20, 11);
      getTest('2021-07-01', '2021-01-01', '2021-10-01', 20, 13);
      getTest('2021-08-01', '2021-01-01', '2021-10-01', 20, 16);
      getTest('2021-09-01', '2021-01-01', '2021-10-01', 20, 18);
      getTest('2021-10-01', '2021-01-01', '2021-10-01', 20, 20);
    });
  });

  describe('10 quarter spread', function() {
    const startDate = dayjs('2021-01-01')
    const endDateString = dayjs('2021-01-01').add(10, 'quarters').format('YYYY-MM-DD')
    describe('10 total timeline ticks', function() {

      getTest(startDate.add(0, 'quarter').format('YYYY-MM-DD'), '2021-01-01', endDateString, 10, 0);
      getTest(startDate.add(1, 'quarter').format('YYYY-MM-DD'), '2021-01-01', endDateString, 10, 1);
      getTest(startDate.add(2, 'quarter').format('YYYY-MM-DD'), '2021-01-01', endDateString, 10, 2);
      getTest(startDate.add(3, 'quarter').format('YYYY-MM-DD'), '2021-01-01', endDateString, 10, 3);
      getTest(startDate.add(4, 'quarter').format('YYYY-MM-DD'), '2021-01-01', endDateString, 10, 4);
      getTest(startDate.add(5, 'quarter').format('YYYY-MM-DD'), '2021-01-01', endDateString, 10, 5);
      getTest(startDate.add(6, 'quarter').format('YYYY-MM-DD'), '2021-01-01', endDateString, 10, 6);
      getTest(startDate.add(7, 'quarter').format('YYYY-MM-DD'), '2021-01-01', endDateString, 10, 7);
      getTest(startDate.add(8, 'quarter').format('YYYY-MM-DD'), '2021-01-01', endDateString, 10, 8);
      getTest(startDate.add(9, 'quarter').format('YYYY-MM-DD'), '2021-01-01', endDateString, 10, 9);
      getTest(startDate.add(10, 'quarter').format('YYYY-MM-DD'), '2021-01-01', endDateString, 10, 10);
    });

    // describe('20 total timeline ticks', function() {
    //   getTest('2021-01-01', '2021-01-01', endDateString, 20, 0);
    //   getTest('2021-02-01', '2021-01-01', endDateString, 20, 2);
    //   getTest('2021-03-01', '2021-01-01', endDateString, 20, 4);
    //   getTest('2021-04-01', '2021-01-01', endDateString, 20, 7);
    //   getTest('2021-05-01', '2021-01-01', endDateString, 20, 9);
    //   // TODO: WHERE IS 5!?!
    //   getTest('2021-06-01', '2021-01-01', endDateString, 20, 11);
    //   getTest('2021-07-01', '2021-01-01', endDateString, 20, 13);
    //   getTest('2021-08-01', '2021-01-01', endDateString, 20, 16);
    //   getTest('2021-09-01', '2021-01-01', endDateString, 20, 18);
    //   getTest('2021-10-01', '2021-01-01', endDateString, 20, 20);
    // });
  });

})
