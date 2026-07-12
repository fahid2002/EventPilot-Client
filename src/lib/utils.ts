export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(new Date(date));
}

export function formatPrice(price: number) {
  if (price === 0) return "Free";
  return `৳${price.toLocaleString("en-US")}`;
}

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
