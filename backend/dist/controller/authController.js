"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.googleAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const google_auth_library_1 = require("google-auth-library");
const User_1 = __importDefault(require("../models/User"));
const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const createToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '3d'
    });
};
const googleAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_token } = req.body;
    try {
        const ticket = yield client.verifyIdToken({
            idToken: id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        const { sub, name, email, picture } = payload;
        let user = yield User_1.default.findOne({ googleId: sub });
        if (!user) {
            user = yield User_1.default.create({
                googleId: sub,
                displayName: name,
                email,
                image: picture
            });
        }
        const token = createToken(user._id.toString());
        res.status(200).json({ token, user });
    }
    catch (error) {
        res.status(500).json({ message: 'Error authenticating with Google' });
    }
});
exports.googleAuth = googleAuth;
const getProfile = (req, res) => {
    if (req.user) {
        res.json(req.user);
    }
    else {
        res.status(401).json({ message: 'Not authenticated' });
    }
};
exports.getProfile = getProfile;
