# cpm-thumbor

this module allows you to build thumbor media urls

# Usage


### Useful usage

More information on hashFn [here](https://github.com/Interencheres/ThumborUrlBuilder/blob/master/README.md)

```js
// Browser & NodeJS compatible
const crypto = require('crypto-js');
const hashFn = (stringToHash, secret) => {
    const key = crypto.HmacSHA1(stringToHash, secret);
    const hash = crypto.enc.Base64.stringify(key);
    return hash.replace(/\+/g, '-').replace(/\//g, '_');
}
```
```js
// NodeJS compatible (faster hash && no deps)
const crypto = require('crypto');
const hashFn = (stringToHash, secret) => {
    const hmac = crypto.createHmac('sha1', secret);
    hmac.update(stringToHash);
    const hash = hmac.digest('base64');
    return hash.replace(/\+/g, '-').replace(/\//g, '_');
}
```
```js
const thumbor = new Thumbor(config.thumbor.resizeDomainPrefix, config.thumbor.thumborSecret, hashFn);
const urlThumbor = thumbor.generateRewriteImgUrl(media.url, media.trans);
```

It provide an object with the 4 Formats we used on Interencheres

### Sample
```json
{
    "xs": "//blublu.blublu.com/weirdstring1=/100x75/smart/mydir/2019/08/05/haha_myhash",
    "md": "//blublu.blublu.com/weirdstring2=/fit-in/200x200/mydir/2019/08/05/haha_fyhash",
    "lg": "//blublu.blublu.com/weirdstring3=/fit-in/400x400/mydir/2019/08/05/haha_myhash",
    "original": "//blublu.blublu.com/weirdstring4=/mydir/2019/08/05/haha_fmyhash"
}
```


### Build Url


```js
thumbor.buildUrl (
    "//blublu.blublu.com/mydir/2019/08/05/haha_fmyhash",
    {"transform": {"crop": {"top": 195, "left": 195, "right": 1744, "bottom": 1744}, "rotate": 90, "sharpen": {"amount": 0, "radius": 0}, "contrast": 0, "brightness": 0, "saturation": 1}}
)
```
