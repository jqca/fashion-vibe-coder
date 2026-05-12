import React from 'react';

export type VizType =
  | 'trend' | 'inventory' | 'supplychain' | 'material' | 'size'
  | 'fitting' | 'design' | 'production' | 'color' | 'runway'
  | 'sustainable' | 'stylist' | 'textile' | 'fairtrade' | 'luxury'
  | 'logistics' | 'marketing' | 'quality' | 'collection' | 'resale'
  | 'fashionmedia';

const VIZ_MAP: Record<string, VizType> = {
  'trend-forecast': 'trend',
  'trend': 'trend',
  'inventory': 'inventory',
  'supply-chain': 'supplychain',
  'supplychain': 'supplychain',
  'material-blend': 'material',
  'material': 'material',
  'size-recommendation': 'size',
  'size': 'size',
  'virtual-fitting': 'fitting',
  'fitting': 'fitting',
  'design-generation': 'design',
  'design': 'design',
  'production-lot': 'production',
  'production': 'production',
  'color-palette': 'color',
  'color': 'color',
  'fashion-show': 'runway',
  'runway': 'runway',
  'sustainable': 'sustainable',
  'personal-stylist': 'stylist',
  'stylist': 'stylist',
  'textile': 'textile',
  'fair-trade': 'fairtrade',
  'fairtrade': 'fairtrade',
  'luxury-demand': 'luxury',
  'luxury': 'luxury',
  'apparel-logistics': 'logistics',
  'logistics': 'logistics',
  'd2c-marketing': 'marketing',
  'marketing': 'marketing',
  'fabric-quality': 'quality',
  'quality': 'quality',
  'collection-planning': 'collection',
  'collection': 'collection',
  'resale-price': 'resale',
  'resale': 'resale',
  'fashion-media': 'fashionmedia',
};

export function getVizType(id: string): VizType {
  for (const key of Object.keys(VIZ_MAP)) {
    if (id.includes(key)) return VIZ_MAP[key];
  }
  return 'trend';
}

type VizProps = {
  running: boolean;
  optimized: boolean;
  progress: number;
  optLevel: number;
  selectedNode: string | null;
  onNodeClick: (id: string) => void;
};

const C1 = '#EC4899';
const C2 = '#F9A8D4';
const BG = '#0a1628';
const TX = '#f8f9fa';
const MU = '#8e9aaf';

/* ---- trend: SNS trend wave graph ---- */
const TrendViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const pts = Array.from({ length: 14 }, (_, i) => {
    const x = 40 + i * 24;
    const base = optimized ? 70 + Math.sin(i * 0.6) * 30 + i * 3 : 120 - i * 2;
    return `${x},${base}`;
  });
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">トレンド予測AI</text>
      <line x1="40" y1="180" x2="370" y2="180" stroke={MU} strokeWidth="0.5" />
      <line x1="40" y1="30" x2="40" y2="180" stroke={MU} strokeWidth="0.5" />
      <polyline points={pts.join(' ')} fill="none" stroke={C1} strokeWidth={optimized ? 2 : 1.2} opacity={optimized ? 0.9 : 0.5}>
        {running && <animate attributeName="opacity" values="0.3;0.9;0.3" dur="2.5s" repeatCount="indefinite" />}
      </polyline>
      {optimized && <polyline points={pts.map((p, i) => { const [x] = p.split(','); return `${x},${90 + Math.cos(i * 0.5) * 20}`; }).join(' ')} fill="none" stroke="#2dd4bf" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.6" />}
      <circle cx="40" cy={120} r="3" fill={C1} onClick={() => onNodeClick('0')} style={{ cursor: 'pointer' }} />
      <text x="200" y="198" fill={MU} fontSize="7" textAnchor="middle">{optimized ? '予測精度 92.3%' : 'SNSデータ解析中'}</text>
    </g>
  );
};

/* ---- inventory: warehouse stock grid ---- */
const InventoryViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const items = Array.from({ length: 20 }, (_, i) => ({
    x: 50 + (i % 5) * 65,
    y: 40 + Math.floor(i / 5) * 40,
    stock: optimized ? (i % 3 === 0 ? 'low' : 'ok') : 'unknown',
  }));
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">在庫最適化AI</text>
      {items.map((it, i) => {
        const col = optimized ? (it.stock === 'low' ? '#ff4444' : '#2dd4bf') : MU;
        return (
          <rect key={i} x={it.x} y={it.y} width="50" height="28" rx="4"
            fill={col} opacity={optimized ? 0.35 : 0.1}
            stroke={col} strokeWidth="0.8"
            onClick={() => onNodeClick(String(i))} style={{ cursor: 'pointer' }}>
            {running && <animate attributeName="opacity" values="0.08;0.35;0.08" dur={`${1.5 + i * 0.04}s`} repeatCount="indefinite" />}
          </rect>
        );
      })}
      <text x="200" y="210" fill={MU} fontSize="8" textAnchor="middle">{optimized ? '欠品率 -67% 達成' : '在庫データ待機'}</text>
    </g>
  );
};

