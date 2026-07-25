import React from 'react'

import { CMSLink } from '@/payload/fields/Link/index'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { MediumImpactHeroBlock } from '@/payload-types'

export const MediumImpactHero = ({ links, media, richText }: MediumImpactHeroBlock) => {
  return (
    <div className="">
      <div className="container mb-8">
        {richText && <RichText className="mb-6" data={richText} enableGutter={false} />}

        {Array.isArray(links) && links.length > 0 && (
          <ul className="flex gap-4">
            {links.map(({ link }, i) => {
              return (
                <li key={i}>
                  <CMSLink {...link} />
                </li>
              )
            })}
          </ul>
        )}
      </div>
      <div className="container ">
        {media && typeof media === 'object' && (
          <div>
            <Media
              className="-mx-4 md:-mx-8 2xl:-mx-16"
              imgClassName=""
              priority
              resource={media}
              sizes="(max-width: 639px) 100vw, (max-width: 767px) 640px, (max-width: 1023px) 768px, (max-width: 1279px) 1024px, (max-width: 1375px) 1280px, (max-width: 1535px) 1376px, 1440px"
            />
            {media?.caption && (
              <div className="mt-3">
                <RichText data={media.caption} enableGutter={false} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
