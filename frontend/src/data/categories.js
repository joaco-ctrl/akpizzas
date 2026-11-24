const categoryAliases = {
  "combo hamburguesa + papas + bebida": "combos",
  "promo pizzas para hornear": "promo-pizzas",
  "nuggets y aros de cebolla": "nuggets-aros",
  "papas fritas": "papas",
  "hamburguesas simples": "simples",
  "hamburguesas dobles": "dobles",
  "hamburguesas triples": "triples",
  "hamburguesas sin papas": "sin-papas",
  "pizzas para hornear": "pizzas",
};

export function categoryIdFromName(name) {
  const normalizedName = typeof name === "string"
    ? name.trim().toLocaleLowerCase("es-AR")
    : "";

  return categoryAliases[normalizedName] || normalizedName
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
