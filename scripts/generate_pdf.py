"""
Generate styled PDFs from Team-Finder markdown documentation.
Usage: py -3.11 scripts/generate_pdf.py
Output: docs/pdf/BLUEPRINT.pdf, docs/pdf/DOCUMENTATION.pdf
"""

import os
import re
from pathlib import Path
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib.colors import HexColor, black, white
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, PageBreak, Preformatted
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# ── Colour palette ──────────────────────────────────────────────────────────
BRAND_DARK   = HexColor("#0f172a")   # slate-900
BRAND_MID    = HexColor("#1e3a5f")   # deep navy
ACCENT       = HexColor("#3b82f6")   # blue-500
ACCENT_LIGHT = HexColor("#eff6ff")   # blue-50
CODE_BG      = HexColor("#1e293b")   # slate-800
CODE_FG      = HexColor("#e2e8f0")   # slate-200
TABLE_HEADER = HexColor("#1e3a5f")
TABLE_ALT    = HexColor("#f1f5f9")   # slate-100
MUTED        = HexColor("#64748b")   # slate-500
HR_COLOR     = HexColor("#cbd5e1")   # slate-300

PAGE_W, PAGE_H = A4
MARGIN = 2 * cm

# ── Style definitions ────────────────────────────────────────────────────────
def build_styles():
    base = getSampleStyleSheet()

    styles = {
        "h1": ParagraphStyle("h1",
            fontSize=26, leading=32, textColor=BRAND_DARK,
            spaceAfter=6, spaceBefore=18, fontName="Helvetica-Bold"),
        "h2": ParagraphStyle("h2",
            fontSize=18, leading=24, textColor=BRAND_MID,
            spaceAfter=4, spaceBefore=16, fontName="Helvetica-Bold",
            borderPad=4),
        "h3": ParagraphStyle("h3",
            fontSize=13, leading=18, textColor=BRAND_MID,
            spaceAfter=3, spaceBefore=12, fontName="Helvetica-Bold"),
        "h4": ParagraphStyle("h4",
            fontSize=11, leading=16, textColor=BRAND_MID,
            spaceAfter=2, spaceBefore=8, fontName="Helvetica-Bold"),
        "body": ParagraphStyle("body",
            fontSize=10, leading=16, textColor=HexColor("#1e293b"),
            spaceAfter=4, spaceBefore=2, fontName="Helvetica",
            alignment=TA_JUSTIFY),
        "bullet": ParagraphStyle("bullet",
            fontSize=10, leading=15, textColor=HexColor("#1e293b"),
            spaceAfter=2, spaceBefore=1, fontName="Helvetica",
            leftIndent=16, bulletIndent=4),
        "code": ParagraphStyle("code",
            fontSize=8.5, leading=13, textColor=CODE_FG,
            fontName="Courier", backColor=CODE_BG,
            leftIndent=8, rightIndent=8, spaceBefore=6, spaceAfter=6,
            borderPad=6),
        "caption": ParagraphStyle("caption",
            fontSize=8, leading=12, textColor=MUTED,
            fontName="Helvetica-Oblique", spaceAfter=6),
        "cover_title": ParagraphStyle("cover_title",
            fontSize=36, leading=44, textColor=white,
            fontName="Helvetica-Bold", alignment=TA_CENTER),
        "cover_sub": ParagraphStyle("cover_sub",
            fontSize=14, leading=20, textColor=HexColor("#bfdbfe"),
            fontName="Helvetica", alignment=TA_CENTER),
        "cover_meta": ParagraphStyle("cover_meta",
            fontSize=10, leading=14, textColor=HexColor("#93c5fd"),
            fontName="Helvetica", alignment=TA_CENTER),
    }
    return styles


# ── Header / Footer ──────────────────────────────────────────────────────────
def make_page_template(title):
    def on_page(canvas, doc):
        canvas.saveState()
        w, h = A4
        # Header bar
        canvas.setFillColor(BRAND_DARK)
        canvas.rect(0, h - 1.2*cm, w, 1.2*cm, fill=1, stroke=0)
        canvas.setFont("Helvetica-Bold", 9)
        canvas.setFillColor(white)
        canvas.drawString(MARGIN, h - 0.8*cm, title)
        canvas.setFont("Helvetica", 9)
        canvas.drawRightString(w - MARGIN, h - 0.8*cm, "Team-Finder Platform")
        # Footer bar
        canvas.setFillColor(HexColor("#f1f5f9"))
        canvas.rect(0, 0, w, 1*cm, fill=1, stroke=0)
        canvas.setFillColor(MUTED)
        canvas.setFont("Helvetica", 8)
        canvas.drawCentredString(w / 2, 0.35*cm, f"Page {doc.page}")
        canvas.drawString(MARGIN, 0.35*cm, "© 2026 Team-Finder — University of Jordan & Hashemite University")
        canvas.restoreState()
    return on_page


