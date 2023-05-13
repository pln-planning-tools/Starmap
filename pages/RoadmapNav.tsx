import { useRouter } from 'next/router'

import { useEffect } from 'react'

// const router = useRouter();
// const { pathname, query } = router;

// console.dir(router, { maxArrayLength: Infinity, depth: Infinity });

// const handleBack = () => {
//   router.push(new URL({ pathname, query }));
// };

// Current URL is '/'
function Page () {
  const router = useRouter()

  useEffect(() => {
    // Always do navigations after the first render
    router.push('/RoadmapNav/?rootIssue=3&parentIssue=2&currentIssue=1', '/RoadmapNav', { shallow: true })
  }, [router])

  useEffect(() => {
    console.log('router.query.currentIssue changed! | router:', router)
  }, [router, router.query.currentIssue])
}

export default Page
