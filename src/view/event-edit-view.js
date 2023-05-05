import {createElement} from '../render.js';
import dayjs from 'dayjs';

const DATE_FORMAT = 'DD/MM/YY HH:mm';

const createEventTypesTemplate = (types, selectedType) => {
  let templateContent = '';
  for (const type of types) {
    templateContent +=
    `<div class="event__type-item">
      <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}"
      ${selectedType === type ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
    </div>`;
  }
  return templateContent;
};

const createDestinationsTemplate = (destinations) => {
  let templateContent = '';
  for (const destination of destinations) {
    templateContent += `<option value="${destination}}"></option>`;
  }
  return templateContent;
};

const createOffersTemplate = (availableOffers, selectedOffers) => {
  let templateContent = '';
  if (selectedOffers.length === 0) {
    return templateContent;
  }
  templateContent += `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">`;

  for (let i = 0; i < availableOffers.length; i++) {
    const offer = availableOffers[i];
    const checked = selectedOffers.includes(i) ? 'checked' : '';
    templateContent += `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}-1" type="checkbox" name="event-offer-${offer.id}" ${checked}>
      <label class="event__offer-label" for="event-offer-${offer.id}-1">
        <span class="event__offer-title">${offer.description}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`;
  }
  templateContent += '</div></section>';
  return templateContent;
};

const createPhotoTemplate = (photos) => {
  let templateContent = '';
  if (photos.length === 0) {
    return templateContent;
  }
  templateContent += `<div class="event__photos-container">
    <div class="event__photos-tape">`;

  for (const photo of photos) {
    templateContent += `<img class="event__photo" src="${photo}" alt="Event photo"></img>`;
  }
  templateContent += '</div></div>';
  return templateContent;
};

const createEventEditTemlpate = (event, types, destinations, availableOffers) => {
  const {type, destination, offers, startDate, endDate, price} = event;
  const typeName = types[type];

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${typeName}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${createEventTypesTemplate(types, typeName)}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${typeName}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinations[destination].title}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${createDestinationsTemplate(destinations)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dayjs(startDate).format(DATE_FORMAT)}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dayjs(endDate).format(DATE_FORMAT)}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        ${createOffersTemplate(availableOffers.get(typeName), offers)}
        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${destinations[destination].description}</p>
          ${createPhotoTemplate(destinations[destination].photos)}
        </section>
      </section>
    </form>
  </li>`;
};

export default class EventEditView {
  constructor({event, types, destinations, availableOffers}) {
    this.event = event;
    this.types = types;
    this.destinations = destinations;
    this.availableOffers = availableOffers;
  }

  getTemplate() {
    return createEventEditTemlpate(
      this.event,
      this.types,
      this.destinations,
      this.availableOffers);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
