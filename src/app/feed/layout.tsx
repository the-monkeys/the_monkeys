import { ContributeAndSponsorCard } from '@/components/branding/sponsor/ContributeAndSponsorCard';
import Container from '@/components/layout/Container';
import { SearchInput } from '@/components/search/SearchInput';

const BlogFeedPageLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <Container className='grid grid-cols-3 gap-6 lg:gap-8 px-4 py-5 pb-12'>
      <div className='min-h-screen col-span-3 lg:col-span-2 order-2 lg:order-1'>
        {children}
      </div>

      <div className='mx-auto max-w-3xl w-full h-fit col-span-3 lg:col-span-1 order-1 lg:order-2'>
        <ContributeAndSponsorCard className='mb-4' />

        <SearchInput />
      </div>
    </Container>
  );
};

export default BlogFeedPageLayout;
