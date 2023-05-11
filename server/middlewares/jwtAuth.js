import passport from "passport";

const jwtAuth = passport.authenticate("jwt", { session: false });

export default jwtAuth