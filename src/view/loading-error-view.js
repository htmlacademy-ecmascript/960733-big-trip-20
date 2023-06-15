import AbstractView from '../framework/view/abstract-view.js';

const createLoadingErrorTemplate = () => '<p class="trip-events__msg trip-events__msg-error">Error loading data!</p>';

export default class LoadingErrorView extends AbstractView {
  get template() {
    return createLoadingErrorTemplate();
  }
}
