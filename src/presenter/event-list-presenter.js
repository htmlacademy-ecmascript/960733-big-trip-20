import SortView from '../view/sort-view.js';
import EventListView from '../view/events-list-view.js';
import {render, remove} from '../framework/render.js';
import NoEventView from '../view/no-event-view.js';
import EventPresenter from '../presenter/event-presenter.js';
import {sortByDate, sortByTime, sortByPrice} from '../utils/sort.js';
import {SortType} from '../const.js';
import {UserAction, UpdateType, FilterType, EmptyEvent} from '../const.js';
import {filter} from '../utils/filter.js';

export default class EventListPresenter {
  #eventListView = new EventListView();
  #container = null;
  #eventsModel = null;
  #filterModel = null;
  #sortView = null;
  #noEventView = null;
  #eventPresenters = new Map();
  #newEventPresenter = null;
  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;

  constructor({container, filterModel, eventsModel, onNewEventDestroy}) {
    this.#container = container;
    this.#eventsModel = eventsModel;
    this.#filterModel = filterModel;
    this.#filterType = this.#filterModel.filter;

    this.#newEventPresenter = new EventPresenter({
      container: this.#eventListView.element,
      onEventChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
      onNewEventDestroy
    });

    this.#eventsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  init() {
    if (!this.#eventsModel.events.length) {
      this.#renderNoEvent();
      return;
    }
    this.#renderSort();
    this.#renderEvents();
  }

  createEvent () {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newEventPresenter.init({
      event: EmptyEvent,
      eventsModel: this.#eventsModel,
      newEvent: true});
  }

  get events() {
    this.#filterType = this.#filterModel.filter;
    const events = this.#eventsModel.events;
    const filteredEvents = filter[this.#filterType](events);

    switch (this.#currentSortType) {
      case SortType.DAY:
        return filteredEvents.sort(sortByDate);
      case SortType.TIME:
        return filteredEvents.sort(sortByTime);
      case SortType.PRICE:
        return filteredEvents.sort(sortByPrice);
    }
    return filteredEvents;
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this.#eventsModel.updateEvent(updateType, update);
        break;
      case UserAction.ADD_EVENT:
        this.#eventsModel.addEvent(updateType, update);
        break;
      case UserAction.DELETE_EVENT:
        this.#eventsModel.deleteEvent(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    if (this.#filterType !== this.#filterModel.filter) {
      this.#currentSortType = SortType.DAY;
    }
    switch (updateType) {
      case UpdateType.MINOR:
        this.#eventPresenters.get(data.id).init({
          event: data,
          eventsModel: this.#eventsModel
        });
        break;
      case UpdateType.MAJOR:
        this.#clearSort();
        this.#renderSort();
        this.#clearEventList();
        this.#renderEvents();
        break;
    }
  };

  #handleModeChange = () => {
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
    this.#newEventPresenter.resetView();
  };

  #renderNoEvent() {
    this.#noEventView = new NoEventView({
      filterType: this.#filterType
    });
    render(this.#noEventView, this.#container);
  }

  #renderSort() {
    this.#sortView = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });
    render(this.#sortView, this.#container);
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearEventList();
    this.#renderEvents();
  };

  #renderEvents() {
    if (!this.events.length) {
      this.#renderNoEvent();
      return;
    }
    render(this.#eventListView, this.#container);
    this.events.forEach((event) => this.#renderEvent(event));
  }

  #renderEvent(event) {
    const eventPresenter = new EventPresenter({
      container: this.#eventListView.element,
      onEventChange: this.#handleViewAction,
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
    if (this.#noEventView) {
      remove(this.#noEventView);
    }
  }

  #clearSort() {
    if (this.#sortView) {
      remove(this.#sortView);
    }
  }

}
