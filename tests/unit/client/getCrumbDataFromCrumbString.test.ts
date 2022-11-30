/**
 * @jest-environment jsdom
 */
import { getCrumbDataFromCrumbString } from '../../../lib/client/getCrumbDataFromCrumbString';
import { ViewMode } from '../../../lib/enums';

describe('getCrumbDataFromCrumbString', function () {
  it('works with 1 crumb', () => {
    expect(getCrumbDataFromCrumbString('ipfs/ipfs-gui#106@@Name1', ViewMode.Detail)).toEqual([
      {
        url: 'http://localhost/roadmap/github.com/ipfs/ipfs-gui/issues/106#detail',
        title: 'Name1',
      },
    ]);
  });

  it('works with 2 crumbs', () => {
    expect(getCrumbDataFromCrumbString('ipfs/ipfs-gui#106@@Name1,ownerA/repoB#222@@Name2', ViewMode.Detail)).toEqual([
      {
        url: 'http://localhost/roadmap/github.com/ipfs/ipfs-gui/issues/106#detail',
        title: 'Name1',
      },
      {
        url: 'http://localhost/roadmap/github.com/ownerA/repoB/issues/222?crumbs=ipfs%252Fipfs-gui%2523106%2540%2540Name1#detail',
        title: 'Name2',
      },
    ]);
  });

  it('works with 3 crumbs', () => {
    expect(getCrumbDataFromCrumbString('ipfs/ipfs-gui#106@@Name1,ownerA/repoB#222@@Name2,ownerC/repoD#333@@Name3', ViewMode.Detail)).toEqual([
      {
        url: 'http://localhost/roadmap/github.com/ipfs/ipfs-gui/issues/106#detail',
        title: 'Name1',
      },
      {
        url: 'http://localhost/roadmap/github.com/ownerA/repoB/issues/222?crumbs=ipfs%252Fipfs-gui%2523106%2540%2540Name1#detail',
        title: 'Name2',
      },
      {
        url: 'http://localhost/roadmap/github.com/ownerC/repoD/issues/333?crumbs=ipfs%252Fipfs-gui%2523106%2540%2540Name1%252CownerA%252FrepoB%2523222%2540%2540Name2#detail',
        title: 'Name3',
      },
    ]);
  });
});
