// client/src/serverURL.tsx
const isDev = process.env.NODE_ENV === "development";

export const serverURL = isDev
  ? "http://localhost:5000/api/"           // cuando corrés `npm run both`
  : "https://shareyoursketch.com/api/";    // cuando haces build de prod

console.log("serverURL :>> ", serverURL);