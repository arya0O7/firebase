'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons';
import { motion } from 'framer-motion';

export function UserHeader() {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-card/80 backdrop-blur-sm border-b sticky top-0 z-50"
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold font-headline text-primary">
            <Logo className="h-8 w-8" />
            <span>PharmaFind AI</span>
          </Link>
          <nav>
            <Button asChild variant="ghost">
              <Link href="/admin">Admin Dashboard</Link>
            </Button>
          </nav>
        </div>
      </div>
    </motion.header>
  );
}
