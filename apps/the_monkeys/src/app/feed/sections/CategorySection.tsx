import Container from '@/components/layout/Container';

const CategorySection = ({ category }: { category: string }) => {
  return (
    <Container className='px-4 py-6'>
      <div className='w-fit'>
        <div className='h-1 w-1/3 bg-brand-orange' />

        <h5 className='pt-3 pb-1 font-dm_sans font-semibold text-4xl md:text-5xl break-words'>
          {category}
        </h5>
      </div>
    </Container>
  );
};

export default CategorySection;
