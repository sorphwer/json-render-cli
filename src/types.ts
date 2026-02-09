import type { Spec, UIElement } from "@json-render/core";

export type UISpec = Spec;
export type UISpecElement = UIElement<string, Record<string, unknown>>;

export interface UITreeElement {
  type: string;
  props?: Record<string, unknown>;
  children?: UITreeElement[];
  visible?: unknown;
}

export interface UITreeSpec {
  root: UITreeElement;
}

export type MessageSpec = UISpec | UITreeSpec;

export interface ThemeConfig {
  fontFamily: string;
  textColor: string;
  headingColor: string;
  mutedTextColor: string;
  cardBackground: string;
  cardBorderColor: string;
  borderRadius: number;
  spacing: number;
}

export interface JsonRenderConfig {
  version: 1;
  catalog: {
    allowedComponents: string[];
    componentDefaults: Record<string, Record<string, unknown>>;
  };
  theme: ThemeConfig;
  viewport: {
    width: number;
    height: number;
    deviceScaleFactor: number;
  };
  screenshot: {
    type: "png";
    omitBackground: boolean;
  };
  canvas: {
    background: string;
    padding: number;
  };
}

export interface SizeOverride {
  width: number;
  height: number;
}

export interface AppErrorDetails {
  code: number;
  message: string;
  cause?: unknown;
}
