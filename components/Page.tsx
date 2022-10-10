import { SearchIcon } from '@primer/octicons-react';
import { PageLayout, Box, TextInput, IconButton, Text, FormControl, Button, Pagehead } from '@primer/react';
import { useState } from 'react';
import { MarkdownViewer } from '@primer/react/drafts';
import { getGraph } from '../lib/roadmap';

const getRoadmap = () => {
  console.log('getRoadmap()');
};

const Page = () => {
  const [issueUrl, setIssueUrl] = useState('');
  const [issueUrlSubmitted, setIssueUrlSubmitted] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('handleButtonClick | value ->', event);
    console.log('stateValue ->', issueUrl);
    getGraph();

    setIssueUrlSubmitted(issueUrl);
  };

  return (
    <PageLayout>
      <PageLayout.Header>
        <Pagehead>Roadmap Generator</Pagehead>
      </PageLayout.Header>
      <PageLayout.Content>
        <Box>
          <form onSubmit={handleSubmit}>
            <Box>
              <FormControl id='issue-url'>
                <FormControl.Label>GitHub Issue URL</FormControl.Label>
                <TextInput
                  aria-label='Issue URL'
                  name='issue-url'
                  autoComplete='url'
                  defaultValue={issueUrl}
                  onChange={(e) => setIssueUrl(e.target.value)}
                  block
                />
                <Button>Create roadmap from issue</Button>
                <FormControl.Caption>Example: https://github.com/pln-roadmap/roadmap-test/issues/2</FormControl.Caption>
              </FormControl>
            </Box>
          </form>
        </Box>
        <Box p={2}>{issueUrlSubmitted}</Box>
        {/* <Box>{getGraph()}</Box> */}
      </PageLayout.Content>
      <PageLayout.Footer></PageLayout.Footer>
    </PageLayout>
  );
};

export default Page;