/* ---- supplychain: node network ---- */
const SupplyChainViz: React.FC<VizProps> = ({ running, optimized, selectedNode, onNodeClick }) => {
  const nodes = [[80, 70], [200, 50], [320, 80], [120, 150], [260, 145]];
  const edges: [number, number][] = [[0, 1], [1, 2], [0, 3], [1, 4], [3, 4], [2, 4]];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">サプライチェーン最適化</text>
      {edges.map(([a, b], i) => {
        const active = optimized && (i === 0 || i === 3 || i === 4);
        return (
          <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]}
            stroke={active ? '#2dd4bf' : MU} strokeWidth={active ? 2.5 : 1} opacity={active ? 0.7 : 0.2}>
            {running && <animate attributeName="opacity" values="0.15;0.6;0.15" dur="2s" repeatCount="indefinite" />}
          </line>
        );
      })}
      {nodes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={selectedNode === String(i) ? 8 : 5}
          fill={selectedNode === String(i) ? '#eab308' : C1} opacity="0.8"
          onClick={() => onNodeClick(String(i))} style={{ cursor: 'pointer' }}>
          {running && <animate attributeName="opacity" values="0.4;1;0.4" dur={`${1 + i * 0.2}s`} repeatCount="indefinite" />}
        </circle>
      ))}
      <text x="200" y="200" fill={MU} fontSize="8" textAnchor="middle">{optimized ? 'リードタイム -38%' : 'ネットワーク解析中'}</text>
    </g>
  );
};

/* ---- material: blend composition bars ---- */
const MaterialViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const mats = [
    { label: 'シルク', h: 50 }, { label: 'コットン', h: 65 }, { label: 'ポリエステル', h: 40 },
    { label: 'ウール', h: 30 }, { label: 'リネン', h: 25 },
  ];
  let cumY = 30;
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">素材配合最適化</text>
      {mats.map((m, i) => {
        const h = optimized ? m.h * 0.82 : m.h;
        const y = cumY;
        cumY += h + 4;
        const col = optimized ? '#2dd4bf' : C1;
        return (
          <g key={i} onClick={() => onNodeClick(String(i))} style={{ cursor: 'pointer' }}>
            <rect x="80" y={y} width={optimized ? 220 : 200} height={h} rx="3" fill={col} opacity={optimized ? 0.5 : 0.25}>
              {running && <animate attributeName="opacity" values="0.15;0.5;0.15" dur={`${1.5 + i * 0.2}s`} repeatCount="indefinite" />}
            </rect>
            <text x="70" y={y + h / 2 + 4} fill={MU} fontSize="7" textAnchor="end">{m.label}</text>
            {optimized && <text x={310} y={y + h / 2 + 4} fill="#2dd4bf" fontSize="7">最適</text>}
          </g>
        );
      })}
    </g>
  );
};

/* ---- size: body measurement scatter ---- */
const SizeViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const pts = [[80, 60], [120, 90], [160, 70], [200, 110], [240, 80], [280, 130], [320, 95], [140, 140], [220, 50], [300, 160]];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">サイズレコメンドAI</text>
      <line x1="40" y1="180" x2="370" y2="180" stroke={MU} strokeWidth="0.5" />
      <line x1="40" y1="30" x2="40" y2="180" stroke={MU} strokeWidth="0.5" />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={optimized ? 6 : 4}
          fill={optimized ? (i % 3 === 0 ? C1 : '#2dd4bf') : MU}
          opacity={optimized ? 0.7 : 0.3}
          onClick={() => onNodeClick(String(i))} style={{ cursor: 'pointer' }}>
          {running && <animate attributeName="r" values="3;6;3" dur={`${1.2 + i * 0.1}s`} repeatCount="indefinite" />}
        </circle>
      ))}
      <text x="200" y="208" fill={MU} fontSize="8" textAnchor="middle">{optimized ? '返品率 -52%' : '体型データ収集中'}</text>
    </g>
  );
};

