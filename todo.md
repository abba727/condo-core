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
- [ ] Save a checkpoint and deliver the updated planner fixes.
