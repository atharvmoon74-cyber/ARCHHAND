import { ArrowUpRight, Clock3, FolderOpen, House, MapPinned, Play, Plus, Sparkles } from "lucide-react";

type Props = { projectName: string; onNew: () => void; onContinue: () => void; onExample: (name: string) => void; };

const examples = [
  { name: "Courtyard Residence", detail: "2 bed · single storey · climate-ready", image: "/manus-storage/courtyard_e9394db0.webp", tag: "EDITOR'S START" },
  { name: "Modern Villa", detail: "4 bed · 2 levels · open-plan living", image: "/manus-storage/modern-villa_2f33f94f.jpg", tag: "MULTI-LEVEL" },
  { name: "Minimal House", detail: "2 bed · compact · low-maintenance", image: "/manus-storage/minimal-house_65bfabc6.jpg", tag: "COMPACT" },
];

export function HouseDashboard({ projectName, onNew, onContinue, onExample }: Props) {
  return <main className="house-dashboard">
    <header className="dash-top"><div className="dash-brand"><div className="dash-mark"><i /><i /><i /></div><div><strong>HOUSEFORGE <em>X</em></strong><small>RESIDENTIAL DESIGN STUDIO</small></div></div><span>Made by Atharv Moon <b>•</b> IIT Tirupati</span></header>
    <section className="dash-hero"><div className="dash-intro"><div className="dash-eyebrow"><Sparkles size={14} /> BUILD FROM NOTHING</div><h1>Design everything.<br/><em>Experience your home.</em></h1><p>Build a house from a measured plot with one synchronized model for plan, structure, materials, interiors, and walkthrough.</p><div className="dash-actions"><button type="button" className="dash-primary" onClick={onNew}><Plus size={17} /> New house <ArrowUpRight size={16} /></button><button type="button" className="dash-secondary" onClick={onContinue}><Clock3 size={16} /> Continue project</button></div><div className="dash-meta"><span><MapPinned size={14} /> Empty land to completed home</span><span><House size={14} /> Unified 2D + 3D model</span></div></div><div className="dash-hero-card"><div className="dash-grid" /><div className="dash-card-content"><span>ACTIVE PROJECT</span><b>{projectName}</b><p>Autosaved locally · ready to continue</p><button type="button" onClick={onContinue}>Open workspace <Play size={14} /></button></div><div className="dash-wire-home"><div /><div /><div /></div></div></section>
    <section className="dash-examples"><div className="dash-section-title"><div><span>EXAMPLE HOUSES</span><h2>Start with a foundation.</h2></div><button type="button" onClick={onNew}><FolderOpen size={15} /> Open project</button></div><div className="dash-example-grid">{examples.map((example) => <button type="button" className="dash-example" key={example.name} onClick={() => onExample(example.name)}><img src={example.image} alt="" /><div className="dash-example-overlay" /><div className="dash-example-copy"><small>{example.tag}</small><strong>{example.name}</strong><span>{example.detail}</span></div><ArrowUpRight className="dash-example-arrow" size={17} /></button>)}</div></section>
    <footer className="dash-footer"><span>HOUSEFORGE X · ONE HOUSE MODEL, VIEWED EVERYWHERE</span><span>Conceptual architectural workspace</span></footer>
  </main>;
}
