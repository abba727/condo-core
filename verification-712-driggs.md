# 712 Driggs Verification Notes

The live preview loaded successfully after the server restart. The Dashboard and sidebar now identify the active project as **712 Driggs Condominium** at **712 Driggs Avenue, Brooklyn, NY**.

The Project Plan route (`#/plan`) renders the workbook-derived schedule. It shows **60 tracker rows**, **22% completion**, **36 open tasks**, and a schedule window from **Oct 14, 2023 to Jan 14, 2026**. The page preserves the workbook source label **219 Driggs Street** in the page subheading. Timeline view renders month columns and task bars; list view renders WBS, task name, phase, status selectors, percent complete, duration, dates, and owner fields.

Interactive controls verified visually include Timeline/List switching, search input, status filter, owner filter, phase filter, zoom controls, per-row status selectors, Export, and Add Task entry points.

The Financials route (`#/financials`) renders workbook-derived budget and ledger data for 712 Driggs. It shows a **$14.9M hard cost budget**, **64 budget divisions**, **$14.0M committed**, **$676K spent**, **25 expense entries**, and a **−$107K forecast variance**. The budget table includes CSI-style workbook categories and subcategories such as General Condition, Foundation Site Work, Superstructure, Carpentry, Windows and Storefront, Masonry and Stucco, Roof, Elevator, Plumbing and Sprinkler, HVAC, Electric, Site Work, Land Costs, and Soft Costs.

A zero-budget display issue was corrected during verification: workbook rows with a $0 budget now show **0% spent / 0% commit** instead of `NaN%`.

## Final Dashboard and Project Plan Verification

After the latest seed alignment, the Dashboard now identifies a single workbook-backed active project, **712 Driggs Condominium**, with the active-project KPI set to `1`, capital deployed shown from the workbook budget and ledger totals, weekly burn corrected to `$421K` from expense debits, and vendor compliance shown as `43/43` from the workbook-derived vendor/contact set. The sidebar badges continue to show `60` visible tracker plan rows and `43` vendors.

The Project Plan route renders the tracker-driven schedule with the expected title **712 Driggs · Tracker schedule**, the preserved source label **219 Driggs Street**, `60` named plan rows, `22%` completion, `36` open tasks, and the Oct 14, 2023 → Jan 14, 2026 planning window. The timeline, Kanban, list, export, add-task, search, status, owner, phase, and zoom controls are visible and wired to the seeded task dataset.
