import { LinkIcon } from '@chakra-ui/icons'
import { Link, Text } from '@chakra-ui/react'
import type { HeadingProps } from 'react-markdown/lib/ast-to-react'

import styles from './HeadingRenderer.module.css'

function generateSlug (text: string): string {
  return text.toLowerCase().replace(/[`'":?]/gm, '').replace(/\W/g, '-')
}

export function HeadingRenderer ({ children, level }: HeadingProps) {
  const text = children[0] as string

  const slug = generateSlug(text)
  return (
    <Text as={`h${level}` as any} className={styles.heading} id={slug} color="text">
      <Link className={styles.link} href={`#${slug}`}>
        {text}
        <LinkIcon className={styles['heading--anchorIcon']} boxSize="1rem" />
      </Link>
    </Text>
  )
}
