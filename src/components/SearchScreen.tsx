import { useState } from 'react';
import { Search as SearchIcon, SlidersHorizontal, X, Star, Film, Monitor } from 'lucide-react';
import { Anime, AppTranslation, Language } from '../types';
import { ALL_GENRES, ALL_GENRES_HINDI } from '../data';

interface SearchScreenProps {
  animeList: Anime[];
  onSelectAnime: (animeId: string) => void;
  translation: AppTranslation;
  currentLang: Language;
}

export default function SearchScreen({
  animeList,
  onSelectAnime,
  translation,
  currentLang,
}: SearchScreenProps) {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'popularity' | 'rating' | 'year'>('popularity');

  const handleReset = () => {
    setQuery('');
    setSelectedGenre(null);
    setSelectedType(null);
    setSortBy('popularity');
  };

  // Filter logic
  const filteredAnime = animeList.filter((anime) => {
    // Search query matches title, hindi title, or description
    const textToSearch = `${anime.title} ${anime.titleHindi} ${anime.description} ${anime.descriptionHindi}`.toLowerCase();
    const matchesQuery = textToSearch.includes(query.toLowerCase());

    // Genre match
    const matchesGenre = selectedGenre 
      ? anime.genres.includes(selectedGenre) || anime.genresHindi.includes(selectedGenre)
      : true;

    // Type match
    const matchesType = selectedType ? anime.type === selectedType : true;

    return matchesQuery && matchesGenre && matchesType;
  });

  // Sort logic
  const sortedAnime = [...filteredAnime].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'year') return b.releaseYear.localeCompare(a.releaseYear);
    return b.popularity - a.popularity; // default popularity
  });

  const activeGenreList = currentLang === 'en' ? ALL_GENRES : ALL_GENRES_HINDI;

  return (
    <div id="search-screen-viewport" className="absolute inset-0 bg-zinc-950 text-white flex flex-col overflow-hidden pb-16">
      {/* Search Header Form */}
      <div id="search-bar-header" className="p-4 bg-zinc-900/60 backdrop-blur-md border-b border-zinc-900 flex flex-col gap-3 z-20">
        <div id="search-input-row" className="flex items-center gap-2">
          <div className="relative flex-1">
            <SearchIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={translation.searchPlaceholder}
              className="w-full pl-10 pr-10 py-2.5 text-xs bg-zinc-950 border border-zinc-850 rounded-2xl text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF4D00] transition-colors"
            />
            {query && (
              <button
                id="btn-clear-search"
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-500 hover:text-zinc-300"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <button
            id="btn-toggle-filters"
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2.5 rounded-xl border transition-all ${
              showFilters || selectedGenre || selectedType
                ? 'bg-[#FF4D00] border-transparent text-white'
                : 'bg-zinc-950 border-zinc-850 text-zinc-400'
            }`}
          >
            <SlidersHorizontal size={16} />
          </button>
        </div>

        {/* Expandable Advanced Filters drawer */}
        {showFilters && (
          <div id="advanced-filters-drawer" className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-900 flex flex-col gap-4 animate-fade-in text-left">
            {/* Format Type */}
            <div id="filter-group-format" className="space-y-1.5">
              <span className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase">{translation.type}</span>
              <div className="flex gap-2">
                <button
                  id="btn-filter-series"
                  onClick={() => setSelectedType(selectedType === 'Series' ? null : 'Series')}
                  className={`flex-1 py-1.5 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all ${
                    selectedType === 'Series' ? 'bg-zinc-100 text-black' : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                  }`}
                >
                  <Monitor size={12} />
                  Anime Series
                </button>
                <button
                  id="btn-filter-movies"
                  onClick={() => setSelectedType(selectedType === 'Movie' ? null : 'Movie')}
                  className={`flex-1 py-1.5 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all ${
                    selectedType === 'Movie' ? 'bg-zinc-100 text-black' : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                  }`}
                >
                  <Film size={12} />
                  {translation.movies}
                </button>
              </div>
            </div>

            {/* Sort Order */}
            <div id="filter-group-sort" className="space-y-1.5">
              <span className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase">{translation.sortBy}</span>
              <div className="flex gap-2">
                {(['popularity', 'rating', 'year'] as const).map((option) => (
                  <button
                    key={option}
                    id={`btn-sort-${option}`}
                    onClick={() => setSortBy(option)}
                    className={`flex-1 py-1 text-[9px] font-bold uppercase rounded-lg transition-all ${
                      sortBy === option ? 'bg-[#FF4D00] text-white' : 'bg-zinc-900 text-zinc-500 border border-zinc-800/60'
                    }`}
                  >
                    {option === 'popularity' ? 'Popular' : option === 'rating' ? 'Rating' : 'Year'}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset Filter Button */}
            <button
              id="btn-reset-filters"
              onClick={handleReset}
              className="w-full py-1.5 rounded-xl border border-dashed border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700 text-[10px] font-bold uppercase transition-colors"
            >
              {translation.resetFilters}
            </button>
          </div>
        )}

        {/* Horizontally scrollable genre list at all times */}
        <div id="genre-scroll-bar" className="flex gap-1.5 overflow-x-auto scrollbar-none py-1">
          {activeGenreList.map((genre) => (
            <button
              key={genre}
              id={`chip-genre-${genre}`}
              onClick={() => setSelectedGenre(selectedGenre === genre ? null : genre)}
              className={`px-3 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap transition-all ${
                selectedGenre === genre
                  ? 'bg-[#FF4D00] text-white shadow-md'
                  : 'bg-zinc-950 border border-zinc-850 text-zinc-400 hover:text-white'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Results Area */}
      <div id="search-results-scrollable" className="flex-1 overflow-y-auto p-4 scrollbar-none">
        {sortedAnime.length > 0 ? (
          <div id="search-grid-layout" className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {sortedAnime.map((anime) => (
              <div
                key={anime.id}
                id={`search-card-${anime.id}`}
                onClick={() => onSelectAnime(anime.id)}
                className="flex flex-col gap-1.5 cursor-pointer hover:scale-[1.02] transition-transform text-left"
              >
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-md bg-zinc-900 border border-zinc-900">
                  <img
                    src={anime.poster}
                    alt={anime.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 right-2 bg-black/75 backdrop-blur-md px-1.5 py-0.5 rounded-lg flex items-center gap-0.5 text-[9px] font-bold text-[#FF4D00]">
                    <Star size={10} className="fill-current" />
                    {anime.rating}
                  </div>
                  <div className="absolute bottom-2 left-2 bg-zinc-950/80 backdrop-blur-sm px-1.5 py-0.5 rounded text-[8px] font-black text-zinc-300 uppercase">
                    {anime.type}
                  </div>
                </div>
                <div className="px-0.5">
                  <h4 className="text-xs font-extrabold text-zinc-100 truncate leading-snug">
                    {currentLang === 'en' ? anime.title : anime.titleHindi}
                  </h4>
                  <p className="text-[10px] text-zinc-500 font-medium mt-0.5">
                    {anime.releaseYear} • {anime.episodesCount} {translation.episodes}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty Search Fallback State */
          <div id="search-empty-fallback" className="flex flex-col items-center justify-center py-20 text-center gap-4 px-6">
            <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-600 border border-zinc-800">
              <SearchIcon size={24} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-300">
                {currentLang === 'en' ? 'No Anime Found' : 'कोई एनीमे नहीं मिला'}
              </h3>
              <p className="text-xs text-zinc-500 max-w-[220px] mx-auto mt-1 leading-relaxed">
                {currentLang === 'en' 
                  ? 'Try modifying your search keywords or clearing active filters.' 
                  : 'अपने खोज कीवर्ड को बदलने या सक्रिय फ़िल्टर साफ़ करने का प्रयास करें।'}
              </p>
            </div>
            <button
              id="btn-clear-filters-empty"
              onClick={handleReset}
              className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:bg-zinc-850 active:scale-95 transition-all"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
