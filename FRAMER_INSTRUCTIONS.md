# Solución CORS para Framer - Stripe Checkout

## 🚀 Código para tu componente en Framer

Copia este código completo en un nuevo Code Component en Framer:

```typescript
import React, { useState, useEffect } from "react"
import { addPropertyControls, ControlType } from "framer"

interface TicketPurchaseProps {
    productId: string
    apiUrl: string
}

export default function TicketPurchase({ productId, apiUrl }: TicketPurchaseProps) {
    const [quantity, setQuantity] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [iframeKey, setIframeKey] = useState(0)

    useEffect(() => {
        // Escuchar mensajes del iframe
        const handleMessage = (event: MessageEvent) => {
            // Verificar que el mensaje viene de nuestro iframe
            if (event.data.type === 'stripe-checkout-success' && event.data.url) {
                // Redirigir a Stripe Checkout
                window.location.href = event.data.url
            } else if (event.data.type === 'stripe-checkout-error') {
                setIsSubmitting(false)
                alert(`Error: ${event.data.error}`)
            }
        }

        window.addEventListener('message', handleMessage)
        return () => window.removeEventListener('message', handleMessage)
    }, [])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (quantity > 0) {
            setIsSubmitting(true)
            
            // Crear un nuevo iframe para cada sumisión
            setIframeKey(prev => prev + 1)
            
            // Esperar un momento para que el iframe se cree antes de submitir
            setTimeout(() => {
                const form = document.getElementById('stripe-form') as HTMLFormElement
                if (form) {
                    form.submit()
                }
            }, 100)
        }
    }

    return (
        <div style={{ 
            display: "flex", 
            flexDirection: "column",
            gap: "20px", 
            alignItems: "center",
            padding: "20px",
            backgroundColor: "white",
            borderRadius: "10px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
        }}>
            <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "bold" }}>
                Comprar Boletos
            </h2>
            
            <div style={{ 
                display: "flex", 
                gap: "15px", 
                alignItems: "center" 
            }}>
                <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={isSubmitting}
                    style={{ 
                        width: "40px",
                        height: "40px",
                        fontSize: "20px",
                        border: "2px solid #333",
                        borderRadius: "8px",
                        background: isSubmitting ? "#ccc" : "#fff",
                        cursor: isSubmitting ? "not-allowed" : "pointer"
                    }}
                >
                    -
                </button>
                
                <div style={{ 
                    fontSize: "28px",
                    fontWeight: "bold",
                    minWidth: "60px",
                    textAlign: "center"
                }}>
                    {quantity}
                </div>
                
                <button 
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={isSubmitting}
                    style={{ 
                        width: "40px",
                        height: "40px",
                        fontSize: "20px",
                        border: "2px solid #333",
                        borderRadius: "8px",
                        background: isSubmitting ? "#ccc" : "#fff",
                        cursor: isSubmitting ? "not-allowed" : "pointer"
                    }}
                >
                    +
                </button>
            </div>
            
            {/* Formulario oculto que se sumite al iframe */}
            <form 
                id="stripe-form"
                action={apiUrl}
                method="POST"
                target={`hidden-iframe-${iframeKey}`}
                style={{ display: 'none' }}
            >
                <input type="hidden" name="productId" value={productId} />
                <input type="hidden" name="quantity" value={quantity.toString()} />
            </form>
            
            {/* Iframe oculto para recibir la respuesta */}
            <iframe 
                key={iframeKey}
                name={`hidden-iframe-${iframeKey}`}
                style={{ display: 'none' }}
            />
            
            <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                style={{ 
                    padding: "15px 40px",
                    fontSize: "18px",
                    fontWeight: "600",
                    border: "none",
                    borderRadius: "8px",
                    background: isSubmitting ? "#ccc" : "#5469d4",
                    color: "#fff",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    width: "100%",
                    maxWidth: "300px"
                }}
            >
                {isSubmitting ? "Procesando..." : `Comprar ${quantity} boleto${quantity > 1 ? 's' : ''}`}
            </button>
            
            {isSubmitting && (
                <p style={{ fontSize: "14px", color: "#666", margin: 0 }}>
                    Conectando con Stripe...
                </p>
            )}
        </div>
    )
}

// Property controls para Framer
addPropertyControls(TicketPurchase, {
    productId: {
        type: ControlType.String,
        title: "Product ID",
        defaultValue: "prod_TPzuxri29L8rNC",
    },
    apiUrl: {
        type: ControlType.String,
        title: "API URL",
        defaultValue: "https://tienda-stripe-demo.vercel.app/api/create-checkout-session-form",
    }
})
```

## 📝 Configuración en Framer

1. Crea un nuevo **Code Component** en Framer
2. Pega el código completo
3. En las propiedades del componente configura:
   - **Product ID**: `prod_TPzuxri29L8rNC` (o tu producto)
   - **API URL**: `https://tienda-stripe-demo.vercel.app/api/create-checkout-session-form`

## 🎯 ¿Cómo funciona?

1. **Sin CORS**: Usa un formulario HTML nativo que se envía a un iframe oculto
2. **Comunicación**: El servidor responde con HTML que envía un mensaje JavaScript
3. **Redirección**: Framer recibe el mensaje y redirige a Stripe Checkout

## ⚡ Importante

- Usa el endpoint `/api/create-checkout-session-form` (NO el endpoint JSON)
- Este endpoint acepta `form-data` en lugar de JSON
- No requiere configuración de CORS

## 🧪 Prueba con cURL

```bash
curl -X POST https://tienda-stripe-demo.vercel.app/api/create-checkout-session-form \
  -d "productId=prod_TPzuxri29L8rNC" \
  -d "quantity=3"
```
