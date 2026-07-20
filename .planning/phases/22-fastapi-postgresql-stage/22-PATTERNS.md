# Phase 22: FastAPI PostgreSQL Stage - Pattern Map
**Mapped:** 2026-07-15
**Files classified:** 17
**Analog scope:** Stage 1 Tasks API, Sealos.io shell scripts, and Vocabloom
## File Classification
| New/Modified File | Role | Data Flow | Closest Analog | Match |
|---|---|---|---|---|
| `app/database.py` | service/provider | request-response, CRUD | Vocabloom `db/session.py` | role-match |
| `app/models.py` | model | CRUD | Vocabloom `db/base.py`, `db/models.py` | exact |
| `app/main.py` | controller/factory | request-response, CRUD | Stage 1 `app/main.py` | exact contract |
| `alembic.ini` | config | migration batch | Vocabloom `alembic.ini` | exact |
| `migrations/env.py` | migration config | migration batch | Vocabloom `alembic/env.py` | exact |
| `migrations/versions/0001_create_tasks.py` | migration | reversible DDL | Vocabloom `0001_initial.py` | exact |
| `tests/conftest.py` | test infrastructure | database lifecycle | Vocabloom `tests/conftest.py` | role-match |
| `tests/test_api.py` | behavior test | public HTTP CRUD | Stage 1 `tests/test_api.py` | exact contract |
| `tests/test_migrations.py` | integration test | migration batch | Vocabloom `tests/conftest.py` | partial |
| `tests/test_health.py` | behavior test | public readiness HTTP | Stage 1 `tests/test_api.py` | role-match |
| `scripts/test-postgres.sh` | test harness | Kubernetes lifecycle | Sealos.io `scripts/url-index-audit.sh` | shell-only |
| `deploy/migration-job.yaml` | deployment config | one-shot batch | Phase 22 research contract | research-owned |
| `deploy/source-migration-job.yaml` | validation adapter | one-shot batch | Phase 22 research contract | research-owned |
| `pyproject.toml` | dependency config | deterministic resolution | Stage 1 `pyproject.toml` | exact |
| `uv.lock`, `requirements.txt` | generated config | dependency transform | Stage 1 lock/export | exact |
| `README.md` | documentation | reader workflow | Stage 1 `README.md` | exact |
## Pattern Assignments
### `app/database.py` (service/provider, request-response)
**Analog:** `/Users/longnv/bin/repo/Vocabloom/services/api/src/vocabloom/db/session.py:1-17`
```python
from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

engine = create_engine(database_url, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```
Copy the short-lived Session pattern. Stage 22 passes `database_url` into a
factory owned by `create_app()` and exposes an engine disposal path. Add a
schema probe that opens a connection and checks the `tasks` table. Convert any
configuration, connection, or schema error into the stable readiness result;
retain the internal exception in application logs.
### `app/models.py` (model, CRUD)
**Analogs:** Vocabloom `db/base.py:1-5`, `db/models.py:4-16`
```python
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

class Base(DeclarativeBase):
    pass

class TaskRecord(Base):
    __tablename__ = "tasks"
    id: Mapped[int] = mapped_column(primary_key=True)
```
Follow Vocabloom's typed SQLAlchemy 2 declarative style. Complete the model with
`String(200), nullable=False` and `Boolean, nullable=False`, using Python and
server defaults of false. Keep Pydantic request/response types in `app/main.py`.
### `app/main.py` (controller/factory, public HTTP CRUD)
**Analog:** `/Users/longnv/bin/repo/sealos-fastapi-tutorial/app/main.py:7-67`
```python
class TaskCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    completed: bool = False

@application.post("/tasks", response_model=Task, status_code=201)
def create_task(payload: TaskCreate) -> Task:
    ...

@application.delete("/tasks/{task_id}", status_code=204)
def delete_task(task_id: int) -> Response:
    ...
    return Response(status_code=204)
```
Preserve every route decorator, response model, status code, validation bound,
and `{"detail":"Task not found"}` error contract. Replace the factory-local
dictionary with one injected Session per request. Each write commits, refreshes
when needed, and returns the same Pydantic shape. `/health` returns 200 only
after a real connection and migrated-table probe succeeds; all unready states
return `503 {"detail":"Database is not ready"}`.
### Alembic configuration and first revision (migration, batch)
**Analogs:** Vocabloom `alembic/env.py:1-50`, `alembic/versions/0001_initial.py:8-20,128-137`
```python
from alembic import context
from sqlalchemy import engine_from_config, pool
from app.models import Base

config = context.config
config.set_main_option("sqlalchemy.url", database_url)
target_metadata = Base.metadata

connectable = engine_from_config(
    configuration,
    prefix="sqlalchemy.",
    poolclass=pool.NullPool,
)
```
```python
revision: str = "0001"
down_revision: str | None = None

def upgrade() -> None:
    op.create_table(...)

def downgrade() -> None:
    op.drop_table("tasks")
```
Use Vocabloom's online configuration, `Base.metadata`, `NullPool`, immutable
revision identifiers, and explicit reversible DDL. Read `DATABASE_URL` at
migration execution. `alembic.ini` keeps script location and logging only; the
runtime URL comes from the environment. Alembic remains the exclusive schema
owner across application and test code.
### `tests/conftest.py` and migration tests (test infrastructure)
**Analog:** Vocabloom `tests/conftest.py:48-89`
```python
@pytest.fixture(scope="session")
def migrated_engine(test_database_url: str) -> Generator[Engine, None, None]:
    alembic_config = Config(str(project_root / "alembic.ini"))
    alembic_config.set_main_option("sqlalchemy.url", test_database_url)
    command.upgrade(alembic_config, "head")
    engine = create_engine(test_database_url, pool_pre_ping=True)
    try:
        yield engine
    finally:
        engine.dispose()
```
Require `TEST_DATABASE_URL` with an actionable collection/setup failure. Run
fresh and repeat upgrades through Alembic's public command surface. Stage 22
uses `TRUNCATE TABLE tasks RESTART IDENTITY` before and after each behavior test
so later `create_app(TEST_DATABASE_URL)` instances observe committed records.
The Vocabloom transaction rollback fixture is a useful lifecycle analog; the
Stage 22 persistence seam uses committed transactions plus explicit truncation.
### `tests/test_api.py` and `tests/test_health.py` (public behavior)
**Analog:** `/Users/longnv/bin/repo/sealos-fastapi-tutorial/tests/test_api.py:7-105`
```python
@pytest.fixture
def client() -> TestClient:
    return TestClient(create_app(test_database_url))

def test_create_task(client: TestClient) -> None:
    response = client.post("/tasks", json={"title": "Write tutorial"})
    assert response.status_code == 201
```
Retain the 12 inherited public cases and add cross-instance create/read,
persisted list/update/delete, explicit PUT validation, and four readiness
states. Assertions use HTTP responses. The fixtures supply real PostgreSQL and
real FastAPI collaborators. Close every TestClient and dispose each factory's
engine deterministically.
### `scripts/test-postgres.sh` (Kubernetes integration harness)
**Shell analog:** Sealos.io `scripts/url-index-audit.sh:1-5,49-57,105-115`
```bash
#!/usr/bin/env bash
set -euo pipefail

tmp="$(mktemp)"
# bounded external calls and explicit ownership
rm -f "${tmp}"
```
Extend this strict-shell baseline with a run ID, exact
`tutorial.sealos.io/run-id` label, generated alphanumeric credential, bounded
rollout/`pg_isready`/TCP waits, recorded port-forward PID, and an EXIT trap. The
trap deletes only `job,deploy,svc,secret,configmap` selected by that run label,
waits for dependent Pods, and asserts an empty labeled inventory. Evidence logs
contain redacted URLs and never print Secret payloads.
### Migration Job manifests (deployment config, one-shot batch)
The searched Stage 1, Sealos.io, Vocabloom, and Hermes scopes contain no close
Kubernetes migration Job analog. Apply the verified Phase 22 research contract:
`batch/v1`, `restartPolicy: Never`, `backoffLimit: 1`,
`activeDeadlineSeconds: 300`, `/app`, `alembic upgrade head`, and Secret key
`url`. `deploy/migration-job.yaml` uses the Stage 2 application image reference.
`deploy/source-migration-job.yaml` mounts run-scoped source/config through a
ConfigMap and proves two delete/recreate completions before Phase 23 publishes
the application image.
### Dependency files and `README.md` (config/documentation)
**Analogs:** Stage 1 `pyproject.toml:1-20`, `README.md:7-49,117-126`
Keep exact direct pins, Python `>=3.12,<3.13`, dev dependencies in the uv group,
pytest configuration, locked sync, and runtime-only export. Add SQLAlchemy
2.0.51, Alembic 1.18.5, and `psycopg[binary]` 3.3.4 after registry verification.
The README follows prerequisite -> immutable clone -> locked install -> migrate
-> test -> run -> HTTP verification -> lifecycle, with migration completion
placed before readiness and scaling guidance.
## Shared Patterns and Decision Coverage
| Decision | Pattern carried into implementation |
|---|---|
| D-01 | Run-labeled PostgreSQL 17 Deployment/Service/Secret, port-forward PID, bounded waits, owned cleanup. |
| D-02 | Explicit URL -> engine/session factory -> one synchronous Session per request -> SQLAlchemy 2 model. |
| D-03 | Alembic metadata and immutable revision own all DDL; fresh and repeat upgrades prove ownership. |
| D-04 | Connection plus `tasks` schema probe gates the stable 200/503 health contract. |
| D-05 | Stage 1 HTTP surface stays stable; a later factory reads committed data from the first. |
| D-06 | Tracked production Job plus source adapter; strict server validation and two completion runs. |
| D-07 | Exact uv lock/export, unchanged Stage 1 tag, annotated protected Stage 2 tag, clean-clone replay. |
| D-08 | Redacted evidence, exact labeled inventory, port-forward shutdown, zero temporary footprint. |
## Implementation Traps
- A module-global engine would bind configuration before `create_app()` receives
  `TEST_DATABASE_URL`; build the database runtime from the explicit factory URL.
- A rollback-only fixture would hide process-restart persistence; commit through
  HTTP and reset state with PostgreSQL `TRUNCATE ... RESTART IDENTITY`.
- Application `create_all()` would split schema ownership; scan application and
  tests for that symbol as a phase gate.
- Reapplying a completed Job preserves its completed object; delete and recreate
  each run before waiting for `condition=complete`.
- Broad Kubernetes selectors expand cleanup scope; every created object and
  every delete/read command carries the exact generated run label.
## Phase Exclusions
Phase 23 owns non-root container hardening, image publication, replicas, rollout
logs, and rollback. Phase 25 owns the shared FastAPI/Django live acceptance
seam. Phase 27 owns tutorial prose, Sealos Skills output, and screenshots.
## Metadata
**Strong analog groups:** 5
**Research-owned groups:** 2
**Search stopped after:** Stage 1, Sealos.io scripts, Vocabloom database stack,
and a targeted Hermes Job/harness scan
