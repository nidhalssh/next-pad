'use client'
import { useEffect, useState } from "react"
import * as Y from 'yjs'
import { WebsocketProvider } from "y-websocket"

export type connectionStatus = 'connecting' | 'connected' | 'disconnected';

export function useYjsEditor(roomID: string) {
  const [status, setStatus] = useState<connectionStatus>('connecting')

  const [session] = useState(() => {
    if (typeof window === 'undefined' || !roomID) return null;
    const doc = new Y.Doc()
    const yText = doc.getText('codemirror')
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:1234"
    const provider = new WebsocketProvider(wsUrl, roomID, doc, { connect: false })
    return { doc, yText, provider }
  })

  useEffect(() => {
    if (!session) return;
    const { provider } = session;

    const handleStatus = (event: { status: connectionStatus }) => {
      setStatus(event.status)
    }

    provider.on('status', handleStatus)
    provider.connect()

    return () => {
      provider.off('status', handleStatus)
      provider.disconnect()
    }
  }, [session])

  return {
    yText: session?.yText ?? null,
    awareness: session?.provider.awareness ?? null,
    status
  }
}
