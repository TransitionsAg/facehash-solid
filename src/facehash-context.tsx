import { createContext, useContext, type JSX } from "solid-js";
import type { Intensity3D, Variant } from "./core/index.js";

export type FacehashAnimationsConfig = {
  intensity?: Intensity3D;
  interactive?: boolean;
  blinking?: boolean;
};

export type FacehashBackgroundClassesConfig = {
  classes: string[];
  colors?: never;
};

export type FacehashBackgroundColorsConfig = {
  colors: string[];
  classes?: never;
};

export type FacehashBackgroundConfig =
  | FacehashBackgroundClassesConfig
  | FacehashBackgroundColorsConfig;

export type FacehashConfig = {
  variant?: Variant;
  initials?: boolean | number;
  animations?: FacehashAnimationsConfig;
  colors?: {
    background?: FacehashBackgroundConfig;
  };
};

const FacehashContext = createContext<FacehashConfig>();

export type FacehashProviderProps = {
  value: FacehashConfig;
  children?: JSX.Element;
};

export function FacehashProvider(props: FacehashProviderProps) {
  return <FacehashContext.Provider value={props.value}>{props.children}</FacehashContext.Provider>;
}

export function useFacehashConfig() {
  return useContext(FacehashContext);
}
