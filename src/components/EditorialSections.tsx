import { ArrowIcon } from "./Icons";

export function EditorialSections() {
  const collections = [
    { number: "01", title: "Rooms for making", copy: "Homes with a studio, library, or genuinely useful work zone." },
    { number: "02", title: "A little ground", copy: "Courtyards, terraces, verandas, and planted outdoor rooms." },
    { number: "03", title: "Leave the car", copy: "Walkable pockets where daily life stays close and connected." },
  ];
  return <>
    <section className="collections" id="collections">
      <div className="section-intro"><p className="eyebrow">Curated paths</p><h2>Search by the life you want, not only the number of rooms.</h2></div>
      <div className="collection-list">{collections.map((item) => <article key={item.number}><span>{item.number}</span><div><h3>{item.title}</h3><p>{item.copy}</p></div><button onClick={() => document.getElementById("discover")?.scrollIntoView()} aria-label={`Explore ${item.title}`}><ArrowIcon/></button></article>)}</div>
    </section>
    <section className="guide" id="guide">
      <div className="guide-map" aria-hidden="true"><span>West</span><i/><i/><i/><b>Toronto</b><i/><i/><span>East</span></div>
      <div className="guide-copy"><p className="eyebrow">Neighbourhood field note · 04</p><h2>Three pockets, three different rhythms.</h2><div className="guide-notes"><article><strong>Junction Triangle</strong><p>Converted industrial spaces, the West Toronto Railpath, and quick runs to the UP Express.</p></article><article><strong>St. Lawrence</strong><p>Market mornings, the waterfront edge, and a street grid that makes daily errands feel effortless.</p></article><article><strong>Leslieville</strong><p>Small storefronts, generous side streets, and family houses close to the east-end ravine system.</p></article></div><button onClick={() => document.getElementById("discover")?.scrollIntoView()}>Return to the map <ArrowIcon/></button></div>
    </section>
  </>;
}
