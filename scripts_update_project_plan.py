from pathlib import Path

path = Path('/home/ubuntu/condocore_web/client/src/pages/CondoCore.jsx')
text = path.read_text()
start = text.index('const TASKS = [')
end = text.index('\nwindow.ProjectPlanPage = ProjectPlanPage;', start)
replacement = r'''const TASKS = DRIGGS_712_PLAN_TASKS;
const PLAN_MONTHS = DRIGGS_712_PLAN_MONTHS;

const PLAN_STATUS_META = {
  backlog: { id: "backlog", title: "Open", status: "Open", cls: "neutral" },
  progress: { id: "progress", title: "In progress", status: "In progress", cls: "info" },
  done: { id: "done", title: "Done", status: "Done", cls: "pos" },
  unscheduled: { id: "unscheduled", title: "Unscheduled / reserved", status: "Unscheduled", cls: "neutral" },
};

const PLAN_TASK_FILTER = (task) => task.name && !task.name.startsWith("Reserved tracker row");

function normalizePlanText(value) {
  return String(value || "").toLowerCase().trim();
}

function csvEscape(value) {
  const str = String(value ?? "");
  if (/[",\n]/.test(str)) return `"${str.replaceAll('"', '""')}"`;
  return str;
}

function buildPlanCsv(tasks) {
  const headers = ["WBS", "Task", "Phase", "Owner", "Status", "Percent Complete", "Days", "Start", "End", "Source Row"];
  const rows = tasks.map((task) => [
    task.wbs,
    task.name,
    task.phase,
    task.owner,
    task.status,
    task.pctLabel,
    task.days ?? "",
    task.startDisplay,
    task.endDisplay,
    task.sourceRow,
  ]);
  return [headers, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n");
}

function downloadPlanCsv(tasks) {
  const blob = new Blob([buildPlanCsv(tasks)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "712-driggs-project-plan.csv";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function ProjectPlanPage() {
  const [view, setView] = React.useState("timeline");
  const [zoom, setZoom] = React.useState("months");
  const [query, setQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [ownerFilter, setOwnerFilter] = React.useState("all");
  const [phaseFilter, setPhaseFilter] = React.useState("all");
  const [tasks, setTasks] = React.useState(() => TASKS);

  const visibleBaseTasks = React.useMemo(() => tasks.filter(PLAN_TASK_FILTER), [tasks]);
  const ownerOptions = React.useMemo(() => Array.from(new Set(visibleBaseTasks.map((task) => task.owner || "Unassigned"))).sort(), [visibleBaseTasks]);
  const statusOptions = React.useMemo(() => Array.from(new Set(visibleBaseTasks.map((task) => task.status || "Unknown"))).sort(), [visibleBaseTasks]);
  const phaseOptions = React.useMemo(() => Array.from(new Set(visibleBaseTasks.map((task) => task.phase || "Project plan"))).sort(), [visibleBaseTasks]);

  const filteredTasks = React.useMemo(() => {
    const q = normalizePlanText(query);
    return visibleBaseTasks.filter((task) => {
      const haystack = normalizePlanText([task.wbs, task.name, task.owner, task.status, task.phase, task.startDisplay, task.endDisplay].join(" "));
      const queryOk = !q || haystack.includes(q);
      const statusOk = statusFilter === "all" || task.status === statusFilter;
      const ownerOk = ownerFilter === "all" || task.owner === ownerFilter;
      const phaseOk = phaseFilter === "all" || task.phase === phaseFilter;
      return queryOk && statusOk && ownerOk && phaseOk;
    });
  }, [visibleBaseTasks, query, statusFilter, ownerFilter, phaseFilter]);

  const doneCount = visibleBaseTasks.filter((task) => task.bucket === "done").length;
  const progressCount = visibleBaseTasks.filter((task) => task.bucket === "progress").length;
  const openCount = visibleBaseTasks.filter((task) => task.bucket === "backlog").length;
  const avgCompletion = visibleBaseTasks.length
    ? Math.round(visibleBaseTasks.reduce((sum, task) => sum + (task.pctComplete || 0), 0) / visibleBaseTasks.length * 100)
    : 0;

  const updateTaskStatus = React.useCallback((taskId, bucket) => {
    const meta = PLAN_STATUS_META[bucket] || PLAN_STATUS_META.backlog;
    setTasks((current) => current.map((task) => {
      if (task.id !== taskId) return task;
      const pctComplete = bucket === "done" ? 1 : bucket === "progress" ? Math.max(task.pctComplete || 0.25, 0.25) : 0;
      return {
        ...task,
        bucket,
        status: meta.status,
        cls: meta.cls,
        pctComplete,
        pctLabel: `${Math.round(pctComplete * 100)}%`,
      };
    }));
  }, []);

  const addLocalTask = React.useCallback(() => {
    const name = window.prompt("Add a 712 Driggs plan task");
    if (!name || !name.trim()) return;
    const phase = phaseFilter !== "all" ? phaseFilter : "Project plan";
    setTasks((current) => [{
      id: `local-${Date.now()}`,
      sourceRow: "local",
      wbs: `L-${current.length + 1}`,
      name: name.trim(),
      owner: ownerFilter !== "all" ? ownerFilter : "Project leadership",
      phase,
      days: 1,
      start: "—",
      end: "—",
      startISO: null,
      endISO: null,
      startDisplay: "Not set",
      endDisplay: "Not set",
      pctComplete: 0,
      pctLabel: "0%",
      status: "Open",
      cls: "neutral",
      bucket: "backlog",
      x: 0,
      w: 2,
      ganttWeeks: 0,
      ganttMarks: [],
      raw: { source: "local client-side addition" },
    }, ...current]);
  }, [ownerFilter, phaseFilter]);

  return (
    <>
      <PageHead
        eyebrow="Project plan"
        title={`${DRIGGS_712_PROJECT.name} · Tracker schedule`}
        sub={`Seeded from the attached workbook with ${visibleBaseTasks.length} named plan rows, ${DRIGGS_712_SEED.meta.scheduleStartLabel} → ${DRIGGS_712_SEED.meta.scheduleEndLabel}. Source label preserved: ${DRIGGS_712_SEED.meta.workbookProjectName}.`}
        actions={
          <>
            <div className="seg">
              <button className={view === "timeline" ? "active" : ""} onClick={() => setView("timeline")}>Timeline</button>
              <button className={view === "kanban" ? "active" : ""} onClick={() => setView("kanban")}>Kanban</button>
              <button className={view === "list" ? "active" : ""} onClick={() => setView("list")}>List</button>
            </div>
            <button className="btn btn-secondary" onClick={() => downloadPlanCsv(filteredTasks)}><Icon name="download" size={13} /> Export</button>
            <button className="btn btn-primary" onClick={addLocalTask}><Icon name="plus" size={13} /> Add task</button>
          </>
        }
      />

      <div className="grid-kpis" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        <SmallStat label="Tracker rows" value={String(visibleBaseTasks.length)} sub={`${filteredTasks.length} visible after filters`} />
        <SmallStat label="Completion" value={`${avgCompletion}%`} sub={`${doneCount} done · ${progressCount} in progress`} cls="pos" />
        <SmallStat label="Open tasks" value={String(openCount)} sub={`${statusOptions.length} statuses · ${ownerOptions.length} owners`} cls="info" />
        <SmallStat label="Window" value="Oct '23 → Jan '26" sub={`${DRIGGS_712_SEED.meta.scheduleStartLabel} → ${DRIGGS_712_SEED.meta.scheduleEndLabel}`} />
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-head">
          <div className="row" style={{ gap: 10, flexWrap: "wrap" }}>
            <label className="topbar-search" style={{ width: 260, margin: 0 }}>
              <Icon name="search" size={13} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search plan, owner, WBS…"
                aria-label="Search project plan"
                style={{ width: "100%", border: 0, outline: 0, background: "transparent", color: "var(--text-main)", fontSize: 13 }}
              />
            </label>
            <select className="select" style={{ width: 160 }} value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter project plan by status">
              <option value="all">Status: All</option>
              {statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
            <select className="select" style={{ width: 190 }} value={ownerFilter} onChange={(event) => setOwnerFilter(event.target.value)} aria-label="Filter project plan by owner">
              <option value="all">Owner: All</option>
              {ownerOptions.map((owner) => <option key={owner} value={owner}>{owner}</option>)}
            </select>
            <select className="select" style={{ width: 220 }} value={phaseFilter} onChange={(event) => setPhaseFilter(event.target.value)} aria-label="Filter project plan by phase">
              <option value="all">Phase: All</option>
              {phaseOptions.map((phase) => <option key={phase} value={phase}>{phase}</option>)}
            </select>
          </div>
          <div className="card-actions">
            <div className="seg">
              {["months", "quarters", "years"].map((z) => (
                <button key={z} className={zoom === z ? "active" : ""} onClick={() => setZoom(z)}>
                  {z[0].toUpperCase() + z.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {view === "timeline" && <TimelineView tasks={filteredTasks} months={PLAN_MONTHS} zoom={zoom} />}
        {view === "kanban" && <KanbanView tasks={filteredTasks} onStatusChange={updateTaskStatus} />}
        {view === "list" && <PlanListView tasks={filteredTasks} onStatusChange={updateTaskStatus} />}
      </div>
    </>
  );
}

function SmallStat({ label, value, sub, cls = "neutral" }) {
  return (
    <div className="metric" style={{ padding: "12px 14px" }}>
      <div className="metric-label" style={{ fontSize: 10 }}>{label}</div>
      <div className="row" style={{ alignItems: "baseline", gap: 6, marginTop: 4 }}>
        <div className="mono" style={{ fontSize: 22, fontWeight: 600 }}>{value}</div>
        {cls !== "neutral" && <span className={`pill ${cls} no-dot`} style={{ height: 18 }}>•</span>}
      </div>
      <div className="metric-foot" style={{ marginTop: 2 }}>
        <span>{sub}</span>
      </div>
    </div>
  );
}

function getTimelinePeriods(months, zoom) {
  if (zoom === "years") {
    const seen = new Set();
    return months.filter((m) => {
      const year = m.label.slice(-2);
      if (seen.has(year)) return false;
      seen.add(year);
      return true;
    }).map((m) => ({ ...m, label: `20${m.label.slice(-2)}` }));
  }
  if (zoom === "quarters") {
    const seen = new Set();
    return months.filter((m) => {
      const d = new Date(m.iso);
      const q = `${d.getFullYear()}-Q${Math.floor(d.getMonth() / 3) + 1}`;
      if (seen.has(q)) return false;
      seen.add(q);
      return true;
    }).map((m) => {
      const d = new Date(m.iso);
      return { ...m, label: `Q${Math.floor(d.getMonth() / 3) + 1} '${String(d.getFullYear()).slice(-2)}` };
    });
  }
  return months;
}

function TimelineView({ tasks, months, zoom }) {
  const periods = getTimelinePeriods(months, zoom);
  const nowPct = 100;

  return (
    <div className="card-body-flush">
      <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", borderTop: "1px solid var(--border)" }}>
        <div style={{ borderRight: "1px solid var(--border)", background: "var(--bg-sunk)" }}>
          <div style={{ padding: "10px 14px", fontSize: 11, fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid var(--border)" }}>
            Task / WBS · Owner · Days
          </div>
          {tasks.map((task) => (
            <div key={task.id} className="row" style={{
              padding: "8px 14px",
              borderBottom: "1px solid var(--border)",
              gap: 10,
              background: "var(--bg-elev)",
              minHeight: 42,
            }}>
              <Icon name="grip" size={12} style={{ color: "var(--text-faint)" }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="row" style={{ gap: 8 }}>
                  <span className="mono faint" style={{ fontSize: 11, minWidth: 30 }}>{task.wbs}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{task.name}</span>
                </div>
                <div className="faint" style={{ fontSize: 11, marginLeft: 38 }}>
                  {task.owner} · {task.start} → {task.end} · {task.days ?? "—"}d · {task.pctLabel}
                </div>
              </div>
            </div>
          ))}
          {tasks.length === 0 && <EmptyPlanState />}
        </div>

        <div style={{ position: "relative", overflowX: "auto" }}>
          <div style={{ minWidth: zoom === "months" ? 1200 : 900 }}>
            <div style={{ display: "flex", borderBottom: "1px solid var(--border)", background: "var(--bg-sunk)" }}>
              {periods.map((m) => (
                <div key={`${zoom}-${m.label}-${m.iso}`} style={{ flex: 1, padding: "10px 8px", fontSize: 11, color: "var(--text-muted)", borderRight: "1px solid var(--border)", textAlign: "center" }}>
                  {m.label}
                </div>
              ))}
            </div>

            <div style={{ position: "relative" }}>
              <div style={{
                position: "absolute",
                left: `${nowPct}%`,
                top: 0,
                bottom: 0,
                width: 1,
                background: "var(--signal-neg)",
                zIndex: 2,
              }}>
                <div style={{ position: "absolute", top: 4, left: -48, fontSize: 10, color: "var(--signal-neg)", fontWeight: 600, letterSpacing: "0.04em" }}>SCHEDULE END</div>
              </div>

              {tasks.map((task) => (
                <div key={task.id} style={{ position: "relative", borderBottom: "1px solid var(--border)", height: 42, background: "var(--bg-elev)" }}>
                  {periods.map((_, mi) => (
                    <div key={mi} style={{ position: "absolute", left: `${(mi / periods.length) * 100}%`, top: 0, bottom: 0, width: 1, background: "var(--border)", opacity: 0.5 }} />
                  ))}

                  <div style={{
                    position: "absolute",
                    left: `${task.x}%`,
                    width: `${Math.max(task.w, 1.2)}%`,
                    top: 11,
                    height: 18,
                    borderRadius: 4,
                    background: task.cls === "pos" ? "var(--signal-pos-soft)" : task.cls === "warn" ? "var(--signal-warn-soft)" : task.cls === "info" ? "var(--signal-info-soft)" : "var(--bg-active)",
                    border: task.cls === "neutral" ? "1px dashed var(--border-strong)" : "none",
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: 8,
                    paddingRight: 8,
                    fontSize: 10,
                    fontWeight: 600,
                    color: task.cls === "pos" ? "var(--signal-pos)" : task.cls === "warn" ? "var(--signal-warn)" : task.cls === "info" ? "var(--signal-info)" : "var(--text-muted)",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }} title={`${task.name}: ${task.startDisplay} → ${task.endDisplay}`}>
                    {task.cls === "pos" && <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${Math.max(10, (task.pctComplete || 0) * 100)}%`, background: "var(--signal-pos)", opacity: 0.3, borderRadius: 4 }} />}
                    {task.w > 4 && <span style={{ position: "relative", textTransform: "uppercase", letterSpacing: "0.04em" }}>{task.status}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KanbanView({ tasks, onStatusChange }) {
  const columns = [
    { ...PLAN_STATUS_META.backlog, count: tasks.filter((task) => task.bucket === "backlog").length },
    { ...PLAN_STATUS_META.progress, count: tasks.filter((task) => task.bucket === "progress").length },
    { ...PLAN_STATUS_META.done, count: tasks.filter((task) => task.bucket === "done").length },
    { ...PLAN_STATUS_META.unscheduled, count: tasks.filter((task) => task.bucket === "unscheduled" || task.bucket === "reserved").length },
  ];
  const tasksByCol = Object.fromEntries(columns.map((column) => [column.id, tasks.filter((task) => column.id === "unscheduled" ? ["unscheduled", "reserved"].includes(task.bucket) : task.bucket === column.id)]));

  return (
    <div className="card-body" style={{ overflowX: "auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(260px, 1fr))", gap: 12 }}>
        {columns.map((col) => (
          <div key={col.id} style={{ background: "var(--bg-sunk)", borderRadius: 8, padding: 8, minHeight: 400 }}>
            <div className="row-between" style={{ padding: "4px 6px 8px" }}>
              <div className="row" style={{ gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{col.title}</span>
                <span className="faint mono" style={{ fontSize: 11 }}>{col.count}</span>
              </div>
            </div>
            <div className="stack" style={{ gap: 6 }}>
              {(tasksByCol[col.id] || []).map((task) => (
                <div key={task.id} style={{ background: "var(--bg-elev)", border: "1px solid var(--border)", borderRadius: 7, padding: 10 }}>
                  <div className="row" style={{ gap: 6, marginBottom: 4 }}>
                    <span className="mono faint" style={{ fontSize: 10 }}>{task.wbs}</span>
                    <span className={`pill ${task.cls} no-dot`} style={{ marginLeft: "auto", height: 18 }}>{task.status}</span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 6 }}>{task.name}</div>
                  <div className="row" style={{ gap: 6, fontSize: 11, color: "var(--text-muted)", flexWrap: "wrap" }}>
                    <Icon name="clock" size={11} />
                    <span>{task.days ?? "—"}d</span>
                    <span className="dot" style={{ width: 3, height: 3, marginLeft: 4 }} />
                    <span>{task.owner}</span>
                  </div>
                  <div className="row" style={{ gap: 6, marginTop: 10 }}>
                    {Object.entries(PLAN_STATUS_META).filter(([bucket]) => bucket !== "unscheduled").map(([bucket, meta]) => (
                      <button key={bucket} className="btn btn-secondary btn-sm" onClick={() => onStatusChange(task.id, bucket)} style={{ height: 24, padding: "0 8px", fontSize: 10 }}>{meta.title}</button>
                    ))}
                  </div>
                </div>
              ))}
              {(tasksByCol[col.id] || []).length === 0 && <div className="muted" style={{ padding: 16, fontSize: 12 }}>No tasks match the current filters.</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PlanListView({ tasks, onStatusChange }) {
  return (
    <div className="card-body-flush">
      <table className="table">
        <thead>
          <tr>
            <th style={{ width: 54 }}>WBS</th>
            <th>Task</th>
            <th>Phase</th>
            <th>Status</th>
            <th className="num">%</th>
            <th className="num">Days</th>
            <th>Start</th>
            <th>End</th>
            <th>Owner</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td className="mono faint">{task.wbs}</td>
              <td style={{ fontWeight: 500 }}>
                <div>{task.name}</div>
                <div className="faint" style={{ fontSize: 11 }}>Source row {task.sourceRow} · {task.ganttWeeks} Gantt weeks</div>
              </td>
              <td className="muted">{task.phase}</td>
              <td>
                <select className="select" value={task.bucket === "reserved" ? "unscheduled" : task.bucket} onChange={(event) => onStatusChange(task.id, event.target.value)} style={{ width: 132, height: 28 }}>
                  <option value="backlog">Open</option>
                  <option value="progress">In progress</option>
                  <option value="done">Done</option>
                  <option value="unscheduled">Unscheduled</option>
                </select>
              </td>
              <td className="num mono">{task.pctLabel}</td>
              <td className="num mono">{task.days ?? "—"}</td>
              <td className="muted mono" style={{ fontSize: 12 }}>{task.start}</td>
              <td className="muted mono" style={{ fontSize: 12 }}>{task.end}</td>
              <td className="muted">{task.owner}</td>
            </tr>
          ))}
          {tasks.length === 0 && (
            <tr>
              <td colSpan="9"><EmptyPlanState /></td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function EmptyPlanState() {
  return <div className="muted" style={{ padding: 24, textAlign: "center", fontSize: 13 }}>No 712 Driggs plan rows match the current search and filters.</div>;
}
'''
path.write_text(text[:start] + replacement + text[end:], encoding='utf-8')
print('updated project plan section')
