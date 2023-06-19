const HOUR_DURATION = 60;
const DAY_DURATION = 24;

const addLeadingZero = (value) => value < 10 ? `0${value}` : value;

const getTimeFromMins = (mins) => {
  if (mins < HOUR_DURATION) {
    return `${addLeadingZero(mins)}M`;
  }
  let hours = Math.trunc(mins / HOUR_DURATION);
  const minutes = mins % HOUR_DURATION;
  if (hours < DAY_DURATION) {
    return `${addLeadingZero(hours)}H ${addLeadingZero(minutes)}M`;
  }
  const days = Math.trunc(hours / DAY_DURATION);
  hours = hours % DAY_DURATION;
  return `${addLeadingZero(days)}D ${addLeadingZero(hours)}H ${addLeadingZero(minutes)}M`;
};

export {getTimeFromMins};
