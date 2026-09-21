#!/usr/bin/env python3
"""Build the H2CT Companion workbook PDF from the exported Google Doc text.

Input : /tmp/h2ct-companion.txt  (plain-text export of the "H2CT Companion" doc)
Output: ~/workspace/h2ct-site/public/downloads/h2ct-workbook.pdf

Design: printable workbook. Worksheet titles start on new pages; numbered
items render as ruled write-in lines (drawn with line(), not underscores);
the HAVE/WANT and IKIGAI grids render as quadrant subheads with ruled lines;
each Time on Task log page renders as a 2-column quarter-hour grid with
P/W checkboxes, a tally row, and a Date/Day/Cycle row.
"""

import os
import re
import sys
from fpdf import FPDF

SRC = "/tmp/h2ct-companion.txt"
OUT = os.path.expanduser("~/workspace/h2ct-site/public/downloads/h2ct-workbook.pdf")

FONT_DIR = "/usr/share/fonts/truetype/dejavu"

PAGE_W, PAGE_H = 215.9, 279.4  # Letter
M_L, M_R, M_T, M_B = 18, 18, 16, 16
USABLE_W = PAGE_W - M_L - M_R

GRAY = (110, 110, 110)
BLACK = (20, 20, 20)
RULE = (150, 150, 150)
ACCENT = (30, 80, 130)


class WB(FPDF):
    def footer(self):
        if self.page_no() == 1:
            return
        self.set_y(-13)
        self.set_font("sans", "", 8)
        self.set_text_color(*GRAY)
        self.cell(0, 5, "H2CT Companion — Workbook for How to Create Time", align="C")


def load_fonts(pdf: WB):
    pdf.add_font("sans", "", os.path.join(FONT_DIR, "DejaVuSans.ttf"))
    pdf.add_font("sans", "B", os.path.join(FONT_DIR, "DejaVuSans-Bold.ttf"))
    pdf.add_font("serif", "B", os.path.join(FONT_DIR, "DejaVuSerif-Bold.ttf"))
    pdf.add_font("mono", "", os.path.join(FONT_DIR, "DejaVuSansMono.ttf"))


def ruled_line(pdf: WB, x_from, x_to, y=None):
    """Draw a handwriting rule from x_from to x_to at the current (or given) baseline."""
    y = pdf.get_y() if y is None else y
    pdf.set_draw_color(*RULE)
    pdf.set_line_width(0.25)
    pdf.line(x_from, y, x_to, y)


def ensure_space(pdf: WB, h: float):
    """Start a fresh page unless h mm of writable space remain.

    Needed because several blocks mix cell() text with manually drawn rules:
    if a cell() triggers fpdf2's auto page break mid-block, a y captured
    before the break would put the rule on the wrong page.
    """
    if pdf.get_y() + h > PAGE_H - M_B:
        pdf.add_page()


def write_in_row(pdf: WB, label: str, h: float = 8.5, font_size: int = 11,
                 suffix: str | None = None, suffix_gap: float = 6.0,
                 trailing_box: bool = False):
    """A numbered/labelled row ending in a ruled write-in line, e.g. '1. ____'."""
    ensure_space(pdf, h + 4)
    pdf.set_font("sans", "", font_size)
    pdf.set_text_color(*BLACK)
    x0 = pdf.get_x()
    y = pdf.get_y()
    pdf.cell(pdf.get_string_width(label) + 2, h, label)
    x_line_start = pdf.get_x()
    x_line_end = M_L + USABLE_W
    if suffix:
        sw = pdf.get_string_width(suffix)
        box_w = 6.5 if trailing_box else 0.0
        x_line_end -= sw + box_w + suffix_gap
    ruled_line(pdf, x_line_start, x_line_end, y + h - 2.2)
    if suffix:
        pdf.set_x(x_line_end + suffix_gap)
        pdf.cell(sw + 1, h, suffix)
        if trailing_box:
            bx, by = pdf.get_x() + 1, y + (h - 3.4) / 2
            pdf.set_draw_color(*RULE)
            pdf.set_line_width(0.3)
            pdf.rect(bx, by, 3.4, 3.4)
    pdf.ln(h)


def inline_field(pdf: WB, label: str, h: float = 8.5, font_size: int = 11):
    """'Label: ____' on one line with the rule filling the rest of the line."""
    ensure_space(pdf, h + 4)
    pdf.set_font("sans", "", font_size)
    pdf.set_text_color(*BLACK)
    y = pdf.get_y()
    pdf.cell(pdf.get_string_width(label) + 3, h, label)
    ruled_line(pdf, pdf.get_x(), M_L + USABLE_W, y + h - 2.2)
    pdf.ln(h)


