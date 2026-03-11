import { Heart } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

export interface Filter {
  id: string;
  name: string;
  label: string;
  cssFilter: string;
  gradient: string;
  isOrnaments?: boolean;
  ornamentType?:
    | "bridal"
    | "nath"
    | "kundan"
    | "south_indian"
    | "maang_tikka_only"
    | "nose_ring_only"
    | "jhumka_only"
    | "necklace_only"
    | "bindi_only"
    | "sparkle";
  category?: "beauty" | "ornament" | "special";
}

export const FILTERS: Filter[] = [
  {
    id: "none",
    name: "None",
    label: "Original",
    cssFilter: "none",
    gradient: "linear-gradient(135deg, #0f1729, #1a2a4a)",
    category: "beauty",
  },
  {
    id: "natural_glow",
    name: "Natural Glow",
    label: "Warm Radiance",
    cssFilter: "brightness(1.1) saturate(1.15) contrast(0.95) sepia(0.05)",
    gradient: "linear-gradient(135deg, #f6a040, #fd6e22)",
    category: "beauty",
  },
  {
    id: "soft_glow",
    name: "Soft Glow",
    label: "Dreamy Light",
    cssFilter: "brightness(1.18) saturate(0.92) contrast(0.88) blur(0.4px)",
    gradient: "linear-gradient(135deg, #ffd6c4, #ff9ecd)",
    category: "beauty",
  },
  {
    id: "soft_makeup",
    name: "Soft Makeup",
    label: "Silky Smooth",
    cssFilter: "brightness(1.12) saturate(0.88) contrast(1.06) sepia(0.1)",
    gradient: "linear-gradient(135deg, #f5c9b5, #d4889e)",
    category: "beauty",
  },
  {
    id: "golden_hour",
    name: "Golden Hour",
    label: "Sun-Kissed",
    cssFilter: "brightness(1.12) saturate(1.3) sepia(0.22) contrast(1.06)",
    gradient: "linear-gradient(135deg, #f7c948, #e8820c)",
    category: "beauty",
  },
  {
    id: "rose_blush",
    name: "Rose Blush",
    label: "Rosy Glow",
    cssFilter:
      "brightness(1.1) saturate(1.22) hue-rotate(330deg) contrast(1.03)",
    gradient: "linear-gradient(135deg, #f5a7b8, #e05577)",
    category: "beauty",
  },
  {
    id: "dewy_skin",
    name: "Dewy Skin",
    label: "Glass Skin",
    cssFilter: "brightness(1.2) saturate(0.9) contrast(0.85) blur(0.5px)",
    gradient: "linear-gradient(135deg, #98e0db, #f9c7d8)",
    category: "beauty",
  },
  {
    id: "peach_velvet",
    name: "Peach Velvet",
    label: "Warm Peachy",
    cssFilter:
      "brightness(1.1) saturate(1.1) sepia(0.15) hue-rotate(10deg) contrast(1.0)",
    gradient: "linear-gradient(135deg, #ffcba4, #e8935a)",
    category: "beauty",
  },
  {
    id: "mocha_radiance",
    name: "Mocha Glow",
    label: "Deep Radiance",
    cssFilter: "brightness(1.08) saturate(1.3) contrast(1.1) sepia(0.08)",
    gradient: "linear-gradient(135deg, #8b5e3c, #d4a857)",
    category: "beauty",
  },
  {
    id: "champagne_dream",
    name: "Champagne",
    label: "Luminous Sheen",
    cssFilter: "brightness(1.15) saturate(1.05) sepia(0.18) contrast(1.02)",
    gradient: "linear-gradient(135deg, #f0d48a, #d4b96a)",
    category: "beauty",
  },
  {
    id: "saffron_haze",
    name: "Saffron Glow",
    label: "Warm Haze",
    cssFilter:
      "brightness(1.1) saturate(1.2) sepia(0.25) hue-rotate(5deg) contrast(1.04)",
    gradient: "linear-gradient(135deg, #f4a225, #e05c00)",
    category: "beauty",
  },
  {
    id: "skin_smooth",
    name: "Skin Smooth",
    label: "Natural Smooth",
    cssFilter: "brightness(1.08) saturate(0.95) contrast(0.9) blur(0.6px)",
    gradient: "linear-gradient(135deg, #f9d4c5, #f0b8a0)",
    category: "beauty",
  },
  {
    id: "pink_blush",
    name: "Pink Blush",
    label: "Rosy Cheeks",
    cssFilter:
      "brightness(1.1) saturate(1.25) hue-rotate(340deg) contrast(1.02)",
    gradient: "linear-gradient(135deg, #ffb3cb, #ff6b9d)",
    category: "beauty",
  },
  {
    id: "glossy_lips",
    name: "Glossy Lips",
    label: "Lip Tint",
    cssFilter:
      "brightness(1.08) saturate(1.3) sepia(0.12) contrast(1.05) hue-rotate(350deg)",
    gradient: "linear-gradient(135deg, #ff8fa3, #c62a47)",
    category: "beauty",
  },
  {
    id: "eye_bright",
    name: "Eye Bright",
    label: "Sparkle Eyes",
    cssFilter: "brightness(1.22) saturate(1.1) contrast(1.12)",
    gradient: "linear-gradient(135deg, #a8d8f0, #7ab8e8)",
    category: "beauty",
  },
  {
    id: "minimal_makeup",
    name: "Minimal Makeup",
    label: "Barely There",
    cssFilter: "brightness(1.06) saturate(1.05) contrast(0.97) sepia(0.06)",
    gradient: "linear-gradient(135deg, #eeddd3, #d4a99a)",
    category: "beauty",
  },
  {
    id: "bridal_glow",
    name: "Bridal Glow",
    label: "Luminous",
    cssFilter: "brightness(1.2) saturate(1.12) sepia(0.14) contrast(1.1)",
    gradient: "linear-gradient(135deg, #d4af37, #f5e6a3, #c8a951)",
    category: "special",
  },
  {
    id: "festive_sparkle",
    name: "Festive Sparkle",
    label: "Pastel Glow",
    cssFilter: "brightness(1.15) saturate(1.2) sepia(0.1) contrast(1.05)",
    gradient: "linear-gradient(135deg, #f9c6e0, #f7e98e)",
    isOrnaments: true,
    ornamentType: "sparkle",
    category: "special",
  },
  {
    id: "ornaments",
    name: "Bridal Jewels",
    label: "Maang Tikka",
    cssFilter: "brightness(1.08) saturate(1.1) contrast(0.95)",
    gradient: "linear-gradient(135deg, #b8860b, #8b0000, #d4af37)",
    isOrnaments: true,
    ornamentType: "bridal",
    category: "ornament",
  },
  {
    id: "nath_bindi",
    name: "Nath & Bindi",
    label: "Nose Ring",
    cssFilter: "brightness(1.1) saturate(1.1) contrast(0.96)",
    gradient: "linear-gradient(135deg, #c4748a, #d4a030)",
    isOrnaments: true,
    ornamentType: "nath",
    category: "ornament",
  },
  {
    id: "kundan_glam",
    name: "Kundan Glam",
    label: "Full Jewels",
    cssFilter: "brightness(1.1) saturate(1.12) sepia(0.1) contrast(1.0)",
    gradient: "linear-gradient(135deg, #1a5c6e, #d4af37)",
    isOrnaments: true,
    ornamentType: "kundan",
    category: "ornament",
  },
  {
    id: "maang_tikka_only",
    name: "Maang Tikka",
    label: "Forehead Chain",
    cssFilter: "brightness(1.05) saturate(1.05)",
    gradient: "linear-gradient(135deg, #D4AF37, #b8860b)",
    isOrnaments: true,
    ornamentType: "maang_tikka_only",
    category: "ornament",
  },
  {
    id: "nose_ring_only",
    name: "Nose Ring",
    label: "Tiny Nath",
    cssFilter: "brightness(1.05) saturate(1.05)",
    gradient: "linear-gradient(135deg, #e0c060, #c89820)",
    isOrnaments: true,
    ornamentType: "nose_ring_only",
    category: "ornament",
  },
  {
    id: "jhumka_only",
    name: "Jhumka",
    label: "Drop Earrings",
    cssFilter: "brightness(1.05) saturate(1.05)",
    gradient: "linear-gradient(135deg, #D4AF37, #8b6914)",
    isOrnaments: true,
    ornamentType: "jhumka_only",
    category: "ornament",
  },
  {
    id: "necklace_only",
    name: "Gold Necklace",
    label: "Thin Necklace",
    cssFilter: "brightness(1.05) saturate(1.05)",
    gradient: "linear-gradient(135deg, #D4AF37, #a87928)",
    isOrnaments: true,
    ornamentType: "necklace_only",
    category: "ornament",
  },
  {
    id: "bindi_only",
    name: "Bindi",
    label: "Forehead Dot",
    cssFilter: "brightness(1.05) saturate(1.05)",
    gradient: "linear-gradient(135deg, #cc2200, #ff6644)",
    isOrnaments: true,
    ornamentType: "bindi_only",
    category: "ornament",
  },
];

