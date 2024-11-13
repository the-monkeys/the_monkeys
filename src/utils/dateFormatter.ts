import moment from 'moment';

export const newsDateFormatter = (date?: string) => {
  const publishedDate = moment(date);

  const timeDiffHours = moment().diff(publishedDate, 'hours');
  const timeDiffDays = moment().diff(publishedDate, 'days');

  if (timeDiffDays > 1) {
    return `${timeDiffDays} days ago`;
  } else if (timeDiffDays === 1) {
    return `${timeDiffDays} day ago`;
  } else if (timeDiffHours === 1) {
    return `${timeDiffHours} hour ago`;
  } else {
    return `${timeDiffHours} hours ago`;
  }
};

export const activityDateFormatter = (date?: string) => {
  const activityTimestamp = moment(date);

  return activityTimestamp.format('MMM D, YYYY');
};
