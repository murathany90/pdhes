const fs = require('fs');

const reportsTsPath = 'src/data/reportsData.ts';
let content = fs.readFileSync(reportsTsPath, 'utf8');

// Fix cover images
content = content.replace(/\/pdhes_site_gorselleri_webp\/3d_pdhes_arazi_1\.webp/g, '/pdhes_site_gorselleri_webp/italya_dev_yercekimi_bataryasi/italya_dev_yercekimi_bataryasi_01.webp');
content = content.replace(/\/pdhes_site_gorselleri_webp\/3d_pdhes_arazi_2\.webp/g, '/pdhes_site_gorselleri_webp/gokcekaya_pompaj_depolama_bataryasi/gokcekaya_pompaj_depolama_bataryasi_01.webp');
content = content.replace(/\/pdhes_site_gorselleri_webp\/3d_pdhes_arazi_3\.webp/g, '/pdhes_site_gorselleri_webp/birlesik_enerji_depolama_stratejisi/birlesik_enerji_depolama_stratejisi_01.webp');
content = content.replace(/\/pdhes_site_gorselleri_webp\/3d_pdhes_arazi_4\.webp/g, '/pdhes_site_gorselleri_webp/turkiye_pdhes_yatirim_yol_haritasi/turkiye_pdhes_yatirim_yol_haritasi_01.webp');

// Replace substack CDN images
let imageCounter = 1;
content = content.replace(/!\[.*?\]\([^)]*substackcdn\.com[^)]*\)/g, () => {
    let imgFolder = 'direncli_sebeke_mimarisi';
    let imgName = 'direncli_sebeke_mimarisi';
    let imgIndex = (imageCounter % 10) + 1;
    let imgIdxStr = imgIndex < 10 ? '0' + imgIndex : '' + imgIndex;
    imageCounter++;
    return `![Görsel](/pdhes_site_gorselleri_webp/${imgFolder}/${imgName}_${imgIdxStr}.webp)`;
});

fs.writeFileSync(reportsTsPath, content);
console.log('Fixed images.');
