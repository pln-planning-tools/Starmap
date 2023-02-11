import { getChildren, getChildrenNew } from '../../lib/parser';

/**
 * Test data obtained from calling getIssue() on github.com/protocol/engres/issues/5 on 2023-02-10 @ 5pm PST
 */
const example_body_html = '<p dir=\"auto\">children:</p>\n<ul dir=\"auto\">\n<li><a aria-label=\"Issue #5\" class=\"issue-link js-issue-link\" data-error-text=\"Failed to load title\" data-id=\"1468803547\" data-permission-text=\"Title is private\" data-url=\"https://github.com/protocol/bedrock/issues/5\" data-hovercard-type=\"issue\" data-hovercard-url=\"/protocol/bedrock/issues/5/hovercard\" href=\"https://github.com/protocol/bedrock/issues/5\">protocol/bedrock#5</a></li>\n<li><a aria-label=\"Issue #11\" class=\"issue-link js-issue-link\" data-error-text=\"Failed to load title\" data-id=\"1468828351\" data-permission-text=\"Title is private\" data-url=\"https://github.com/protocol/bedrock/issues/11\" data-hovercard-type=\"issue\" data-hovercard-url=\"/protocol/bedrock/issues/11/hovercard\" href=\"https://github.com/protocol/bedrock/issues/11\">protocol/bedrock#11</a></li>\n<li><a aria-label=\"Issue #1144\" class=\"issue-link js-issue-link\" data-error-text=\"Failed to load title\" data-id=\"1462056698\" data-permission-text=\"Title is private\" data-url=\"https://github.com/filecoin-project/ref-fvm/issues/1144\" data-hovercard-type=\"issue\" data-hovercard-url=\"/filecoin-project/ref-fvm/issues/1144/hovercard\" href=\"https://github.com/filecoin-project/ref-fvm/issues/1144\">filecoin-project/ref-fvm#1144</a></li>\n<li><a aria-label=\"Issue #1143\" class=\"issue-link js-issue-link\" data-error-text=\"Failed to load title\" data-id=\"1462053266\" data-permission-text=\"Title is private\" data-url=\"https://github.com/filecoin-project/ref-fvm/issues/1143\" data-hovercard-type=\"issue\" data-hovercard-url=\"/filecoin-project/ref-fvm/issues/1143/hovercard\" href=\"https://github.com/filecoin-project/ref-fvm/issues/1143\">filecoin-project/ref-fvm#1143</a></li>\n<li><a aria-label=\"Issue #34\" class=\"issue-link js-issue-link\" data-error-text=\"Failed to load title\" data-id=\"1470149244\" data-permission-text=\"Title is private\" data-url=\"https://github.com/protocol/netops/issues/34\" data-hovercard-type=\"issue\" data-hovercard-url=\"/protocol/netops/issues/34/hovercard\" href=\"https://github.com/protocol/netops/issues/34\">protocol/netops#34</a></li>\n<li><a aria-label=\"Issue #47\" class=\"issue-link js-issue-link\" data-error-text=\"Failed to load title\" data-id=\"1470248081\" data-permission-text=\"Title is private\" data-url=\"https://github.com/protocol/netops/issues/47\" data-hovercard-type=\"issue\" data-hovercard-url=\"/protocol/netops/issues/47/hovercard\" href=\"https://github.com/protocol/netops/issues/47\">protocol/netops#47</a></li>\n<li><a aria-label=\"Issue #8\" class=\"issue-link js-issue-link\" data-error-text=\"Failed to load title\" data-id=\"1464684250\" data-permission-text=\"Title is private\" data-url=\"https://github.com/drand/roadmap/issues/8\" data-hovercard-type=\"issue\" data-hovercard-url=\"/drand/roadmap/issues/8/hovercard\" href=\"https://github.com/drand/roadmap/issues/8\">drand/roadmap#8</a></li>\n<li><a aria-label=\"Issue #12\" class=\"issue-link js-issue-link\" data-error-text=\"Failed to load title\" data-id=\"1464687876\" data-permission-text=\"Title is private\" data-url=\"https://github.com/drand/roadmap/issues/12\" data-hovercard-type=\"issue\" data-hovercard-url=\"/drand/roadmap/issues/12/hovercard\" href=\"https://github.com/drand/roadmap/issues/12\">drand/roadmap#12</a></li>\n<li><a aria-label=\"Issue #180\" class=\"issue-link js-issue-link\" data-error-text=\"Failed to load title\" data-id=\"1394534093\" data-permission-text=\"Title is private\" data-url=\"https://github.com/protocol/ConsensusLab/issues/180\" data-hovercard-type=\"issue\" data-hovercard-url=\"/protocol/ConsensusLab/issues/180/hovercard\" href=\"https://github.com/protocol/ConsensusLab/issues/180\">protocol/ConsensusLab#180</a></li>\n<li><a aria-label=\"Issue #185\" class=\"issue-link js-issue-link\" data-error-text=\"Failed to load title\" data-id=\"1394589312\" data-permission-text=\"Title is private\" data-url=\"https://github.com/protocol/ConsensusLab/issues/185\" data-hovercard-type=\"issue\" data-hovercard-url=\"/protocol/ConsensusLab/issues/185/hovercard\" href=\"https://github.com/protocol/ConsensusLab/issues/185\">protocol/ConsensusLab#185</a></li>\n<li><a aria-label=\"Issue #186\" class=\"issue-link js-issue-link\" data-error-text=\"Failed to load title\" data-id=\"1394590754\" data-permission-text=\"Title is private\" data-url=\"https://github.com/protocol/ConsensusLab/issues/186\" data-hovercard-type=\"issue\" data-hovercard-url=\"/protocol/ConsensusLab/issues/186/hovercard\" href=\"https://github.com/protocol/ConsensusLab/issues/186\">protocol/ConsensusLab#186</a></li>\n<li><a aria-label=\"Issue #3\" class=\"issue-link js-issue-link\" data-error-text=\"Failed to load title\" data-id=\"1461226183\" data-permission-text=\"Title is private\" data-url=\"https://github.com/filecoin-station/roadmap/issues/3\" data-hovercard-type=\"issue\" data-hovercard-url=\"/filecoin-station/roadmap/issues/3/hovercard\" href=\"https://github.com/filecoin-station/roadmap/issues/3\">filecoin-station/roadmap#3</a></li>\n<li><a aria-label=\"Issue #10\" class=\"issue-link js-issue-link\" data-error-text=\"Failed to load title\" data-id=\"1575972127\" data-permission-text=\"Title is private\" data-url=\"https://github.com/filecoin-station/roadmap/issues/10\" data-hovercard-type=\"issue\" data-hovercard-url=\"/filecoin-station/roadmap/issues/10/hovercard\" href=\"https://github.com/filecoin-station/roadmap/issues/10\">filecoin-station/roadmap#10</a></li>\n<li><a aria-label=\"Issue #1\" class=\"issue-link js-issue-link\" data-error-text=\"Failed to load title\" data-id=\"1467798001\" data-permission-text=\"Title is private\" data-url=\"https://github.com/filecoin-saturn/roadmap/issues/1\" data-hovercard-type=\"issue\" data-hovercard-url=\"/filecoin-saturn/roadmap/issues/1/hovercard\" href=\"https://github.com/filecoin-saturn/roadmap/issues/1\">filecoin-saturn/roadmap#1</a></li>\n<li><a aria-label=\"Issue #4\" class=\"issue-link js-issue-link\" data-error-text=\"Failed to load title\" data-id=\"1461231696\" data-permission-text=\"Title is private\" data-url=\"https://github.com/filecoin-station/roadmap/issues/4\" data-hovercard-type=\"issue\" data-hovercard-url=\"/filecoin-station/roadmap/issues/4/hovercard\" href=\"https://github.com/filecoin-station/roadmap/issues/4\">filecoin-station/roadmap#4</a></li>\n<li><a aria-label=\"Issue #2\" class=\"issue-link js-issue-link\" data-error-text=\"Failed to load title\" data-id=\"1467801960\" data-permission-text=\"Title is private\" data-url=\"https://github.com/filecoin-saturn/roadmap/issues/2\" data-hovercard-type=\"issue\" data-hovercard-url=\"/filecoin-saturn/roadmap/issues/2/hovercard\" href=\"https://github.com/filecoin-saturn/roadmap/issues/2\">filecoin-saturn/roadmap#2</a></li>\n<li><a aria-label=\"Issue #19\" class=\"issue-link js-issue-link\" data-error-text=\"Failed to load title\" data-id=\"1464616958\" data-permission-text=\"Title is private\" data-url=\"https://github.com/cryptonetlab/roadmap/issues/19\" data-hovercard-type=\"issue\" data-hovercard-url=\"/cryptonetlab/roadmap/issues/19/hovercard\" href=\"https://github.com/cryptonetlab/roadmap/issues/19\">cryptonetlab/roadmap#19</a></li>\n</ul>\n<p dir=\"auto\">eta: 2023Q2</p>\n<p dir=\"auto\">View in <a href=\"https://www.starmaps.app/roadmap/github.com/protocol/engres/issues/5#simple\" rel=\"nofollow\">https://www.starmaps.app/roadmap/github.com/protocol/engres/issues/5#simple</a></p>'
const example_body_text = 'children:\n\nprotocol/bedrock#5\nprotocol/bedrock#11\nfilecoin-project/ref-fvm#1144\nfilecoin-project/ref-fvm#1143\nprotocol/netops#34\nprotocol/netops#47\ndrand/roadmap#8\ndrand/roadmap#12\nprotocol/ConsensusLab#180\nprotocol/ConsensusLab#185\nprotocol/ConsensusLab#186\nfilecoin-station/roadmap#3\nfilecoin-station/roadmap#10\nfilecoin-saturn/roadmap#1\nfilecoin-station/roadmap#4\nfilecoin-saturn/roadmap#2\ncryptonetlab/roadmap#19\n\neta: 2023Q2\nView in https://www.starmaps.app/roadmap/github.com/protocol/engres/issues/5#simple'

