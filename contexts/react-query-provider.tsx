/**
 * React Query provider stub (passthrough).
 * Later: wrap with QueryClientProvider from @tanstack/react-query
 * (see pilot-dashboard/contexts).
 */
export function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
