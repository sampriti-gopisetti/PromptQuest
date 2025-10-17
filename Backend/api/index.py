import os
import sys
from vercel_python_wsgi import VercelWSGI

# Ensure parent directory (Backend root) is on sys.path so we can import app.py
CURRENT_DIR = os.path.dirname(__file__)
PARENT_DIR = os.path.dirname(CURRENT_DIR)
if PARENT_DIR not in sys.path:
	sys.path.insert(0, PARENT_DIR)

from app import app as flask_app  # noqa: E402

# Expose a Vercel-compatible handler
app = VercelWSGI(flask_app)
