import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { getUserByEmailIdAndPassword, getUserById } from "../../controllers/userController";
import { PassportStrategy } from '../../interfaces/index';
import { userModel } from "../../models/userModel";

const localStrategy = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  (email, password, done) => {
    try {
      const user = getUserByEmailIdAndPassword(email, password);
      if (user) {
        return done(null, user);
      }
      const userByEmail = userModel.findOne(email);
      if (userByEmail) {
        return done(null, false, { message: "Incorrect password. Please try again." });
      }
    } catch (err: any) {
      if (err.message.includes("Couldn't find user with email")) {
        return done(null, false, { message: `Couldn't find user with email: ${email}` });
      }
      return done(err);
    }
  }
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(function (id: number, done) {
  let user = getUserById(id);
  if (user) {
    done(null, user);
  } else {
    done({ message: "User not found" }, null);
  }
});

const passportLocalStrategy: PassportStrategy = {
  name: 'local',
  strategy: localStrategy,
};

export default passportLocalStrategy;