/* ---- fitting: virtual mannequin ---- */
const FittingViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">バーチャル試着AI</text>
      <ellipse cx="200" cy="55" rx="18" ry="22" fill="none" stroke={optimized ? C1 : MU} strokeWidth="1.5" opacity={optimized ? 0.7 : 0.3} onClick={() => onNodeClick('head')} style={{ cursor: 'pointer' }}>
        {running && <animate attributeName="opacity" values="0.2;0.7;0.2" dur="1.8s" repeatCount="indefinite" />}
      </ellipse>
      <line x1="200" y1="77" x2="200" y2="140" stroke={optimized ? C1 : MU} strokeWidth="2" opacity={optimized ? 0.6 : 0.3} />
      <line x1="200" y1="90" x2="160" y2="120" stroke={optimized ? C1 : MU} strokeWidth="1.5" opacity={optimized ? 0.6 : 0.3} />
      <line x1="200" y1="90" x2="240" y2="120" stroke={optimized ? C1 : MU} strokeWidth="1.5" opacity={optimized ? 0.6 : 0.3} />
      <line x1="200" y1="140" x2="170" y2="185" stroke={optimized ? C1 : MU} strokeWidth="1.5" opacity={optimized ? 0.6 : 0.3} />
      <line x1="200" y1="140" x2="230" y2="185" stroke={optimized ? C1 : MU} strokeWidth="1.5" opacity={optimized ? 0.6 : 0.3} />
      {optimized && <rect x="170" y="82" width="60" height="55" rx="4" fill={C2} opacity="0.2" stroke={C1} strokeWidth="1" strokeDasharray="3 2" />}
      {optimized && <text x="200" y="112" fill={C1} fontSize="7" textAnchor="middle">フィット済</text>}
      <text x="200" y="208" fill={MU} fontSize="8" textAnchor="middle">{optimized ? 'フィット率 94.7%' : '3Dスキャン待機'}</text>
    </g>
  );
};

/* ---- design: generative pattern grid ---- */
const DesignViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const grid = 4;
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">デザイン生成AI</text>
      {Array.from({ length: grid }).flatMap((_, r) =>
        Array.from({ length: grid }).map((_, c) => {
          const idx = r * grid + c;
          const x = 70 + c * 70;
          const y = 40 + r * 40;
          const col = optimized ? (idx % 5 === 0 ? C1 : '#2dd4bf') : MU;
          return (
            <rect key={idx} x={x} y={y} width="55" height="32" rx="6"
              fill={col} opacity={optimized ? 0.35 : 0.1}
              stroke={col} strokeWidth="0.8"
              onClick={() => onNodeClick(String(idx))} style={{ cursor: 'pointer' }}>
              {running && <animate attributeName="opacity" values="0.08;0.35;0.08" dur={`${1.5 + idx * 0.06}s`} repeatCount="indefinite" />}
            </rect>
          );
        })
      )}
      <text x="200" y="210" fill={MU} fontSize="8" textAnchor="middle">{optimized ? '16パターン生成完了' : 'デザインAI待機'}</text>
    </g>
  );
};

/* ---- production: Gantt chart bars ---- */
const ProductionViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const tasks = [
    { label: '裁断', x: 40, w: 80 }, { label: '縫製', x: 100, w: 100 },
    { label: '仕上', x: 160, w: 70 }, { label: '検品', x: 200, w: 90 },
    { label: '出荷', x: 280, w: 50 },
  ];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">生産ロット最適化</text>
      {tasks.map((t, i) => {
        const y = 40 + i * 32;
        const w = optimized ? t.w * 0.75 : t.w;
        const col = optimized ? '#2dd4bf' : C1;
        return (
          <g key={i} onClick={() => onNodeClick(String(i))} style={{ cursor: 'pointer' }}>
            <text x="30" y={y + 14} fill={MU} fontSize="7" textAnchor="end">{t.label}</text>
            <rect x={t.x} y={y} width={w} height="20" rx="3" fill={col} opacity={optimized ? 0.6 : 0.3}>
              {running && <animate attributeName="width" values={`${w * 0.5};${w};${w * 0.5}`} dur="2s" repeatCount="indefinite" />}
            </rect>
          </g>
        );
      })}
      <line x1="40" y1="200" x2="350" y2="200" stroke={MU} strokeWidth="0.5" />
      <text x="200" y="210" fill={MU} fontSize="7" textAnchor="middle">{optimized ? '生産リードタイム -25%' : '工程計算待機'}</text>
    </g>
  );
};

