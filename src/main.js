import EventListPresenter from './presenter/event-list-presenter.js';
import EventInfoPresenter from './presenter/event-info-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import EventsModel from './model/event-model.js';
import FilterModel from './model/filter-model.js';
import NewEventButtonView from './view/new-event-button-view.js';
import {render} from './framework/render.js';
import EventsApiService from './events-api-service.js';

const AUTHORIZATION = 'Basic jsks83jkcvnpqlak9';
const END_POINT = 'https://20.ecmascript.pages.academy/big-trip';

const eventListElement = document.querySelector('.trip-events');
const eventInfoElement = document.querySelector('.trip-main');
const filterElement = document.querySelector('.trip-controls__filters');

const eventInfoPresenter = new EventInfoPresenter(
  {container: eventInfoElement}
);

const eventsModel = new EventsModel({
  eventsApiService: new EventsApiService(END_POINT, AUTHORIZATION)
});
const filterModel = new FilterModel();

const filterPresenter = new FilterPresenter({
  container: filterElement,
  filterModel,
  eventsModel
});

const eventListPresenter = new EventListPresenter({
  container: eventListElement,
  filterModel,
  eventsModel,
  onNewEventDestroy: handleNewEventFormClose
});

const newEventButtonComponent = new NewEventButtonView({
  onClick: handleNewEventButtonClick
});

function handleNewEventFormClose() {
  newEventButtonComponent.element.disabled = false;
}

function handleNewEventButtonClick() {
  eventListPresenter.createEvent();
  newEventButtonComponent.element.disabled = true;
}

eventInfoPresenter.init();
filterPresenter.init();
eventListPresenter.init();
eventsModel.init().finally(() => {
  if (eventsModel.isInitError) {
    newEventButtonComponent.setDisabled();
  }
  render(newEventButtonComponent, eventInfoElement);
});
