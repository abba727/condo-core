from pathlib import Path
from datetime import datetime, date
import json

src = Path('/home/ubuntu/condocore_web/tracker_extracted.json')
out_dir = Path('/home/ubuntu/condocore_web/client/src/data')
out_dir.mkdir(parents=True, exist_ok=True)
out = out_dir / 'driggs712.js'
summary = Path('/home/ubuntu/condocore_web/tracker_mapping.md')

data = json.loads(src.read_text())
plan = data['project_plan']
raw_tasks = plan['tasks']

def parse_date(value):
    if not value:
        return None
    if isinstance(value, str):
        try:
            return datetime.fromisoformat(value).date()
        except ValueError:
            try:
                return datetime.strptime(value, '%m/%d/%Y').date()
            except ValueError:
                return None
    return None

def fmt_date(value):
    d = parse_date(value)
    if not d:
        return None
    return d.strftime('%b %-d, %Y')

def short_date(value):
    d = parse_date(value)
    if not d:
        return '—'
    return d.strftime('%m/%d/%y')

def pct_num(value):
    if value is None:
        return None
    try:
        n = float(value)
    except Exception:
        return None
    if n > 1:
        n = n / 100
    return max(0, min(1, n))

valid_dates = []
for task in raw_tasks:
    for key in ['start_date', 'due_date']:
        d = parse_date(task.get(key))
        if d:
            valid_dates.append(d)
min_date = min(valid_dates)
max_date = max(valid_dates)
total_days = max((max_date - min_date).days, 1)

phase_names = [
    ('Planning', 1, 17),
    ('Permits & construction readiness', 18, 23),
    ('Sitework and structure', 24, 39),
    ('Envelope and MEP', 40, 48),
    ('Interiors and closeout', 49, 68),
    ('Reserved tracker rows', 69, 999),
]

def infer_phase(row):
    for name, start, end in phase_names:
        if start <= row <= end:
            return name
    return 'Project plan'

def infer_owner(title, row):
    title_lower = (title or '').lower()
    if any(word in title_lower for word in ['architectural', 'structural', 'mep', 'plumbing', 'sprinkler', 'plans', 'sd1', 'sd2', 'dob']):
        return 'Design / filing team'
    if any(word in title_lower for word in ['financing', 'loan', 'equity', 'contract execution']):
        return 'Ownership / finance'
    if any(word in title_lower for word in ['survey', 'environmental', 'soil']):
        return 'Consultants'
    if row >= 24:
        return 'Renovation Group'
    return 'Project leadership'

def status_for(pct, has_dates, has_title):
    if not has_title:
        return ('Reserved row', 'neutral', 'reserved')
    if pct is None and not has_dates:
        return ('Unscheduled', 'neutral', 'unscheduled')
    if pct is not None and pct >= 1:
        return ('Done', 'pos', 'done')
    if pct is not None and pct > 0:
        return ('In progress', 'info', 'progress')
    return ('Open', 'neutral', 'backlog')

tasks = []
for idx, task in enumerate(raw_tasks, start=1):
    title = task.get('title') or f"Reserved tracker row {task.get('wbs') or task.get('row')}"
    start = parse_date(task.get('start_date'))
    due = parse_date(task.get('due_date'))
    has_dates = start is not None or due is not None
    pct = pct_num(task.get('pct_complete'))
    status, cls, bucket = status_for(pct, has_dates, task.get('title'))
    start_ref = start or due or min_date
    due_ref = due or start or start_ref
    left = max(0, min(100, ((start_ref - min_date).days / total_days) * 100))
    width = max(1.2, min(100 - left, (((due_ref - start_ref).days or 1) / total_days) * 100))
    marks = task.get('gantt_marks') or []
    tasks.append({
        'id': f"plan-row-{task.get('row')}",
        'sourceRow': task.get('row'),
        'wbs': task.get('wbs') or f"R{task.get('row')}",
        'name': title,
        'owner': task.get('owner') or infer_owner(title, task.get('row') or 0),
        'phase': infer_phase(task.get('row') or 0),
        'days': task.get('duration_days') if task.get('duration_days') is not None else None,
        'start': short_date(task.get('start_date')),
        'end': short_date(task.get('due_date')),
        'startISO': start.isoformat() if start else None,
        'endISO': due.isoformat() if due else None,
        'startDisplay': fmt_date(task.get('start_date')) or 'Not set',
        'endDisplay': fmt_date(task.get('due_date')) or 'Not set',
        'pctComplete': pct,
        'pctLabel': '—' if pct is None else f"{round(pct * 100)}%",
        'status': status,
        'cls': cls,
        'bucket': bucket,
        'x': round(left, 2),
        'w': round(width, 2),
        'ganttWeeks': len(marks),
        'ganttMarks': marks,
        'raw': task,
    })

