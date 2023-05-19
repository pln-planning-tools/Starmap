import { hookstate, State } from '@hookstate/core'
import { createContext } from 'react'

import { DetailedViewGroup, IssueData } from '../../lib/types'

export const IssueDataStateContext = createContext<State<IssueData | null>>(hookstate(null) as State<IssueData | null>)

export const IssuesGroupedContext = createContext<DetailedViewGroup[]>([] as DetailedViewGroup[])
