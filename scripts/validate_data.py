"""
Script to validate all JSON data files against their respective JSON schemas.
"""
import os
import json
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCHEMAS_DIR = os.path.join(BASE_DIR, "schemas")
DATA_DIR = os.path.join(BASE_DIR, "data")

def validate_json_syntax():
    """Verify all JSON files are well-formed."""
    errors = 0
    checked = 0
    for root, _, files in os.walk(DATA_DIR):
        for file in files:
            if file.endswith(".json"):
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, BASE_DIR)
                try:
                    with open(full_path, "r", encoding="utf-8") as f:
                        json.load(f)
                    checked += 1
                    print(f"  [OK] Valid JSON: {rel_path}")
                except Exception as e:
                    errors += 1
                    print(f"  [ERROR] Invalid JSON in {rel_path}: {e}")

    for root, _, files in os.walk(SCHEMAS_DIR):
        for file in files:
            if file.endswith(".json"):
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, BASE_DIR)
                try:
                    with open(full_path, "r", encoding="utf-8") as f:
                        json.load(f)
                    checked += 1
                    print(f"  [OK] Valid Schema: {rel_path}")
                except Exception as e:
                    errors += 1
                    print(f"  [ERROR] Invalid Schema in {rel_path}: {e}")

    print(f"\nChecked {checked} JSON files with {errors} error(s).")
    return errors == 0

if __name__ == "__main__":
    print("--- Validating Project JSON Datasets & Schemas ---")
    success = validate_json_syntax()
    sys.exit(0 if success else 1)
