import moment from 'moment';

export const newsDateFormatter = (date: string) => {
  const publishedDate = moment(date);

  const formattedDate = publishedDate.format('MMMM DD, YYYY');
  const timeAgo = publishedDate.fromNow();

  const timeDiff = moment().diff(publishedDate, 'days');

  if (timeDiff > 5) return formattedDate;

  return timeAgo;
};
