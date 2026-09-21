"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SortDropdown() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sort = searchParams.get('sort') || 'newest';

  return (
    <select 
      value={sort}
      onChange={(e) => router.push("/collection?sort=" + e.target.value)}
      className="bg-transparent text-foreground font-medium focus:outline-none cursor-pointer"
    >
      <option value="newest">Mới nhất</option>
      <option value="price_asc">Giá tăng dần</option>
      <option value="price_desc">Giá giảm dần</option>
    </select>
  );
}
