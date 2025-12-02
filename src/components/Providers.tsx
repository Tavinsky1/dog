"use client";

import { SessionProvider } from "next-auth/react";
import { ToastProvider, ToastContainer } from "./Toast";
import type { Session } from "next-auth";

interface ProvidersProps {
  children: React.ReactNode;
  session?: Session | null;
}

export default function Providers({ children, session }: ProvidersProps) {
  return (
    <SessionProvider 
      session={session}
      refetchOnWindowFocus={true} 
      refetchInterval={0}
      refetchWhenOffline={false}
    >
      <ToastProvider>
        {children}
        <ToastContainer />
      </ToastProvider>
    </SessionProvider>
  );
}

