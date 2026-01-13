export const RAPIDAPI_KEY =
  process.env.RAPIDAPI_KEY || "5b72b57432msh20b34daec2968bap16f987jsncc0792fc26ea";

export const RAPIDAPI_HOST = "booking-com15.p.rapidapi.com";

export const defaultOptions = {
  method: "GET",
  headers: {
    "x-rapidapi-key": RAPIDAPI_KEY,
    "x-rapidapi-host": RAPIDAPI_HOST,
  },
};
