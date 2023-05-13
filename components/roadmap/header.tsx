import { Center, Flex, Link, Skeleton, Spacer, Text } from '@chakra-ui/react'
import Image from 'next/image'
import NextLink from 'next/link'
import React, { useContext } from 'react'

import { ReactElement } from 'react-markdown/lib/react-markdown'
import { useGlobalLoadingState } from '../../hooks/useGlobalLoadingState'
import GitHubSvgIcon from '../icons/GitHubLogo.svg'
import { IssueDataStateContext } from './contexts'
import themes from '../theme/constants'

export default function Header (): ReactElement {
  const globalLoadingState = useGlobalLoadingState()
  const isGlobalLoading = globalLoadingState.get()
  const issueDataState = useContext(IssueDataStateContext)
  const rootIssueUrl = issueDataState.ornull?.html_url?.value
  const rootIssueTitle = issueDataState.ornull?.title?.value

  const isReadyToRender = typeof rootIssueUrl === 'string' && typeof rootIssueTitle === 'string' && !isGlobalLoading

  return (
    <Skeleton isLoaded={isReadyToRender} >
      <Flex direction={'row'} lineHeight={1} >
        <Text as='span' fontSize={24} fontWeight={600} pr="5rem">
          {rootIssueTitle}
        </Text>
        <Spacer />
        <Center>
          <NextLink style={{ display: 'span' }} passHref href={rootIssueUrl as string}>
            <Link target="_blank" rel="noopener noreferrer">
              <Center minWidth="9rem">
                <Text as='span' fontSize={15} fontWeight={400} color={themes.light.text.color} pr="0.5rem">View in GitHub</Text>
                <Image src={GitHubSvgIcon} alt="GitHub Logo" color={themes.light.text.color} width={24} height={24} />
              </Center>
            </Link>
          </NextLink>
        </Center>
      </Flex>
    </Skeleton>
  )
}
