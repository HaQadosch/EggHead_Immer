import React, { useCallback, useReducer } from 'react';
import logo from './logo.svg';
import './App.css';
import uuidv4 from 'uuid/v4'

import { getInitialState, IGift, getBookDetails, giftReducer, IUser } from './gifts'
import { Gift } from './Gift'

export const App: React.FC = () => {
  const [{ users, gifts, currentUser }, dispatch] = useReducer(giftReducer, getInitialState())

  const handleAdd: React.MouseEventHandler<HTMLButtonElement> = () => {
    const description = prompt('Gift to Add')
    if (description) {
      dispatch({
        type: "ADD_GIFT",
        payload: {
          description,
          id: uuidv4(),
          image: `https://picsum.photos/200?q=${ Math.random() }`,
        }
      })
    }
  }

  const handleReserve = useCallback((event: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: IGift['id']) => {
    dispatch({
      type: "TOGGLE_RESERVATION",
      payload: { giftID: id }
    })
  }, [dispatch])

  const handleReset: React.MouseEventHandler<HTMLButtonElement> = () => {
    dispatch({
      type: "RESET"
    })
  }

  const handleBook: React.MouseEventHandler<HTMLButtonElement> = async () => {
    const isbn = prompt('Enter ISBN Number, like 0201558025')
    if (isbn) {
      const book: { identifiers: { isbn_10: string[] }, title: string, cover: { medium: string } } = await getBookDetails(isbn)
      dispatch({
        type: "ADD_BOOK",
        payload: {
          id: book.identifiers.isbn_10[0],
          description: book.title,
          image: book.cover.medium,
        }
      })
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={ logo } className="App-logo" alt="logo" />
      </header>
      <main>
        { currentUser !== null ? (
          <>
            <h2>Hi, { currentUser.name } </h2>
            <aside>
              <button onClick={ handleAdd } >Add</button>
              <button onClick={ handleBook } >Add Book</button>
              <button onClick={ handleReset } >Reset</button>
            </aside>
            <ul>
              { (gifts as IGift[]).map((gift: IGift) => (
                <li key={ gift.id }><Gift key={ gift.description } onReserve={ handleReserve } gift={ gift as IGift } users={ users as IUser[] } currentUser={ currentUser } /></li>
              )) }
            </ul>
          </>
        ) : null }
      </main>
    </div>
  );
}
