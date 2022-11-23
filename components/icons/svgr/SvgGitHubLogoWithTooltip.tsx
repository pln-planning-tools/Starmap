import { Tooltip, Flex } from '@chakra-ui/react';
import React from 'react';

import SvgGitHubLogo from './SvgGitHubLogo';
import styles from './SvgGitHubLogoWithTooltip.module.css';

const LogoWithTooltip = React.forwardRef<any, {children?: any}>(({ children, ...rest }, ref) => (
    <SvgGitHubLogo ref={ref} {...rest}>
      {children}
    </SvgGitHubLogo>
))

export const SvgGitHubLogoWithTooltip = (props) => {
  const onClickHandler = (event) => {
    /**
     * prevent roadmap card from handling the click event
     */
    event.stopPropagation()
    window.open(props.githuburl, '_blank', 'noopener,noreferrer')
  }
  return (
    <div onClick={onClickHandler}>
        <Tooltip hasArrow label='Open in GitHub'>
          <div className={styles['githubIcon-withTooltip']}>
            <LogoWithTooltip {...props} />
          </div>
        </Tooltip>
    </div>
  )
}

