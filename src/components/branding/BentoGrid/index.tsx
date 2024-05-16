import GridHeader from './GridHeader';
import GridTag from './GridTag';

const BentoGrid = () => {
  return (
    <div className='px-5 py-4 flex gap-1 flex-col md:flex-row cursor-default'>
      <div className='w-full md:w-3/5 flex flex-col gap-1'>
        <div className='px-5 py-2 flex flex-col border-1 border-secondary-lightGrey/10 rounded-lg'>
          <GridTag
            title='Collaborative Writing'
            className='self-end md:self-start'
          />
          <GridHeader
            title='Write together for impact'
            subheading='Empower your content with collective expertise. Invite others to co-author, enriching your narrative and engaging your audience with diverse perspectives.'
            className='text-right md:text-left'
          />
        </div>
        <div className='px-5 py-2 flex flex-col border-1 border-secondary-lightGrey/10 rounded-lg'>
          <GridTag title='Discover Diversity' />
          <GridHeader
            title='Discover your interests with confidence'
            subheading='Navigate through a diverse array of categories tailored to your interests.'
          />
        </div>
      </div>

      <div className='w-full md:w-2/5'>
        <div className='h-full px-5 py-2 flex flex-col border-1 border-secondary-lightGrey/10 rounded-lg'>
          <GridTag title='Version Control' className='self-end' />
          <GridHeader
            title=' Tailor your content, your way'
            subheading='Personalize your blog with ease, choosing from different versions to showcase the content that best represents your voice and vision.'
            className='text-right'
          />
        </div>
      </div>
    </div>
  );
};

export default BentoGrid;
