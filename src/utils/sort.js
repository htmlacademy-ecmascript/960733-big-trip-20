import dayjs from 'dayjs';

const sortByDate = (eventA, eventB) => dayjs(eventA.startDate).diff(dayjs(eventB.startDate));
const sortByTime = (eventA, eventB) => dayjs(eventB.endDate).diff(dayjs(eventB.startDate)) - dayjs(eventA.endDate).diff(dayjs(eventA.startDate));
const sortByPrice = (eventA, eventB) => eventB.price - eventA.price;

export {sortByDate, sortByTime, sortByPrice};
