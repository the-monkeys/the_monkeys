import Marquee from 'react-fast-marquee';

export const MarketData = () => {
  return (
    <Marquee speed={25} pauseOnHover={true} className='py-2'>
      <div className='mx-4 flex gap-2 items-center'>
        <p className='font-roboto text-sm sm:text-base'>
          <span className='font-medium'>S&P 500</span> 5,703.51
        </p>

        <div className='px-1 rounded-md bg-green-500 text-secondary-white'>
          <p className='font-roboto font-medium text-sm sm:text-base'>
            ▲ +1.52%
          </p>
        </div>
      </div>

      <div className='mx-4 flex gap-2 items-center'>
        <p className='font-roboto text-sm sm:text-base'>
          <span className='font-medium'>Nasdq</span> 18,198.31
        </p>

        <div className='px-1 rounded-md bg-green-500 text-secondary-white'>
          <p className='font-roboto font-medium text-sm sm:text-base'>
            ▲ +0.04%
          </p>
        </div>
      </div>

      <div className='mx-4 flex gap-2 items-center'>
        <p className='font-roboto text-sm sm:text-base'>
          <span className='font-medium'>US 10 Yr</span> 3.74
        </p>

        <div className='px-1 rounded-md bg-red-500 text-secondary-white'>
          <p className='font-roboto font-medium text-sm sm:text-base'>
            ▼ -0.34%
          </p>
        </div>
      </div>

      <div className='mx-4 flex gap-2 items-center'>
        <p className='font-roboto text-sm sm:text-base'>
          <span className='font-medium'>FTSE 100</span> 8,322.18
        </p>

        <div className='px-1 rounded-md bg-green-500 text-secondary-white'>
          <p className='font-roboto font-medium text-sm sm:text-base'>
            ▲ +0.45%
          </p>
        </div>
      </div>

      <div className='mx-4 flex gap-2 items-center'>
        <p className='font-roboto text-sm sm:text-base'>
          <span className='font-medium'>BTC</span> $66,266.73
        </p>

        <div className='px-1 rounded-md bg-green-500 text-secondary-white'>
          <p className='font-roboto font-medium text-sm sm:text-base'>
            ▲ +2.23%
          </p>
        </div>
      </div>

      <div className='mx-4 flex gap-2 items-center'>
        <p className='font-roboto text-sm sm:text-base'>
          <span className='font-medium'>ETH</span> $2.648.44
        </p>

        <div className='px-1 rounded-md bg-green-500 text-secondary-white'>
          <p className='font-roboto font-medium text-sm sm:text-base'>
            ▲ +1.92%
          </p>
        </div>
      </div>
    </Marquee>
  );
};
