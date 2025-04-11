// const serverURL =
//     process.env.NODE_ENV === "development"
//         ? "http://localhost:5000/api/"
//         : "https://shareyourserver.vercel.app/api/"
//     ;

// console.log('serverURL :>> ', serverURL);

// export { serverURL };




const serverURL: string =
    process.env.NODE_ENV === "development"
        ? "http://localhost:5000/api/"
        : process.env.CUSTOM_ENV === "staging"
        ? "https://shareyourserver.com/api/"
        : "https://shareyourserver.vercel.app/api/";

export { serverURL };