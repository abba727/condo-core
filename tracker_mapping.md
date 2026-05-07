# Tracker Mapping for 712 Driggs

The attached workbook is mapped into a static frontend seed named `DRIGGS_712_SEED`. The app-facing project is named **712 Driggs** per request. The workbook itself contains legacy source labels of `219 Driggs Street` and `219 Driggs Street`; those values are preserved inside the seed metadata rather than discarded.

| Area | Source sheet | Extracted records | App usage |
|---|---:|---:|---|
| Project metadata | Dashboard / Project Plan | 1 project | Project selector, plan header, source metadata |
| Project plan | Project Plan | 72 rows | Interactive timeline, Kanban, list, filters, KPIs |
| Weekly Gantt marks | Project Plan | 567 marks across 141 weeks | Gantt density and schedule spans |
| Team | Team | 12 contacts | Seeded team records |
| Budget | Budget | 64 line items | Seeded financial records |
| Expenses | Expenses | 25 transactions | Seeded financial records |
| Contracts | Contracts | 4 contracts | Seeded vendor/contract records |
| Insurance | Insurances & Permits | 6 insurance rows | Seeded compliance records |
| Permits | Insurances & Permits | 12 permit rows | Seeded compliance records |
| Lookup | Lookup | 37 directory rows | Seeded contact directory |

The plan status mapping is deterministic: `100%` complete becomes **Done**, partial progress becomes **In progress**, zero percent becomes **Open**, and rows without titles become **Reserved row**. Date positions are computed from the earliest and latest tracker schedule dates, covering **Oct 14, 2023** through **Jan 14, 2026**.

| Status | Count |
|---|---:|
| Done | 7 |
| In progress | 7 |
| Open | 36 |
| Reserved row | 12 |
| Unscheduled | 10 |

| Phase | Count |
|---|---:|
| Planning | 9 |
| Permits & construction readiness | 6 |
| Sitework and structure | 16 |
| Envelope and MEP | 9 |
| Interiors and closeout | 20 |
| Reserved tracker rows | 12 |
