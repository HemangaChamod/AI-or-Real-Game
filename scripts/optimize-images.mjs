import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const sourceRoot = path.join(root, 'assets');
const outputRoot = path.join(root, 'src', 'assets', 'game-images');
const groups = ['ai', 'real'];
const mapPath = path.join(root, 'scripts', 'image-map.json');
const imageMap = JSON.parse(await readFile(mapPath, 'utf8'));
const assignedNumbers = Object.values(imageMap).map((id) => Number(id.slice(4))).filter(Number.isFinite);
let nextNumber = Math.max(0, ...assignedNumbers) + 1;

await Promise.all(groups.map((group) => mkdir(path.join(outputRoot, group), { recursive: true })));

for (const group of groups) {
  const files = (await readdir(path.join(sourceRoot, group))).filter((file) => /\.(png|jpe?g)$/i.test(file)).sort();
  for (const file of files) {
    const sourceKey = `${group}/${file}`;
    imageMap[sourceKey] ??= `img-${String(nextNumber++).padStart(3, '0')}`;
    const outputName = `${imageMap[sourceKey]}.webp`;
    await sharp(path.join(sourceRoot, group, file))
      .rotate()
      .resize({ width: 1800, height: 1350, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 84, effort: 5 })
      .toFile(path.join(outputRoot, group, outputName));
    console.log(`${group}/${file} -> ${group}/${outputName}`);
  }
}

await writeFile(mapPath, `${JSON.stringify(imageMap, null, 2)}\n`);
