import LinksRedirectArrow from '@/components/links/LinksRedirectArrow';

const Page = () => {
  return (
    <div className='px-5 py-4'>
      <div className='flex justify-end'>
        <LinksRedirectArrow target='/profile' title='View Posts' />
      </div>
    </div>
  );
};

export default Page;
