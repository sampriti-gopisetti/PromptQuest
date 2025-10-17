import os
import sys
from vercel_python_wsgi import VercelWSGI

# Ensure Backend directory is importable
CURRENT_DIR = os.path.dirname(__file__)
REPO_ROOT = os.path.dirname(CURRENT_DIR)
BACKEND_DIR = os.path.join(REPO_ROOT, "Backend")
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from app import app as flask_app  # type: ignore

# Expose Vercel handler
app = VercelWSGI(flask_app)
