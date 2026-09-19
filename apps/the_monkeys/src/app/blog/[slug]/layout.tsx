const BlogPageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className='min-h-[800px]'>
      <article itemScope itemType='https://schema.org/BlogPosting'>
        {children}
      </article>
    </main>
  );
};

export default BlogPageLayout;
