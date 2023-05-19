import { Center, Text } from '@chakra-ui/react'
import { useCallback } from 'react'

import { useViewMode } from '../../hooks/useViewMode'

export function LegacyButton () {
  const viewMode = useViewMode()
  const onLegacyStarmapLinkClick = useCallback(() => {
    const url = new URL(window.location.href)
    url.host = 'legacy.starmap.site'
    url.port = ''

    // set the url hash to the viewMode (the only valid hash string on legacy.starmap.site)
    url.hash = viewMode as string

    window.location.href = url.toString()
  }, [viewMode])

  return (
    <Center textAlign={'center'} cursor="pointer">
      <Text fontSize={10} color="textHeader" onClick={onLegacyStarmapLinkClick} cursor="pointer">View legacy starmap</Text>
    </Center>
  )
}
