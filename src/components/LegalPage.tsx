import Container from './layout/Container';
import { PageHeader, PageHeading, PageSubheading } from './layout/pageHeading';

const LegalPage = ({
  title,
  date,
  content,
}: {
  title: string;
  date: string;
  content: React.ReactNode;
}) => {
  return (
    <Container className='px-5 mb-20 min-h-screen sm:w-4/5 w-full space-y-10'>
      <PageHeader>
        <PageHeading heading={title} className='py-1' />
        <PageSubheading subheading={date} className='opacity-75' />
      </PageHeader>

      <div className='font-roboto font-light text-base md:text-lg'>
        {content}
      </div>
    </Container>
  );
};

export default LegalPage;
