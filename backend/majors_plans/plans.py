"""
Consolidated major curriculum plans for University of Jordan (JU) and Hashemite University (HU).

Available keys:
  JU  -> AI_JU, BIT_JU, CIS_JU, CS_JU, CYS_JU, DS_JU
  HU  -> BIT_HU, CIS_HU, CS_HU, CYS_HU, DSAI_HU, SWE_HU
"""

import importlib.util
import os

_SRC = os.path.dirname(os.path.abspath(__file__))


def _load(filename: str, attr: str):
    path = os.path.join(_SRC, filename)
    spec = importlib.util.spec_from_file_location(filename[:-3], path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return getattr(mod, attr)


AI_JU   = _load("AI_Plan.py",     "AI_JU")
BIT_JU  = _load("BIT_plan.py",    "BIT_JU")
CIS_JU  = _load("CIS_plan.py",    "CIS_JU")
CS_JU   = _load("CS_plan.py",     "CS_JU")
CYS_JU  = _load("CYS_plan.py",    "CYS_JU")
DS_JU   = _load("DS_plan.py",     "DS_JU")

BIT_HU  = _load("HU_BIT_plan.py", "BIT_HU")
CIS_HU  = _load("HU_CIS_plan.py", "CIS_HU")
CS_HU   = _load("HU_CS_plan.py",  "CS_HU")
CYS_HU  = _load("HU_CYS_plan.py", "CYS_HU")
DSAI_HU = _load("HU_DS_plan.py",  "DSAI_HU")
SWE_HU  = _load("SWE_plan.py",    "SWE_HU")

__all__ = [
    "AI_JU", "BIT_JU", "CIS_JU", "CS_JU", "CYS_JU", "DS_JU",
    "BIT_HU", "CIS_HU", "CS_HU", "CYS_HU", "DSAI_HU", "SWE_HU",
]
