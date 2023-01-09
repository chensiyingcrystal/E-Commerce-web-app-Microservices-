import Stripe from 'stripe';

//create an instance of stripe library
export const stripe = new Stripe(process.env.STRIPE_KEY!, {
    apiVersion: '2022-11-15',
    
});