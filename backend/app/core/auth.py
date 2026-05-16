"""
Supabase JWT verification for FastAPI.

Verifies the `Authorization: Bearer <token>` header against Supabase's
asymmetric signing keys (RS256 / ES256), fetched from the project's JWKS
endpoint at `${SUPABASE_URL}/auth/v1/.well-known/jwks.json`.

This is the single source of truth for user identity on the Python backend
— never trust a user_id from the request body.
"""

import os
import jwt
from jwt import PyJWKClient, PyJWKClientError
from fastapi import Header, HTTPException, status

UNIVERSITY_DOMAINS = {
    "ju.edu.jo": "University of Jordan",
    "hu.edu.jo": "Hashemite University",
}

_SUPPORTED_ALGORITHMS = ["RS256", "ES256"]

_jwks_client: PyJWKClient | None = None


def _get_jwks_client() -> PyJWKClient:
    global _jwks_client
    if _jwks_client is None:
        supabase_url = os.getenv("NEXT_PUBLIC_SUPABASE_URL", "").rstrip("/")
        if not supabase_url:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Server auth is not configured",
            )
        _jwks_client = PyJWKClient(
            f"{supabase_url}/auth/v1/.well-known/jwks.json",
            cache_keys=True,
            lifespan=300,
        )
    return _jwks_client


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
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or malformed Authorization header",
        )

    token = authorization.split(" ", 1)[1].strip()

    supabase_url = os.getenv("NEXT_PUBLIC_SUPABASE_URL", "").rstrip("/")
    issuer = f"{supabase_url}/auth/v1"

    try:
        signing_key = _get_jwks_client().get_signing_key_from_jwt(token)
        claims = jwt.decode(
            token,
            signing_key.key,
            algorithms=_SUPPORTED_ALGORITHMS,
            audience="authenticated",
            issuer=issuer,
            options={"require": ["sub", "exp", "iss"]},
        )
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except (jwt.InvalidTokenError, PyJWKClientError):
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
