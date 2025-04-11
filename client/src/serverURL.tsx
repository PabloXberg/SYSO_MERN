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
        ? "http://hskwk44k04kwk00ow4g40oo0.91.108.113.166.sslip.io"
        : "https://shareyourserver.vercel.app/api/";

export { serverURL };