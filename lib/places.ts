export type Category = 'food' | 'clothes' | 'fun' | 'sport'

export type Place = {
  id: string
  name: string
  address: string
  discount: string
  note: string
  conditions: string[]
  category: Category
  image: string
  coords: [number, number]
}

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'food', label: 'Еда' },
  { id: 'clothes', label: 'Одежда' },
  { id: 'fun', label: 'Развлечения' },
  { id: 'sport', label: 'Спорт' },
]

export const CATEGORY_LABEL: Record<Category, string> = {
  food: 'Еда',
  clothes: 'Одежда',
  fun: 'Развлечения',
  sport: 'Спорт',
}

export const MAP_CENTER: [number, number] = [55.7558, 37.6173]

export const PLACES: Place[] = [
  {
    id: 'zerno',
    name: 'Кофейня «Зерно»',
    address: 'ул. Мясницкая, 24/7',
    discount: '−20%',
    note: 'На все напитки по студенческому',
    conditions: [
      'Покажите действующий студенческий билет на кассе',
      'Скидка действует на все напитки меню',
      'Не суммируется с картой лояльности',
    ],
    category: 'food',
    image: '/places/coffee.png',
    coords: [55.7627, 37.6363],
  },
  {
    id: 'burger-lab',
    name: 'Burger Lab',
    address: 'ул. Покровка, 17',
    discount: '−15%',
    note: 'Комбо-обеды в будни до 16:00',
    conditions: [
      'Только комбо-обеды с понедельника по пятницу',
      'Действует до 16:00',
      'Нужен студенческий билет или зачётка',
    ],
    category: 'food',
    image: '/places/burger.png',
    coords: [55.7593, 37.6455],
  },
  {
    id: 'basic-store',
    name: 'Basic Store',
    address: 'ул. Тверская, 12',
    discount: '−10%',
    note: 'На новую коллекцию',
    conditions: [
      'Распространяется на товары новой коллекции',
      'Не действует на товары со скидкой',
      'Предъявите студенческий билет до оплаты',
    ],
    category: 'clothes',
    image: '/places/clothing.png',
    coords: [55.7637, 37.6067],
  },
  {
    id: 'sneakerhead',
    name: 'Sneakerhead',
    address: 'ул. Арбат, 31',
    discount: '−25%',
    note: 'На кроссовки прошлых сезонов',
    conditions: [
      'Только кроссовки из коллекций прошлых сезонов',
      'Одна пара на один студенческий в месяц',
      'Возрастное ограничение: до 25 лет',
    ],
    category: 'clothes',
    image: '/places/sneakers.png',
    coords: [55.7497, 37.5915],
  },
  {
    id: 'kino-oktyabr',
    name: 'Кинотеатр «Кадр»',
    address: 'ул. Новый Арбат, 24',
    discount: '−30%',
    note: 'Билеты на сеансы до 18:00',
    conditions: [
      'Сеансы, начинающиеся до 18:00',
      'Покупка только в кассе кинотеатра',
      'Не действует на премьеры в первые выходные',
    ],
    category: 'fun',
    image: '/places/cinema.png',
    coords: [55.7524, 37.5878],
  },
  {
    id: 'strike',
    name: 'Strike Bowling',
    address: 'Комсомольский пр-т, 28',
    discount: '−40%',
    note: 'Дорожка в будние дни',
    conditions: [
      'Аренда дорожки с понедельника по четверг',
      'Бронирование заранее по телефону',
      'Студенческий нужен у каждого в компании',
    ],
    category: 'fun',
    image: '/places/bowling.png',
    coords: [55.7285, 37.5825],
  },
  {
    id: 'pulse-gym',
    name: 'Pulse Gym',
    address: 'ул. Бауманская, 35',
    discount: '−35%',
    note: 'Студенческий абонемент на 3 месяца',
    conditions: [
      'Абонемент на 3 месяца с безлимитным посещением',
      'Студенты очной формы обучения',
      'Посещение с 7:00 до 17:00',
    ],
    category: 'sport',
    image: '/places/gym.png',
    coords: [55.7722, 37.6788],
  },
  {
    id: 'boulder-hub',
    name: 'Boulder Hub',
    address: 'ул. Большая Ордынка, 40',
    discount: '−20%',
    note: 'Разовое посещение и прокат',
    conditions: [
      'Разовое посещение и прокат скальных туфель',
      'Обязательный инструктаж для новичков',
      'Действует в любой день недели',
    ],
    category: 'sport',
    image: '/places/climbing.png',
    coords: [55.7356, 37.6247],
  },
]
