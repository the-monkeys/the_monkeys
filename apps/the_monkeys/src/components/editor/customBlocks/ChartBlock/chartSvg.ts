import type { ChartBlockData } from '../shared/types';
import { PALETTES } from '../shared/types';

export function generateChartMarkup(data: ChartBlockData): string {
  try {
    const labels = Array.isArray(data?.labels) ? data.labels : [];
    const series = Array.isArray(data?.series) ? data.series : [];
    const safe: ChartBlockData = {
      type: data?.type || 'line',
      title: data?.title || '',
      xLabel: data?.xLabel || '',
      yLabel: data?.yLabel || '',
      showLegend: !!data?.showLegend,
      palette: data?.palette || 'ocean',
      labels,
      series,
      source: data?.source || 'manual',
    };
    if (safe.type === 'pie') return renderPieSVG(safe);
    return renderCartesianSVG(safe);
  } catch {
    return '';
  }
}

function renderCartesianSVG(data: ChartBlockData): string {
  const W = 600;
  const H = 180;
  const PL = 44;
  const PR = 16;
  const PT = 12;
  const PB = 32;
  const plotW = W - PL - PR;
  const plotH = H - PT - PB;

  const count = Math.max(
    data.labels.length,
    ...data.series.map((s) => s.values.length),
    1
  );

  const pointsPerSeries = data.series.map((s) =>
    Array.from({ length: count }, (_, i) => s.values[i] ?? 0)
  );
  const allVals = pointsPerSeries.flat();
  const rawMin = Math.min(0, ...allVals);
  const rawMax = Math.max(...allVals, 1);
  const span = rawMax - rawMin || 1;

  const colors = PALETTES[data.palette] || PALETTES.ocean;

  const toX = (i: number) =>
    PL + (count > 1 ? (i / (count - 1)) * plotW : plotW / 2);
  const toY = (v: number) => PT + plotH - ((v - rawMin) / span) * plotH;

  const tickCount = 5;
  const tickStep = getNice(rawMax / (tickCount - 1), true);

  let lines = '';
  let yTicks = '';
  for (
    let v = Math.floor(rawMin / tickStep) * tickStep;
    v <= rawMax + tickStep * 0.5;
    v += tickStep
  ) {
    const y = toY(v);
    lines += `<line x1="${PL}" y1="${y}" x2="${W - PR}" y2="${y}" stroke="rgba(148,163,184,0.25)" stroke-dasharray="4 4"/>`;
    yTicks += `<text x="${PL - 6}" y="${y + 4}" fill="currentColor" font-size="10" text-anchor="end">${fmtAxis(v)}</text>`;
  }

  let xTicks = '';
  const stride = count > 10 ? 2 : 1;
  for (let i = 0; i < count; i++) {
    if (i % stride !== 0 && i !== count - 1) continue;
    xTicks += `<text x="${toX(i)}" y="${H - PB + 16}" fill="currentColor" font-size="10" text-anchor="middle">${data.labels[i] || `P${i + 1}`}</text>`;
  }

  const axisColor = 'rgba(148,163,184,0.5)';
  const axes = `
    <line x1="${PL}" y1="${PT}" x2="${PL}" y2="${H - PB}" stroke="${axisColor}"/>
    <line x1="${PL}" y1="${H - PB}" x2="${W - PR}" y2="${H - PB}" stroke="${axisColor}"/>
  `;

  let seriesRenders = '';

  if (data.type === 'bar') {
    const groupW = plotW / count;
    const barW = Math.max(6, (groupW - 8) / data.series.length);

    data.series.forEach((s, si) => {
      pointsPerSeries[si].forEach((v, i) => {
        const x = PL + i * groupW + 4 + si * barW;
        const y = toY(v);
        const h = Math.max(1, H - PB - y);
        seriesRenders += `<rect x="${x}" y="${y}" width="${Math.max(6, barW - 2)}" height="${h}" fill="${colors[si % colors.length]}" opacity="0.88" rx="2"/>`;
      });
    });
  } else {
    data.series.forEach((s, si) => {
      const pts = pointsPerSeries[si]
        .map((v, i) => `${toX(i)},${toY(v)}`)
        .filter((_, i) => Number.isFinite(pointsPerSeries[si][i]))
        .join(' ');

      if (!pts) return;

      if (data.type === 'area') {
        const firstX = toX(0);
        const lastX = toX(count - 1);
        const baseline = H - PB;
        seriesRenders += `<polygon points="${firstX},${baseline} ${pts} ${lastX},${baseline}" fill="${colors[si % colors.length]}" opacity="0.2"/>`;
      }

      seriesRenders += `<polyline points="${pts}" fill="none" stroke="${colors[si % colors.length]}" stroke-width="2" stroke-linejoin="round"/>`;
    });
  }

  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" style="display:block;width:100%;height:100%;max-height:11rem;">
    ${lines}${yTicks}${xTicks}${axes}${seriesRenders}
  </svg>`;
}

function renderPieSVG(data: ChartBlockData): string {
  const values = data.series[0]?.values || [];
  const labels = data.labels;
  const total = values.reduce((s, v) => s + Math.max(v, 0), 0);

  if (total <= 0) {
    return `<div class="flex items-center justify-center h-[200px] text-xs text-slate-400">No positive values</div>`;
  }

  const colors = PALETTES[data.palette] || PALETTES.ocean;
  let offset = 0;
  const segments = values
    .map((v, i) => {
      const ratio = Math.max(v, 0) / total;
      const from = offset;
      const to = offset + ratio * 100;
      offset = to;
      return `${colors[i % colors.length]} ${from}% ${to}%`;
    })
    .join(', ');

  const labelsHtml = values
    .map((v, i) => {
      const pct = ((v / total) * 100).toFixed(1);
      return `<span class="inline-flex items-center gap-1 text-xs text-slate-600 dark:text-slate-300">
        <span class="inline-block h-2.5 w-2.5 rounded-full" style="background:${colors[i % colors.length]}"></span>
        ${labels[i] || `Item ${i + 1}`}: ${pct}%
      </span>`;
    })
    .join('');

  return `<div style="display:flex;flex-direction:column;align-items:center;gap:12px;padding:16px;">
    <div style="width:160px;height:160px;border-radius:50%;background:conic-gradient(${segments});border:1px solid rgba(148,163,184,0.3);"></div>
    <div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;">${labelsHtml}</div>
  </div>`;
}

function getNice(v: number, round: boolean): number {
  const sv = Math.max(v, 0.000001);
  const exp = Math.floor(Math.log10(sv));
  const frac = sv / Math.pow(10, exp);
  let nf: number;
  if (round) {
    if (frac < 1.5) nf = 1;
    else if (frac < 3) nf = 2;
    else if (frac < 7) nf = 5;
    else nf = 10;
  } else {
    if (frac <= 1) nf = 1;
    else if (frac <= 2) nf = 2;
    else if (frac <= 5) nf = 5;
    else nf = 10;
  }
  return nf * Math.pow(10, exp);
}

function fmtAxis(v: number): string {
  if (Math.abs(v) < 0.005) return '0';
  if (Math.abs(v) >= 1000) return Math.round(v).toLocaleString();
  if (Math.abs(v) >= 1) return Number(v.toFixed(0)).toString();
  return v.toFixed(2);
}
