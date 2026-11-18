#!/usr/bin/env python3
"""
Preloaded Offline APK Generator for Personal Hub.
Packages your latest live SQLite database (birthdays, tasks, notes, etc.)
directly into assets/preloaded_data/personal_hub_preloaded.sqlite,
then builds a signed release APK ready to share.
"""

import os
import sys
import shutil
import subprocess

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
ASSETS_DIR = os.path.join(ROOT_DIR, "assets", "preloaded_data")
TARGET_PRELOADED_DB = os.path.join(ASSETS_DIR, "personal_hub_preloaded.sqlite")

def main():
    print("=" * 60)
    print(" Personal Hub - Preloaded Offline APK Generator")
    print("=" * 60)

    # 1. Check for snapshot file argument or prompt
    snapshot_path = None
    if len(sys.argv) > 1:
        snapshot_path = sys.argv[1]
    else:
        # Check if a snapshot exists in root or downloads
        candidates = [
            os.path.join(ROOT_DIR, "personal_hub_snapshot.sqlite"),
            os.path.join(ROOT_DIR, "personal_hub_preloaded.sqlite"),
        ]
        for c in candidates:
            if os.path.exists(c):
                snapshot_path = c
                break

    if not snapshot_path or not os.path.exists(snapshot_path):
        print(f"\n[INFO] No snapshot path provided.")
        print(f"Usage: python scripts/build_with_latest_data.py <path_to_exported_snapshot.sqlite>")
        print(f"If you already exported a snapshot from the phone, pass its path as argument.\n")
        sys.exit(1)

    print(f"\n[1/4] Found snapshot database: {snapshot_path}")

    # Verify SQLite header
    with open(snapshot_path, "rb") as f:
        header = f.read(16)
        if not header.startswith(b"SQLite format 3"):
            print("[ERROR] File is not a valid SQLite database! Aborting.")
            sys.exit(1)

    size_kb = os.path.getsize(snapshot_path) / 1024
    print(f"      Valid SQLite database verified ({size_kb:.1f} KB).")

    # 2. Embed into assets/preloaded_data/
    os.makedirs(ASSETS_DIR, exist_ok=True)
    shutil.copy2(snapshot_path, TARGET_PRELOADED_DB)
    print(f"[2/4] Embedded into APK assets: {TARGET_PRELOADED_DB}")

    # 3. Build Release APK with Flutter
    print(f"[3/4] Building signed Release APK with embedded data...")
    res = subprocess.run(["flutter", "build", "apk", "--release", "--no-tree-shake-icons"], cwd=ROOT_DIR)
    if res.returncode != 0:
        print("[ERROR] Flutter build failed! Check logs above.")
        sys.exit(res.returncode)

    # 4. Copy output APK
    built_apk = os.path.join(ROOT_DIR, "build", "app", "outputs", "flutter-apk", "app-release.apk")
    dist_apk = os.path.join(ROOT_DIR, "personal_hub_with_latest_data.apk")
    if os.path.exists(built_apk):
        shutil.copy2(built_apk, dist_apk)
        final_size_mb = os.path.getsize(dist_apk) / (1024 * 1024)
        print(f"\n[4/4] SUCCESS! Preloaded APK generated:")
        print(f"      Location: {dist_apk}")
        print(f"      Size: {final_size_mb:.1f} MB")
        print("\nWhen any recipient installs this APK, it will immediately initialize")
        print("with all your birthdays, tasks, and data without needing any internet connection!")
    else:
        print(f"[WARNING] Build finished but could not locate {built_apk}")

if __name__ == "__main__":
    main()

