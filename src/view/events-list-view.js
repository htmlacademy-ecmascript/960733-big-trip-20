import AbstractView from '../framework/view/abstract-view.js';

const createEventListTemlpate = () => '<ul class="trip-events__list">';

export default class EventListView extends AbstractView {
  get template() {
    return createEventListTemlpate();
  }
}
