# Collapse Icon Visibility Fix Verification

The collapse/expand icon issue was caused by unsupported hyphenated icon keys in the planner group header markup. The shared icon map defines `chevronRight` and `chevronDown`, while the collapse buttons were requesting `chevron-right` and `chevron-down`, which rendered no SVG path inside the button.

The fix updates the Timeline and List group headers to use the supported camelCase icon names. The collapse button styling was also strengthened with a visible 24px button frame, higher-contrast text color, explicit SVG stroke weight, and clearer hover/focus treatment.

Verification completed on May 11, 2026:

| Check | Result |
|---|---|
| Production build | Passed with the existing Vite bundle-size warning only. |
| Timeline view | Collapse buttons are visible in the left group header column, including the Planning, Permits, Sitework, Envelope, Interiors, and Reserved tracker row group headers. |
| List view | Collapse buttons are visible in the table group headers and are exposed as interactive controls with collapse labels. |
| Dev server | Restarted successfully after the fix. |
