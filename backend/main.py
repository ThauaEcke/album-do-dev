import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PASTA_BASE = os.path.dirname(os.path.abspath(__file__))
PASTA_FRONTEND = os.path.join(os.path.dirname(PASTA_BASE), "frontend")

# Serve o Álbum do Dev na raiz: http://localhost:8000
app.mount("/", StaticFiles(directory=PASTA_FRONTEND, html=True), name="frontend")
