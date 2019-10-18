import React from 'react'
import { IGift, IUser } from './gifts'

interface IGiftProps {
  gift: IGift
  users: IUser[]
  currentUser: IUser
}

export const Gift: React.FC<IGiftProps> = ({ gift, users, currentUser }) => {
  return (
    <article className={ gift.reservedBy ? 'reserved' : '' }>
      <figure>
        <img src={ gift.image } alt={ gift.description } />
        <caption>{ gift.description }</caption>
      </figure>
      <h3>{ gift.description }</h3>
      <section>
        { !gift.reservedBy
          ? <button>Reserve</button>
          : gift.reservedBy === currentUser.id
            ? <button>Unreserve</button>
            : <p>Reserved by { users[gift.reservedBy].name }</p>
        }
      </section>
    </article>
  )
}
