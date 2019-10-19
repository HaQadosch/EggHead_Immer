import { IUser, IGift, IState, addGift, toggleReservation } from '../gifts'

const initialState: IState = {
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
}

describe('addGift', () => {
  describe('should add an unreserved gift', () => {
    const mug: IGift = {
      id: 'mug',
      description: 'coffee mug',
      image: 'image of a mug',
      reservedBy: undefined
    }
    const nextState = addGift(initialState, mug)
    test('should preserve the initial state', () => {
      expect(initialState.gifts).toHaveLength(2)
    });
    test('should add to the new state', () => {
      expect(nextState.gifts).toHaveLength(3)
    });
  });
})

describe('toggleReservation', () => {

  describe('on an unreserved gift', () => {
    const nextState = toggleReservation(initialState, 'egghead_subscription')
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
  });

  test('on a reserved gift', () => {
    const nextState = toggleReservation(initialState, 'immer_licence')
    expect(nextState.gifts[0].reservedBy).toBe(2) // Id of the user who already reserved it.
  });
});