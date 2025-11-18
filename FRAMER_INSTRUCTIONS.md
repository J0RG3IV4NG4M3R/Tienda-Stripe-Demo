# Solución CORS para Framer - Stripe Checkout

## 🚀 Código COMPLETO para tu componente en Framer

Copia este código completo en un nuevo Code Component en Framer:

```typescript
import React, { useState, useEffect } from "react"
import { addPropertyControls, ControlType } from "framer"

interface TicketPurchaseProps {
    productId: string
    apiUrl: string
    successUrl: string
    cancelUrl: string
    requireAttendeeNames: boolean
}

export default function TicketPurchase({ 
    productId, 
    apiUrl, 
    successUrl, 
    cancelUrl,
    requireAttendeeNames 
}: TicketPurchaseProps) {
    const [quantity, setQuantity] = useState(1)
    const [attendeeNames, setAttendeeNames] = useState<string[]>([''])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [iframeKey, setIframeKey] = useState(0)
    const [showForm, setShowForm] = useState(false)

    useEffect(() => {
        // Escuchar mensajes del iframe
        const handleMessage = (event: MessageEvent) => {
            if (event.data.type === 'stripe-checkout-success' && event.data.url) {
                window.location.href = event.data.url
            } else if (event.data.type === 'stripe-checkout-error') {
                setIsSubmitting(false)
                alert(`Error: ${event.data.error}`)
            }
        }

        window.addEventListener('message', handleMessage)
        return () => window.removeEventListener('message', handleMessage)
    }, [])

    // Actualizar array de nombres cuando cambia la cantidad
    useEffect(() => {
        const newNames = [...attendeeNames]
        while (newNames.length < quantity) {
            newNames.push('')
        }
        while (newNames.length > quantity) {
            newNames.pop()
        }
        setAttendeeNames(newNames)
    }, [quantity])

    const handleNameChange = (index: number, value: string) => {
        const newNames = [...attendeeNames]
        newNames[index] = value
        setAttendeeNames(newNames)
    }

    const validateForm = () => {
        if (requireAttendeeNames) {
            const emptyNames = attendeeNames.filter(name => !name.trim())
            if (emptyNames.length > 0) {
                alert('Por favor ingresa todos los nombres de los asistentes')
                return false
            }
        }
        return true
    }

    const handleContinue = () => {
        if (requireAttendeeNames && quantity > 0) {
            setShowForm(true)
        } else {
            submitForm()
        }
    }

    const submitForm = () => {
        if (!validateForm()) return
        
        setIsSubmitting(true)
        setIframeKey(prev => prev + 1)
        
        setTimeout(() => {
            const form = document.getElementById('stripe-form') as HTMLFormElement
            if (form) {
                form.submit()
            }
        }, 100)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        submitForm()
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
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            maxWidth: "400px",
            margin: "0 auto"
        }}>
            <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "bold" }}>
                Comprar Boletos
            </h2>
            
            {!showForm ? (
                <>
                    {/* Selector de cantidad */}
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

                    <button
                        onClick={handleContinue}
                        disabled={isSubmitting || quantity === 0}
                        style={{ 
                            padding: "15px 40px",
                            fontSize: "18px",
                            fontWeight: "600",
                            border: "none",
                            borderRadius: "8px",
                            background: isSubmitting || quantity === 0 ? "#ccc" : "#5469d4",
                            color: "#fff",
                            cursor: isSubmitting || quantity === 0 ? "not-allowed" : "pointer",
                            width: "100%"
                        }}
                    >
                        {requireAttendeeNames ? "Continuar" : (isSubmitting ? "Procesando..." : `Comprar ${quantity} boleto${quantity > 1 ? 's' : ''}`)}
                    </button>
                </>
            ) : (
                <>
                    {/* Formulario de nombres */}
                    <button
                        onClick={() => setShowForm(false)}
                        style={{
                            alignSelf: "flex-start",
                            background: "none",
                            border: "none",
                            color: "#5469d4",
                            cursor: "pointer",
                            fontSize: "14px",
                            padding: "0",
                            textDecoration: "underline"
                        }}
                    >
                        ← Volver
                    </button>

                    <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600", width: "100%" }}>
                        Nombres de los asistentes
                    </h3>
                    
                    <div style={{ width: "100%", maxHeight: "300px", overflowY: "auto" }}>
                        {attendeeNames.map((name, index) => (
                            <div key={index} style={{ marginBottom: "15px" }}>
                                <label style={{ 
                                    display: "block", 
                                    marginBottom: "5px",
                                    fontSize: "14px",
                                    color: "#666"
                                }}>
                                    Boleto {index + 1}
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => handleNameChange(index, e.target.value)}
                                    placeholder={`Nombre del asistente ${index + 1}`}
                                    style={{
                                        width: "100%",
                                        padding: "10px",
                                        border: "1px solid #ddd",
                                        borderRadius: "5px",
                                        fontSize: "16px"
                                    }}
                                />
                            </div>
                        ))}
                    </div>

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
                            width: "100%"
                        }}
                    >
                        {isSubmitting ? "Procesando..." : `Comprar ${quantity} boleto${quantity > 1 ? 's' : ''}`}
                    </button>
                </>
            )}
            
            {/* Formulario oculto */}
            <form 
                id="stripe-form"
                action={apiUrl}
                method="POST"
                target={`hidden-iframe-${iframeKey}`}
                style={{ display: 'none' }}
            >
                <input type="hidden" name="productId" value={productId} />
                <input type="hidden" name="quantity" value={quantity.toString()} />
                <input type="hidden" name="successUrl" value={successUrl} />
                <input type="hidden" name="cancelUrl" value={cancelUrl} />
                {attendeeNames.map((name, index) => (
                    <input 
                        key={index}
                        type="hidden" 
                        name={`attendeeName${index}`} 
                        value={name} 
                    />
                ))}
            </form>
            
            <iframe 
                key={iframeKey}
                name={`hidden-iframe-${iframeKey}`}
                style={{ display: 'none' }}
            />
            
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
    },
    successUrl: {
        type: ControlType.String,
        title: "Success URL",
        defaultValue: "https://tuapp.com/success",
        description: "URL a donde redirigir después del pago exitoso"
    },
    cancelUrl: {
        type: ControlType.String,
        title: "Cancel URL",
        defaultValue: "https://tuapp.com/cancel",
        description: "URL a donde redirigir si se cancela el pago"
    },
    requireAttendeeNames: {
        type: ControlType.Boolean,
        title: "Pedir nombres",
        defaultValue: true,
        description: "Solicitar nombres de los asistentes antes del pago"
    }
})
```