def checkbox(pdf: WB, size: float = 3.4):
    x, y = pdf.get_x(), pdf.get_y()
    cy = y + 2.2
    pdf.set_draw_color(*RULE)
    pdf.set_line_width(0.3)
    pdf.rect(x, cy - size / 2, size, size)
    pdf.set_x(x + size + 1.5)


def section_title(pdf: WB, title: str, subtitle: str | None = None):
    pdf.add_page()
    pdf.set_font("sans", "B", 21)
    pdf.set_text_color(*ACCENT)
    pdf.cell(0, 12, title, new_x="LMARGIN", new_y="NEXT")
    if subtitle:
        pdf.set_font("sans", "", 11)
        pdf.set_text_color(*GRAY)
        pdf.cell(0, 7, subtitle, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(4)


def quad_head(pdf: WB, text: str):
    ensure_space(pdf, 20)
    pdf.ln(3)
    pdf.set_font("sans", "B", 12.5)
    pdf.set_text_color(*BLACK)
    pdf.cell(0, 7, text, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(1)


def instr(pdf: WB, text: str):
    pdf.set_font("sans", "", 10.5)
    pdf.set_text_color(70, 70, 70)
    pdf.multi_cell(0, 5.6, text)
    pdf.ln(1.5)


def bullet(pdf: WB, text: str):
    pdf.set_font("sans", "", 10.5)
    pdf.set_text_color(*BLACK)
    x0 = pdf.get_x()
    pdf.set_x(x0 + 4)
    pdf.cell(5, 5.6, "\u2022")
    pdf.multi_cell(USABLE_W - 13, 5.6, text)
    pdf.ln(1)


def name_date(pdf: WB):
    ensure_space(pdf, 26)
    pdf.ln(4)
    y = pdf.get_y()
    pdf.set_font("sans", "", 11)
    pdf.set_text_color(*BLACK)
    pdf.cell(pdf.get_string_width("Name ") + 2, 8, "Name ")
    mid = M_L + USABLE_W * 0.55
    ruled_line(pdf, pdf.get_x(), mid, y + 8 - 2.2)
    pdf.set_x(mid + 8)
    pdf.cell(pdf.get_string_width("Date ") + 2, 8, "Date ")
    ruled_line(pdf, pdf.get_x(), M_L + USABLE_W, y + 8 - 2.2)
    pdf.ln(10)


def body_text(pdf: WB, text: str, size: int = 11):
    pdf.set_font("sans", "", size)
    pdf.set_text_color(*BLACK)
    pdf.multi_cell(0, 6, text)
    pdf.ln(1.5)


# ---------------------------------------------------------------- parsing ---

NUM_RE = re.compile(r"^(\d+)\.\s*(.*)$")
TASK_RE = re.compile(r"^(\d+)\.\s*Task\s*(.*?)\s*Done\s*□?\s*$")
TIME_RE = re.compile(r"^\+(\d\d):(\d\d)\s*P\s*\|\s*W\s*\|\s*_{1,}\s*$")

# The HAVE/WANT worksheet is a 2x2 grid; the export flattens the axis headers
# (HAVE / DON'T HAVE / WANT / DON'T WANT) and each cell's descriptive line
# heads its 7 write-in items. Map cell text -> combined quadrant title.
QUAD_MAP = {
    "Have and want. Keep these.": "HAVE · WANT",
    "Don’t have and want. Point B.": "DON’T HAVE · WANT",
    "Have and don’t want.": "HAVE · DON’T WANT",
    "Don’t have and don’t want.": "DON’T HAVE · DON’T WANT",
}
AXIS_HEADERS = {"HAVE", "DON’T HAVE", "WANT", "DON’T WANT"}


def parse(path: str):
    raw = open(path, encoding="utf-8-sig").read()
    lines = [l.rstrip("\r") for l in raw.split("\n")]
    return lines


def classify(lines):
    """Yield (kind, payload) ops for the pre-log worksheets (up to first Time on Task)."""
    ops = []
    i, n = 0, len(lines)
    while i < n:
        s = lines[i].strip()
        i += 1
        if not s:
            continue
        if s == "Time on Task":
            ops.append(("log_start", None))
            break
        if s in ("HAVE / WANT",):
            ops.append(("ws_title", (s, None)))
            continue
        if s == "IKIGAI":
            ops.append(("ws_title", (s, None)))
            continue
        if s == "Goal / Milestones / Tasks":
            ops.append(("ws_title", (s, None)))
            continue
        if s.startswith("How to Create Time"):
            ops.append(("ws_sub", s))
            continue
        if s.startswith("Say it:"):
            ops.append(("ws_sub", s))
            continue
        if s.startswith("*"):
            ops.append(("bullet", s[1:].strip()))
            continue
        m = TASK_RE.match(s)
        if m:
            ops.append(("task", m.group(1)))
            continue
        m = NUM_RE.match(s)
        if m and set(m.group(2).strip()) <= {"_", " ", ""} and m.group(2).strip():
            ops.append(("num_write", m.group(1) + "."))
            continue
        if s.startswith("Name") and "Date" in s and "_" in s:
            ops.append(("name_date", None))
            continue
        if s.startswith("Goal (one sentence"):
            ops.append(("goal_label", s))
            continue
        if re.fullmatch(r"_+", s):
            ops.append(("full_rule", 2))
            continue
        if s.startswith("Difficult because:") or s.startswith("Still possible because:"):
            ops.append(("inline_field", s.split(":")[0] + ": "))
            continue
        if s in QUAD_MAP:
            ops.append(("quad_head", QUAD_MAP[s]))
            ops.append(("instr", s))
            continue
        if s in AXIS_HEADERS:
            continue  # 2x2 grid axis header, flattened by the export
        if s in ("Milestones", "Tasks"):
            ops.append(("quad_head", s))
            continue
        if s in ("What you love", "What you are good at",
                 "What the world needs", "What you can be paid for"):
            ops.append(("quad_head", s))
            continue
        # short descriptive lines -> instruction text
        if len(s) <= 90 and "_" not in s:
            ops.append(("instr", s))
            continue
        ops.append(("body", s))
    return ops, i  # i = index where log sections begin


def parse_log_sections(lines, start_idx):
    """Return list of sections; each is a list of (HH, MM) slots in doc order."""
    sections = []
    cur = []  # start_idx sits just after the first "Time on Task" title line
    sections.append(cur)
    for ln in lines[start_idx:]:
        s = ln.strip()
        if s == "Time on Task":
            cur = []
            sections.append(cur)
            continue
        m = TIME_RE.match(s)
        if m and cur is not None:
            cur.append((m.group(1), m.group(2)))
    return sections


# ---------------------------------------------------------------- rendering -

def render_title_page(pdf: WB):
    pdf.add_page()
    pdf.ln(38)
    pdf.set_font("serif", "B", 40)
    pdf.set_text_color(*ACCENT)
    pdf.cell(0, 18, "H2CT Companion", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(4)
    pdf.set_font("sans", "", 16)
    pdf.set_text_color(60, 60, 60)
    pdf.cell(0, 10, "Workbook for How to Create Time", align="C",
             new_x="LMARGIN", new_y="NEXT")
    pdf.ln(10)
    pdf.set_draw_color(*ACCENT)
    pdf.set_line_width(0.6)
    cx = PAGE_W / 2
    pdf.line(cx - 25, pdf.get_y(), cx + 25, pdf.get_y())
    pdf.ln(10)
    pdf.set_font("sans", "", 11)
    pdf.set_text_color(80, 80, 80)
    for item in [
        "Have / Want grid  ·  Ikigai  ·  Goal / Milestones / Tasks",
        "Daily Time on Task logs",
        "",
        "Print the log pages. Work the system.",
        "One goal. One rabbit. Everything else waits.",
    ]:
        pdf.cell(0, 7, item, align="C", new_x="LMARGIN", new_y="NEXT")


def render_ops(pdf: WB, ops):
    pending_title = None
    for kind, payload in ops:
        if kind == "ws_title":
            pending_title = payload
            continue
        if kind == "ws_sub" and pending_title:
            section_title(pdf, pending_title[0], payload)
            pending_title = None
            continue
        if pending_title:  # title with no subtitle
            section_title(pdf, pending_title[0], None)
            pending_title = None
        if kind == "ws_sub":
            instr(pdf, payload)
        elif kind == "quad_head":
            quad_head(pdf, payload)
        elif kind == "instr":
            instr(pdf, payload)
        elif kind == "body":
            body_text(pdf, payload)
        elif kind == "bullet":
            bullet(pdf, payload)
        elif kind == "num_write":
            write_in_row(pdf, payload)
        elif kind == "task":
            write_in_row(pdf, f"{payload}.  Task", suffix="Done", trailing_box=True)
        elif kind == "goal_label":
            pdf.set_font("sans", "", 11)
            pdf.set_text_color(*BLACK)
            pdf.multi_cell(0, 6, payload)
            pdf.ln(1)
            y = pdf.get_y()
            ruled_line(pdf, M_L, M_L + USABLE_W, y + 6)
            pdf.ln(1)
            y = pdf.get_y()
            ruled_line(pdf, M_L, M_L + USABLE_W, y + 6)
            pdf.ln(10)
        elif kind == "full_rule":
            y = pdf.get_y()
            ruled_line(pdf, M_L, M_L + USABLE_W, y + 6)
            pdf.ln(10)
        elif kind == "inline_field":
            inline_field(pdf, payload)
        elif kind == "name_date":
            name_date(pdf)
    if pending_title:
        section_title(pdf, pending_title[0], None)


LOG_LEGEND = ("S Self · Fam Family · Fr Friends · C Career · Fa Faith · "
              "G Goal · SO shiny · D distract · O obstacle · X excuse")


def render_log_page(pdf: WB, slots, page_no: int, total: int):
    pdf.add_page()
    ensure_space(pdf, 40)
    pdf.set_font("sans", "B", 18)
    pdf.set_text_color(*ACCENT)
    title = "Time on Task"
    pdf.cell(0, 10, title, new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("sans", "", 8.5)
    pdf.set_text_color(80, 80, 80)
    pdf.multi_cell(0, 4.6, LOG_LEGEND)
    pdf.ln(2)

    # The plain-text export flattened the doc's 2-column table row by row:
    # slot order is (+00:00, +08:00), (+00:15, +08:15), ... -> de-interleave.
    left, right = slots[0::2], slots[1::2]
    gutter = 10
    col_w = (USABLE_W - gutter) / 2
    top = pdf.get_y()
    rows = max(len(left), len(right))
    row_h = 6.0

    def draw_col(x0, col_slots):
        y = top
        for hh, mm in col_slots:
            pdf.set_xy(x0, y)
            pdf.set_font("mono", "", 9.5)
            pdf.set_text_color(*BLACK)
            pdf.cell(15, row_h, f"+{hh}:{mm}")
            pdf.set_font("sans", "", 8)
            pdf.set_text_color(90, 90, 90)
            pdf.cell(4, row_h, "P")
            checkbox(pdf, 3.2)
            pdf.set_xy(pdf.get_x(), y)  # NB: set_y() alone resets x to margin
            pdf.cell(4, row_h, "W")
            checkbox(pdf, 3.2)
            ruled_line(pdf, pdf.get_x() + 1, x0 + col_w, y + row_h - 1.6)
            y += row_h

    draw_col(M_L, left)
    draw_col(M_L + col_w + gutter, right)
    pdf.set_y(top + rows * row_h + 4)

    # Tally row
    pdf.set_font("sans", "", 10)
    pdf.set_text_color(*BLACK)
    y = pdf.get_y()
    parts = [("Tally —  P minutes ", 26), ("W minutes ", 26),
             ("G blocks ", 18), ("D/SO/O/X count ", 26)]
    x = M_L
    pdf.set_xy(x, y)
    for label, w in parts:
        pdf.cell(pdf.get_string_width(label) + 1, 7, label)
        ruled_line(pdf, pdf.get_x(), pdf.get_x() + w, y + 7 - 2)
        pdf.set_x(pdf.get_x() + w + 6)
    pdf.ln(11)

    # Date / Day / Cycle row
    y = pdf.get_y()
    pdf.set_xy(M_L, y)
    for label, w in [("Date ", 42), ("Day ", 42), ("Cycle # ", 22)]:
        pdf.cell(pdf.get_string_width(label) + 1, 7, label)
        ruled_line(pdf, pdf.get_x(), pdf.get_x() + w, y + 7 - 2)
        pdf.set_x(pdf.get_x() + w + 10)
    pdf.ln(7)
    pdf.set_font("sans", "", 8)
    pdf.set_text_color(*GRAY)
    pdf.cell(0, 5, f"Log {page_no} of {total}", align="R")


def main():
    lines = parse(SRC)
    ops, log_start = classify(lines)
    sections = parse_log_sections(lines, log_start)
    print(f"ops={len(ops)} log_sections={len(sections)} "
          f"slots={[len(s) for s in sections[:3]]}...", flush=True)

    pdf = WB(orientation="P", unit="mm", format="Letter")
    pdf.set_auto_page_break(True, margin=M_B)
    pdf.set_margins(M_L, M_T, M_R)
    load_fonts(pdf)

    render_title_page(pdf)
    render_ops(pdf, ops)
    for idx, slots in enumerate(sections, 1):
        render_log_page(pdf, slots, idx, len(sections))

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    pdf.output(OUT)
    size = os.path.getsize(OUT)
    print(f"WROTE {OUT} pages={pdf.page_no()} size={size} bytes")


if __name__ == "__main__":
    main()
