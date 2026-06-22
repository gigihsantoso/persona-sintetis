# 🤖 Multi-Agent Orchestration Skill

## Overview

Skill ini mengatur komunikasi dan koordinasi antar agents dalam sistem multi-agent Persona Sintetis.

---

## Architecture

### Orchestrator Pattern

```
┌─────────────────────────────────────────────────────────────┐
│                    Orchestrator (PM)                        │
│  - Receive user request                                     │
│  - Decompose into subtasks                                  │
│  - Delegate to workers via delegate_task                    │
│  - Collect results from shared/                             │
│  - Synthesize final output                                  │
└─────────────────────────────────────────────────────────────┘
              ↓              ↓              ↓
     ┌────────────┐  ┌────────────┐  ┌────────────┐
     │ Architect  │  │ Frontend   │  │ Backend    │
     │ (design)   │  │ (code)     │  │ (API)      │
     └──────┬─────┘  └──────┬─────┘  └──────┬─────┘
            │               │               │
            └───────────────┼───────────────┘
                            ↓
              ┌─────────────────────────┐
              │  shared/ directory      │
              │  - prd.md               │
              │  - architecture.md      │
              │  - progress.md          │
              │  - decisions.md         │
              └─────────────────────────┘
```

---

## Shared Directory Structure

```
C:\Users\gigih\Documents\persona-sintetis\shared\
├── prd.md               # Product requirements (PM owns)
├── architecture.md      # System design (Architect owns)
├── progress.md          # All agents update
├── decisions.md         # Key decisions log (PM owns)
├── frontend-plan.md     # Frontend plan (Frontend owns)
├── backend-plan.md      # Backend plan (Backend owns)
├── design-mockups.md    # UI designs (Designer owns)
├── test-plan.md         # QA plan (QA owns)
└── deploy-plan.md       # Deploy plan (DevOps owns)
```

---

## Agent Communication Protocol

### 1. Read Context (All Agents)

Sebelum mulai kerja, setiap agent WAJIB baca:

```markdown
1. shared/prd.md - Pahami requirements
2. shared/architecture.md - Pahami technical constraints
3. shared/progress.md - Cek status agents lain
```

### 2. Write Output (Each Agent)

Setelah selesai, agent WAJIB tulis:

```markdown
1. shared/<agent>-output.md - Hasil kerja
2. shared/progress.md - Update status
3. shared/decisions.md - Kalau ada key decision
```

### 3. Dependency Check

| Agent | Depends On | Blocks |
|-------|------------|--------|
| Architect | PRD approval | Frontend, Backend |
| Frontend | Architecture approval | - |
| Backend | Architecture approval | - |
| Designer | PRD approval | Frontend |
| QA | Code exists | - |
| DevOps | Code ready | - |

---

## Delegation Workflow

### PM: Decompose Task

```python
# Contoh: PM delegate task ke workers
tasks = [
    {
        "goal": "Design system architecture",
        "context": "Read shared/prd.md, create shared/architecture.md",
        "toolsets": ["terminal", "file", "web"],
        "agent": "architect"
    },
    {
        "goal": "Create Angular scaffolding",
        "context": "Read shared/prd.md + architecture.md",
        "toolsets": ["terminal", "file", "coding"],
        "agent": "frontend"
    },
    {
        "goal": "Setup Supabase schema",
        "context": "Read shared/architecture.md",
        "toolsets": ["terminal", "file", "web"],
        "agent": "backend"
    }
]

# Run parallel (max 3 concurrent)
delegate_task(tasks=tasks)
```

### Workers: Execute Task

Setiap worker:
1. Read context dari `shared/`
2. Execute task
3. Write hasil ke `shared/<agent>-output.md`
4. Update `shared/progress.md`

### PM: Collect & Synthesize

```python
# PM collect results
results = []
for agent in ['architect', 'frontend', 'backend']:
    result = read_file(f'shared/{agent}-output.md')
    results.append(result)

# Synthesize
final_output = synthesize(results)
write_file('shared/final-output.md', final_output)
```

---

## Parallel Execution Guidelines

### Max Concurrent Agents

| Profile | Max Concurrent |
|---------|----------------|
| default | 3 (via delegate_task) |
| pm | 3 (orchestrator) |
| Others | 1 (worker only) |

### Avoid Conflicts

1. **File Locking:**
   - Each agent owns their file
   - No editing other agent's files
   - Use `decisions.md` untuk cross-agent decisions

2. **Task Overlap:**
   - PM decompose dengan clear boundaries
   - No duplicate work
   - Check `progress.md` sebelum mulai

