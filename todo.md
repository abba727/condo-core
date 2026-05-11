# CondoCore 712 Driggs Project Plan Update

- [x] Inspect `/home/ubuntu/upload/ProjectTracker-712Driggs` to determine file type, workbook sheets, and available project-plan fields.
- [x] Extract all usable project plan rows, milestones, owners, statuses, dependencies, dates, notes, and phase/category information from the tracker.
- [x] Map tracker columns into the existing CondoCore task model without discarding source values.
- [x] Seed the app with a project named **712 Driggs** and align the project selector, sidebar counts, dashboard references, and plan route to that project. Financial and vendor pages now also use workbook budget, ledger, contract, insurance, permit, team, and directory records where those sheets are present.
- [x] Replace the Project Plan page’s prior mock task list with tracker-derived tasks while preserving the existing visual design system.
- [x] Make Project Plan controls functional, including view switching, status filtering, owner filtering, search, and timeline/list/Kanban behavior where supported by the available tracker fields.
- [ ] Run a production build and verify the Project Plan route in the browser.
- [ ] Save a checkpoint and deliver the updated web app version to the user.

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
- [ ] Run production build and browser verification for Timeline, Kanban, and List interactions.
- [ ] Save a final checkpoint and deliver the updated planner version.
