import EventListPresenter from './presenter/event-list-presenter.js';
import EventInfoPresenter from './presenter/event-info-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import EventsModel from './model/event-model.js';

const eventListElement = document.querySelector('.trip-events');
const eventInfoElement = document.querySelector('.trip-main');
const filterElement = document.querySelector('.trip-controls__filters');

const eventInfoPresenter = new EventInfoPresenter(
  {container: eventInfoElement}
);

const filterPresenter = new FilterPresenter({container: filterElement});

const eventsModel = new EventsModel();

const eventListPresenter = new EventListPresenter({
  container: eventListElement,
  eventsModel
});

eventInfoPresenter.init();
filterPresenter.init();
eventListPresenter.init();
