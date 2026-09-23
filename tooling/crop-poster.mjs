import Jimp from 'jimp';
const [src, out, keepRatio] = process.argv.slice(2);
const img = await Jimp.read(src);
img.scaleToFit(1000, 1000);
const h = Math.round(img.bitmap.height * Number(keepRatio));
img.crop(0, 0, img.bitmap.width, h).quality(80);
await img.writeAsync(out);
console.log(out, img.bitmap.width + 'x' + h);
