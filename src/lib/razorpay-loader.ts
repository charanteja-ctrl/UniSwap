/**
 * Singleton Razorpay SDK Loader
 * Ensures checkout.js is loaded once across the entire application lifecycle,
 * preventing duplicate script injections, race conditions, and Strict Mode mount loops.
 */

let razorpayLoadPromise: Promise<boolean> | null = null;

export function loadRazorpaySDK(): Promise<boolean> {
  if (typeof window === "undefined") {
    return Promise.resolve(false);
  }

  // Already available on window
  if ((window as any).Razorpay) {
    return Promise.resolve(true);
  }

  // If a load is already in-flight, return the existing promise
  if (razorpayLoadPromise) {
    return razorpayLoadPromise;
  }

  razorpayLoadPromise = new Promise((resolve) => {
    // Check if script tag is already in DOM
    const existingScript = document.querySelector('script[src*="checkout.razorpay.com"]');
    if (existingScript) {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      existingScript.addEventListener("load", () => resolve(true), { once: true });
      existingScript.addEventListener(
        "error",
        () => {
          razorpayLoadPromise = null;
          resolve(false);
        },
        { once: true }
      );
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.id = "razorpay-checkout-script";

    script.onload = () => {
      resolve(true);
    };

    script.onerror = () => {
      console.error("[Razorpay Loader]: Failed to download checkout.js from Razorpay CDN.");
      razorpayLoadPromise = null;
      resolve(false);
    };

    document.head.appendChild(script);
  });

  return razorpayLoadPromise;
}
