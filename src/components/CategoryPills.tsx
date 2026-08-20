import React from 'react';
import { 
  LayoutGrid, 
  Music, 
  Cpu, 
  Sparkles, 
  Film, 
  Trophy, 
  Briefcase 
} from 'lucide-react';
import { EventCategory } from '../types';

interface CategoryPillsProps {
  selectedCategory: EventCategory;
  onSelectCategory: (cat: EventCategory) => void;
  categoryCounts?: Record<string, number>;
}

interface CategoryDef {
  name: EventCategory;
  label: string;
  icon: React.ElementType;
}

const CATEGORIES: CategoryDef[] = [
  { name: 'All', label: 'All Events', icon: LayoutGrid },
  { name: 'Music & Concerts', label: 'Concerts & Music', icon: Music },
  { name: 'Tech & Conferences', label: 'Tech & AI', icon: Cpu },
  { name: 'Workshops & Masterclasses', label: 'Masterclasses', icon: Sparkles },
  { name: 'Festivals & Arts', label: 'Film & Arts', icon: Film },
  { name: 'Sports & Fitness', label: 'Sports & Fitness', icon: Trophy },
  { name: 'Business & Networking', label: 'Business & VC', icon: Briefcase },
];

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  selectedCategory,
  onSelectCategory,
  categoryCounts = {},
}) => {
  return (
    <div className="w-full overflow-x-auto pb-2 scrollbar-none">
      <div className="flex items-center gap-2 sm:gap-3 min-w-max">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.name;
          const count = categoryCounts[cat.name];

          return (
            <button
              key={cat.name}
              id={`cat-pill-${cat.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`}
              onClick={() => onSelectCategory(cat.name)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 border select-none ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20 scale-[1.02]'
                  : 'bg-white dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-indigo-500 dark:text-indigo-400'}`} />
              <span>{cat.label}</span>
              {typeof count === 'number' && (
                <span
                  className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
