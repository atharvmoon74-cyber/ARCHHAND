import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { ElementKind, HouseTool, MaterialKey, SiteToolKind } from "@/types/houseforge";

export type LibraryItem = { label: string; kind: ElementKind; material?: MaterialKey; dimensions?: [number, number, number]; note?: string; siteTool?: SiteToolKind; };

const libraries: Partial<Record<HouseTool, { title: string; items: LibraryItem[] }>> = {
  wall: { title: "Wall library", items: [
    { label: "Brick exterior wall", kind: "wall", material: "brick", dimensions: [4, 3, .23], note: "Exterior · Brick masonry" },
    { label: "RCC shear wall", kind: "wall", material: "concrete", dimensions: [4, 3, .2], note: "Structural · RCC" },
    { label: "AAC block wall", kind: "wall", material: "aac", dimensions: [4, 3, .2], note: "Exterior · AAC block" },
    { label: "Gypsum partition", kind: "wall", material: "plaster", dimensions: [3.6, 3, .12], note: "Interior · Gypsum" },
    { label: "Glass partition", kind: "wall", material: "glass", dimensions: [3.6, 3, .08], note: "Interior · Glass" },
    { label: "Stone feature wall", kind: "wall", material: "marble", dimensions: [3.6, 3, .16], note: "Decorative · Stone finish" },
  ] },
  roof: { title: "Roof library", items: [
    { label: "Flat roof", kind: "roof", material: "concrete", note: "Flat roof · 1:80 fall" },
    { label: "Gable roof", kind: "roof", material: "steel", dimensions: [6, 1.2, 4.8], note: "Gable roof · editable pitch" },
    { label: "Hip roof", kind: "roof", material: "steel", dimensions: [6, 1.1, 4.8], note: "Hip roof · editable pitch" },
    { label: "Shed roof", kind: "roof", material: "steel", dimensions: [6, .8, 4.8], note: "Shed roof · editable fall" },
    { label: "Glass roof", kind: "roof", material: "glass", dimensions: [5.2, .28, 4], note: "Glass roof · conceptual" },
  ] },
  facade: { title: "Facade library", items: [
    { label: "Stone cladding panel", kind: "finish", material: "marble", dimensions: [2.4, 2.8, .06], note: "Facade · stone cladding panel" },
    { label: "Timber screen", kind: "wall", material: "wood", dimensions: [1.8, 2.8, .08], note: "Facade · ventilated timber screen" },
    { label: "Vertical metal fin", kind: "wall", material: "steel", dimensions: [.16, 3.2, .4], note: "Facade · vertical shading fin" },
    { label: "Entry canopy", kind: "roof", material: "steel", dimensions: [2.6, .18, 1.4], note: "Facade · entry canopy" },
    { label: "Feature glazing", kind: "window", material: "glass", dimensions: [2.4, 2.6, .08], note: "Facade · fixed feature glazing" },
  ] },
  door: { title: "Door library", items: [
    { label: "Main entrance", kind: "door", material: "wood", dimensions: [1.2, 2.3, .1], note: "Main entrance · single swing" },
    { label: "Interior door", kind: "door", material: "wood", dimensions: [.9, 2.1, .08], note: "Interior · single swing" },
    { label: "Sliding patio door", kind: "door", material: "glass", dimensions: [2.4, 2.2, .1], note: "Patio · sliding" },
    { label: "French door", kind: "door", material: "glass", dimensions: [1.8, 2.2, .1], note: "Balcony · double swing" },
  ] },
  window: { title: "Window library", items: [
    { label: "Sliding window", kind: "window", material: "glass", dimensions: [1.5, 1.2, .08], note: "Sliding · aluminium frame" },
    { label: "Casement window", kind: "window", material: "glass", dimensions: [1.2, 1.2, .08], note: "Casement · side opening" },
    { label: "Bay window", kind: "window", material: "glass", dimensions: [2.1, 1.4, .3], note: "Bay · projecting" },
    { label: "Floor-to-ceiling glazing", kind: "window", material: "glass", dimensions: [2.2, 2.6, .08], note: "Fixed glazing" },
  ] },
  stair: { title: "Stair library", items: [
    { label: "Straight stair", kind: "stair", material: "concrete", note: "Straight stair · auto risers" },
    { label: "L-shaped stair", kind: "stair", material: "concrete", dimensions: [2.2, 1.65, 3.4], note: "L-shaped stair · landing" },
    { label: "U-shaped stair", kind: "stair", material: "concrete", dimensions: [2.4, 1.65, 3.7], note: "U-shaped stair · landing" },
    { label: "Floating stair", kind: "stair", material: "wood", dimensions: [1.4, 1.65, 3], note: "Floating stair · open riser" },
  ] },
  column: { title: "Column library", items: [
    { label: "Square 300 × 300", kind: "column", material: "rcc", dimensions: [.3, 3.2, .3], note: "Square column" },
    { label: "Rectangular 300 × 450", kind: "column", material: "rcc", dimensions: [.3, 3.2, .45], note: "Rectangular column" },
    { label: "Circular column", kind: "column", material: "concrete", dimensions: [.4, 3.2, .4], note: "Circular column" },
  ] },
  beam: { title: "Beam library", items: [
    { label: "Primary beam", kind: "beam", material: "rcc", dimensions: [4, .45, .3], note: "Primary structural beam" },
    { label: "Secondary beam", kind: "beam", material: "rcc", dimensions: [3, .3, .23], note: "Secondary structural beam" },
    { label: "Steel edge beam", kind: "beam", material: "steel", dimensions: [4, .25, .2], note: "Steel edge beam" },
  ] },
  slab: { title: "Slab library", items: [
    { label: "Floor slab", kind: "slab", material: "rcc", dimensions: [4, .15, 4], note: "Floor slab" },
    { label: "Balcony slab", kind: "slab", material: "rcc", dimensions: [2.2, .15, 1.5], note: "Balcony slab" },
    { label: "Terrace slab", kind: "slab", material: "rcc", dimensions: [4.5, .16, 4.5], note: "Terrace slab" },
  ] },
  furniture: { title: "Furniture library", items: [
    { label: "Living sofa", kind: "furniture", material: "wood", dimensions: [2.2, .85, .9], note: "Living · sofa" },
    { label: "Double bed", kind: "furniture", material: "wood", dimensions: [2, .55, 1.7], note: "Bedroom · double bed" },
    { label: "Dining table", kind: "furniture", material: "wood", dimensions: [1.6, .76, .9], note: "Dining · table" },
    { label: "Kitchen counter", kind: "furniture", material: "marble", dimensions: [2.4, .9, .65], note: "Kitchen · counter & cabinets" },
    { label: "Bathroom vanity", kind: "furniture", material: "marble", dimensions: [1.1, .85, .55], note: "Bathroom · vanity" },
    { label: "Shower enclosure", kind: "furniture", material: "glass", dimensions: [1, 2.1, 1], note: "Bathroom · shower" },
  ] },
  kitchen: { title: "Kitchen library", items: [
    { label: "L-shaped counter", kind: "furniture", material: "marble", dimensions: [2.8, .9, .7], note: "Kitchen · L-shaped counter" },
    { label: "Kitchen island", kind: "furniture", material: "marble", dimensions: [1.8, .9, .9], note: "Kitchen · island" },
    { label: "Tall refrigerator", kind: "furniture", material: "steel", dimensions: [.8, 1.8, .7], note: "Kitchen · refrigerator" },
    { label: "Cooktop and chimney", kind: "furniture", material: "steel", dimensions: [.8, 1.2, .6], note: "Kitchen · cooktop" },
  ] },
  bathroom: { title: "Bathroom library", items: [
    { label: "Wall-hung toilet", kind: "furniture", material: "plaster", dimensions: [.7, .55, .72], note: "Bathroom · toilet" },
    { label: "Vanity basin", kind: "furniture", material: "marble", dimensions: [1, .85, .55], note: "Bathroom · vanity basin" },
    { label: "Shower glass", kind: "furniture", material: "glass", dimensions: [1.1, 2.1, .06], note: "Bathroom · shower enclosure" },
    { label: "Freestanding bath", kind: "furniture", material: "plaster", dimensions: [1.7, .6, .8], note: "Bathroom · bathtub" },
  ] },
  lighting: { title: "Lighting library", items: [
    { label: "Warm ceiling light", kind: "electrical", material: "paint", dimensions: [.3, .12, .3], note: "Light · warm 3000K" },
    { label: "Neutral pendant", kind: "electrical", material: "steel", dimensions: [.32, .45, .32], note: "Light · neutral 4000K" },
    { label: "Spotlight", kind: "electrical", material: "steel", dimensions: [.18, .18, .18], note: "Light · cool 6500K" },
    { label: "Garden light", kind: "electrical", material: "steel", dimensions: [.2, 1.1, .2], note: "Light · outdoor" },
  ] },
  tiles: { title: "Tile & flooring library", items: [
    { label: "Ceramic floor tile", kind: "finish", material: "tile", dimensions: [2.4, .04, 2.4], note: "Floor finish · ceramic tile" },
    { label: "Marble floor", kind: "finish", material: "marble", dimensions: [2.4, .04, 2.4], note: "Floor finish · marble" },
    { label: "Wood-look flooring", kind: "finish", material: "wood", dimensions: [2.4, .04, 2.4], note: "Floor finish · wood look" },
    { label: "Kitchen backsplash", kind: "finish", material: "tile", dimensions: [2, 1.1, .04], note: "Wall finish · tile backsplash" },
  ] },
  decoration: { title: "Decoration library", items: [
    { label: "Indoor plant", kind: "landscape", material: "grass", dimensions: [.6, 1.1, .6], note: "Decoration · indoor plant" },
    { label: "Area rug", kind: "finish", material: "wood", dimensions: [2, .03, 1.4], note: "Decoration · rug" },
    { label: "Wall art", kind: "furniture", material: "wood", dimensions: [1, .7, .04], note: "Decoration · wall art" },
    { label: "Curtain panel", kind: "furniture", material: "plaster", dimensions: [1.4, 2.4, .06], note: "Decoration · curtain" },
  ] },
  mep: { title: "Lighting & services", items: [
    { label: "Warm ceiling light", kind: "electrical", material: "paint", dimensions: [.3, .12, .3], note: "Light · warm 3000K" },
    { label: "Neutral pendant", kind: "electrical", material: "steel", dimensions: [.32, .45, .32], note: "Light · neutral 4000K" },
    { label: "Outdoor garden light", kind: "electrical", material: "steel", dimensions: [.2, 1.1, .2], note: "Light · outdoor" },
    { label: "Sink plumbing point", kind: "plumbing", material: "steel", note: "Plumbing · sink" },
    { label: "Split AC unit", kind: "hvac", material: "steel", note: "HVAC · wall unit" },
  ] },
  landscape: { title: "Site & landscape", items: [
    { label: "Site road edge", kind: "finish", material: "asphalt", dimensions: [8, .05, 2.8], note: "Site · editable public-road context", siteTool: "road" },
    { label: "Pedestrian paving path", kind: "finish", material: "tile", dimensions: [1.2, .04, 4.2], note: "Site · pedestrian approach path", siteTool: "path" },
    { label: "Parking bay", kind: "finish", material: "asphalt", dimensions: [2.6, .04, 5.2], note: "Site · single-car parking bay", siteTool: "parking" },
    { label: "Lawn bed", kind: "landscape", material: "grass", dimensions: [3.2, .08, 2.6], note: "Landscape · editable lawn bed", siteTool: "planting" },
    { label: "Shade tree", kind: "landscape", material: "grass", dimensions: [1.4, 2.7, 1.4], note: "Landscape · tree", siteTool: "planting" },
    { label: "Garden planter", kind: "landscape", material: "grass", dimensions: [1.6, .45, .6], note: "Landscape · planter", siteTool: "planting" },
    { label: "Perimeter planting", kind: "landscape", material: "grass", dimensions: [4.2, .7, .5], note: "Landscape · low boundary planting", siteTool: "planting" },
    { label: "Driveway", kind: "finish", material: "asphalt", dimensions: [3, .04, 5], note: "Site · driveway", siteTool: "driveway" },
    { label: "Compound wall", kind: "wall", material: "brick", dimensions: [4.5, 1.8, .18], note: "Site · compound boundary wall", siteTool: "boundary" },
    { label: "Steel fence", kind: "wall", material: "steel", dimensions: [3, 1.4, .08], note: "Site · open fence panel", siteTool: "boundary" },
    { label: "Sliding vehicle gate", kind: "wall", material: "steel", dimensions: [3.6, 1.5, .1], note: "Site · sliding entry gate", siteTool: "gate" },
    { label: "Pool", kind: "finish", material: "glass", dimensions: [4, .3, 2.3], note: "Site · pool water", siteTool: "pool" },
  ] },
};

export function AssetLibrary({ category, onSelect, onClose }: { category: HouseTool; onSelect: (item: LibraryItem) => void; onClose: () => void }) {
  const [query, setQuery] = useState(""); const library = libraries[category];
  const items = useMemo(() => (library?.items ?? []).filter((item) => item.label.toLowerCase().includes(query.toLowerCase()) || item.note?.toLowerCase().includes(query.toLowerCase())), [library, query]);
  if (!library) return null;
  return <aside className="hf-asset-library"><div className="hf-library-heading"><div><span>CONTEXTUAL LIBRARY</span><h2>{library.title}</h2></div><button type="button" onClick={onClose} aria-label="Close library"><X size={16} /></button></div><label className="hf-library-search"><Search size={14} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search assets" /></label><div className="hf-library-list">{items.map((item) => <button type="button" key={item.label} onClick={() => onSelect(item)}><i /><span><b>{item.label}</b><small>{item.note ?? item.kind}</small></span><em>Place</em></button>)}</div></aside>;
}
