import { redirect } from 'next/navigation';

const NewsShowcase = ({
  searchParams,
}: {
  searchParams: {
    url: string;
  };
}) => {
  redirect(searchParams.url);
};

export default NewsShowcase;