3. **Resource Contention:**
   - Stagger heavy API calls
   - Use exponential backoff
   - Monitor rate limits

---

## Progress Tracking

### Update Format

```markdown
## 2026-06-22 10:30 - Architect Update

**Status:** 🟡 In Progress

**Current Task:** System architecture design

**Completed:**
- ✅ Data model design
- ✅ API endpoint design

**Next:**
- 🔄 Component architecture
- ⏳ Security considerations

**Blockers:**
- None

**ETA:** 2 hours
```

### Status Indicators

| Icon | Meaning |
|------|---------|
| 🟢 | Done |
| 🟡 | In Progress |
| 🔴 | Blocked |
| ⏳ | Pending |
| ❌ | Cancelled |

---

## Conflict Resolution

### Escalation Path

1. **Agent Disagreement** → Discuss via `decisions.md`
2. **No Resolution** → PM make final call
3. **PM Conflict** → Escalate to human

### Decision Log Format

```markdown
## Decision #1: Consistency Score Algorithm

**Date:** 2026-06-22
**Proposed By:** Architect
**Discussed With:** Backend, QA

**Options:**
1. CLIP embeddings (recommended by Architect)
2. FaceNet (recommended by Backend)
3. Custom model (recommended by QA)

**Decision:** Option 1 (CLIP)
**Rationale:** Faster inference, good enough accuracy for MVP
**PM Approval:** ✅

**Implementation:** Backend to implement CLIP-based scoring
```

---

## Gateway Communication (Optional)

### Telegram Channels

Jika gateways running di ports berbeda:

| Agent | Port | Channel |
|-------|------|---------|
| PM | 4301 | @persona_pm |
| Architect | 4302 | @persona_architect |
| Frontend | 4303 | @persona_frontend |
| Backend | 4304 | @persona_backend |
| Designer | 4305 | @persona_designer |
| QA | 4306 | @persona_qa |
| DevOps | 4307 | @persona_devops |

### Cross-Agent Messaging

```bash
# PM broadcast ke semua
@persona_all "Starting sprint - check shared/progress.md"

# Direct message
@persona_architect "Please review frontend-plan.md"
```

---

## Example: Full Workflow

### User Request
```
"Bangun MVP Persona Sintetis"
```

### PM Decomposition
```
1. Architect → System design (shared/architecture.md)
2. Frontend → Angular scaffolding (src/)
3. Backend → Supabase setup (SQL migrations)
4. Designer → UI mockups (shared/design-mockups.md)
5. QA → Test plan (shared/test-plan.md)
6. DevOps → Deploy pipeline (shared/deploy-plan.md)
```

### Parallel Execution
```
T+0:   PM delegate to all workers
T+10m: Architect finish → write architecture.md
T+15m: Designer finish → write design-mockups.md
T+30m: Frontend start (wait for architecture)
T+30m: Backend start (wait for architecture)
T+60m: Frontend finish → write frontend-output.md
T+60m: Backend finish → write backend-output.md
T+90m: QA start → write test-plan.md
T+90m: DevOps start → write deploy-plan.md
T+120m: PM collect all → synthesize final output
```

### Final Output
```
✅ MVP Setup Complete!

All agents finished:
- Architect: ✅ architecture.md
- Frontend: ✅ Angular scaffolding
- Backend: ✅ Supabase schema
- Designer: ✅ UI mockups
- QA: ✅ Test plan
- DevOps: ✅ Deploy pipeline

Next: Human review → Start implementation
```

---

## Tools & Commands

### Read Context
```bash
# Read all context
cat shared/prd.md
cat shared/architecture.md
cat shared/progress.md
```

### Write Output
```bash
# Write your output
echo "## My Output" > shared/my-output.md

# Update progress
echo "## Update - Done" >> shared/progress.md
```

### Check Status
```bash
# List all files
ls -la shared/

# Check who's working
grep "In Progress" shared/progress.md
```

---

## Best Practices

### Do's ✅
- Read context before starting
- Write output immediately after finish
- Update progress.md dengan ETA
- Log key decisions di decisions.md
- Check dependencies sebelum mulai
- Use clear status indicators

### Don'ts ❌
- Jangan edit file agent lain
- Jangan mulai tanpa baca context
- Jangan skip progress update
- Jangan duplicate work
- Jangan ignore blockers
- Jangan commit tanpa review (jika ada)

---

**Version:** 1.0
**Last Updated:** 2026-06-22
**Owner:** PM (GLM-5.2)
