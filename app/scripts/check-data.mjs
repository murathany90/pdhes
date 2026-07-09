import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const legacyFields = ['sourceGroup', 'concept', 'conceptLabel', 'lat', 'lon', 'powerMW', 'capexBn', 'revenueM'];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const datasets = [
  {
    name: 'data.json',
    validate: (value) => {
      assert(Array.isArray(value), 'data.json dizi olmalıdır.');
      assert(value.length === 15, `data.json tam 15 Türkiye adayı içermelidir; bulunan: ${value.length}`);
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

  if (!dataset.validate(parsed)) {
    throw new Error(`${dataset.name}: beklenen veri yapısıyla eşleşmiyor.`);
  }

  console.log(`OK ${dataset.name}: kanonik public veri kümesi geçerli`);
}
