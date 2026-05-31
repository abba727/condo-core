# CondoCore 712 Driggs Project Plan Update

- [x] Inspect `/home/ubuntu/upload/ProjectTracker-712Driggs` to determine file type, workbook sheets, and available project-plan fields.
- [x] Extract all usable project plan rows, milestones, owners, statuses, dependencies, dates, notes, and phase/category information from the tracker.
- [x] Map tracker columns into the existing CondoCore task model without discarding source values.
- [x] Seed the app with a project named **712 Driggs** and align the project selector, sidebar counts, dashboard references, and plan route to that project. Financial and vendor pages now also use workbook budget, ledger, contract, insurance, permit, team, and directory records where those sheets are present.
- [x] Replace the Project Plan page’s prior mock task list with tracker-derived tasks while preserving the existing visual design system.
- [x] Make Project Plan controls functional, including view switching, status filtering, owner filtering, search, and timeline/list/Kanban behavior where supported by the available tracker fields.
- [x] Run a production build and verify the Project Plan route in the browser.
- [x] Save a checkpoint and deliver the updated web app version to the user.

# Project Plan Functional Planner Upgrade

- [x] Audit the existing Project Plan component, CSS classes, and seeded 712 Driggs task fields before replacing interactions.
- [x] Define a client-side state model for task ordering, groups, dependencies, predecessors, edit dialogs, add dialogs, drag state, and timeline zoom.
- [x] Add a proper reusable overlay/modal for adding and editing tasks, including title, group, owner, phase, status, dates, percent complete, dependencies, and predecessor fields.
- [x] Add a proper reusable overlay/modal for adding and editing groups.
- [x] Timeline view: support drag/drop task repositioning into different row order and groups.
- [x] Timeline view: support editing tasks from row/card interactions.
- [x] Timeline view: keep the timeline header sticky while scrolling.
- [x] Timeline view: group tasks visually under collapsible or clearly separated groups.
- [x] Timeline view: improve grid visibility and alignment across every task row and time column.
- [x] Timeline view: show task dependencies/predecessors and make predecessor fields editable.
- [x] Timeline view: color completed tasks distinctly when percent complete is 100%.
- [x] Timeline view: move Months/Quarters/Years zoom controls so they appear only inside the Timeline tab.
- [x] Timeline view: show a current-day vertical marker across the timeline grid.
- [x] Kanban view: support dragging cards between status columns with clear drop-zone visibility and status updates.
- [x] Kanban view: support editing tasks from cards.
- [x] List view: support adding tasks and groups.
- [x] List view: support editing tasks and group assignment.
- [x] Run production build and browser verification for Timeline, Kanban, and List interactions.
- [x] Save a final checkpoint and deliver the updated planner version.

# Project Plan Refinement Pass

- [x] Fix Timeline month/quarter/year header so the time-scale columns never scroll over or into the title/name section.
- [x] Show `% complete` on Timeline task rows and bars when a task is in progress or has any percent-complete value.
- [x] Correct the current-day marker so it is positioned on the time axis, not in the wrong row or direction.
- [x] Add collapse/expand behavior for groups on the Timeline view.
- [x] Add collapse/expand behavior for groups on the List view.
- [x] Hide Timeline row pencil/edit icons by default and reveal them only on row hover/focus.
- [x] Support drag-and-drop reordering within the same Kanban column, in addition to moving cards between columns.
- [x] Show richer details on Kanban cards, including owner, phase/group, dates, duration, percent complete, and predecessor/dependency information where available.
- [x] Run production build and browser verification for Timeline, Kanban, and List refinements.
- [x] Save a checkpoint and deliver the refined planner version.

# Collapse Control Visibility Fix

- [x] Make Timeline and List group collapse/expand icons clearly visible in group headers, including hover/focus and collapsed/expanded states.
- [x] Run production build and browser verification for the updated collapse/expand controls.
- [x] Save a checkpoint and deliver the icon visibility fix.

# Planner Marker, Dropdown, and Dependency Selector Fixes

- [x] Correct the red Today marker so it reflects the actual current date across Month, Quarter, and Year timeline scales instead of appearing at the far end.
- [x] Fix List-view status dropdown formatting so option text is vertically centered and not clipped.
- [x] Replace the predecessor/dependency native dropdown design with a cleaner task-linking selector that avoids the oversized side list.
- [x] Run production build and browser verification for Timeline, List, and task editor changes.
- [x] Save a checkpoint and deliver the updated planner fixes.

# GitHub Commit

- [x] Inspect local Git state and configured remote for `abba727/condo-core`.
- [x] Stage the intended CondoCore project files and create a commit for the completed planner refinements.
- [x] Push the commit to GitHub and verify the pushed branch/commit URL.
- [x] Report the commit details to the user.

# Project Plan Timeline and Editor Polish

- [x] Correct the red Today vertical line so it is positioned from the actual current date against the rendered timeline scale and never defaults to the far right.
- [x] Restore visible horizontal scrollbars for the timeline and keep the top timeline header from scrolling over the sticky task-name column.
- [x] Highlight the corresponding timeline row/section in light grey when hovering over a Project Plan task.
- [x] Replace the predecessor/dependency entry pattern with a themed, friendly task picker where selected tasks appear beneath the picker.
- [x] Restyle task overlay and new-task overlay date controls so calendar/date fields match the CondoCore theme instead of generic browser boxes.
- [x] Run production build and browser verification for the updated timeline, relationship picker, and date controls.
- [x] Save a checkpoint and deliver the completed Project Plan polish fixes.

