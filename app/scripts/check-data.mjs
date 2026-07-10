import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const legacyFields = ['sourceGroup', 'concept', 'conceptLabel', 'lat', 'lon', 'powerMW', 'capexBn', 'revenueM'];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const datasets = [
  {
    name: 'data.json',
    validate: async (value) => {
      assert(Array.isArray(value), 'data.json dizi olmalıdır.');
      assert(value.length === 15, `data.json tam 15 Türkiye adayı içermelidir; bulunan: ${value.length}`);

      // Check README.md
      try {
        const readmeContent = await readFile(resolve('..', 'README.md'), 'utf8');
        const readmeCandidateMatch = readmeContent.match(/(\d+)\s+aday/);
        if (readmeCandidateMatch) {
          const readmeCount = parseInt(readmeCandidateMatch[1], 10);
          assert(readmeCount === value.length, `README'deki aday sayısı (${readmeCount}) data.json uzunluğu (${value.length}) ile eşleşmiyor.`);
        }
      } catch (err) {
        console.warn('README.md okunamadı veya eşleşme bulunamadı, atlanıyor.', err.message);
      }

      const counts = value.reduce((acc, site) => {
        acc[site.pdhesType] = (acc[site.pdhesType] || 0) + 1;
        return acc;
      }, {});
      assert(counts.OPEN_LOOP === 12, `12 Açık Çevrim adayı bekleniyor; bulunan: ${counts.OPEN_LOOP || 0}`);
      assert(counts.SEA_WATER === 3, `3 Deniz Tipi aday bekleniyor; bulunan: ${counts.SEA_WATER || 0}`);
      assert(!value.some((site) => site.id === 'presenzano'), 'Presenzano Türkiye aday listesinde olmamalıdır.');
      const seaIds = value.filter((site) => site.pdhesType === 'SEA_WATER').map((site) => site.id).join(',');
      assert(seaIds === 'tasucu,bozyazi_anamur,karaburun', `Deniz Tipi sırası hatalı: ${seaIds}`);
      for (const site of value) {
        assert(site.technicalClassification?.cycleType, `${site.id}: technicalClassification.cycleType eksik.`);
        assert(site.coordinates?.coordinateOrder === '[lon, lat]', `${site.id}: koordinat sırası [lon, lat] olmalıdır.`);
        assert(Array.isArray(site.risks), `${site.id}: risks dizisi eksik.`);
        assert(Array.isArray(site.assumptions), `${site.id}: assumptions dizisi eksik.`);
        for (const field of legacyFields) {
          assert(!(field in site), `${site.id}: eski alan hâlâ var: ${field}`);
        }
      }
      return true;
    },
  },
  {
    name: 'grid_assets.json',
    validate: (value) =>
      value?.type === 'FeatureCollection' &&
      Array.isArray(value.features),
  },
];

for (const dataset of datasets) {
  const raw = await readFile(resolve('public', dataset.name), 'utf8');
  const parsed = JSON.parse(raw);

  const isValid = await dataset.validate(parsed);
  if (!isValid) {
    throw new Error(`${dataset.name}: beklenen veri yapısıyla eşleşmiyor.`);
  }

  console.log(`OK ${dataset.name}: kanonik public veri kümesi geçerli`);
}
