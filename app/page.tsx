export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Stripe Payment API
        </h1>
        <p className="text-gray-600 mb-6">
          Este es un endpoint simple para crear sesiones de checkout con Stripe.
        </p>
        
        <div className="bg-gray-100 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-3">Endpoint:</h2>
          <code className="block bg-gray-800 text-green-400 p-3 rounded">
            POST /api/create-checkout-session
          </code>
        </div>
        
        <div className="bg-gray-100 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-3">Body (JSON):</h2>
          <pre className="bg-gray-800 text-green-400 p-3 rounded overflow-x-auto">
{`{
  "productId": "prod_xxxxx",
  "quantity": 1
}`}
          </pre>
        </div>
        
        <div className="mt-6 text-sm text-gray-500">
          <p>Respuesta: URL de checkout de Stripe</p>
        </div>
      </div>
    </main>
  )
}
