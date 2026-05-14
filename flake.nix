{
  description = "Facehash Solid - Deterministic avatar faces for SolidJS";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    deno-nixpkgs.url = "github:NixOS/nixpkgs/01fbdeef22b76df85ea168fbfe1bfd9e63681b30";
    flake-parts.url = "github:hercules-ci/flake-parts";
    git-hooks-nix.url = "github:cachix/git-hooks.nix";
    git-hooks-nix.inputs.nixpkgs.follows = "nixpkgs";
  };

  outputs = inputs @ { deno-nixpkgs, flake-parts, ... }:
    flake-parts.lib.mkFlake { inherit inputs; } {
      imports = [ inputs.git-hooks-nix.flakeModule ];

      systems = [ "x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin" ];

      perSystem = { config, pkgs, system, ... }:
        let
          deno = deno-nixpkgs.legacyPackages.${system}.deno;
          shellPackages = [
            deno
          ];
        in
        {
          pre-commit.settings = {
            hooks = {
              deno-fmt = {
                enable = true;
                entry = "${deno}/bin/deno fmt --config deno.json";
                files = "^(vite\\.config\\.ts|deno\\.json|README\\.md)$";
                types = [ "text" ];
              };

              deno-lint = {
                enable = true;
                entry = "${deno}/bin/deno lint --config deno.json";
                files = "\\.(tsx?|jsx?)$";
                types = [ "text" ];
              };
            };
          };

          devShells.default = pkgs.mkShell {
            shellHook = config.pre-commit.installationScript;
            packages = shellPackages;
          };

          devShells.ci = pkgs.mkShell {
            packages = shellPackages ++ [ pkgs.git ];
          };
        };
    };
}
