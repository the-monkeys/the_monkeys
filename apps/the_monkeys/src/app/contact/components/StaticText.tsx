import { BackgroundWaves } from '@/components/branding/BackgroundWaves';

const StaticText = () => {
  return (
    <div className='w-full sm:w-1/2 relative flex flex-col items-center sm:items-start gap-4 p-6'>
      <h2 className='text-4xl md:text-5xl font-dm_sans font-bold text-center'>
        Got an Idea<span className='text-brand-orange'>?</span>&nbsp; Found an
        Issue<span className='text-brand-orange'>?</span>
        <br />
        {`Let's Connect`}
        <span className='text-brand-orange'>.</span>
      </h2>
      <p className='pt-3 text-base sm:text-lg text-center tracking-tight'>
        Our community is evolving. Get in touch with the team behind &nbsp;
        <span className='font-semibold'>Monkeys</span>&nbsp; and explore
        partnership, collaboration, or support opportunities.
      </p>

      <div className='absolute top-0 left-0 w-full h-full -z-10 opacity-80'>
        <BackgroundWaves />
      </div>
    </div>
  );
};

export default StaticText;
