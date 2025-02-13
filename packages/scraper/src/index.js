"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Provider = exports.SubOrDub = exports.MediaFormat = exports.MediaStatus = exports.TokyoInsider = exports.StreamingCommunity = exports.AniPlay = exports.AnimeParadise = exports.AnimeToast = exports.AnimeHeaven = exports.AnimeUnity = void 0;
const provider_1 = __importDefault(require("./models/provider"));
exports.Provider = provider_1.default;
const types_1 = require("./models/types");
Object.defineProperty(exports, "MediaFormat", { enumerable: true, get: function () { return types_1.MediaFormat; } });
Object.defineProperty(exports, "MediaStatus", { enumerable: true, get: function () { return types_1.MediaStatus; } });
Object.defineProperty(exports, "SubOrDub", { enumerable: true, get: function () { return types_1.SubOrDub; } });
const AnimeHeaven_1 = __importDefault(require("./providers/AnimeHeaven"));
exports.AnimeHeaven = AnimeHeaven_1.default;
const AnimeToast_1 = __importDefault(require("./providers/AnimeToast"));
exports.AnimeToast = AnimeToast_1.default;
const AnimeUnity_1 = __importDefault(require("./providers/AnimeUnity"));
exports.AnimeUnity = AnimeUnity_1.default;
const StreamingCommunity_1 = __importDefault(require("./providers/StreamingCommunity"));
exports.StreamingCommunity = StreamingCommunity_1.default;
const TokyoInsider_1 = __importDefault(require("./providers/TokyoInsider"));
exports.TokyoInsider = TokyoInsider_1.default;
const AnimeParadise_1 = __importDefault(require("./providers/AnimeParadise"));
exports.AnimeParadise = AnimeParadise_1.default;
const AniPlay_1 = __importDefault(require("./providers/AniPlay"));
exports.AniPlay = AniPlay_1.default;
