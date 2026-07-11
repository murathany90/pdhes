import type { Site } from "../../types/site";
import { usePdhesCalculationEngine } from "../../hooks/usePdhesCalculationEngine";
import {
  formatCurrencyMUsd,
  formatFlowCms,
  formatGwh,
  formatMeters,
  formatMwh,
  formatMw,
  formatPercent,
  formatUsdPerKw,
  formatUsdPerMwh,
  formatVolumeHm3,
  formatYears,
} from "../../utils/pdhes/formatters";
import type { CapexMode, FixedOrUnitRevenueMode, PdhesCalculationInputs } from "../../utils/pdhes/types";

function toNumberInputValue(value: number): string {
  return Number.isFinite(value) ? String(Number(value.toFixed(6))) : "";
}

function CalculationInput({
  id,
  label,
  value,
  step = "0.1",
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  step?: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        className="input"
        type="number"
        step={step}
        value={toNumberInputValue(value)}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  );
}

function EngineMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <b>{value}</b>
    </div>
  );
}

export default function PdhesCalculationEngine({
  sites,
  selectedId,
  onSelectSite,
}: {
  sites: Site[];
  selectedId: string;
  onSelectSite: (id: string) => void;
}) {
  const selectedSite = sites.find((candidate) => candidate.id === selectedId) || sites[0];
  const { inputs, outputs, setInput, resetInputs } = usePdhesCalculationEngine(selectedSite);

  const setNumber = <K extends keyof PdhesCalculationInputs>(key: K) => (value: number) => {
    setInput(key, (Number.isFinite(value) ? value : 0) as PdhesCalculationInputs[K]);
  };

  if (!selectedSite) {
    return <p className="muted">Hesaplama verisi yükleniyor veya tesis seçilmedi...</p>;
  }

  return (
    <div className="pdhes-calculation-engine">
      <div className="engine-header">
        <div>
          <h2>Hesaplama Motoru (Aktif Tesis: {selectedSite.name})</h2>
          <p className="muted">
            Varsayılanlar Excel hesap satırından gelir; değişiklikler anlık olarak merkezi formüllerle yeniden hesaplanır.
          </p>
        </div>
        <button type="button" className="btn" onClick={resetInputs}>Varsayılanlara Dön</button>
      </div>

      <div className="engine-selector-row">
        <div className="form-group">
          <label htmlFor="pdhes-active-site">Aktif tesis</label>
          <select
            id="pdhes-active-site"
            className="select"
            value={selectedSite.id}
            onChange={(event) => onSelectSite(event.target.value)}
          >
            {sites.map((candidate) => (
              <option key={candidate.id} value={candidate.id}>
                {candidate.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="metric-row engine-output-row">
        <EngineMetric label="Proje Debisi" value={formatFlowCms(outputs.designFlowCms)} />
        <EngineMetric label="Çevrimlik Üretim" value={formatMwh(outputs.cycleEnergyMwh)} />
        <EngineMetric label="Yıllık Üretim" value={formatGwh(outputs.annualGenerationGwh)} />
        <EngineMetric label="Yıllık Toplam Gelir" value={formatCurrencyMUsd(outputs.annualTotalRevenueMUsd)} />
        <EngineMetric label="CAPEX" value={formatCurrencyMUsd(outputs.capexMUsd)} />
        <EngineMetric label="O&M" value={formatCurrencyMUsd(outputs.omMUsdPerYear)} />
        <EngineMetric label="Net Nakit Akımı" value={formatCurrencyMUsd(outputs.netCashFlowMUsdPerYear)} />
        <EngineMetric label="Basit Geri Ödeme" value={formatYears(outputs.paybackYears, "Hesaplanamaz")} />
      </div>

      <div className="engine-form-grid">
        <section className="engine-form-section">
          <h3>Teknik Parametreler</h3>
          <div className="engine-input-grid">
            <CalculationInput id="calc-capacity" label="Kurulu Güç (MW)" value={inputs.capacityMw} step="1" onChange={setNumber("capacityMw")} />
            <CalculationInput id="calc-net-head" label="Net Düşü (m)" value={inputs.netHeadM} onChange={setNumber("netHeadM")} />
            <CalculationInput id="calc-storage-hours" label="Depolama Süresi (saat)" value={inputs.storageHours} onChange={setNumber("storageHours")} />
            <CalculationInput id="calc-upper-volume" label="Üst Aktif Hacim (hm³)" value={inputs.upperActiveVolumeHm3} onChange={setNumber("upperActiveVolumeHm3")} />
            <CalculationInput id="calc-roundtrip" label="Çevrim Verimi (%)" value={inputs.roundTripEfficiencyPct} onChange={setNumber("roundTripEfficiencyPct")} />
            <CalculationInput id="calc-pump-efficiency" label="Pompa Verimi (%)" value={inputs.pumpEfficiencyPct} onChange={setNumber("pumpEfficiencyPct")} />
            <CalculationInput id="calc-turbine-efficiency" label="Türbin/Jeneratör Verimi (%)" value={inputs.turbineGeneratorEfficiencyPct} onChange={setNumber("turbineGeneratorEfficiencyPct")} />
            <CalculationInput id="calc-annual-cycles" label="Yıllık Çevrim Sayısı" value={inputs.annualCycles} step="1" onChange={setNumber("annualCycles")} />
          </div>
        </section>

        <section className="engine-form-section">
          <h3>Piyasa ve Gelir Parametreleri</h3>
          <div className="engine-input-grid">
            <CalculationInput id="calc-peak-price" label="Pik Fiyat ($/MWh)" value={inputs.peakPriceUsdMwh} onChange={setNumber("peakPriceUsdMwh")} />
            <CalculationInput id="calc-offpeak-price" label="Dip Fiyat ($/MWh)" value={inputs.offPeakPriceUsdMwh} onChange={setNumber("offPeakPriceUsdMwh")} />
            <div className="form-group">
              <label htmlFor="calc-ancillary-mode">Yan hizmet modu</label>
              <select
                id="calc-ancillary-mode"
                className="select"
                value={inputs.ancillaryServiceRevenueMode}
                onChange={(event) => setInput("ancillaryServiceRevenueMode", event.target.value as FixedOrUnitRevenueMode)}
              >
                <option value="fixedMUsd">M USD/yıl</option>
                <option value="unitUsdPerMwYear">$ / MW-yıl</option>
              </select>
            </div>
            <CalculationInput id="calc-ancillary-fixed" label="Yan Hizmet Geliri (M USD/yıl)" value={inputs.ancillaryServiceRevenueMUsd} onChange={setNumber("ancillaryServiceRevenueMUsd")} />
            <CalculationInput id="calc-ancillary-unit" label="Yan Hizmet Birim Geliri ($/MW-yıl)" value={inputs.ancillaryServiceUnitRevenueUsdPerMwYear} step="100" onChange={setNumber("ancillaryServiceUnitRevenueUsdPerMwYear")} />
            <div className="form-group">
              <label htmlFor="calc-capacity-mode">Kapasite mekanizması modu</label>
              <select
                id="calc-capacity-mode"
                className="select"
                value={inputs.capacityMechanismRevenueMode}
                onChange={(event) => setInput("capacityMechanismRevenueMode", event.target.value as FixedOrUnitRevenueMode)}
              >
                <option value="fixedMUsd">M USD/yıl</option>
                <option value="unitUsdPerMwYear">$ / MW-yıl</option>
              </select>
            </div>
            <CalculationInput id="calc-capacity-fixed" label="Kapasite Mekanizması Geliri (M USD/yıl)" value={inputs.capacityMechanismRevenueMUsd} onChange={setNumber("capacityMechanismRevenueMUsd")} />
            <CalculationInput id="calc-capacity-unit" label="Kapasite Mekanizması Birim Geliri ($/MW-yıl)" value={inputs.capacityMechanismUnitRevenueUsdPerMwYear} step="100" onChange={setNumber("capacityMechanismUnitRevenueUsdPerMwYear")} />
          </div>
        </section>

        <section className="engine-form-section">
          <h3>Yatırım ve Geri Ödeme</h3>
          <div className="engine-input-grid">
            <div className="form-group">
              <label htmlFor="calc-capex-mode">CAPEX modu</label>
              <select
                id="calc-capex-mode"
                className="select"
                value={inputs.capexMode}
                onChange={(event) => setInput("capexMode", event.target.value as CapexMode)}
              >
                <option value="fixedMUsd">Sabit CAPEX (M USD)</option>
                <option value="intensityUsdKw">CAPEX yoğunluğu ($/kW)</option>
              </select>
            </div>
            <CalculationInput id="calc-fixed-capex" label="Sabit CAPEX (M USD)" value={inputs.fixedCapexMUsd} onChange={setNumber("fixedCapexMUsd")} />
            <CalculationInput id="calc-capex-intensity" label="CAPEX Yoğunluğu ($/kW)" value={inputs.capexIntensityUsdKw} step="10" onChange={setNumber("capexIntensityUsdKw")} />
            <CalculationInput id="calc-om-rate" label="O&M Oranı (% CAPEX/yıl)" value={inputs.omRatePct} onChange={setNumber("omRatePct")} />
          </div>
        </section>
      </div>

      <div className="formula engine-formula">
{`P = ρ × g × Q × H × η
Q = P / (ρ × g × H × η)

Çevrimlik üretim: ${formatMwh(outputs.cycleEnergyMwh)}
Hacim bazlı enerji kontrolü: ${formatMwh(outputs.volumeBasedEnergyMwh)}
Pompaj enerjisi/çevrim: ${formatMwh(outputs.pumpingEnergyPerCycleMwh)}
Pompa gücü: ${formatMw(outputs.pumpPowerMw)}

Pik fiyat: ${formatUsdPerMwh(inputs.peakPriceUsdMwh)}
Dip fiyat: ${formatUsdPerMwh(inputs.offPeakPriceUsdMwh)}
Net arbitraj: ${formatCurrencyMUsd(outputs.netArbitrageRevenueMUsd)}
Yan hizmet: ${formatCurrencyMUsd(outputs.ancillaryServiceRevenueMUsd)}
Kapasite mekanizması: ${formatCurrencyMUsd(outputs.capacityMechanismRevenueMUsd)}
CAPEX yoğunluğu: ${formatUsdPerKw(inputs.capexIntensityUsdKw)}
Aktif hacim: ${formatVolumeHm3(inputs.upperActiveVolumeHm3)}
Çevrim verimi: ${formatPercent(inputs.roundTripEfficiencyPct)}
Net düşü: ${formatMeters(inputs.netHeadM)}`}
      </div>
    </div>
  );
}
