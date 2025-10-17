from vercel_python_wsgi import VercelWSGI
from app import app as flask_app  # local app.py in this folder

app = VercelWSGI(flask_app)
