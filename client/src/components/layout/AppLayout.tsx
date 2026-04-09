import type { PropsWithChildren } from "react";

import { Navbar } from "./Navbar";
import { PageContainer } from "./PageContainer";
import { Sidebar } from "./Sidebar";

export function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-parchment">
      <Navbar />
      <PageContainer className="flex gap-8">
        <Sidebar />
        <main className="min-w-0 flex-1">{children}</main>
      </PageContainer>
    </div>
  );
}
