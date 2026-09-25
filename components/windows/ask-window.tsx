'use client';

import { Chat } from '@/components/chat/chat';

export function AskWindow() {
  return (
    <div className="absolute inset-0">
      <Chat />
    </div>
  );
}
