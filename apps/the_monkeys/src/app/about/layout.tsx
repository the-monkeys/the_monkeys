import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'About Us',
    description:
      'Monkeys is a creative publishing platform for writers, creators, and thinkers to share stories, articles, and ideas that inspire, inform, and spark innovation. Collaborate, learn, and make an impact through meaningful storytelling, thought leadership, and knowledge sharing.',
  };
}

const AboutPageLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <div className='min-h-[800px] px-4 space-y-10'>{children}</div>;
};

export default AboutPageLayout;
