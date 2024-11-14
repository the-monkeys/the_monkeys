const BlogCommentsSection = () => {
  return (
    <div className='mt-12 mx-auto w-full sm:w-4/5 space-y-4'>
      <h4 className='px-1 font-josefin_Sans font-medium text-xl sm:text-2xl'>
        Comments <span className='font-normal text-base opacity-75'>(0)</span>
      </h4>

      <p className='py-10 font-jost text-center italic opacity-75'>
        This blog has no comments yet.
      </p>
    </div>
  );
};

export default BlogCommentsSection;
