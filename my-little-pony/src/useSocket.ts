import { useRef, useEffect, useCallback } from "react";
import { Patch } from 'immer'
import { IncomingMessage } from "http";

/**
 *   const send = useSocket('ws://localhost:5001', (patches: Patch[]) => {
    console.log('We received an owl!', { patches })
    setState(state => giftReducer(state, {
      type: "APPLY_PATCHES",
      payload: { patches }
    }))
  })
 */
export function useSocket (url: string, onMessage: any) {
  const socket = useRef<WebSocket>()
  const msgHandler = useRef<any>()

  msgHandler.current = onMessage

  useEffect(() => {
    const createdSocket = new WebSocket(url)
    createdSocket.onmessage = evt => {
      console.log('createdSocket.onmessage', { evt })
      const data: IncomingMessage = JSON.parse(evt.data)
      msgHandler.current(data)
    }

    socket.current = createdSocket
    console.log(`created socket to ${ url }`)

    return () => {
      console.log('socket disconnected')
      createdSocket.close()
    }
  }, [url])

  return useCallback((data: Patch[]) => {
    console.log({ data })
    socket.current && socket.current.send(JSON.stringify(data))
  }, [])
}
