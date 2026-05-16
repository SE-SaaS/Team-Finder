"""
Supabase JWT verification for FastAPI.

Verifies the `Authorization: Bearer <token>` header against SUPABASE_JWT_SECRET
and returns the authenticated user's UUID. This is the single source of truth
for user identity on the Python backend — never trust a user_id from the
request body.
"""

import os
import jwt
from fastapi import Header, HTTPException, status

UNIVERSITY_DOMAINS = {
    "ju.edu.jo": "University of Jordan",
    "hu.edu.jo": "Hashemite University",
}


class AuthenticatedUser:
    __slots__ = ("user_id", "email", "university")

    def __init__(self, user_id: str, email: str | None, university: str | None):
        self.user_id = user_id
        self.email = email
        self.university = university


async def verify_supabase_jwt(
    authorization: str | None = Header(default=None),
) -> AuthenticatedUser:
    """FastAPI dependency — verifies a Supabase-issued JWT.

    Returns the authenticated user. Raises 401 on any failure.
    """
    secret = os.getenv("SUPABASE_JWT_SECRET")
    if not secret:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Server auth is not configured",
        )

    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or malformed Authorization header",
        )

    token = authorization.split(" ", 1)[1].strip()

    supabase_url = os.getenv("NEXT_PUBLIC_SUPABASE_URL", "").rstrip("/")
    issuer = f"{supabase_url}/auth/v1"

    try:
        claims = jwt.decode(
            token,
            secret,
            algorithms=["HS256"],
            audience="authenticated",
            issuer=issuer,
            options={"require": ["sub", "exp", "iss"]},
        )
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user_id = claims.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Token missing subject")

    email = claims.get("email") or ""
    domain = email.split("@")[-1].lower() if "@" in email else ""
    university = UNIVERSITY_DOMAINS.get(domain)
    if not university:
        raise HTTPException(status_code=403, detail="University email required")

    return AuthenticatedUser(user_id=user_id, email=email, university=university)
