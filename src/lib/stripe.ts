import { env } from "@/env";
import Stripe from "stripe";

export const stripeApiClient = new Stripe(env.STRIPE_SECRET_KEY);
