import createHttpError from "http-errors";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';

import { randomBytes } from 'crypto';
import { User } from "../models/user.js";
import { Session } from "../models/session.js";
import { FIFTEEN_MINUTES, SMTP, TEMPLATES_DIR, THIRTY_DAYS } from "../constants/index.js";
import { getEnvVar } from "../utils/getEnvVar.js";
import { sendEmail } from "../utils/sendMail.js";

export const registerUser = async (payload) => {
    const user = await User.findOne({ email: payload.email });
    if (user) throw createHttpError(409, 'Email in use');

    const encryptedPassword = await bcrypt.hash(payload.password, 10);

    return await User.create({
        ...payload,
        password: encryptedPassword,
    });
};

export const loginUser = async (payload) => {
    const user = await User.findOne({ email: payload.email });
    if (!user) throw createHttpError(404, 'User is not found');

    const isEqual = await bcrypt.compare(payload.password, user.password);
    if (!isEqual) throw createHttpError(401, 'Unauthorized');

    await Session.deleteOne({ userId: user._id });

    const accessToken = randomBytes(30).toString('base64');
    const refreshToken = randomBytes(30).toString('base64');

    return await Session.create({
        userId: user._id,
        accessToken,
        refreshToken,
        accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
        refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
    });
};

const createSession = () => {
    const accessToken = randomBytes(30).toString('base64');
    const refreshToken = randomBytes(30).toString('base64');
  
    return {
      accessToken,
      refreshToken,
      accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
      refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
    };
};
  
export const refreshUserSession = async ({ sessionId, refreshToken }) => {
    const session = await Session.findOne({ _id: sessionId, refreshToken });
    if (!session) throw createHttpError(404, 'Session not found');

    const isSessionTokenExpired = new Date > new Date(session.refreshTokenValidUntil);
    if (isSessionTokenExpired) throw createHttpError(401, 'Session token expired');

    const newSession = createSession();

    await Session.deleteOne({ _id: sessionId, refreshToken });

    return await Session.create({
        userId: session.userId,
        ...newSession,
    });
};

export const logoutUser = async (sessionId) => {
    await Session.deleteOne({ _id: sessionId });
};

export const requestResetToken = async (email) => {
    const user = await User.findOne({ email });

    if (!user) throw createHttpError(404, 'User not found');

    const resetToken = jwt.sign(
        {
            sub: user._id,
            email,
        },
        getEnvVar('JWT_SECRET'),
        {
            expiresIn: '15m'
        },
    );

    const resetPasswordTemplatePath = path.join(
        TEMPLATES_DIR,
        'reset-password-email.html',
    );

    const templateSource = (await fs.readFile(resetPasswordTemplatePath)).toString();

    const template = handlebars.compile(templateSource);
    const html = template({
        name: user.name,
        link: `${getEnvVar('APP_DOMAIN')}/reset-password?token=${resetToken}`,
    });

    try {
    await sendEmail({
        from: getEnvVar(SMTP.SMTP_FROM),
        to: email,
        subject: 'Reset your password',
        html,
    });
    } catch (err) {
        console.error('Failed to send email:', err); 
        throw createHttpError(500, 'Failed to send the email, please try again later.');
    }
};

export const resetPassword = async (payload, sessionId) => {
    let entries;
    console.log(payload.password);

    try {
        entries = jwt.verify(payload.token,
            getEnvVar('JWT_SECRET'));
    } catch (err) {
        if (err instanceof Error) throw createHttpError(401, 'Token is expired or invalid.');
        throw err;
    }

    const user = await User.findOne({
        email: entries.email,
        _id: entries.sub,
    });

    if (!user) throw createHttpError(404, 'User not found');

    const encryptedPassword = await bcrypt.hash(payload.password, 10);

    await User.findOneAndUpdate(
        { _id: user._id },
        { password: encryptedPassword }
    );

    await Session.findOneAndDelete(
        {userId: user._id}, 
        { _id: sessionId }
    );
};