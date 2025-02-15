"use client";
import { useEffect } from "react";

export default function RazorpayScriptLoader() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return null; // No UI, just loads the script
}
