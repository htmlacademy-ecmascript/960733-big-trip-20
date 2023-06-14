import ApiService from './framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

export default class EventsApiService extends ApiService {
  get events() {
    return this._load({url: 'points'})
      .then(ApiService.parseResponse);
  }

  get destinations() {
    return this._load({url: 'destinations'})
      .then(ApiService.parseResponse);
  }

  get offers() {
    return this._load({url: 'offers'})
      .then(ApiService.parseResponse);
  }

  async updateEvent(event) {
    const response = await this._load({
      url: `points/${event.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(event)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  #adaptToServer(event) {
    const adaptedEvent = {...event,
      'date_from': event.startDate instanceof Date ? event.startDate.toISOString() : null,
      'date_to': event.endDate instanceof Date ? event.endDate.toISOString() : null,
      'is_favorite': event.isFavorite,
      'base_price': Number(event.price),
    };

    delete adaptedEvent.startDate;
    delete adaptedEvent.endDate;
    delete adaptedEvent.isFavorite;
    delete adaptedEvent.price;

    return adaptedEvent;
  }
}
