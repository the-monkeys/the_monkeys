import Marquee from 'react-fast-marquee';

const StockMarquee = () => {
  return (
    <Marquee gradient={false} speed={50}>
      <div className='bg-black text-white px-3 py-1 mx-2 rounded'>
        S&P 500 5,703.51 <span className='text-green-400'>▲ +1.52%</span>
      </div>
      <div className='bg-black text-white px-3 py-1 mx-2 rounded'>
        Nasdaq 18,003.48 <span className='text-green-400'>▲ +2.45%</span>
      </div>
      <div className='bg-black text-white px-3 py-1 mx-2 rounded'>
        US 10 Yr 3.74 <span className='text-red-400'>▼ -0.34%</span>
      </div>
      <div className='bg-black text-white px-3 py-1 mx-2 rounded'>
        FTSE 100 8,312.4
      </div>{' '}
      <div className='bg-black text-white px-3 py-1 mx-2 rounded'>
        Nasdaq 18,003.48 <span className='text-green-400'>▲ +2.45%</span>
      </div>
      <div className='bg-black text-white px-3 py-1 mx-2 rounded'>
        US 10 Yr 3.74 <span className='text-red-400'>▼ -0.34%</span>
      </div>
      <div className='bg-black text-white px-3 py-1 mx-2 rounded'>
        FTSE 100 8,312.4
      </div>
    </Marquee>
  );
};

export default StockMarquee;
