import Avatar from "$store/components/ui/Avatar.tsx";
import { parseRange } from "deco-sites/std/utils/filters.ts";
import { formatPrice } from "$store/sdk/format.ts";
import type {
  Filter,
  FilterToggle,
  FilterToggleValue,
  ProductListingPage,
} from "deco-sites/std/commerce/types.ts";

interface Props {
  filters: ProductListingPage["filters"];
}

const isToggle = (filter: Filter): filter is FilterToggle =>
  filter["@type"] === "FilterToggle";

function ValueItem(
  { url, selected, label, quantity }: FilterToggleValue,
) {
  return (
    <a href={url} class="flex items-center gap-2">
      <div
        aria-checked={selected}
        class="checkbox  rounded-none border-black w-[15px] h-[15px]"
      />
      <span class="text-sm font-normal leading-6 text-neutral-800">
        {label}
      </span>
      {quantity > 0 && (
        <span class="hidden text-sm text-base-300">({quantity})</span>
      )}
    </a>
  );
}

function FilterValues({ key, values }: FilterToggle) {
  const flexDirection = key === "tamanho" || key === "Cores Disponíveis"
    ? "flex-row"
    : "flex-col";

  return (
    <ul class={`flex flex-wrap gap-2 ${flexDirection}`}>
      {values.map((item) => {
        const { url, selected, value, quantity } = item;

        if (key === "Cores Disponíveis" || key === "tamanho") {
          return (
            <a href={url}>
              <Avatar
                content={value}
                variant={selected ? "active" : "default"}
                type={key === "Cores Disponíveis" ? "color" : "default"}
              />
            </a>
          );
        }

        if (key === "price") {
          const range = parseRange(item.value);

          return range && (
            <ValueItem
              {...item}
              label={`${formatPrice(range.from)} - ${formatPrice(range.to)}`}
            />
          );
        }

        return <ValueItem {...item} />;
      })}
    </ul>
  );
}

function Filters({ filters }: Props) {
  return (
    <ul class="flex flex-col gap-6 max-md:p-4">
      {filters
        .filter(isToggle)
        .map((filter) => (
          <li
            class={`flex flex-col gap-4 ${
              filter.label === "Cores Disponíveis" && "order-1"
            }
              ${filter.label === "Brands" && "order-2"}
              ${filter.label === "Fibras" && "order-3"}
              ${filter.label === "Forros Indicados" && "order-4"}
              ${filter.label === "Utilização" && "order-5"}
              ${filter.label === "Corte e Modelagem" && "order-6"}
              ${filter.label === "Tendências" && "order-7"}
               ${filter.label === "Período" && "order-8"}
               ${filter.label === "Departmentss" && "hidden"}`}
          >
            {filter.label === "Forros Indicados" && (
              <img
                src="/arquivos/banner-filter.png"
                alt="Forros Indicados"
                width={236}
                loading={"lazy"}
              />
            )}
            <span class="text-base font-semibold leading-[19px] text-neutral-800">
              {filter.label === "Brands" ? "Marcas" : filter.label}
            </span>
            <FilterValues {...filter} />
          </li>
        ))}
    </ul>
  );
}

export default Filters;
