#!/usr/bin/env python3
"""
Re-génère lib/jobs.json depuis ton fichier Excel.
Usage: python3 scripts/export_jobs.py chemin/vers/offres.xlsx
"""
import sys
import json
import os

def export(xlsx_path, output_path='lib/jobs.json'):
    try:
        import openpyxl
    except ImportError:
        print("pip install openpyxl")
        sys.exit(1)

    wb = openpyxl.load_workbook(xlsx_path, read_only=True)
    ws = wb.active
    rows = list(ws.iter_rows(values_only=True))

    jobs = []
    for i, r in enumerate(rows[1:]):
        if not r[3]:  # skip empty titre
            continue
        jobs.append({
            'id': i + 1,
            'region':      r[0] or '',
            'secteur':     r[1] or '',
            'type':        (r[2] or '').strip(),
            'titre':       r[3] or '',
            'entreprise':  r[4] or '',
            'lieu':        r[5] or '',
            'date':        str(r[7]) if r[7] else '',
            'salaire_min': int(r[8]) if r[8] else None,
            'salaire_max': int(r[9]) if r[9] else None,
            'description': (r[10] or '')[:400],
            'lien':        r[11] or r[6] or '',
        })

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(jobs, f, ensure_ascii=False, indent=2)

    print(f"✅ {len(jobs)} offres exportées → {output_path}")

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python3 scripts/export_jobs.py offres.xlsx")
        sys.exit(1)
    export(sys.argv[1])
