import { IGift, IState, addBook, getBookDetails, addGiftCur, toggleReservationCur } from '../gifts'

const createInitialState = (): IState => ({
  users: [
    { id: 1, name: 'User 1' },
    { id: 2, name: 'User 2' },
  ],
  currentUser: { id: 1, name: 'User 1' },
  gifts: [
    {
      id: 'immer_licence',
      description: 'Immer Licence',
      image: 'https://raw.githubusercontent.com/immerjs/immer/master/images/immer-logo.png',
      reservedBy: 2
    },
    {
      id: 'egghead_subscription',
      description: 'Egghead.io subscription',
      image: 'https://pbs.twimg.com/profile_images/735242324293210112/H8YfgQHP_400x400.jpg',
      reservedBy: undefined
    },
  ]
})

describe('addGiftCur', () => {
  describe('should add an unreserved gift', () => {
    const initialState = createInitialState()
    const mug: IGift = {
      id: 'mug',
      description: 'coffee mug',
      image: 'image of a mug',
      reservedBy: undefined
    }
    const nextState = addGiftCur(initialState, mug)
    test('should preserve the initial state', () => {
      expect(initialState.gifts).toHaveLength(2)
    });
    test('should add to the new state', () => {
      expect(nextState.gifts).toHaveLength(3)
    });
  });
})

describe('toggleReservationCur', () => {

  describe('on an unreserved gift', () => {
    const initialState = createInitialState()
    const nextState = toggleReservationCur(initialState, 'egghead_subscription')
    test('should preserved the initial state', () => {
      expect(initialState.gifts[1].reservedBy).toBe(undefined)
    });

    test('should set the current user an the reservedBy', () => {
      expect(nextState.gifts[1].reservedBy).toBe(1) // currentUser.id
    });

    test('should structurally share unchanged parts of the state tree', () => {
      expect(nextState).not.toBe(initialState)
      expect(nextState.gifts[1]).not.toBe(initialState.gifts[1])
      expect(nextState.gifts[0]).toBe(initialState.gifts[0])
    });

    test('should not accidentally modify the produced state', () => {
      expect(() => {
        nextState.gifts[1].reservedBy = undefined
      }).toThrow()
    });
  });

  describe('on a reserved gift', () => {
    const initialState = createInitialState()
    const nextState = toggleReservationCur(initialState, 'immer_licence')

    test('should preserve stored reservedBy', () => {
      expect(nextState.gifts[0].reservedBy).toBe(2) // Id of the user who already reserved it.
    });

    test('should not create new gift', () => {
      expect(nextState.gifts[0]).toEqual(initialState.gifts[0])
      expect(Object.is(nextState, initialState)).toBe(true) // referential identity.
    });
  });
});

describe('addBook', () => {
  it('should add math book', async () => {
    const nextState = await addBook(createInitialState(), await getBookDetails('0201558025'))
    expect(nextState.gifts[2].description).toBe('Concrete mathematics')
  })

  it('should add two books in parallel', async () => {
    const promise1 = getBookDetails('0201558025')
    const promise2 = getBookDetails('9781598560169')
    const nextState = addBook(addBook(createInitialState(), await promise1), await promise2)

    expect(nextState.gifts).toHaveLength(4)
  });
})