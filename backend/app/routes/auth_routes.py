from fastapi import APIRouter, HTTPException, Depends
from app.schemas.user_schema import UserRegister, UserLogin
from app.services.auth_service import register_user, login_user
from app.middleware.auth_middleware import get_current_user



router = APIRouter(tags=["Auth"])


@router.get("/me")
async def me(user=Depends(get_current_user)):
    return user


@router.post("/register")
async def register(user: UserRegister):
    """
    Register a new user
    """
    result = await register_user(user)

    if not result:
        raise HTTPException(status_code=400, detail="User already exists")

    return {"message": "User registered successfully"}


@router.post("/login")
async def login(user: UserLogin):
    """
    Login user and return JWT token
    """
    token = await login_user(user)

    if not token:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return {"access_token": token}