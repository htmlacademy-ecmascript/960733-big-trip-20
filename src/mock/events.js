import {getRandomArrayElement, getRandomInteger} from '../utils/common.js';
import {EVENT_TYPES} from '../const.js';
import dayjs from 'dayjs';
import {nanoid} from 'nanoid';

const MIN_PHOTO_INDEX = 1;
const MAX_PHOTO_INDEX = 200;
const MOCK_DATA_QUANTITY = 4;
const MIN_MOCK_ID = 0;
const MIN_PRICE = 10;
const MAX_PRICE = 800;
const MIDDLE_EVENT_PRICE = 400;
const MIN_EVENT_OFFERS = 0;
const MAX_EVENT_OFFERS = 3;

const getDestinationData = (id, title, description) => ({
  id: id,
  title: title,
  description: description,
  photos: [
    {
      src: `https://loremflickr.com/248/152?random=${getRandomInteger(MIN_PHOTO_INDEX, MAX_PHOTO_INDEX)}`,
      description: 'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam'
    },
    {
      src: `https://loremflickr.com/248/152?random=${getRandomInteger(MIN_PHOTO_INDEX, MAX_PHOTO_INDEX)}`,
      description: 'Eu luctus nunc ante ut dui'
    },
    {
      src: `https://loremflickr.com/248/152?random=${getRandomInteger(MIN_PHOTO_INDEX, MAX_PHOTO_INDEX)}`,
      description: 'Sed sed nisi sed augue convallis suscipit in sed felis'
    },
    {
      src: `https://loremflickr.com/248/152?random=${getRandomInteger(MIN_PHOTO_INDEX, MAX_PHOTO_INDEX)}`,
      description: 'Aliquam erat volutpat'
    }
  ]
});

const getDestinations = () => [
  getDestinationData(0, 'Chamonix', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'),
  getDestinationData(1,'Amsterdam', 'Cras aliquet varius magna, non porta ligula feugiat eget.'),
  getDestinationData(2,'Geneva', 'Fusce tristique felis at fermentum pharetra.'),
  getDestinationData(3,'Moscow', 'Aliquam id orci ut lectus varius viverra.')
];

const getOfferData = (id, name, description, price) => ({
  id: id,
  name: name,
  description: description,
  price: price
});

const getOffers = () => {
  const map = new Map();
  map.set('taxi', [
    getOfferData(0, 'uber', 'Order Uber', 20),
    getOfferData(1, 'yandex', 'Order Yandex', 25),
    getOfferData(2, 'car', 'Rent a car', 200)
  ]);
  map.set('bus', [
    getOfferData(0, 'night', 'Night ride', 20),
    getOfferData(1, 'blanket', 'Extra blanket', 30),
    getOfferData(2, 'drinks', 'Add drinks', 100)
  ]);
  map.set('train', [
    getOfferData(0, 'coupe', 'Сoupe train', 200),
    getOfferData(1, 'meal', 'Add meal', 15),
    getOfferData(2, 'luggage', 'Add luggage', 50)
  ]);
  map.set('ship', [
    getOfferData(0, 'ferryboat', 'Ferryboat', 900),
    getOfferData(1, 'transportation', 'Сar transportation', 150),
    getOfferData(2, 'extra', 'Extra luggage', 50)
  ]);
  map.set('drive', [
    getOfferData(0, 'own', 'Own car', 10),
    getOfferData(1, 'truck', 'Rent a truck', 200),
    getOfferData(2, 'fridge', 'Car fridge', 15)
  ]);
  map.set('check-in', [
    getOfferData(0, 'ferryboat', 'Room reserve', 120),
    getOfferData(1, 'bed', 'Extra bed', 150),
    getOfferData(2, 'lunch', 'Lunch', 50)
  ]);
  map.set('flight', [
    getOfferData(0, 'luggage', 'Add luggage', 50),
    getOfferData(1, 'comfort', 'Switch to comfort', 80),
    getOfferData(2, 'meal', 'Add meal', 15),
    getOfferData(3, 'seats', 'Choose seats', 5),
    getOfferData(4, 'train', 'Travel by train', 40)
  ]);
  map.set('sightseeing', [
    getOfferData(0, 'delivery', 'Bus delivery', 120),
    getOfferData(1, 'photograph', 'Photograph', 150),
    getOfferData(2, 'video', 'Copter video', 50)
  ]);
  map.set('restaurant', [
    getOfferData(0, 'chef', 'Meeting the chef', 30),
    getOfferData(1, 'escort', 'Escort', 500),
    getOfferData(2, 'reservation', 'Table reservation', 10)
  ]);
  return map;
};

const getRandomOfferId = () => getRandomInteger(MIN_EVENT_OFFERS, MAX_EVENT_OFFERS - 1);

const getMockEvent = () => {

  const type = getRandomArrayElement(EVENT_TYPES);
  const offers = Array.from(new Set(Array.from({length: getRandomOfferId()}, getRandomOfferId)));
  const randomDate = new Date(
    getRandomInteger(2021, 2024),
    getRandomInteger(1, 12),
    getRandomInteger(1, 28),
    getRandomInteger(0, 23),
    getRandomInteger(0, 59),
    0
  );
  const maxMinutesToAdd = 500;

  return{
    id: nanoid(),
    type: type,
    destination: getRandomInteger(MIN_MOCK_ID, getDestinations().length - 1),
    offers: offers,
    startDate: randomDate,
    endDate: dayjs(randomDate).add(getRandomInteger(1, maxMinutesToAdd), 'minute').$d,
    price: getRandomInteger(MIN_PRICE, MAX_PRICE),
    isFavorite: getRandomInteger(MIN_PRICE, MAX_PRICE) > MIDDLE_EVENT_PRICE
  };
};

const mockEvents = () => Array.from({length: MOCK_DATA_QUANTITY}, getMockEvent);

const getRandomEvent = () => getRandomArrayElement(mockEvents());

export {getRandomEvent};
export {getDestinations};
export {getOffers};
