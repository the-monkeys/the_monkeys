'use client';

import { useEffect } from 'react';

import { useSearchParams } from 'next/navigation';

interface SearchParamsComponentProps {
  setSearchParams: (params: { username: string; evpw: string }) => void;
}

const SearchParamsComponent: React.FC<SearchParamsComponentProps> = ({
  setSearchParams,
}) => {
  const searchParams = useSearchParams();

  useEffect(() => {
    const username = searchParams.get('user') || '';
    const evpw = searchParams.get('evpw') || '';
    setSearchParams({ username, evpw });
  }, [searchParams, setSearchParams]);

  return null;
};

export default SearchParamsComponent;
