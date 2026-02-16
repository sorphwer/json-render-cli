import type { CSSProperties, JSX, ReactNode } from "react";

import type { ComponentRenderProps } from "@json-render/react";

function toStyle(input: unknown): CSSProperties {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return {};
  }

  const style: Record<string, string | number> = {};

  for (const [key, value] of Object.entries(input)) {
    if (typeof value === "string" || typeof value === "number") {
      style[key] = value;
    }
  }

  return style;
}

function joinChildren(children: ReactNode): ReactNode {
  return children;
}

function getNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function getString(value: unknown, fallback: string): string {
  return typeof value === "string" ? value : fallback;
}

function commonBoxStyle(props: Record<string, unknown>): CSSProperties {
  return {
    width: props.width as string | number | undefined,
    height: props.height as string | number | undefined,
    minWidth: props.minWidth as string | number | undefined,
    minHeight: props.minHeight as string | number | undefined,
    maxWidth: props.maxWidth as string | number | undefined,
    maxHeight: props.maxHeight as string | number | undefined,
    margin: props.margin as string | number | undefined,
    padding: props.padding as string | number | undefined,
    borderRadius: props.borderRadius as string | number | undefined,
    borderWidth: props.borderWidth as string | number | undefined,
    borderStyle: props.borderStyle as string | undefined,
    borderColor: props.borderColor as string | undefined,
    background: props.background as string | undefined,
    color: props.color as string | undefined,
    boxShadow: props.shadow as string | undefined,
    overflow: props.overflow as CSSProperties["overflow"]
  };
}

export function Container({ element, children }: ComponentRenderProps): JSX.Element {
  const props = element.props as Record<string, unknown>;
  const style: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: props.gap as string | number | undefined,
    ...commonBoxStyle(props),
    ...toStyle(props.style)
  };

  return <div style={style}>{joinChildren(children)}</div>;
}

export function Row({ element, children }: ComponentRenderProps): JSX.Element {
  const props = element.props as Record<string, unknown>;
  const style: CSSProperties = {
    display: "flex",
    flexDirection: "row",
    gap: props.gap as string | number | undefined,
    alignItems: props.align as CSSProperties["alignItems"],
    justifyContent: props.justify as CSSProperties["justifyContent"],
    flexWrap: props.wrap ? "wrap" : "nowrap",
    ...commonBoxStyle(props),
    ...toStyle(props.style)
  };

  return <div style={style}>{joinChildren(children)}</div>;
}

export function Column({ element, children }: ComponentRenderProps): JSX.Element {
  const props = element.props as Record<string, unknown>;
  const style: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: props.gap as string | number | undefined,
    alignItems: props.align as CSSProperties["alignItems"],
    justifyContent: props.justify as CSSProperties["justifyContent"],
    ...commonBoxStyle(props),
    ...toStyle(props.style)
  };

  return <div style={style}>{joinChildren(children)}</div>;
}

export function Card({ element, children }: ComponentRenderProps): JSX.Element {
  const props = element.props as Record<string, unknown>;
  const style: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: props.gap as string | number | 12,
    padding: props.padding as string | number | 16,
    background: (props.background as string) ?? "var(--jr-card-bg)",
    border: `1px solid ${(props.borderColor as string) ?? "var(--jr-card-border)"}`,
    borderRadius: (props.borderRadius as string | number) ?? "var(--jr-radius)",
    ...commonBoxStyle(props),
    ...toStyle(props.style)
  };

  return <section style={style}>{joinChildren(children)}</section>;
}

export function Text({ element }: ComponentRenderProps): JSX.Element {
  const props = element.props as Record<string, unknown>;
  const style: CSSProperties = {
    margin: 0,
    color: (props.color as string) ?? "var(--jr-text)",
    fontSize: getNumber(props.size, 16),
    fontWeight: getNumber(props.weight, 400),
    lineHeight: getNumber(props.lineHeight, 1.5),
    textAlign: (props.align as CSSProperties["textAlign"]) ?? "left",
    ...toStyle(props.style)
  };

  return <p style={style}>{getString(props.text, "")}</p>;
}

