import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

import { getInitialState, IGift, addGift, NewGift, IState, toggleReservation } from './gifts'
import { Gift } from './Gift'

import uuidv4 from 'uuid/v4'

const App: React.FC = () => {
  const [{ users, gifts, currentUser }, setState] = useState<IState>(() => getInitialState())

  const handleAdd: React.MouseEventHandler<HTMLButtonElement> = () => {
    const description = prompt('Gift to Add')
    if (description) {
      const newGift: NewGift = {
        description,
        id: uuidv4(),
        image: `https://picsum.photos/200?q=${ Math.random() }`,
      }
      setState(state => addGift(state, newGift))
    }
  }

  const handleReserve = (id: IGift['id']): React.MouseEventHandler<HTMLButtonElement> => () => {
    setState(state => toggleReservation(state, id))
  }


  return (
    <div className="App">
      <header className="App-header">
        <img src={ logo } className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <main>
        { currentUser !== null ? (
          <>
            <h2>Hi, { currentUser.name } </h2>
            <aside>
              <button onClick={ handleAdd } >Add</button>
            </aside>
            <ul>
              { gifts.map(gift => (
                <li><Gift key={ gift.id } onReserve={ handleReserve } gift={ gift as IGift } users={ users } currentUser={ currentUser } /></li>
              )) }
            </ul>
          </>
        ) : null }
      </main>
    </div>
  );
}

export default App;
