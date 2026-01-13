import { defaultOptions } from "../config/rapidapi.js";

export async function searchAttractionLocation(query) {
  const url =
    "https://booking-com15.p.rapidapi.com/api/v1/attraction/searchLocation" +
    `?query=${encodeURIComponent(query)}&languagecode=en-us`;

  const res = await fetch(url, defaultOptions);
  const json = await res.json();

  const products = json?.data?.products || [];
  if (!products.length) throw new Error("No attractions found for this location");

  return products.map(p => p.productSlug).filter(Boolean);
}

export async function getAttractionDetails(slug) {
  const url =
    "https://booking-com15.p.rapidapi.com/api/v1/attraction/getAttractionDetails" +
    `?slug=${encodeURIComponent(slug)}&currency_code=USD`;

  const res = await fetch(url, defaultOptions);
  const json = await res.json();

  if (!json?.data) throw new Error("No attraction details found");
  return json.data;
}

export function extractAttractionData(attractionData, slug) {
  return {
    attraction_name: attractionData.name,
    attraction_slug: slug,
    additional_info: attractionData.additionalInfo || null,
    cancellation_policy: attractionData.cancellationPolicy?.hasFreeCancellation ?? false,
    images: attractionData.primaryPhoto?.small || null,
    price: attractionData.representativePrice?.chargeAmount ?? null,
    whats_included: attractionData.whatsIncluded || null,
    country: attractionData.addresses?.arrival?.[0]?.country || null,
    city: attractionData.addresses?.arrival?.[0]?.city || null,
  };
}
