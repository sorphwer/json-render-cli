import { AppError } from "../errors";
import type { JsonRenderConfig, UISpec, UISpecElement } from "../types";

function ensureObject(input: unknown): Record<string, unknown> {
  if (typeof input === "object" && input !== null && !Array.isArray(input)) {
    return input as Record<string, unknown>;
  }

  return {};
}

export function validateAndPrepareSpec(
  spec: UISpec,
  config: JsonRenderConfig,
  builtinComponents: readonly string[]
): UISpec {
  const builtins = new Set(builtinComponents);
  const allowed = new Set(config.catalog.allowedComponents);
  const normalizedElements: Record<string, UISpecElement> = {};

  for (const [key, element] of Object.entries(spec.elements)) {
    if (!builtins.has(element.type)) {
      throw new AppError({
        code: 1,
        message: `Message JSON contains unknown component type "${element.type}" at element "${key}".`
      });
    }

    if (!allowed.has(element.type)) {
      throw new AppError({
        code: 1,
        message: `Component type "${element.type}" is not allowed by config.catalog.allowedComponents (element "${key}").`
      });
    }

    const defaults = ensureObject(config.catalog.componentDefaults[element.type]);
    const props = {
      ...defaults,
      ...ensureObject(element.props)
    };

    normalizedElements[key] = {
      ...element,
      props,
      children: element.children ? [...element.children] : undefined
    };
  }

  return {
    root: spec.root,
    elements: normalizedElements
  };
}