export function Heading({ element }: ComponentRenderProps): JSX.Element {
  const props = element.props as Record<string, unknown>;
  const level = Math.max(1, Math.min(6, getNumber(props.level, 2)));
  const tag = `h${level}` as keyof JSX.IntrinsicElements;

  const style: CSSProperties = {
    margin: 0,
    color: (props.color as string) ?? "var(--jr-heading)",
    fontSize: getNumber(props.size, level === 1 ? 40 : level === 2 ? 32 : 24),
    fontWeight: getNumber(props.weight, 700),
    lineHeight: getNumber(props.lineHeight, 1.2),
    textAlign: (props.align as CSSProperties["textAlign"]) ?? "left",
    ...toStyle(props.style)
  };

  return tag === "h1" ? (
    <h1 style={style}>{getString(props.text, "")}</h1>
  ) : tag === "h2" ? (
    <h2 style={style}>{getString(props.text, "")}</h2>
  ) : tag === "h3" ? (
    <h3 style={style}>{getString(props.text, "")}</h3>
  ) : tag === "h4" ? (
    <h4 style={style}>{getString(props.text, "")}</h4>
  ) : tag === "h5" ? (
    <h5 style={style}>{getString(props.text, "")}</h5>
  ) : (
    <h6 style={style}>{getString(props.text, "")}</h6>
  );
}

export function Badge({ element }: ComponentRenderProps): JSX.Element {
  const props = element.props as Record<string, unknown>;
  const style: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "fit-content",
    borderRadius: (props.borderRadius as string | number) ?? 999,
    background: (props.background as string) ?? "#e2e8f0",
    color: (props.color as string) ?? "#0f172a",
    padding: (props.padding as string | number) ?? "4px 10px",
    fontSize: getNumber(props.size, 12),
    fontWeight: getNumber(props.weight, 600),
    ...toStyle(props.style)
  };

  return <span style={style}>{getString(props.text, "")}</span>;
}

export function Divider({ element }: ComponentRenderProps): JSX.Element {
  const props = element.props as Record<string, unknown>;
  const style: CSSProperties = {
    border: 0,
    borderTop: `${getNumber(props.thickness, 1)}px solid ${(props.color as string) ?? "#e2e8f0"}`,
    margin: (props.margin as string | number) ?? "4px 0",
    width: "100%",
    ...toStyle(props.style)
  };

  return <hr style={style} />;
}

export function Spacer({ element }: ComponentRenderProps): JSX.Element {
  const props = element.props as Record<string, unknown>;
  const style: CSSProperties = {
    width: (props.width as string | number) ?? "100%",
    height: (props.height as string | number) ?? getNumber(props.size, 8)
  };

  return <div style={style} />;
}

export function Button({ element }: ComponentRenderProps): JSX.Element {
  const props = element.props as Record<string, unknown>;
  const style: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "fit-content",
    border: "none",
    borderRadius: (props.borderRadius as string | number) ?? "var(--jr-radius)",
    background: (props.background as string) ?? "#2563eb",
    color: (props.color as string) ?? "#ffffff",
    padding: (props.padding as string | number) ?? "10px 14px",
    fontSize: getNumber(props.size, 14),
    fontWeight: getNumber(props.weight, 600),
    lineHeight: 1,
    ...toStyle(props.style)
  };

  return <button style={style}>{getString(props.label ?? props.text, "Button")}</button>;
}

export function Image({ element }: ComponentRenderProps): JSX.Element {
  const props = element.props as Record<string, unknown>;
  const src = getString(props.src, "");

  if (!src) {
    return <div style={{ color: "#b91c1c", fontSize: 12 }}>Image src is required.</div>;
  }

  const style: CSSProperties = {
    display: "block",
    width: props.width as string | number | undefined,
    height: props.height as string | number | undefined,
    objectFit: (props.fit as CSSProperties["objectFit"]) ?? "cover",
    borderRadius: props.borderRadius as string | number | undefined,
    ...toStyle(props.style)
  };

  return <img src={src} alt={getString(props.alt, "image")} style={style} />;
}
