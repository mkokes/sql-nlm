'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Database, MessageSquare, FileText } from 'lucide-react';

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <Database className="h-6 w-6" />
            <span className="font-bold inline-block">SQL-LLM</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-4">
            <Link
              href="/chat"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === '/chat' ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>Chat</span>
              </div>
            </Link>
            <Link
              href="/schemas"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === '/schemas' ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              <div className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>Schemas</span>
              </div>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
