"use strict";

const CpmThumbor = require("../thumbor");

describe("CpmThumbor test suite", () => {
    it ("sould return a valid Thumbor url", () => {
        const expected = "//THUMBOR_RESIZE_DOMAINE_PREFIX.host/PgFU4RLblLZLgUiYdQfS-xkNQK8=/42x42:42x42/42x42/smart/filters:brightness(42):contrast(42):saturation(42):sharpen(42,42,true):rotate(42)/:port/path";
        const thumbor = new CpmThumbor("THUMBOR_SECURITY_KEY", "THUMBOR_RESIZE_DOMAINE_PREFIX");
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
});
