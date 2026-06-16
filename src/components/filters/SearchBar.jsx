import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setSearch } from '../../redux/slices/productsSlice';
import { useDebounce } from '../../hooks/useDebounce';

export function SearchBar({ initialValue = '' }) {
  const [value, setValue] = useState(initialValue);
  const debounced = useDebounce(value, 350);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearch(debounced));
  }, [debounced, dispatch]);

  return (
    <div className="relative">
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search jackets, knitwear, color…"
        aria-label="Search products"
        className="w-full border border-line bg-transparent px-4 py-3 font-body text-sm placeholder:text-ink/40 focus:border-ink focus:outline-none"
      />
    </div>
  );
}
