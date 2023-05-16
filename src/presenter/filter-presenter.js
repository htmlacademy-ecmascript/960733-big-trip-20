import FilterView from '../view/filter-view.js';
import {render} from '../framework/render.js';
import {generateFilter} from '../mock/filter.js';

export default class FilterPresenter {
  #container = null;
  #filters = null;

  constructor({container, eventsModel}) {
    this.#container = container;
    this.#filters = generateFilter(eventsModel.events);
  }

  init() {
    render(new FilterView({filters: this.#filters}), this.#container);
  }
}