# ── Cover page ───────────────────────────────────────────────────────────────
def cover_page(title, subtitle, date, styles):
    elements = []
    # Full-bleed background simulation via a tall coloured table
    cover_table = Table(
        [[""]],
        colWidths=[PAGE_W - 2*MARGIN],
        rowHeights=[PAGE_H - 4*MARGIN]
    )
    cover_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), BRAND_DARK),
        ("ROUNDEDCORNERS", [8]),
    ]))

    elements.append(Spacer(1, 3*cm))
    elements.append(Paragraph("TEAM-FINDER", styles["cover_title"]))
    elements.append(Spacer(1, 0.5*cm))
    elements.append(Paragraph(title, ParagraphStyle("ct2",
        fontSize=22, leading=28, textColor=ACCENT,
        fontName="Helvetica-Bold", alignment=TA_CENTER)))
    elements.append(Spacer(1, 0.8*cm))
    elements.append(HRFlowable(width="60%", thickness=1, color=ACCENT,
                               hAlign="CENTER"))
    elements.append(Spacer(1, 0.8*cm))
    elements.append(Paragraph(subtitle, styles["cover_sub"]))
    elements.append(Spacer(1, 1.5*cm))
    elements.append(Paragraph(f"Generated: {date}", styles["cover_meta"]))
    elements.append(Paragraph("University of Jordan &amp; Hashemite University", styles["cover_meta"]))
    elements.append(PageBreak())
    return elements


# ── Markdown parser ──────────────────────────────────────────────────────────
def escape(text):
    """Escape XML special chars for ReportLab Paragraphs."""
    return text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def md_inline(text):
    """Convert inline markdown (bold, italic, code) to ReportLab XML."""
    text = escape(text)
    # Bold+italic
    text = re.sub(r'\*\*\*(.+?)\*\*\*', r'<b><i>\1</i></b>', text)
    # Bold
    text = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', text)
    # Italic
    text = re.sub(r'\*(.+?)\*', r'<i>\1</i>', text)
    # Inline code
    text = re.sub(r'`([^`]+)`',
        r'<font name="Courier" color="#0369a1" backColor="#eff6ff"> \1 </font>', text)
    # Strip markdown links [text](url) → text
    text = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'<u>\1</u>', text)
    return text


