import SortView from '../view/sort-view.js';
import EventListView from '../view/events-list-view.js';
import {render, remove} from '../framework/render.js';
import NoEventView from '../view/no-event-view.js';
import EventPresenter from '../presenter/event-presenter.js';
import {sortByDate, sortByTime, sortByPrice} from '../utils/sort.js';
import {SortType} from '../const.js';
import {UserAction, UpdateType, FilterType, EmptyEvent} from '../const.js';
import {filter} from '../utils/filter.js';
import LoadingView from '../view/loading-view.js';
import LoadingErrorView from '../view/loading-error-view.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

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
  #loadingComponent = new LoadingView();
  #loadingErrorComponent = new LoadingErrorView();
  #isLoading = true;
  #isLoadingError = false;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

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
    this.#renderSort();
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }
    if (!this.#eventsModel.events.length) {
      this.#renderNoEvent();
      return;
    }
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

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this.#eventPresenters.get(update.id).setSaving();
        try {
          await this.#eventsModel.updateEvent(updateType, update);
        } catch(err) {
          this.#eventPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_EVENT:
        this.#newEventPresenter.setSaving();
        try {
          await this.#eventsModel.addEvent(updateType, update);
        } catch(err) {
          this.#newEventPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_EVENT:
        this.#eventPresenters.get(update.id).setDeleting();
        try {
          await this.#eventsModel.deleteEvent(updateType, update);
        } catch(err) {
          this.#eventPresenters.get(update.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
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
      case UpdateType.INIT:
        this.#isLoadingError = data.isError;
        this.#isLoading = false;
        remove(this.#loadingComponent);
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

  #renderLoading() {
    render(this.#loadingComponent, this.#container);
  }

  #renderErrorLoading() {
    render(this.#loadingErrorComponent, this.#container);
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
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }
    if (this.#isLoadingError) {
      this.#renderErrorLoading();
      return;
    }
    render(this.#eventListView, this.#container);
    if (!this.events.length) {
      this.#renderNoEvent();
      return;
    }
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
    if (this.#loadingComponent) {
      remove(this.#loadingComponent);
    }
    if (this.#noEventView) {
      remove(this.#noEventView);
    }
    this.#newEventPresenter.resetView();
  }

  #clearSort() {
    if (this.#sortView) {
      remove(this.#sortView);
    }
  }

}
