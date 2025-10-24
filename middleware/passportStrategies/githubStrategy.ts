import dotenv from "dotenv";
dotenv.config();

import { Strategy as GitHubStrategy } from 'passport-github2';
import { PassportStrategy } from '../../interfaces/index';
import { Request } from "express";
import passport from 'passport';
import { userModel } from "../../models/userModel";

const githubStrategy: GitHubStrategy = new GitHubStrategy(
    {
        clientID: process.env.CLIENT_ID as string,
        clientSecret: process.env.CLIENT_SECRET as string,
        callbackURL: "http://localhost:8000/auth/github/callback",
        passReqToCallback: true,
    },

    async (req: Request, accessToken: String, refreshToken: String, profile: passport.Profile, done: (err?: Error | null, profile?: any) => void) => {
        console.log(profile)
        try {
            let user;
            if (profile.emails && profile.emails.length > 0) {
                try {
                    user = userModel.findOne(profile.emails[0].value);
                } catch {
                    user = userModel.createOAuthUser(profile);
                }
            } else {
                try {
                    user = userModel.findById(profile.id);
                } catch {
                    user = userModel.createOAuthUser(profile);
                }
            }

            return done(null, user);
        } catch (err) {
            return done(err as Error);
        }
    },
);

const passportGitHubStrategy: PassportStrategy = {
    name: 'github',
    strategy: githubStrategy,
};

export default passportGitHubStrategy;
