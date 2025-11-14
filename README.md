# Stripe Payment API

Endpoint simple para crear sesiones de checkout con Stripe.

## Desplegar en Vercel

1. **Sube el proyecto a GitHub**

2. **Conecta con Vercel**
   - Ve a [vercel.com](https://vercel.com)
   - Importa el proyecto desde GitHub

3. **Configura las variables de entorno en Vercel:**
   ```
   STRIPE_SECRET_KEY=sk_test_51RoOeMB2HcGskUOfBl2xZemYwUtH4GByvgddNlyhbXgHm7PLrpUngUpfLPQRPWAs6uYrmZB7Dje83ahZIG4TiMhA00ZkRjz4Av
   ```

4. **Deploy!**

## Uso del API

```bash
curl -X POST https://tu-app.vercel.app/api/create-checkout-session \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "prod_xxxxx",
    "quantity": 1
  }'
```

**Respuesta:**
```json
{
  "url": "https://checkout.stripe.com/..."
}
```

## Notas
- El endpoint acepta CORS desde cualquier origen
- Las URLs de success y cancel están hardcodeadas en el código
- Asegúrate de usar productos válidos de tu cuenta de Stripe