import Stripe from 'stripe'

const test = "sk_test_51NPvhDDUROMHXXHb5rNGxa0rh4zB4NRwSVUZVo2rdWRTPZuvPWlmOMlozVrDK9EOtHXUG8vEfWRwm8JU1bzr4knt00gAXBIxFm"

export const stripe = new Stripe(process.env.STRIPE_KEY!,{
    apiVersion: "2022-11-15"
});