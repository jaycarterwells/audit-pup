# Makes a fixture PDF: a correct step printout with one page left out, the way a printout looks when a page
# (for example TaxSlayer's "Preparer Notes" page) was not included.
#   python3 tests/fixtures/make_without_page.py cases/baylor/Baylor_Sec_R.pdf 29 tests/fixtures/Baylor_R_without_preparer_note.pdf
# The page number counts from 1.
import sys
from pypdf import PdfReader, PdfWriter

src, page, out = sys.argv[1], int(sys.argv[2]), sys.argv[3]
reader = PdfReader(src)
writer = PdfWriter()
for i, p in enumerate(reader.pages):
    if i != page - 1:
        writer.add_page(p)
with open(out, 'wb') as f:
    writer.write(f)
print(f'wrote {out}: {len(reader.pages) - 1} of {len(reader.pages)} pages')
