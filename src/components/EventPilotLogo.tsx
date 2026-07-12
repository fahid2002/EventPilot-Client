import { CalendarDays, MapPin } from "lucide-react";

export function EventPilotLogo() {
  return (
    <div className="relative grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-mint-500 text-white shadow-glow">
      <CalendarDays className="h-6 w-6" />
      <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-amberx text-[10px] font-black text-white shadow-sm">
        <MapPin className="h-3 w-3" />
      </span>
    </div>
  );
}