/* ---- color: palette circles ---- */
const ColorViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const colors = ['#EC4899', '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#6366F1', '#14B8A6'];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">カラーパレット最適化</text>
      {colors.map((c, i) => {
        const x = 60 + (i % 4) * 80;
        const y = 60 + Math.floor(i / 4) * 70;
        return (
          <g key={i} onClick={() => onNodeClick(String(i))} style={{ cursor: 'pointer' }}>
            <circle cx={x} cy={y} r={optimized ? 22 : 16} fill={optimized ? c : MU} opacity={optimized ? 0.6 : 0.2}>
              {running && <animate attributeName="r" values="14;22;14" dur={`${1.5 + i * 0.2}s`} repeatCount="indefinite" />}
            </circle>
            {optimized && <circle cx={x} cy={y} r="26" fill="none" stroke={c} strokeWidth="1" opacity="0.3" />}
          </g>
        );
      })}
      <text x="200" y="200" fill={MU} fontSize="8" textAnchor="middle">{optimized ? '売上相関 +34%' : 'カラー分析待機'}</text>
    </g>
  );
};

/* ---- runway: fashion show timeline ---- */
const RunwayViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const shows = [[80, 80], [160, 100], [240, 70], [320, 110], [120, 150], [280, 140]];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">ファッションショー最適化</text>
      <line x1="40" y1="100" x2="360" y2="100" stroke={optimized ? C2 : MU} strokeWidth="1" strokeDasharray="4 3" opacity="0.3" />
      {shows.map(([x, y], i) => {
        const col = optimized ? (i < 3 ? '#2dd4bf' : C1) : MU;
        return (
          <g key={i} onClick={() => onNodeClick(String(i))} style={{ cursor: 'pointer' }}>
            <rect x={x - 15} y={y - 15} width="30" height="30" rx="6" fill={col} opacity={optimized ? 0.4 : 0.12}>
              {running && <animate attributeName="opacity" values="0.08;0.4;0.08" dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite" />}
            </rect>
            {optimized && <text x={x} y={y + 4} fill={TX} fontSize="7" textAnchor="middle">{`L${i + 1}`}</text>}
          </g>
        );
      })}
      <text x="200" y="200" fill={MU} fontSize="8" textAnchor="middle">{optimized ? '集客効果 +45%' : 'ショー構成待機'}</text>
    </g>
  );
};

/* ---- sustainable: eco material layers ---- */
const SustainableViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const layers = [
    { y: 40, h: 25, label: 'オーガニック綿', col: '#10B981' },
    { y: 70, h: 20, label: 'リサイクルPET', col: C1 },
    { y: 95, h: 25, label: '竹繊維', col: '#F59E0B' },
    { y: 125, h: 30, label: '麻', col: '#6366F1' },
    { y: 160, h: 25, label: 'テンセル', col: '#14B8A6' },
  ];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">サステナブル素材最適化</text>
      {layers.map((l, i) => (
        <g key={i} onClick={() => onNodeClick(String(i))} style={{ cursor: 'pointer' }}>
          <rect x="60" y={l.y} width="280" height={l.h} fill={optimized ? l.col : MU} opacity={optimized ? 0.3 : 0.12} stroke={optimized ? l.col : MU} strokeWidth="0.8">
            {running && <animate attributeName="opacity" values="0.08;0.3;0.08" dur={`${1.5 + i * 0.2}s`} repeatCount="indefinite" />}
          </rect>
          <text x="50" y={l.y + l.h / 2 + 4} fill={MU} fontSize="7" textAnchor="end">{l.label}</text>
        </g>
      ))}
      {optimized && <text x="200" y="200" fill="#2dd4bf" fontSize="8" textAnchor="middle">CO2 -42% 達成</text>}
      {!optimized && <text x="200" y="200" fill={MU} fontSize="8" textAnchor="middle">環境負荷計算待機</text>}
    </g>
  );
};

