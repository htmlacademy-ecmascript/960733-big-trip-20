import SortView from '../view/sort-view.js';
import EventListView from '../view/events-list-view.js';
import {render} from '../framework/render.js';
import NoEventView from '../view/no-event-view.js';
import EventPresenter from '../presenter/event-presenter.js';
import {updateItem} from '../utils/common.js';

export default class EventListPresenter {
  #eventListView = new EventListView();
  #container = null;
  #eventsModel = null;
  #sortView = new SortView();
  #noEventView = new NoEventView();
  #events = null;
  #eventPresenters = new Map();

  constructor({container, eventsModel}) {
    this.#container = container;
    this.#eventsModel = eventsModel;
  }

  init() {
    this.#events = [...this.#eventsModel.events];

    if (!this.#events.length) {
      this.#renderNoEvent();
      return;
    }
    this.#renderSort();
    this.#renderEvents();
  }

  #handleEventChange = (updatedEvent) => {

    this.#events = updateItem(this.#events, updatedEvent);
    this.#eventPresenters.get(updatedEvent.id).init({
      event: updatedEvent,
      eventsModel: this.#eventsModel
    });
  };

  #handleModeChange = () => {
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  };

  #renderNoEvent() {
    render(this.#noEventView, this.#container);
  }

  #renderSort() {
    render(this.#sortView, this.#container);
  }

  #renderEvents() {
    render(this.#eventListView, this.#container);
    this.#events.forEach((event) => this.#renderEvent(event));
  }

  #renderEvent(event) {
    const eventPresenter = new EventPresenter({
      container: this.#eventListView.element,
      onEventChange: this.#handleEventChange,
      onModeChange: this.#handleModeChange
    });
    eventPresenter.init({
      event,
      eventsModel: this.#eventsModel
    });
    this.#eventPresenters.set(event.id, eventPresenter);
  }

  #clearEventList() {
    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters.clear();
  }
}
