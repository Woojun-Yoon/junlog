import type { StaticImageData } from 'next/image'

import { cn } from '@/lib/utils'
import React from 'react'
import RichText from '@/components/RichText'

import type { MediaBlock as MediaBlockProps } from '@/payload-types'

import { Media } from '@/components/Media'

type Props = MediaBlockProps & {
  breakout?: boolean
  captionClassName?: string
  className?: string
  enableGutter?: boolean
  imgClassName?: string
  staticImage?: StaticImageData
}

export const MediaBlock: React.FC<Props> = (props) => {
  const {
    captionClassName,
    className,
    enableGutter = true,
    imgClassName,
    media,
    staticImage,
  } = props

  let caption
  if (media && typeof media === 'object') caption = media.caption

  const imageSizes = enableGutter
    ? '(max-width: 639px) calc(100vw - 2rem), (max-width: 767px) 608px, (max-width: 1023px) 704px, (max-width: 1279px) 960px, (max-width: 1375px) 1216px, 1312px'
    : '(max-width: 639px) calc(100vw - 2rem), (max-width: 767px) 608px, (max-width: 1023px) 704px, 768px'

  return (
    <div
      className={cn(
        '',
        {
          container: enableGutter,
        },
        className,
      )}
    >
      {(media || staticImage) && (
        <Media
          imgClassName={cn('border border-border rounded-[0.8rem]', imgClassName)}
          resource={media}
          sizes={imageSizes}
          src={staticImage}
        />
      )}
      {caption && (
        <div
          className={cn(
            'mt-6',
            captionClassName,
          )}
        >
          <RichText data={caption} enableGutter={false} />
        </div>
      )}
    </div>
  )
}
