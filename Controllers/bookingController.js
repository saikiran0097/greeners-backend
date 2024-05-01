import User from '../models/UserSchema.js';
import Greener from '../models/GreenerSchema.js';
import Booking from '../models/BookingSchema.js';
import Stripe from 'stripe';


export const getCheckoutSession = async (req, res) => {
    try {


        const greener = await Greener.findById(req.params.greenerId);
        const user = await User.findById(req.userId);

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            success_url: `${process.env.CLIENT_SITE_URL}/checkout-success`,
            cancel_url: `${req.protocol}://${req.get('host')}/greeners/${greener.id}`,
            patient_email: user.email,
            client_reference_id: req.params.greenerId,
            line_items: [
                {
                    price_data: {
                        currency: 'bdt',
                        unit_amount: greener.ticketPrice * 100,
                        product_data: {
                            name: greener.name,
                            description: greener.bio,
                            images: [greener.photo]
                        }
                    },
                    quantity: 1
                }
            ]
        });

        const booking = new Booking({
            greener: greener._id,
            user: user._id,
            ticketPrice: greener.ticketPrice,
            session: session.id,
        });

        await booking.save();

        res.status(200).json({ success: true, message: "Successfully paid", session })
    } catch (err) {
        res.status(500).json({ success: false, message: "Error creating checkout session" })

    }
}