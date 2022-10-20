/**
 * Typescript version of https://github.com/bebbi/react-shared-hook/blob/d6cabcb49a7978267c36057ba7efd40ca56aec03/src/index.js
 * @fileoverview
 */
import { Dispatch, SetStateAction, useEffect, useState } from 'react'

type UseSharedHookReturnType<T> = [() => T, (newValue: T) => void]

const useSharedHook = <T>(hook: typeof useState, state: T): UseSharedHookReturnType<T> => {
  const listeners: Set<Dispatch<SetStateAction<T>>> = new Set()

  const client = () => {
    const [clientState, setter] = hook(state)

    useEffect(() => {
      listeners.add(setter)
      return () => {
        listeners.delete(setter)
      }
    }, [listeners])

    return clientState
  }

  const setter = (newValue: T) => {
    if (typeof newValue === 'function') {
      newValue = newValue(state)
    }
    state = newValue
    listeners.forEach(listener => listener(newValue))
  }

  return [client, setter]
}

export default useSharedHook
