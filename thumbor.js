"use strict";

const Url = require("url-parse");
const ThumborUrlBuilder = require("@interencheres/thumbor-url-buider");

const AUTHORIZED_METAS = [
    "brightness",
    "contrast",
    "saturation",
    "sharpen",
    "rotate",
    "crop"
];

class CpmThumbor{
    constructor (resizeDomainPrefix, securityKey, hashFn) {
        this.THUMBOR_SECURITY_KEY = securityKey;
        this.THUMBOR_RESIZE_DOMAINE_PREFIX = resizeDomainPrefix;
        this.THUMBOR_HASH_FN = hashFn;
    }

    getFormat (format) {
        let back = {};
        switch (format) {
            case 'xs':
                back = { width: 100, height: 75, cropMode: "smart"};
                break;
            case 'md':
                back = { width: 200, height: 200, cropMode: "fitIn"};
                break;
            case 'lg':
                back = { width: 400, height: 400, cropMode: "fitIn"};
                break;
            case 'lgcrop':
                back = { width: 400, height: 300, cropMode: "smart"};
                break;
            case 'legacy_vignette':
                back = { width: 150, height: 113, cropMode: "fitIn"};
                break;
            case 'legacy_picture':
                back = { width: 640, height: 480, cropMode: "fitIn"};
                break;
            case 'legacy_jsonhd':
            case 'pswp':
                back = { width: 1920, height: 1080, cropMode: "fullFitIn"};
                break;
            case 'mdViewGallery':
                back = { width: 176, height: 132, cropMode: "fullFitIn"};
                break;
            case 'original':
                back = {};
                break;
            case 'sm':
                back = { width: 160, height: 120, cropMode: "smart"};
                break;
            default:
                throw new Error(`Unknown format: ${format}`);
        };
        return back;
    }

    generateRewriteImgUrl(mediaUrl, rewriteParameters, formats = ["xs", "md", "lg", "original"]) {
        const res = {};

        formats.forEach(format => {
            res[format] = this.buildUrl(mediaUrl, { ... rewriteParameters, ... this.getFormat(format) })
        })

        return res;
    }

    buildUrl (mediaUrl, rewriteParameters) {
        const url = mediaUrl.startsWith("//") ? new Url(`http:${mediaUrl}`) : new Url(mediaUrl);

        let transform = {};
        if (rewriteParameters.transform) {
            for (const [key, value] of Object.entries(rewriteParameters.transform)) {
                if (AUTHORIZED_METAS.includes(key)) {
                    transform[key] = value;
                }
            }
        }

        let host;
        if (this.THUMBOR_RESIZE_DOMAINE_PREFIX === "" || this.THUMBOR_RESIZE_DOMAINE_PREFIX == null) {
            host = url.host;
        } else {
            host = `${this.THUMBOR_RESIZE_DOMAINE_PREFIX}.${url.host}`;
        }

        const builder = new ThumborUrlBuilder(
            `//${host}`,
            this.THUMBOR_SECURITY_KEY,
            this.THUMBOR_HASH_FN
        );

        builder.setImagePath(url.pathname);

        if (transform.crop) {
            builder.crop(
                transform.crop.left,
                transform.crop.top,
                transform.crop.right,
                transform.crop.bottom
            );

            delete transform.crop;
        }

        const filters = this._formatFilters(transform);
        if (filters) {
            builder.filter(filters);
        }

        if (rewriteParameters.width && rewriteParameters.height) {
            const width = this._isAspectRatioChanged(transform)
                ? rewriteParameters.height
                : rewriteParameters.width;
            const height = this._isAspectRatioChanged(transform)
                ? rewriteParameters.width
                : rewriteParameters.height;

            builder.resize(width, height);

            if (rewriteParameters.cropMode === "fullFitIn") {
                builder.fullFitIn(width, height);
            }
            if (rewriteParameters.cropMode === "smart") {
                builder.smartCrop(true);
            }
            if (rewriteParameters.cropMode === "fitIn") {
                builder.fitIn(width, height);
            }
        }

        return builder.buildUrl();
    }

    _formatFilters (filters) {
        const formattedFilters = [];

        Object.entries(filters).forEach(
            ([filterName, filterValue]) => {
                switch (filterName) {
                    case "saturation":
                        if (filterValue !== 1) {
                            formattedFilters.push(`${filterName}(${filterValue})`);
                        }
                        break;
                    case "sharpen":
                        if (filterValue.amount !== 0) {
                            formattedFilters.push(
                                `${filterName}(${filterValue.amount},${filterValue.radius},true)`
                            );
                        }
                        break;
                    default:
                        if (filterValue !== 0 && filterValue !== null) {
                            formattedFilters.push(`${filterName}(${filterValue})`);
                        }
                        break;
                }
            }
        );

        return formattedFilters.join(":");
    }

    _isAspectRatioChanged (transform) {
        return transform.rotate &&
            (transform.rotate === 90 ||
                transform.rotate === -90 ||
                transform.rotate === 270 ||
                transform.rotate === -270);
    }
}

module.exports = CpmThumbor;
