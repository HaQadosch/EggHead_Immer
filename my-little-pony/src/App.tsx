import React from 'react';
import logo from './logo.svg';
import './App.css';

import { getInitialState, IGift } from './gifts'
import { Gift } from './Gift'

const App: React.FC = () => {
  const { users, gifts, currentUser } = getInitialState()

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
              <button>Add</button>
            </aside>
            <ul>
              { gifts.map(gift => (
                <li><Gift key={ gift.id } gift={ gift as IGift } users={ users } currentUser={ currentUser } /></li>
              )) }
            </ul>
          </>
        ) : null }
      </main>
    </div>
  );
}

export default App;
