const serverURL =
    process.env.NODE_ENV === "development"
        ? "http://localhost:5000/api/"
        : "https://shareyourserver.vercel.app/api/"
    ;

console.log('serverURL :>> ', serverURL);

export { serverURL };




// let serverURL;

// if (process.env.NODE_ENV === "development") {
//     serverURL = "http://localhost:5000/api/";
// } else if (process.env.CUSTOM_ENV === "staging") {
//     serverURL = "https://staging.shareyourserver.com/api/";
// } else {
//     serverURL = "https://shareyourserver.vercel.app/api/";
// }

// console.log('serverURL :>> ', serverURL);

// export { serverURL };