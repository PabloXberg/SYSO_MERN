// const serverURL =
//     process.env.NODE_ENV === "development"
//         ? "http://localhost:5000/api/"
//         : "http://hskwk44k04kwk00ow4g40oo0.91.108.113.166.sslip.io/api/"
//     ;

// console.log('serverURL :>> ', serverURL);

// export { serverURL };




// const serverURL: string =
//     process.env.NODE_ENV === "development"
//         ? "http://localhost:5000/api/"
//         : process.env.CUSTOM_ENV === "staging"
//         ? "https://shareyourserver.vercel.app/api/"
//         : "http://hskwk44k04kwk00ow4g40oo0.91.108.113.166.sslip.io/api/";
              
// export { serverURL };


let serverURL: string;

if (process.env.NODE_ENV === "development") {
    // Distintas opciones de servidor dentro de "development"
    switch (process.env.SERVER_MODE) {
        case "local":
            serverURL = "shareyourserver.vercel.app/api/";
            break;
        case "production":
            serverURL = "http://hskwk44k04kwk00ow4g40oo0.91.108.113.166.sslip.io/api/";
            break;
        case "development":
            serverURL = "http://localhost:5000/api/";
            break;
        default:
            serverURL = "http://localhost:5000/api/";
    }
} else {
    serverURL = "http://hskwk44k04kwk00ow4g40oo0.91.108.113.166.sslip.io/api/";
}

console.log('serverURL :>> ', serverURL);

export { serverURL };