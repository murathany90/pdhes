const fs = require('fs');
const tsPath = 'c:\\yazilim_projeler\\zPompaj_DHES\\app\\src\\data\\reportsData.ts';
const mdPath = 'c:\\yazilim_projeler\\zPompaj_DHES\\docs\\raporlar\\Enerji Depolamada Ezber Bozan Gerçekler Neden Sadece Bataryalar Yetmeyecek.md';

const mdContent = fs.readFileSync(mdPath, 'utf8');
let tsContent = fs.readFileSync(tsPath, 'utf8');

const regex = /id:\s*'battery-lobby-and-psh'[\s\S]*?content:\s*`[\s\S]*?`\r?\n\s*\},/;
const match = regex.exec(tsContent);

if (match) {
  const insertPos = match.index + match[0].length;
  const newReportStr = `\n  {
    id: 'enerji-depolamada-ezber-bozan-gercekler',
    title: 'Enerji Depolamada Ezber Bozan Gerçekler: Neden Sadece Bataryalar Yetmeyecek?',
    category: 'report',
    author: 'Sistem Araştırma Modülü',
    publishDate: '2026-07-11',
    readTime: 6,
    coverImage: '/pdhes-nedir/img-ezber-bozan.png',
    summary: 'Yenilenebilir enerjinin depolama paradoksu, lityum-iyon bataryalar ile Pompaj Depolamalı Hidroelektrik Santraller (PDHES) arasındaki ölçek farkı ve Gökçekaya projesinin stratejik önemi.',
    content: \`${mdContent.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`
  },`;
  
  tsContent = tsContent.slice(0, insertPos) + newReportStr + tsContent.slice(insertPos);
  fs.writeFileSync(tsPath, tsContent, 'utf8');
  console.log('Success');
} else {
  console.log('Match failed');
}
