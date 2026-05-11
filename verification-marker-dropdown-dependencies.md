# Planner Marker, Dropdown, and Dependency Selector Verification

## Today marker

After the visible-period date-position patch and dev-server restart, Year view renders four year cells: 2024, 2025, 2026, and 2027. Browser geometry measured the Today line at `left=1118`, while the 2026 year cell spans `left=1051` to `right=1241`. This confirms the red Today line is positioned inside the 2026 column rather than pinned to the far-right boundary.

## List dropdown formatting

The List view was opened after the CSS update. The row-level status selects now render as taller, line-height-aligned controls, and the visible statuses such as `Open` and `Done` are no longer vertically clipped in the table rows.

## Predecessor/dependency selector

Opening the task editor from the List view now shows a compact selection panel with checkbox-style task cards for predecessors instead of the previous long native dropdown. Each task option includes WBS/name context and percent-complete metadata, and the header shows selected-count feedback. This verifies the redesigned relationship-selection pattern is visible and usable in the modal.

