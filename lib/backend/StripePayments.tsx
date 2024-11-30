const stripe = require('stripe')('sk_test_51QLO7eKOt14vzb3befL0Qs4jx7WAWNgEwEUfAHabhjEiHTp6eHjnb0W4YqGEDy6q91hlH2m0swSBS48KnbvkbYm500MBTYx9tU'); // Replace with your Stripe secret key

module.exports = async function (req, res) {
    try {
        // Parse request body
        const { amount, email } = JSON.parse(req.payload);

        // Create a new Stripe Customer
        const customer = await stripe.customers.create({
            email,
            description: 'Customer for CarGo Relay',
        });

        // Create an ephemeral key for the customer
        const ephemeralKey = await stripe.ephemeralKeys.create(
            { customer: customer.id },
            { apiVersion: '2022-11-15' }
        );

        // Create a Payment Intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount, // Amount in cents (e.g., $50 = 5000)
            currency: 'usd',
            customer: customer.id,
            automatic_payment_methods: { enabled: true },
        });

        // Return necessary details to the frontend
        res.json({
            paymentIntent: paymentIntent.client_secret,
            ephemeralKey: ephemeralKey.secret,
            customer: customer.id,
        });
    } catch (error) {
        console.error('Stripe error:', error);
        res.json({ error: error.message });
    }
};
