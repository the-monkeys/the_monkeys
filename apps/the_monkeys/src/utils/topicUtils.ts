export const topicToSlug = (topic: string): string => {
  if (!topic) return '';

  return topic
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Collapse multiple hyphens
    .replace(/^-+|-+$/g, ''); // Trim leading/trailing hyphens
};

export const slugToTopic = (slug: string): string => {
  if (!slug) return '';

  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const createTopicUrl = (topic: string): string => {
  return `/topics/${topicToSlug(topic)}`;
};
