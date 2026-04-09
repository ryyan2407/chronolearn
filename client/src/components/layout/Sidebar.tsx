import { NavLink } from "react-router-dom";

import { navItems } from "../../lib/constants";
import { cn } from "../../lib/utils";

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 lg:block">
      <div className="sticky top-28 space-y-2 rounded-[28px] border border-stone-200 bg-white p-4 shadow-soft">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "block rounded-2xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-stone-100 hover:text-slate-900",
                isActive && "bg-slate-900 text-stone-50 hover:bg-slate-900 hover:text-stone-50"
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </aside>
  );
}
