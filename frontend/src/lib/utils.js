// src/lib/utils.js
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Versión limpia para JavaScript (sin ': ClassValue[]')
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Tus utilidades de negocio
export function initials(name) {
  if (!name) return "";
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

export function fmtDate(iso) {
  return iso ? new Date(iso + "T00:00").toLocaleDateString("es-CL", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : "—";
}

export function fmtDateShort(iso) {
  return iso ? new Date(iso + "T00:00").toLocaleDateString("es-CL", { year: "numeric", month: "long", day: "numeric" }) : "—";
}