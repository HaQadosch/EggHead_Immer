import produce, { Draft, produceWithPatches } from 'immer'
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

const giftsRecipe = (draft: Draft<IState>, action: { type: string, payload?: any }) => {
  switch (action.type) {
    case "ADD_BOOK": {
      const { id, description, image } = action.payload
      if (!(id && description && image)) return
      draft.gifts.push({
        id,
        description,
        image,
        reservedBy: undefined
      })
    }
      break
    case "TOGGLE_RESERVATION": {
      const { giftID } = action.payload
      if (!giftID) return
      const gift = draft.gifts.find(gift => gift.id === giftID) as IGift
      gift.reservedBy = gift.reservedBy === undefined ? draft.currentUser.id : gift.reservedBy === draft.currentUser.id ? undefined : gift.reservedBy
    }
      break
    case "ADD_GIFT": {
      const { id, description, image } = action.payload
      if (!(id && description && image)) return
      draft.gifts.push({
        id,
        description,
        image,
        reservedBy: undefined
      })
    }
      break
    case "RESET":
      return getInitialState()
  }
}

// curState, action => newState
export const giftReducer = produce(giftsRecipe)

// curState, action => [newState, patches, inversePatches]
export const patchGeneratingGiftReducer = produceWithPatches(giftsRecipe)

export const getInitialState = (): IState => ({
  users: allUsers,
  currentUser: getCurrentUser() as IUser,
  gifts: defaultGifts as IGift[]
})

export const getBookDetails = async (isbn: string) => {
  const response = await fetch(`http://openlibrary.org/api/books?bibkeys=ISBN:${ isbn }&jscmd=data&format=json`)
  const book = (await response.json())[`ISBN:${ isbn }`]
  return book
}
