import Link from "@/components/Lien";

/**
 * Rendu du Markdown simple utilisé par les articles (data/blog.ts) et les textes de page marque
 * (data/marques-textes.json) : titres ##/###, puces, tableaux, **gras**, [liens](/url).
 * Les liens passent par @/components/Lien (pas de préchargement, voir CLAUDE.md).
 */
export function renderContent(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={key++} className="text-xl sm:text-2xl font-bold text-[#111111] mt-10 mb-4">
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      elements.push(
        <h3 key={key++} className="text-lg font-bold text-[#111111] mt-7 mb-3">
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith("**") && line.endsWith("**") && line.length > 4 && !line.slice(2, -2).includes("**")) {
      // Ligne entière en gras : on lit quand même les liens qu'elle contient.
      elements.push(
        <p key={key++} dir="auto" className="font-semibold text-[#111111] mt-4 mb-1">
          {parseInline(line.slice(2, -2))}
        </p>
      );
    } else if (line.startsWith("- ")) {
      // Puces consécutives regroupées dans un vrai <ul>, gras et liens lus (avant le 21/11/2026,
      // une puce affichait « **x** » et « [texte](/url) » tels quels : 18 lignes publiées touchées).
      const items: string[] = [];
      let j = i;
      while (j < lines.length && lines[j].startsWith("- ")) {
        items.push(lines[j].slice(2));
        j++;
      }
      i = j - 1;
      elements.push(
        <ul key={key++} className="list-disc pl-6 my-3 space-y-1">
          {items.map((it, ii) => (
            <li key={ii} dir="auto" className="text-gray-600 leading-relaxed">
              {parseInline(it)}
            </li>
          ))}
        </ul>
      );
    } else if (line.startsWith("---")) {
      elements.push(<hr key={key++} className="border-gray-100 my-8" />);
    } else if (line.trim().startsWith("|")) {
      // Tableau markdown : on collecte les lignes consécutives
      const rows: string[] = [];
      let j = i;
      while (j < lines.length && lines[j].trim().startsWith("|")) {
        rows.push(lines[j]);
        j++;
      }
      i = j - 1;
      const cells = (r: string) => r.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());
      const header = cells(rows[0]);
      const bodyStart = rows[1] && /^[\s|:-]+$/.test(rows[1]) ? 2 : 1;
      const body = rows.slice(bodyStart).map(cells);
      elements.push(
        <div key={key++} className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                {header.map((h, hi) => (
                  <th key={hi} className="border border-gray-200 bg-[#FAFAF8] px-3 py-2 text-left font-semibold text-[#111111]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {body.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td key={ci} className="border border-gray-100 px-3 py-2 text-gray-600">
                      {parseInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else if (line.trim() !== "") {
      // Parse inline bold and links
      const parsed = parseInline(line);
      elements.push(
        <p key={key++} dir="auto" className="text-gray-600 leading-relaxed my-3">
          {parsed}
        </p>
      );
    }
  }

  return elements;
}

export function parseInline(text: string): React.ReactNode {
  // Handle **bold** and [link](href)
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-semibold text-[#111111]">{part.slice(2, -2)}</strong>;
    }
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return <Link key={i} href={linkMatch[2]} className="text-[#C9A84C] hover:underline">{linkMatch[1]}</Link>;
    }
    return part;
  });
}

