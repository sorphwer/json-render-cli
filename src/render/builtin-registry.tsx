import type { ComponentRegistry } from "@json-render/react";

import {
  Badge,
  Button,
  Card,
  Column,
  Container,
  Divider,
  Heading,
  Image,
  Row,
  Spacer,
  Text
} from "./builtin-components";

export const BUILTIN_REGISTRY: ComponentRegistry = {
  Container,
  Row,
  Column,
  Card,
  Heading,
  Text,
  Badge,
  Divider,
  Spacer,
  Button,
  Image
};

export const BUILTIN_COMPONENTS = Object.freeze(Object.keys(BUILTIN_REGISTRY));
