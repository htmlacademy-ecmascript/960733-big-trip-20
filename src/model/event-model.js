import {getRandomEvent, getDestinations, getOffers} from '../mock/events.js';
import {EVENT_TYPES} from '../const.js';

const EVENT_QUANTITY = 4;

export default class EventsModel {
  events = Array.from({length: EVENT_QUANTITY}, getRandomEvent);
  types = EVENT_TYPES;
  destinations = getDestinations();
  offers = getOffers();

  getEvents() {
    return this.events;
  }

  getTypes() {
    return this.types;
  }

  getDestinations() {
    return this.destinations;
  }

  getOffers() {
    return this.offers;
  }
}
