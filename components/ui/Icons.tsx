import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };

function Base({ size = 20, children, ...rest }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}>
      {children}
    </svg>
  );
}

export const SearchIcon = (p: P) => (
  <Base {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-4.2-4.2" />
  </Base>
);
export const HeartIcon = ({ filled, ...p }: P & { filled?: boolean }) => (
  <Base {...p} fill={filled ? "currentColor" : "none"}>
    <path d="M12 20s-7.5-4.4-7.5-10A4.3 4.3 0 0 1 12 7.6 4.3 4.3 0 0 1 19.5 10c0 5.6-7.5 10-7.5 10Z" />
  </Base>
);
export const BagIcon = (p: P) => (
  <Base {...p}>
    <path d="M5 8h14l-1 12H6L5 8Z" />
    <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
  </Base>
);
export const UserIcon = (p: P) => (
  <Base {...p}>
    <circle cx="12" cy="8.5" r="3.5" />
    <path d="M5 20c1-3.5 3.8-5 7-5s6 1.5 7 5" />
  </Base>
);
export const MenuIcon = (p: P) => (
  <Base {...p}>
    <path d="M4 8h16M4 16h16" />
  </Base>
);
export const CloseIcon = (p: P) => (
  <Base {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Base>
);
export const ArrowIcon = (p: P) => (
  <Base {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Base>
);
export const ArrowLeftIcon = (p: P) => (
  <Base {...p}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </Base>
);
export const ChevronIcon = (p: P) => (
  <Base {...p}>
    <path d="m9 6 6 6-6 6" />
  </Base>
);
export const ChevronDownIcon = (p: P) => (
  <Base {...p}>
    <path d="m6 9 6 6 6-6" />
  </Base>
);
export const CheckIcon = (p: P) => (
  <Base {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Base>
);
export const PlusIcon = (p: P) => (
  <Base {...p}>
    <path d="M12 5v14M5 12h14" />
  </Base>
);
export const MinusIcon = (p: P) => (
  <Base {...p}>
    <path d="M5 12h14" />
  </Base>
);
export const CalendarIcon = (p: P) => (
  <Base {...p}>
    <rect x="4" y="5.5" width="16" height="14" rx="1" />
    <path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" />
  </Base>
);
export const RulerIcon = (p: P) => (
  <Base {...p}>
    <path d="m3.5 15.5 12-12 5 5-12 12-5-5Z" />
    <path d="m7 12 2 2M10 9l1.5 1.5M13 6l2 2" />
  </Base>
);
export const CompareIcon = (p: P) => (
  <Base {...p}>
    <rect x="3.5" y="5" width="7" height="14" />
    <rect x="13.5" y="5" width="7" height="14" />
  </Base>
);
export const EyeIcon = (p: P) => (
  <Base {...p}>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
    <circle cx="12" cy="12" r="3" />
  </Base>
);
export const TruckIcon = (p: P) => (
  <Base {...p}>
    <path d="M3 6.5h11v10H3zM14 10h4l3 3v3.5h-7" />
    <circle cx="7" cy="17.5" r="1.8" />
    <circle cx="17.5" cy="17.5" r="1.8" />
  </Base>
);
export const StoreIcon = (p: P) => (
  <Base {...p}>
    <path d="M4 9.5 5.5 4.5h13L20 9.5M4 9.5h16M4 9.5v10h16v-10M9.5 19.5v-5h5v5" />
  </Base>
);
export const ShieldIcon = (p: P) => (
  <Base {...p}>
    <path d="M12 3.5 19 6v5.5c0 4.3-3 7.6-7 9-4-1.4-7-4.7-7-9V6l7-2.5Z" />
    <path d="m9 12 2 2 4-4" />
  </Base>
);
export const SparkIcon = (p: P) => (
  <Base {...p}>
    <path d="M12 3v5M12 16v5M3 12h5M16 12h5M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
  </Base>
);
export const DropIcon = (p: P) => (
  <Base {...p}>
    <path d="M12 3.5S6 10 6 14a6 6 0 0 0 12 0c0-4-6-10.5-6-10.5Z" />
  </Base>
);
export const SteamIcon = (p: P) => (
  <Base {...p}>
    <path d="M8 4c-1.5 1.5 1.5 3-0 4.5M12 4c-1.5 1.5 1.5 3 0 4.5M16 4c-1.5 1.5 1.5 3 0 4.5" />
    <path d="M4 12h16l-1.5 7.5h-13L4 12Z" />
  </Base>
);
export const LoupeIcon = (p: P) => (
  <Base {...p}>
    <circle cx="10" cy="10" r="5.5" />
    <path d="m14 14 6 6M8 10l1.5 1.5L12.5 8.5" />
  </Base>
);
export const BoxIcon = (p: P) => (
  <Base {...p}>
    <path d="M3.5 7.5 12 3.5l8.5 4v9L12 20.5l-8.5-4v-9Z" />
    <path d="M3.5 7.5 12 11.5l8.5-4M12 11.5v9" />
  </Base>
);
export const DownloadIcon = (p: P) => (
  <Base {...p}>
    <path d="M12 4v11M7 10.5l5 5 5-5M5 20h14" />
  </Base>
);
export const StarIcon = ({ filled = true, ...p }: P & { filled?: boolean }) => (
  <Base {...p} fill={filled ? "currentColor" : "none"} strokeWidth={1.1}>
    <path d="m12 3.8 2.5 5.2 5.6.7-4.1 3.9 1 5.6L12 16.5l-5 2.7 1-5.6-4.1-3.9 5.6-.7L12 3.8Z" />
  </Base>
);
export const MountainIcon = (p: P) => (
  <Base {...p}>
    <path d="m2.5 19.5 6.5-11 4 6.5 2.5-3.5 6 8H2.5Z" />
    <path d="m7.2 11.2 1.8 1.3 1.6-1.4" />
  </Base>
);
