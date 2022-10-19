import { addHttpsIfNotLocal } from '../utils/general';
import { Box, Input, Text, Link } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { match } from 'path-to-regexp';

// https://github.com/pln-roadmap/tests/issues/9
const urlMatch: any = match('/:owner/:repo/issues/:issue_number(\\d+)', {
  decode: decodeURIComponent,
});

export function Roadmap() {
  const [value, setValue] = useState('');
  const [currentIssueUrl, setCurrentIssueUrl] = useState();
  const [issueUrl, setIssueUrl] = useState();
  const [error, setError] = useState();
  const [issueData, setIssueData] = useState<any>();
  const [isLoading, setLoading] = useState(false);
  const getCurrentUrl = () => currentIssueUrl;

  useEffect(() => {
    if (!issueUrl) return;
    setLoading(true);
    console.log('process.env.VERCEL_URL', process.env.VERCEL_URL);
    console.log('process.env.NEXT_PUBLIC_VERCEL_URL', process.env.NEXT_PUBLIC_VERCEL_URL);
    fetch(`https://staging.pln-roadmap.nikas.page/api/github-issue?depth=1&url=${new URL(issueUrl)}`)
      .then((res) => {
        console.log('inside fetch!');
        return res?.json() || null;
      })
      .then((resData) => {
        console.log('inside data!', resData);
        setIssueData(resData);
        // setIssueUrl(null as any);
        setLoading(false);
      })
      .catch((err) => `error: ${err}`);
  }, [issueUrl]);

  return (
    <div>
      <Box p={5}>
        <h1>Roadmap</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            try {
              // @ts-ignore
              const newUrl = new URL(getCurrentUrl());
              // @ts-ignore
              setIssueUrl(newUrl.toString());
            } catch (err: any) {
              setError(err);
            }
          }}
        >
          <Text mb='8px'>GitHub URL: {issueUrl}</Text>
          <Input
            aria-label='Issue URL'
            name='issue-url'
            autoComplete='url'
            onChange={(e) => setCurrentIssueUrl(e.target.value as any)}
            placeholder='https://github.com/...'
            size='sm'
          />
        </form>

        <Box p={5}>
          {!!issueData && (
            <Text mb='8px' fontSize={18} fontWeight={600}>
              <NextLink href={issueData?.html_url} passHref>
                <Link>{issueData?.title}</Link>
              </NextLink>
            </Text>
          )}
          <div className='grid'>
            <div className='item item-header'></div>
            <div className='item item-header'>
              <span>January</span>
              <br />
              <span>2023</span>
            </div>
            <div className='item item-header'>
              <span>February</span>
              <br />
              <span>2023</span>
            </div>
            <div className='item item-header'>
              <span>March</span>
              <br />
              <span>2023</span>
            </div>
            <div className='item item-header'>
              <span>April</span>
              <br />
              <span>2023</span>
            </div>
            <div className='item item-header'>
              <span>May</span>
              <br />
              <span>2023</span>
            </div>
            <div className='item item-header'>
              <span>June</span>
              <br />
              <span>2023</span>
            </div>
            <div className='item item-header'>
              <span>July</span>
              <br />
              <span>2023</span>
            </div>
            <div className='item item-header'>
              <span>August</span>
              <br />
              <span>2023</span>
            </div>
            <div className='item item-header'>
              <span>September</span>
              <br />
              <span>2023</span>
            </div>
            <div className='item item-header'>
              <span>October</span>
              <br />
              <span>2023</span>
            </div>
            <div className='item item-header'>
              <span>November</span>
              <br />
              <span>2023</span>
            </div>
            <div className='item item-header'>
              <span>December</span>
              <br />
              <span>2023</span>
            </div>
            {!!issueData &&
              // @ts-ignore
              issueData?.lists?.map((list) => (
                <div className='nested subgrid group-wrapper'>
                  <div className='item group'>
                    <div>
                      <div>
                        <NextLink href={issueData.html_url} passHref>
                          <Link>{list.title}</Link>
                        </NextLink>
                      </div>
                    </div>
                  </div>
                  {list.childrenIssues.map((issue) => (
                    <>
                      <div className='item' style={{ gridColumn: 'span 2' }}>
                        <div>
                          <div>
                            <NextLink
                              href={{
                                pathname: '/roadmap/github.com/[owner]/[repo]/issues/[issueNumber]',
                                query: {
                                  owner: urlMatch(new URL(issue.html_url).pathname).params.owner,
                                  repo: urlMatch(new URL(issue.html_url).pathname).params.repo,
                                  issueNumber: urlMatch(new URL(issue.html_url).pathname).params.issue_number,
                                },
                              }}
                              passHref
                            >
                              <Link>{issue.title}</Link>
                            </NextLink>
                          </div>

                          <div style={{ textAlign: 'left', fontSize: '14px' }}>{issue.dueDate}</div>
                        </div>
                      </div>
                    </>
                  ))}
                </div>
              ))}
          </div>
          <style global jsx>{`
            .grid {
              display: grid;
              grid-template-columns: repeat(13, minmax(10px, 1fr));
              grid-gap: 0.5rem;
            }

            .subgrid {
              display: grid;
              grid-template: inherit;
              grid-gap: inherit;
              grid-column: 1 / -1;
            }

            body {
              font-family: sans-serif;
            }

            .item {
              height: 100px;
              font-size: 16px;
              text-align: center;
              overflow: auto;
              overflow-wrap: break-word;
              background: #a0aec0;
            }

            .item.item-header {
              background: revert;
            }

            .item {
              border-left: 0.5px solid #ccc;
              border-right: 0.5px solid #ccc;
            }

            .nested > .item:not(.group) {
              background: #fafafa;
              padding: 5px;
              margin-top: 4px;
              margin-bottom: 4px;
              border-radius: 2px;
            }

            .item.group {
              // background: #cbd5e0;
              background: revert;
              grid-row: 1 / -1;
              font-weight: 600;
            }

            .group-wrapper {
              background: #f3e8ff;
            }
          `}</style>
        </Box>
      </Box>
    </div>
  );
}
