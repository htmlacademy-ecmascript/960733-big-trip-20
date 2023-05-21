import EventItemView from '../view/event-item-view.js';
import EventEditView from '../view/event-edit-view.js';
import {render, replace, remove} from '../framework/render.js';

export default class EventPresenter {
  #container = null;
  #event = null;
  #types = null;
  #destinations = null;
  #availableOffers = null;

  #itemEdit = null;
  #itemView = null;

  #handleEventChange = null;

  constructor({container, onEventChange}) {
    this.#container = container;
    this.#handleEventChange = onEventChange;
  }

  init({event, eventsModel}) {
    this.#event = event;
    this.#types = [...eventsModel.types];
    this.#destinations = [...eventsModel.destinations];
    this.#availableOffers = eventsModel.offers;

    const prevItemView = this.#itemView;
    const prevItemEdit = this.#itemEdit;

    this.#itemEdit = new EventEditView({
      event: this.#event,
      types: this.#types,
      destinations: this.#destinations,
      availableOffers: this.#availableOffers,
      onSubmitClick: this.#itemSubmitClickHandler,
      onCloseClick: this.#itemCloseClickHandler
    });

    this.#itemView = new EventItemView({
      event: this.#event,
      types: this.#types,
      destinations: this.#destinations,
      availableOffers: this.#availableOffers,
      onEditClick: this.itemEditClickHandler,
      onFavoriteClick: this.#handleFavoriteClick,
    });

    if (prevItemView === null || prevItemEdit === null) {
      render(this.#itemView, this.#container);
      return;
    }

    if (this.#container.contains(prevItemView.element)) {
      replace(this.#itemView, prevItemView);
    }

    if (this.#container.contains(prevItemEdit.element)) {
      replace(this.#itemEdit, prevItemEdit);
    }

    remove(prevItemView);
    remove(prevItemEdit);
  }

  destroy() {
    remove(this.#itemView);
    remove(this.#itemEdit);
  }

  #replaceItemViewToEdit () {
    replace(this.#itemEdit, this.#itemView);
  }

  #replaceItemEditToView () {
    replace(this.#itemView, this.#itemEdit);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceItemEditToView();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  itemEditClickHandler = () => {
    this.#replaceItemViewToEdit();
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #itemSubmitClickHandler = (event) => {
    this.#handleEventChange(event);
    this.#replaceItemEditToView();
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #itemCloseClickHandler = () => {
    this.#replaceItemEditToView();
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleFavoriteClick = () => {
    this.#event.isFavorite = !this.#event.isFavorite;
    this.#handleEventChange(this.#event);
  };

}
