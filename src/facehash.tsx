import { createMemo, createSignal, createUniqueId, splitProps, type JSX } from "solid-js";
import { createFacehashScene, type Intensity3D, type Variant } from "./core/index.js";
import { FacehashSceneSvg } from "./facehash-scene-svg.js";

export type { Intensity3D, Variant } from "./core/index.js";

export type FacehashProps = Omit<
  JSX.HTMLAttributes<HTMLDivElement>,
  "children" | "style" | "onMouseEnter" | "onMouseLeave"
> & {
  name: string;
  class?: string;
  size?: number | string;
  variant?: Variant;
  intensity3d?: Intensity3D;
  interactive?: boolean;
  showInitial?: boolean;
  colors?: string[];
  colorClasses?: string[];
  gradientOverlayClass?: string;
  onRenderMouth?: () => JSX.Element;
  enableBlink?: boolean;
  className?: string;
  style?: JSX.CSSProperties;
  onMouseEnter?: (event: MouseEvent & { currentTarget: HTMLDivElement }) => void;
  onMouseLeave?: (event: MouseEvent & { currentTarget: HTMLDivElement }) => void;
};

function sanitizeId(value: string): string {
  return value.replace(/[^a-zA-Z0-9_-]/g, "-");
}

function joinClasses(...values: Array<string | undefined | false | null>): string {
  return values.filter(Boolean).join(" ");
}

export function Facehash(props: FacehashProps) {
  const [local, domProps] = splitProps(props, [
    "name",
    "size",
    "variant",
    "intensity3d",
    "interactive",
    "showInitial",
    "colors",
    "colorClasses",
    "gradientOverlayClass",
    "onRenderMouth",
    "enableBlink",
    "className",
    "class",
    "style",
    "onMouseEnter",
    "onMouseLeave",
  ]);

  const [isHovered, setIsHovered] = createSignal(false);
  const uniqueId = createUniqueId();

  const colorsLength = () => local.colorClasses?.length ?? local.colors?.length ?? 1;
  const scene = createMemo(() =>
    createFacehashScene({
      name: local.name,
      colorsLength: colorsLength(),
      intensity3d: local.intensity3d ?? "dramatic",
      pose: isHovered() && (local.interactive ?? true) ? "front" : "seed",
    }),
  );

  const colorIndex = () => scene().data.colorIndex;
  const backgroundClass = () => local.colorClasses?.[colorIndex()];
  const backgroundColor = () => local.colors?.[colorIndex()];
  const sizeValue = () =>
    typeof local.size === "number" ? `${local.size}px` : (local.size ?? "40px");
  const svgIdPrefix = sanitizeId(`facehash-${uniqueId}-${local.name}`);
  const interactive = () => local.interactive ?? true;
  const variant = () => local.variant ?? "gradient";
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
  const gradientStyle: JSX.CSSProperties = {
    position: "absolute",
    inset: 0,
    "pointer-events": "none",
    "z-index": 1,
  };
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
        enableBlink={local.enableBlink ?? false}
        height="100%"
        idPrefix={svgIdPrefix}
        scene={scene()}
        showInitial={(local.showInitial ?? true) && !local.onRenderMouth}
        style={{ color: "inherit" }}
        variant={local.gradientOverlayClass ? "solid" : variant()}
        width="100%"
        withAnimatedProjection={interactive()}
      />

      {variant() === "gradient" && local.gradientOverlayClass && (
        <div class={local.gradientOverlayClass} data-facehash-gradient="" style={gradientStyle} />
      )}

      {local.onRenderMouth && (
        <div data-facehash-mouth="" style={mouthStyle}>
          {local.onRenderMouth()}
        </div>
      )}
    </div>
  );
}
