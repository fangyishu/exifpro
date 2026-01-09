
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.resolve(__dirname, '../dist');
const LOCALES_DIR = path.resolve(__dirname, '../locales/landing');
const BASE_URL = 'https://exifpro.fandx.vip';

// Helper to flatten object keys
function flatten(obj, prefix = '') {
    return Object.keys(obj).reduce((acc, k) => {
        const pre = prefix.length ? prefix + '.' : '';
        if (typeof obj[k] === 'object' && obj[k] !== null) {
            Object.assign(acc, flatten(obj[k], pre + k));
        } else {
            acc[pre + k] = obj[k];
        }
        return acc;
    }, {});
}

async function build() {
    console.log('Starting Landing Page SSG...');

    // 1. Check if dist/index.html is actually the App (SPA)
    // If so, move it to dist/app/index.html so /app/ works
    const distIndexPath = path.join(DIST_DIR, 'index.html');
    if (fs.existsSync(distIndexPath)) {
        const content = fs.readFileSync(distIndexPath, 'utf-8');
        // Basic check for typical SPA root element
        if (content.includes('<div id="root">')) {
            console.log('Detected App at dist/index.html. Moving to dist/app/index.html...');
            const appDir = path.join(DIST_DIR, 'app');
            if (!fs.existsSync(appDir)) fs.mkdirSync(appDir, { recursive: true });
            fs.renameSync(distIndexPath, path.join(appDir, 'index.html'));
            console.log('Moved App to dist/app/index.html');
        }
    }

    // 2. Read Source Template (since Vite build might have missed it or overwritten it)
    // We rely on the source index.html (which has %placeholders%)
    const templatePath = path.resolve(__dirname, '../index.html');
    if (!fs.existsSync(templatePath)) {
        console.error('Error: src/index.html not found.');
        process.exit(1);
    }

    const template = fs.readFileSync(templatePath, 'utf-8');
    const locales = fs.readdirSync(LOCALES_DIR)
        .filter(f => f.endsWith('.json'))
        .map(f => f.replace('.json', ''));

    console.log(`Found locales: ${locales.join(', ')}`);

    // Generate Hreflang Tags
    const generateHreflangs = (currentLocale) => {
        let tags = [];
        locales.forEach(loc => {
            tags.push(`<link rel="alternate" hreflang="${loc}" href="${BASE_URL}/${loc}/" />`);
        });
        tags.push(`<link rel="alternate" hreflang="x-default" href="${BASE_URL}/" />`);
        return tags.join('\n    ');
    };

    for (const locale of locales) {
        console.log(`Processing ${locale}...`);
        const localePath = path.join(LOCALES_DIR, `${locale}.json`);
        const translations = JSON.parse(fs.readFileSync(localePath, 'utf-8'));
        const flatTrans = flatten(translations);

        let html = template;

        // Replace Placeholders
        for (const [key, value] of Object.entries(flatTrans)) {
            html = html.split(`%${key}%`).join(value);
        }

        // Inject lang attribute
        html = html.replace(/<html lang="[^"]+">/i, `<html lang="${locale}">`);

        // Inject Hreflang
        const hreflangs = generateHreflangs(locale);
        html = html.replace('</head>', `${hreflangs}\n</head>`);

        // Write Output
        const outDir = path.join(DIST_DIR, locale);
        if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
        fs.writeFileSync(path.join(outDir, 'index.html'), html);
        console.log(`  Written dist/${locale}/index.html`);

        // Write Root index.html (Default Language)
        // Assuming zh-CN is default as per project preference
        if (locale === 'zh-CN') {
            fs.writeFileSync(path.join(DIST_DIR, 'index.html'), html);
            console.log(`  Updated dist/index.html (Root) with ${locale} content`);
        }
    }

    console.log('Landing Page SSG Complete.');

    // --- Sitemap Generation ---
    console.log('Generating sitemap.xml...');
    const sitemapUrls = [];
    const date = new Date().toISOString().split('T')[0];

    // Root URL
    sitemapUrls.push(`
    <url>
        <loc>${BASE_URL}/</loc>
        <lastmod>${date}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>`);

    // App URL
    sitemapUrls.push(`
    <url>
        <loc>${BASE_URL}/app/</loc>
        <lastmod>${date}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>`);

    // Localized Landing Pages
    locales.forEach(loc => {
        sitemapUrls.push(`
    <url>
        <loc>${BASE_URL}/${loc}/</loc>
        <lastmod>${date}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>`);
    });

    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.join('')}
</urlset>`;

    fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapContent);
    console.log('  Written dist/sitemap.xml');

    // --- Robots.txt Generation ---
    console.log('Generating robots.txt...');
    const robotsContent = `User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml
`;
    fs.writeFileSync(path.join(DIST_DIR, 'robots.txt'), robotsContent);
    console.log('  Written dist/robots.txt');

}

build().catch(e => {
    console.error(e);
    process.exit(1);
});
