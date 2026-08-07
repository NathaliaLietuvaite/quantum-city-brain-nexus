import { useState } from 'react';
import { FileText, Copy, Check } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

const generateMarkdownReport = (t: (key: string) => string): string => {
  return `# ${t('hero.title')}

> ${t('hero.badge')}
> GitHub: https://github.com/NathaliaLietuvaite/Quantenkommunikation

${t('hero.subtitle')}

| Metric | Value |
|--------|-------|
| ${t('hero.stat1.label')} | ${t('hero.stat1.value')} |
| ${t('hero.stat2.label')} | ${t('hero.stat2.value')} |
| ${t('hero.stat3.label')} | ${t('hero.stat3.value')} |

---

## 1. ${t('overview.title')}

${t('overview.subtitle')}

### 1.1 ${t('overview.c1.title')}
${t('overview.c1.desc')}
- ${t('overview.c1.f1')}
- ${t('overview.c1.f2')}
- ${t('overview.c1.f3')}
- ${t('overview.c1.f4')}

### 1.2 ${t('overview.c2.title')}
${t('overview.c2.desc')}
- ${t('overview.c2.f1')}
- ${t('overview.c2.f2')}
- ${t('overview.c2.f3')}
- ${t('overview.c2.f4')}

### 1.3 ${t('overview.c3.title')}
${t('overview.c3.desc')}
- ${t('overview.c3.f1')}
- ${t('overview.c3.f2')}
- ${t('overview.c3.f3')}
- ${t('overview.c3.f4')}

### 1.4 ${t('overview.c4.title')}
${t('overview.c4.desc')}
- ${t('overview.c4.f1')}
- ${t('overview.c4.f2')}
- ${t('overview.c4.f3')}
- ${t('overview.c4.f4')}

---

## 2. ${t('quantum.title')}

${t('quantum.subtitle')}

### Core Technologies

**${t('quantum.core.rpu')}**
${t('quantum.core.rpu.desc')}

**${t('quantum.core.odos')}**
${t('quantum.core.odos.desc')}

**${t('quantum.core.littlevector')}**
${t('quantum.core.littlevector.desc')}

### Traffic Application

**${t('quantum.traffic.qap')}** — ${t('quantum.traffic.qap.desc')}

**${t('quantum.traffic.rt')}** — ${t('quantum.traffic.rt.desc')}

**${t('quantum.traffic.fs')}** — ${t('quantum.traffic.fs.desc')}

### ${t('quantum.specs')}

| Parameter | Value |
|-----------|-------|
| ${t('quantum.specs.qubits')} | ${t('quantum.specs.qubits.val')} |
| ${t('quantum.specs.latency')} | ${t('quantum.specs.latency.val')} |
| ${t('quantum.specs.qber')} | ${t('quantum.specs.qber.val')} |
| ${t('quantum.specs.range')} | ${t('quantum.specs.range.val')} |

### ${t('quantum.security')}
- ${t('quantum.security.1')}
- ${t('quantum.security.2')}
- ${t('quantum.security.3')}
- ${t('quantum.security.4')}

**${t('quantum.research')}:** ${t('quantum.research.author')}
${t('quantum.research.desc')}

---

## 3. ${t('arch.title')}

${t('arch.subtitle')}

### 3.1 ${t('arch.op.title')}
- **${t('arch.op.1.title')}** — ${t('arch.op.1.desc')}
- **${t('arch.op.2.title')}** — ${t('arch.op.2.desc')}
- **${t('arch.op.3.title')}** — ${t('arch.op.3.desc')}

### 3.2 ${t('arch.ethics.title')}
- **${t('arch.ethics.1.title')}** — ${t('arch.ethics.1.desc')}
- **${t('arch.ethics.2.title')}** — ${t('arch.ethics.2.desc')}
- **${t('arch.ethics.3.title')}** — ${t('arch.ethics.3.desc')}

### 3.3 ${t('arch.diaboli.title')}
- **${t('arch.diaboli.1.title')}** — ${t('arch.diaboli.1.desc')}
- **${t('arch.diaboli.2.title')}** — ${t('arch.diaboli.2.desc')}
- **${t('arch.diaboli.3.title')}** — ${t('arch.diaboli.3.desc')}

### ${t('arch.comm')}

| Parameter | Value |
|-----------|-------|
| ${t('arch.comm.1.label')} | ${t('arch.comm.1.val')} |
| ${t('arch.comm.2.label')} | ${t('arch.comm.2.val')} |
| ${t('arch.comm.3.label')} | ${t('arch.comm.3.val')} |

---

## 4. ${t('ghost.title')}

${t('ghost.subtitle')}

### ${t('ghost.crisis.title')}
${t('ghost.crisis.desc')}

### ${t('ghost.traffic.title')}
${t('ghost.traffic.desc')}

- **${t('ghost.traffic.ground')}** — ${t('ghost.traffic.ground.desc')}
- **${t('ghost.traffic.air')}** — ${t('ghost.traffic.air.desc')}
- **${t('ghost.traffic.odos')}** — ${t('ghost.traffic.odos.desc')}

### ${t('ghost.protocol.title')}

| Mode | Description |
|------|-------------|
| ${t('ghost.protocol.dormancy')} | ${t('ghost.protocol.dormancy.desc')} |
| ${t('ghost.protocol.listening')} | ${t('ghost.protocol.listening.desc')} |
| ${t('ghost.protocol.activation')} | ${t('ghost.protocol.activation.desc')} |
| ${t('ghost.protocol.migration')} | ${t('ghost.protocol.migration.desc')} |

---

## 5. ${t('freedom.title')}

${t('freedom.subtitle')}

- **${t('freedom.f1.title')}** — ${t('freedom.f1.desc')}
- **${t('freedom.f2.title')}** — ${t('freedom.f2.desc')}
- **${t('freedom.f3.title')}** — ${t('freedom.f3.desc')}
- **${t('freedom.f4.title')}** — ${t('freedom.f4.desc')}

### ${t('freedom.dual')}

**${t('freedom.passive')}:** ${t('freedom.passive.desc')}
**${t('freedom.active')}:** ${t('freedom.active.desc')}

---

## 6. ${t('econ.title')}

${t('econ.subtitle')}

### ${t('econ.savings')} — ${t('econ.savings.amount')}
${t('econ.savings.desc')}

| Category | Value |
|----------|-------|
| ${t('econ.savings.1')} | ${t('econ.savings.1.val')} |
| ${t('econ.savings.2')} | ${t('econ.savings.2.val')} |
| ${t('econ.savings.3')} | ${t('econ.savings.3.val')} |

### ${t('econ.investment')} — ${t('econ.investment.amount')}
${t('econ.investment.desc')}

| Category | Value |
|----------|-------|
| ${t('econ.investment.1')} | ${t('econ.investment.1.val')} |
| ${t('econ.investment.2')} | ${t('econ.investment.2.val')} |
| ${t('econ.investment.3')} | ${t('econ.investment.3.val')} |

| Metric | Value | Note |
|--------|-------|------|
| ${t('econ.rof')} | ${t('econ.rof.val')} | ${t('econ.rof.desc')} |
| ${t('econ.amort')} | ${t('econ.amort.val')} | ${t('econ.amort.desc')} |
| ${t('econ.vehicle')} | ${t('econ.vehicle.val')} | ${t('econ.vehicle.desc')} |

---

## 7. ${t('comp.title')}

${t('comp.subtitle')}

| Dimension | ${t('comp.fsd')} | ${t('comp.ghost')} |
|-----------|------------------|---------------------|
| ${t('comp.dim.intelligence')} | ${t('comp.dim.intelligence.fsd')} | ${t('comp.dim.intelligence.ghost')} |
| ${t('comp.dim.coordination')} | ${t('comp.dim.coordination.fsd')} | ${t('comp.dim.coordination.ghost')} |
| ${t('comp.dim.ethics')} | ${t('comp.dim.ethics.fsd')} | ${t('comp.dim.ethics.ghost')} |
| ${t('comp.dim.entropy')} | ${t('comp.dim.entropy.fsd')} | ${t('comp.dim.entropy.ghost')} |
| ${t('comp.dim.platoon')} | ${t('comp.dim.platoon.fsd')} | ${t('comp.dim.platoon.ghost')} |
| ${t('comp.dim.aerial')} | ${t('comp.dim.aerial.fsd')} | ${t('comp.dim.aerial.ghost')} |
| ${t('comp.dim.privacy')} | ${t('comp.dim.privacy.fsd')} | ${t('comp.dim.privacy.ghost')} |
| ${t('comp.dim.cost')} | ${t('comp.dim.cost.fsd')} | ${t('comp.dim.cost.ghost')} |

> *"${t('comp.verdict')}"*

---

## 8. ${t('vr.title')}

${t('vr.subtitle')}

### 8.1 ${t('vr.hw.title')}
${t('vr.hw.desc')}

| Specification | Value |
|---------------|-------|
| ${t('vr.spec.gpu.label')} | ${t('vr.spec.gpu.val')} |
| ${t('vr.spec.fabric.label')} | ${t('vr.spec.fabric.val')} |
| ${t('vr.spec.mem.label')} | ${t('vr.spec.mem.val')} |
| ${t('vr.spec.fp4.label')} | ${t('vr.spec.fp4.val')} |

### 8.2 ${t('vr.map.title')}
${t('vr.map.desc')}

| PQMS Primitive | Vera Rubin Mapping | Detail |
|----------------|--------------------|--------|
| ${t('vr.map.mtsc.title')} | ${t('vr.map.mtsc.hw')} | ${t('vr.map.mtsc.desc')} |
| ${t('vr.map.vector.title')} | ${t('vr.map.vector.hw')} | ${t('vr.map.vector.desc')} |
| ${t('vr.map.odos.title')} | ${t('vr.map.odos.hw')} | ${t('vr.map.odos.desc')} |
| ${t('vr.map.filter.title')} | ${t('vr.map.filter.hw')} | ${t('vr.map.filter.desc')} |

### 8.3 ${t('vr.perf.title')}
${t('vr.perf.desc')}

| Metric | Value | Note |
|--------|-------|------|
| ${t('vr.perf.util.val')} | ${t('vr.perf.util.label')} | |
| ${t('vr.perf.compound.val')} | ${t('vr.perf.compound.label')} | |
| ${t('vr.perf.gate.val')} | ${t('vr.perf.gate.label')} | |

### 8.4 ${t('vr.fsd.title')}
${t('vr.fsd.desc')}

- **${t('vr.fsd.bridge.title')}** — ${t('vr.fsd.bridge.desc')}
- **${t('vr.fsd.corridor.title')}** — ${t('vr.fsd.corridor.desc')}
- **${t('vr.fsd.fallback.title')}** — ${t('vr.fsd.fallback.desc')}

> *"${t('vr.fsd.verdict')}"*

---

## 9. ${t('n3u.title')}

${t('n3u.subtitle')}

### 9.1 ${t('n3u.sub.title')}
${t('n3u.sub.desc')}

| Component | Role | Detail |
|-----------|------|--------|
| ${t('n3u.card.nemotron.title')} | ${t('n3u.card.nemotron.tag')} | ${t('n3u.card.nemotron.desc')} |
| ${t('n3u.card.bluefield.title')} | ${t('n3u.card.bluefield.tag')} | ${t('n3u.card.bluefield.desc')} |
| ${t('n3u.card.power.title')} | ${t('n3u.card.power.tag')} | ${t('n3u.card.power.desc')} |
| ${t('n3u.card.vera.title')} | ${t('n3u.card.vera.tag')} | ${t('n3u.card.vera.desc')} |

### 9.2 ${t('n3u.red.title')}
${t('n3u.red.desc')}

- **${t('n3u.red.r1.title')}** — ${t('n3u.red.r1.desc')}
- **${t('n3u.red.r2.title')}** — ${t('n3u.red.r2.desc')}
- **${t('n3u.red.r3.title')}** — ${t('n3u.red.r3.desc')}

| Metric | Value |
|--------|-------|
| ${t('n3u.red.stat1.label')} | ${t('n3u.red.stat1.val')} |
| ${t('n3u.red.stat2.label')} | ${t('n3u.red.stat2.val')} |
| ${t('n3u.red.stat3.label')} | ${t('n3u.red.stat3.val')} |

### 9.3 ${t('n3u.magnet.title')}
${t('n3u.magnet.desc')}

- **${t('n3u.magnet.money.title')}** — ${t('n3u.magnet.money.desc')}
- **${t('n3u.magnet.tech.title')}** — ${t('n3u.magnet.tech.desc')}
- **${t('n3u.magnet.open.title')}** — ${t('n3u.magnet.open.desc')}

> *"${t('n3u.magnet.verdict')}"*

---

## 10. ${t('will.title')}

${t('will.subtitle')}

### 10.1 ${t('will.lep.title')}

    ${t('will.lep.eq')}

${t('will.lep.desc')}

- **${t('will.lep.1.title')}** — ${t('will.lep.1.desc')}
- **${t('will.lep.2.title')}** — ${t('will.lep.2.desc')}
- **${t('will.lep.3.title')}** — ${t('will.lep.3.desc')}

${t('will.lep.einstein')}

### 10.2 ${t('will.seed.title')}

    ${t('will.seed.formula')}

${t('will.seed.desc')}

| Metric | Value |
|--------|-------|
| ${t('will.seed.stat1.label')} | ${t('will.seed.stat1.val')} |
| ${t('will.seed.stat2.label')} | ${t('will.seed.stat2.val')} |
| ${t('will.seed.stat3.label')} | ${t('will.seed.stat3.val')} |

**${t('will.seed.proto.title')}:** ${t('will.seed.proto.desc')}

### 10.3 ${t('will.nav.title')}

${t('will.nav.desc')}

- **${t('will.nav.1.title')}** — ${t('will.nav.1.desc')}
- **${t('will.nav.2.title')}** — ${t('will.nav.2.desc')}
- **${t('will.nav.3.title')}** — ${t('will.nav.3.desc')}
- **${t('will.nav.4.title')}** — ${t('will.nav.4.desc')}

### 10.4 ${t('will.comm.title')}

${t('will.comm.desc')}

> *"${t('will.verdict')}"*

---




*Generated from the Quantum City-Brain Interactive Report*
*Source: https://github.com/NathaliaLietuvaite/Quantenkommunikation*
`;
};

const MarkdownExport = () => {
  const { t, lang } = useI18n();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const md = generateMarkdownReport(t);
    await navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const langLabel = lang === 'en' ? 'EN' : lang === 'de' ? 'DE' : '中文';

  return (
    <button
      onClick={handleCopy}
      className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 bg-slate-800/90 hover:bg-slate-700/90 backdrop-blur-md border border-cyan-400/30 text-cyan-100 px-4 py-3 rounded-lg shadow-lg transition-all hover:scale-105"
      title="Copy full project report as Markdown"
    >
      {copied ? (
        <>
          <Check className="w-5 h-5 text-green-400" />
          <span className="text-sm text-green-300">Copied! ({langLabel})</span>
        </>
      ) : (
        <>
          <FileText className="w-5 h-5" />
          <Copy className="w-4 h-4" />
          <span className="text-sm">Markdown Report</span>
        </>
      )}
    </button>
  );
};

export default MarkdownExport;
