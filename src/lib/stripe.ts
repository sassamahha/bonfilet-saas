// src/lib/stripe.ts — Workers 対応の Stripe クライアント
import Stripe from "stripe";

export function getStripe(secretKey: string) {
  return new Stripe(secretKey, {
    httpClient: Stripe.createFetchHttpClient(),
  });
}

export function getWebCrypto() {
  return Stripe.createSubtleCryptoProvider();
}
