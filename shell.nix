{ pkgs ? import <nixpkgs> { overlays = [ (self: prevPkgs: {
    nodejs = prevPkgs.nodejs-18_x;
  }) ]; } }:

pkgs.mkShell {
  name = "webapp-development-environment";
  nativeBuildInputs = [
    pkgs.nodejs-18_x
    pkgs.nodePackages.firebase-tools
  ];
  shellHook = ''
    npm i
  '';
}
