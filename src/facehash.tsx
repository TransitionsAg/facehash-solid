import { createMemo, createSignal, createUniqueId, splitProps, type JSX } from "solid-js";
import { createFacehashScene, type Intensity3D, type Variant } from "./core/index.js";
import { FacehashSceneSvg } from "./facehash-scene-svg.js";
import {
  useFacehashConfig,
  type FacehashBackgroundClassesConfig,
  type FacehashBackgroundColorsConfig,
  type FacehashConfig,
  type FacehashBackgroundConfig,
} from "./facehash-context.js";

export type { Intensity3D, Variant } from "./core/index.js";
export type {
  FacehashAnimationsConfig,
  FacehashBackgroundConfig,
  FacehashConfig,
} from "./facehash-context.js";
export { FacehashProvider } from "./facehash-context.js";

export type FacehashProps = Omit<
  JSX.HTMLAttributes<HTMLDivElement>,
  "children" | "style" | "onMouseEnter" | "onMouseLeave"
> & {
  name: string;
  class?: string;
  size?: number | string;
  config?: FacehashConfig;
  onRenderMouth?: () => JSX.Element;
  className?: string;
  style?: JSX.CSSProperties;
  onMouseEnter?: (event: MouseEvent & { currentTarget: HTMLDivElement }) => void;
  onMouseLeave?: (event: MouseEvent & { currentTarget: HTMLDivElement }) => void;
};

function sanitizeId(value: string): string {
  return value.replace(/[^a-zA-Z0-9_-]/g, "-");
}

function hasBackgroundClasses(
  background: FacehashBackgroundConfig | undefined,
): background is FacehashBackgroundClassesConfig {
  return !!background && "classes" in background;
}

function hasBackgroundColors(
  background: FacehashBackgroundConfig | undefined,
): background is FacehashBackgroundColorsConfig {
  return !!background && "colors" in background;
}

function mergeConfig(
  base: FacehashConfig | undefined,
  override: FacehashConfig | undefined,
): FacehashConfig {
  const baseBackground = base?.colors?.background;
  const overrideBackground = override?.colors?.background;
  const mergedBackground = hasBackgroundClasses(overrideBackground)
    ? { classes: overrideBackground.classes }
    : hasBackgroundColors(overrideBackground)
      ? { colors: overrideBackground.colors }
      : hasBackgroundClasses(baseBackground)
        ? { classes: baseBackground.classes }
        : hasBackgroundColors(baseBackground)
          ? { colors: baseBackground.colors }
          : undefined;

  return {
    variant: override?.variant ?? base?.variant,
    initials: override?.initials ?? base?.initials,
    animations: {
      intensity: override?.animations?.intensity ?? base?.animations?.intensity,
      interactive: override?.animations?.interactive ?? base?.animations?.interactive,
      blinking: override?.animations?.blinking ?? base?.animations?.blinking,
    },
    colors: mergedBackground ? { background: mergedBackground } : undefined,
  };
}

export function Facehash(props: FacehashProps) {
  const facehashConfig = useFacehashConfig();
  const [local, domProps] = splitProps(props, [
    "name",
    "size",
    "config",
    "onRenderMouth",
    "className",
    "class",
    "style",
    "onMouseEnter",
    "onMouseLeave",
  ]);

  const config = createMemo(() => mergeConfig(facehashConfig, local.config));

  const [isHovered, setIsHovered] = createSignal(false);
  const uniqueId = createUniqueId();

  const background = () => config().colors?.background;
  const backgroundClasses = () => background()?.classes;
  const backgroundColors = () => background()?.colors;
  const colorsLength = () => backgroundClasses()?.length ?? backgroundColors()?.length ?? 1;
  const scene = createMemo(() =>
    createFacehashScene({
      name: local.name,
      colorsLength: colorsLength(),
      intensity3d: config().animations?.intensity ?? "dramatic",
      pose: isHovered() && (config().animations?.interactive ?? true) ? "front" : "seed",
    }),
  );

  const colorIndex = () => scene().data.colorIndex;
  const backgroundClass = () => backgroundClasses()?.[colorIndex()];
  const backgroundColor = () => backgroundColors()?.[colorIndex()];
  const sizeValue = () =>
    typeof local.size === "number" ? `${local.size}px` : (local.size ?? "40px");
  const svgIdPrefix = sanitizeId(`facehash-${uniqueId}-${local.name}`);
  const interactive = () => config().animations?.interactive ?? true;
  const variant = () => config().variant ?? "gradient";
  const initialText = () => {
    const initials = config().initials;

    if (initials === false || local.onRenderMouth) {
      return undefined;
    }

    const text = scene().data.initial;
    if (typeof initials === "number") {
      return text.slice(0, Math.max(0, initials));
    }

    return text;
  };
  const rootClass = () =>
    ["facehash", backgroundClass(), local.className, local.class].filter(Boolean).join(" ");
  const rootStyle = (): JSX.CSSProperties => ({
    position: "relative",
    display: "flex",
    "align-items": "center",
    "justify-content": "center",
    overflow: "hidden",
    width: sizeValue(),
    height: sizeValue(),
    ...(backgroundColor() && !backgroundClass() ? { "background-color": backgroundColor() } : {}),
    ...(local.style ?? {}),
  });
  const mouthStyle: JSX.CSSProperties = {
    position: "absolute",
    left: "50%",
    top: "70%",
    "z-index": 2,
    display: "flex",
    "align-items": "center",
    "justify-content": "center",
    transform: "translate(-50%, -50%)",
  };

  return (
    <div
      class={rootClass()}
      data-facehash=""
      data-interactive={interactive() || undefined}
      onMouseEnter={(event) => {
        if (interactive()) {
          setIsHovered(true);
        }
        (
          local.onMouseEnter as
            | ((event: MouseEvent & { currentTarget: HTMLDivElement }) => void)
            | undefined
        )?.(event);
      }}
      onMouseLeave={(event) => {
        if (interactive()) {
          setIsHovered(false);
        }
        (
          local.onMouseLeave as
            | ((event: MouseEvent & { currentTarget: HTMLDivElement }) => void)
            | undefined
        )?.(event);
      }}
      style={rootStyle()}
      {...domProps}
    >
      <FacehashSceneSvg
        backgroundColor={backgroundClass() ? "transparent" : (backgroundColor() ?? "transparent")}
        enableBlink={config().animations?.blinking ?? false}
        height="100%"
        idPrefix={svgIdPrefix}
        scene={scene()}
        initialText={initialText()}
        style={{ color: "inherit" }}
        variant={variant()}
        width="100%"
        withAnimatedProjection={interactive()}
      />

      {local.onRenderMouth && (
        <div data-facehash-mouth="" style={mouthStyle}>
          {local.onRenderMouth()}
        </div>
      )}
    </div>
  );
}
