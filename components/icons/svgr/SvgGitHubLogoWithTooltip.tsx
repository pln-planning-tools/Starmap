import { Link, Tooltip } from '@chakra-ui/react';
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
  }
  return (
    <div onClick={onClickHandler}>
      <Tooltip hasArrow label='Open in GitHub'>
        <div className={styles['githubIcon-withTooltip']}>
          <Link href={props.githuburl} target="_blank" rel="noopener noreferrer">
            <LogoWithTooltip {...props} />
          </Link>
        </div>
      </Tooltip>
    </div>
  )
}
