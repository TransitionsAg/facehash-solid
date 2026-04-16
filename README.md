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
import { Facehash, FacehashProvider } from "@transitionsag/facehash-solid";

<FacehashProvider
  value={{
    initials: 2,
    animations: { blinking: true, interactive: true, intensity: "medium" },
    colors: { background: { colors: ["#0ea5e9", "#8b5cf6"] } },
  }}
>
  <Facehash name="John Doe" />
</FacehashProvider>;
```

## Demo

Run the local preview app:

```sh
pnpm dev
```

## Defaults

Use `FacehashProvider` to set project-wide defaults for:

- `variant`
- `initials`
- `animations.intensity`
- `animations.interactive`
- `animations.blinking`
- `colors.background.classes`
- `colors.background.colors`

`Facehash` accepts component-level overrides through its `config` prop.

## Notes

- Single-word names show one initial.
- Multi-word names show two initials.
- Hover motion and blinking are enabled in the demo.
