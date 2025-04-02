import { Bookmarks } from './components/Bookmarks';

const LibraryPage = ({
  params,
}: {
  params: {
    source: string;
  };
}) => {
  const source = params.source;

  return (
    <div className='mx-auto max-w-3xl min-h-screen'>
      <Bookmarks />
    </div>
  );
};

export default LibraryPage;
