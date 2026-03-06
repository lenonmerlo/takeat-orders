import { Search } from "lucide-react";

function SearchBar({
  placeholder = "Buscar produtos...",
  value = "",
  onChange,
}) {
  return (
    <div className="tk-search mb-5">
      <Search className="h-5 w-5 text-slate-500" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        className="w-full border-0 bg-transparent text-slate-700 outline-none placeholder:text-slate-500"
      />
    </div>
  );
}

export default SearchBar;
