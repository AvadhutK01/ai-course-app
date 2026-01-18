"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controller/authController");
const protect_1 = require("../utils/protect");
const router = (0, express_1.Router)();
router.post('/google', authController_1.googleAuth);
router.get('/profile', protect_1.protect, authController_1.getProfile);
exports.default = router;
