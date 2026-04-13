from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel
from typing import Any, Dict, List, Optional
import os

app = FastAPI(title="Sentinel Orchestrator Stub")
API_KEY = os.getenv("ORCHESTRATOR_KEY", "replace_with_shared_orchestrator_token")


class PatchRequest(BaseModel):
    mode: str
    repoOwner: str
    repoName: str
    headBranch: str
    workflowPath: str
    workflowContent: str
    failedJobs: List[Dict[str, Any]]
    logTails: Dict[str, str]


class PatchResponse(BaseModel):
    patchedContent: Optional[str] = None
    reason: str


@app.get("/health")
def health() -> Dict[str, str]:
    return {"status": "ok"}


@app.post("/sentinel/repair", response_model=PatchResponse)
def repair(
    request: PatchRequest,
    authorization: Optional[str] = Header(default=None),
) -> PatchResponse:
    expected = f"Bearer {API_KEY}"
    if authorization != expected:
        raise HTTPException(status_code=401, detail="Invalid orchestrator token")

    workflow = request.workflowContent

    # Minimal example: if the workflow does not have a checkout step, insert one
    # into the first job's step list. This keeps the stub deterministic and easy
    # to replace with a real policy/orchestration engine later.
    if "uses: actions/checkout@" not in workflow:
        lines = workflow.splitlines()
        patched_lines = []
        inserted = False
        for index, line in enumerate(lines):
            patched_lines.append(line)
            if not inserted and line.strip() == "steps:":
                indent = line[: len(line) - len(line.lstrip())]
                patched_lines.append(f"{indent}- uses: actions/checkout@v4")
                inserted = True
        if inserted:
            return PatchResponse(
                patchedContent="\n".join(patched_lines) + "\n",
                reason="Inserted actions/checkout step",
            )

    return PatchResponse(patchedContent=None, reason="No deterministic fix available")