def parse_markdown(md_text, styles):
    """Convert a markdown string into a list of ReportLab flowables."""
    elements = []
    lines = md_text.split("\n")
    i = 0

    while i < len(lines):
        line = lines[i]

        # Skip YAML-ish separators
        if line.strip() in ("---", "==="):
            elements.append(HRFlowable(width="100%", thickness=0.5,
                                       color=HR_COLOR, spaceAfter=6))
            i += 1
            continue

        # Headings
        if line.startswith("#### "):
            elements.append(Paragraph(md_inline(line[5:]), styles["h4"]))
            i += 1; continue
        if line.startswith("### "):
            elements.append(Paragraph(md_inline(line[4:]), styles["h3"]))
            i += 1; continue
        if line.startswith("## "):
            elements.append(Spacer(1, 0.2*cm))
            elements.append(Paragraph(md_inline(line[3:]), styles["h2"]))
            elements.append(HRFlowable(width="100%", thickness=1,
                                       color=ACCENT, spaceAfter=4))
            i += 1; continue
        if line.startswith("# "):
            elements.append(Paragraph(md_inline(line[2:]), styles["h1"]))
            i += 1; continue

        # Fenced code block
        if line.strip().startswith("```"):
            code_lines = []
            i += 1
            while i < len(lines) and not lines[i].strip().startswith("```"):
                code_lines.append(lines[i])
                i += 1
            i += 1  # closing ```
            code_text = "\n".join(code_lines)
            elements.append(Preformatted(code_text, styles["code"]))
            continue

        # Markdown table
        if "|" in line and i + 1 < len(lines) and re.match(r"[\|\s\-:]+$", lines[i+1]):
            table_lines = []
            while i < len(lines) and "|" in lines[i]:
                table_lines.append(lines[i])
                i += 1
            # Skip separator row
            rows = [r for r in table_lines if not re.match(r"^[\|\s\-:]+$", r)]
            data = []
            for row in rows:
                cells = [md_inline(c.strip()) for c in row.strip().strip("|").split("|")]
                data.append(cells)
            if data:
                col_count = len(data[0])
                col_w = (PAGE_W - 2*MARGIN - 0.4*cm) / col_count
                t = Table(data, colWidths=[col_w] * col_count, repeatRows=1)
                ts = TableStyle([
                    ("BACKGROUND", (0, 0), (-1, 0), TABLE_HEADER),
                    ("TEXTCOLOR", (0, 0), (-1, 0), white),
                    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                    ("FONTSIZE", (0, 0), (-1, -1), 9),
                    ("LEADING", (0, 0), (-1, -1), 13),
                    ("ROWBACKGROUNDS", (0, 1), (-1, -1), [white, TABLE_ALT]),
                    ("GRID", (0, 0), (-1, -1), 0.4, HR_COLOR),
                    ("VALIGN", (0, 0), (-1, -1), "TOP"),
                    ("LEFTPADDING", (0, 0), (-1, -1), 6),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                    ("TOPPADDING", (0, 0), (-1, -1), 4),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
                ])
                t.setStyle(ts)
                elements.append(Spacer(1, 0.2*cm))
                elements.append(t)
                elements.append(Spacer(1, 0.2*cm))
            continue

        # Bullet list
        if re.match(r"^(\s*[-*+]|\s*\d+\.)\s+", line):
            text = re.sub(r"^(\s*[-*+]|\s*\d+\.)\s+", "", line)
            indent = len(line) - len(line.lstrip())
            bstyle = ParagraphStyle("bul",
                parent=styles["bullet"],
                leftIndent=16 + indent * 4,
                bulletIndent=4 + indent * 4)
            elements.append(Paragraph("• " + md_inline(text), bstyle))
            i += 1; continue

        # Blockquote
        if line.startswith("> "):
            bq = ParagraphStyle("bq",
                fontSize=10, leading=15, textColor=MUTED,
                fontName="Helvetica-Oblique",
                leftIndent=16, borderPad=4,
                spaceAfter=4)
            elements.append(Paragraph(md_inline(line[2:]), bq))
            i += 1; continue

        # Blank line
        if not line.strip():
            elements.append(Spacer(1, 0.15*cm))
            i += 1; continue

        # Regular paragraph
        elements.append(Paragraph(md_inline(line), styles["body"]))
        i += 1

    return elements


# ── Build a single PDF ───────────────────────────────────────────────────────
def build_pdf(md_path: Path, out_path: Path, doc_title: str, doc_subtitle: str):
    out_path.parent.mkdir(parents=True, exist_ok=True)
    styles = build_styles()

    doc = SimpleDocTemplate(
        str(out_path),
        pagesize=A4,
        leftMargin=MARGIN, rightMargin=MARGIN,
        topMargin=1.6*cm, bottomMargin=1.4*cm,
        title=doc_title,
        author="Team-Finder",
    )

    md_text = md_path.read_text(encoding="utf-8")
    # Strip the top-level H1 (we put it on the cover)
    md_text = re.sub(r"^#\s+.+\n", "", md_text, count=1)

    elements = []
    elements += cover_page(doc_title, doc_subtitle, "2026-04-15", styles)
    elements += parse_markdown(md_text, styles)

    doc.build(
        elements,
        onFirstPage=make_page_template(doc_title),
        onLaterPages=make_page_template(doc_title),
    )
    print(f"  Created: {out_path}")


# ── Entry point ──────────────────────────────────────────────────────────────
if __name__ == "__main__":
    root = Path(__file__).parent.parent
    docs = root / "docs"
    out  = docs / "pdf"

    files = [
        (
            docs / "BLUEPRINT.md",
            out / "BLUEPRINT.pdf",
            "System Blueprint",
            "Full architecture reference — stack, flows, schema, security",
        ),
        (
            docs / "README.md",
            out / "DOCUMENTATION.pdf",
            "Documentation Index",
            "Overview, quick start, API reference, and contributing guide",
        ),
    ]

    print("Generating PDFs...")
    for md, pdf, title, sub in files:
        build_pdf(md, pdf, title, sub)

    print(f"\nDone. Files saved to {out}")
