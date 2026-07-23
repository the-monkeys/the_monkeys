import React from 'react';

import { GetAllCategoriesAPIResponse } from '@/services/category/categoryTypes';
import { fetcher } from '@/services/fetcher';

import Topics from './components/Topics';

export const dynamic = 'force-static';

const ExploreTopicsPage = async () => {
  const categories = (await fetcher(
    '/user/category'
  )) as GetAllCategoriesAPIResponse;

  return (
    <div className='space-y-8'>
      <Topics categories={categories} />
    </div>
  );
};

export default ExploreTopicsPage;
