from pathlib import Path

path = Path('/home/ubuntu/condocore_web/client/src/pages/CondoCore.jsx')
text = path.read_text()
start = text.index('const TASKS = DRIGGS_712_PLAN_TASKS;')
end = text.index('window.ProjectPlanPage = ProjectPlanPage;') + len('window.ProjectPlanPage = ProjectPlanPage;')
replacement = r'''const TASKS = DRIGGS_712_PLAN_TASKS;
const PLAN_MONTHS = DRIGGS_712_PLAN_MONTHS;

const PLAN_STATUS_META = {
  backlog: { id: "backlog", title: "Open", status: "Open", cls: "neutral" },
  progress: { id: "progress", title: "In progress", status: "In progress", cls: "info" },
  done: { id: "done", title: "Done", status: "Done", cls: "pos" },
  unscheduled: { id: "unscheduled", title: "Unscheduled / reserved", status: "Unscheduled", cls: "neutral" },
};

const PLAN_BUCKET_BY_STATUS = {
  open: "backlog",
  backlog: "backlog",
  "in progress": "progress",
  progress: "progress",
  done: "done",
  complete: "done",
  completed: "done",
  unscheduled: "unscheduled",
  reserved: "unscheduled",
};

const PLAN_TASK_FILTER = (task) => task.name && !task.name.startsWith("Reserved tracker row");
const DAY_MS = 24 * 60 * 60 * 1000;
const PLAN_START_DATE = new Date(DRIGGS_712_SEED.meta.scheduleStartISO || "2023-10-14T00:00:00");
const PLAN_END_DATE = new Date(DRIGGS_712_SEED.meta.scheduleEndISO || "2026-01-14T00:00:00");
const PLAN_TOTAL_DAYS = Math.max(1, Math.round((PLAN_END_DATE - PLAN_START_DATE) / DAY_MS));

function normalizePlanText(value) {
  return String(value || "").toLowerCase().trim();
}

function csvEscape(value) {
  const str = String(value ?? "");
  if (/[",\n]/.test(str)) return `"${str.replaceAll('"', '""')}"`;
  return str;
}

function slugPlanValue(value, fallback = "group") {
  return String(value || fallback).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || fallback;
}

function parsePlanDate(value) {
  if (!value || value === "—" || value === "Not set") return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatPlanDate(value) {
  const d = parsePlanDate(value);
  if (!d) return "";
  return d.toISOString().slice(0, 10);
}

function displayPlanDate(value) {
  const d = parsePlanDate(value);
  if (!d) return "Not set";
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function statusBucket(status) {
  return PLAN_BUCKET_BY_STATUS[normalizePlanText(status)] || "backlog";
}

function statusMetaForBucket(bucket) {
  return PLAN_STATUS_META[bucket] || PLAN_STATUS_META.backlog;
}

function coercePct(value, bucket) {
  const n = Number(value);
  if (Number.isFinite(n)) return Math.max(0, Math.min(1, n > 1 ? n / 100 : n));
  return bucket === "done" ? 1 : bucket === "progress" ? 0.25 : 0;
}

function normalizeTaskForPlanner(task, index = 0) {
  const bucket = task.bucket === "reserved" ? "unscheduled" : statusBucket(task.status || task.bucket);
  const meta = statusMetaForBucket(bucket);
  const pctComplete = bucket === "done" ? 1 : coercePct(task.pctComplete, bucket);
  const groupName = task.group || task.phase || "Project plan";
  const startISO = formatPlanDate(task.startISO || task.start || task.startDisplay);
  const endISO = formatPlanDate(task.endISO || task.end || task.endDisplay || startISO);
  const startDate = parsePlanDate(startISO);
  const endDate = parsePlanDate(endISO || startISO);
  const fallbackDays = Number(task.days) || (startDate && endDate ? Math.max(1, Math.round((endDate - startDate) / DAY_MS) + 1) : 1);
  return {
    ...task,
    id: String(task.id || `task-${index + 1}`),
    plannerOrder: Number.isFinite(task.plannerOrder) ? task.plannerOrder : index,
    wbs: task.wbs || `${index + 1}`,
    name: task.name || `Task ${index + 1}`,
    groupId: task.groupId || slugPlanValue(groupName),
    group: groupName,
    phase: task.phase || groupName,
    owner: task.owner || "Unassigned",
    startISO: startISO || null,
    endISO: endISO || null,
    start: startISO ? startISO.slice(5) : "—",
    end: endISO ? endISO.slice(5) : "—",
    startDisplay: displayPlanDate(startISO),
    endDisplay: displayPlanDate(endISO),
    days: fallbackDays,
    bucket,
    status: meta.status,
    cls: pctComplete >= 1 ? "pos" : meta.cls,
    pctComplete,
    pctLabel: `${Math.round(pctComplete * 100)}%`,
    predecessors: Array.isArray(task.predecessors) ? task.predecessors : String(task.predecessors || task.raw?.Predecessors || task.raw?.Predecessor || "").split(",").map((x) => x.trim()).filter(Boolean),
    dependencies: Array.isArray(task.dependencies) ? task.dependencies : String(task.dependencies || task.raw?.Dependencies || task.raw?.Dependency || "").split(",").map((x) => x.trim()).filter(Boolean),
  };
}

function buildInitialGroups(tasks) {
  const map = new Map();
  tasks.forEach((task, index) => {
    const groupName = task.group || task.phase || "Project plan";
    const id = task.groupId || slugPlanValue(groupName);
    if (!map.has(id)) map.set(id, { id, name: groupName, order: map.size, collapsed: false, source: index === 0 ? "tracker" : "derived" });
  });
  return Array.from(map.values());
}

function getTaskTimelineMetrics(task) {
  const start = parsePlanDate(task.startISO);
  const end = parsePlanDate(task.endISO || task.startISO);
  if (!start || !end) return { left: 0, width: 2 };
  const startOffset = Math.max(0, Math.min(PLAN_TOTAL_DAYS, Math.round((start - PLAN_START_DATE) / DAY_MS)));
  const endOffset = Math.max(startOffset + 1, Math.min(PLAN_TOTAL_DAYS, Math.round((end - PLAN_START_DATE) / DAY_MS) + 1));
  return {
    left: Math.max(0, Math.min(98, (startOffset / PLAN_TOTAL_DAYS) * 100)),
    width: Math.max(1.6, ((endOffset - startOffset) / PLAN_TOTAL_DAYS) * 100),
  };
}

function getCurrentDayPct() {
  const today = new Date();
  const offset = Math.round((today - PLAN_START_DATE) / DAY_MS);
  return Math.max(0, Math.min(100, (offset / PLAN_TOTAL_DAYS) * 100));
}

function buildPlanCsv(tasks) {
  const headers = ["WBS", "Task", "Group", "Phase", "Owner", "Status", "Percent Complete", "Days", "Start", "End", "Predecessors", "Dependencies", "Source Row"];
  const rows = tasks.map((task) => [
    task.wbs,
    task.name,
    task.group,
    task.phase,
    task.owner,
    task.status,
    task.pctLabel,
    task.days ?? "",
    task.startDisplay,
    task.endDisplay,
    (task.predecessors || []).join("; "),
    (task.dependencies || []).join("; "),
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
  const [tasks, setTasks] = React.useState(() => TASKS.map(normalizeTaskForPlanner));
  const [groups, setGroups] = React.useState(() => buildInitialGroups(TASKS.map(normalizeTaskForPlanner)));
  const [editingTask, setEditingTask] = React.useState(null);
  const [editingGroup, setEditingGroup] = React.useState(null);
  const [draggedTaskId, setDraggedTaskId] = React.useState(null);
  const [draggedKanbanTaskId, setDraggedKanbanTaskId] = React.useState(null);
  const [kanbanDropBucket, setKanbanDropBucket] = React.useState(null);

  const visibleBaseTasks = React.useMemo(() => tasks.filter(PLAN_TASK_FILTER).sort((a, b) => (a.plannerOrder ?? 0) - (b.plannerOrder ?? 0)), [tasks]);
  const ownerOptions = React.useMemo(() => Array.from(new Set(visibleBaseTasks.map((task) => task.owner || "Unassigned"))).sort(), [visibleBaseTasks]);
  const statusOptions = React.useMemo(() => Array.from(new Set(visibleBaseTasks.map((task) => task.status || "Unknown"))).sort(), [visibleBaseTasks]);
  const phaseOptions = React.useMemo(() => Array.from(new Set(visibleBaseTasks.map((task) => task.phase || task.group || "Project plan"))).sort(), [visibleBaseTasks]);

  const filteredTasks = React.useMemo(() => {
    const q = normalizePlanText(query);
    return visibleBaseTasks.filter((task) => {
      const haystack = normalizePlanText([task.wbs, task.name, task.owner, task.status, task.phase, task.group, task.startDisplay, task.endDisplay, ...(task.predecessors || []), ...(task.dependencies || [])].join(" "));
      const queryOk = !q || haystack.includes(q);
      const statusOk = statusFilter === "all" || task.status === statusFilter;
      const ownerOk = ownerFilter === "all" || task.owner === ownerFilter;
      const phaseOk = phaseFilter === "all" || task.phase === phaseFilter || task.group === phaseFilter;
      return queryOk && statusOk && ownerOk && phaseOk;
    });
  }, [visibleBaseTasks, query, statusFilter, ownerFilter, phaseFilter]);

  const orderedGroups = React.useMemo(() => [...groups].sort((a, b) => a.order - b.order), [groups]);
  const filteredGroupedTasks = React.useMemo(() => orderedGroups.map((group) => ({
    group,
    tasks: filteredTasks.filter((task) => task.groupId === group.id),
  })).filter((entry) => entry.tasks.length > 0 || phaseFilter === "all"), [orderedGroups, filteredTasks, phaseFilter]);

  const doneCount = visibleBaseTasks.filter((task) => task.bucket === "done" || task.pctComplete >= 1).length;
  const progressCount = visibleBaseTasks.filter((task) => task.bucket === "progress").length;
  const openCount = visibleBaseTasks.filter((task) => task.bucket === "backlog").length;
  const avgCompletion = visibleBaseTasks.length
    ? Math.round(visibleBaseTasks.reduce((sum, task) => sum + (task.pctComplete || 0), 0) / visibleBaseTasks.length * 100)
    : 0;

  const saveTask = React.useCallback((taskDraft) => {
    const bucket = statusBucket(taskDraft.status || taskDraft.bucket);
    const meta = statusMetaForBucket(bucket);
    const pctComplete = coercePct(taskDraft.pctComplete, bucket);
    const group = groups.find((g) => g.id === taskDraft.groupId) || groups[0] || { id: "project-plan", name: "Project plan" };
    const startISO = formatPlanDate(taskDraft.startISO);
    const endISO = formatPlanDate(taskDraft.endISO || taskDraft.startISO);
    const normalized = normalizeTaskForPlanner({
      ...taskDraft,
      groupId: group.id,
      group: group.name,
      phase: taskDraft.phase || group.name,
      startISO,
      endISO,
      bucket,
      status: meta.status,
      cls: pctComplete >= 1 ? "pos" : meta.cls,
      pctComplete,
      pctLabel: `${Math.round(pctComplete * 100)}%`,
      predecessors: String(taskDraft.predecessorsText || "").split(",").map((x) => x.trim()).filter(Boolean),
      dependencies: String(taskDraft.dependenciesText || "").split(",").map((x) => x.trim()).filter(Boolean),
    });
    setTasks((current) => {
      const exists = current.some((task) => task.id === normalized.id);
      if (exists) return current.map((task) => task.id === normalized.id ? normalized : task);
      return [{ ...normalized, plannerOrder: -1 }, ...current].map((task, index) => ({ ...task, plannerOrder: index }));
    });
    setEditingTask(null);
  }, [groups]);

  const saveGroup = React.useCallback((groupDraft) => {
    const name = groupDraft.name?.trim() || "Untitled group";
    const id = groupDraft.id || `group-${Date.now()}`;
    setGroups((current) => {
      const exists = current.some((group) => group.id === id);
      if (exists) return current.map((group) => group.id === id ? { ...group, name } : group);
      return [...current, { id, name, order: current.length, collapsed: false, source: "local" }];
    });
    setTasks((current) => current.map((task) => task.groupId === id ? { ...task, group: name, phase: task.phase || name } : task));
    setEditingGroup(null);
  }, []);

  const updateTaskStatus = React.useCallback((taskId, bucket) => {
    const meta = statusMetaForBucket(bucket);
    setTasks((current) => current.map((task) => {
      if (task.id !== taskId) return task;
      const pctComplete = bucket === "done" ? 1 : bucket === "progress" ? Math.max(task.pctComplete || 0.25, 0.25) : 0;
      return normalizeTaskForPlanner({ ...task, bucket, status: meta.status, cls: meta.cls, pctComplete, pctLabel: `${Math.round(pctComplete * 100)}%` });
    }));
  }, []);

  const moveTask = React.useCallback((taskId, targetTaskId, targetGroupId = null) => {
    setTasks((current) => {
      const ordered = [...current].sort((a, b) => (a.plannerOrder ?? 0) - (b.plannerOrder ?? 0));
      const fromIndex = ordered.findIndex((task) => task.id === taskId);
      if (fromIndex === -1) return current;
      const [moving] = ordered.splice(fromIndex, 1);
      const targetIndex = targetTaskId ? Math.max(0, ordered.findIndex((task) => task.id === targetTaskId)) : ordered.length;
      const group = groups.find((g) => g.id === targetGroupId) || groups.find((g) => g.id === moving.groupId) || groups[0];
      const moved = group ? { ...moving, groupId: group.id, group: group.name, phase: moving.phase || group.name } : moving;
      ordered.splice(targetIndex === -1 ? ordered.length : targetIndex, 0, moved);
      return ordered.map((task, index) => ({ ...task, plannerOrder: index }));
    });
  }, [groups]);

  const addTaskForGroup = React.useCallback((groupId = null) => {
    const group = groups.find((g) => g.id === groupId) || groups[0] || { id: "project-plan", name: "Project plan" };
    setEditingTask({
      id: `local-${Date.now()}`,
      sourceRow: "local",
      wbs: `L-${visibleBaseTasks.length + 1}`,
      name: "",
      owner: ownerFilter !== "all" ? ownerFilter : "Project leadership",
      groupId: group.id,
      group: group.name,
      phase: group.name,
      status: "Open",
      bucket: "backlog",
      pctComplete: 0,
      startISO: "",
      endISO: "",
      days: 1,
      predecessors: [],
      dependencies: [],
      raw: { source: "local client-side addition" },
    });
  }, [groups, ownerFilter, visibleBaseTasks.length]);

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
            <button className="btn btn-secondary" onClick={() => setEditingGroup({ id: null, name: "" })}><Icon name="layers" size={13} /> Add group</button>
            <button className="btn btn-primary" onClick={() => addTaskForGroup()}><Icon name="plus" size={13} /> Add task</button>
          </>
        }
      />

      <div className="grid-kpis" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        <SmallStat label="Tracker rows" value={String(visibleBaseTasks.length)} sub={`${filteredTasks.length} visible after filters`} />
        <SmallStat label="Completion" value={`${avgCompletion}%`} sub={`${doneCount} done · ${progressCount} in progress`} cls="pos" />
        <SmallStat label="Open tasks" value={String(openCount)} sub={`${statusOptions.length} statuses · ${ownerOptions.length} owners`} cls="info" />
        <SmallStat label="Groups" value={String(groups.length)} sub={`${filteredGroupedTasks.length} visible task groups`} />
      </div>

      <div className="card planner-card" style={{ marginTop: 16 }}>
        <div className="card-head planner-toolbar">
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
          {view === "timeline" && (
            <div className="card-actions">
              <div className="seg" aria-label="Timeline zoom controls">
                {["months", "quarters", "years"].map((z) => (
                  <button key={z} className={zoom === z ? "active" : ""} onClick={() => setZoom(z)}>
                    {z[0].toUpperCase() + z.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {view === "timeline" && <TimelineView groups={filteredGroupedTasks} allTasks={visibleBaseTasks} months={PLAN_MONTHS} zoom={zoom} draggedTaskId={draggedTaskId} setDraggedTaskId={setDraggedTaskId} onMoveTask={moveTask} onEditTask={setEditingTask} onEditGroup={setEditingGroup} onAddTask={addTaskForGroup} />}
        {view === "kanban" && <KanbanView tasks={filteredTasks} draggedTaskId={draggedKanbanTaskId} setDraggedTaskId={setDraggedKanbanTaskId} dropBucket={kanbanDropBucket} setDropBucket={setKanbanDropBucket} onStatusChange={updateTaskStatus} onEditTask={setEditingTask} />}
        {view === "list" && <PlanListView groups={filteredGroupedTasks} tasks={filteredTasks} onStatusChange={updateTaskStatus} onEditTask={setEditingTask} onEditGroup={setEditingGroup} onAddTask={addTaskForGroup} onAddGroup={() => setEditingGroup({ id: null, name: "" })} />}
      </div>

      {editingTask && <TaskEditorOverlay task={editingTask} groups={groups} tasks={visibleBaseTasks} onClose={() => setEditingTask(null)} onSave={saveTask} />}
      {editingGroup && <GroupEditorOverlay group={editingGroup} onClose={() => setEditingGroup(null)} onSave={saveGroup} />}
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

function TimelineView({ groups, allTasks, months, zoom, draggedTaskId, setDraggedTaskId, onMoveTask, onEditTask, onEditGroup, onAddTask }) {
  const periods = getTimelinePeriods(months, zoom);
  const todayPct = getCurrentDayPct();
  const minWidth = zoom === "months" ? 1360 : zoom === "quarters" ? 980 : 760;

  return (
    <div className="planner-timeline-shell">
      <div className="planner-timeline" style={{ gridTemplateColumns: "390px 1fr" }}>
        <div className="planner-task-pane">
          <div className="planner-sticky-head planner-task-head">Task / WBS · Owner · Days · Predecessors</div>
          {groups.map(({ group, tasks }) => (
            <React.Fragment key={group.id}>
              <GroupHeader group={group} count={tasks.length} onEditGroup={onEditGroup} onAddTask={onAddTask} onDropTask={(taskId) => onMoveTask(taskId, null, group.id)} />
              {tasks.map((task) => (
                <TimelineTaskRow key={task.id} task={task} draggedTaskId={draggedTaskId} setDraggedTaskId={setDraggedTaskId} onMoveTask={onMoveTask} onEditTask={onEditTask} />
              ))}
            </React.Fragment>
          ))}
          {allTasks.length === 0 && <EmptyPlanState />}
        </div>

        <div className="planner-grid-pane">
          <div className="planner-grid-inner" style={{ minWidth }}>
            <div className="planner-period-head planner-sticky-head" style={{ gridTemplateColumns: `repeat(${periods.length}, minmax(86px, 1fr))` }}>
              {periods.map((m) => <div key={`${zoom}-${m.label}-${m.iso}`} className="planner-period-cell">{m.label}</div>)}
            </div>
            <div className="planner-bars" style={{ "--timeline-cols": periods.length, "--today-left": `${todayPct}%` }}>
              <div className="planner-today-line"><span>Today</span></div>
              {groups.map(({ group, tasks }) => (
                <React.Fragment key={group.id}>
                  <div className="planner-group-grid-row" />
                  {tasks.map((task) => <TimelineBarRow key={task.id} task={task} periods={periods} onEditTask={onEditTask} />)}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GroupHeader({ group, count, onEditGroup, onAddTask, onDropTask }) {
  return (
    <div
      className="planner-group-row"
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        const taskId = event.dataTransfer.getData("text/plain");
        if (taskId) onDropTask(taskId);
      }}
    >
      <div className="row" style={{ gap: 8 }}>
        <Icon name="layers" size={13} />
        <strong>{group.name}</strong>
        <span className="mono faint">{count}</span>
      </div>
      <div className="row" style={{ gap: 6 }}>
        <button className="planner-icon-btn" onClick={() => onAddTask(group.id)} title="Add task to group"><Icon name="plus" size={12} /></button>
        <button className="planner-icon-btn" onClick={() => onEditGroup(group)} title="Edit group"><Icon name="edit" size={12} /></button>
      </div>
    </div>
  );
}

function TimelineTaskRow({ task, draggedTaskId, setDraggedTaskId, onMoveTask, onEditTask }) {
  const isDragging = draggedTaskId === task.id;
  return (
    <div
      className={`planner-task-row ${task.pctComplete >= 1 ? "is-done" : ""} ${isDragging ? "is-dragging" : ""}`}
      draggable
      onDragStart={(event) => {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", task.id);
        setDraggedTaskId(task.id);
      }}
      onDragEnd={() => setDraggedTaskId(null)}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        const taskId = event.dataTransfer.getData("text/plain");
        if (taskId && taskId !== task.id) onMoveTask(taskId, task.id, task.groupId);
      }}
      onDoubleClick={() => onEditTask(task)}
    >
      <Icon name="grip" size={12} className="planner-grip" />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="row" style={{ gap: 8 }}>
          <span className="mono faint" style={{ fontSize: 11, minWidth: 36 }}>{task.wbs}</span>
          <span className="planner-task-name">{task.name}</span>
          {task.pctComplete >= 1 && <span className="pill pos no-dot" style={{ height: 18 }}>100%</span>}
        </div>
        <div className="planner-task-meta">
          {task.owner} · {task.startDisplay} → {task.endDisplay} · {task.days ?? "—"}d
          {(task.predecessors || []).length > 0 && <> · pred: {(task.predecessors || []).join(", ")}</>}
        </div>
      </div>
      <button className="planner-icon-btn" onClick={() => onEditTask(task)} title="Edit task"><Icon name="edit" size={12} /></button>
    </div>
  );
}

function TimelineBarRow({ task, periods, onEditTask }) {
  const metrics = getTaskTimelineMetrics(task);
  const isDone = task.pctComplete >= 1;
  const predecessorCount = (task.predecessors || []).length;
  return (
    <div className="planner-bar-row" style={{ "--timeline-cols": periods.length }}>
      <div
        className={`planner-task-bar ${isDone ? "is-complete" : task.bucket === "progress" ? "is-progress" : task.bucket === "unscheduled" ? "is-unscheduled" : ""}`}
        style={{ left: `${metrics.left}%`, width: `${metrics.width}%`, "--task-progress": `${Math.max(4, (task.pctComplete || 0) * 100)}%` }}
        title={`${task.name}: ${task.startDisplay} → ${task.endDisplay}`}
        onDoubleClick={() => onEditTask(task)}
      >
        <span>{isDone ? "Done" : task.status}</span>
      </div>
      {predecessorCount > 0 && <div className="planner-dependency-chip" style={{ left: `${Math.max(0, metrics.left - 3)}%` }} title={`Predecessors: ${task.predecessors.join(", ")}`}><Icon name="link" size={10} /> {predecessorCount}</div>}
    </div>
  );
}

function KanbanView({ tasks, draggedTaskId, setDraggedTaskId, dropBucket, setDropBucket, onStatusChange, onEditTask }) {
  const columns = [
    { ...PLAN_STATUS_META.backlog, count: tasks.filter((task) => task.bucket === "backlog").length },
    { ...PLAN_STATUS_META.progress, count: tasks.filter((task) => task.bucket === "progress").length },
    { ...PLAN_STATUS_META.done, count: tasks.filter((task) => task.bucket === "done").length },
    { ...PLAN_STATUS_META.unscheduled, count: tasks.filter((task) => task.bucket === "unscheduled" || task.bucket === "reserved").length },
  ];
  const tasksByCol = Object.fromEntries(columns.map((column) => [column.id, tasks.filter((task) => column.id === "unscheduled" ? ["unscheduled", "reserved"].includes(task.bucket) : task.bucket === column.id)]));

  return (
    <div className="card-body planner-kanban-shell">
      <div className="planner-kanban-grid">
        {columns.map((col) => (
          <div
            key={col.id}
            className={`planner-kanban-col ${dropBucket === col.id ? "is-drop-target" : ""}`}
            onDragOver={(event) => { event.preventDefault(); setDropBucket(col.id); }}
            onDragLeave={() => setDropBucket(null)}
            onDrop={(event) => {
              event.preventDefault();
              const taskId = event.dataTransfer.getData("text/plain") || draggedTaskId;
              if (taskId) onStatusChange(taskId, col.id);
              setDraggedTaskId(null);
              setDropBucket(null);
            }}
          >
            <div className="row-between planner-kanban-head">
              <div className="row" style={{ gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{col.title}</span>
                <span className="faint mono" style={{ fontSize: 11 }}>{col.count}</span>
              </div>
              <span className={`pill ${col.cls} no-dot`} style={{ height: 18 }}>{col.status}</span>
            </div>
            <div className="stack" style={{ gap: 8 }}>
              {(tasksByCol[col.id] || []).map((task) => (
                <div
                  key={task.id}
                  className={`planner-kanban-card ${task.pctComplete >= 1 ? "is-complete" : ""}`}
                  draggable
                  onDragStart={(event) => {
                    event.dataTransfer.effectAllowed = "move";
                    event.dataTransfer.setData("text/plain", task.id);
                    setDraggedTaskId(task.id);
                  }}
                  onDragEnd={() => { setDraggedTaskId(null); setDropBucket(null); }}
                  onDoubleClick={() => onEditTask(task)}
                >
                  <div className="row" style={{ gap: 6, marginBottom: 4 }}>
                    <span className="mono faint" style={{ fontSize: 10 }}>{task.wbs}</span>
                    <span className={`pill ${task.pctComplete >= 1 ? "pos" : task.cls} no-dot`} style={{ marginLeft: "auto", height: 18 }}>{task.pctLabel}</span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{task.name}</div>
                  <div className="row" style={{ gap: 6, fontSize: 11, color: "var(--text-muted)", flexWrap: "wrap" }}>
                    <Icon name="clock" size={11} />
                    <span>{task.days ?? "—"}d</span>
                    <span className="dot" style={{ width: 3, height: 3, marginLeft: 4 }} />
                    <span>{task.owner}</span>
                  </div>
                  <div className="planner-card-foot">
                    <span className="faint">{task.group}</span>
                    <button className="planner-icon-btn" onClick={() => onEditTask(task)} title="Edit task"><Icon name="edit" size={12} /></button>
                  </div>
                </div>
              ))}
              {(tasksByCol[col.id] || []).length === 0 && <div className="planner-empty-drop">Drop cards here to mark them {col.title.toLowerCase()}.</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PlanListView({ groups, onStatusChange, onEditTask, onEditGroup, onAddTask, onAddGroup }) {
  return (
    <div className="card-body-flush planner-list-shell">
      <div className="planner-list-actions">
        <button className="btn btn-secondary btn-sm" onClick={onAddGroup}><Icon name="layers" size={12} /> Add group</button>
      </div>
      <table className="table planner-table">
        <thead>
          <tr>
            <th style={{ width: 54 }}>WBS</th>
            <th>Task / group</th>
            <th>Phase</th>
            <th>Status</th>
            <th className="num">%</th>
            <th className="num">Days</th>
            <th>Start</th>
            <th>End</th>
            <th>Owner</th>
            <th>Pred.</th>
            <th className="num">Actions</th>
          </tr>
        </thead>
        <tbody>
          {groups.map(({ group, tasks }) => (
            <React.Fragment key={group.id}>
              <tr className="planner-table-group-row">
                <td colSpan="11">
                  <div className="row-between">
                    <div className="row" style={{ gap: 8 }}><Icon name="layers" size={13} /><strong>{group.name}</strong><span className="mono faint">{tasks.length}</span></div>
                    <div className="row" style={{ gap: 6 }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => onAddTask(group.id)}><Icon name="plus" size={12} /> Task</button>
                      <button className="btn btn-secondary btn-sm" onClick={() => onEditGroup(group)}><Icon name="edit" size={12} /> Group</button>
                    </div>
                  </div>
                </td>
              </tr>
              {tasks.map((task) => (
                <tr key={task.id} className={task.pctComplete >= 1 ? "planner-row-complete" : ""}>
                  <td className="mono faint">{task.wbs}</td>
                  <td style={{ fontWeight: 500 }}>
                    <div>{task.name}</div>
                    <div className="faint" style={{ fontSize: 11 }}>Source row {task.sourceRow} · deps {(task.dependencies || []).length}</div>
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
                  <td className="muted mono" style={{ fontSize: 12 }}>{task.startISO || "—"}</td>
                  <td className="muted mono" style={{ fontSize: 12 }}>{task.endISO || "—"}</td>
                  <td className="muted">{task.owner}</td>
                  <td className="muted mono" style={{ fontSize: 11 }}>{(task.predecessors || []).join(", ") || "—"}</td>
                  <td className="num"><button className="planner-icon-btn" onClick={() => onEditTask(task)} title="Edit task"><Icon name="edit" size={12} /></button></td>
                </tr>
              ))}
            </React.Fragment>
          ))}
          {groups.every((entry) => entry.tasks.length === 0) && (
            <tr>
              <td colSpan="11"><EmptyPlanState /></td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function TaskEditorOverlay({ task, groups, tasks, onClose, onSave }) {
  const [draft, setDraft] = React.useState(() => ({
    ...task,
    startISO: formatPlanDate(task.startISO),
    endISO: formatPlanDate(task.endISO),
    pctComplete: Math.round((task.pctComplete || 0) * 100),
    predecessorsText: (task.predecessors || []).join(", "),
    dependenciesText: (task.dependencies || []).join(", "),
  }));
  const update = (key, value) => setDraft((current) => ({ ...current, [key]: value }));

  return (
    <div className="planner-modal-backdrop" role="dialog" aria-modal="true">
      <form className="planner-modal" onSubmit={(event) => { event.preventDefault(); onSave({ ...draft, pctComplete: Number(draft.pctComplete) / 100 }); }}>
        <div className="planner-modal-head">
          <div>
            <div className="metric-label">Task editor</div>
            <h3>{task.sourceRow === "local" && !task.name ? "Add tracker task" : "Edit tracker task"}</h3>
          </div>
          <button type="button" className="planner-icon-btn" onClick={onClose}><Icon name="x" size={14} /></button>
        </div>
        <div className="planner-form-grid">
          <label className="planner-field planner-field-wide"><span>Task name</span><input value={draft.name || ""} onChange={(event) => update("name", event.target.value)} required /></label>
          <label className="planner-field"><span>WBS</span><input value={draft.wbs || ""} onChange={(event) => update("wbs", event.target.value)} /></label>
          <label className="planner-field"><span>Owner</span><input value={draft.owner || ""} onChange={(event) => update("owner", event.target.value)} /></label>
          <label className="planner-field"><span>Group</span><select value={draft.groupId || groups[0]?.id || ""} onChange={(event) => update("groupId", event.target.value)}>{groups.map((group) => <option key={group.id} value={group.id}>{group.name}</option>)}</select></label>
          <label className="planner-field"><span>Phase</span><input value={draft.phase || ""} onChange={(event) => update("phase", event.target.value)} /></label>
          <label className="planner-field"><span>Status</span><select value={draft.status || "Open"} onChange={(event) => update("status", event.target.value)}><option>Open</option><option>In progress</option><option>Done</option><option>Unscheduled</option></select></label>
          <label className="planner-field"><span>% complete</span><input type="number" min="0" max="100" value={draft.pctComplete ?? 0} onChange={(event) => update("pctComplete", event.target.value)} /></label>
          <label className="planner-field"><span>Start</span><input type="date" value={draft.startISO || ""} onChange={(event) => update("startISO", event.target.value)} /></label>
          <label className="planner-field"><span>End</span><input type="date" value={draft.endISO || ""} onChange={(event) => update("endISO", event.target.value)} /></label>
          <label className="planner-field"><span>Days</span><input type="number" min="0" value={draft.days ?? 0} onChange={(event) => update("days", Number(event.target.value))} /></label>
          <label className="planner-field planner-field-wide"><span>Predecessors</span><input value={draft.predecessorsText || ""} onChange={(event) => update("predecessorsText", event.target.value)} list="planner-task-wbs" placeholder="Comma-separated WBS or task names" /></label>
          <label className="planner-field planner-field-wide"><span>Dependencies</span><input value={draft.dependenciesText || ""} onChange={(event) => update("dependenciesText", event.target.value)} placeholder="Comma-separated dependent WBS or task names" /></label>
          <datalist id="planner-task-wbs">{tasks.map((candidate) => <option key={candidate.id} value={candidate.wbs}>{candidate.name}</option>)}</datalist>
        </div>
        <div className="planner-modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary"><Icon name="check" size={13} /> Save task</button>
        </div>
      </form>
    </div>
  );
}

function GroupEditorOverlay({ group, onClose, onSave }) {
  const [name, setName] = React.useState(group.name || "");
  return (
    <div className="planner-modal-backdrop" role="dialog" aria-modal="true">
      <form className="planner-modal planner-modal-small" onSubmit={(event) => { event.preventDefault(); onSave({ ...group, name }); }}>
        <div className="planner-modal-head">
          <div>
            <div className="metric-label">Task group</div>
            <h3>{group.id ? "Edit group" : "Add group"}</h3>
          </div>
          <button type="button" className="planner-icon-btn" onClick={onClose}><Icon name="x" size={14} /></button>
        </div>
        <label className="planner-field planner-field-wide"><span>Group name</span><input value={name} onChange={(event) => setName(event.target.value)} required autoFocus /></label>
        <div className="planner-modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary"><Icon name="check" size={13} /> Save group</button>
        </div>
      </form>
    </div>
  );
}

function EmptyPlanState() {
  return <div className="muted" style={{ padding: 24, textAlign: "center", fontSize: 13 }}>No 712 Driggs plan rows match the current search and filters.</div>;
}

window.ProjectPlanPage = ProjectPlanPage;'''
path.write_text(text[:start] + replacement + text[end:])
print('Replaced Project Plan block with functional planner upgrade')