week_dates = plan['week_dates']
months = []
seen = set()
for item in week_dates:
    d = parse_date(item['date'])
    if not d:
        continue
    key = (d.year, d.month)
    if key not in seen:
        seen.add(key)
        months.append({'label': d.strftime("%b '%y"), 'iso': d.isoformat()})
if not months:
    cur = min_date
    while cur <= max_date:
        key = (cur.year, cur.month)
        if key not in seen:
            seen.add(key)
            months.append({'label': cur.strftime("%b '%y"), 'iso': cur.isoformat()})
        cur = date(cur.year + (cur.month // 12), (cur.month % 12) + 1, 1)

completion_values = [t['pctComplete'] for t in tasks if t['pctComplete'] is not None and t['name']]
avg_completion = sum(completion_values) / len(completion_values) if completion_values else 0

budget_total = sum(float(r.get('Amount') or 0) for r in data.get('budget', []) if r.get('Amount') is not None)
expense_debits = sum(float(r.get('Debit') or 0) for r in data.get('expenses', []) if r.get('Debit') not in (None, ''))
expense_credits = sum(float(r.get('Credit') or 0) for r in data.get('expenses', []) if r.get('Credit') not in (None, ''))
contract_total = sum(float(r.get('Contract Total') or 0) for r in data.get('contracts', []) if r.get('Contract Total') is not None)
contract_paid = sum(float(r.get('Total Paid') or 0) for r in data.get('contracts', []) if r.get('Total Paid') is not None)

project = {
    'id': '712-driggs',
    'name': '712 Driggs',
    'full': '712 Driggs Condominium',
    'address': '712 Driggs Avenue, Brooklyn, NY',
    'phase': 'Project planning',
    'phaseClass': 'info',
    'status': 'Active',
    'statusClass': 'pos',
    'budget': round(budget_total),
    'spent': round(expense_debits),
    'units': 30,
    'floors': 4,
    'targetCompletion': fmt_date(max_date.isoformat()),
    'progress': round(avg_completion * 100),
    'initials': '7D',
    'sourceWorkbookProjectName': data['dashboard'].get('Project Name'),
    'sourceWorkbookAddress': data['dashboard'].get('Address'),
    'generalContractor': plan['meta'].get('general_contractor') or 'Renovation Group',
    'projectStartDate': fmt_date(plan['meta'].get('project_start_date')),
}

seed = {
    'project': project,
    'meta': {
        'sourceFile': data.get('source_file'),
        'workbookProjectName': data['dashboard'].get('Project Name'),
        'workbookAddress': data['dashboard'].get('Address'),
        'workbookProjectPlanTitle': plan['meta'].get('project_title'),
        'generalContractor': plan['meta'].get('general_contractor'),
        'projectStartDate': plan['meta'].get('project_start_date'),
        'scheduleStartISO': min_date.isoformat(),
        'scheduleEndISO': max_date.isoformat(),
        'scheduleStartLabel': fmt_date(min_date.isoformat()),
        'scheduleEndLabel': fmt_date(max_date.isoformat()),
    },
    'planTasks': tasks,
    'planMonths': months,
    'team': data.get('team', []),
    'budget': data.get('budget', []),
    'expenses': data.get('expenses', []),
    'contracts': data.get('contracts', []),
    'insurances': data.get('insurances', []),
    'permits': data.get('permits', []),
    'lookup': data.get('lookup', []),
    'financialSummary': {
        'budgetTotal': round(budget_total, 2),
        'expenseDebits': round(expense_debits, 2),
        'expenseCredits': round(expense_credits, 2),
        'contractTotal': round(contract_total, 2),
        'contractPaid': round(contract_paid, 2),
        'contractRemaining': round(contract_total - contract_paid, 2),
    },
}

js = """/*
 * CondoCore style reminder: Quiet Brutalist Enterprise. This data seed supports
 * ledger-like operational density while preserving the attached tracker values
 * as source-of-truth project records for 712 Driggs.
 */

export const DRIGGS_712_SEED = __DATA__;
export const DRIGGS_712_PROJECT = DRIGGS_712_SEED.project;
export const DRIGGS_712_PLAN_TASKS = DRIGGS_712_SEED.planTasks;
export const DRIGGS_712_PLAN_MONTHS = DRIGGS_712_SEED.planMonths;
export const DRIGGS_712_TEAM = DRIGGS_712_SEED.team;
export const DRIGGS_712_BUDGET = DRIGGS_712_SEED.budget;
export const DRIGGS_712_EXPENSES = DRIGGS_712_SEED.expenses;
export const DRIGGS_712_CONTRACTS = DRIGGS_712_SEED.contracts;
export const DRIGGS_712_INSURANCES = DRIGGS_712_SEED.insurances;
export const DRIGGS_712_PERMITS = DRIGGS_712_SEED.permits;
export const DRIGGS_712_LOOKUP = DRIGGS_712_SEED.lookup;
export const DRIGGS_712_FINANCIAL_SUMMARY = DRIGGS_712_SEED.financialSummary;
""".replace('__DATA__', json.dumps(seed, indent=2))
out.write_text(js, encoding='utf-8')

status_counts = {}
phase_counts = {}
for task in tasks:
    status_counts[task['status']] = status_counts.get(task['status'], 0) + 1
    phase_counts[task['phase']] = phase_counts.get(task['phase'], 0) + 1

summary.write_text(f"""# Tracker Mapping for 712 Driggs

The attached workbook is mapped into a static frontend seed named `DRIGGS_712_SEED`. The app-facing project is named **712 Driggs** per request. The workbook itself contains legacy source labels of `{project['sourceWorkbookProjectName']}` and `{project['sourceWorkbookAddress']}`; those values are preserved inside the seed metadata rather than discarded.

| Area | Source sheet | Extracted records | App usage |
|---|---:|---:|---|
| Project metadata | Dashboard / Project Plan | 1 project | Project selector, plan header, source metadata |
| Project plan | Project Plan | {len(tasks)} rows | Interactive timeline, Kanban, list, filters, KPIs |
| Weekly Gantt marks | Project Plan | {sum(len(t['ganttMarks']) for t in tasks)} marks across {len(week_dates)} weeks | Gantt density and schedule spans |
| Team | Team | {len(data.get('team', []))} contacts | Seeded team records |
| Budget | Budget | {len(data.get('budget', []))} line items | Seeded financial records |
| Expenses | Expenses | {len(data.get('expenses', []))} transactions | Seeded financial records |
| Contracts | Contracts | {len(data.get('contracts', []))} contracts | Seeded vendor/contract records |
| Insurance | Insurances & Permits | {len(data.get('insurances', []))} insurance rows | Seeded compliance records |
| Permits | Insurances & Permits | {len(data.get('permits', []))} permit rows | Seeded compliance records |
| Lookup | Lookup | {len(data.get('lookup', []))} directory rows | Seeded contact directory |

The plan status mapping is deterministic: `100%` complete becomes **Done**, partial progress becomes **In progress**, zero percent becomes **Open**, and rows without titles become **Reserved row**. Date positions are computed from the earliest and latest tracker schedule dates, covering **{seed['meta']['scheduleStartLabel']}** through **{seed['meta']['scheduleEndLabel']}**.

| Status | Count |
|---|---:|
""" + ''.join(f"| {k} | {v} |\n" for k, v in sorted(status_counts.items())) + "\n| Phase | Count |\n|---|---:|\n" + ''.join(f"| {k} | {v} |\n" for k, v in phase_counts.items()), encoding='utf-8')

print(out)
print(summary)
