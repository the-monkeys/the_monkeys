import React from 'react';

import Icon from '@/components/icon';
import LinksRedirectArrow from '@/components/links/LinksRedirectArrow';
import { Button } from '@/components/ui/button';

import Section from './Section';

const Post = () => {
  return (
    <div className='min-h-screen mt-5 p-5 space-y-8'>
      <Section sectionTitle='Topics'>
        <div>
          <h4 className='font-josefin_Sans text-lg'>Add Topics</h4>

          <p className='font-jost text-sm opacity-75'>
            You can choose and add topics from different categories to your
            profile according to your interests.
          </p>

          <div className='mt-4 space-y-2'>
            <LinksRedirectArrow link='/explore-topics' position='Right'>
              <p className='font-josefin_Sans font-medium text-sm sm:text-base'>
                Explore Topics
              </p>
            </LinksRedirectArrow>

            <Button
              size='icon'
              variant='secondary'
              className='rounded-full'
              disabled
            >
              <Icon name='RiAdd' />
            </Button>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default Post;
