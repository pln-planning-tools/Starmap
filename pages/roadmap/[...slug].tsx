import { Box } from '@chakra-ui/react';
import type { InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useHookstate, State } from '@hookstate/core';
import { find, forEach } from 'lodash';

import PageHeader from '../../components/layout/PageHeader';
import { RoadmapTabbedView } from '../../components/roadmap-grid/RoadmapTabbedView';
import NewRoadmap from '../../components/roadmap/NewRoadmap';
import { BASE_PROTOCOL, BASE_URL } from '../../config/constants';
import { IssueData, ParserGetChildrenResponse, PendingChildren, QueryParameters, RoadmapApiResponse, RoadmapApiResponseFailure, RoadmapApiResponseSuccess, RoadmapServerSidePropsResult, StarMapsIssueErrorsGrouped } from '../../lib/types';
import { ErrorNotificationDisplay } from '../../components/errors/ErrorNotificationDisplay';
import { ViewMode } from '../../lib/enums';
import { setViewMode } from '../../hooks/useViewMode';
import { DateGranularityState } from '../../lib/enums';
import { setDateGranularity } from '../../hooks/useDateGranularity';
import { useAsync } from '../../hooks/useAsync';
import { setIsLoading } from '../../hooks/useIsLoading';
import { paramsFromUrl } from '../../lib/paramsFromUrl';
import { addStarMapsErrorsToStarMapsErrorGroups } from '../../lib/addStarMapsErrorsToStarMapsErrorGroups';
import { mergeStarMapsErrorGroups } from '../../lib/mergeStarMapsErrorGroups';
import { addChildToParentIssue } from '../../lib/addChildToParentIssue';
import { findIssueDataByUrl } from '../../lib/findIssueDataByUrl';
import { addToChildren } from '../../lib/backend/addToChildren';
import { removeUnnecessaryData } from '../../lib/removeUnnecessaryData';

export async function getServerSideProps(context): Promise<RoadmapServerSidePropsResult> {
  const [hostname, owner, repo, _, issue_number] = context.query.slug;
  const { filter_group, mode, timeUnit }: QueryParameters = context.query;

  return {
    props: {
      owner,
      repo,
      issue_number,
      isLocal: process.env.IS_LOCAL === 'true',
      groupBy: filter_group || null,
      mode: mode || 'grid',
      dateGranularity: timeUnit || DateGranularityState.Months,
      baseUrl: `${BASE_PROTOCOL}://${BASE_URL}`,
    }
  }
}

