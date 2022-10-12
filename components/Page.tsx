import { SearchIcon } from '@primer/octicons-react';
import { PageLayout, Box, TextInput, IconButton, Text, FormControl, Button, Pagehead } from '@primer/react';
import { useEffect, useState } from 'react';
import { MarkdownViewer } from '@primer/react/drafts';
import { getGraph } from '../lib/roadmap';

const getRoadmap = () => {
  console.log('getRoadmap()');
};

const IssueData = ({ issueUrl }) => {
  const [issueData, setIssueData] = useState(null);
  const [isLoading, setLoading] = useState(false);

  // console.log('IssueData');
  useEffect(() => {
    setLoading(true);
    fetch(`/api/github-issue?depth=1&url=${new URL(issueUrl)}`)
      .then((res) => {
        console.log('inside fetch!');
        return res.json();
      })
      .then((data) => {
        console.log('inside data!', data);
        setIssueData(data);
        setLoading(false);
      });
  }, [issueUrl]);

  if (isLoading) return <p>Loading...</p>;
  if (!issueData) return <p>No data for url.</p>;

  return (
    <>
      <code style={{ overflowWrap: 'anywhere' }}>{`${JSON.stringify(issueData)}`}</code>
    </>
  );
};

const Page = () => {
  const [issueUrl, setIssueUrl] = useState('');
  const [currentIssueUrl, setCurrentIssueUrl] = useState('');
  const [error, setError] = useState(null);

  return (
    <PageLayout>
      <PageLayout.Header>
        <Pagehead>Roadmap Generator</Pagehead>
      </PageLayout.Header>
      <PageLayout.Content>
        <Box>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              try {
                new URL(currentIssueUrl) && setIssueUrl(currentIssueUrl);
              } catch (error: any) {
                setError(error);
              }
            }}
          >
            <Box>
              <FormControl id='issue-url'>
                <FormControl.Label>GitHub Issue URL</FormControl.Label>
                <TextInput
                  aria-label='Issue URL'
                  name='issue-url'
                  autoComplete='url'
                  defaultValue={issueUrl}
                  onChange={(e) => setCurrentIssueUrl(e.target.value)}
                  block
                />
                <Button>Create roadmap from issue</Button>
                <FormControl.Caption>Example: https://github.com/pln-roadmap/roadmap-test/issues/2</FormControl.Caption>
              </FormControl>
            </Box>
          </form>
        </Box>
        <Box mt={5}>
          <b>URL:</b> {issueUrl}
        </Box>
        <Box mt={2}>{error || !issueUrl || <IssueData issueUrl={issueUrl} />}</Box>
        {/* <Box>{getGraph()}</Box> */}
      </PageLayout.Content>
      <PageLayout.Footer></PageLayout.Footer>
    </PageLayout>
  );
};

export default Page;
