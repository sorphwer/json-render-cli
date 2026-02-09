import { AppError } from "../errors";
import type { MessageSpec, UISpec, UISpecElement, UITreeElement } from "../types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isFlatSpec(input: MessageSpec): input is UISpec {
  return isRecord(input) && typeof input.root === "string" && isRecord(input.elements);
}

function normalizeProps(value: unknown): Record<string, unknown> {
  if (!isRecord(value)) {
    return {};
  }

  return value;
}

function normalizeFlatSpec(spec: UISpec): UISpec {
  const normalizedElements: Record<string, UISpecElement> = {};

  for (const [key, element] of Object.entries(spec.elements)) {
    normalizedElements[key] = {
      ...element,
      props: normalizeProps(element.props),
      children: Array.isArray(element.children) ? [...element.children] : undefined
    };
  }

  if (!spec.root || !normalizedElements[spec.root]) {
    throw new AppError({
      code: 1,
      message: `Message JSON is invalid: root "${spec.root}" was not found in elements.`
    });
  }

  validateFlatGraph(spec.root, normalizedElements);

  return {
    root: spec.root,
    elements: normalizedElements
  };
}

function validateFlatGraph(rootKey: string, elements: Record<string, UISpecElement>): void {
  const visiting = new Set<string>();
  const visited = new Set<string>();

  const walk = (key: string): void => {
    if (visiting.has(key)) {
      throw new AppError({
        code: 1,
        message: `Message JSON is invalid: cycle detected at element "${key}".`
      });
    }

    if (visited.has(key)) {
      return;
    }

    const element = elements[key];

    if (!element) {
      throw new AppError({
        code: 1,
        message: `Message JSON is invalid: referenced element "${key}" was not found.`
      });
    }

    visiting.add(key);

    for (const childKey of element.children ?? []) {
      if (!elements[childKey]) {
        throw new AppError({
          code: 1,
          message: `Message JSON is invalid: child reference "${childKey}" not found (parent: "${key}").`
        });
      }

      walk(childKey);
    }

    visiting.delete(key);
    visited.add(key);
  };

  walk(rootKey);
}

function normalizeTreeSpec(spec: { root: UITreeElement }): UISpec {
  const elements: Record<string, UISpecElement> = {};
  let nextKey = 0;

  const allocateKey = (): string => {
    nextKey += 1;
    return `n${nextKey}`;
  };

  const walk = (node: UITreeElement, currentKey: string): void => {
    const childrenKeys: string[] = [];

    elements[currentKey] = {
      type: node.type,
      props: normalizeProps(node.props),
      children: childrenKeys,
      visible: node.visible as UISpecElement["visible"]
    };

    for (const child of node.children ?? []) {
      const childKey = allocateKey();
      childrenKeys.push(childKey);
      walk(child, childKey);
    }
  };

  walk(spec.root, "root");

  return {
    root: "root",
    elements
  };
}

export function normalizeMessageSpec(spec: MessageSpec): UISpec {
  if (isFlatSpec(spec)) {
    return normalizeFlatSpec(spec);
  }

  return normalizeTreeSpec(spec);
}
