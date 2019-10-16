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
  return {
    ...state,
    gifts: [
      ...state.gifts,
      { id, description, image, reservedBy: undefined }
    ]
  }
}

export const toggleReservation = (state: IState, giftID: IGift['id']): IState => {
  return {
    ...state,
    gifts: state.gifts.map(gift => {
      if (gift.id !== giftID) return gift

      return {
        ...gift,
        reservedBy: gift.reservedBy === undefined ? state.currentUser.id : gift.reservedBy === state.currentUser.id ? undefined : gift.reservedBy
      }
    })
  }
}