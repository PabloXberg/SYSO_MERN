const serverURL =
    process.env.NODE_ENV === "development"
        ? "http://localhost:3000/api/"
        : "https://shareyourserver.vercel.app/api/";

console.log('serverURL :>> ', serverURL);

export { serverURL };