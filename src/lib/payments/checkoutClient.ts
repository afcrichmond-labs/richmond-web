const PAYMENT_TIMEOUT_MS = 10_000;
const MAX_RETRIES = 2;
const RETRY_BACKOFF_BASE = 1000;

export async function processPayment(paymentData: PaymentData): Promise<PaymentResult> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), PAYMENT_TIMEOUT_MS);

      const response = await fetch("/api/v2/checkout/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentData),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new PaymentError(`Payment failed: ${response.status}`, response.status);
      }

      return await response.json();
    } catch (error) {
      lastError = error as Error;

      if (attempt < MAX_RETRIES) {
        const backoff = RETRY_BACKOFF_BASE * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, backoff));
      }
    }
  }

  throw new PaymentTimeoutError(
    "Payment processing timed out. Please try again.",
    lastError
  );
}
