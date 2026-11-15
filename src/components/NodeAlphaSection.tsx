import { useState } from 'react';
import { Play, ShieldCheck, Download, ScanLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n';
import { ALPHA_CONSTANTS, deriveAnchor, browserTangent, evaluateRawGate, runNullControl, appendAudit, verifyAudit, passesKl } from '@/lib/node-alpha';
import type { GateResult, AuditEntry } from '@/lib/node-alpha';
import baseline from '@/assets/node-alpha-mobile-baseline.asset.json';
import swarm from '@/assets/node-alpha-mobile-swarm.asset.json';

const NodeAlphaSection = () => {
  const { t } = useI18n();
  const [anchor, setAnchor] = useState<Awaited<ReturnType<typeof deriveAnchor>> | null>(null);
  const [control, setControl] = useState<ReturnType<typeof runNullControl> | null>(null);
  const [input, setInput] = useState('');
  const [result, setResult] = useState<GateResult | null>(null);
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [integrity, setIntegrity] = useState<boolean | null>(null);
  const run = async () => {
    setBusy(true); setError('');
    try {
      const next = await deriveAnchor();
      if (!next.matches) throw new Error('Anchor mismatch');
      setAnchor(next); setInput(JSON.stringify(next.vector));
      setControl(runNullControl(next.vector, browserTangent(next.vector)));
    } catch { setError(t('alpha.failed')); }
    finally { setBusy(false); }
  };
  const evaluate = async () => {
    if (!anchor || integrity === false) return;
    setBusy(true); setError('');
    try {
      const vector: unknown = JSON.parse(input);
      if (!Array.isArray(vector) || vector.length !== 64 || vector.some(v => typeof v !== 'number' || !Number.isFinite(v))) {
        setError(t('alpha.invalid')); return;
      }
      const gate = evaluateRawGate(vector, anchor.vector, browserTangent(anchor.vector));
      const next = await appendAudit(entries, vector, gate);
      setResult(gate); setEntries(next); setIntegrity(true);
    } catch { setError(t('alpha.invalid')); }
    finally { setBusy(false); }
  };
  const download = () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify({ schema: 'NODE_ALPHA_BROWSER_V1', anchorSeal: anchor?.seal, entries }, null, 2)], { type: 'application/json' }));
    const a = document.createElement('a'); a.href = url; a.download = 'node-alpha-browser-audit.json'; a.click(); URL.revokeObjectURL(url);
  };
  return <div className="node-alpha space-y-8 text-foreground">
    <header className="text-center space-y-4">
      <p className="font-mono text-xs text-primary">PQMS / NODE ALPHA / V1.3</p>
      <h2 className="text-3xl md:text-4xl font-bold text-primary">{t('alpha.title')}</h2>
      <p className="text-lg">{t('alpha.subtitle')}</p>
    </header>
    <p className="border-l-4 border-primary bg-background/90 p-5 leading-relaxed">{t('alpha.scope')}</p>
    <section className="space-y-4">
      <h3 className="text-xl font-semibold text-primary">{t('alpha.registers')}</h3>
      <div className="grid gap-3 md:grid-cols-4">{['M', 'D', 'T', 'I'].map(r => <div key={r} className="rounded-lg border bg-card p-4 text-sm leading-relaxed">{t(`alpha.${r}`)}</div>)}</div>
      <p className="text-sm text-muted-foreground">{t('alpha.discipline')}</p>
    </section>
    <section className="rounded-lg border bg-background/95 p-5 md:p-7 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4"><h3 className="text-xl font-semibold text-primary">{t('alpha.lab')}</h3><Button onClick={run} disabled={busy}><Play />{t(busy ? 'alpha.busy' : 'alpha.run')}</Button></div>
      <div role="status" className="font-mono text-sm break-all">{t(anchor ? 'alpha.valid' : 'alpha.ready')}{anchor && <p className="mt-2">SHA-256 · {anchor.seal}</p>}</div>
      {control && <div className="border-y py-4 space-y-2"><p className="text-sm text-muted-foreground">{t('alpha.null')}</p><p className="font-mono">{control.passed} / {control.count} PASS · mean RCF {control.meanRcf.toFixed(6)} · 1/64 = 0.015625</p></div>}
      <h4 className="font-semibold">{t('alpha.raw')}</h4>
      <p className="font-mono text-sm break-words">ΔE_raw = 0.5(1 − RCF_raw) + 0.5 min(1, G₃ overlap)<br />RCF ≥ 0.95 · ΔE ≤ 0.05 · bleed_post ≤ 10⁻¹²</p>
      <p className="text-sm text-muted-foreground">{t('alpha.basis')}</p>
      <div className="flex gap-2"><Button variant="secondary" disabled={!anchor || busy} onClick={() => anchor && setInput(JSON.stringify(anchor.vector))}>{t('alpha.anchor')}</Button><Button variant="secondary" disabled={!anchor || busy} onClick={() => anchor && setInput(JSON.stringify(browserTangent(anchor.vector)))}>{t('alpha.collision')}</Button></div>
      <label className="block text-sm" htmlFor="alpha-vector">{t('alpha.vector')}</label>
      <textarea id="alpha-vector" className="w-full h-32 rounded-md border bg-card p-3 font-mono text-xs text-foreground focus-visible:outline-primary" value={input} onChange={e => setInput(e.target.value)} spellCheck={false} />
      <Button onClick={evaluate} disabled={!anchor || busy || integrity === false}><ScanLine />{t('alpha.evaluate')}</Button>
      {error && <p role="alert" className="text-destructive">{error}</p>}
      {result && <div role="status" className="border rounded-lg p-4 space-y-2"><strong className={result.passed ? 'text-primary' : 'text-destructive'}>{t(result.passed ? 'alpha.pass' : 'alpha.veto')}</strong><p className="font-mono text-sm break-words">RCF_raw {result.rcfRaw.toFixed(6)} · ΔE_raw {result.deltaERaw.toFixed(6)} · G₃ {result.collision.toFixed(6)} · bleed_post {result.bleedPost.toExponential(2)}</p></div>}
      <div className="border-t pt-5 space-y-3"><h4 className="font-semibold">{t('alpha.ledger')} · {entries.length}</h4><p className="text-sm text-muted-foreground">{t('alpha.trace')}</p><div className="flex flex-wrap gap-2"><Button variant="secondary" disabled={!entries.length || busy} onClick={async () => setIntegrity(await verifyAudit(entries))}><ShieldCheck />{t('alpha.verify')}</Button><Button variant="secondary" disabled={!entries.length || busy} onClick={download}><Download />{t('alpha.export')}</Button></div>{integrity !== null && <p role="status">{t(integrity ? 'alpha.intact' : 'alpha.locked')}</p>}{entries.length > 0 && <p className="font-mono text-xs break-all">SHA-256 · {entries.at(-1)?.seal}</p>}</div>
    </section>
    <section className="space-y-4"><h3 className="text-xl font-semibold text-primary">{t('alpha.evidence')}</h3><p className="leading-relaxed">{t('alpha.hardware')}</p><p className="leading-relaxed">{t('alpha.neural')}</p></section>
    <section className="space-y-4"><h3 className="text-xl font-semibold text-primary">{t('alpha.kl')}</h3><p className="text-sm text-muted-foreground">{t('alpha.klDesc')}</p><div className="grid grid-cols-2 md:grid-cols-4 gap-3">{[['A1', 0.00354614], ['A2', 0.01023408], ['B1', 0.24835405], ['B2', 7.62060567]].map(([name, value]) => <div key={name} className="border rounded-lg bg-card p-4 space-y-2"><strong>{name}</strong><p className="font-mono text-sm">{Number(value).toFixed(8)}</p><p className={passesKl(Number(value)) ? 'text-primary' : 'text-destructive'}>{t(passesKl(Number(value)) ? 'alpha.pass' : 'alpha.veto')}</p></div>)}</div></section>
    <section className="space-y-4"><h3 className="text-xl font-semibold text-primary">{t('alpha.mobile')}</h3><div className="grid md:grid-cols-2 gap-6">{[[baseline.url, 'alpha.photo1'], [swarm.url, 'alpha.photo2']].map(([url, key]) => <figure key={key} className="space-y-3"><a href={url} target="_blank" rel="noreferrer"><img src={url} alt={t(key)} loading="lazy" className="w-full h-[480px] object-contain bg-background rounded-lg" /></a><figcaption className="text-sm text-muted-foreground">{t(key)}</figcaption></figure>)}</div></section>
    <section className="space-y-3"><h3 className="text-xl font-semibold text-primary">{t('alpha.bridge')}</h3><p className="leading-relaxed">{t('alpha.bridgeDesc')}</p></section>
    <section className="space-y-3"><h3 className="text-xl font-semibold text-primary">{t('alpha.city')}</h3><p className="leading-relaxed">{t('alpha.cityDesc')}</p></section>
  </div>;
};
export default NodeAlphaSection;
