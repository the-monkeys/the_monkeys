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
    <Container className='px-4 max-w-4xl min-h-[800px] sm:w-4/5 w-full space-y-6'>
      <PageHeader>
        <PageHeading heading={title} />
        <PageSubheading
          subheading={date}
          className='font-medium !text-base text-brand-orange !opacity-100'
        />
      </PageHeader>

      <div className='text-sm sm:text-base text-justify'>{content}</div>
    </Container>
  );
};

export default LegalPage;