/* ---- stylist: personal style radar ---- */
const StylistViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const axes = ['カジュアル', 'エレガント', 'モード', 'スポーティ', 'ナチュラル'];
  const center = [200, 110];
  const r = 70;
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">パーソナルスタイリストAI</text>
      {axes.map((a, i) => {
        const angle = (i * 2 * Math.PI) / axes.length - Math.PI / 2;
        const x = center[0] + r * Math.cos(angle);
        const y = center[1] + r * Math.sin(angle);
        const valR = optimized ? r * (0.5 + (i * 0.1)) : r * 0.3;
        const vx = center[0] + valR * Math.cos(angle);
        const vy = center[1] + valR * Math.sin(angle);
        return (
          <g key={i} onClick={() => onNodeClick(String(i))} style={{ cursor: 'pointer' }}>
            <line x1={center[0]} y1={center[1]} x2={x} y2={y} stroke={MU} strokeWidth="0.5" opacity="0.3" />
            <text x={x + 10 * Math.cos(angle)} y={y + 10 * Math.sin(angle) + 4} fill={MU} fontSize="7" textAnchor="middle">{a}</text>
            <circle cx={vx} cy={vy} r="4" fill={optimized ? C1 : MU} opacity={optimized ? 0.8 : 0.3}>
              {running && <animate attributeName="r" values="3;5;3" dur={`${1 + i * 0.2}s`} repeatCount="indefinite" />}
            </circle>
          </g>
        );
      })}
      <text x="200" y="205" fill={MU} fontSize="8" textAnchor="middle">{optimized ? '満足度 91%' : 'スタイル分析中'}</text>
    </g>
  );
};

/* ---- textile: weave pattern grid ---- */
const TextileViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const bars = 8;
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">テキスタイルデザインAI</text>
      {Array.from({ length: bars }).map((_, i) => {
        const x = 50 + i * 38;
        const col = optimized ? (i % 3 === 0 ? '#2dd4bf' : C1) : MU;
        return (
          <g key={`v${i}`} onClick={() => onNodeClick(String(i))} style={{ cursor: 'pointer' }}>
            <line x1={x} y1="35" x2={x} y2="185" stroke={col} strokeWidth={optimized ? 2 : 1} opacity={optimized ? 0.7 : 0.3}>
              {running && <animate attributeName="opacity" values="0.2;0.7;0.2" dur={`${1.5 + i * 0.15}s`} repeatCount="indefinite" />}
            </line>
          </g>
        );
      })}
      {Array.from({ length: 5 }).map((_, i) => (
        <line key={`h${i}`} x1="50" y1={50 + i * 32} x2="316" y2={50 + i * 32} stroke={optimized ? C2 : MU} strokeWidth={optimized ? 1.5 : 0.8} opacity={optimized ? 0.5 : 0.2} />
      ))}
      <text x="200" y="205" fill={MU} fontSize="8" textAnchor="middle">{optimized ? 'パターン生成完了' : 'テキスタイル解析待機'}</text>
    </g>
  );
};

/* ---- fairtrade: supply chain fairness ---- */
const FairTradeViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const nodes = [[80, 60], [160, 50], [240, 65], [320, 55], [80, 120], [160, 115], [240, 125], [320, 118], [80, 175], [160, 170], [240, 180], [320, 172]];
  const edges: [number, number][] = [[0, 1], [1, 2], [2, 3], [4, 5], [5, 6], [6, 7], [0, 4], [1, 5], [2, 6], [3, 7], [4, 8], [5, 9], [6, 10], [7, 11]];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">フェアトレード管理</text>
      {edges.map(([a, b], i) => (
        <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]}
          stroke={optimized ? '#2dd4bf' : MU} strokeWidth={optimized ? 1.2 : 0.6} opacity={optimized ? 0.5 : 0.2}>
          {running && <animate attributeName="opacity" values="0.15;0.5;0.15" dur={`${1.5 + i * 0.1}s`} repeatCount="indefinite" />}
        </line>
      ))}
      {nodes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={4} fill={optimized ? C1 : MU} opacity={optimized ? 0.7 : 0.3}
          onClick={() => onNodeClick(String(i))} style={{ cursor: 'pointer' }}>
          {running && <animate attributeName="r" values="3;5;3" dur={`${1 + i * 0.1}s`} repeatCount="indefinite" />}
        </circle>
      ))}
      <text x="200" y="208" fill={MU} fontSize="8" textAnchor="middle">{optimized ? '公正取引率 98%' : 'サプライヤー追跡中'}</text>
    </g>
  );
};

