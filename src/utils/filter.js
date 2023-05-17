import dayjs from 'dayjs';
import {FilterType} from '../const';

const isEventFuture = (event) => dayjs().isBefore(event.startDate);

const isEventPresent = (event) => dayjs().isAfter(event.startDate) && dayjs().isBefore(event.endDate);

const isEventPast = (event) => dayjs().isAfter(event.endDate);

const filter = {
  [FilterType.EVERYTHING]: (events) => [...events],
  [FilterType.FUTURE]: (events) => events.filter((event) => isEventFuture(event)),
  [FilterType.PRESENT]: (events) => events.filter((event) => isEventPresent(event)),
  [FilterType.PAST]: (events) => events.filter((event) => isEventPast(event))
};

export {filter};
