import { useRouter } from 'next/router';

import { useEffect, useState } from 'react';

// import { getIssue } from '../../lib/backend/issue';
import getRoadmap from '../../lib/backend/roadmap';
import { RoadmapApiResponse } from '../../lib/types';

export default function Roadmap() {
  const [data, setData] = useState<RoadmapApiResponse | null>(null);
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    if (router.isReady && router.query.slug) {
      console.log('router.isReady');
      const [, owner, repo, , issue_number] = router.query.slug;
      getRoadmap({ owner, repo, issue_number }).then((data) => {
        setData(data);
        setLoading(false);
        console.log('data:', data);
      });
    }
  }, [router.query.slug]);

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>No roadmap data</p>;

  return (
    <div>
      <h1>Roadmap</h1>
      {/* @ts-ignore */}
      <p>data: {data.data.title}</p>
      {/* <h1>{data.name}</h1>
      <p>{data.bio}</p> */}
    </div>
  );
}