/* ---- luxury: demand forecast curve ---- */
const LuxuryViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const pts = Array.from({ length: 12 }, (_, i) => {
    const x = 50 + i * 28;
    const base = optimized ? 60 + Math.sin(i * 0.7) * 25 + i * 5 : 130 - i * 3;
    return `${x},${base}`;
  });
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">ラグジュアリー需要予測</text>
      <line x1="40" y1="180" x2="370" y2="180" stroke={MU} strokeWidth="0.5" />
      <line x1="40" y1="30" x2="40" y2="180" stroke={MU} strokeWidth="0.5" />
      <polyline points={pts.join(' ')} fill="none" stroke={C1} strokeWidth={optimized ? 2 : 1.2} opacity={optimized ? 0.9 : 0.5}>
        {running && <animate attributeName="opacity" values="0.3;0.9;0.3" dur="2.5s" repeatCount="indefinite" />}
      </polyline>
      {optimized && <polyline points={pts.map((p, i) => { const [x] = p.split(','); return `${x},${80 + Math.cos(i * 0.6) * 18}`; }).join(' ')} fill="none" stroke="#2dd4bf" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.6" />}
      {[2, 5, 8].map(i => (
        <circle key={i} cx={50 + i * 28} cy={optimized ? 60 + Math.sin(i * 0.7) * 25 + i * 5 : 130 - i * 3} r="4" fill={C1} opacity="0.7"
          onClick={() => onNodeClick(String(i))} style={{ cursor: 'pointer' }} />
      ))}
      <text x="200" y="198" fill={MU} fontSize="7" textAnchor="middle">{optimized ? '予測精度 89% / 在庫回転 +41%' : 'VIP購買データ解析中'}</text>
    </g>
  );
};

/* ---- logistics: distribution network ---- */
const LogisticsViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const hubs = [[100, 80], [200, 60], [300, 90], [150, 150], [250, 140]];
  const routes: [number, number][] = [[0, 1], [1, 2], [0, 3], [1, 4], [3, 4], [2, 4]];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">アパレル物流最適化</text>
      {routes.map(([a, b], i) => (
        <line key={i} x1={hubs[a][0]} y1={hubs[a][1]} x2={hubs[b][0]} y2={hubs[b][1]}
          stroke={optimized ? '#2dd4bf' : MU} strokeWidth={optimized ? 2 : 1} opacity={optimized ? 0.6 : 0.2}>
          {running && <animate attributeName="opacity" values="0.15;0.6;0.15" dur="2s" repeatCount="indefinite" />}
        </line>
      ))}
      {hubs.map(([x, y], i) => (
        <g key={i} onClick={() => onNodeClick(String(i))} style={{ cursor: 'pointer' }}>
          <rect x={x - 12} y={y - 12} width="24" height="24" rx="4" fill={optimized ? C1 : MU} opacity={optimized ? 0.5 : 0.2}>
            {running && <animate attributeName="opacity" values="0.15;0.5;0.15" dur={`${1.2 + i * 0.2}s`} repeatCount="indefinite" />}
          </rect>
          {optimized && <text x={x} y={y + 4} fill={TX} fontSize="7" textAnchor="middle">{`DC${i + 1}`}</text>}
        </g>
      ))}
      <text x="200" y="200" fill={MU} fontSize="8" textAnchor="middle">{optimized ? '配送コスト -33%' : '物流計算待機'}</text>
    </g>
  );
};

/* ---- marketing: D2C funnel ---- */
const MarketingViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const funnel = [
    { label: '認知', w: 300, y: 35 },
    { label: '興味', w: 240, y: 70 },
    { label: '検討', w: 180, y: 105 },
    { label: '購入', w: 120, y: 140 },
    { label: 'リピート', w: 80, y: 175 },
  ];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">D2Cマーケティング最適化</text>
      {funnel.map((f, i) => {
        const x = 200 - f.w / 2;
        const col = optimized ? (i < 3 ? '#2dd4bf' : C1) : MU;
        return (
          <g key={i} onClick={() => onNodeClick(String(i))} style={{ cursor: 'pointer' }}>
            <rect x={x} y={f.y} width={f.w} height="28" rx="4" fill={col} opacity={optimized ? 0.35 : 0.12}>
              {running && <animate attributeName="opacity" values="0.08;0.35;0.08" dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite" />}
            </rect>
            <text x="200" y={f.y + 18} fill={TX} fontSize="8" textAnchor="middle">{f.label}</text>
          </g>
        );
      })}
      <text x="200" y="210" fill={MU} fontSize="8" textAnchor="middle">{optimized ? 'CVR +2.8倍' : 'ファネル分析待機'}</text>
    </g>
  );
};

