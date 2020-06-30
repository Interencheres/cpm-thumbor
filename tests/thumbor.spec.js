"use strict";

const CpmThumbor = require("../thumbor");
const crypto = require("crypto");
const hashFn = (stringToHash, secret) => {
    const hmac = crypto.createHmac("sha1", secret);
    hmac.update(stringToHash);
    const hash = hmac.digest("base64");
    return hash.replace(/\+/g, "-").replace(/\//g, "_");
};

describe("CpmThumbor test suite", () => {
    it ("should return a valid Thumbor url", () => {
        const expected = "//THUMBOR_RESIZE_DOMAINE_PREFIX.host:port/Vy4HdXkfAqvHEthwQxXkcsJa2TM=/42x42:42x42/42x42/smart/filters:brightness(42):contrast(42):saturation(42):sharpen(42,42,true):rotate(42)/path";
        const thumbor = new CpmThumbor("THUMBOR_RESIZE_DOMAINE_PREFIX", "THUMBOR_SECURITY_KEY", hashFn);
        const url = thumbor.buildUrl("http://host:port/path", {
            width: 42,
            height: 42,
            cropMode: "smart",
            transform: {
                brightness: 42,
                contrast: 42,
                saturation: 42,
                sharpen: {
                    amount: 42,
                    radius: 42
                },
                rotate: 42,
                crop: {
                    top: 42,
                    left: 42,
                    right: 42,
                    bottom: 42
                }
            }
        });
        expect(url).toEqual(expected);
    });


    it ("should also return a valid Thumbor url", () => {
        const expected = "//THUMBOR_RESIZE_DOMAINE_PREFIX.host:port/aB3Up9rmMdyL6dGVXxw7gxPn0F8=/42x42/smart/path";
        const thumbor = new CpmThumbor("THUMBOR_RESIZE_DOMAINE_PREFIX", "THUMBOR_SECURITY_KEY", hashFn);
        const url = thumbor.buildUrl("//host:port/path", {
            width: 42,
            height: 42,
            cropMode: "smart"
        });
        expect(url).toEqual(expected);
    });
});
