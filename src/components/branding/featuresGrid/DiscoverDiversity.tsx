import { GridContainer, GridHeading, GridSubHeading } from './gridLayout';

const DiscoverDiversity = () => {
  return (
    <GridContainer className='h-full group col-span-2 sm:col-span-1 space-y-4'>
      <div className='py-4 px-4'>
        <GridHeading>Discover Diversity</GridHeading>

        <GridSubHeading>
          Explore categories tailored to your interests.
        </GridSubHeading>
      </div>

      <div className='mx-4 h-40 space-y-2 overflow-hidden' aria-disabled='true'>
        <div className='-ml-1 group-hover:-ml-10 flex gap-1 overflow-hidden transition-all'>
          <p className='px-4 py-1 font-jost bg-primary-monkeyOrange text-secondary-white rounded-full'>
            Business
          </p>
          <p className='px-4 py-1 font-jost bg-secondary-lightGrey/15 rounded-full'>
            Science
          </p>
          <p className='px-4 py-1 font-jost bg-primary-monkeyOrange text-secondary-white rounded-full'>
            Nature
          </p>
          <p className='px-4 py-1 font-jost bg-secondary-lightGrey/15 rounded-full'>
            Relationship
          </p>
          <p className='px-4 py-1 font-jost bg-secondary-lightGrey/15 rounded-full'>
            Cooking
          </p>
          <p className='px-4 py-1 font-jost bg-primary-monkeyOrange text-secondary-white rounded-full'>
            Writing
          </p>
          <p className='px-4 py-1 font-jost bg-secondary-lightGrey/15 rounded-full'>
            Sexuality
          </p>
        </div>

        <div className='-ml-14 group-hover:-ml-4 flex gap-1 overflow-hidden transition-all'>
          <p className='px-4 py-1 font-jost bg-secondary-lightGrey/15 rounded-full'>
            Finance
          </p>
          <p className='px-4 py-1 font-jost bg-primary-monkeyOrange text-secondary-white rounded-full'>
            Design
          </p>
          <p className='px-4 py-1 font-jost bg-secondary-lightGrey/15 rounded-full'>
            Health
          </p>
          <p className='px-4 py-1 font-jost bg-secondary-lightGrey/15 rounded-full'>
            Humor
          </p>
          <p className='px-4 py-1 font-jost bg-primary-monkeyOrange text-secondary-white rounded-full'>
            Gaming
          </p>
          <p className='px-4 py-1 font-jost bg-secondary-lightGrey/15 rounded-full'>
            Hobbies
          </p>
          <p className='px-4 py-1 font-jost bg-secondary-lightGrey/15 rounded-full'>
            Animation
          </p>
          <p className='px-4 py-1 font-jost bg-primary-monkeyOrange text-secondary-white rounded-full'>
            Podcasts
          </p>
        </div>

        <div className='-ml-4 group-hover:-ml-16 flex gap-1 overflow-hidden transition-all'>
          <p className='px-4 py-1 font-jost bg-primary-monkeyOrange text-secondary-white rounded-full'>
            Crypto
          </p>
          <p className='px-4 py-1 font-jost bg-secondary-lightGrey/15 rounded-full'>
            Sports
          </p>
          <p className='px-4 py-1 font-jost bg-secondary-lightGrey/15 rounded-full'>
            Law
          </p>
          <p className='px-4 py-1 font-jost bg-primary-monkeyOrange text-secondary-white rounded-full'>
            Technology
          </p>
          <p className='px-4 py-1 font-jost bg-secondary-lightGrey/15 rounded-full'>
            Religion
          </p>
          <p className='px-4 py-1 font-jost bg-primary-monkeyOrange text-secondary-white rounded-full'>
            Movies
          </p>
          <p className='px-4 py-1 font-jost bg-secondary-lightGrey/15 rounded-full'>
            Crypto
          </p>
          <p className='px-4 py-1 font-jost bg-primary-monkeyOrange text-secondary-white rounded-full'>
            Leadership
          </p>
        </div>

        <div className='-ml-16 group-hover:-ml-2 flex gap-1 overflow-hidden transition-all'>
          <p className='px-4 py-1 font-jost bg-secondary-lightGrey/15 rounded-full'>
            Reading
          </p>
          <p className='px-4 py-1 font-jost bg-primary-monkeyOrange text-secondary-white rounded-full'>
            Programming
          </p>
          <p className='px-4 py-1 font-jost bg-secondary-lightGrey/15 rounded-full'>
            Photography
          </p>
          <p className='px-4 py-1 font-jost bg-primary-monkeyOrange text-secondary-white rounded-full'>
            Music
          </p>
          <p className='px-4 py-1 font-jost bg-secondary-lightGrey/15 rounded-full'>
            Art
          </p>
          <p className='px-4 py-1 font-jost bg-secondary-lightGrey/15 rounded-full'>
            Spirituality
          </p>
          <p className='px-4 py-1 font-jost bg-secondary-lightGrey/15 rounded-full'>
            Language
          </p>
          <p className='px-4 py-1 font-jost bg-primary-monkeyOrange text-secondary-white rounded-full'>
            Lifestyle
          </p>
        </div>
      </div>
    </GridContainer>
  );
};

export default DiscoverDiversity;
