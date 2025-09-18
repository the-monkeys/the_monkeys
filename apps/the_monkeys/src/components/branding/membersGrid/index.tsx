import Image from 'next/image';

import { teamInfo } from '@/constants/team';

const getRoleColor = (position: string) => {
  if (position.includes('Founder')) return 'from-purple-500 to-purple-700';
  if (position.includes('Lead') || position.includes('Maintainer'))
    return 'from-blue-500 to-blue-700';
  if (position.includes('Engineer') || position.includes('Developer'))
    return 'from-green-500 to-green-700';
  if (position.includes('Marketing') || position.includes('Growth'))
    return 'from-orange-500 to-orange-700';
  if (position.includes('AI')) return 'from-pink-500 to-pink-700';
  if (position.includes('Research')) return 'from-indigo-500 to-indigo-700';
  return 'from-gray-500 to-gray-700';
};

const getRoleIcon = (position: string) => {
  if (position.includes('Founder')) return '👑';
  if (position.includes('Lead') || position.includes('Maintainer')) return '🛠️';
  if (position.includes('Frontend')) return '🎨';
  if (position.includes('Backend')) return '⚙️';
  if (position.includes('Marketing') || position.includes('Growth'))
    return '📈';
  if (position.includes('AI')) return '🤖';
  if (position.includes('Research')) return '🔬';
  if (position.includes('Fullstack')) return '💻';
  return '👤';
};

const MembersGrid = () => {
  return (
    <div className='space-y-8'>
      {/* Team Members Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto'>
        {teamInfo.map((info, index) => {
          const roleColor = getRoleColor(info.position);
          const roleIcon = getRoleIcon(info.position);

          return (
            <div
              className='group relative p-6 bg-background-light dark:bg-background-dark border-1 border-border-light dark:border-border-dark rounded-2xl hover:border-brand-orange/30 transition-all duration-300 hover:shadow-lg hover:shadow-brand-orange/10 hover:-translate-y-1 animate-appear-up'
              key={index}
              style={{
                animationDelay: `${index * 100}ms`,
                animationFillMode: 'both',
              }}
            >
              {/* Role Icon Badge */}
              <div className='absolute -top-3 -right-3 w-8 h-8 bg-background-light dark:bg-background-dark border-2 border-brand-orange/20 rounded-full flex items-center justify-center text-lg shadow-sm group-hover:scale-110 transition-transform duration-300'>
                {roleIcon}
              </div>

              <div className='flex flex-col items-center text-center space-y-4'>
                {/* Avatar with enhanced styling */}
                <div className='relative'>
                  <div className='size-20 border-2 border-transparent bg-gradient-to-br from-brand-orange/20 to-brand-orange/10 p-1 rounded-full group-hover:scale-105 transition-all duration-300'>
                    <div className='size-full rounded-full overflow-hidden border-2 border-background-light dark:border-background-dark'>
                      <Image
                        src={info.avatar_url || './default-profile.svg'}
                        alt={info.name}
                        width={80}
                        height={80}
                        className='h-full w-full object-cover group-hover:scale-110 transition-all duration-300'
                      />
                    </div>
                  </div>

                  {/* Online indicator */}
                  <div className='absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-background-light dark:border-background-dark rounded-full animate-pulse'></div>
                </div>

                {/* Name */}
                <div className='space-y-1'>
                  <h6 className='text-lg font-dm_sans font-semibold text-text-dark dark:text-text-light group-hover:text-brand-orange transition-colors duration-300'>
                    {info.name}
                  </h6>

                  {/* Position with gradient background */}
                  <div
                    className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${roleColor} text-white text-xs font-medium shadow-sm group-hover:shadow-md transition-shadow duration-300`}
                  >
                    {info.position}
                  </div>
                </div>

                {/* Join Date */}
                <div className='text-xs text-text-light dark:text-text-dark opacity-70 font-medium group-hover:opacity-90 transition-opacity duration-300'>
                  Joined {info.joined}
                </div>

                {/* Hover effect overlay */}
                <div className='absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-orange/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none'></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Contributors Section */}
      <div
        className='relative mt-16 p-8 bg-gradient-to-br from-background-light to-background-light/50 dark:from-background-dark dark:to-background-dark/50 border-1 border-border-light dark:border-border-dark rounded-3xl animate-appear-up hover:shadow-lg hover:shadow-brand-orange/5 transition-all duration-300'
        style={{
          animationDelay: `${teamInfo.length * 100 + 200}ms`,
          animationFillMode: 'both',
        }}
      >
        <div className='absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
          <div className='px-4 py-2 bg-brand-orange text-white rounded-full text-sm font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-default'>
            ✨ Community
          </div>
        </div>

        <div className='text-center space-y-4 pt-4'>
          <h6 className='text-xl font-dm_sans font-semibold text-text-dark dark:text-text-light'>
            Powered by Our Amazing Community
          </h6>

          <p className='text-base text-text-light dark:text-text-dark opacity-80 max-w-2xl mx-auto leading-relaxed'>
            Behind every feature, every improvement, and every innovation are
            the incredible contributors who believe in our mission. From code
            contributions to feedback, from bug reports to feature ideas — you
            make Monkeys what it is.
          </p>

          <div className='flex items-center justify-center gap-2 pt-2'>
            <div
              className='text-2xl animate-bounce'
              style={{ animationDelay: '0ms' }}
            >
              🙏
            </div>
            <span className='text-sm font-medium text-brand-orange'>
              Thank you to all our contributors!
            </span>
            <div
              className='text-2xl animate-bounce'
              style={{ animationDelay: '200ms' }}
            >
              🚀
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembersGrid;
