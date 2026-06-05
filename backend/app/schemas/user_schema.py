from pydantic import BaseModel, EmailStr, Field, field_validator


class UserRegister(BaseModel):
    username: str = Field(..., min_length=2, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=3, max_length=100)

    @field_validator("username")
    @classmethod
    def validate_username(cls, value):

        if not value.replace(" ", "").isalpha():
            raise ValueError(
                "Username can contain only letters"
            )

        return value


class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=3, max_length=100)