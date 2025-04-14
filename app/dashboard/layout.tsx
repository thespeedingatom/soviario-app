import React from "react";

// Next.js App Router parallel routes: the slot for @metrics is passed as a prop named "metrics"
export default function DashboardLayout({
  children,
  metrics,
}: {
  children: React.ReactNode;
  metrics: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {children}
        {/* Parallel metrics panel */}
        <section className="mt-8">
          {metrics}
        </section>
      </main>
    </div>
  );
}

// For Next.js App Router, you may also export named slots if needed:
// export const dynamic = 'force-static'; // or 'auto' as needed
