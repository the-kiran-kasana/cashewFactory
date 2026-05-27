import MenuCard from "./MenuCard";
import { menuItems } from "./menuItems";

export default function MenuGrid({ onSelect }) {
  return (
    <div className="grid grid-cols-3 gap-5 md:grid-cols-3">
      {menuItems.map((item) => (
        <MenuCard
          key={item.key}
          item={item}
          onSelect={onSelect ? () => onSelect(item.key) : undefined}
        />
      ))}
    </div>
  );
}