/* ---- quality: fabric inspection grid ---- */
const QualityViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const grid = 5;
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">生地品質検査AI</text>
      {Array.from({ length: grid }).flatMap((_, r) =>
        Array.from({ length: grid }).map((_, c) => {
          const idx = r * grid + c;
          const x = 60 + c * 60;
          const y = 35 + r * 34;
          const pass = optimized ? idx % 7 !== 3 : true;
          const col = pass ? '#2dd4bf' : '#ff4444';
          return (
            <rect key={idx} x={x} y={y} width="50" height="28" rx="4"
              fill={optimized ? col : MU} opacity={optimized ? 0.35 : 0.1}
              stroke={optimized ? col : 'none'} strokeWidth="0.8"
              onClick={() => onNodeClick(String(idx))} style={{ cursor: 'pointer' }}>
              {running && <animate attributeName="opacity" values="0.08;0.35;0.08" dur={`${1.5 + idx * 0.04}s`} repeatCount="indefinite" />}
            </rect>
          );
        })
      )}
      <text x="200" y="210" fill={MU} fontSize="8" textAnchor="middle">{optimized ? '不良検出率 99.2%' : '品質検査待機'}</text>
    </g>
  );
};

/* ---- collection: seasonal plan blocks ---- */
const CollectionViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const blocks = [
    { x: 60, y: 140, w: 50, h: 40 }, { x: 120, y: 140, w: 50, h: 40 },
    { x: 180, y: 140, w: 50, h: 40 }, { x: 240, y: 140, w: 50, h: 40 },
    { x: 80, y: 90, w: 50, h: 40 }, { x: 160, y: 90, w: 50, h: 40 },
    { x: 240, y: 90, w: 50, h: 40 }, { x: 120, y: 40, w: 50, h: 40 },
    { x: 200, y: 40, w: 50, h: 40 },
  ];
  const labels = ['SS', 'AW', 'RS', 'CR', 'PF', 'HC', 'CO', 'LTD', 'FW'];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">コレクション計画最適化</text>
      {blocks.map((b, i) => {
        const col = optimized ? (i < 4 ? '#2dd4bf' : (i < 7 ? C1 : C2)) : MU;
        return (
          <g key={i} onClick={() => onNodeClick(String(i))} style={{ cursor: 'pointer' }}>
            <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="3"
              fill={col} opacity={optimized ? 0.35 : 0.12} stroke={col} strokeWidth="1">
              {running && <animate attributeName="opacity" values="0.08;0.35;0.08" dur={`${1 + i * 0.15}s`} repeatCount="indefinite" />}
            </rect>
            {optimized && <text x={b.x + b.w / 2} y={b.y + b.h / 2 + 4} fill={TX} fontSize="7" textAnchor="middle">{labels[i]}</text>}
          </g>
        );
      })}
      <text x="200" y="200" fill={MU} fontSize="8" textAnchor="middle">{optimized ? '売上予測精度 +27%' : 'コレクション設計待機'}</text>
    </g>
  );
};

/* ---- resale: price prediction curve ---- */
const ResaleViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const x = 50 + i * 32;
    const base = optimized ? 160 - i * 12 - Math.sin(i * 0.8) * 15 : 150 - i * 5;
    return `${x},${base}`;
  });
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">リセール価格予測AI</text>
      <line x1="40" y1="180" x2="370" y2="180" stroke={MU} strokeWidth="0.5" />
      <line x1="40" y1="30" x2="40" y2="180" stroke={MU} strokeWidth="0.5" />
      <polyline points={pts.join(' ')} fill="none" stroke={C1} strokeWidth={optimized ? 2 : 1.2} opacity={optimized ? 0.9 : 0.5}>
        {running && <animate attributeName="opacity" values="0.3;0.9;0.3" dur="2.5s" repeatCount="indefinite" />}
      </polyline>
      {optimized && <polyline points={pts.map((p, i) => { const [x] = p.split(','); return `${x},${140 - i * 10}`; }).join(' ')} fill="none" stroke="#2dd4bf" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.6" />}
      {[1, 4, 7].map(i => (
        <circle key={i} cx={50 + i * 32} cy={optimized ? 160 - i * 12 - Math.sin(i * 0.8) * 15 : 150 - i * 5} r="4" fill={C1} opacity="0.7"
          onClick={() => onNodeClick(String(i))} style={{ cursor: 'pointer' }} />
      ))}
      <text x="200" y="198" fill={MU} fontSize="7" textAnchor="middle">{optimized ? '価格予測誤差 ±3.2%' : '市場データ解析中'}</text>
    </g>
  );
};

