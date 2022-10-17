import type { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';
import Head from 'next/head';
import { addHttpsIfNotLocal } from '../utils/general';
import { Box, Container, Grid, Input, Text, Link } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
// import Link from 'next/link';

export const getStaticProps: GetStaticProps = async () => {
  const res = await fetch(
    `${addHttpsIfNotLocal(
      process.env.VERCEL_URL || process.env.NEXT_PUBLIC_VERCEL_URL,
    )}/api/github-issue?depth=1&url=https://github.com/pln-roadmap/tests/issues/9`,
  );
  const issueData = await res.json();

  // const transformData = (v) => {
  //   return v.lists
  //     .flatMap((v) => v.childrenIssues)
  //     .map((v) => ({
  //       ...v,
  //       dueDate: new Date(v.dueDate),
  //     }));
  // };

  return {
    props: {
      issueData,
    },
  };
};

// const Item = ({ data }) => {
//   console.log('data', data);
//   return (
//     <div
//       style={{
//         // gridColumn: `${data.gridRow} / span 6`,
//         gridColumn: '1 / span 6',
//         padding: '10px 20px',
//         borderRadius: '2px',
//         background: '#e2e2e2',
//         gridRow: data.gridRow,
//       }}
//     >
//       <div>
//         <span>{data.title}</span>

//         <p style={{ marginTop: '4px', fontSize: '14px' }}>{`dueDate: ${data.dueDate}`}</p>
//         {/* {'<date-end>'} */}
//       </div>
//     </div>
//   );
// };

// const RoadmapForm = () => {
//   const [value, setValue] = useState('');
//   const [currentIssueUrl, setCurrentIssueUrl] = useState();
//   const [issueUrl, setIssueUrl] = useState();
//   const [error, setError] = useState();
//   const [issueData, setIssueData] = useState();
//   const [isLoading, setLoading] = useState(false);
//   const getCurrentUrl = () => currentIssueUrl;

//   useEffect(() => {
//     if (!issueUrl) return;
//     setLoading(true);
//     fetch(`/api/github-issue?depth=1&url=${new URL(issueUrl)}`)
//       .then((res) => {
//         console.log('inside fetch!');
//         return res.json();
//       })
//       .then((resData) => {
//         console.log('inside data!', resData);
//         setIssueData(resData);
//         // setIssueUrl(null as any);
//         setLoading(false);
//       })
//       .catch((err) => `error: ${err}`);
//   }, [issueUrl]);

//   return (
//     <>
//       <form
//         onSubmit={(e) => {
//           e.preventDefault();
//           try {
//             // @ts-ignore
//             const newUrl = new URL(getCurrentUrl());
//             // @ts-ignore
//             setIssueUrl(newUrl.toString());
//           } catch (err: any) {
//             setError(err);
//           }
//         }}
//       >
//         <Text mb='8px'>GitHub URL: {issueUrl}</Text>
//         <Input
//           aria-label='Issue URL'
//           name='issue-url'
//           autoComplete='url'
//           onChange={(e) => setCurrentIssueUrl(e.target.value as any)}
//           placeholder='https://github.com/...'
//           size='sm'
//         />
//       </form>
//     </>
//   );
// };

const RoadmapApp: NextPage = (pageProps: InferGetStaticPropsType<typeof getStaticProps>) => {
  // console.dir(pageProps, { depth: Infinity, maxArrayLength: Infinity });
  // const milestones = pageProps?.issueData?.lists?.flatMap((v) => v.childrenIssues);
  // console.dir(milestones, { depth: Infinity, maxArrayLength: Infinity });
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
    fetch(
      `${addHttpsIfNotLocal(
        process.env.VERCEL_URL || process.env.NEXT_PUBLIC_VERCEL_URL,
      )}/api/github-issue?depth=1&url=${new URL(issueUrl)}`,
    )
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
              <Link href={issueData?.html_url}>{issueData?.title}</Link>
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
                        <Link href={issueData.html_url}>{list.title}</Link>
                      </div>
                    </div>
                  </div>
                  {list.childrenIssues.map((issue) => (
                    <>
                      <div className='item' style={{ gridColumn: 'span 2' }}>
                        <div>
                          <div>
                            <Link href={issue.html_url}>{issue.title}</Link>
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
};

export default RoadmapApp;
