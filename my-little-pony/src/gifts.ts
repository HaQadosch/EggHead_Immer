import produce, { Draft } from 'immer'
import { allUsers, getCurrentUser } from './users'
import defaultGifts from './assets/gifts.json'

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

export type NewGift = Pick<IGift, 'id' | 'description' | 'image'>

export const addGift = (state: IState, { id, description, image }: NewGift): IState => {
  return produce(state, draft => {
    draft.gifts.push({ id, description, image, reservedBy: undefined })
  })
}

export const addGiftCur = produce((draft: Draft<IState>, { id, description, image }: NewGift) => {
  draft.gifts.push({ id, description, image, reservedBy: undefined })
})

export const toggleReservation = (state: IState, giftID: IGift['id']): IState => {
  return produce(state, draft => {
    const gift = draft.gifts.find(gift => gift.id === giftID) as IGift
    gift.reservedBy = gift.reservedBy === undefined ? state.currentUser.id : gift.reservedBy === state.currentUser.id ? undefined : gift.reservedBy
  })
}

export const toggleReservationCur = produce((draft: Draft<IState>, giftID: IGift['id']) => {
  const gift = draft.gifts.find(gift => gift.id === giftID) as IGift
  gift.reservedBy = gift.reservedBy === undefined ? draft.currentUser.id : gift.reservedBy === draft.currentUser.id ? undefined : gift.reservedBy
})

export const getInitialState = (): IState => ({
  users: allUsers,
  currentUser: getCurrentUser() as IUser,
  gifts: defaultGifts as IGift[]
})