## 📝 Configuración en Framer

1. Crea un nuevo **Code Component** en Framer
2. Pega el código completo
3. En las propiedades del componente configura:
   - **Product ID**: `prod_TPzuxri29L8rNC` (o tu producto)
   - **API URL**: `https://tienda-stripe-demo.vercel.app/api/create-checkout-session-form`
   - **Success URL**: `https://tuapp.com/success` (tu página de éxito)
   - **Cancel URL**: `https://tuapp.com/cancel` (tu página de cancelación)
   - **Pedir nombres**: Activar/desactivar si quieres los nombres de los asistentes

## 🎯 ¿Cómo funciona?

1. **Sin CORS**: Usa un formulario HTML nativo que se envía a un iframe oculto
2. **Comunicación**: El servidor responde con HTML que envía un mensaje JavaScript
3. **Redirección**: Framer recibe el mensaje y redirige a Stripe Checkout

## 📊 Datos que se guardan en Stripe

Los nombres de los asistentes se guardan en los **metadata** del pago en Stripe:
- `attendeeNames`: Lista completa de nombres separados por comas
- `attendee_1`, `attendee_2`, etc.: Cada nombre individual
- `quantity`: Cantidad de boletos

Puedes ver estos datos en el Dashboard de Stripe en cada pago.

## ⚡ Importante

- Usa el endpoint `/api/create-checkout-session-form` (NO el endpoint JSON)
- Este endpoint acepta `form-data` en lugar de JSON
- No requiere configuración de CORS

## 🧪 Prueba con cURL (con nombres)

```bash
curl -X POST https://tienda-stripe-demo.vercel.app/api/create-checkout-session-form \
  -d "productId=prod_TPzuxri29L8rNC" \
  -d "quantity=3" \
  -d "attendeeName0=Juan Pérez" \
  -d "attendeeName1=María García" \
  -d "attendeeName2=Carlos López" \
  -d "successUrl=https://ejemplo.com/gracias" \
  -d "cancelUrl=https://ejemplo.com/cancelado"
```
