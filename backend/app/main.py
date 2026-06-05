from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth_routes, chat_routes, journal_routes, breathing_routes, admin_routes

app = FastAPI()

# 🔥 ADD THIS (VERY IMPORTANT)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
"http://localhost:5173",
"http://localhost:5174",
"http://127.0.0.1:5173",
"http://127.0.0.1:5174",
],
  # frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all routes
app.include_router(auth_routes.router, prefix="/api/auth")
app.include_router(chat_routes.router, prefix="/api/chat")
app.include_router(journal_routes.router, prefix="/api/journal")
app.include_router(breathing_routes.router, prefix="/api/breathing")
app.include_router(admin_routes.router, prefix="/api/admin") 

@app.get("/")
def root():
    return {"message": "Mental Health API Running"}