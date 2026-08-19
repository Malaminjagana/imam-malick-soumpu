const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const targets = [
    { folder: "assets/img", pattern: /(?:biography|bigraphy)\.webp$/i, maxWidth: 600, quality: 75, maxSizeKB: 150 },
    { folder: "awards", pattern: /\.webp$/i, maxWidth: 600, quality: 75, maxSizeKB: 100 },
    { folder: "assets/img", pattern: /imam_malik_events.*banner.*\.webp$/i, maxWidth: 800, quality: 75, maxSizeKB: 120 },
    { folder: "assets/img", pattern: /^imam-malick-logo.*\.png$/i, maxWidth: 300, quality: 80, maxSizeKB: 50, isPNG: true }
];

const eventVariants = [
    { input: "imam_malik_events_banner_2026.webp", prefix: "events-2026" },
    { input: "imam_malik_events_2027_banner.webp", prefix: "events-2027" }
];

async function writeCompressed(input, output, target, width) {
    const metadata = await sharp(input).metadata();
    const resizeWidth = Math.min(width || target.maxWidth, metadata.width || target.maxWidth);
    let quality = target.quality;

    while (quality >= 45) {
        let pipeline = sharp(input).resize({ width: resizeWidth, withoutEnlargement: true });
        pipeline = target.isPNG
            ? pipeline.png({ compressionLevel: 9, palette: true, quality })
            : pipeline.webp({ quality });

        const temporaryOutput = `${output}.${target.isPNG ? "png" : "webp"}.tmp`;
        await pipeline.toFile(temporaryOutput);
        const sizeKB = fs.statSync(temporaryOutput).size / 1024;
        if (sizeKB <= target.maxSizeKB || quality === 45) {
            fs.renameSync(temporaryOutput, output);
            return Math.round(sizeKB);
        }
        fs.unlinkSync(temporaryOutput);
        quality -= 5;
    }
}

async function compress() {
    for (const target of targets) {
        const directory = path.join(process.cwd(), target.folder);
        if (!fs.existsSync(directory)) continue;

        const files = fs.readdirSync(directory).filter((file) => target.pattern.test(file));
        for (const file of files) {
            const input = path.join(directory, file);
            const sizeKB = await writeCompressed(input, input, target);
            console.log(`${path.join(target.folder, file)}: ${sizeKB}KB - target ${target.maxSizeKB}KB`);
        }
    }

    for (const event of eventVariants) {
        const input = path.join(process.cwd(), "assets/img", event.input);
        if (!fs.existsSync(input)) continue;

        for (const width of [400, 800]) {
            const output = path.join(process.cwd(), "assets/img", `${event.prefix}-${width}.webp`);
            const sizeKB = await writeCompressed(input, output, { maxWidth: width, quality: 75, maxSizeKB: 120 }, width);
            console.log(`assets/img/${event.prefix}-${width}.webp: ${sizeKB}KB - target 120KB`);
        }
    }
}

compress().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});