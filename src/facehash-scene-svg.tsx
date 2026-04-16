import { createEffect, type JSX } from "solid-js";
import { ensureBlinkKeyframes, getBlinkStyle } from "./blink.js";
import type { FacehashScene, Variant } from "./core/index.js";

type FacehashSceneSvgProps = {
  backgroundColor: string;
  class?: string;
  className?: string;
  enableBlink?: boolean;
  height?: number | string;
  idPrefix: string;
  scene: FacehashScene;
  initialText?: string;
  style?: JSX.CSSProperties;
  variant: Variant;
  width?: number | string;
  withAnimatedProjection?: boolean;
};

function sanitizeId(value: string): string {
  return value.replace(/[^a-zA-Z0-9_-]/g, "-");
}

export function FacehashSceneSvg(props: FacehashSceneSvgProps) {
  createEffect(() => {
    if (props.enableBlink) {
      ensureBlinkKeyframes();
    }
  });

  const gradientId = `${sanitizeId(props.idPrefix)}-gradient`;
  const projectionStyle = (): JSX.CSSProperties | undefined =>
    props.withAnimatedProjection
      ? {
          "transform-box": "view-box",
          "transform-origin": "50% 50%",
          transform: props.scene.projection.cssTransform,
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "will-change": "transform",
        }
      : undefined;

  const svgStyle = (): JSX.CSSProperties => ({
    display: "block",
    overflow: "visible",
    ...props.style,
  });

  return (
    <svg
      aria-hidden="true"
      class={props.class ?? props.className}
      fill="none"
      height={props.height ?? "100%"}
      style={svgStyle()}
      viewBox="0 0 100 100"
      width={props.width ?? "100%"}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient
          cx={`${props.scene.gradientCenter.x}%`}
          cy={`${props.scene.gradientCenter.y}%`}
          id={gradientId}
          r="70%"
        >
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.15" />
          <stop offset="60%" stop-color="#ffffff" stop-opacity="0" />
        </radialGradient>
      </defs>

      <rect fill={props.backgroundColor} height="100" width="100" x="0" y="0" />
      {props.variant === "gradient" && (
        <rect fill={`url(#${gradientId})`} height="100" width="100" x="0" y="0" />
      )}

      <g style={projectionStyle()}>
        <g
          transform={`translate(${props.scene.faceBox.x} ${props.scene.faceBox.y}) scale(${props.scene.faceBox.width / props.scene.faceGeometry.viewBox.width} ${props.scene.faceBox.height / props.scene.faceGeometry.viewBox.height})`}
        >
          <g style={getBlinkStyle(props.enableBlink, props.scene.data.blinkTimings.left)}>
            {props.scene.faceGeometry.leftEyePaths.map((path) => (
              <path d={path} fill="currentColor" />
            ))}
          </g>
          <g style={getBlinkStyle(props.enableBlink, props.scene.data.blinkTimings.right)}>
            {props.scene.faceGeometry.rightEyePaths.map((path) => (
              <path d={path} fill="currentColor" />
            ))}
          </g>
        </g>

        {props.initialText && (
          <text
            dominant-baseline="middle"
            fill="currentColor"
            font-family="monospace"
            font-size={`${props.scene.initialLayout.fontSize}px`}
            font-weight="700"
            text-anchor="middle"
            x={props.scene.initialLayout.x}
            y={props.scene.initialLayout.y}
          >
            {props.initialText}
          </text>
        )}
      </g>
    </svg>
  );
}
