import Icon from '@/components/icon';
import useGetBlogStats from '@/hooks/blog/useGetBlogStats';

export const BlogStats = ({ blogId }: { blogId?: string }) => {
  const { stats, statsLoading, statsError } = useGetBlogStats(blogId);

  if (statsLoading || statsError) return null;

  return (
    <div className='flex items-center gap-1 text-sm opacity-80'>
      <Icon name='RiEye' size={16} />
      <span className='font-dm_sans'>
        {stats?.read_count ?? 0} {stats?.read_count === 1 ? 'read' : 'reads'}
      </span>
    </div>
  );
};
