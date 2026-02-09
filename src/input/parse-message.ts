import Ajv from "ajv";
import addFormats from "ajv-formats";

import { AppError } from "../errors";
import type { MessageSpec } from "../types";

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

const messageSchema = {
  $id: "https://json-render-cli/message.schema.json",
  $defs: {
    treeElement: {
      type: "object",
      additionalProperties: false,
      required: ["type"],
      properties: {
        type: { type: "string", minLength: 1 },
        props: { type: "object", additionalProperties: true },
        children: {
          type: "array",
          items: { $ref: "#/$defs/treeElement" }
        },
        visible: {}
      }
    }
  },
  oneOf: [
    {
      type: "object",
      additionalProperties: false,
      required: ["root", "elements"],
      properties: {
        root: { type: "string", minLength: 1 },
        elements: {
          type: "object",
          minProperties: 1,
          additionalProperties: {
            type: "object",
            additionalProperties: false,
            required: ["type"],
            properties: {
              type: { type: "string", minLength: 1 },
              props: { type: "object", additionalProperties: true },
              children: {
                type: "array",
                items: { type: "string", minLength: 1 }
              },
              visible: {}
            }
          }
        }
      }
    },
    {
      type: "object",
      additionalProperties: false,
      required: ["root"],
      properties: {
        root: { $ref: "#/$defs/treeElement" }
      }
    }
  ]
};

const validateMessage = ajv.compile(messageSchema);

export function parseMessage(message: string): MessageSpec {
  let parsed: unknown;

  try {
    parsed = JSON.parse(message);
  } catch (error) {
    throw new AppError({
      code: 1,
      message: `Failed to parse -m JSON: ${(error as Error).message}`,
      cause: error
    });
  }

  const valid = validateMessage(parsed);

  if (!valid) {
    const details = (validateMessage.errors ?? [])
      .map((issue) => {
        const path = issue.instancePath && issue.instancePath.length > 0 ? issue.instancePath : "(root)";
        return `${path}: ${issue.message ?? "invalid value"}`;
      })
      .join("; ");

    throw new AppError({
      code: 1,
      message: `Message JSON does not match schema: ${details}`
    });
  }

  return parsed as MessageSpec;
}