# Full Database Integration

- [x] Audit all current data models across every module (budget, expenses, vendors, projects, contracts, insurances, permits, plan tasks, stacking plan, capital stack, draws, documents)
- [x] Upgrade project to web-db-user (adds MySQL, backend server, auth)
- [x] Design and run full database schema migration (17 tables: projects, budget_groups, budget_lines, expenses, vendors, vendor_bids, contracts, insurances, permits, plan_tasks, stacking_units, capital_stack_items, draw_requests, documents, document_tags, team_members, activity_feed)
- [x] Seed database with all demo data from DRIGGS_712 seed files (budget groups/lines, expenses, vendors, project metadata)
- [x] Create tRPC routers for budget (groups + lines), expenses, vendors (+ bids), and projects (+ contracts, insurances, permits, plan tasks)
- [x] Create database-backed React hooks (useBudgetDb, useExpensesDb, useVendorsDb, useProjectsDb)
- [x] Create DbBridgeProviders component that pre-loads DB data into localStorage before legacy store providers initialize
- [x] Wire App.tsx to use DbBridgeProviders so all modules load from database on startup
- [x] Write and pass 12 vitest integration tests covering database connectivity, budget groups/lines, expenses, vendors, and projects
- [x] Save checkpoint and push to GitHub

# Bug Fix: Contingency Group Total

- [x] Fix contingency group row total not reflecting contingency line items — changed base from groupBudget (which is $0 for a pure contingency group) to totalBudget, matching the line-level calculation

# Expense Modal Improvements

- [x] Add required field validation (Date, Amount, Vendor, Division/Category)
- [x] Replace flat Division/Category dropdown with grouped CSI budget picker
- [x] Group headers are non-selectable, line items are selectable with CSI prefix
- [x] Search/filter within the grouped CSI picker

# Bug Fix: Budget Committed/Spent Column Accuracy

- [x] Zero out committed for contingency lines (no vendor bids should appear there)
- [x] Fix spent column: expenses tagged to a group label show only on the group row, not duplicated across each line
- [x] Fix spent column: expenses tagged to a CSI line label show on that specific line only
- [x] Grand total spent correctly sums group-level spent once (not per-line)

# Bug Fix: Budget Changes Not Persisted to Database

- [x] Fix DbBridgeProviders to not overwrite localStorage after initial load (remove budget.groups from useEffect deps after ready)
- [x] Wire budget group rename mutations to DB (updateGroup)
- [x] Wire budget group reorder mutations to DB (reorderGroups)
- [x] Wire budget line rename/edit mutations to DB (updateLine)
- [x] Wire budget line reorder mutations to DB (reorderLines)
- [x] Wire expense add/edit/delete mutations to DB
- [x] Wire vendor add/edit/delete mutations to DB

# Full Persistence Fix: Vendors & Expenses
- [x] Fix DbBridgeProviders: stop vendors/expenses overwrite after initial load
- [x] Add VendorDbSync watcher (archive, restore, edit, add, delete → DB)
- [x] Add ExpenseDbSync watcher (add, edit, delete → DB)
- [x] Test: archive a vendor, reload, confirm still archived
- [x] Test: add/edit/delete expense, reload, confirm changes persist

# Full Persistence: Plan Tasks, Capital Stack, Draws, Compliance

- [x] Fix DbBridgeProviders: stop vendors/expenses overwrite after initial load (syncedRef guard)
- [x] Add VendorDbSync watcher (archive, restore, edit, add, delete → DB)
- [x] Add ExpenseDbSync watcher (add, edit, delete → DB)
- [x] Add PlanTaskDbSync watcher (add, edit, delete, status/pct changes → DB)
- [x] Fix pctComplete router validation to accept 0-1 float range (was incorrectly max(100))
- [x] Wire capital stack display to DB data via dataStore (CapitalTab reads from getDataStore())
- [x] Wire draws display to DB data via dataStore (DrawsTab reads from getDataStore())
- [x] Add capital stack and draws queries to DbBridgeProviders (loads on startup)
- [x] Seed capital stack items (4 items: senior debt, mezzanine, GP equity, LP equity)
- [x] Seed draw requests (8 draws: Draw 05-12 with amounts and statuses)
- [x] Write and pass 16 new vitest integration tests for plan tasks, contracts, insurances, permits, capital stack, draws
- [x] All 28 tests pass (3 test files)

# ID Reconciliation Bug Fixes for DB Sync

- [x] Fix ExpenseDbSync: pass local expense ID to server on add (client-supplied ID) so local state ID === DB ID, eliminating stale temp ID bug for edit/delete after add
- [x] Update expenses router to accept optional client-supplied ID on add
- [x] Fix VendorDbSync: add tempIdToDbIdRef map to track local temp ID → DB numeric ID after add mutation returns, so edits/deletes of newly added vendors work correctly
- [x] Fix VendorDbSync: use resolveDbId() helper that checks both numeric IDs and the temp→DB map
- [x] All 28 vitest tests still pass after ID reconciliation fixes
