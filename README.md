# cpm-thumbor

this module allows you to build thumbor media urls 

# Usage


### Useful usage
```
let thumbor = new Thumbor(config.thumbor.thumborSecret, config.thumbor.resizeDomainPrefix);

let urlThumbor = thumbor.generateRewriteImgUrl(media.url, media.trans);

```

It provide an object with the 4 Formats we used on Interencheres

### Sample
```
{
    "xs": "//blublu.blublu.com/weirdstring1=/100x75/smart/mydir/2019/08/05/haha_myhash",
    "md": "//blublu.blublu.com/weirdstring2=/fit-in/200x200/mydir/2019/08/05/haha_fyhash",
    "lg": "//blublu.blublu.com/weirdstring3=/fit-in/400x400/mydir/2019/08/05/haha_myhash",
    "original": "//blublu.blublu.com/weirdstring4=/mydir/2019/08/05/haha_fmyhash"
}
```


### Build Url


```thumbor.buildUrl (
    "//blublu.blublu.com/mydir/2019/08/05/haha_fmyhash",
    {"transform": {"crop": {"top": 195, "left": 195, "right": 1744, "bottom": 1744}, "rotate": 90, "sharpen": {"amount": 0, "radius": 0}, "contrast": 0, "brightness": 0, "saturation": 1}}
)```
