import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const replacements = [
  // Backgrounds
  { regex: /bg-white/g, replacement: 'bg-warm-primary' },
  { regex: /bg-slate-50/g, replacement: 'bg-warm-secondary' },
  { regex: /bg-slate-100/g, replacement: 'bg-warm-secondary' },
  { regex: /bg-slate-900\/50/g, replacement: 'bg-black/20' }, // Dark mode soft overlays
  { regex: /bg-slate-900/g, replacement: 'bg-warm-primary' },
  { regex: /bg-slate-950/g, replacement: 'bg-warm-secondary' },
  { regex: /bg-slate-800\/50/g, replacement: 'bg-black/30' },
  
  // Text
  { regex: /text-slate-900/g, replacement: 'text-editorial-primary' },
  { regex: /text-slate-800/g, replacement: 'text-editorial-primary' },
  { regex: /text-slate-700/g, replacement: 'text-editorial-primary' },
  { regex: /text-slate-600/g, replacement: 'text-editorial-secondary' },
  { regex: /text-slate-500/g, replacement: 'text-editorial-secondary' },
  { regex: /text-slate-400/g, replacement: 'text-editorial-secondary' },
  { regex: /text-slate-300/g, replacement: 'text-editorial-secondary' },
  { regex: /text-white/g, replacement: 'text-editorial-primary' }, // We rely on dark mode mapping
  
  // Borders
  { regex: /border-slate-200/g, replacement: 'border-editorial-border' },
  { regex: /border-slate-300/g, replacement: 'border-editorial-border' },
  { regex: /border-slate-700/g, replacement: 'border-editorial-border' },
  { regex: /border-slate-800/g, replacement: 'border-editorial-border' },
  
  // Hover states
  { regex: /hover:bg-slate-50/g, replacement: 'hover:bg-warm-secondary' },
  { regex: /hover:bg-slate-100/g, replacement: 'hover:bg-warm-secondary' },
  { regex: /hover:text-slate-900/g, replacement: 'hover:text-editorial-primary' },
  { regex: /hover:text-slate-700/g, replacement: 'hover:text-editorial-primary' },
  
  // Accents / specific states
  { regex: /text-yellow-600/g, replacement: 'text-accent' },
  { regex: /text-yellow-400/g, replacement: 'text-accent' },
  { regex: /text-emerald-600/g, replacement: 'text-success' },
  { regex: /text-emerald-400/g, replacement: 'text-success' },
  { regex: /text-green-600/g, replacement: 'text-success' },
  { regex: /text-red-500/g, replacement: 'text-accent' }, // Keep as is or change to accent
];

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;
      
      for (const r of replacements) {
        if (r.regex.test(content)) {
          content = content.replace(r.regex, r.replacement);
          modified = true;
        }
      }
      
      if (modified) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

console.log("Starting theme replacement...");
walk(path.join(__dirname, 'src'));
console.log("Theme replacement complete.");
