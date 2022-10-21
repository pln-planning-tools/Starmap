import { useState } from 'react'
import useSharedHook from '../lib/client/createSharedHook'

// eslint-disable-next-line react-hooks/rules-of-hooks
const [useWeekTicks, setWeekTicks] = useSharedHook(useState, 4)

export { useWeekTicks, setWeekTicks }
