import { render } from "solid-js/web";
import { createSignal } from "solid-js";
import { Facehash } from "./facehash.js";
import { FacehashProvider } from "./facehash-context.js";

function App() {
  const [name, setName] = createSignal("cossistant");

  return (
    <main
      style={{
        "min-height": "100vh",
        display: "grid",
        "place-items": "center",
        padding: "32px",
      }}
    >
      <section
        style={{
          width: "min(720px, 100%)",
          display: "grid",
          gap: "24px",
          "justify-items": "center",
        }}
      >
        <div style={{ "text-align": "center" }}>
          <div
            style={{
              "font-size": "14px",
              "letter-spacing": "0.18em",
              "text-transform": "uppercase",
              color: "#94a3b8",
            }}
          >
            Facehash Solid
          </div>
          <h1
            style={{
              margin: "8px 0 0",
              "font-size": "clamp(2.4rem, 7vw, 5rem)",
              "line-height": 1.05,
            }}
          >
            Deterministic face preview
          </h1>
          <p
            style={{
              margin: "12px 0 0",
              color: "#94a3b8",
              "font-size": "14px",
            }}
          >
            Hover the face for motion. Blink is enabled below.
          </p>
        </div>

        <FacehashProvider
          value={{
            initials: true,
            animations: {
              blinking: true,
              interactive: true,
              intensity: "dramatic",
            },
            colors: {
              background: {
                colors: ["#0ea5e9", "#8b5cf6", "#ec4899", "#f59e0b", "#22c55e"],
              },
            },
          }}
        >
          <Facehash
            name={name()}
            className="rounded"
            style={{
              width: "256px",
              height: "256px",
              "border-radius": "32px",
            }}
          />
        </FacehashProvider>

        <div style={{ "font-size": "13px", color: "#94a3b8" }}>
          Live seed: <span style={{ color: "#e5e7eb" }}>{name()}</span>
        </div>

        <label style={{ display: "grid", gap: "10px", width: "min(420px, 100%)" }}>
          <span style={{ color: "#94a3b8", "font-size": "14px" }}>Seed name</span>
          <input
            value={name()}
            onInput={(event) => setName(event.currentTarget.value)}
            placeholder="Type any string"
            style={{
              width: "100%",
              "box-sizing": "border-box",
              "border-radius": "16px",
              border: "1px solid rgba(148, 163, 184, 0.22)",
              background: "rgba(15, 23, 42, 0.72)",
              color: "#e5e7eb",
              padding: "14px 16px",
              "font-size": "16px",
              outline: "none",
            }}
          />
        </label>
      </section>
    </main>
  );
}

render(() => <App />, document.getElementById("app")!);
