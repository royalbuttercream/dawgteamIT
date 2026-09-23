import Jimp from 'jimp';
import jsQR from 'jsqr';
for (const f of process.argv.slice(2)) {
  const img = await Jimp.read(f);
  let found = null;
  for (const scale of [1, 0.5, 2]) {
    const im = img.clone().scale(scale).greyscale();
    const { data, width, height } = im.bitmap;
    const code = jsQR(new Uint8ClampedArray(data), width, height, { inversionAttempts: 'attemptBoth' });
    if (code) { found = code.data; break; }
  }
  console.log(f.split('/').pop(), '=>', found || 'no QR decoded');
}
