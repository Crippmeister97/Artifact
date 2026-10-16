import {
  createElement,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

export function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return createElement("button", props);
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return createElement("input", props);
}

export function Heading({
  level,
  children,
}: {
  level: 1 | 2 | 3;
  children: ReactNode;
}) {
  return createElement(`h${level}`, null, children);
}
