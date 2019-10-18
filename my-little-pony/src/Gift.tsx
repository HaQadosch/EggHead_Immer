import React from 'react'
import { IGift, IUser } from './gifts'

interface IGiftProps {
  gift: IGift
  users: IUser[]
  currentUser: IUser
  onReserve: (id: IGift['id']) => React.MouseEventHandler<HTMLButtonElement>
}

export const Gift: React.FC<IGiftProps> = ({ gift, users, currentUser, onReserve }) => {

  return (
    <article className={ gift.reservedBy ? 'reserved' : '' }>
      <figure>
        <img src={ gift.image } alt={ gift.description } />
        <caption>{ gift.description }</caption>
      </figure>
      <h3>{ gift.description }</h3>
      <section>
        { !gift.reservedBy
          ? <button onClick={ onReserve(gift.id) }>Reserve</button>
          : gift.reservedBy === currentUser.id
            ? <button onClick={ onReserve(gift.id) }>Unreserve</button>
            : <p>Reserved by { users[gift.reservedBy].name }</p>
        }
      </section>
    </article>
  )
}
