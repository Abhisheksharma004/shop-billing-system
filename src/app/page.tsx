import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Inventory Management System</h1>
        <p className="text-lg mb-8 text-gray-600">Manage your shop inventory efficiently</p>
        
        <div className="space-x-4">
          <Link 
            href="/register" 
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Register
          </Link>
          <Link 
            href="/login" 
            className="inline-block px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    </main>
  )
}
