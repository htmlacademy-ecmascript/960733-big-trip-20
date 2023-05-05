import {getRandomArrayElement, getRandomInteger} from '../utils.js';

const MIN_PHOTO_INDEX = 1;
const MAX_PHOTO_INDEX = 200;

const mockEvents = [
  {
    type: 0,
    destination: 0,
    offers: [1, 2],
    startDate: new Date('2023-01-01T13:25:00'),
    endDate: new Date('2023-01-01T20:10:00'),
    price: 100,
    isFavorite: true
  },
  {
    type: 4,
    destination: 1,
    offers: [0],
    startDate: new Date('2023-03-02T15:00:00'),
    endDate: new Date('2023-03-02T16:15:00'),
    price: 25,
    isFavorite: true
  },
  {
    type: 5,
    destination: 2,
    offers: [2, 3],
    startDate: new Date('2023-03-02T15:20:00'),
    endDate: new Date('2023-03-02T17:15:00'),
    price: 750,
    isFavorite: false
  },
  {
    type: 8,
    destination: 3,
    offers: [0, 1],
    startDate: new Date('2023-04-06T10:00:00'),
    endDate: new Date('2023-04-06T12:15:00'),
    price: 250,
    isFavorite: true
  }
];

const getRandomEvent = () => getRandomArrayElement(mockEvents);

const getDestinationData = (title, description) => ({
  title: title,
  description: description,
  photos: [
    `https://loremflickr.com/248/152?random=${getRandomInteger(MIN_PHOTO_INDEX, MAX_PHOTO_INDEX)}`,
    `https://loremflickr.com/248/152?random=${getRandomInteger(MIN_PHOTO_INDEX, MAX_PHOTO_INDEX)}`,
    `https://loremflickr.com/248/152?random=${getRandomInteger(MIN_PHOTO_INDEX, MAX_PHOTO_INDEX)}`
  ]
});

const getDestinations = () => [
  getDestinationData('Chamonix', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'),
  getDestinationData('Amsterdam', 'Cras aliquet varius magna, non porta ligula feugiat eget.'),
  getDestinationData('Geneva', 'Fusce tristique felis at fermentum pharetra.'),
  getDestinationData('Moscow', 'Aliquam id orci ut lectus varius viverra.')
];

const getOfferData = (id, description, price) => ({
  id: id,
  description: description,
  price: price
});

const getOffers = () => {
  const map = new Map();
  map.set('taxi', [
    getOfferData('uber', 'Order Uber', 20),
    getOfferData('yandex', 'Order Yandex', 25),
    getOfferData('car', 'Rent a car', 200)
  ]);
  map.set('drive', [
    getOfferData('own', 'Own car', 10),
    getOfferData('truck', 'Rent a truck', 200)
  ]);
  map.set('flight', [
    getOfferData('luggage', 'Add luggage', 50),
    getOfferData('comfort', 'Switch to comfort', 80),
    getOfferData('meal', 'Add meal', 15),
    getOfferData('seats', 'Choose seats', 5),
    getOfferData('train', 'Travel by train', 40)
  ]);
  map.set('restaurant', [
    getOfferData('chef', 'Meeting the chef', 30),
    getOfferData('escort', 'Escort', 500),
    getOfferData('reservation', 'Table reservation', 10)
  ]);
  return map;
};

export {getRandomEvent};
export {getDestinations};
export {getOffers};
