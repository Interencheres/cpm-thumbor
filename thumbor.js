const url = require("url");
const ThumborUrlBuilder = require("@interencheres/thumbor-url-buider");
const pick = require("lodash/pick");
const forEach = require("lodash/forEach");

const AUTHORIZED_METAS = [
    "brightness",
    "contrast",
    "saturation",
    "sharpen",
    "rotate",
    "crop"
];

class CpmThumbor{
    constructor (securityKey, resizeDomainPrefix) {
        this.THUMBOR_SECURITY_KEY = securityKey;
        this.THUMBOR_RESIZE_DOMAINE_PREFIX = resizeDomainPrefix;
    }

    buildUrl (mediaUrl, rewriteParameters) {
        const aUrl = new url.parse(mediaUrl);

        let transform = {};
        if (rewriteParameters.transform) {
            transform = pick(rewriteParameters.transform, AUTHORIZED_METAS);
        }

        const builder = new ThumborUrlBuilder(
            this.THUMBOR_SECURITY_KEY,
            `//${this.THUMBOR_RESIZE_DOMAINE_PREFIX}.${aUrl.host}`
        );

        builder.setImagePath(aUrl.pathname);

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
        }

        return builder.buildUrl();
    }

    _formatFilters (filters) {
        const formattedFilters = [];

        forEach(
            filters,
            (filterValue, filterName) => {
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
