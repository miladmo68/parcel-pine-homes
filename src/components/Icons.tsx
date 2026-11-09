import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;
const base = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };

export const SearchIcon = (props: IconProps) => <svg {...base} {...props}><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>;
export const HeartIcon = ({ filled, ...props }: IconProps & { filled?: boolean }) => <svg {...base} {...props} fill={filled ? "currentColor" : "none"}><path d="M20.8 4.6a5.4 5.4 0 0 0-7.6 0L12 5.8l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6l1.2 1.2L12 21l7.6-7.6 1.2-1.2a5.4 5.4 0 0 0 0-7.6Z"/></svg>;
export const SlidersIcon = (props: IconProps) => <svg {...base} {...props}><path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/></svg>;
export const GridIcon = (props: IconProps) => <svg {...base} {...props}><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/></svg>;
export const MapIcon = (props: IconProps) => <svg {...base} {...props}><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3Z"/><path d="M9 3v15M15 6v15"/></svg>;
export const ArrowIcon = (props: IconProps) => <svg {...base} {...props}><path d="M5 12h14M14 7l5 5-5 5"/></svg>;
export const CloseIcon = (props: IconProps) => <svg {...base} {...props}><path d="m6 6 12 12M18 6 6 18"/></svg>;
export const CheckIcon = (props: IconProps) => <svg {...base} {...props}><path d="m5 12 4 4L19 6"/></svg>;
export const CalendarIcon = (props: IconProps) => <svg {...base} {...props}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/></svg>;
