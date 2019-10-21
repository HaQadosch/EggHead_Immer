import React, { useCallback } from 'react';
import logo from './logo.svg';
import './App.css';
import uuidv4 from 'uuid/v4'
import { useImmer } from 'use-immer'

import { getInitialState, IGift, IState } from './gifts'
import { Gift } from './Gift'


const App: React.FC = () => {
  const [{ users, gifts, currentUser }, updateState] = useImmer<IState>(() => getInitialState())

  const handleAdd: React.MouseEventHandler<HTMLButtonElement> = () => {
    const description = prompt('Gift to Add')
    if (description) {
      updateState(draft => {
        draft.gifts.push({
          description,
          id: uuidv4(),
          image: `https://picsum.photos/200?q=${ Math.random() }`,
          reservedBy: undefined
        })
      })
    }
  }

  const handleReserve = useCallback((event: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: IGift['id']) => {
    updateState(draft => {
      const gift = draft.gifts.find(gift => gift.id === id) as IGift
      gift.reservedBy = gift.reservedBy === undefined ? draft.currentUser.id : gift.reservedBy === draft.currentUser.id ? undefined : gift.reservedBy
    })
  }, [updateState])

  const handleReset: React.MouseEventHandler<HTMLButtonElement> = () => {
    updateState(draft => {
      return getInitialState()
    })
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
              <button onClick={ handleReset } >Reset</button>
            </aside>
            <ul>
              { gifts.map(gift => (
                <li key={ gift.id }><Gift key={ gift.description } onReserve={ handleReserve } gift={ gift as IGift } users={ users } currentUser={ currentUser } /></li>
              )) }
            </ul>
          </>
        ) : null }
      </main>
    </div>
  );
}

export default App;
