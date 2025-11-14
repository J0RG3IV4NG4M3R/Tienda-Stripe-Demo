export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-4xl bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Stripe Payment API
        </h1>
        <p className="text-gray-600 mb-8">
          Dos endpoints para crear sesiones de checkout con Stripe.
        </p>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Endpoint JSON */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-3 text-blue-900">
              1. API JSON (con CORS issues)
            </h2>
            <code className="block bg-gray-800 text-green-400 p-3 rounded mb-4 text-sm">
              POST /api/create-checkout-session
            </code>
            <div className="bg-white rounded p-3">
              <p className="text-sm font-medium mb-2">Body (JSON):</p>
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
{`{
  "productId": "prod_xxxxx",
  "quantity": 1
}`}
              </pre>
            </div>
          </div>
          
          {/* Endpoint Form */}
          <div className="bg-green-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-3 text-green-900">
              2. API Form (sin CORS! 🎉)
            </h2>
            <code className="block bg-gray-800 text-green-400 p-3 rounded mb-4 text-sm">
              POST /api/create-checkout-session-form
            </code>
            <div className="bg-white rounded p-3">
              <p className="text-sm font-medium mb-2">Body (form-data):</p>
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
{`productId=prod_xxxxx
quantity=1`}
              </pre>
            </div>
            <div className="mt-3 p-3 bg-green-100 rounded">
              <p className="text-xs text-green-800 font-medium">
                ✅ Usa este endpoint con Framer para evitar CORS
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-semibold text-yellow-900 mb-2">
            🔧 Solución para Framer:
          </h3>
          <p className="text-sm text-yellow-800">
            Usa el endpoint <code className="bg-yellow-100 px-2 py-1 rounded">/api/create-checkout-session-form</code> 
            con un iframe oculto para burlar las restricciones CORS de Framer.
          </p>
        </div>
      </div>
    </main>
  )
}
