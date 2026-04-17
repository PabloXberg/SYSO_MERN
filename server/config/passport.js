import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import UserModel from "../models/userModels.js";

const passportConfig = () => {
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  };

  // PERF: Previously this ran 3 nested .populate() calls on EVERY authenticated
  // request (likes, sketchs, comments — each populating owner.username too).
  // That meant ~5 DB queries per request just to verify the JWT.
  //
  // Now we only load the minimal fields needed to confirm the user exists and
  // attach the user ID to `req.user`. Controllers that actually need the full
  // populated user (like getActiveUser) can populate on demand.
  const strategy = new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await UserModel.findById(jwt_payload.sub).select(
        "_id email username avatar info"
      );
      return user ? done(null, user) : done(null, false);
    } catch (error) {
      return done(error, false);
    }
  });

  passport.use(strategy);
};

export default passportConfig;