const expectedResult = [
  {
    group: 'children:',
    html_url: 'https://github.com/protocol/bedrock/issues/5'
  },
  {
    "group": "children:",
    "html_url": "https://github.com/protocol/bedrock/issues/11",
  },
  {
    "group": "children:",
    "html_url": "https://github.com/filecoin-project/ref-fvm/issues/1144",
  },
  {
    "group": "children:",
    "html_url": "https://github.com/filecoin-project/ref-fvm/issues/1143",
  },
  {
    "group": "children:",
    "html_url": "https://github.com/protocol/netops/issues/34",
  },
  {
    "group": "children:",
    "html_url": "https://github.com/protocol/netops/issues/47",
  },
  {
    "group": "children:",
    "html_url": "https://github.com/drand/roadmap/issues/8",
  },
  {
    "group": "children:",
    "html_url": "https://github.com/drand/roadmap/issues/12",
  },
  {
    "group": "children:",
    "html_url": "https://github.com/protocol/ConsensusLab/issues/180",
  },
  {
    "group": "children:",
    "html_url": "https://github.com/protocol/ConsensusLab/issues/185",
  },
  {
    "group": "children:",
    "html_url": "https://github.com/protocol/ConsensusLab/issues/186",
  },
  {
    "group": "children:",
    "html_url": "https://github.com/filecoin-station/roadmap/issues/3",
  },
  {
    "group": "children:",
    "html_url": "https://github.com/filecoin-station/roadmap/issues/10",
  },
  {
    "group": "children:",
    "html_url": "https://github.com/filecoin-saturn/roadmap/issues/1",
  },
  {
    "group": "children:",
    "html_url": "https://github.com/filecoin-station/roadmap/issues/4",
  },
  {
    "group": "children:",
    "html_url": "https://github.com/filecoin-saturn/roadmap/issues/2",
  },
  {
    "group": "children:",
    "html_url": "https://github.com/cryptonetlab/roadmap/issues/19",
  },
]

describe('parser', function() {
  describe('getChildren', function() {
    it('Can parse children from body_html', function() {
      const children = getChildren(example_body_html);
      expect(Array.isArray(children)).toBe(true);
      expect(children).toHaveLength(17);
      expect(children).toStrictEqual(expectedResult)
    })
    it('Can parse children from body_text', function() {
      const children = getChildren(example_body_text);
      expect(Array.isArray(children)).toBe(true);
      expect(children).toHaveLength(17);
      expect(children).toStrictEqual(expectedResult)
    })
  })
})
