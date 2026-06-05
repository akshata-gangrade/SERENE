from fastapi import APIRouter

router = APIRouter()

@router.get("/pattern")
def get_pattern():
    return {
        "inhale": 4,
        "hold": 4,
        "exhale": 6
    }