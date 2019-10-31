import React, { useCallback, useState, useRef } from 'react';
import logo from './logo.svg';
import './App.css';
import uuidv4 from 'uuid/v4'

import { getInitialState, IGift, IGifts, getBookDetails, IUser, patchGeneratingGiftReducer, giftReducer } from './gifts'
import { Gift } from './Gift'
import { useSocket } from './useSocket';
import { Patch } from 'immer';

export const App: React.FC = () => {
  const [{ users, gifts, currentUser }, setState] = useState(() => getInitialState())
  const undoStack = useRef<{ patches: Patch[]; invPatches: Patch[]; }[]>([])
  const undoStackPointer = useRef<number>(-1)

  const send = useSocket('ws://localhost:5001', (patches: Patch[]) => {
    console.log('We received an owl!', { patches })
    setState(state => giftReducer(state, {
      type: "APPLY_PATCHES",
      payload: { patches }
    }))
  })

  const dispatch = useCallback((action, undoable = true) => {
    setState(currentState => {
      const [nextState, patches, invPatches] = patchGeneratingGiftReducer(currentState, action)
      send(patches)
      if (undoable) {
        const pointer = ++undoStackPointer.current
        undoStack.current.length = pointer
        undoStack.current[pointer] = { patches, invPatches }
      }
      return nextState
    })
  }, [send])

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

  const handleUndo = () => {
    if (undoStackPointer.current < 0) return

    const patches = undoStack.current[undoStackPointer.current].invPatches
    undoStackPointer.current--
    dispatch({ type: "APPLY_PATCHES", payload: { patches } }, false)
  }

  const handleRedo = () => {
    if (undoStackPointer.current >= undoStack.current.length) return

    undoStackPointer.current++
    const patches = undoStack.current[undoStackPointer.current].patches
    dispatch({ type: "APPLY_PATCHES", payload: { patches } }, false)
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
              <button onClick={ handleUndo } disabled={ undoStackPointer.current < 0 } >Undo</button>
              <button onClick={ handleRedo } disabled={ undoStackPointer.current >= undoStack.current.length } >Redo</button>
            </aside>
            <ul>
              { Object.values(gifts as IGifts).map((gift: IGift) => (
                <li key={ gift.id }><Gift key={ gift.description } onReserve={ handleReserve } gift={ gift as IGift } users={ users as IUser[] } currentUser={ currentUser } /></li>
              )) }
            </ul>
          </>
        ) : null }
      </main>
    </div>
  );
}
