const AboutPageLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <div className='min-h-[800px] px-4 space-y-10'>{children}</div>;
};

export default AboutPageLayout;
