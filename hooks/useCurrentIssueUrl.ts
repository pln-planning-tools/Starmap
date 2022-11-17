import { useState } from 'react';

import useSharedHook from '../lib/client/createSharedHook';

const [useCurrentIssueUrl, setCurrentIssueUrl] = useSharedHook(useState, '');

export { useCurrentIssueUrl, setCurrentIssueUrl };
