{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    flake-parts.url = "github:hercules-ci/flake-parts";
  };

  outputs = inputs:
    inputs.flake-parts.lib.mkFlake { inherit inputs; } {
      systems = [ "x86_64-linux" ];
      perSystem = { config, self', pkgs, lib, system, ... }:
        let
          runtimeDeps = with pkgs; [ nodejs_20 ];
          buildDeps = with pkgs; [ pkg-config ];
          devDeps = with pkgs; [ nixfmt-tree bun nodejs_20 nodePackages.prettier ];

          pinnedJDK = pkgs.jdk17;
          buildToolsVersion = "34.0.0";
          ndkVersion = "25.1.8937393";
          androidComposition = pkgs.androidenv.composeAndroidPackages {
            cmdLineToolsVersion = "8.0";
            toolsVersion = "26.1.1";
            platformToolsVersion = "34.0.4";
            buildToolsVersions = [ buildToolsVersion "33.0.1" ];
            includeEmulator = false;
            emulatorVersion = "30.3.4";
            platformVersions = [ "34" ];
            includeSources = false;
            includeSystemImages = false;
            systemImageTypes = [ "google_apis_playstore" ];
            abiVersions = [ "armeabi-v7a" "arm64-v8a" ];
            cmakeVersions = [ "3.10.2" "3.22.1" ];
            includeNDK = true;
            ndkVersions = [ ndkVersion ];
            useGoogleAPIs = false;
            useGoogleTVAddOns = false;
            includeExtras = [
              "extras;google;gcm"
            ];
          };
          sdk = androidComposition.androidsdk;

          mkDevShell = {}:
            pkgs.mkShell rec {
              buildInputs = runtimeDeps;
              nativeBuildInputs = buildDeps ++ devDeps ++ [
                pinnedJDK
                sdk
              ];

              JAVA_HOME = pinnedJDK;
              ANDROID_SDK_ROOT = "${androidComposition.androidsdk}/libexec/android-sdk";
              ANDROID_NDK_ROOT = "${ANDROID_SDK_ROOT}/ndk-bundle";

              GRADLE_OPTS = "-Dorg.gradle.project.android.aapt2FromMavenOverride=${ANDROID_SDK_ROOT}/build-tools/${buildToolsVersion}/aapt2";
            };
        in {
          _module.args.pkgs = import inputs.nixpkgs {
            inherit system;
            config = {
              android_sdk.accept_license = true;
              allowUnfree = true;
            };
          };

          devShells.default = mkDevShell {};
        };
    };
}