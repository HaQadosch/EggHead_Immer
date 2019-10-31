import { IGift, IState, getBookDetails, giftReducer, patchGeneratingGiftReducer } from '../gifts'
import { applyPatches } from 'immer';

const createInitialState = (): IState => ({
  users: [
    { id: 1, name: 'User 1' },
    { id: 2, name: 'User 2' },
  ],
  currentUser: { id: 1, name: 'User 1' },
  gifts: {
    'immer_licence': {
      id: 'immer_licence',
      description: 'Immer Licence',
      image: 'https://raw.githubusercontent.com/immerjs/immer/master/images/immer-logo.png',
      reservedBy: 2
    },
    'egghead_subscription': {
      id: 'egghead_subscription',
      description: 'Egghead.io subscription',
      image: 'https://pbs.twimg.com/profile_images/735242324293210112/H8YfgQHP_400x400.jpg',
      reservedBy: undefined
    }
  }
})

describe('Adding a Gift', () => {
  describe('should add an unreserved gift', () => {
    const initialState = createInitialState()
    const mug: IGift = {
      id: 'mug',
      description: 'coffee mug',
      image: 'image of a mug',
      reservedBy: undefined
    }
    const nextState = giftReducer(initialState, {
      type: "ADD_GIFT",
      payload: mug
    })
    test('should preserve the initial state', () => {
      expect(Object.keys(initialState.gifts)).toHaveLength(2)
    });
    test('should add to the new state', () => {
      expect(Object.keys(nextState.gifts)).toHaveLength(3)
    });
  });
})

describe('Toggle Reservation', () => {

  describe('on an unreserved gift', () => {
    const initialState = createInitialState()
    const nextState = giftReducer(initialState, {
      type: "TOGGLE_RESERVATION",
      payload: { giftID: 'egghead_subscription' }
    })
    test('should preserved the initial state', () => {
      expect(initialState.gifts['egghead_subscription'].reservedBy).toBe(undefined)
    });

    test('should set the current user an the reservedBy', () => {
      expect(nextState.gifts['egghead_subscription'].reservedBy).toBe(1) // currentUser.id
    });

    test('should structurally share unchanged parts of the state tree', () => {
      expect(nextState).not.toBe(initialState)
      expect(nextState.gifts['egghead_subscription']).not.toBe(initialState.gifts['egghead_subscription'])
      expect(nextState.gifts['immer_licence']).toBe(initialState.gifts['immer_licence'])
    });

    test('should not accidentally modify the produced state', () => {
      expect(() => {
        nextState.gifts['egghead_subscription'].reservedBy = undefined
      }).toThrow()
    });
  });

  describe('on a reserved gift', () => {
    const initialState = createInitialState()
    const nextState = giftReducer(initialState, {
      type: "TOGGLE_RESERVATION",
      payload: { giftID: 'immer_licence' }
    })

    test('should preserve stored reservedBy', () => {
      expect(nextState.gifts['immer_licence'].reservedBy).toBe(2) // Id of the user who already reserved it.
    });

    test('should not create new gift', () => {
      expect(nextState.gifts['immer_licence']).toEqual(initialState.gifts['immer_licence'])
      expect(Object.is(nextState, initialState)).toBe(true) // referential identity.
    });
  });
});

describe('Add book', () => {
  it('should add math book', async () => {
    const book: { identifiers: { isbn_10: string[] }, title: string, cover: { medium: string } } = await getBookDetails('0201558025')
    const nextState = giftReducer(createInitialState(), {
      type: "ADD_BOOK",
      payload: {
        id: book.identifiers.isbn_10[0],
        description: book.title,
        image: book.cover.medium,
      }
    })
    expect(nextState.gifts[book.identifiers.isbn_10[0]].description).toBe('Concrete mathematics')
  })

  it('should add two books in parallel', async () => {
    const promise1 = getBookDetails('0201558025')
    const promise2 = getBookDetails('9781598560169')
    const actionBook1 = {
      type: "ADD_BOOK",
      payload: await (async () => {
        const book = await promise1
        return {
          id: book.identifiers.isbn_10[0],
          description: book.title,
          image: book.cover.medium,
        }
      })()
    }

    const actionBook2 = {
      type: "ADD_BOOK",
      payload: await (async () => {
        const book = await promise2
        return {
          id: book.identifiers.isbn_10[0],
          description: book.title,
          image: book.cover.medium,
        }
      })()
    }

    const nextState = [actionBook1, actionBook2].reduce(giftReducer, createInitialState())

    expect(Object.keys(nextState.gifts)).toHaveLength(4)
  });
})

describe('Patches', () => {
  describe('Reserving unreserved gift', () => {
    const initialState = createInitialState()
    const [nextState, patches, invPatches] = patchGeneratingGiftReducer(initialState, {
      type: "TOGGLE_RESERVATION",
      payload: { giftID: 'egghead_subscription' }
    })
    test('should correctly assign ReservedBy', () => {
      expect(nextState.gifts['egghead_subscription'].reservedBy).toBe(1) // currentUser.id
    });
    test('should generate the correct patch', () => {
      expect(patches).toEqual([
        {
          op: 'replace',
          path: ['gifts', 'egghead_subscription', 'reservedBy'],
          value: 1
        }
      ])
    });
    test('should generate the correct inversePatch', () => {
      expect(invPatches).toEqual([
        {
          op: 'replace',
          path: ['gifts', 'egghead_subscription', 'reservedBy'],
          value: undefined
        }
      ])
    });
    test('should produce the same state when replaying patches - 1', () => {
      expect(applyPatches(initialState, patches)).toEqual(nextState)
    });

    test('should produce the same state when replaying patches - 2', () => {
      expect(giftReducer(initialState, {
        type: "APPLY_PATCHES",
        payload: { patches }
      })).toEqual(nextState)
    });

    test('should produce the original state when playing the inverse patches', () => {
      expect(applyPatches(nextState, invPatches)).toEqual(initialState)
    });
  });
})