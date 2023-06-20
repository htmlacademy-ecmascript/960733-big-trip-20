import EventItemView from '../view/event-item-view.js';
import EventEditView from '../view/event-edit-view.js';
import {render, replace, remove, RenderPosition} from '../framework/render.js';
import {UserAction, UpdateType} from '../const.js';

export default class EventPresenter {
  #container = null;
  #event = null;
  #types = null;
  #destinations = null;
  #availableOffers = null;
  #editMode = false;
  #newEvent = false;
  #eventsModel = false;

  #itemEdit = null;
  #itemView = null;

  #handleEventChange = null;
  #handleModeChange = null;
  #handleNewEventDestroy = null;

  constructor({container, onEventChange, onModeChange, onNewEventDestroy}) {
    this.#container = container;
    this.#handleEventChange = onEventChange;
    this.#handleModeChange = onModeChange;
    this.#handleNewEventDestroy = onNewEventDestroy;
  }

  init({event, eventsModel, newEvent = false}) {
    this.#event = event;
    this.#eventsModel = eventsModel;
    this.#types = [...this.#eventsModel.types];
    this.#destinations = [...this.#eventsModel.destinations];
    this.#availableOffers = this.#eventsModel.offers;
    this.#newEvent = newEvent;

    const prevItemView = this.#itemView;
    const prevItemEdit = this.#itemEdit;

    this.#itemEdit = this.#newEventEditView();

    this.#itemView = new EventItemView({
      event: this.#event,
      types: this.#types,
      destinations: this.#destinations,
      availableOffers: this.#availableOffers,
      onEditClick: this.#itemEditClickHandler,
      onFavoriteClick: this.#handleFavoriteClick,
    });

    if (this.#newEvent) {
      render(this.#itemEdit, this.#container, RenderPosition.AFTERBEGIN);
      return;
    }
    if (prevItemView === null || prevItemEdit === null) {
      render(this.#itemView, this.#container);
      return;
    }
    if (this.#editMode) {
      replace(this.#itemEdit, prevItemEdit);
    } else {
      replace(this.#itemView, prevItemView);
    }

    remove(prevItemView);
    remove(prevItemEdit);
  }

  destroy() {
    remove(this.#itemView);
    remove(this.#itemEdit);
  }

  resetView() {
    if (this.#editMode) {
      this.#replaceItemEditToView();
    }
    if (this.#newEvent) {
      this.#handleNewEventDestroy();
      this.destroy();
    }
  }

  setSaving() {
    this.#itemEdit.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setDeleting() {
    this.#itemEdit.updateElement({
      isDisabled: true,
      isDeleting: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#itemEdit.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    if (this.#editMode || this.#newEvent) {
      this.#itemEdit.shake(resetFormState);
      return;
    }
    this.#itemView.shake(resetFormState);
  }

  #replaceItemViewToEdit () {
    replace(this.#itemEdit, this.#itemView);
    this.#handleModeChange();
    this.#editMode = true;
  }

  #replaceItemEditToView () {
    replace(this.#itemView, this.#itemEdit);
    this.#editMode = false;
  }

  #newEventEditView () {
    if (this.#newEvent) {
      document.addEventListener('keydown', this.#escKeyDownHandler);
    }
    return new EventEditView({
      event: this.#event,
      types: this.#types,
      destinations: this.#destinations,
      availableOffers: this.#availableOffers,
      newEvent: this.#newEvent,
      onSubmitClick: this.#itemSubmitClickHandler,
      onCloseClick: this.#itemCloseClickHandler,
      onDeleteClick:this.#handleDeleteClick
    });
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      if (this.#newEvent) {
        this.resetView();
      } else {
        this.#replaceItemEditToView();
      }
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #itemEditClickHandler = () => {
    this.#replaceItemViewToEdit();
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #itemSubmitClickHandler = (evt) => {
    if (this.#newEvent) {
      this.#handleEventChange(
        UserAction.ADD_EVENT,
        UpdateType.MAJOR,
        evt);
    } else {
      this.#handleEventChange(
        UserAction.UPDATE_EVENT,
        UpdateType.MAJOR,
        evt);
    }
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #itemCloseClickHandler = () => {
    this.#replaceItemEditToView();
    remove(this.#itemEdit);
    this.#itemEdit = this.#newEventEditView();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleFavoriteClick = () => {
    this.#handleEventChange(
      UserAction.UPDATE_EVENT,
      UpdateType.MINOR,
      {...this.#event, isFavorite: !this.#event.isFavorite},
    );
  };

  #handleDeleteClick = () => {
    if (this.#newEvent) {
      this.#handleNewEventDestroy();
    } else {
      this.#handleEventChange(
        UserAction.DELETE_EVENT,
        UpdateType.MAJOR,
        this.#event);
      return;
    }
    this.destroy();
  };

}
