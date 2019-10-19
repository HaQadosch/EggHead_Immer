import React, { memo } from 'react'
import { IGift, IUser } from './gifts'

interface IGiftProps {
  gift: IGift
  users: IUser[]
  currentUser: IUser
  onReserve: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: IGift['id']) => void
}

export const Gift = memo<IGiftProps>(function Gift ({ gift, users, currentUser, onReserve }) {
  return (
    <article className={ gift.reservedBy ? 'reserved' : '' }>
      <figure>
        <img src={ gift.image } alt={ gift.description } />
        <figcaption>{ gift.description }</figcaption>
      </figure>
      <h3>{ gift.description }</h3>
      <section>
        { !gift.reservedBy
          ? <button onClick={ evt => onReserve(evt, gift.id) }>Reserve</button>
          : gift.reservedBy === currentUser.id
            ? <button onClick={ evt => onReserve(evt, gift.id) }>Unreserve</button>
            : <p>Reserved by { users[gift.reservedBy].name }</p>
        }
      </section>
    </article>
  )
})
