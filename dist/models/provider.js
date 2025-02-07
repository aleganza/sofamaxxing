"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Provider {
    constructor(customBaseURL) {
        this.baseUrl = "";
        this.CDNUrl = null;
        this.colorHEX = null;
        this.logo = "https://png.pngtree.com/png-vector/20210221/ourmid/pngtree-error-404-not-found-neon-effect-png-image_2928214.jpg";
        if (customBaseURL) {
            if (!customBaseURL.startsWith("https://")) {
                throw new Error(`Invalid URL: "${customBaseURL}". The base URL must start with "https://".`);
            }
            this.baseUrl = customBaseURL;
        }
    }
}
exports.default = Provider;
