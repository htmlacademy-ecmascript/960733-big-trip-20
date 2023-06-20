import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import he from 'he';

import 'flatpickr/dist/flatpickr.min.css';

const DATE_FORMAT = 'DD/MM/YY HH:mm';

const createEventTypesTemplate = (types, selectedType, isDisabled) => {
  let templateContent = '';
  for (const type of types) {
    templateContent +=
    `<div class="event__type-item">
      <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}"
      ${selectedType === type ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
      <label class="event__type-label  event__type-label--${type}" data-event-type="${type}" for="event-type-${type}-1">${type}</label>
    </div>`;
  }
  return templateContent;
};

const createDestinationsTemplate = (destinations) => {
  let templateContent = '';
  for (const destination of destinations) {
    templateContent += `<option value="${destination.name}">`;
  }
  return templateContent;
};

const createOffersTemplate = (availableOffers, selectedOffers, isDisabled) => {
  let templateContent = '';
  if (!availableOffers || !availableOffers.offers.length) {
    return templateContent;
  }
  templateContent += `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">`;

  for (let i = 0; i < availableOffers.offers.length; i++) {
    const offer = availableOffers.offers[i];
    const checked = selectedOffers.includes(offer.id) ? 'checked' : '';
    const disabled = isDisabled ? 'disabled' : '';
    templateContent += `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}-1" type="checkbox" name="event-offer-${offer.id}" data-offer-id="${offer.id}" ${checked} ${disabled}>
      <label class="event__offer-label" for="event-offer-${offer.id}-1">
        <span class="event__offer-title">${offer.title}</span>
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
  templateContent += '<div class="event__photos-container"><div class="event__photos-tape">';

  for (const photo of photos) {
    templateContent += `<img class="event__photo" src="${photo.src}" alt="${photo.description}"></img>`;
  }
  templateContent += '</div></div>';
  return templateContent;
};

const createEventEditTemlpate = (event, types, destinations, availableOffers, newEvent) => {
  const {type, destination, offers, startDate, endDate, price, isDisabled, isSaving, isDeleting} = event;
  const destinationData = destinations.find((value) => value.id === destination);
  const availableOffersForType = availableOffers.find((value) => value.type === type);
  const disabled = isDisabled ? 'disabled' : '';
  const deleting = isDeleting ? 'Deleting...' : 'Delete';

  let destinationValueTemplate = '';
  let destinationDescriptionTemplate = '';
  let destinationPhotoTemplate = '';
  if (destinationData) {
    destinationValueTemplate = `value="${destinationData.name}"`;
    destinationDescriptionTemplate = `<h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${destinationData.description}</p>`;
    destinationPhotoTemplate = createPhotoTemplate(destinationData.pictures);
  }
  let rollupButtonTemplate = '';
  let startDateTemplate = '';
  let endDateTemplate = '';
  if (!newEvent) {
    rollupButtonTemplate = `<button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>`;
    startDateTemplate = `value="${dayjs(startDate).format(DATE_FORMAT)}"`;
    endDateTemplate = `value="${dayjs(endDate).format(DATE_FORMAT)}"`;
  }

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${disabled}>

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${createEventTypesTemplate(types, type, isDisabled)}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" ${destinationValueTemplate} list="destination-list-1" ${disabled}>
          <datalist id="destination-list-1">
            ${createDestinationsTemplate(destinations)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" ${startDateTemplate} ${disabled}>
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" ${endDateTemplate} ${disabled}>
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${price}" ${disabled}>
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" ${disabled}>${isSaving ? 'Saving...' : 'Save'}</button>
        <button class="event__reset-btn" type="reset" ${disabled}>${newEvent ? 'Cancel' : deleting}</button>
        ${rollupButtonTemplate}
      </header>
      <section class="event__details">
        ${createOffersTemplate(availableOffersForType, offers, isDisabled)}
        <section class="event__section  event__section--destination">
          ${destinationDescriptionTemplate}
          ${destinationPhotoTemplate}
        </section>
      </section>
    </form>
  </li>`;
};

export default class EventEditView extends AbstractStatefulView {
  #types = null;
  #destinations = null;
  #availableOffers = null;
  #onSubmitClick = null;
  #onCloseClick = null;
  #onDeleteClick = null;
  #datepickerStart = null;
  #datepickerEnd = null;
  #newEvent = false;

  constructor({event, types, destinations, availableOffers, newEvent, onSubmitClick, onCloseClick, onDeleteClick}) {
    super();
    this._setState(EventEditView.parseEventToState(event));
    this.#types = types;
    this.#destinations = destinations;
    this.#availableOffers = availableOffers;
    this.#newEvent = newEvent;
    this.#onSubmitClick = onSubmitClick;
    this.#onCloseClick = onCloseClick;
    this.#onDeleteClick = onDeleteClick;

    this._restoreHandlers();
  }

  get template() {
    return createEventEditTemlpate(
      this._state,
      this.#types,
      this.#destinations,
      this.#availableOffers,
      this.#newEvent);
  }

  removeElement() {
    super.removeElement();

    if (this.#datepickerStart) {
      this.#datepickerStart.destroy();
      this.#datepickerStart = null;
    }
    if (this.#datepickerEnd) {
      this.#datepickerEnd.destroy();
      this.#datepickerEnd = null;
    }
  }

  _restoreHandlers() {
    this.element.querySelector('.event__save-btn').addEventListener('click', this.#submitClickHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteClickHandler);
    this.element.querySelectorAll('.event__type-label').forEach((value) => value.addEventListener('click', this.#typeChangeHandler));
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelectorAll('.event__offer-checkbox').forEach((value) => value.addEventListener('change', this.#offerChangeHandler));
    this.element.querySelector('.event__input--price').addEventListener('change', this.#priceChangeHandler);
    this.#setDatepickers();

    if (!this.#newEvent) {
      this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#closeClickHandler);
    }
  }

  #setDatepickers = () => {
    const [dateStartElement, dateEndElement] = this.element.querySelectorAll('.event__input--time');
    this.#datepickerStart = flatpickr(
      dateStartElement,
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.startDate,
        onClose: this.#dateStartChangeHandler,
        enableTime: true,
        maxDate: this._state.endDate,
        locale: {
          firstDayOfWeek: 1
        },
        'time_24hr': true
      }
    );
    this.#datepickerEnd = flatpickr(
      dateEndElement,
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.endDate,
        onClose: this.#dateEndChangeHandler,
        enableTime: true,
        minDate: this._state.startDate,
        locale: {
          firstDayOfWeek: 1
        },
        'time_24hr': true
      }
    );
  };

  #dateStartChangeHandler = ([userDate]) => {
    this._setState({
      startDate: userDate,
    });
    this.#setDatepickers();
  };

  #dateEndChangeHandler = ([userDate]) => {
    this._setState({
      endDate: userDate,
    });
    this.#setDatepickers();
  };

  #typeChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      type: evt.target.dataset.eventType,
      offers: []
    });
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();
    const destinationData = this.#destinations.find((value) => value.name === he.encode(evt.target.value));
    let destinationId = null;
    if (destinationData) {
      destinationId = destinationData.id;
    } else {
      evt.target.value = '';
    }
    this.updateElement({
      destination: destinationId,
    });
  };

  #offerChangeHandler = (evt) => {
    evt.preventDefault();
    const availableOffers = this.#availableOffers.find((value) => value.type === this._state.type);
    const offer = availableOffers.offers.find((value) => value.id === evt.target.dataset.offerId);
    if (!offer) {
      return;
    }
    let offers = [];
    if (this._state.offers.includes(offer.id)) {
      offers = [...this._state.offers].filter(
        (offerId) => offerId !== offer.id,
      );
    } else {
      offers = [...this._state.offers, offer.id];
    }
    this._setState({offers});
  };

  #priceChangeHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      price: Number(evt.target.value),
    });
  };

  #submitClickHandler = (evt) => {
    evt.preventDefault();

    if (!this._state.price || !this._state.destination || !this._state.startDate || !this._state.endDate) {
      this.shake();
      return;
    }

    this.#onSubmitClick(EventEditView.parseStateToEvent(this._state));
  };

  #closeClickHandler = (evt) => {
    evt.preventDefault();
    this.#onCloseClick();
  };

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#onDeleteClick();
  };

  static parseEventToState(event) {
    return {...event,
      isDisabled: false,
      isSaving: false,
      isDeleting: false};
  }

  static parseStateToEvent(state) {
    const event = {...state};
    delete event.isDisabled;
    delete event.isSaving;
    delete event.isDeleting;
    return event;
  }

}
