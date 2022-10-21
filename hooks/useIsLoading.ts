import { useState } from 'react'
import useSharedHook from '../lib/client/createSharedHook'

// eslint-disable-next-line react-hooks/rules-of-hooks
const [useIsLoading, setIsLoading] = useSharedHook(useState, false)

export { useIsLoading, setIsLoading }

