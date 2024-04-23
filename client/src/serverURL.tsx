const serverURL =
    process.env.NODE_ENV === "development"
        ? "http://localhost:5000/api/"
        : "https://shareyoursketchserver.vercel.app/api/";

console.log('serverURL :>> ', serverURL);

export { serverURL };