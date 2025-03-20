export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <div className="h-10 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-5 w-72 mt-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </header>

        <main>
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="h-7 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 w-64 mt-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            
            <div className="p-6">
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
            <div className="h-7 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        </main>

        <footer className="mt-12 text-center">
          <div className="h-4 w-64 mx-auto bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </footer>
      </div>
    </div>
  );
}