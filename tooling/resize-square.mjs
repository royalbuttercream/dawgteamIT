import Jimp from 'jimp';
import { readdirSync } from 'node:fs';
const dir = '../images/executive-officers/';
for (const f of readdirSync(dir).filter((f) => f.endsWith('.jpg'))) {
  const img = await Jimp.read(dir + f);
  if (img.bitmap.width <= 400) { console.log(f, 'already', img.bitmap.width); continue; }
  await img.cover(400, 400).quality(82).writeAsync(dir + f);
  console.log(f, '-> 400x400');
}