export default function RoadmapPage(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  let { error: serverError, baseUrl, isLocal, mode, dateGranularity, issue_number, repo, owner } = props;

  const [pendingInitialApiCall, setPendingInitialApiCall] = useState(true);
  const [pendingChildren, setPendingChildren] = useState<PendingChildren[]>([]);
  const [errors, setErrors] = useState<StarMapsIssueErrorsGrouped[]>([]);
  const [error, setError] = useState<{ code: string; message: string } | null>(null);
  // const [issueData, setIssueData] = useState<IssueData | null>(null);
  const issueDataState = useHookstate<IssueData | null>(null);
  const issueData = issueDataState.get();

  const [numChanges, setNumChanges] = useState(0);

  const {execute, status, value: roadmapApiResult, error: asyncError} = useAsync<RoadmapApiResponseSuccess, RoadmapApiResponseFailure>(async () => {

    const urlString = `${baseUrl}/api/roadmap?owner=${owner}&repo=${repo}&issue_number=${issue_number}`
    try {
      const res = await fetch(new URL(urlString));

      return await res.json();
    } catch (err: any) {
      return {
        props: {
          // ...serverSideProps,
          error: {code: '500', message: err.toString()} as { code: string; message: string }
        }
      }
    }
  }, false);

  useEffect(() => {
    let newStarMapsErrors: StarMapsIssueErrorsGrouped[] = []
    switch(status) {
      case 'idle':
        setIsLoading(true);
        execute();
        break;
      case 'error':
        if (!pendingInitialApiCall) {
          return
        }
        setIsLoading(false);
        setPendingInitialApiCall(false);
        const typedAsyncError = asyncError as RoadmapApiResponseFailure;
        if (typedAsyncError.error != null) {
          setError(typedAsyncError.error ?? null);
        }
        newStarMapsErrors = typedAsyncError.errors ?? []
        if (newStarMapsErrors.length > 0) {
          setErrors(mergeStarMapsErrorGroups(errors, newStarMapsErrors))
        }
        break;
      case 'pending':
        setIsLoading(true);
        break;
      case 'success':
        if (!pendingInitialApiCall) {
          return
        }
        setPendingInitialApiCall(false);
        const typedRoadmapApiResult = roadmapApiResult as RoadmapApiResponseSuccess;
        setIsLoading(false);
        console.log('success roadmapApiResult:', roadmapApiResult);

        setPendingChildren(typedRoadmapApiResult.pendingChildren)
        newStarMapsErrors = typedRoadmapApiResult.errors ?? []
        if (newStarMapsErrors.length > 0) {
          setErrors(mergeStarMapsErrorGroups(errors, newStarMapsErrors))
        }
        // setIssueData(typedRoadmapApiResult.data)
        issueDataState.set(removeUnnecessaryData(typedRoadmapApiResult.data));

        break;
    }
  }, [status, roadmapApiResult, execute, asyncError, pendingInitialApiCall])

  const [isLoadingChildren, setIsLoadingChildren] = useState(false);
  const {
    error: pendingChildrenAsyncError,
    execute: pendingChildrenAsyncExecute,
    status: pendingChildrenAsyncStatus,
    value: pendingChildrenAsyncValue
  } = useAsync(async () => {
  //   for await (const pendingChild of pendingChildren) {
      /**
       * This async function shouldn't execute unless pendingChild is set.
       */
      const typedPendingChild = pendingChildren.shift() as PendingChildren;

      console.log(`typedPendingChild: `, typedPendingChild);
      const { issue_number, owner, repo } = paramsFromUrl(typedPendingChild.html_url)
      const requestBody = {
        issue_number,
        owner,
        repo,
        parent: findIssueDataByUrl(issueData as IssueData, typedPendingChild.parentHtmlUrl)
      }
      // const params = new URLSearchParams()
      // params.append('issue_number', issue_number);
      // params.append('repo', repo);
      // params.append('owner', owner);
      const url = new URL(`${baseUrl}/api/pendingChild`)
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        });
        const childIssueData = await res.json();
        return {
          issueData: childIssueData,
          parentHtmlUrl: typedPendingChild.parentHtmlUrl
        };
        // console.log(`response: `, response);
      } catch (err) {
        console.error('error getting pending child', err);
        // break;
        throw err
      }

  //   }
  }, false);

  useEffect(() => {
    switch(pendingChildrenAsyncStatus) {
      case 'idle':
        if (isLoadingChildren === true) {
          return;
        }
        if (issueData != null && pendingChildren?.length > 0) {
          setIsLoadingChildren(true);
          pendingChildrenAsyncExecute();
          console.log(`pendingChildrenAsyncExecute: `);
        }
        break;
      case 'error':
        if (isLoadingChildren === false) {
          return;
        }
        setIsLoading(false);
        setIsLoadingChildren(false);
        console.log('pendingChildrenAsyncError', pendingChildrenAsyncError);
        break;
      case 'pending':
        setIsLoadingChildren(true);
        break;
      case 'success':
        if (isLoadingChildren === false) {
          return;
        }
        console.log('pendingChildrenAsyncValue', pendingChildrenAsyncValue);
        if (pendingChildrenAsyncValue != null && issueDataState.ornull != null) {
          const nonNullIssueDataState = issueDataState as State<IssueData>;
          // console.log(`pendingChildrenAsyncValue.issueData.parent.html_url: `, pendingChildrenAsyncValue.issueData.parent.html_url);
          // const issueDataParent = findIssueDataByUrl(issueData as IssueData, pendingChildrenAsyncValue.issueData.parent.html_url)
          // const newIssueData = addToChildren([pendingChildrenAsyncValue.issueData], issueDataParent)[0];
          const newIssueData = pendingChildrenAsyncValue.issueData as IssueData;
          console.log(`debug issuesGrouped - newIssueData: `, newIssueData);
          // issueDataParent.children =
          console.log(`issueData: `, issueData);
          // console.log(`issueDataParent: `, issueDataParent);
          const parentIndex = nonNullIssueDataState.children.findIndex((rootChildIssue) => {
            if (rootChildIssue.html_url.get() === pendingChildrenAsyncValue.issueData.parent.html_url) {
              return true
            }
          })
          console.log(`parentIndex: `, parentIndex);
          if (parentIndex > -1) {
            // console.log(`debug issuesGrouped - nonNullIssueDataState.children[parentIndex].children.get({noproxy: true}): `, nonNullIssueDataState.children[parentIndex].children.get({noproxy: true}));
            // nonNullIssueDataState.children[parentIndex].children.set((prevValue) => {
            //   const result = [...prevValue, newIssueData];
            //   console.log(`debug issuesGrouped - adding a child result: `, result);
            //   return result;
            // })
            // console.log(`debug issuesGrouped - nonNullIssueDataState.children[parentIndex].children.get({noproxy: true}): `, nonNullIssueDataState.children[parentIndex].children.get({noproxy: true}));
          }
          // nonNullIssueDataState.children.map((prevValue: State<IssueData>) => {
          //   return prevValue.children.map((rootChildIssue) => {
          //     if (rootChildIssue.html_url.get() === pendingChildrenAsyncValue.issueData.parent.html_url) {
          //       return addToChildren([newIssueData], rootChildIssue.get())[0]
          //     }
          //     return rootChildIssue;
          //   })
          //   // return prevValue
          // });
          // setIssueData(() => {
          //   ...issueData as IssueData,
          //   children: [...(issueData as IssueData).children.map((i) => {
          //     if (i.html_url === issueDataParent.html_url) {
          //       return {
          //         ...issueDataParent,
          //         children: [...issueDataParent.children, newIssueData]
          //       }
          //     }
          //     return i;
          //   })]
          // })

          // setIssueData(addChildToParentIssue(issueData as IssueData, pendingChildrenAsyncValue.issueData, pendingChildrenAsyncValue.parent));
          // console.log(`issueData: `, issueData);
          // addChildToParentIssue(issueData as IssueData, newIssueData, pendingChildrenAsyncValue.parentHtmlUrl)
          // setIssueData(issueData);
          // issueData?.children.push(pendingChildrenAsyncValue.issueData)
          // console.log(`addChildToParentIssue(issueData as IssueData, pendingChildrenAsyncValue.issueData, pendingChildrenAsyncValue.parent): `, addChildToParentIssue(issueData as IssueData, pendingChildrenAsyncValue.issueData, pendingChildrenAsyncValue.parentHtmlUrl));
          setNumChanges(numChanges + 1);
          setIsLoadingChildren(false);
          setIsLoading(false);
        }
        //
        //   ...issueData as IssueData,
        //   children: [...(issueData as IssueData).children, pendingChildrenAsyncValue],
        // })
        break;
    }
  }, [isLoadingChildren, pendingChildren, pendingChildrenAsyncError, pendingChildrenAsyncExecute, pendingChildrenAsyncStatus, pendingChildrenAsyncValue])

  useEffect(() => {
    if (issueData != null && issueData.children != null) {
      const issueDataChildrenLength = issueData.children.length;
      const allChildrenLength = issueData.children.reduce((acc, i) => {
        return acc + i.children.reduce((acc, i2) => {
          return acc + i2.children.reduce((acc, i3) => {
            return acc + i2.children.length
          }, 0)
        }, 0)
      }, 0)
      console.log('issueData.all.children', issueDataChildrenLength + allChildrenLength);
    }
  }, [issueData])
  useEffect(() => {
    setDateGranularity(dateGranularity);
  }, [dateGranularity, setDateGranularity]);

  const router = useRouter();
  const urlPath = router.asPath
  useEffect(() => {
    const hashString = urlPath.split('#')[1] as ViewMode ?? ViewMode.Simple;
    setViewMode(hashString);
  }, [urlPath])

  return (
    <>
      <PageHeader />
      <ErrorNotificationDisplay errors={errors ?? []} />
      <Box pt={5} pr="120px" pl="120px">
        {!!error && <Box color='red.500'>{error.message}</Box>}
        {!!issueData && mode === 'd3' && <NewRoadmap issueData={issueData} isLocal={isLocal} />}
        {issueDataState.ornull != null && mode === 'grid' && (
          <RoadmapTabbedView issueDataState={issueDataState as State<IssueData>} numChanges={numChanges} isLoadingChildren={isLoadingChildren}/>
        )}
      </Box>
    </>
  );
}
