{
  description = "Facehash Solid - Deterministic avatar faces for SolidJS";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-parts.url = "github:hercules-ci/flake-parts";
    git-hooks-nix.url = "github:cachix/git-hooks.nix";
    git-hooks-nix.inputs.nixpkgs.follows = "nixpkgs";
  };

  outputs = inputs @ {flake-parts, ...}:
    flake-parts.lib.mkFlake {inherit inputs;} {
      imports = [inputs.git-hooks-nix.flakeModule];

      systems = [
        "x86_64-linux"
        "aarch64-darwin"
      ];

      perSystem = {
        config,
        pkgs,
        ...
      }: let
        nodePkg = pkgs.nodejs_22;
        pnpmPkg = pkgs.pnpm_10;
      in {
        pre-commit.settings = {
          hooks = {
            oxfmt = {
              enable = true;
              entry = "${pkgs.oxfmt}/bin/oxfmt";
              files = "\\.(tsx?|jsx?)$";
              types = ["text"];
            };

            oxlint = {
              enable = true;
              entry = "${pkgs.oxlint}/bin/oxlint";
              files = "\\.(tsx?|jsx?)$";
              types = ["text"];
            };
          };
        };

        devShells.default = pkgs.mkShell {
          shellHook = config.pre-commit.installationScript;
          packages = [nodePkg pnpmPkg];
        };

        checks.pre-commit = config.pre-commit.run;
      };
    };
}
