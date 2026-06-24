export default function ProfileSkeleton() {
  return (
    <div className="min-h-screen animate-pulse bg-muted/20">
      <div className="max-w-md mx-auto px-4 py-12 space-y-6">
        <div className="h-24 w-24 rounded-full bg-muted mx-auto" />
        <div className="h-8 bg-muted rounded w-48 mx-auto" />
        <div className="h-4 bg-muted rounded w-64 mx-auto" />
        <div className="space-y-3 pt-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="h-9 bg-muted rounded w-48 mb-2" />
          <div className="h-5 bg-muted rounded w-64" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-10 bg-muted rounded" />
            <div className="h-96 bg-muted rounded-lg" />
          </div>
          <div className="h-80 bg-muted rounded-lg" />
        </div>
      </div>
    </div>
  );
}
