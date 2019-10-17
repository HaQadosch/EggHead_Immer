import produce from 'immer'

export interface IUser {
  id: number
  name: string
}

export interface IGift {
  id: string
  description: string
  image: string
  reservedBy: IUser['id'] | undefined
}

export interface IState {
  users: IUser[],
  currentUser: IUser,
  gifts: IGift[]
}

export const addGift = (state: IState, { id, description, image }: Pick<IGift, 'id' | 'description' | 'image'>): IState => {
  return produce(state, draft => {
    draft.gifts.push({ id, description, image, reservedBy: undefined })
  })
}

export const toggleReservation = (state: IState, giftID: IGift['id']): IState => {
  return produce(state, draft => {
    const gift = draft.gifts.find(gift => gift.id === giftID) as IGift
    gift.reservedBy = gift.reservedBy === undefined ? state.currentUser.id : gift.reservedBy === state.currentUser.id ? undefined : gift.reservedBy
  })
}