/* ---- fashionmedia: media influence radial dashboard ---- */
const FashionMediaViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const channels = [
    { label: 'Instagram', angle: -90, reach: 0.92, color: '#E1306C' },
    { label: 'TikTok',    angle: -30, reach: 0.85, color: '#00f2ea' },
    { label: 'YouTube',   angle:  30, reach: 0.70, color: '#FF0000' },
    { label: 'X/Twitter', angle:  90, reach: 0.55, color: '#1DA1F2' },
    { label: 'Pinterest', angle: 150, reach: 0.63, color: '#E60023' },
    { label: 'Magazine',  angle: 210, reach: 0.48, color: '#F59E0B' },
  ];
  const cx = 200, cy = 108, maxR = 72;
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">ファッションメディア最適化</text>
      {/* concentric guide rings */}
      {[0.33, 0.66, 1.0].map((s, i) => (
        <circle key={i} cx={cx} cy={cy} r={maxR * s} fill="none"
          stroke={MU} strokeWidth="0.4" strokeDasharray="3 4" opacity="0.2" />
      ))}
      {/* spokes + channel bubbles */}
      {channels.map((ch, i) => {
        const rad = (ch.angle * Math.PI) / 180;
        const dist = optimized ? maxR * ch.reach : maxR * 0.35;
        const bx = cx + dist * Math.cos(rad);
        const by = cy + dist * Math.sin(rad);
        const bubbleR = optimized ? 8 + ch.reach * 10 : 6;
        const col = optimized ? ch.color : MU;
        return (
          <g key={i} onClick={() => onNodeClick(String(i))} style={{ cursor: 'pointer' }}>
            <line x1={cx} y1={cy} x2={bx} y2={by}
              stroke={col} strokeWidth={optimized ? 1.4 : 0.6} opacity={optimized ? 0.5 : 0.2}>
              {running && <animate attributeName="opacity" values="0.15;0.5;0.15" dur={`${1.5 + i * 0.25}s`} repeatCount="indefinite" />}
            </line>
            <circle cx={bx} cy={by} r={bubbleR} fill={col} opacity={optimized ? 0.55 : 0.15}>
              {running && <animate attributeName="r" values={`${bubbleR - 2};${bubbleR + 2};${bubbleR - 2}`} dur={`${1.8 + i * 0.2}s`} repeatCount="indefinite" />}
            </circle>
            {optimized && (
              <text x={bx} y={by + bubbleR + 11} fill={MU} fontSize="6" textAnchor="middle">{ch.label}</text>
            )}
          </g>
        );
      })}
      {/* center hub */}
      <circle cx={cx} cy={cy} r={optimized ? 12 : 8} fill={optimized ? C1 : MU} opacity={optimized ? 0.7 : 0.25}>
        {running && <animate attributeName="opacity" values="0.25;0.7;0.25" dur="2s" repeatCount="indefinite" />}
      </circle>
      {optimized && <text x={cx} y={cy + 3} fill={TX} fontSize="6" textAnchor="middle">HUB</text>}
      <text x="200" y="208" fill={MU} fontSize="8" textAnchor="middle">
        {optimized ? 'メディアROI +58% / エンゲージメント +73%' : 'メディアチャネル分析中'}
      </text>
    </g>
  );
};

/* ---- registry & main component ---- */

const VIZ_COMPONENTS: Record<VizType, React.FC<VizProps>> = {
  trend: TrendViz, inventory: InventoryViz, supplychain: SupplyChainViz,
  material: MaterialViz, size: SizeViz, fitting: FittingViz,
  design: DesignViz, production: ProductionViz, color: ColorViz,
  runway: RunwayViz, sustainable: SustainableViz, stylist: StylistViz,
  textile: TextileViz, fairtrade: FairTradeViz, luxury: LuxuryViz,
  logistics: LogisticsViz, marketing: MarketingViz, quality: QualityViz,
  collection: CollectionViz, resale: ResaleViz, fashionmedia: FashionMediaViz,
};

export default function VizCanvas({
  vizType, running, optimized, progress, optLevel, selectedNode, onNodeClick,
}: VizProps & { vizType: VizType }) {
  const Comp = VIZ_COMPONENTS[vizType];
  return (
    <svg viewBox="0 0 400 220" width="100%" style={{ display: 'block' }}>
      <rect width="400" height="220" fill={BG} rx="8" />
      <Comp running={running} optimized={optimized} progress={progress}
        optLevel={optLevel} selectedNode={selectedNode} onNodeClick={onNodeClick} />
      {running && (
        <g>
          <rect x="10" y="212" width="380" height="4" rx="2" fill="rgba(255,255,255,0.08)" />
          <rect x="10" y="212" width={380 * (progress / 100)} height="4" rx="2" fill={C1} opacity="0.7" />
        </g>
      )}
    </svg>
  );
}
