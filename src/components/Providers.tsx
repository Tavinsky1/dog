"use client";

import { SessionProvider } from "next-auth/react";
import { ToastProvider, ToastContainer } from "./Toast";

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <ToastProvider>
        {children}
        <ToastContainer />
      </ToastProvider>
    </SessionProvider>
  );
}

