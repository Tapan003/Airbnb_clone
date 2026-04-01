import { createContext, useContext } from 'react'
import { loadStripe } from '@stripe/stripe-js'

const StripeContext = createContext()

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_key_here')

export function StripeProvider({ children }) {
    return (
        <StripeContext.Provider value={{ stripePromise }}>
            {children}
        </StripeContext.Provider>
    )
}

export const useStripe = () => useContext(StripeContext)