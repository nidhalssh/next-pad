'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// 1. Defend against Next.js SSR compilation errors for browser-only APIs
const EditorWorkspace = dynamic(
  () => import('./EditorWorkspace'),
  { ssr: false, loading: () => <div className="p-4 text-zinc-400">Loading editor engine...</div> }
);   // removed promise callbacks switching to default export function

interface CollaborativeEditorProps {
  roomId: string;
}

export function CollaborativeEditor({ roomId }: CollaborativeEditorProps) {
  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    const randomId = Math.floor(Math.random() * 1000);
    setUsername(`Dev_${randomId}`);
  }, []);

  return (
    <div className="w-full h-full flex flex-col bg-zinc-950 text-white">
      {/* Header Panel */}
      <header className="p-4 border-b border-zinc-800 flex justify-between items-center">
        <h1 className="text-sm font-semibold tracking-wider text-zinc-300">
          ROOM ID: <span className="text-cyan-400 font-mono">{roomId}</span>
        </h1>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-zinc-400 font-mono">{username} (You)</span>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <div className="flex-1 w-full overflow-hidden">
        <EditorWorkspace roomId={roomId} username={username} />
      </div>
    </div>
  );
}
