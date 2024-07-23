import moment from 'moment';

export const newsDateFormatter = (date?: string) => {
  const publishedDate = moment(date);

  const timeDiffHours = moment().diff(publishedDate, 'hours');
  const timeDiffDays = moment().diff(publishedDate, 'days');

  if (timeDiffDays > 1) {
    return `${timeDiffDays} days`;
  } else if (timeDiffDays === 1) {
    return `${timeDiffDays} day`;
  } else {
    return `${timeDiffHours} hours`;
  }
};

export const activityDateFormatter = (date?: string) => {
  const activityTimestamp = moment(date);

  return activityTimestamp.format('MMMM D, YYYY');
};