const ORNAMENT_EMOJI: Record<string, string> = {
  bridal: "👑",
  nath: "💍",
  kundan: "✨",
  south_indian: "🌸",
  maang_tikka_only: "🪬",
  nose_ring_only: "⭕",
  jhumka_only: "🔔",
  necklace_only: "📿",
  bindi_only: "🔴",
  sparkle: "🌟",
};

const CATEGORY_LABELS: Record<string, string> = {
  beauty: "Beauty",
  ornament: "Ornaments",
  special: "Special",
};

interface FilterSelectorProps {
  activeFilter: string;
  onFilterChange: (filterId: string) => void;
}

export function FilterSelector({
  activeFilter,
  onFilterChange,
}: FilterSelectorProps) {
  const [favorites, setFavorites] = useState<Set<string>>(
    () =>
      new Set(JSON.parse(localStorage.getItem("glowcam_favorites") || "[]")),
  );

  const toggleFavorite = (e: React.MouseEvent, filterId: string) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(filterId)) {
        next.delete(filterId);
      } else {
        next.add(filterId);
      }
      localStorage.setItem("glowcam_favorites", JSON.stringify([...next]));
      return next;
    });
  };

  // Build sorted filter list: favorites first, then by original order
  const favoriteFilters = FILTERS.filter((f) => favorites.has(f.id));
  const nonFavoriteFilters = FILTERS.filter((f) => !favorites.has(f.id));

  // Group non-favorites by category
  const categories: Array<{ label: string; key: string; filters: Filter[] }> =
    [];
  const seenCategories = new Set<string>();
  for (const filter of nonFavoriteFilters) {
    const cat = filter.category ?? "beauty";
    if (!seenCategories.has(cat)) {
      seenCategories.add(cat);
      categories.push({
        label: CATEGORY_LABELS[cat] ?? cat,
        key: cat,
        filters: [],
      });
    }
    categories[categories.length - 1].filters.push(filter);
  }
  // Re-assign correctly (since categories array is built sequentially, we need a map approach)
  const categoryMap: Record<string, Filter[]> = {};
  for (const filter of nonFavoriteFilters) {
    const cat = filter.category ?? "beauty";
    if (!categoryMap[cat]) categoryMap[cat] = [];
    categoryMap[cat].push(filter);
  }
  const orderedCategories = ["beauty", "ornament", "special"].filter(
    (c) => categoryMap[c]?.length > 0,
  );

  let globalIndex = 0;

  const renderFilter = (filter: Filter, isFav = false) => {
    const idx = globalIndex++;
    const isFavorited = favorites.has(filter.id);
    return (
      <motion.button
        key={`${filter.id}${isFav ? "-fav" : ""}`}
        data-ocid="filter.tab"
        onClick={() => onFilterChange(filter.id)}
        className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: idx * 0.03 }}
        whileTap={{ scale: 0.92 }}
      >
        <div
          className={`w-14 h-14 rounded-full relative overflow-visible transition-all duration-300 ${
            activeFilter === filter.id
              ? "filter-ring"
              : "opacity-70 hover:opacity-100"
          }`}
        >
          <div
            className="w-full h-full rounded-full overflow-hidden"
            style={{ background: filter.gradient }}
          >
            {filter.isOrnaments && filter.ornamentType && (
              <div className="absolute inset-0 flex items-center justify-center text-xl">
                {ORNAMENT_EMOJI[filter.ornamentType] ?? "✨"}
              </div>
            )}
            {activeFilter === filter.id && (
              <div className="absolute inset-0 bg-white/10 rounded-full" />
            )}
          </div>
          {/* Favorite heart button */}
          <button
            type="button"
            data-ocid="filter.toggle"
            onClick={(e) => toggleFavorite(e, filter.id)}
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center z-10 transition-all duration-200"
            style={{
              background: isFavorited
                ? "rgba(220,30,60,0.9)"
                : "rgba(0,0,0,0.55)",
              border: "1px solid rgba(255,255,255,0.25)",
            }}
            aria-label={
              isFavorited ? "Remove from favorites" : "Add to favorites"
            }
          >
            <Heart
              size={10}
              className={
                isFavorited ? "text-white fill-white" : "text-white/70"
              }
            />
          </button>
        </div>
        <span
          className={`text-[10px] font-body font-medium leading-tight text-center max-w-[60px] ${
            activeFilter === filter.id ? "gold-text" : "text-white/70"
          }`}
        >
          {filter.name}
        </span>
      </motion.button>
    );
  };

  return (
    <div className="flex gap-3 overflow-x-auto scroll-hide pb-1 px-1 items-start">
      {/* Favorites section */}
      {favoriteFilters.length > 0 && (
        <>
          <div className="flex flex-col items-center flex-shrink-0">
            <span className="text-[9px] font-body font-semibold text-red-400/80 uppercase tracking-widest mb-2 whitespace-nowrap">
              ♥ Favorites
            </span>
            <div className="flex gap-3">
              {favoriteFilters.map((f) => renderFilter(f, true))}
            </div>
          </div>
          <div className="w-px bg-white/10 self-stretch mx-1 flex-shrink-0" />
        </>
      )}

      {/* Category sections */}
      {orderedCategories.map((catKey) => (
        <div key={catKey} className="flex flex-col items-center flex-shrink-0">
          <span
            className="text-[9px] font-body font-semibold uppercase tracking-widest mb-2 whitespace-nowrap"
            style={{
              color:
                catKey === "ornament"
                  ? "oklch(0.82 0.14 75 / 0.9)"
                  : catKey === "special"
                    ? "oklch(0.82 0.16 320 / 0.9)"
                    : "oklch(0.7 0.08 90 / 0.8)",
            }}
          >
            {CATEGORY_LABELS[catKey]}
          </span>
          <div className="flex gap-3">
            {categoryMap[catKey].map((f) => renderFilter(f, false))}
          </div>
        </div>
      ))}
    </div>
  );
}
