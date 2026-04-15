# @transitionsag/facehash-solid

SolidJS port of [facehash](https://github.com/cossistantcom/cossistant/tree/main/packages/facehash).

Credit for the original idea, design, and core implementation goes to the
[cossistantcom/cossistant](https://github.com/cossistantcom/cossistant) project.
This package is a SolidJS port.

## Install

```sh
pnpm add @transitionsag/facehash-solid
```

## Usage

```tsx
import { Facehash } from "@transitionsag/facehash-solid";

<Facehash name="John Doe" />;
```

## Demo

Run the local preview app:

```sh
pnpm dev
```

## Props

- `name`: seed string
- `size`: number or CSS size
- `variant`: `"gradient"` or `"solid"`
- `intensity3d`: `"none" | "subtle" | "medium" | "dramatic"`
- `interactive`: hover motion toggle
- `showInitial`: show the name initials
- `colors`: custom color palette
- `colorClasses`: class-based palette
- `gradientOverlayClass`: optional overlay class
- `onRenderMouth`: custom center content
- `enableBlink`: blinking eyes

## Notes

- Single-word names show one initial.
- Multi-word names show two initials.
- Hover motion and blinking are enabled in the demo.
