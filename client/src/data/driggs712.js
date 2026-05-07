/*
 * CondoCore style reminder: Quiet Brutalist Enterprise. This data seed supports
 * ledger-like operational density while preserving the attached tracker values
 * as source-of-truth project records for 712 Driggs.
 */

export const DRIGGS_712_SEED = {
  "project": {
    "id": "712-driggs",
    "name": "712 Driggs",
    "full": "712 Driggs Condominium",
    "address": "712 Driggs Avenue, Brooklyn, NY",
    "phase": "Project planning",
    "phaseClass": "info",
    "status": "Active",
    "statusClass": "pos",
    "budget": 14890727,
    "spent": 421133,
    "units": 30,
    "floors": 4,
    "targetCompletion": "Jan 14, 2026",
    "progress": 27,
    "initials": "7D",
    "sourceWorkbookProjectName": "219 Driggs Street",
    "sourceWorkbookAddress": "219 Driggs Street",
    "generalContractor": "Renovation Group",
    "projectStartDate": "May 1, 2024"
  },
  "meta": {
    "sourceFile": "/home/ubuntu/condocore_web/ProjectTracker-712Driggs.xlsx",
    "workbookProjectName": "219 Driggs Street",
    "workbookAddress": "219 Driggs Street",
    "workbookProjectPlanTitle": "219 Driggs Street",
    "generalContractor": "Renovation Group",
    "projectStartDate": "2024-05-01T00:00:00",
    "scheduleStartISO": "2023-10-14",
    "scheduleEndISO": "2026-01-14",
    "scheduleStartLabel": "Oct 14, 2023",
    "scheduleEndLabel": "Jan 14, 2026"
  },
  "planTasks": [
    {
      "id": "plan-row-9",
      "sourceRow": 9,
      "wbs": "1",
      "name": "Planning",
      "owner": "Project leadership",
      "phase": "Planning",
      "days": null,
      "start": "05/01/24",
      "end": "01/31/25",
      "startISO": "2024-05-01",
      "endISO": "2025-01-31",
      "startDisplay": "May 1, 2024",
      "endDisplay": "Jan 31, 2025",
      "pctComplete": null,
      "pctLabel": "\u2014",
      "status": "Open",
      "cls": "neutral",
      "bucket": "backlog",
      "x": 24.3,
      "w": 33.41,
      "ganttWeeks": 0,
      "ganttMarks": [],
      "raw": {
        "row": 9,
        "wbs": "1",
        "title": "Planning",
        "owner": null,
        "start_date": "2024-05-01T00:00:00",
        "due_date": "2025-01-31T00:00:00",
        "duration_days": null,
        "pct_complete": null,
        "gantt_marks": []
      }
    },
    {
      "id": "plan-row-10",
      "sourceRow": 10,
      "wbs": "2",
      "name": "Contract Execution",
      "owner": "Ownership / finance",
      "phase": "Planning",
      "days": 1,
      "start": "05/01/24",
      "end": "05/02/24",
      "startISO": "2024-05-01",
      "endISO": "2024-05-02",
      "startDisplay": "May 1, 2024",
      "endDisplay": "May 2, 2024",
      "pctComplete": 1,
      "pctLabel": "100%",
      "status": "Done",
      "cls": "pos",
      "bucket": "done",
      "x": 24.3,
      "w": 1.2,
      "ganttWeeks": 1,
      "ganttMarks": [
        {
          "week_number": 1,
          "date": "2024-05-01T00:00:00",
          "mark": "X"
        }
      ],
      "raw": {
        "row": 10,
        "wbs": "2",
        "title": "Contract Execution",
        "owner": null,
        "start_date": "2024-05-01T00:00:00",
        "due_date": "2024-05-02T00:00:00",
        "duration_days": 1,
        "pct_complete": 1,
        "gantt_marks": [
          {
            "week_number": 1,
            "date": "2024-05-01T00:00:00",
            "mark": "X"
          }
        ]
      }
    },
    {
      "id": "plan-row-11",
      "sourceRow": 11,
      "wbs": "3",
      "name": "Survey",
      "owner": "Consultants",
      "phase": "Planning",
      "days": 21,
      "start": "05/01/24",
      "end": "05/22/24",
      "startISO": "2024-05-01",
      "endISO": "2024-05-22",
      "startDisplay": "May 1, 2024",
      "endDisplay": "May 22, 2024",
      "pctComplete": 1,
      "pctLabel": "100%",
      "status": "Done",
      "cls": "pos",
      "bucket": "done",
      "x": 24.3,
      "w": 2.55,
      "ganttWeeks": 4,
      "ganttMarks": [
        {
          "week_number": 1,
          "date": "2024-05-01T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 2,
          "date": "2024-05-08T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 3,
          "date": "2024-05-15T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 4,
          "date": "2024-05-22T00:00:00",
          "mark": "X"
        }
      ],
      "raw": {
        "row": 11,
        "wbs": "3",
        "title": "Survey",
        "owner": null,
        "start_date": "2024-05-01T00:00:00",
        "due_date": "2024-05-22T00:00:00",
        "duration_days": 21,
        "pct_complete": 1,
        "gantt_marks": [
          {
            "week_number": 1,
            "date": "2024-05-01T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 2,
            "date": "2024-05-08T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 3,
            "date": "2024-05-15T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 4,
            "date": "2024-05-22T00:00:00",
            "mark": "X"
          }
        ]
      }
    },
    {
      "id": "plan-row-12",
      "sourceRow": 12,
      "wbs": "4",
      "name": "Environmental",
      "owner": "Consultants",
      "phase": "Planning",
      "days": 28,
      "start": "05/01/24",
      "end": "05/29/24",
      "startISO": "2024-05-01",
      "endISO": "2024-05-29",
      "startDisplay": "May 1, 2024",
      "endDisplay": "May 29, 2024",
      "pctComplete": 0,
      "pctLabel": "0%",
      "status": "Open",
      "cls": "neutral",
      "bucket": "backlog",
      "x": 24.3,
      "w": 3.4,
      "ganttWeeks": 5,
      "ganttMarks": [
        {
          "week_number": 1,
          "date": "2024-05-01T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 2,
          "date": "2024-05-08T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 3,
          "date": "2024-05-15T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 4,
          "date": "2024-05-22T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 5,
          "date": "2024-05-29T00:00:00",
          "mark": "X"
        }
      ],
      "raw": {
        "row": 12,
        "wbs": "4",
        "title": "Environmental",
        "owner": null,
        "start_date": "2024-05-01T00:00:00",
        "due_date": "2024-05-29T00:00:00",
        "duration_days": 28,
        "pct_complete": 0,
        "gantt_marks": [
          {
            "week_number": 1,
            "date": "2024-05-01T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 2,
            "date": "2024-05-08T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 3,
            "date": "2024-05-15T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 4,
            "date": "2024-05-22T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 5,
            "date": "2024-05-29T00:00:00",
            "mark": "X"
          }
        ]
      }
    },
    {
      "id": "plan-row-13",
      "sourceRow": 13,
      "wbs": "5",
      "name": "Architectural Engineering Planning",
      "owner": "Design / filing team",
      "phase": "Planning",
      "days": 350,
      "start": "10/14/23",
      "end": "09/28/24",
      "startISO": "2023-10-14",
      "endISO": "2024-09-28",
      "startDisplay": "Oct 14, 2023",
      "endDisplay": "Sep 28, 2024",
      "pctComplete": 0.75,
      "pctLabel": "75%",
      "status": "In progress",
      "cls": "info",
      "bucket": "progress",
      "x": 0,
      "w": 42.53,
      "ganttWeeks": 22,
      "ganttMarks": [
        {
          "week_number": 1,
          "date": "2024-05-01T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 2,
          "date": "2024-05-08T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 3,
          "date": "2024-05-15T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 4,
          "date": "2024-05-22T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 5,
          "date": "2024-05-29T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 6,
          "date": "2024-06-05T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 7,
          "date": "2024-06-12T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 8,
          "date": "2024-06-19T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 9,
          "date": "2024-06-26T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 10,
          "date": "2024-07-03T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 11,
          "date": "2024-07-10T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 12,
          "date": "2024-07-17T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 13,
          "date": "2024-07-24T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 14,
          "date": "2024-07-31T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 15,
          "date": "2024-08-07T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 16,
          "date": "2024-08-14T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 17,
          "date": "2024-08-21T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 18,
          "date": "2024-08-28T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 19,
          "date": "2024-09-04T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 20,
          "date": "2024-09-11T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 21,
          "date": "2024-09-18T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 22,
          "date": "2024-09-25T00:00:00",
          "mark": "X"
        }
      ],
      "raw": {
        "row": 13,
        "wbs": "5",
        "title": "Architectural Engineering Planning",
        "owner": null,
        "start_date": "2023-10-14T00:00:00",
        "due_date": "2024-09-28T00:00:00",
        "duration_days": 350,
        "pct_complete": 0.75,
        "gantt_marks": [
          {
            "week_number": 1,
            "date": "2024-05-01T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 2,
            "date": "2024-05-08T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 3,
            "date": "2024-05-15T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 4,
            "date": "2024-05-22T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 5,
            "date": "2024-05-29T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 6,
            "date": "2024-06-05T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 7,
            "date": "2024-06-12T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 8,
            "date": "2024-06-19T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 9,
            "date": "2024-06-26T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 10,
            "date": "2024-07-03T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 11,
            "date": "2024-07-10T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 12,
            "date": "2024-07-17T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 13,
            "date": "2024-07-24T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 14,
            "date": "2024-07-31T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 15,
            "date": "2024-08-07T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 16,
            "date": "2024-08-14T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 17,
            "date": "2024-08-21T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 18,
            "date": "2024-08-28T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 19,
            "date": "2024-09-04T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 20,
            "date": "2024-09-11T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 21,
            "date": "2024-09-18T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 22,
            "date": "2024-09-25T00:00:00",
            "mark": "X"
          }
        ]
      }
    },
    {
      "id": "plan-row-14",
      "sourceRow": 14,
      "wbs": "R14",
      "name": "Architectural Plans",
      "owner": "Design / filing team",
      "phase": "Planning",
      "days": 275,
      "start": "05/01/24",
      "end": "01/31/25",
      "startISO": "2024-05-01",
      "endISO": "2025-01-31",
      "startDisplay": "May 1, 2024",
      "endDisplay": "Jan 31, 2025",
      "pctComplete": 0.9,
      "pctLabel": "90%",
      "status": "In progress",
      "cls": "info",
      "bucket": "progress",
      "x": 24.3,
      "w": 33.41,
      "ganttWeeks": 40,
      "ganttMarks": [
        {
          "week_number": 1,
          "date": "2024-05-01T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 2,
          "date": "2024-05-08T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 3,
          "date": "2024-05-15T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 4,
          "date": "2024-05-22T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 5,
          "date": "2024-05-29T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 6,
          "date": "2024-06-05T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 7,
          "date": "2024-06-12T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 8,
          "date": "2024-06-19T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 9,
          "date": "2024-06-26T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 10,
          "date": "2024-07-03T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 11,
          "date": "2024-07-10T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 12,
          "date": "2024-07-17T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 13,
          "date": "2024-07-24T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 14,
          "date": "2024-07-31T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 15,
          "date": "2024-08-07T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 16,
          "date": "2024-08-14T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 17,
          "date": "2024-08-21T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 18,
          "date": "2024-08-28T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 19,
          "date": "2024-09-04T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 20,
          "date": "2024-09-11T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 21,
          "date": "2024-09-18T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 22,
          "date": "2024-09-25T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 23,
          "date": "2024-10-02T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 24,
          "date": "2024-10-09T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 25,
          "date": "2024-10-16T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 26,
          "date": "2024-10-23T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 27,
          "date": "2024-10-30T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 28,
          "date": "2024-11-06T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 29,
          "date": "2024-11-13T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 30,
          "date": "2024-11-20T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 31,
          "date": "2024-11-27T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 32,
          "date": "2024-12-04T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 33,
          "date": "2024-12-11T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 34,
          "date": "2024-12-18T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 35,
          "date": "2024-12-25T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 36,
          "date": "2025-01-01T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 37,
          "date": "2025-01-08T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 38,
          "date": "2025-01-15T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 39,
          "date": "2025-01-22T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 40,
          "date": "2025-01-29T00:00:00",
          "mark": "X"
        }
      ],
      "raw": {
        "row": 14,
        "wbs": null,
        "title": "Architectural Plans",
        "owner": null,
        "start_date": "2024-05-01T00:00:00",
        "due_date": "2025-01-31T00:00:00",
        "duration_days": 275,
        "pct_complete": 0.9,
        "gantt_marks": [
          {
            "week_number": 1,
            "date": "2024-05-01T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 2,
            "date": "2024-05-08T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 3,
            "date": "2024-05-15T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 4,
            "date": "2024-05-22T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 5,
            "date": "2024-05-29T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 6,
            "date": "2024-06-05T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 7,
            "date": "2024-06-12T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 8,
            "date": "2024-06-19T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 9,
            "date": "2024-06-26T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 10,
            "date": "2024-07-03T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 11,
            "date": "2024-07-10T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 12,
            "date": "2024-07-17T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 13,
            "date": "2024-07-24T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 14,
            "date": "2024-07-31T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 15,
            "date": "2024-08-07T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 16,
            "date": "2024-08-14T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 17,
            "date": "2024-08-21T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 18,
            "date": "2024-08-28T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 19,
            "date": "2024-09-04T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 20,
            "date": "2024-09-11T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 21,
            "date": "2024-09-18T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 22,
            "date": "2024-09-25T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 23,
            "date": "2024-10-02T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 24,
            "date": "2024-10-09T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 25,
            "date": "2024-10-16T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 26,
            "date": "2024-10-23T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 27,
            "date": "2024-10-30T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 28,
            "date": "2024-11-06T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 29,
            "date": "2024-11-13T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 30,
            "date": "2024-11-20T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 31,
            "date": "2024-11-27T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 32,
            "date": "2024-12-04T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 33,
            "date": "2024-12-11T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 34,
            "date": "2024-12-18T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 35,
            "date": "2024-12-25T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 36,
            "date": "2025-01-01T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 37,
            "date": "2025-01-08T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 38,
            "date": "2025-01-15T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 39,
            "date": "2025-01-22T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 40,
            "date": "2025-01-29T00:00:00",
            "mark": "X"
          }
        ]
      }
    },
    {
      "id": "plan-row-15",
      "sourceRow": 15,
      "wbs": "R15",
      "name": "Structural Plans",
      "owner": "Design / filing team",
      "phase": "Planning",
      "days": 275,
      "start": "05/01/24",
      "end": "01/31/25",
      "startISO": "2024-05-01",
      "endISO": "2025-01-31",
      "startDisplay": "May 1, 2024",
      "endDisplay": "Jan 31, 2025",
      "pctComplete": 0.9,
      "pctLabel": "90%",
      "status": "In progress",
      "cls": "info",
      "bucket": "progress",
      "x": 24.3,
      "w": 33.41,
      "ganttWeeks": 40,
      "ganttMarks": [
        {
          "week_number": 1,
          "date": "2024-05-01T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 2,
          "date": "2024-05-08T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 3,
          "date": "2024-05-15T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 4,
          "date": "2024-05-22T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 5,
          "date": "2024-05-29T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 6,
          "date": "2024-06-05T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 7,
          "date": "2024-06-12T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 8,
          "date": "2024-06-19T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 9,
          "date": "2024-06-26T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 10,
          "date": "2024-07-03T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 11,
          "date": "2024-07-10T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 12,
          "date": "2024-07-17T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 13,
          "date": "2024-07-24T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 14,
          "date": "2024-07-31T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 15,
          "date": "2024-08-07T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 16,
          "date": "2024-08-14T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 17,
          "date": "2024-08-21T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 18,
          "date": "2024-08-28T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 19,
          "date": "2024-09-04T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 20,
          "date": "2024-09-11T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 21,
          "date": "2024-09-18T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 22,
          "date": "2024-09-25T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 23,
          "date": "2024-10-02T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 24,
          "date": "2024-10-09T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 25,
          "date": "2024-10-16T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 26,
          "date": "2024-10-23T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 27,
          "date": "2024-10-30T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 28,
          "date": "2024-11-06T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 29,
          "date": "2024-11-13T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 30,
          "date": "2024-11-20T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 31,
          "date": "2024-11-27T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 32,
          "date": "2024-12-04T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 33,
          "date": "2024-12-11T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 34,
          "date": "2024-12-18T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 35,
          "date": "2024-12-25T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 36,
          "date": "2025-01-01T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 37,
          "date": "2025-01-08T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 38,
          "date": "2025-01-15T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 39,
          "date": "2025-01-22T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 40,
          "date": "2025-01-29T00:00:00",
          "mark": "X"
        }
      ],
      "raw": {
        "row": 15,
        "wbs": null,
        "title": "Structural Plans",
        "owner": null,
        "start_date": "2024-05-01T00:00:00",
        "due_date": "2025-01-31T00:00:00",
        "duration_days": 275,
        "pct_complete": 0.9,
        "gantt_marks": [
          {
            "week_number": 1,
            "date": "2024-05-01T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 2,
            "date": "2024-05-08T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 3,
            "date": "2024-05-15T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 4,
            "date": "2024-05-22T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 5,
            "date": "2024-05-29T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 6,
            "date": "2024-06-05T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 7,
            "date": "2024-06-12T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 8,
            "date": "2024-06-19T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 9,
            "date": "2024-06-26T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 10,
            "date": "2024-07-03T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 11,
            "date": "2024-07-10T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 12,
            "date": "2024-07-17T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 13,
            "date": "2024-07-24T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 14,
            "date": "2024-07-31T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 15,
            "date": "2024-08-07T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 16,
            "date": "2024-08-14T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 17,
            "date": "2024-08-21T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 18,
            "date": "2024-08-28T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 19,
            "date": "2024-09-04T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 20,
            "date": "2024-09-11T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 21,
            "date": "2024-09-18T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 22,
            "date": "2024-09-25T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 23,
            "date": "2024-10-02T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 24,
            "date": "2024-10-09T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 25,
            "date": "2024-10-16T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 26,
            "date": "2024-10-23T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 27,
            "date": "2024-10-30T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 28,
            "date": "2024-11-06T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 29,
            "date": "2024-11-13T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 30,
            "date": "2024-11-20T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 31,
            "date": "2024-11-27T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 32,
            "date": "2024-12-04T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 33,
            "date": "2024-12-11T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 34,
            "date": "2024-12-18T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 35,
            "date": "2024-12-25T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 36,
            "date": "2025-01-01T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 37,
            "date": "2025-01-08T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 38,
            "date": "2025-01-15T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 39,
            "date": "2025-01-22T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 40,
            "date": "2025-01-29T00:00:00",
            "mark": "X"
          }
        ]
      }
    },
    {
      "id": "plan-row-16",
      "sourceRow": 16,
      "wbs": "R16",
      "name": "Fire Protection Plans (Sprinklers)",
      "owner": "Design / filing team",
      "phase": "Planning",
      "days": 275,
      "start": "05/01/24",
      "end": "01/31/25",
      "startISO": "2024-05-01",
      "endISO": "2025-01-31",
      "startDisplay": "May 1, 2024",
      "endDisplay": "Jan 31, 2025",
      "pctComplete": 0.9,
      "pctLabel": "90%",
      "status": "In progress",
      "cls": "info",
      "bucket": "progress",
      "x": 24.3,
      "w": 33.41,
      "ganttWeeks": 40,
      "ganttMarks": [
        {
          "week_number": 1,
          "date": "2024-05-01T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 2,
          "date": "2024-05-08T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 3,
          "date": "2024-05-15T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 4,
          "date": "2024-05-22T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 5,
          "date": "2024-05-29T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 6,
          "date": "2024-06-05T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 7,
          "date": "2024-06-12T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 8,
          "date": "2024-06-19T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 9,
          "date": "2024-06-26T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 10,
          "date": "2024-07-03T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 11,
          "date": "2024-07-10T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 12,
          "date": "2024-07-17T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 13,
          "date": "2024-07-24T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 14,
          "date": "2024-07-31T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 15,
          "date": "2024-08-07T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 16,
          "date": "2024-08-14T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 17,
          "date": "2024-08-21T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 18,
          "date": "2024-08-28T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 19,
          "date": "2024-09-04T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 20,
          "date": "2024-09-11T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 21,
          "date": "2024-09-18T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 22,
          "date": "2024-09-25T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 23,
          "date": "2024-10-02T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 24,
          "date": "2024-10-09T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 25,
          "date": "2024-10-16T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 26,
          "date": "2024-10-23T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 27,
          "date": "2024-10-30T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 28,
          "date": "2024-11-06T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 29,
          "date": "2024-11-13T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 30,
          "date": "2024-11-20T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 31,
          "date": "2024-11-27T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 32,
          "date": "2024-12-04T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 33,
          "date": "2024-12-11T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 34,
          "date": "2024-12-18T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 35,
          "date": "2024-12-25T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 36,
          "date": "2025-01-01T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 37,
          "date": "2025-01-08T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 38,
          "date": "2025-01-15T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 39,
          "date": "2025-01-22T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 40,
          "date": "2025-01-29T00:00:00",
          "mark": "X"
        }
      ],
      "raw": {
        "row": 16,
        "wbs": null,
        "title": "Fire Protection Plans (Sprinklers)",
        "owner": null,
        "start_date": "2024-05-01T00:00:00",
        "due_date": "2025-01-31T00:00:00",
        "duration_days": 275,
        "pct_complete": 0.9,
        "gantt_marks": [
          {
            "week_number": 1,
            "date": "2024-05-01T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 2,
            "date": "2024-05-08T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 3,
            "date": "2024-05-15T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 4,
            "date": "2024-05-22T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 5,
            "date": "2024-05-29T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 6,
            "date": "2024-06-05T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 7,
            "date": "2024-06-12T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 8,
            "date": "2024-06-19T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 9,
            "date": "2024-06-26T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 10,
            "date": "2024-07-03T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 11,
            "date": "2024-07-10T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 12,
            "date": "2024-07-17T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 13,
            "date": "2024-07-24T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 14,
            "date": "2024-07-31T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 15,
            "date": "2024-08-07T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 16,
            "date": "2024-08-14T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 17,
            "date": "2024-08-21T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 18,
            "date": "2024-08-28T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 19,
            "date": "2024-09-04T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 20,
            "date": "2024-09-11T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 21,
            "date": "2024-09-18T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 22,
            "date": "2024-09-25T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 23,
            "date": "2024-10-02T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 24,
            "date": "2024-10-09T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 25,
            "date": "2024-10-16T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 26,
            "date": "2024-10-23T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 27,
            "date": "2024-10-30T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 28,
            "date": "2024-11-06T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 29,
            "date": "2024-11-13T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 30,
            "date": "2024-11-20T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 31,
            "date": "2024-11-27T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 32,
            "date": "2024-12-04T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 33,
            "date": "2024-12-11T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 34,
            "date": "2024-12-18T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 35,
            "date": "2024-12-25T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 36,
            "date": "2025-01-01T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 37,
            "date": "2025-01-08T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 38,
            "date": "2025-01-15T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 39,
            "date": "2025-01-22T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 40,
            "date": "2025-01-29T00:00:00",
            "mark": "X"
          }
        ]
      }
    },
    {
      "id": "plan-row-17",
      "sourceRow": 17,
      "wbs": "R17",
      "name": "MEP Plans",
      "owner": "Design / filing team",
      "phase": "Planning",
      "days": 275,
      "start": "05/01/24",
      "end": "01/31/25",
      "startISO": "2024-05-01",
      "endISO": "2025-01-31",
      "startDisplay": "May 1, 2024",
      "endDisplay": "Jan 31, 2025",
      "pctComplete": 0.9,
      "pctLabel": "90%",
      "status": "In progress",
      "cls": "info",
      "bucket": "progress",
      "x": 24.3,
      "w": 33.41,
      "ganttWeeks": 40,
      "ganttMarks": [
        {
          "week_number": 1,
          "date": "2024-05-01T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 2,
          "date": "2024-05-08T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 3,
          "date": "2024-05-15T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 4,
          "date": "2024-05-22T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 5,
          "date": "2024-05-29T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 6,
          "date": "2024-06-05T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 7,
          "date": "2024-06-12T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 8,
          "date": "2024-06-19T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 9,
          "date": "2024-06-26T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 10,
          "date": "2024-07-03T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 11,
          "date": "2024-07-10T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 12,
          "date": "2024-07-17T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 13,
          "date": "2024-07-24T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 14,
          "date": "2024-07-31T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 15,
          "date": "2024-08-07T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 16,
          "date": "2024-08-14T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 17,
          "date": "2024-08-21T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 18,
          "date": "2024-08-28T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 19,
          "date": "2024-09-04T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 20,
          "date": "2024-09-11T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 21,
          "date": "2024-09-18T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 22,
          "date": "2024-09-25T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 23,
          "date": "2024-10-02T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 24,
          "date": "2024-10-09T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 25,
          "date": "2024-10-16T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 26,
          "date": "2024-10-23T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 27,
          "date": "2024-10-30T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 28,
          "date": "2024-11-06T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 29,
          "date": "2024-11-13T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 30,
          "date": "2024-11-20T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 31,
          "date": "2024-11-27T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 32,
          "date": "2024-12-04T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 33,
          "date": "2024-12-11T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 34,
          "date": "2024-12-18T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 35,
          "date": "2024-12-25T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 36,
          "date": "2025-01-01T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 37,
          "date": "2025-01-08T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 38,
          "date": "2025-01-15T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 39,
          "date": "2025-01-22T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 40,
          "date": "2025-01-29T00:00:00",
          "mark": "X"
        }
      ],
      "raw": {
        "row": 17,
        "wbs": null,
        "title": "MEP Plans",
        "owner": null,
        "start_date": "2024-05-01T00:00:00",
        "due_date": "2025-01-31T00:00:00",
        "duration_days": 275,
        "pct_complete": 0.9,
        "gantt_marks": [
          {
            "week_number": 1,
            "date": "2024-05-01T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 2,
            "date": "2024-05-08T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 3,
            "date": "2024-05-15T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 4,
            "date": "2024-05-22T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 5,
            "date": "2024-05-29T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 6,
            "date": "2024-06-05T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 7,
            "date": "2024-06-12T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 8,
            "date": "2024-06-19T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 9,
            "date": "2024-06-26T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 10,
            "date": "2024-07-03T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 11,
            "date": "2024-07-10T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 12,
            "date": "2024-07-17T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 13,
            "date": "2024-07-24T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 14,
            "date": "2024-07-31T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 15,
            "date": "2024-08-07T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 16,
            "date": "2024-08-14T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 17,
            "date": "2024-08-21T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 18,
            "date": "2024-08-28T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 19,
            "date": "2024-09-04T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 20,
            "date": "2024-09-11T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 21,
            "date": "2024-09-18T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 22,
            "date": "2024-09-25T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 23,
            "date": "2024-10-02T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 24,
            "date": "2024-10-09T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 25,
            "date": "2024-10-16T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 26,
            "date": "2024-10-23T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 27,
            "date": "2024-10-30T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 28,
            "date": "2024-11-06T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 29,
            "date": "2024-11-13T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 30,
            "date": "2024-11-20T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 31,
            "date": "2024-11-27T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 32,
            "date": "2024-12-04T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 33,
            "date": "2024-12-11T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 34,
            "date": "2024-12-18T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 35,
            "date": "2024-12-25T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 36,
            "date": "2025-01-01T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 37,
            "date": "2025-01-08T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 38,
            "date": "2025-01-15T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 39,
            "date": "2025-01-22T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 40,
            "date": "2025-01-29T00:00:00",
            "mark": "X"
          }
        ]
      }
    },
    {
      "id": "plan-row-18",
      "sourceRow": 18,
      "wbs": "R18",
      "name": "Plumbing Plans",
      "owner": "Design / filing team",
      "phase": "Permits & construction readiness",
      "days": 275,
      "start": "05/01/24",
      "end": "01/31/25",
      "startISO": "2024-05-01",
      "endISO": "2025-01-31",
      "startDisplay": "May 1, 2024",
      "endDisplay": "Jan 31, 2025",
      "pctComplete": 0.9,
      "pctLabel": "90%",
      "status": "In progress",
      "cls": "info",
      "bucket": "progress",
      "x": 24.3,
      "w": 33.41,
      "ganttWeeks": 40,
      "ganttMarks": [
        {
          "week_number": 1,
          "date": "2024-05-01T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 2,
          "date": "2024-05-08T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 3,
          "date": "2024-05-15T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 4,
          "date": "2024-05-22T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 5,
          "date": "2024-05-29T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 6,
          "date": "2024-06-05T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 7,
          "date": "2024-06-12T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 8,
          "date": "2024-06-19T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 9,
          "date": "2024-06-26T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 10,
          "date": "2024-07-03T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 11,
          "date": "2024-07-10T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 12,
          "date": "2024-07-17T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 13,
          "date": "2024-07-24T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 14,
          "date": "2024-07-31T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 15,
          "date": "2024-08-07T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 16,
          "date": "2024-08-14T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 17,
          "date": "2024-08-21T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 18,
          "date": "2024-08-28T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 19,
          "date": "2024-09-04T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 20,
          "date": "2024-09-11T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 21,
          "date": "2024-09-18T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 22,
          "date": "2024-09-25T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 23,
          "date": "2024-10-02T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 24,
          "date": "2024-10-09T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 25,
          "date": "2024-10-16T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 26,
          "date": "2024-10-23T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 27,
          "date": "2024-10-30T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 28,
          "date": "2024-11-06T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 29,
          "date": "2024-11-13T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 30,
          "date": "2024-11-20T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 31,
          "date": "2024-11-27T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 32,
          "date": "2024-12-04T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 33,
          "date": "2024-12-11T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 34,
          "date": "2024-12-18T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 35,
          "date": "2024-12-25T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 36,
          "date": "2025-01-01T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 37,
          "date": "2025-01-08T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 38,
          "date": "2025-01-15T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 39,
          "date": "2025-01-22T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 40,
          "date": "2025-01-29T00:00:00",
          "mark": "X"
        }
      ],
      "raw": {
        "row": 18,
        "wbs": null,
        "title": "Plumbing Plans",
        "owner": null,
        "start_date": "2024-05-01T00:00:00",
        "due_date": "2025-01-31T00:00:00",
        "duration_days": 275,
        "pct_complete": 0.9,
        "gantt_marks": [
          {
            "week_number": 1,
            "date": "2024-05-01T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 2,
            "date": "2024-05-08T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 3,
            "date": "2024-05-15T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 4,
            "date": "2024-05-22T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 5,
            "date": "2024-05-29T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 6,
            "date": "2024-06-05T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 7,
            "date": "2024-06-12T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 8,
            "date": "2024-06-19T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 9,
            "date": "2024-06-26T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 10,
            "date": "2024-07-03T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 11,
            "date": "2024-07-10T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 12,
            "date": "2024-07-17T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 13,
            "date": "2024-07-24T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 14,
            "date": "2024-07-31T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 15,
            "date": "2024-08-07T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 16,
            "date": "2024-08-14T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 17,
            "date": "2024-08-21T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 18,
            "date": "2024-08-28T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 19,
            "date": "2024-09-04T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 20,
            "date": "2024-09-11T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 21,
            "date": "2024-09-18T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 22,
            "date": "2024-09-25T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 23,
            "date": "2024-10-02T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 24,
            "date": "2024-10-09T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 25,
            "date": "2024-10-16T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 26,
            "date": "2024-10-23T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 27,
            "date": "2024-10-30T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 28,
            "date": "2024-11-06T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 29,
            "date": "2024-11-13T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 30,
            "date": "2024-11-20T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 31,
            "date": "2024-11-27T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 32,
            "date": "2024-12-04T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 33,
            "date": "2024-12-11T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 34,
            "date": "2024-12-18T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 35,
            "date": "2024-12-25T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 36,
            "date": "2025-01-01T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 37,
            "date": "2025-01-08T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 38,
            "date": "2025-01-15T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 39,
            "date": "2025-01-22T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 40,
            "date": "2025-01-29T00:00:00",
            "mark": "X"
          }
        ]
      }
    },
    {
      "id": "plan-row-19",
      "sourceRow": 19,
      "wbs": "R19",
      "name": "SD1 and SD2",
      "owner": "Design / filing team",
      "phase": "Permits & construction readiness",
      "days": 275,
      "start": "05/01/24",
      "end": "01/31/25",
      "startISO": "2024-05-01",
      "endISO": "2025-01-31",
      "startDisplay": "May 1, 2024",
      "endDisplay": "Jan 31, 2025",
      "pctComplete": 0.9,
      "pctLabel": "90%",
      "status": "In progress",
      "cls": "info",
      "bucket": "progress",
      "x": 24.3,
      "w": 33.41,
      "ganttWeeks": 40,
      "ganttMarks": [
        {
          "week_number": 1,
          "date": "2024-05-01T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 2,
          "date": "2024-05-08T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 3,
          "date": "2024-05-15T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 4,
          "date": "2024-05-22T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 5,
          "date": "2024-05-29T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 6,
          "date": "2024-06-05T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 7,
          "date": "2024-06-12T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 8,
          "date": "2024-06-19T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 9,
          "date": "2024-06-26T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 10,
          "date": "2024-07-03T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 11,
          "date": "2024-07-10T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 12,
          "date": "2024-07-17T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 13,
          "date": "2024-07-24T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 14,
          "date": "2024-07-31T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 15,
          "date": "2024-08-07T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 16,
          "date": "2024-08-14T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 17,
          "date": "2024-08-21T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 18,
          "date": "2024-08-28T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 19,
          "date": "2024-09-04T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 20,
          "date": "2024-09-11T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 21,
          "date": "2024-09-18T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 22,
          "date": "2024-09-25T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 23,
          "date": "2024-10-02T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 24,
          "date": "2024-10-09T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 25,
          "date": "2024-10-16T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 26,
          "date": "2024-10-23T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 27,
          "date": "2024-10-30T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 28,
          "date": "2024-11-06T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 29,
          "date": "2024-11-13T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 30,
          "date": "2024-11-20T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 31,
          "date": "2024-11-27T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 32,
          "date": "2024-12-04T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 33,
          "date": "2024-12-11T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 34,
          "date": "2024-12-18T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 35,
          "date": "2024-12-25T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 36,
          "date": "2025-01-01T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 37,
          "date": "2025-01-08T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 38,
          "date": "2025-01-15T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 39,
          "date": "2025-01-22T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 40,
          "date": "2025-01-29T00:00:00",
          "mark": "X"
        }
      ],
      "raw": {
        "row": 19,
        "wbs": null,
        "title": "SD1 and SD2",
        "owner": null,
        "start_date": "2024-05-01T00:00:00",
        "due_date": "2025-01-31T00:00:00",
        "duration_days": 275,
        "pct_complete": 0.9,
        "gantt_marks": [
          {
            "week_number": 1,
            "date": "2024-05-01T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 2,
            "date": "2024-05-08T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 3,
            "date": "2024-05-15T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 4,
            "date": "2024-05-22T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 5,
            "date": "2024-05-29T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 6,
            "date": "2024-06-05T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 7,
            "date": "2024-06-12T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 8,
            "date": "2024-06-19T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 9,
            "date": "2024-06-26T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 10,
            "date": "2024-07-03T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 11,
            "date": "2024-07-10T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 12,
            "date": "2024-07-17T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 13,
            "date": "2024-07-24T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 14,
            "date": "2024-07-31T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 15,
            "date": "2024-08-07T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 16,
            "date": "2024-08-14T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 17,
            "date": "2024-08-21T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 18,
            "date": "2024-08-28T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 19,
            "date": "2024-09-04T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 20,
            "date": "2024-09-11T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 21,
            "date": "2024-09-18T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 22,
            "date": "2024-09-25T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 23,
            "date": "2024-10-02T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 24,
            "date": "2024-10-09T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 25,
            "date": "2024-10-16T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 26,
            "date": "2024-10-23T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 27,
            "date": "2024-10-30T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 28,
            "date": "2024-11-06T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 29,
            "date": "2024-11-13T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 30,
            "date": "2024-11-20T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 31,
            "date": "2024-11-27T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 32,
            "date": "2024-12-04T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 33,
            "date": "2024-12-11T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 34,
            "date": "2024-12-18T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 35,
            "date": "2024-12-25T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 36,
            "date": "2025-01-01T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 37,
            "date": "2025-01-08T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 38,
            "date": "2025-01-15T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 39,
            "date": "2025-01-22T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 40,
            "date": "2025-01-29T00:00:00",
            "mark": "X"
          }
        ]
      }
    },
    {
      "id": "plan-row-20",
      "sourceRow": 20,
      "wbs": "6",
      "name": "Soil Borings",
      "owner": "Consultants",
      "phase": "Permits & construction readiness",
      "days": 28,
      "start": "06/15/24",
      "end": "07/13/24",
      "startISO": "2024-06-15",
      "endISO": "2024-07-13",
      "startDisplay": "Jun 15, 2024",
      "endDisplay": "Jul 13, 2024",
      "pctComplete": 1,
      "pctLabel": "100%",
      "status": "Done",
      "cls": "pos",
      "bucket": "done",
      "x": 29.77,
      "w": 3.4,
      "ganttWeeks": 4,
      "ganttMarks": [
        {
          "week_number": 8,
          "date": "2024-06-19T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 9,
          "date": "2024-06-26T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 10,
          "date": "2024-07-03T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 11,
          "date": "2024-07-10T00:00:00",
          "mark": "X"
        }
      ],
      "raw": {
        "row": 20,
        "wbs": "6",
        "title": "Soil Borings",
        "owner": null,
        "start_date": "2024-06-15T00:00:00",
        "due_date": "2024-07-13T00:00:00",
        "duration_days": 28,
        "pct_complete": 1,
        "gantt_marks": [
          {
            "week_number": 8,
            "date": "2024-06-19T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 9,
            "date": "2024-06-26T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 10,
            "date": "2024-07-03T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 11,
            "date": "2024-07-10T00:00:00",
            "mark": "X"
          }
        ]
      }
    },
    {
      "id": "plan-row-21",
      "sourceRow": 21,
      "wbs": "7",
      "name": "Demolition Plans",
      "owner": "Design / filing team",
      "phase": "Permits & construction readiness",
      "days": 0,
      "start": "01/22/24",
      "end": "01/22/24",
      "startISO": "2024-01-22",
      "endISO": "2024-01-22",
      "startDisplay": "Jan 22, 2024",
      "endDisplay": "Jan 22, 2024",
      "pctComplete": 1,
      "pctLabel": "100%",
      "status": "Done",
      "cls": "pos",
      "bucket": "done",
      "x": 12.15,
      "w": 1.2,
      "ganttWeeks": 0,
      "ganttMarks": [],
      "raw": {
        "row": 21,
        "wbs": "7",
        "title": "Demolition Plans",
        "owner": null,
        "start_date": "2024-01-22T00:00:00",
        "due_date": "2024-01-22T00:00:00",
        "duration_days": 0,
        "pct_complete": 1,
        "gantt_marks": []
      }
    },
    {
      "id": "plan-row-22",
      "sourceRow": 22,
      "wbs": "8",
      "name": "Aquisition Financing",
      "owner": "Ownership / finance",
      "phase": "Permits & construction readiness",
      "days": 0,
      "start": "01/22/24",
      "end": "01/22/24",
      "startISO": "2024-01-22",
      "endISO": "2024-01-22",
      "startDisplay": "Jan 22, 2024",
      "endDisplay": "Jan 22, 2024",
      "pctComplete": 1,
      "pctLabel": "100%",
      "status": "Done",
      "cls": "pos",
      "bucket": "done",
      "x": 12.15,
      "w": 1.2,
      "ganttWeeks": 0,
      "ganttMarks": [],
      "raw": {
        "row": 22,
        "wbs": "8",
        "title": "Aquisition Financing",
        "owner": null,
        "start_date": "2024-01-22T00:00:00",
        "due_date": "2024-01-22T00:00:00",
        "duration_days": 0,
        "pct_complete": 1,
        "gantt_marks": []
      }
    },
    {
      "id": "plan-row-23",
      "sourceRow": 23,
      "wbs": "9",
      "name": "Secure Equity",
      "owner": "Ownership / finance",
      "phase": "Permits & construction readiness",
      "days": 0,
      "start": "05/01/24",
      "end": "05/01/24",
      "startISO": "2024-05-01",
      "endISO": "2024-05-01",
      "startDisplay": "May 1, 2024",
      "endDisplay": "May 1, 2024",
      "pctComplete": 1,
      "pctLabel": "100%",
      "status": "Done",
      "cls": "pos",
      "bucket": "done",
      "x": 24.3,
      "w": 1.2,
      "ganttWeeks": 1,
      "ganttMarks": [
        {
          "week_number": 1,
          "date": "2024-05-01T00:00:00",
          "mark": "X"
        }
      ],
      "raw": {
        "row": 23,
        "wbs": "9",
        "title": "Secure Equity",
        "owner": null,
        "start_date": "2024-05-01T00:00:00",
        "due_date": "2024-05-01T00:00:00",
        "duration_days": 0,
        "pct_complete": 1,
        "gantt_marks": [
          {
            "week_number": 1,
            "date": "2024-05-01T00:00:00",
            "mark": "X"
          }
        ]
      }
    },
    {
      "id": "plan-row-24",
      "sourceRow": 24,
      "wbs": "10",
      "name": "Construction Loan",
      "owner": "Ownership / finance",
      "phase": "Sitework and structure",
      "days": 60,
      "start": "09/18/24",
      "end": "11/17/24",
      "startISO": "2024-09-18",
      "endISO": "2024-11-17",
      "startDisplay": "Sep 18, 2024",
      "endDisplay": "Nov 17, 2024",
      "pctComplete": 0,
      "pctLabel": "0%",
      "status": "Open",
      "cls": "neutral",
      "bucket": "backlog",
      "x": 41.31,
      "w": 7.29,
      "ganttWeeks": 9,
      "ganttMarks": [
        {
          "week_number": 21,
          "date": "2024-09-18T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 22,
          "date": "2024-09-25T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 23,
          "date": "2024-10-02T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 24,
          "date": "2024-10-09T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 25,
          "date": "2024-10-16T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 26,
          "date": "2024-10-23T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 27,
          "date": "2024-10-30T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 28,
          "date": "2024-11-06T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 29,
          "date": "2024-11-13T00:00:00",
          "mark": "X"
        }
      ],
      "raw": {
        "row": 24,
        "wbs": "10",
        "title": "Construction Loan",
        "owner": null,
        "start_date": "2024-09-18T00:00:00",
        "due_date": "2024-11-17T00:00:00",
        "duration_days": 60,
        "pct_complete": 0,
        "gantt_marks": [
          {
            "week_number": 21,
            "date": "2024-09-18T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 22,
            "date": "2024-09-25T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 23,
            "date": "2024-10-02T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 24,
            "date": "2024-10-09T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 25,
            "date": "2024-10-16T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 26,
            "date": "2024-10-23T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 27,
            "date": "2024-10-30T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 28,
            "date": "2024-11-06T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 29,
            "date": "2024-11-13T00:00:00",
            "mark": "X"
          }
        ]
      }
    },
    {
      "id": "plan-row-25",
      "sourceRow": 25,
      "wbs": "11",
      "name": "DOB Approvals",
      "owner": "Design / filing team",
      "phase": "Sitework and structure",
      "days": 1,
      "start": "09/28/24",
      "end": "09/29/24",
      "startISO": "2024-09-28",
      "endISO": "2024-09-29",
      "startDisplay": "Sep 28, 2024",
      "endDisplay": "Sep 29, 2024",
      "pctComplete": 0,
      "pctLabel": "0%",
      "status": "Open",
      "cls": "neutral",
      "bucket": "backlog",
      "x": 42.53,
      "w": 1.2,
      "ganttWeeks": 0,
      "ganttMarks": [],
      "raw": {
        "row": 25,
        "wbs": "11",
        "title": "DOB Approvals",
        "owner": null,
        "start_date": "2024-09-28T00:00:00",
        "due_date": "2024-09-29T00:00:00",
        "duration_days": 1,
        "pct_complete": 0,
        "gantt_marks": []
      }
    },
    {
      "id": "plan-row-26",
      "sourceRow": 26,
      "wbs": "R26",
      "name": "Architectural Plans",
      "owner": "Design / filing team",
      "phase": "Sitework and structure",
      "days": null,
      "start": "\u2014",
      "end": "\u2014",
      "startISO": null,
      "endISO": null,
      "startDisplay": "Not set",
      "endDisplay": "Not set",
      "pctComplete": null,
      "pctLabel": "\u2014",
      "status": "Unscheduled",
      "cls": "neutral",
      "bucket": "unscheduled",
      "x": 0,
      "w": 1.2,
      "ganttWeeks": 0,
      "ganttMarks": [],
      "raw": {
        "row": 26,
        "wbs": null,
        "title": "Architectural Plans",
        "owner": null,
        "start_date": null,
        "due_date": null,
        "duration_days": null,
        "pct_complete": null,
        "gantt_marks": []
      }
    },
    {
      "id": "plan-row-27",
      "sourceRow": 27,
      "wbs": "R27",
      "name": "Structural Plans",
      "owner": "Design / filing team",
      "phase": "Sitework and structure",
      "days": null,
      "start": "\u2014",
      "end": "\u2014",
      "startISO": null,
      "endISO": null,
      "startDisplay": "Not set",
      "endDisplay": "Not set",
      "pctComplete": null,
      "pctLabel": "\u2014",
      "status": "Unscheduled",
      "cls": "neutral",
      "bucket": "unscheduled",
      "x": 0,
      "w": 1.2,
      "ganttWeeks": 0,
      "ganttMarks": [],
      "raw": {
        "row": 27,
        "wbs": null,
        "title": "Structural Plans",
        "owner": null,
        "start_date": null,
        "due_date": null,
        "duration_days": null,
        "pct_complete": null,
        "gantt_marks": []
      }
    },
    {
      "id": "plan-row-28",
      "sourceRow": 28,
      "wbs": "R28",
      "name": "SD1 and SD2",
      "owner": "Design / filing team",
      "phase": "Sitework and structure",
      "days": null,
      "start": "\u2014",
      "end": "\u2014",
      "startISO": null,
      "endISO": null,
      "startDisplay": "Not set",
      "endDisplay": "Not set",
      "pctComplete": null,
      "pctLabel": "\u2014",
      "status": "Unscheduled",
      "cls": "neutral",
      "bucket": "unscheduled",
      "x": 0,
      "w": 1.2,
      "ganttWeeks": 0,
      "ganttMarks": [],
      "raw": {
        "row": 28,
        "wbs": null,
        "title": "SD1 and SD2",
        "owner": null,
        "start_date": null,
        "due_date": null,
        "duration_days": null,
        "pct_complete": null,
        "gantt_marks": []
      }
    },
    {
      "id": "plan-row-29",
      "sourceRow": 29,
      "wbs": "R29",
      "name": "Fire Protection Plans",
      "owner": "Design / filing team",
      "phase": "Sitework and structure",
      "days": null,
      "start": "\u2014",
      "end": "\u2014",
      "startISO": null,
      "endISO": null,
      "startDisplay": "Not set",
      "endDisplay": "Not set",
      "pctComplete": null,
      "pctLabel": "\u2014",
      "status": "Unscheduled",
      "cls": "neutral",
      "bucket": "unscheduled",
      "x": 0,
      "w": 1.2,
      "ganttWeeks": 0,
      "ganttMarks": [],
      "raw": {
        "row": 29,
        "wbs": null,
        "title": "Fire Protection Plans",
        "owner": null,
        "start_date": null,
        "due_date": null,
        "duration_days": null,
        "pct_complete": null,
        "gantt_marks": []
      }
    },
    {
      "id": "plan-row-30",
      "sourceRow": 30,
      "wbs": "R30",
      "name": "DOB Permits (BIN: 3811217)",
      "owner": "Design / filing team",
      "phase": "Sitework and structure",
      "days": null,
      "start": "\u2014",
      "end": "\u2014",
      "startISO": null,
      "endISO": null,
      "startDisplay": "Not set",
      "endDisplay": "Not set",
      "pctComplete": null,
      "pctLabel": "\u2014",
      "status": "Unscheduled",
      "cls": "neutral",
      "bucket": "unscheduled",
      "x": 0,
      "w": 1.2,
      "ganttWeeks": 0,
      "ganttMarks": [],
      "raw": {
        "row": 30,
        "wbs": null,
        "title": "DOB Permits (BIN: 3811217)",
        "owner": null,
        "start_date": null,
        "due_date": null,
        "duration_days": null,
        "pct_complete": null,
        "gantt_marks": []
      }
    },
    {
      "id": "plan-row-31",
      "sourceRow": 31,
      "wbs": "R31",
      "name": "Fence Permit",
      "owner": "Renovation Group",
      "phase": "Sitework and structure",
      "days": null,
      "start": "\u2014",
      "end": "\u2014",
      "startISO": null,
      "endISO": null,
      "startDisplay": "Not set",
      "endDisplay": "Not set",
      "pctComplete": null,
      "pctLabel": "\u2014",
      "status": "Unscheduled",
      "cls": "neutral",
      "bucket": "unscheduled",
      "x": 0,
      "w": 1.2,
      "ganttWeeks": 0,
      "ganttMarks": [],
      "raw": {
        "row": 31,
        "wbs": null,
        "title": "Fence Permit",
        "owner": null,
        "start_date": null,
        "due_date": null,
        "duration_days": null,
        "pct_complete": null,
        "gantt_marks": []
      }
    },
    {
      "id": "plan-row-32",
      "sourceRow": 32,
      "wbs": "R32",
      "name": "Demolition Permit",
      "owner": "Renovation Group",
      "phase": "Sitework and structure",
      "days": null,
      "start": "\u2014",
      "end": "\u2014",
      "startISO": null,
      "endISO": null,
      "startDisplay": "Not set",
      "endDisplay": "Not set",
      "pctComplete": null,
      "pctLabel": "\u2014",
      "status": "Unscheduled",
      "cls": "neutral",
      "bucket": "unscheduled",
      "x": 0,
      "w": 1.2,
      "ganttWeeks": 0,
      "ganttMarks": [],
      "raw": {
        "row": 32,
        "wbs": null,
        "title": "Demolition Permit",
        "owner": null,
        "start_date": null,
        "due_date": null,
        "duration_days": null,
        "pct_complete": null,
        "gantt_marks": []
      }
    },
    {
      "id": "plan-row-33",
      "sourceRow": 33,
      "wbs": "R33",
      "name": "New Building Permit",
      "owner": "Renovation Group",
      "phase": "Sitework and structure",
      "days": null,
      "start": "\u2014",
      "end": "\u2014",
      "startISO": null,
      "endISO": null,
      "startDisplay": "Not set",
      "endDisplay": "Not set",
      "pctComplete": null,
      "pctLabel": "\u2014",
      "status": "Unscheduled",
      "cls": "neutral",
      "bucket": "unscheduled",
      "x": 0,
      "w": 1.2,
      "ganttWeeks": 0,
      "ganttMarks": [],
      "raw": {
        "row": 33,
        "wbs": null,
        "title": "New Building Permit",
        "owner": null,
        "start_date": null,
        "due_date": null,
        "duration_days": null,
        "pct_complete": null,
        "gantt_marks": []
      }
    },
    {
      "id": "plan-row-34",
      "sourceRow": 34,
      "wbs": "R34",
      "name": "Plumbing Permit",
      "owner": "Design / filing team",
      "phase": "Sitework and structure",
      "days": null,
      "start": "\u2014",
      "end": "\u2014",
      "startISO": null,
      "endISO": null,
      "startDisplay": "Not set",
      "endDisplay": "Not set",
      "pctComplete": null,
      "pctLabel": "\u2014",
      "status": "Unscheduled",
      "cls": "neutral",
      "bucket": "unscheduled",
      "x": 0,
      "w": 1.2,
      "ganttWeeks": 0,
      "ganttMarks": [],
      "raw": {
        "row": 34,
        "wbs": null,
        "title": "Plumbing Permit",
        "owner": null,
        "start_date": null,
        "due_date": null,
        "duration_days": null,
        "pct_complete": null,
        "gantt_marks": []
      }
    },
    {
      "id": "plan-row-35",
      "sourceRow": 35,
      "wbs": "R35",
      "name": "Electrical Permit",
      "owner": "Renovation Group",
      "phase": "Sitework and structure",
      "days": null,
      "start": "\u2014",
      "end": "\u2014",
      "startISO": null,
      "endISO": null,
      "startDisplay": "Not set",
      "endDisplay": "Not set",
      "pctComplete": null,
      "pctLabel": "\u2014",
      "status": "Unscheduled",
      "cls": "neutral",
      "bucket": "unscheduled",
      "x": 0,
      "w": 1.2,
      "ganttWeeks": 0,
      "ganttMarks": [],
      "raw": {
        "row": 35,
        "wbs": null,
        "title": "Electrical Permit",
        "owner": null,
        "start_date": null,
        "due_date": null,
        "duration_days": null,
        "pct_complete": null,
        "gantt_marks": []
      }
    },
    {
      "id": "plan-row-36",
      "sourceRow": 36,
      "wbs": "12",
      "name": "Access Agreements",
      "owner": "Renovation Group",
      "phase": "Sitework and structure",
      "days": 200,
      "start": "05/01/24",
      "end": "11/17/24",
      "startISO": "2024-05-01",
      "endISO": "2024-11-17",
      "startDisplay": "May 1, 2024",
      "endDisplay": "Nov 17, 2024",
      "pctComplete": 0,
      "pctLabel": "0%",
      "status": "Open",
      "cls": "neutral",
      "bucket": "backlog",
      "x": 24.3,
      "w": 24.3,
      "ganttWeeks": 29,
      "ganttMarks": [
        {
          "week_number": 1,
          "date": "2024-05-01T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 2,
          "date": "2024-05-08T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 3,
          "date": "2024-05-15T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 4,
          "date": "2024-05-22T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 5,
          "date": "2024-05-29T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 6,
          "date": "2024-06-05T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 7,
          "date": "2024-06-12T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 8,
          "date": "2024-06-19T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 9,
          "date": "2024-06-26T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 10,
          "date": "2024-07-03T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 11,
          "date": "2024-07-10T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 12,
          "date": "2024-07-17T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 13,
          "date": "2024-07-24T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 14,
          "date": "2024-07-31T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 15,
          "date": "2024-08-07T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 16,
          "date": "2024-08-14T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 17,
          "date": "2024-08-21T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 18,
          "date": "2024-08-28T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 19,
          "date": "2024-09-04T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 20,
          "date": "2024-09-11T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 21,
          "date": "2024-09-18T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 22,
          "date": "2024-09-25T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 23,
          "date": "2024-10-02T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 24,
          "date": "2024-10-09T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 25,
          "date": "2024-10-16T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 26,
          "date": "2024-10-23T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 27,
          "date": "2024-10-30T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 28,
          "date": "2024-11-06T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 29,
          "date": "2024-11-13T00:00:00",
          "mark": "X"
        }
      ],
      "raw": {
        "row": 36,
        "wbs": "12",
        "title": "Access Agreements",
        "owner": null,
        "start_date": "2024-05-01T00:00:00",
        "due_date": "2024-11-17T00:00:00",
        "duration_days": 200,
        "pct_complete": 0,
        "gantt_marks": [
          {
            "week_number": 1,
            "date": "2024-05-01T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 2,
            "date": "2024-05-08T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 3,
            "date": "2024-05-15T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 4,
            "date": "2024-05-22T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 5,
            "date": "2024-05-29T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 6,
            "date": "2024-06-05T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 7,
            "date": "2024-06-12T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 8,
            "date": "2024-06-19T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 9,
            "date": "2024-06-26T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 10,
            "date": "2024-07-03T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 11,
            "date": "2024-07-10T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 12,
            "date": "2024-07-17T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 13,
            "date": "2024-07-24T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 14,
            "date": "2024-07-31T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 15,
            "date": "2024-08-07T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 16,
            "date": "2024-08-14T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 17,
            "date": "2024-08-21T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 18,
            "date": "2024-08-28T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 19,
            "date": "2024-09-04T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 20,
            "date": "2024-09-11T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 21,
            "date": "2024-09-18T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 22,
            "date": "2024-09-25T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 23,
            "date": "2024-10-02T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 24,
            "date": "2024-10-09T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 25,
            "date": "2024-10-16T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 26,
            "date": "2024-10-23T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 27,
            "date": "2024-10-30T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 28,
            "date": "2024-11-06T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 29,
            "date": "2024-11-13T00:00:00",
            "mark": "X"
          }
        ]
      }
    },
    {
      "id": "plan-row-37",
      "sourceRow": 37,
      "wbs": "13",
      "name": "Project Definition and Planning",
      "owner": "Renovation Group",
      "phase": "Sitework and structure",
      "days": null,
      "start": "09/29/24",
      "end": "02/06/25",
      "startISO": "2024-09-29",
      "endISO": "2025-02-06",
      "startDisplay": "Sep 29, 2024",
      "endDisplay": "Feb 6, 2025",
      "pctComplete": null,
      "pctLabel": "\u2014",
      "status": "Open",
      "cls": "neutral",
      "bucket": "backlog",
      "x": 42.65,
      "w": 15.8,
      "ganttWeeks": 0,
      "ganttMarks": [],
      "raw": {
        "row": 37,
        "wbs": "13",
        "title": "Project Definition and Planning",
        "owner": null,
        "start_date": "2024-09-29T00:00:00",
        "due_date": "2025-02-06T00:00:00",
        "duration_days": null,
        "pct_complete": null,
        "gantt_marks": []
      }
    },
    {
      "id": "plan-row-38",
      "sourceRow": 38,
      "wbs": "14",
      "name": "Demolition",
      "owner": "Renovation Group",
      "phase": "Sitework and structure",
      "days": 0,
      "start": "11/17/24",
      "end": "11/17/24",
      "startISO": "2024-11-17",
      "endISO": "2024-11-17",
      "startDisplay": "Nov 17, 2024",
      "endDisplay": "Nov 17, 2024",
      "pctComplete": 1,
      "pctLabel": "100%",
      "status": "Done",
      "cls": "pos",
      "bucket": "done",
      "x": 48.6,
      "w": 1.2,
      "ganttWeeks": 0,
      "ganttMarks": [],
      "raw": {
        "row": 38,
        "wbs": "14",
        "title": "Demolition",
        "owner": null,
        "start_date": "2024-11-17T00:00:00",
        "due_date": "2024-11-17T00:00:00",
        "duration_days": 0,
        "pct_complete": 1,
        "gantt_marks": []
      }
    },
    {
      "id": "plan-row-39",
      "sourceRow": 39,
      "wbs": "15",
      "name": "Excavation / Shoring / Foundation",
      "owner": "Renovation Group",
      "phase": "Sitework and structure",
      "days": 70,
      "start": "09/29/24",
      "end": "12/08/24",
      "startISO": "2024-09-29",
      "endISO": "2024-12-08",
      "startDisplay": "Sep 29, 2024",
      "endDisplay": "Dec 8, 2024",
      "pctComplete": 0,
      "pctLabel": "0%",
      "status": "Open",
      "cls": "neutral",
      "bucket": "backlog",
      "x": 42.65,
      "w": 8.51,
      "ganttWeeks": 10,
      "ganttMarks": [
        {
          "week_number": 23,
          "date": "2024-10-02T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 24,
          "date": "2024-10-09T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 25,
          "date": "2024-10-16T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 26,
          "date": "2024-10-23T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 27,
          "date": "2024-10-30T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 28,
          "date": "2024-11-06T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 29,
          "date": "2024-11-13T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 30,
          "date": "2024-11-20T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 31,
          "date": "2024-11-27T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 32,
          "date": "2024-12-04T00:00:00",
          "mark": "X"
        }
      ],
      "raw": {
        "row": 39,
        "wbs": "15",
        "title": "Excavation / Shoring / Foundation",
        "owner": null,
        "start_date": "2024-09-29T00:00:00",
        "due_date": "2024-12-08T00:00:00",
        "duration_days": 70,
        "pct_complete": 0,
        "gantt_marks": [
          {
            "week_number": 23,
            "date": "2024-10-02T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 24,
            "date": "2024-10-09T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 25,
            "date": "2024-10-16T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 26,
            "date": "2024-10-23T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 27,
            "date": "2024-10-30T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 28,
            "date": "2024-11-06T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 29,
            "date": "2024-11-13T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 30,
            "date": "2024-11-20T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 31,
            "date": "2024-11-27T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 32,
            "date": "2024-12-04T00:00:00",
            "mark": "X"
          }
        ]
      }
    },
    {
      "id": "plan-row-40",
      "sourceRow": 40,
      "wbs": "16",
      "name": "Water Proofing & Concrete Insulation",
      "owner": "Renovation Group",
      "phase": "Envelope and MEP",
      "days": 30,
      "start": "09/29/24",
      "end": "10/29/24",
      "startISO": "2024-09-29",
      "endISO": "2024-10-29",
      "startDisplay": "Sep 29, 2024",
      "endDisplay": "Oct 29, 2024",
      "pctComplete": 0,
      "pctLabel": "0%",
      "status": "Open",
      "cls": "neutral",
      "bucket": "backlog",
      "x": 42.65,
      "w": 3.65,
      "ganttWeeks": 4,
      "ganttMarks": [
        {
          "week_number": 23,
          "date": "2024-10-02T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 24,
          "date": "2024-10-09T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 25,
          "date": "2024-10-16T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 26,
          "date": "2024-10-23T00:00:00",
          "mark": "X"
        }
      ],
      "raw": {
        "row": 40,
        "wbs": "16",
        "title": "Water Proofing & Concrete Insulation",
        "owner": null,
        "start_date": "2024-09-29T00:00:00",
        "due_date": "2024-10-29T00:00:00",
        "duration_days": 30,
        "pct_complete": 0,
        "gantt_marks": [
          {
            "week_number": 23,
            "date": "2024-10-02T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 24,
            "date": "2024-10-09T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 25,
            "date": "2024-10-16T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 26,
            "date": "2024-10-23T00:00:00",
            "mark": "X"
          }
        ]
      }
    },
    {
      "id": "plan-row-41",
      "sourceRow": 41,
      "wbs": "17",
      "name": "Super Structure",
      "owner": "Renovation Group",
      "phase": "Envelope and MEP",
      "days": 60,
      "start": "12/08/24",
      "end": "02/06/25",
      "startISO": "2024-12-08",
      "endISO": "2025-02-06",
      "startDisplay": "Dec 8, 2024",
      "endDisplay": "Feb 6, 2025",
      "pctComplete": 0,
      "pctLabel": "0%",
      "status": "Open",
      "cls": "neutral",
      "bucket": "backlog",
      "x": 51.15,
      "w": 7.29,
      "ganttWeeks": 9,
      "ganttMarks": [
        {
          "week_number": 33,
          "date": "2024-12-11T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 34,
          "date": "2024-12-18T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 35,
          "date": "2024-12-25T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 36,
          "date": "2025-01-01T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 37,
          "date": "2025-01-08T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 38,
          "date": "2025-01-15T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 39,
          "date": "2025-01-22T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 40,
          "date": "2025-01-29T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 41,
          "date": "2025-02-05T00:00:00",
          "mark": "X"
        }
      ],
      "raw": {
        "row": 41,
        "wbs": "17",
        "title": "Super Structure",
        "owner": null,
        "start_date": "2024-12-08T00:00:00",
        "due_date": "2025-02-06T00:00:00",
        "duration_days": 60,
        "pct_complete": 0,
        "gantt_marks": [
          {
            "week_number": 33,
            "date": "2024-12-11T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 34,
            "date": "2024-12-18T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 35,
            "date": "2024-12-25T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 36,
            "date": "2025-01-01T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 37,
            "date": "2025-01-08T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 38,
            "date": "2025-01-15T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 39,
            "date": "2025-01-22T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 40,
            "date": "2025-01-29T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 41,
            "date": "2025-02-05T00:00:00",
            "mark": "X"
          }
        ]
      }
    },
    {
      "id": "plan-row-42",
      "sourceRow": 42,
      "wbs": "18",
      "name": "CMU",
      "owner": "Renovation Group",
      "phase": "Envelope and MEP",
      "days": 90,
      "start": "12/29/24",
      "end": "03/29/25",
      "startISO": "2024-12-29",
      "endISO": "2025-03-29",
      "startDisplay": "Dec 29, 2024",
      "endDisplay": "Mar 29, 2025",
      "pctComplete": 0,
      "pctLabel": "0%",
      "status": "Open",
      "cls": "neutral",
      "bucket": "backlog",
      "x": 53.71,
      "w": 10.94,
      "ganttWeeks": 13,
      "ganttMarks": [
        {
          "week_number": 36,
          "date": "2025-01-01T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 37,
          "date": "2025-01-08T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 38,
          "date": "2025-01-15T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 39,
          "date": "2025-01-22T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 40,
          "date": "2025-01-29T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 41,
          "date": "2025-02-05T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 42,
          "date": "2025-02-12T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 43,
          "date": "2025-02-19T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 44,
          "date": "2025-02-26T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 45,
          "date": "2025-03-05T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 46,
          "date": "2025-03-12T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 47,
          "date": "2025-03-19T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 48,
          "date": "2025-03-26T00:00:00",
          "mark": "X"
        }
      ],
      "raw": {
        "row": 42,
        "wbs": "18",
        "title": "CMU",
        "owner": null,
        "start_date": "2024-12-29T00:00:00",
        "due_date": "2025-03-29T00:00:00",
        "duration_days": 90,
        "pct_complete": 0,
        "gantt_marks": [
          {
            "week_number": 36,
            "date": "2025-01-01T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 37,
            "date": "2025-01-08T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 38,
            "date": "2025-01-15T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 39,
            "date": "2025-01-22T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 40,
            "date": "2025-01-29T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 41,
            "date": "2025-02-05T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 42,
            "date": "2025-02-12T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 43,
            "date": "2025-02-19T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 44,
            "date": "2025-02-26T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 45,
            "date": "2025-03-05T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 46,
            "date": "2025-03-12T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 47,
            "date": "2025-03-19T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 48,
            "date": "2025-03-26T00:00:00",
            "mark": "X"
          }
        ]
      }
    },
    {
      "id": "plan-row-43",
      "sourceRow": 43,
      "wbs": "19",
      "name": "Elevator",
      "owner": "Renovation Group",
      "phase": "Envelope and MEP",
      "days": 150,
      "start": "04/28/25",
      "end": "09/25/25",
      "startISO": "2025-04-28",
      "endISO": "2025-09-25",
      "startDisplay": "Apr 28, 2025",
      "endDisplay": "Sep 25, 2025",
      "pctComplete": 0,
      "pctLabel": "0%",
      "status": "Open",
      "cls": "neutral",
      "bucket": "backlog",
      "x": 68.29,
      "w": 18.23,
      "ganttWeeks": 22,
      "ganttMarks": [
        {
          "week_number": 53,
          "date": "2025-04-30T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 54,
          "date": "2025-05-07T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 55,
          "date": "2025-05-14T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 56,
          "date": "2025-05-21T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 57,
          "date": "2025-05-28T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 58,
          "date": "2025-06-04T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 59,
          "date": "2025-06-11T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 60,
          "date": "2025-06-18T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 61,
          "date": "2025-06-25T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 62,
          "date": "2025-07-02T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 63,
          "date": "2025-07-09T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 64,
          "date": "2025-07-16T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 65,
          "date": "2025-07-23T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 66,
          "date": "2025-07-30T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 67,
          "date": "2025-08-06T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 68,
          "date": "2025-08-13T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 69,
          "date": "2025-08-20T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 70,
          "date": "2025-08-27T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 71,
          "date": "2025-09-03T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 72,
          "date": "2025-09-10T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 73,
          "date": "2025-09-17T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 74,
          "date": "2025-09-24T00:00:00",
          "mark": "X"
        }
      ],
      "raw": {
        "row": 43,
        "wbs": "19",
        "title": "Elevator",
        "owner": null,
        "start_date": "2025-04-28T00:00:00",
        "due_date": "2025-09-25T00:00:00",
        "duration_days": 150,
        "pct_complete": 0,
        "gantt_marks": [
          {
            "week_number": 53,
            "date": "2025-04-30T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 54,
            "date": "2025-05-07T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 55,
            "date": "2025-05-14T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 56,
            "date": "2025-05-21T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 57,
            "date": "2025-05-28T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 58,
            "date": "2025-06-04T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 59,
            "date": "2025-06-11T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 60,
            "date": "2025-06-18T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 61,
            "date": "2025-06-25T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 62,
            "date": "2025-07-02T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 63,
            "date": "2025-07-09T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 64,
            "date": "2025-07-16T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 65,
            "date": "2025-07-23T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 66,
            "date": "2025-07-30T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 67,
            "date": "2025-08-06T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 68,
            "date": "2025-08-13T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 69,
            "date": "2025-08-20T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 70,
            "date": "2025-08-27T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 71,
            "date": "2025-09-03T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 72,
            "date": "2025-09-10T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 73,
            "date": "2025-09-17T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 74,
            "date": "2025-09-24T00:00:00",
            "mark": "X"
          }
        ]
      }
    },
    {
      "id": "plan-row-44",
      "sourceRow": 44,
      "wbs": "20",
      "name": "Exterior Framing",
      "owner": "Renovation Group",
      "phase": "Envelope and MEP",
      "days": 75,
      "start": "01/07/25",
      "end": "03/23/25",
      "startISO": "2025-01-07",
      "endISO": "2025-03-23",
      "startDisplay": "Jan 7, 2025",
      "endDisplay": "Mar 23, 2025",
      "pctComplete": 0,
      "pctLabel": "0%",
      "status": "Open",
      "cls": "neutral",
      "bucket": "backlog",
      "x": 54.8,
      "w": 9.11,
      "ganttWeeks": 11,
      "ganttMarks": [
        {
          "week_number": 37,
          "date": "2025-01-08T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 38,
          "date": "2025-01-15T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 39,
          "date": "2025-01-22T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 40,
          "date": "2025-01-29T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 41,
          "date": "2025-02-05T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 42,
          "date": "2025-02-12T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 43,
          "date": "2025-02-19T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 44,
          "date": "2025-02-26T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 45,
          "date": "2025-03-05T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 46,
          "date": "2025-03-12T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 47,
          "date": "2025-03-19T00:00:00",
          "mark": "X"
        }
      ],
      "raw": {
        "row": 44,
        "wbs": "20",
        "title": "Exterior Framing",
        "owner": null,
        "start_date": "2025-01-07T00:00:00",
        "due_date": "2025-03-23T00:00:00",
        "duration_days": 75,
        "pct_complete": 0,
        "gantt_marks": [
          {
            "week_number": 37,
            "date": "2025-01-08T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 38,
            "date": "2025-01-15T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 39,
            "date": "2025-01-22T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 40,
            "date": "2025-01-29T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 41,
            "date": "2025-02-05T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 42,
            "date": "2025-02-12T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 43,
            "date": "2025-02-19T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 44,
            "date": "2025-02-26T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 45,
            "date": "2025-03-05T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 46,
            "date": "2025-03-12T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 47,
            "date": "2025-03-19T00:00:00",
            "mark": "X"
          }
        ]
      }
    },
    {
      "id": "plan-row-45",
      "sourceRow": 45,
      "wbs": "21",
      "name": "Water Proofing Facade",
      "owner": "Renovation Group",
      "phase": "Envelope and MEP",
      "days": 14,
      "start": "03/23/25",
      "end": "04/06/25",
      "startISO": "2025-03-23",
      "endISO": "2025-04-06",
      "startDisplay": "Mar 23, 2025",
      "endDisplay": "Apr 6, 2025",
      "pctComplete": 0,
      "pctLabel": "0%",
      "status": "Open",
      "cls": "neutral",
      "bucket": "backlog",
      "x": 63.91,
      "w": 1.7,
      "ganttWeeks": 2,
      "ganttMarks": [
        {
          "week_number": 48,
          "date": "2025-03-26T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 49,
          "date": "2025-04-02T00:00:00",
          "mark": "X"
        }
      ],
      "raw": {
        "row": 45,
        "wbs": "21",
        "title": "Water Proofing Facade",
        "owner": null,
        "start_date": "2025-03-23T00:00:00",
        "due_date": "2025-04-06T00:00:00",
        "duration_days": 14,
        "pct_complete": 0,
        "gantt_marks": [
          {
            "week_number": 48,
            "date": "2025-03-26T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 49,
            "date": "2025-04-02T00:00:00",
            "mark": "X"
          }
        ]
      }
    },
    {
      "id": "plan-row-46",
      "sourceRow": 46,
      "wbs": "22",
      "name": "Installation Exterior Doors / Windows",
      "owner": "Renovation Group",
      "phase": "Envelope and MEP",
      "days": 14,
      "start": "04/06/25",
      "end": "04/20/25",
      "startISO": "2025-04-06",
      "endISO": "2025-04-20",
      "startDisplay": "Apr 6, 2025",
      "endDisplay": "Apr 20, 2025",
      "pctComplete": 0,
      "pctLabel": "0%",
      "status": "Open",
      "cls": "neutral",
      "bucket": "backlog",
      "x": 65.61,
      "w": 1.7,
      "ganttWeeks": 2,
      "ganttMarks": [
        {
          "week_number": 50,
          "date": "2025-04-09T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 51,
          "date": "2025-04-16T00:00:00",
          "mark": "X"
        }
      ],
      "raw": {
        "row": 46,
        "wbs": "22",
        "title": "Installation Exterior Doors / Windows",
        "owner": null,
        "start_date": "2025-04-06T00:00:00",
        "due_date": "2025-04-20T00:00:00",
        "duration_days": 14,
        "pct_complete": 0,
        "gantt_marks": [
          {
            "week_number": 50,
            "date": "2025-04-09T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 51,
            "date": "2025-04-16T00:00:00",
            "mark": "X"
          }
        ]
      }
    },
    {
      "id": "plan-row-47",
      "sourceRow": 47,
      "wbs": "23",
      "name": "Masonry Work Brick",
      "owner": "Renovation Group",
      "phase": "Envelope and MEP",
      "days": 90,
      "start": "04/20/25",
      "end": "07/19/25",
      "startISO": "2025-04-20",
      "endISO": "2025-07-19",
      "startDisplay": "Apr 20, 2025",
      "endDisplay": "Jul 19, 2025",
      "pctComplete": 0,
      "pctLabel": "0%",
      "status": "Open",
      "cls": "neutral",
      "bucket": "backlog",
      "x": 67.31,
      "w": 10.94,
      "ganttWeeks": 13,
      "ganttMarks": [
        {
          "week_number": 52,
          "date": "2025-04-23T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 53,
          "date": "2025-04-30T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 54,
          "date": "2025-05-07T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 55,
          "date": "2025-05-14T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 56,
          "date": "2025-05-21T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 57,
          "date": "2025-05-28T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 58,
          "date": "2025-06-04T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 59,
          "date": "2025-06-11T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 60,
          "date": "2025-06-18T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 61,
          "date": "2025-06-25T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 62,
          "date": "2025-07-02T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 63,
          "date": "2025-07-09T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 64,
          "date": "2025-07-16T00:00:00",
          "mark": "X"
        }
      ],
      "raw": {
        "row": 47,
        "wbs": "23",
        "title": "Masonry Work Brick",
        "owner": null,
        "start_date": "2025-04-20T00:00:00",
        "due_date": "2025-07-19T00:00:00",
        "duration_days": 90,
        "pct_complete": 0,
        "gantt_marks": [
          {
            "week_number": 52,
            "date": "2025-04-23T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 53,
            "date": "2025-04-30T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 54,
            "date": "2025-05-07T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 55,
            "date": "2025-05-14T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 56,
            "date": "2025-05-21T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 57,
            "date": "2025-05-28T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 58,
            "date": "2025-06-04T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 59,
            "date": "2025-06-11T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 60,
            "date": "2025-06-18T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 61,
            "date": "2025-06-25T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 62,
            "date": "2025-07-02T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 63,
            "date": "2025-07-09T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 64,
            "date": "2025-07-16T00:00:00",
            "mark": "X"
          }
        ]
      }
    },
    {
      "id": "plan-row-48",
      "sourceRow": 48,
      "wbs": "24",
      "name": "Roofing",
      "owner": "Renovation Group",
      "phase": "Envelope and MEP",
      "days": 120,
      "start": "07/19/25",
      "end": "11/16/25",
      "startISO": "2025-07-19",
      "endISO": "2025-11-16",
      "startDisplay": "Jul 19, 2025",
      "endDisplay": "Nov 16, 2025",
      "pctComplete": 0,
      "pctLabel": "0%",
      "status": "Open",
      "cls": "neutral",
      "bucket": "backlog",
      "x": 78.25,
      "w": 14.58,
      "ganttWeeks": 17,
      "ganttMarks": [
        {
          "week_number": 65,
          "date": "2025-07-23T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 66,
          "date": "2025-07-30T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 67,
          "date": "2025-08-06T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 68,
          "date": "2025-08-13T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 69,
          "date": "2025-08-20T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 70,
          "date": "2025-08-27T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 71,
          "date": "2025-09-03T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 72,
          "date": "2025-09-10T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 73,
          "date": "2025-09-17T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 74,
          "date": "2025-09-24T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 75,
          "date": "2025-10-01T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 76,
          "date": "2025-10-08T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 77,
          "date": "2025-10-15T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 78,
          "date": "2025-10-22T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 79,
          "date": "2025-10-29T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 80,
          "date": "2025-11-05T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 81,
          "date": "2025-11-12T00:00:00",
          "mark": "X"
        }
      ],
      "raw": {
        "row": 48,
        "wbs": "24",
        "title": "Roofing",
        "owner": null,
        "start_date": "2025-07-19T00:00:00",
        "due_date": "2025-11-16T00:00:00",
        "duration_days": 120,
        "pct_complete": 0,
        "gantt_marks": [
          {
            "week_number": 65,
            "date": "2025-07-23T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 66,
            "date": "2025-07-30T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 67,
            "date": "2025-08-06T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 68,
            "date": "2025-08-13T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 69,
            "date": "2025-08-20T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 70,
            "date": "2025-08-27T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 71,
            "date": "2025-09-03T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 72,
            "date": "2025-09-10T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 73,
            "date": "2025-09-17T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 74,
            "date": "2025-09-24T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 75,
            "date": "2025-10-01T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 76,
            "date": "2025-10-08T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 77,
            "date": "2025-10-15T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 78,
            "date": "2025-10-22T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 79,
            "date": "2025-10-29T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 80,
            "date": "2025-11-05T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 81,
            "date": "2025-11-12T00:00:00",
            "mark": "X"
          }
        ]
      }
    },
    {
      "id": "plan-row-49",
      "sourceRow": 49,
      "wbs": "25",
      "name": "Interior Framing",
      "owner": "Renovation Group",
      "phase": "Interiors and closeout",
      "days": 60,
      "start": "03/23/25",
      "end": "05/22/25",
      "startISO": "2025-03-23",
      "endISO": "2025-05-22",
      "startDisplay": "Mar 23, 2025",
      "endDisplay": "May 22, 2025",
      "pctComplete": 0,
      "pctLabel": "0%",
      "status": "Open",
      "cls": "neutral",
      "bucket": "backlog",
      "x": 63.91,
      "w": 7.29,
      "ganttWeeks": 9,
      "ganttMarks": [
        {
          "week_number": 48,
          "date": "2025-03-26T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 49,
          "date": "2025-04-02T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 50,
          "date": "2025-04-09T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 51,
          "date": "2025-04-16T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 52,
          "date": "2025-04-23T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 53,
          "date": "2025-04-30T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 54,
          "date": "2025-05-07T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 55,
          "date": "2025-05-14T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 56,
          "date": "2025-05-21T00:00:00",
          "mark": "X"
        }
      ],
      "raw": {
        "row": 49,
        "wbs": "25",
        "title": "Interior Framing",
        "owner": null,
        "start_date": "2025-03-23T00:00:00",
        "due_date": "2025-05-22T00:00:00",
        "duration_days": 60,
        "pct_complete": 0,
        "gantt_marks": [
          {
            "week_number": 48,
            "date": "2025-03-26T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 49,
            "date": "2025-04-02T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 50,
            "date": "2025-04-09T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 51,
            "date": "2025-04-16T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 52,
            "date": "2025-04-23T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 53,
            "date": "2025-04-30T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 54,
            "date": "2025-05-07T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 55,
            "date": "2025-05-14T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 56,
            "date": "2025-05-21T00:00:00",
            "mark": "X"
          }
        ]
      }
    },
    {
      "id": "plan-row-50",
      "sourceRow": 50,
      "wbs": "26",
      "name": "Insulation",
      "owner": "Renovation Group",
      "phase": "Interiors and closeout",
      "days": 15,
      "start": "05/22/25",
      "end": "06/06/25",
      "startISO": "2025-05-22",
      "endISO": "2025-06-06",
      "startDisplay": "May 22, 2025",
      "endDisplay": "Jun 6, 2025",
      "pctComplete": 0,
      "pctLabel": "0%",
      "status": "Open",
      "cls": "neutral",
      "bucket": "backlog",
      "x": 71.2,
      "w": 1.82,
      "ganttWeeks": 2,
      "ganttMarks": [
        {
          "week_number": 57,
          "date": "2025-05-28T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 58,
          "date": "2025-06-04T00:00:00",
          "mark": "X"
        }
      ],
      "raw": {
        "row": 50,
        "wbs": "26",
        "title": "Insulation",
        "owner": null,
        "start_date": "2025-05-22T00:00:00",
        "due_date": "2025-06-06T00:00:00",
        "duration_days": 15,
        "pct_complete": 0,
        "gantt_marks": [
          {
            "week_number": 57,
            "date": "2025-05-28T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 58,
            "date": "2025-06-04T00:00:00",
            "mark": "X"
          }
        ]
      }
    },
    {
      "id": "plan-row-51",
      "sourceRow": 51,
      "wbs": "27",
      "name": "Plumbing",
      "owner": "Design / filing team",
      "phase": "Interiors and closeout",
      "days": 150,
      "start": "04/02/25",
      "end": "08/30/25",
      "startISO": "2025-04-02",
      "endISO": "2025-08-30",
      "startDisplay": "Apr 2, 2025",
      "endDisplay": "Aug 30, 2025",
      "pctComplete": 0,
      "pctLabel": "0%",
      "status": "Open",
      "cls": "neutral",
      "bucket": "backlog",
      "x": 65.13,
      "w": 18.23,
      "ganttWeeks": 22,
      "ganttMarks": [
        {
          "week_number": 49,
          "date": "2025-04-02T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 50,
          "date": "2025-04-09T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 51,
          "date": "2025-04-16T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 52,
          "date": "2025-04-23T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 53,
          "date": "2025-04-30T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 54,
          "date": "2025-05-07T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 55,
          "date": "2025-05-14T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 56,
          "date": "2025-05-21T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 57,
          "date": "2025-05-28T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 58,
          "date": "2025-06-04T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 59,
          "date": "2025-06-11T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 60,
          "date": "2025-06-18T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 61,
          "date": "2025-06-25T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 62,
          "date": "2025-07-02T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 63,
          "date": "2025-07-09T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 64,
          "date": "2025-07-16T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 65,
          "date": "2025-07-23T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 66,
          "date": "2025-07-30T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 67,
          "date": "2025-08-06T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 68,
          "date": "2025-08-13T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 69,
          "date": "2025-08-20T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 70,
          "date": "2025-08-27T00:00:00",
          "mark": "X"
        }
      ],
      "raw": {
        "row": 51,
        "wbs": "27",
        "title": "Plumbing",
        "owner": null,
        "start_date": "2025-04-02T00:00:00",
        "due_date": "2025-08-30T00:00:00",
        "duration_days": 150,
        "pct_complete": 0,
        "gantt_marks": [
          {
            "week_number": 49,
            "date": "2025-04-02T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 50,
            "date": "2025-04-09T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 51,
            "date": "2025-04-16T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 52,
            "date": "2025-04-23T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 53,
            "date": "2025-04-30T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 54,
            "date": "2025-05-07T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 55,
            "date": "2025-05-14T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 56,
            "date": "2025-05-21T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 57,
            "date": "2025-05-28T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 58,
            "date": "2025-06-04T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 59,
            "date": "2025-06-11T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 60,
            "date": "2025-06-18T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 61,
            "date": "2025-06-25T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 62,
            "date": "2025-07-02T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 63,
            "date": "2025-07-09T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 64,
            "date": "2025-07-16T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 65,
            "date": "2025-07-23T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 66,
            "date": "2025-07-30T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 67,
            "date": "2025-08-06T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 68,
            "date": "2025-08-13T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 69,
            "date": "2025-08-20T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 70,
            "date": "2025-08-27T00:00:00",
            "mark": "X"
          }
        ]
      }
    },
    {
      "id": "plan-row-52",
      "sourceRow": 52,
      "wbs": "28",
      "name": "Sprinkler",
      "owner": "Design / filing team",
      "phase": "Interiors and closeout",
      "days": 49,
      "start": "05/22/25",
      "end": "07/10/25",
      "startISO": "2025-05-22",
      "endISO": "2025-07-10",
      "startDisplay": "May 22, 2025",
      "endDisplay": "Jul 10, 2025",
      "pctComplete": 0,
      "pctLabel": "0%",
      "status": "Open",
      "cls": "neutral",
      "bucket": "backlog",
      "x": 71.2,
      "w": 5.95,
      "ganttWeeks": 7,
      "ganttMarks": [
        {
          "week_number": 57,
          "date": "2025-05-28T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 58,
          "date": "2025-06-04T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 59,
          "date": "2025-06-11T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 60,
          "date": "2025-06-18T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 61,
          "date": "2025-06-25T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 62,
          "date": "2025-07-02T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 63,
          "date": "2025-07-09T00:00:00",
          "mark": "X"
        }
      ],
      "raw": {
        "row": 52,
        "wbs": "28",
        "title": "Sprinkler",
        "owner": null,
        "start_date": "2025-05-22T00:00:00",
        "due_date": "2025-07-10T00:00:00",
        "duration_days": 49,
        "pct_complete": 0,
        "gantt_marks": [
          {
            "week_number": 57,
            "date": "2025-05-28T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 58,
            "date": "2025-06-04T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 59,
            "date": "2025-06-11T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 60,
            "date": "2025-06-18T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 61,
            "date": "2025-06-25T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 62,
            "date": "2025-07-02T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 63,
            "date": "2025-07-09T00:00:00",
            "mark": "X"
          }
        ]
      }
    },
    {
      "id": "plan-row-53",
      "sourceRow": 53,
      "wbs": "29",
      "name": "Electrical",
      "owner": "Renovation Group",
      "phase": "Interiors and closeout",
      "days": 120,
      "start": "05/22/25",
      "end": "09/19/25",
      "startISO": "2025-05-22",
      "endISO": "2025-09-19",
      "startDisplay": "May 22, 2025",
      "endDisplay": "Sep 19, 2025",
      "pctComplete": 0,
      "pctLabel": "0%",
      "status": "Open",
      "cls": "neutral",
      "bucket": "backlog",
      "x": 71.2,
      "w": 14.58,
      "ganttWeeks": 17,
      "ganttMarks": [
        {
          "week_number": 57,
          "date": "2025-05-28T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 58,
          "date": "2025-06-04T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 59,
          "date": "2025-06-11T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 60,
          "date": "2025-06-18T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 61,
          "date": "2025-06-25T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 62,
          "date": "2025-07-02T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 63,
          "date": "2025-07-09T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 64,
          "date": "2025-07-16T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 65,
          "date": "2025-07-23T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 66,
          "date": "2025-07-30T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 67,
          "date": "2025-08-06T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 68,
          "date": "2025-08-13T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 69,
          "date": "2025-08-20T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 70,
          "date": "2025-08-27T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 71,
          "date": "2025-09-03T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 72,
          "date": "2025-09-10T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 73,
          "date": "2025-09-17T00:00:00",
          "mark": "X"
        }
      ],
      "raw": {
        "row": 53,
        "wbs": "29",
        "title": "Electrical",
        "owner": null,
        "start_date": "2025-05-22T00:00:00",
        "due_date": "2025-09-19T00:00:00",
        "duration_days": 120,
        "pct_complete": 0,
        "gantt_marks": [
          {
            "week_number": 57,
            "date": "2025-05-28T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 58,
            "date": "2025-06-04T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 59,
            "date": "2025-06-11T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 60,
            "date": "2025-06-18T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 61,
            "date": "2025-06-25T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 62,
            "date": "2025-07-02T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 63,
            "date": "2025-07-09T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 64,
            "date": "2025-07-16T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 65,
            "date": "2025-07-23T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 66,
            "date": "2025-07-30T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 67,
            "date": "2025-08-06T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 68,
            "date": "2025-08-13T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 69,
            "date": "2025-08-20T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 70,
            "date": "2025-08-27T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 71,
            "date": "2025-09-03T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 72,
            "date": "2025-09-10T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 73,
            "date": "2025-09-17T00:00:00",
            "mark": "X"
          }
        ]
      }
    },
    {
      "id": "plan-row-54",
      "sourceRow": 54,
      "wbs": "30",
      "name": "Fire Alarm",
      "owner": "Renovation Group",
      "phase": "Interiors and closeout",
      "days": 100,
      "start": "05/22/25",
      "end": "08/30/25",
      "startISO": "2025-05-22",
      "endISO": "2025-08-30",
      "startDisplay": "May 22, 2025",
      "endDisplay": "Aug 30, 2025",
      "pctComplete": 0,
      "pctLabel": "0%",
      "status": "Open",
      "cls": "neutral",
      "bucket": "backlog",
      "x": 71.2,
      "w": 12.15,
      "ganttWeeks": 14,
      "ganttMarks": [
        {
          "week_number": 57,
          "date": "2025-05-28T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 58,
          "date": "2025-06-04T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 59,
          "date": "2025-06-11T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 60,
          "date": "2025-06-18T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 61,
          "date": "2025-06-25T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 62,
          "date": "2025-07-02T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 63,
          "date": "2025-07-09T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 64,
          "date": "2025-07-16T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 65,
          "date": "2025-07-23T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 66,
          "date": "2025-07-30T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 67,
          "date": "2025-08-06T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 68,
          "date": "2025-08-13T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 69,
          "date": "2025-08-20T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 70,
          "date": "2025-08-27T00:00:00",
          "mark": "X"
        }
      ],
      "raw": {
        "row": 54,
        "wbs": "30",
        "title": "Fire Alarm",
        "owner": null,
        "start_date": "2025-05-22T00:00:00",
        "due_date": "2025-08-30T00:00:00",
        "duration_days": 100,
        "pct_complete": 0,
        "gantt_marks": [
          {
            "week_number": 57,
            "date": "2025-05-28T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 58,
            "date": "2025-06-04T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 59,
            "date": "2025-06-11T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 60,
            "date": "2025-06-18T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 61,
            "date": "2025-06-25T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 62,
            "date": "2025-07-02T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 63,
            "date": "2025-07-09T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 64,
            "date": "2025-07-16T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 65,
            "date": "2025-07-23T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 66,
            "date": "2025-07-30T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 67,
            "date": "2025-08-06T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 68,
            "date": "2025-08-13T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 69,
            "date": "2025-08-20T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 70,
            "date": "2025-08-27T00:00:00",
            "mark": "X"
          }
        ]
      }
    },
    {
      "id": "plan-row-55",
      "sourceRow": 55,
      "wbs": "31",
      "name": "Low Voltage",
      "owner": "Renovation Group",
      "phase": "Interiors and closeout",
      "days": 14,
      "start": "09/19/25",
      "end": "10/03/25",
      "startISO": "2025-09-19",
      "endISO": "2025-10-03",
      "startDisplay": "Sep 19, 2025",
      "endDisplay": "Oct 3, 2025",
      "pctComplete": 0,
      "pctLabel": "0%",
      "status": "Open",
      "cls": "neutral",
      "bucket": "backlog",
      "x": 85.78,
      "w": 1.7,
      "ganttWeeks": 2,
      "ganttMarks": [
        {
          "week_number": 74,
          "date": "2025-09-24T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 75,
          "date": "2025-10-01T00:00:00",
          "mark": "X"
        }
      ],
      "raw": {
        "row": 55,
        "wbs": "31",
        "title": "Low Voltage",
        "owner": null,
        "start_date": "2025-09-19T00:00:00",
        "due_date": "2025-10-03T00:00:00",
        "duration_days": 14,
        "pct_complete": 0,
        "gantt_marks": [
          {
            "week_number": 74,
            "date": "2025-09-24T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 75,
            "date": "2025-10-01T00:00:00",
            "mark": "X"
          }
        ]
      }
    },
    {
      "id": "plan-row-56",
      "sourceRow": 56,
      "wbs": "32",
      "name": "AC",
      "owner": "Renovation Group",
      "phase": "Interiors and closeout",
      "days": 100,
      "start": "05/22/25",
      "end": "08/30/25",
      "startISO": "2025-05-22",
      "endISO": "2025-08-30",
      "startDisplay": "May 22, 2025",
      "endDisplay": "Aug 30, 2025",
      "pctComplete": 0,
      "pctLabel": "0%",
      "status": "Open",
      "cls": "neutral",
      "bucket": "backlog",
      "x": 71.2,
      "w": 12.15,
      "ganttWeeks": 14,
      "ganttMarks": [
        {
          "week_number": 57,
          "date": "2025-05-28T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 58,
          "date": "2025-06-04T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 59,
          "date": "2025-06-11T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 60,
          "date": "2025-06-18T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 61,
          "date": "2025-06-25T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 62,
          "date": "2025-07-02T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 63,
          "date": "2025-07-09T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 64,
          "date": "2025-07-16T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 65,
          "date": "2025-07-23T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 66,
          "date": "2025-07-30T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 67,
          "date": "2025-08-06T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 68,
          "date": "2025-08-13T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 69,
          "date": "2025-08-20T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 70,
          "date": "2025-08-27T00:00:00",
          "mark": "X"
        }
      ],
      "raw": {
        "row": 56,
        "wbs": "32",
        "title": "AC",
        "owner": null,
        "start_date": "2025-05-22T00:00:00",
        "due_date": "2025-08-30T00:00:00",
        "duration_days": 100,
        "pct_complete": 0,
        "gantt_marks": [
          {
            "week_number": 57,
            "date": "2025-05-28T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 58,
            "date": "2025-06-04T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 59,
            "date": "2025-06-11T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 60,
            "date": "2025-06-18T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 61,
            "date": "2025-06-25T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 62,
            "date": "2025-07-02T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 63,
            "date": "2025-07-09T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 64,
            "date": "2025-07-16T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 65,
            "date": "2025-07-23T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 66,
            "date": "2025-07-30T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 67,
            "date": "2025-08-06T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 68,
            "date": "2025-08-13T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 69,
            "date": "2025-08-20T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 70,
            "date": "2025-08-27T00:00:00",
            "mark": "X"
          }
        ]
      }
    },
    {
      "id": "plan-row-57",
      "sourceRow": 57,
      "wbs": "33",
      "name": "Sheetrock",
      "owner": "Renovation Group",
      "phase": "Interiors and closeout",
      "days": 35,
      "start": "05/22/25",
      "end": "06/26/25",
      "startISO": "2025-05-22",
      "endISO": "2025-06-26",
      "startDisplay": "May 22, 2025",
      "endDisplay": "Jun 26, 2025",
      "pctComplete": 0,
      "pctLabel": "0%",
      "status": "Open",
      "cls": "neutral",
      "bucket": "backlog",
      "x": 71.2,
      "w": 4.25,
      "ganttWeeks": 5,
      "ganttMarks": [
        {
          "week_number": 57,
          "date": "2025-05-28T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 58,
          "date": "2025-06-04T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 59,
          "date": "2025-06-11T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 60,
          "date": "2025-06-18T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 61,
          "date": "2025-06-25T00:00:00",
          "mark": "X"
        }
      ],
      "raw": {
        "row": 57,
        "wbs": "33",
        "title": "Sheetrock",
        "owner": null,
        "start_date": "2025-05-22T00:00:00",
        "due_date": "2025-06-26T00:00:00",
        "duration_days": 35,
        "pct_complete": 0,
        "gantt_marks": [
          {
            "week_number": 57,
            "date": "2025-05-28T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 58,
            "date": "2025-06-04T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 59,
            "date": "2025-06-11T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 60,
            "date": "2025-06-18T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 61,
            "date": "2025-06-25T00:00:00",
            "mark": "X"
          }
        ]
      }
    },
    {
      "id": "plan-row-58",
      "sourceRow": 58,
      "wbs": "34",
      "name": "Plaster & Primer",
      "owner": "Renovation Group",
      "phase": "Interiors and closeout",
      "days": 28,
      "start": "06/26/25",
      "end": "07/24/25",
      "startISO": "2025-06-26",
      "endISO": "2025-07-24",
      "startDisplay": "Jun 26, 2025",
      "endDisplay": "Jul 24, 2025",
      "pctComplete": 0,
      "pctLabel": "0%",
      "status": "Open",
      "cls": "neutral",
      "bucket": "backlog",
      "x": 75.46,
      "w": 3.4,
      "ganttWeeks": 4,
      "ganttMarks": [
        {
          "week_number": 62,
          "date": "2025-07-02T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 63,
          "date": "2025-07-09T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 64,
          "date": "2025-07-16T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 65,
          "date": "2025-07-23T00:00:00",
          "mark": "X"
        }
      ],
      "raw": {
        "row": 58,
        "wbs": "34",
        "title": "Plaster & Primer",
        "owner": null,
        "start_date": "2025-06-26T00:00:00",
        "due_date": "2025-07-24T00:00:00",
        "duration_days": 28,
        "pct_complete": 0,
        "gantt_marks": [
          {
            "week_number": 62,
            "date": "2025-07-02T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 63,
            "date": "2025-07-09T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 64,
            "date": "2025-07-16T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 65,
            "date": "2025-07-23T00:00:00",
            "mark": "X"
          }
        ]
      }
    },
    {
      "id": "plan-row-59",
      "sourceRow": 59,
      "wbs": "35",
      "name": "Tiles",
      "owner": "Renovation Group",
      "phase": "Interiors and closeout",
      "days": 30,
      "start": "07/31/25",
      "end": "08/30/25",
      "startISO": "2025-07-31",
      "endISO": "2025-08-30",
      "startDisplay": "Jul 31, 2025",
      "endDisplay": "Aug 30, 2025",
      "pctComplete": 0,
      "pctLabel": "0%",
      "status": "Open",
      "cls": "neutral",
      "bucket": "backlog",
      "x": 79.71,
      "w": 3.65,
      "ganttWeeks": 4,
      "ganttMarks": [
        {
          "week_number": 67,
          "date": "2025-08-06T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 68,
          "date": "2025-08-13T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 69,
          "date": "2025-08-20T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 70,
          "date": "2025-08-27T00:00:00",
          "mark": "X"
        }
      ],
      "raw": {
        "row": 59,
        "wbs": "35",
        "title": "Tiles",
        "owner": null,
        "start_date": "2025-07-31T00:00:00",
        "due_date": "2025-08-30T00:00:00",
        "duration_days": 30,
        "pct_complete": 0,
        "gantt_marks": [
          {
            "week_number": 67,
            "date": "2025-08-06T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 68,
            "date": "2025-08-13T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 69,
            "date": "2025-08-20T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 70,
            "date": "2025-08-27T00:00:00",
            "mark": "X"
          }
        ]
      }
    },
    {
      "id": "plan-row-60",
      "sourceRow": 60,
      "wbs": "36",
      "name": "Floors",
      "owner": "Renovation Group",
      "phase": "Interiors and closeout",
      "days": 28,
      "start": "08/16/25",
      "end": "09/13/25",
      "startISO": "2025-08-16",
      "endISO": "2025-09-13",
      "startDisplay": "Aug 16, 2025",
      "endDisplay": "Sep 13, 2025",
      "pctComplete": 0,
      "pctLabel": "0%",
      "status": "Open",
      "cls": "neutral",
      "bucket": "backlog",
      "x": 81.65,
      "w": 3.4,
      "ganttWeeks": 4,
      "ganttMarks": [
        {
          "week_number": 69,
          "date": "2025-08-20T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 70,
          "date": "2025-08-27T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 71,
          "date": "2025-09-03T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 72,
          "date": "2025-09-10T00:00:00",
          "mark": "X"
        }
      ],
      "raw": {
        "row": 60,
        "wbs": "36",
        "title": "Floors",
        "owner": null,
        "start_date": "2025-08-16T00:00:00",
        "due_date": "2025-09-13T00:00:00",
        "duration_days": 28,
        "pct_complete": 0,
        "gantt_marks": [
          {
            "week_number": 69,
            "date": "2025-08-20T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 70,
            "date": "2025-08-27T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 71,
            "date": "2025-09-03T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 72,
            "date": "2025-09-10T00:00:00",
            "mark": "X"
          }
        ]
      }
    },
    {
      "id": "plan-row-61",
      "sourceRow": 61,
      "wbs": "37",
      "name": "Carpentry",
      "owner": "Renovation Group",
      "phase": "Interiors and closeout",
      "days": 63,
      "start": "08/14/25",
      "end": "10/16/25",
      "startISO": "2025-08-14",
      "endISO": "2025-10-16",
      "startDisplay": "Aug 14, 2025",
      "endDisplay": "Oct 16, 2025",
      "pctComplete": 0,
      "pctLabel": "0%",
      "status": "Open",
      "cls": "neutral",
      "bucket": "backlog",
      "x": 81.41,
      "w": 7.65,
      "ganttWeeks": 9,
      "ganttMarks": [
        {
          "week_number": 69,
          "date": "2025-08-20T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 70,
          "date": "2025-08-27T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 71,
          "date": "2025-09-03T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 72,
          "date": "2025-09-10T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 73,
          "date": "2025-09-17T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 74,
          "date": "2025-09-24T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 75,
          "date": "2025-10-01T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 76,
          "date": "2025-10-08T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 77,
          "date": "2025-10-15T00:00:00",
          "mark": "X"
        }
      ],
      "raw": {
        "row": 61,
        "wbs": "37",
        "title": "Carpentry",
        "owner": null,
        "start_date": "2025-08-14T00:00:00",
        "due_date": "2025-10-16T00:00:00",
        "duration_days": 63,
        "pct_complete": 0,
        "gantt_marks": [
          {
            "week_number": 69,
            "date": "2025-08-20T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 70,
            "date": "2025-08-27T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 71,
            "date": "2025-09-03T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 72,
            "date": "2025-09-10T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 73,
            "date": "2025-09-17T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 74,
            "date": "2025-09-24T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 75,
            "date": "2025-10-01T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 76,
            "date": "2025-10-08T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 77,
            "date": "2025-10-15T00:00:00",
            "mark": "X"
          }
        ]
      }
    },
    {
      "id": "plan-row-62",
      "sourceRow": 62,
      "wbs": "38",
      "name": "Interior Doors",
      "owner": "Renovation Group",
      "phase": "Interiors and closeout",
      "days": 30,
      "start": "09/13/25",
      "end": "10/13/25",
      "startISO": "2025-09-13",
      "endISO": "2025-10-13",
      "startDisplay": "Sep 13, 2025",
      "endDisplay": "Oct 13, 2025",
      "pctComplete": 0,
      "pctLabel": "0%",
      "status": "Open",
      "cls": "neutral",
      "bucket": "backlog",
      "x": 85.05,
      "w": 3.65,
      "ganttWeeks": 4,
      "ganttMarks": [
        {
          "week_number": 73,
          "date": "2025-09-17T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 74,
          "date": "2025-09-24T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 75,
          "date": "2025-10-01T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 76,
          "date": "2025-10-08T00:00:00",
          "mark": "X"
        }
      ],
      "raw": {
        "row": 62,
        "wbs": "38",
        "title": "Interior Doors",
        "owner": null,
        "start_date": "2025-09-13T00:00:00",
        "due_date": "2025-10-13T00:00:00",
        "duration_days": 30,
        "pct_complete": 0,
        "gantt_marks": [
          {
            "week_number": 73,
            "date": "2025-09-17T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 74,
            "date": "2025-09-24T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 75,
            "date": "2025-10-01T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 76,
            "date": "2025-10-08T00:00:00",
            "mark": "X"
          }
        ]
      }
    },
    {
      "id": "plan-row-63",
      "sourceRow": 63,
      "wbs": "39",
      "name": "Kitchen Cabinetry",
      "owner": "Renovation Group",
      "phase": "Interiors and closeout",
      "days": 42,
      "start": "09/13/25",
      "end": "10/25/25",
      "startISO": "2025-09-13",
      "endISO": "2025-10-25",
      "startDisplay": "Sep 13, 2025",
      "endDisplay": "Oct 25, 2025",
      "pctComplete": 0,
      "pctLabel": "0%",
      "status": "Open",
      "cls": "neutral",
      "bucket": "backlog",
      "x": 85.05,
      "w": 5.1,
      "ganttWeeks": 6,
      "ganttMarks": [
        {
          "week_number": 73,
          "date": "2025-09-17T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 74,
          "date": "2025-09-24T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 75,
          "date": "2025-10-01T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 76,
          "date": "2025-10-08T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 77,
          "date": "2025-10-15T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 78,
          "date": "2025-10-22T00:00:00",
          "mark": "X"
        }
      ],
      "raw": {
        "row": 63,
        "wbs": "39",
        "title": "Kitchen Cabinetry",
        "owner": null,
        "start_date": "2025-09-13T00:00:00",
        "due_date": "2025-10-25T00:00:00",
        "duration_days": 42,
        "pct_complete": 0,
        "gantt_marks": [
          {
            "week_number": 73,
            "date": "2025-09-17T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 74,
            "date": "2025-09-24T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 75,
            "date": "2025-10-01T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 76,
            "date": "2025-10-08T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 77,
            "date": "2025-10-15T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 78,
            "date": "2025-10-22T00:00:00",
            "mark": "X"
          }
        ]
      }
    },
    {
      "id": "plan-row-64",
      "sourceRow": 64,
      "wbs": "40",
      "name": "Bathroom Fixtures",
      "owner": "Renovation Group",
      "phase": "Interiors and closeout",
      "days": 14,
      "start": "08/30/25",
      "end": "09/13/25",
      "startISO": "2025-08-30",
      "endISO": "2025-09-13",
      "startDisplay": "Aug 30, 2025",
      "endDisplay": "Sep 13, 2025",
      "pctComplete": 0,
      "pctLabel": "0%",
      "status": "Open",
      "cls": "neutral",
      "bucket": "backlog",
      "x": 83.35,
      "w": 1.7,
      "ganttWeeks": 2,
      "ganttMarks": [
        {
          "week_number": 71,
          "date": "2025-09-03T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 72,
          "date": "2025-09-10T00:00:00",
          "mark": "X"
        }
      ],
      "raw": {
        "row": 64,
        "wbs": "40",
        "title": "Bathroom Fixtures",
        "owner": null,
        "start_date": "2025-08-30T00:00:00",
        "due_date": "2025-09-13T00:00:00",
        "duration_days": 14,
        "pct_complete": 0,
        "gantt_marks": [
          {
            "week_number": 71,
            "date": "2025-09-03T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 72,
            "date": "2025-09-10T00:00:00",
            "mark": "X"
          }
        ]
      }
    },
    {
      "id": "plan-row-65",
      "sourceRow": 65,
      "wbs": "41",
      "name": "Shower Doors",
      "owner": "Renovation Group",
      "phase": "Interiors and closeout",
      "days": 14,
      "start": "09/13/25",
      "end": "09/27/25",
      "startISO": "2025-09-13",
      "endISO": "2025-09-27",
      "startDisplay": "Sep 13, 2025",
      "endDisplay": "Sep 27, 2025",
      "pctComplete": 0,
      "pctLabel": "0%",
      "status": "Open",
      "cls": "neutral",
      "bucket": "backlog",
      "x": 85.05,
      "w": 1.7,
      "ganttWeeks": 2,
      "ganttMarks": [
        {
          "week_number": 73,
          "date": "2025-09-17T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 74,
          "date": "2025-09-24T00:00:00",
          "mark": "X"
        }
      ],
      "raw": {
        "row": 65,
        "wbs": "41",
        "title": "Shower Doors",
        "owner": null,
        "start_date": "2025-09-13T00:00:00",
        "due_date": "2025-09-27T00:00:00",
        "duration_days": 14,
        "pct_complete": 0,
        "gantt_marks": [
          {
            "week_number": 73,
            "date": "2025-09-17T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 74,
            "date": "2025-09-24T00:00:00",
            "mark": "X"
          }
        ]
      }
    },
    {
      "id": "plan-row-66",
      "sourceRow": 66,
      "wbs": "42",
      "name": "Paintinng",
      "owner": "Renovation Group",
      "phase": "Interiors and closeout",
      "days": 35,
      "start": "10/16/25",
      "end": "11/20/25",
      "startISO": "2025-10-16",
      "endISO": "2025-11-20",
      "startDisplay": "Oct 16, 2025",
      "endDisplay": "Nov 20, 2025",
      "pctComplete": 0,
      "pctLabel": "0%",
      "status": "Open",
      "cls": "neutral",
      "bucket": "backlog",
      "x": 89.06,
      "w": 4.25,
      "ganttWeeks": 5,
      "ganttMarks": [
        {
          "week_number": 78,
          "date": "2025-10-22T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 79,
          "date": "2025-10-29T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 80,
          "date": "2025-11-05T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 81,
          "date": "2025-11-12T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 82,
          "date": "2025-11-19T00:00:00",
          "mark": "X"
        }
      ],
      "raw": {
        "row": 66,
        "wbs": "42",
        "title": "Paintinng",
        "owner": null,
        "start_date": "2025-10-16T00:00:00",
        "due_date": "2025-11-20T00:00:00",
        "duration_days": 35,
        "pct_complete": 0,
        "gantt_marks": [
          {
            "week_number": 78,
            "date": "2025-10-22T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 79,
            "date": "2025-10-29T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 80,
            "date": "2025-11-05T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 81,
            "date": "2025-11-12T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 82,
            "date": "2025-11-19T00:00:00",
            "mark": "X"
          }
        ]
      }
    },
    {
      "id": "plan-row-67",
      "sourceRow": 67,
      "wbs": "43",
      "name": "Sidewalk and Asphalt for BPP",
      "owner": "Renovation Group",
      "phase": "Interiors and closeout",
      "days": 30,
      "start": "10/16/25",
      "end": "11/15/25",
      "startISO": "2025-10-16",
      "endISO": "2025-11-15",
      "startDisplay": "Oct 16, 2025",
      "endDisplay": "Nov 15, 2025",
      "pctComplete": 0,
      "pctLabel": "0%",
      "status": "Open",
      "cls": "neutral",
      "bucket": "backlog",
      "x": 89.06,
      "w": 3.65,
      "ganttWeeks": 4,
      "ganttMarks": [
        {
          "week_number": 78,
          "date": "2025-10-22T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 79,
          "date": "2025-10-29T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 80,
          "date": "2025-11-05T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 81,
          "date": "2025-11-12T00:00:00",
          "mark": "X"
        }
      ],
      "raw": {
        "row": 67,
        "wbs": "43",
        "title": "Sidewalk and Asphalt for BPP",
        "owner": null,
        "start_date": "2025-10-16T00:00:00",
        "due_date": "2025-11-15T00:00:00",
        "duration_days": 30,
        "pct_complete": 0,
        "gantt_marks": [
          {
            "week_number": 78,
            "date": "2025-10-22T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 79,
            "date": "2025-10-29T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 80,
            "date": "2025-11-05T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 81,
            "date": "2025-11-12T00:00:00",
            "mark": "X"
          }
        ]
      }
    },
    {
      "id": "plan-row-68",
      "sourceRow": 68,
      "wbs": "44",
      "name": "Sign Off / Misc / Touch ups",
      "owner": "Renovation Group",
      "phase": "Interiors and closeout",
      "days": 90,
      "start": "10/16/25",
      "end": "01/14/26",
      "startISO": "2025-10-16",
      "endISO": "2026-01-14",
      "startDisplay": "Oct 16, 2025",
      "endDisplay": "Jan 14, 2026",
      "pctComplete": 0,
      "pctLabel": "0%",
      "status": "Open",
      "cls": "neutral",
      "bucket": "backlog",
      "x": 89.06,
      "w": 10.94,
      "ganttWeeks": 13,
      "ganttMarks": [
        {
          "week_number": 78,
          "date": "2025-10-22T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 79,
          "date": "2025-10-29T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 80,
          "date": "2025-11-05T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 81,
          "date": "2025-11-12T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 82,
          "date": "2025-11-19T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 83,
          "date": "2025-11-26T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 84,
          "date": "2025-12-03T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 85,
          "date": "2025-12-10T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 86,
          "date": "2025-12-17T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 87,
          "date": "2025-12-24T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 88,
          "date": "2025-12-31T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 89,
          "date": "2026-01-07T00:00:00",
          "mark": "X"
        },
        {
          "week_number": 90,
          "date": "2026-01-14T00:00:00",
          "mark": "X"
        }
      ],
      "raw": {
        "row": 68,
        "wbs": "44",
        "title": "Sign Off / Misc / Touch ups",
        "owner": null,
        "start_date": "2025-10-16T00:00:00",
        "due_date": "2026-01-14T00:00:00",
        "duration_days": 90,
        "pct_complete": 0,
        "gantt_marks": [
          {
            "week_number": 78,
            "date": "2025-10-22T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 79,
            "date": "2025-10-29T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 80,
            "date": "2025-11-05T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 81,
            "date": "2025-11-12T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 82,
            "date": "2025-11-19T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 83,
            "date": "2025-11-26T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 84,
            "date": "2025-12-03T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 85,
            "date": "2025-12-10T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 86,
            "date": "2025-12-17T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 87,
            "date": "2025-12-24T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 88,
            "date": "2025-12-31T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 89,
            "date": "2026-01-07T00:00:00",
            "mark": "X"
          },
          {
            "week_number": 90,
            "date": "2026-01-14T00:00:00",
            "mark": "X"
          }
        ]
      }
    },
    {
      "id": "plan-row-69",
      "sourceRow": 69,
      "wbs": "45",
      "name": "Reserved tracker row 45",
      "owner": "Renovation Group",
      "phase": "Reserved tracker rows",
      "days": null,
      "start": "\u2014",
      "end": "\u2014",
      "startISO": null,
      "endISO": null,
      "startDisplay": "Not set",
      "endDisplay": "Not set",
      "pctComplete": null,
      "pctLabel": "\u2014",
      "status": "Reserved row",
      "cls": "neutral",
      "bucket": "reserved",
      "x": 0,
      "w": 1.2,
      "ganttWeeks": 0,
      "ganttMarks": [],
      "raw": {
        "row": 69,
        "wbs": "45",
        "title": null,
        "owner": null,
        "start_date": null,
        "due_date": null,
        "duration_days": null,
        "pct_complete": null,
        "gantt_marks": []
      }
    },
    {
      "id": "plan-row-70",
      "sourceRow": 70,
      "wbs": "46",
      "name": "Reserved tracker row 46",
      "owner": "Renovation Group",
      "phase": "Reserved tracker rows",
      "days": null,
      "start": "\u2014",
      "end": "\u2014",
      "startISO": null,
      "endISO": null,
      "startDisplay": "Not set",
      "endDisplay": "Not set",
      "pctComplete": null,
      "pctLabel": "\u2014",
      "status": "Reserved row",
      "cls": "neutral",
      "bucket": "reserved",
      "x": 0,
      "w": 1.2,
      "ganttWeeks": 0,
      "ganttMarks": [],
      "raw": {
        "row": 70,
        "wbs": "46",
        "title": null,
        "owner": null,
        "start_date": null,
        "due_date": null,
        "duration_days": null,
        "pct_complete": null,
        "gantt_marks": []
      }
    },
    {
      "id": "plan-row-71",
      "sourceRow": 71,
      "wbs": "47",
      "name": "Reserved tracker row 47",
      "owner": "Renovation Group",
      "phase": "Reserved tracker rows",
      "days": null,
      "start": "\u2014",
      "end": "\u2014",
      "startISO": null,
      "endISO": null,
      "startDisplay": "Not set",
      "endDisplay": "Not set",
      "pctComplete": null,
      "pctLabel": "\u2014",
      "status": "Reserved row",
      "cls": "neutral",
      "bucket": "reserved",
      "x": 0,
      "w": 1.2,
      "ganttWeeks": 0,
      "ganttMarks": [],
      "raw": {
        "row": 71,
        "wbs": "47",
        "title": null,
        "owner": null,
        "start_date": null,
        "due_date": null,
        "duration_days": null,
        "pct_complete": null,
        "gantt_marks": []
      }
    },
    {
      "id": "plan-row-72",
      "sourceRow": 72,
      "wbs": "48",
      "name": "Reserved tracker row 48",
      "owner": "Renovation Group",
      "phase": "Reserved tracker rows",
      "days": null,
      "start": "\u2014",
      "end": "\u2014",
      "startISO": null,
      "endISO": null,
      "startDisplay": "Not set",
      "endDisplay": "Not set",
      "pctComplete": null,
      "pctLabel": "\u2014",
      "status": "Reserved row",
      "cls": "neutral",
      "bucket": "reserved",
      "x": 0,
      "w": 1.2,
      "ganttWeeks": 0,
      "ganttMarks": [],
      "raw": {
        "row": 72,
        "wbs": "48",
        "title": null,
        "owner": null,
        "start_date": null,
        "due_date": null,
        "duration_days": null,
        "pct_complete": null,
        "gantt_marks": []
      }
    },
    {
      "id": "plan-row-73",
      "sourceRow": 73,
      "wbs": "49",
      "name": "Reserved tracker row 49",
      "owner": "Renovation Group",
      "phase": "Reserved tracker rows",
      "days": null,
      "start": "\u2014",
      "end": "\u2014",
      "startISO": null,
      "endISO": null,
      "startDisplay": "Not set",
      "endDisplay": "Not set",
      "pctComplete": null,
      "pctLabel": "\u2014",
      "status": "Reserved row",
      "cls": "neutral",
      "bucket": "reserved",
      "x": 0,
      "w": 1.2,
      "ganttWeeks": 0,
      "ganttMarks": [],
      "raw": {
        "row": 73,
        "wbs": "49",
        "title": null,
        "owner": null,
        "start_date": null,
        "due_date": null,
        "duration_days": null,
        "pct_complete": null,
        "gantt_marks": []
      }
    },
    {
      "id": "plan-row-74",
      "sourceRow": 74,
      "wbs": "50",
      "name": "Reserved tracker row 50",
      "owner": "Renovation Group",
      "phase": "Reserved tracker rows",
      "days": null,
      "start": "\u2014",
      "end": "\u2014",
      "startISO": null,
      "endISO": null,
      "startDisplay": "Not set",
      "endDisplay": "Not set",
      "pctComplete": null,
      "pctLabel": "\u2014",
      "status": "Reserved row",
      "cls": "neutral",
      "bucket": "reserved",
      "x": 0,
      "w": 1.2,
      "ganttWeeks": 0,
      "ganttMarks": [],
      "raw": {
        "row": 74,
        "wbs": "50",
        "title": null,
        "owner": null,
        "start_date": null,
        "due_date": null,
        "duration_days": null,
        "pct_complete": null,
        "gantt_marks": []
      }
    },
    {
      "id": "plan-row-75",
      "sourceRow": 75,
      "wbs": "51",
      "name": "Reserved tracker row 51",
      "owner": "Renovation Group",
      "phase": "Reserved tracker rows",
      "days": null,
      "start": "\u2014",
      "end": "\u2014",
      "startISO": null,
      "endISO": null,
      "startDisplay": "Not set",
      "endDisplay": "Not set",
      "pctComplete": null,
      "pctLabel": "\u2014",
      "status": "Reserved row",
      "cls": "neutral",
      "bucket": "reserved",
      "x": 0,
      "w": 1.2,
      "ganttWeeks": 0,
      "ganttMarks": [],
      "raw": {
        "row": 75,
        "wbs": "51",
        "title": null,
        "owner": null,
        "start_date": null,
        "due_date": null,
        "duration_days": null,
        "pct_complete": null,
        "gantt_marks": []
      }
    },
    {
      "id": "plan-row-76",
      "sourceRow": 76,
      "wbs": "52",
      "name": "Reserved tracker row 52",
      "owner": "Renovation Group",
      "phase": "Reserved tracker rows",
      "days": null,
      "start": "\u2014",
      "end": "\u2014",
      "startISO": null,
      "endISO": null,
      "startDisplay": "Not set",
      "endDisplay": "Not set",
      "pctComplete": null,
      "pctLabel": "\u2014",
      "status": "Reserved row",
      "cls": "neutral",
      "bucket": "reserved",
      "x": 0,
      "w": 1.2,
      "ganttWeeks": 0,
      "ganttMarks": [],
      "raw": {
        "row": 76,
        "wbs": "52",
        "title": null,
        "owner": null,
        "start_date": null,
        "due_date": null,
        "duration_days": null,
        "pct_complete": null,
        "gantt_marks": []
      }
    },
    {
      "id": "plan-row-77",
      "sourceRow": 77,
      "wbs": "53",
      "name": "Reserved tracker row 53",
      "owner": "Renovation Group",
      "phase": "Reserved tracker rows",
      "days": null,
      "start": "\u2014",
      "end": "\u2014",
      "startISO": null,
      "endISO": null,
      "startDisplay": "Not set",
      "endDisplay": "Not set",
      "pctComplete": null,
      "pctLabel": "\u2014",
      "status": "Reserved row",
      "cls": "neutral",
      "bucket": "reserved",
      "x": 0,
      "w": 1.2,
      "ganttWeeks": 0,
      "ganttMarks": [],
      "raw": {
        "row": 77,
        "wbs": "53",
        "title": null,
        "owner": null,
        "start_date": null,
        "due_date": null,
        "duration_days": null,
        "pct_complete": null,
        "gantt_marks": []
      }
    },
    {
      "id": "plan-row-78",
      "sourceRow": 78,
      "wbs": "54",
      "name": "Reserved tracker row 54",
      "owner": "Renovation Group",
      "phase": "Reserved tracker rows",
      "days": null,
      "start": "\u2014",
      "end": "\u2014",
      "startISO": null,
      "endISO": null,
      "startDisplay": "Not set",
      "endDisplay": "Not set",
      "pctComplete": null,
      "pctLabel": "\u2014",
      "status": "Reserved row",
      "cls": "neutral",
      "bucket": "reserved",
      "x": 0,
      "w": 1.2,
      "ganttWeeks": 0,
      "ganttMarks": [],
      "raw": {
        "row": 78,
        "wbs": "54",
        "title": null,
        "owner": null,
        "start_date": null,
        "due_date": null,
        "duration_days": null,
        "pct_complete": null,
        "gantt_marks": []
      }
    },
    {
      "id": "plan-row-79",
      "sourceRow": 79,
      "wbs": "55",
      "name": "Reserved tracker row 55",
      "owner": "Renovation Group",
      "phase": "Reserved tracker rows",
      "days": null,
      "start": "\u2014",
      "end": "\u2014",
      "startISO": null,
      "endISO": null,
      "startDisplay": "Not set",
      "endDisplay": "Not set",
      "pctComplete": null,
      "pctLabel": "\u2014",
      "status": "Reserved row",
      "cls": "neutral",
      "bucket": "reserved",
      "x": 0,
      "w": 1.2,
      "ganttWeeks": 0,
      "ganttMarks": [],
      "raw": {
        "row": 79,
        "wbs": "55",
        "title": null,
        "owner": null,
        "start_date": null,
        "due_date": null,
        "duration_days": null,
        "pct_complete": null,
        "gantt_marks": []
      }
    },
    {
      "id": "plan-row-80",
      "sourceRow": 80,
      "wbs": "56",
      "name": "Reserved tracker row 56",
      "owner": "Renovation Group",
      "phase": "Reserved tracker rows",
      "days": null,
      "start": "\u2014",
      "end": "\u2014",
      "startISO": null,
      "endISO": null,
      "startDisplay": "Not set",
      "endDisplay": "Not set",
      "pctComplete": null,
      "pctLabel": "\u2014",
      "status": "Reserved row",
      "cls": "neutral",
      "bucket": "reserved",
      "x": 0,
      "w": 1.2,
      "ganttWeeks": 0,
      "ganttMarks": [],
      "raw": {
        "row": 80,
        "wbs": "56",
        "title": null,
        "owner": null,
        "start_date": null,
        "due_date": null,
        "duration_days": null,
        "pct_complete": null,
        "gantt_marks": []
      }
    }
  ],
  "planMonths": [
    {
      "label": "May '24",
      "iso": "2024-05-01"
    },
    {
      "label": "Jun '24",
      "iso": "2024-06-05"
    },
    {
      "label": "Jul '24",
      "iso": "2024-07-03"
    },
    {
      "label": "Aug '24",
      "iso": "2024-08-07"
    },
    {
      "label": "Sep '24",
      "iso": "2024-09-04"
    },
    {
      "label": "Oct '24",
      "iso": "2024-10-02"
    },
    {
      "label": "Nov '24",
      "iso": "2024-11-06"
    },
    {
      "label": "Dec '24",
      "iso": "2024-12-04"
    },
    {
      "label": "Jan '25",
      "iso": "2025-01-01"
    },
    {
      "label": "Feb '25",
      "iso": "2025-02-05"
    },
    {
      "label": "Mar '25",
      "iso": "2025-03-05"
    },
    {
      "label": "Apr '25",
      "iso": "2025-04-02"
    },
    {
      "label": "May '25",
      "iso": "2025-05-07"
    },
    {
      "label": "Jun '25",
      "iso": "2025-06-04"
    },
    {
      "label": "Jul '25",
      "iso": "2025-07-02"
    },
    {
      "label": "Aug '25",
      "iso": "2025-08-06"
    },
    {
      "label": "Sep '25",
      "iso": "2025-09-03"
    },
    {
      "label": "Oct '25",
      "iso": "2025-10-01"
    },
    {
      "label": "Nov '25",
      "iso": "2025-11-05"
    },
    {
      "label": "Dec '25",
      "iso": "2025-12-03"
    },
    {
      "label": "Jan '26",
      "iso": "2026-01-07"
    },
    {
      "label": "Feb '26",
      "iso": "2026-02-04"
    },
    {
      "label": "Mar '26",
      "iso": "2026-03-04"
    },
    {
      "label": "Apr '26",
      "iso": "2026-04-01"
    },
    {
      "label": "May '26",
      "iso": "2026-05-06"
    },
    {
      "label": "Jun '26",
      "iso": "2026-06-03"
    },
    {
      "label": "Jul '26",
      "iso": "2026-07-01"
    },
    {
      "label": "Aug '26",
      "iso": "2026-08-05"
    },
    {
      "label": "Sep '26",
      "iso": "2026-09-02"
    },
    {
      "label": "Oct '26",
      "iso": "2026-10-07"
    },
    {
      "label": "Nov '26",
      "iso": "2026-11-04"
    },
    {
      "label": "Dec '26",
      "iso": "2026-12-02"
    },
    {
      "label": "Jan '27",
      "iso": "2027-01-06"
    }
  ],
  "team": [
    {
      "Contact": "Middleton Environmental | Thomas R. Tompkins",
      "Company": "Middleton Environmental",
      "Email": "info@midenv.com",
      "Open Tasks": 0,
      "In Progress Tasks": 0,
      "Completed Tasks": 0,
      "Total Tasks": 0
    },
    {
      "Contact": "International Office of Architects | Murat Mutlu",
      "Company": "International Office of Architects",
      "Email": "murat@in-oa.com",
      "Open Tasks": 0,
      "In Progress Tasks": 0,
      "Completed Tasks": 0,
      "Total Tasks": 0
    },
    {
      "Contact": "Stroh Engineering Services  | Jeff Roberts",
      "Company": "Stroh Engineering Services",
      "Email": "jeff@strohengineering.com",
      "Open Tasks": 0,
      "In Progress Tasks": 0,
      "Completed Tasks": 0,
      "Total Tasks": 0
    },
    {
      "Contact": "Boyd Consulting | Andrea Boyd",
      "Company": "Boyd Consulting",
      "Email": "andrea@boydconsult.com",
      "Open Tasks": 0,
      "In Progress Tasks": 0,
      "Completed Tasks": 0,
      "Total Tasks": 0
    },
    {
      "Contact": "5 Borough Mapping NY | Raj Kumar",
      "Company": "5 Borough Mapping NY",
      "Email": "5boromapping@gmail.com",
      "Open Tasks": 0,
      "In Progress Tasks": 0,
      "Completed Tasks": 0,
      "Total Tasks": 0
    },
    {
      "Contact": "Preferred Bank | Sylvia Tseng",
      "Company": "Preferred Bank",
      "Email": "Sylvia.Tseng@PreferredBank.com",
      "Open Tasks": 0,
      "In Progress Tasks": 0,
      "Completed Tasks": 0,
      "Total Tasks": 0
    },
    {
      "Contact": "DGM CPA | George Mataev",
      "Company": "DGM CPA",
      "Email": "george@dgmcpany.com",
      "Open Tasks": 0,
      "In Progress Tasks": 0,
      "Completed Tasks": 0,
      "Total Tasks": 0
    },
    {
      "Contact": "Marcus Attorneys PLLC | Guillermo Santiago",
      "Company": "Marcus Attorneys PLLC",
      "Email": "santiago@marcusattorneys.com",
      "Open Tasks": 0,
      "In Progress Tasks": 0,
      "Completed Tasks": 0,
      "Total Tasks": 0
    },
    {
      "Contact": "MCAI Construction Services | Noel G Muir",
      "Company": "MCAI Construction Services",
      "Email": "mcai079@aol.com",
      "Open Tasks": 0,
      "In Progress Tasks": 0,
      "Completed Tasks": 0,
      "Total Tasks": 0
    },
    {
      "Contact": "Exterior Design Renterings | Andrew Melnikov",
      "Company": "Exterior Design Renterings",
      "Email": null,
      "Open Tasks": 0,
      "In Progress Tasks": 0,
      "Completed Tasks": 0,
      "Total Tasks": 0
    },
    {
      "Contact": "Yaker Engineering | Alex Yaker",
      "Company": "Yaker Engineering",
      "Email": "ayaker@yakereng.com",
      "Open Tasks": 0,
      "In Progress Tasks": 0,
      "Completed Tasks": 0,
      "Total Tasks": 0
    },
    {
      "Contact": "WJY MEP Consulting Services, Inc | Wei Wang",
      "Company": "WJY MEP Consulting Services, Inc",
      "Email": "weiwilliamworld@yahoo.com",
      "Open Tasks": 0,
      "In Progress Tasks": 0,
      "Completed Tasks": 0,
      "Total Tasks": 0
    }
  ],
  "budget": [
    {
      "Type": "Hard Costs",
      "Category": "General Condition",
      "Sub-Category": "Temp. Facility, Safety, Garbage",
      "Amount": 134000,
      "PSF": 13.4,
      "Status": "Open"
    },
    {
      "Type": "Hard Costs",
      "Category": "General Condition",
      "Sub-Category": "Sidewalk Shed and Scaffolding",
      "Amount": 120000,
      "PSF": 12,
      "Status": "Open"
    },
    {
      "Type": "Hard Costs",
      "Category": "General Condition",
      "Sub-Category": "Direct Labor",
      "Amount": 200000,
      "PSF": 20,
      "Status": "Open"
    },
    {
      "Type": "Hard Costs",
      "Category": "Foundation Site Work",
      "Sub-Category": "Demolition",
      "Amount": 225000,
      "PSF": 22.5,
      "Status": "Fixed"
    },
    {
      "Type": "Hard Costs",
      "Category": "Foundation Site Work",
      "Sub-Category": "Shoring",
      "Amount": 190000,
      "PSF": 19,
      "Status": "Fixed"
    },
    {
      "Type": "Hard Costs",
      "Category": "Foundation Site Work",
      "Sub-Category": "Excavation & Soil Disposal",
      "Amount": 220000,
      "PSF": 22,
      "Status": "Fixed"
    },
    {
      "Type": "Hard Costs",
      "Category": "Foundation Site Work",
      "Sub-Category": "Excavation (Existing Foundation)",
      "Amount": 0,
      "PSF": 0,
      "Status": "Fixed"
    },
    {
      "Type": "Hard Costs",
      "Category": "Foundation Site Work",
      "Sub-Category": "Footings, foundation Walls",
      "Amount": 265000,
      "PSF": 26.5,
      "Status": "Fixed"
    },
    {
      "Type": "Hard Costs",
      "Category": "Superstructure",
      "Sub-Category": "Concrete Superstructure",
      "Amount": 935000,
      "PSF": 93.5,
      "Status": "Fixed"
    },
    {
      "Type": "Hard Costs",
      "Category": "Superstructure",
      "Sub-Category": "Foundation Walls",
      "Amount": 50000,
      "PSF": 5,
      "Status": "Fixed"
    },
    {
      "Type": "Hard Costs",
      "Category": "Superstructure",
      "Sub-Category": "Foundation Slab",
      "Amount": 0,
      "PSF": 0,
      "Status": "Fixed"
    },
    {
      "Type": "Hard Costs",
      "Category": "Carpentry",
      "Sub-Category": "Exterior and Rough Framing",
      "Amount": 213000,
      "PSF": 21.3,
      "Status": "Fixed"
    },
    {
      "Type": "Hard Costs",
      "Category": "Carpentry",
      "Sub-Category": "Interior Carpentry",
      "Amount": 400000,
      "PSF": 40,
      "Status": "Fixed"
    },
    {
      "Type": "Hard Costs",
      "Category": "Carpentry",
      "Sub-Category": "Doors",
      "Amount": 90000,
      "PSF": 9,
      "Status": "Fixed"
    },
    {
      "Type": "Hard Costs",
      "Category": "Carpentry",
      "Sub-Category": "Tile",
      "Amount": 100000,
      "PSF": 10,
      "Status": "Fixed"
    },
    {
      "Type": "Hard Costs",
      "Category": "Carpentry",
      "Sub-Category": "Molding",
      "Amount": 25000,
      "PSF": 2.5,
      "Status": "Fixed"
    },
    {
      "Type": "Hard Costs",
      "Category": "Carpentry",
      "Sub-Category": "Installation of Cabinets",
      "Amount": 30000,
      "PSF": 3,
      "Status": "Fixed"
    },
    {
      "Type": "Hard Costs",
      "Category": "Carpentry",
      "Sub-Category": "Bathroom Accessory Installation",
      "Amount": 5000,
      "PSF": 0.5,
      "Status": "Fixed"
    },
    {
      "Type": "Hard Costs",
      "Category": "Carpentry",
      "Sub-Category": "Taping & Painting",
      "Amount": 129000,
      "PSF": 12.9,
      "Status": "Fixed"
    },
    {
      "Type": "Hard Costs",
      "Category": "Carpentry",
      "Sub-Category": "Hardwood",
      "Amount": 154000,
      "PSF": 15.4,
      "Status": "Fixed"
    },
    {
      "Type": "Hard Costs",
      "Category": "Carpentry",
      "Sub-Category": "Lobby finishes",
      "Amount": 100000,
      "PSF": 10,
      "Status": "Open"
    },
    {
      "Type": "Hard Costs",
      "Category": "Carpentry",
      "Sub-Category": "Closet Shelves, Woodwork and Etc.",
      "Amount": 20000,
      "PSF": 2,
      "Status": "Fixed"
    },
    {
      "Type": "Hard Costs",
      "Category": "Windows and Storefront",
      "Sub-Category": "Windows & Exterior Doors",
      "Amount": 150000,
      "PSF": 15,
      "Status": "Fixed"
    },
    {
      "Type": "Hard Costs",
      "Category": "Windows and Storefront",
      "Sub-Category": "Storefront",
      "Amount": 0,
      "PSF": 0,
      "Status": "Fixed"
    },
    {
      "Type": "Hard Costs",
      "Category": "Masonry and Stucco",
      "Sub-Category": "Block and Brick",
      "Amount": 140000,
      "PSF": 14,
      "Status": "Fixed"
    },
    {
      "Type": "Hard Costs",
      "Category": "Masonry and Stucco",
      "Sub-Category": "Metal Paneling",
      "Amount": 40000,
      "PSF": 4,
      "Status": "Open"
    },
    {
      "Type": "Hard Costs",
      "Category": "Masonry and Stucco",
      "Sub-Category": "Insulation",
      "Amount": 60000,
      "PSF": 6,
      "Status": "Open"
    },
    {
      "Type": "Hard Costs",
      "Category": "Masonry and Stucco",
      "Sub-Category": "Stucco",
      "Amount": 60000,
      "PSF": 6,
      "Status": "Open"
    },
    {
      "Type": "Hard Costs",
      "Category": "Roof",
      "Sub-Category": "Roof",
      "Amount": 60000,
      "PSF": 6,
      "Status": "Fixed"
    },
    {
      "Type": "Hard Costs",
      "Category": "Roof",
      "Sub-Category": "Green roof",
      "Amount": 50000,
      "PSF": 5,
      "Status": "Open"
    },
    {
      "Type": "Hard Costs",
      "Category": "Roof",
      "Sub-Category": "Roof Pavers",
      "Amount": 30000,
      "PSF": 3,
      "Status": "Fixed"
    },
    {
      "Type": "Hard Costs",
      "Category": "Roof",
      "Sub-Category": "Coping/Cornice",
      "Amount": 30000,
      "PSF": 3,
      "Status": "Fixed"
    },
    {
      "Type": "Hard Costs",
      "Category": "Elevator",
      "Sub-Category": "Controls, Microprocessor, etc.",
      "Amount": 100000,
      "PSF": 10,
      "Status": "Fixed"
    },
    {
      "Type": "Hard Costs",
      "Category": "Elevator",
      "Sub-Category": "Entrances, Cabs and Other Materials",
      "Amount": 100000,
      "PSF": 10,
      "Status": "Fixed"
    },
    {
      "Type": "Hard Costs",
      "Category": "Plumbing and Sprinkler",
      "Sub-Category": "Water and Sewer Main",
      "Amount": 30000,
      "PSF": 3,
      "Status": "Fixed"
    },
    {
      "Type": "Hard Costs",
      "Category": "Plumbing and Sprinkler",
      "Sub-Category": "Plumbing Underground and Risers",
      "Amount": 180000,
      "PSF": 18,
      "Status": "Fixed"
    },
    {
      "Type": "Hard Costs",
      "Category": "Plumbing and Sprinkler",
      "Sub-Category": "Gas Risers",
      "Amount": 56000,
      "PSF": 5.6,
      "Status": "Fixed"
    },
    {
      "Type": "Hard Costs",
      "Category": "Plumbing and Sprinkler",
      "Sub-Category": "Bathroom Fixtures",
      "Amount": 71000,
      "PSF": 7.1,
      "Status": "Fixed"
    },
    {
      "Type": "Hard Costs",
      "Category": "Plumbing and Sprinkler",
      "Sub-Category": "Installation of Fixtures",
      "Amount": 25000,
      "PSF": 2.5,
      "Status": "Fixed"
    },
    {
      "Type": "Hard Costs",
      "Category": "Plumbing and Sprinkler",
      "Sub-Category": "Pumps",
      "Amount": 50000,
      "PSF": 5,
      "Status": "Fixed"
    },
    {
      "Type": "Hard Costs",
      "Category": "Plumbing and Sprinkler",
      "Sub-Category": "Sprinkler",
      "Amount": 100000,
      "PSF": 10,
      "Status": "Fixed"
    },
    {
      "Type": "Hard Costs",
      "Category": "HVAC",
      "Sub-Category": "HVAC Equipment",
      "Amount": 200000,
      "PSF": 20,
      "Status": "Fixed"
    },
    {
      "Type": "Hard Costs",
      "Category": "HVAC",
      "Sub-Category": "Ductwork and Distribution",
      "Amount": 100000,
      "PSF": 10,
      "Status": "Fixed"
    },
    {
      "Type": "Hard Costs",
      "Category": "Electric",
      "Sub-Category": "Underground, Temporary, Deckwork",
      "Amount": 20000,
      "PSF": 2,
      "Status": "Fixed"
    },
    {
      "Type": "Hard Costs",
      "Category": "Electric",
      "Sub-Category": "Common Area",
      "Amount": 20000,
      "PSF": 2,
      "Status": "Fixed"
    },
    {
      "Type": "Hard Costs",
      "Category": "Electric",
      "Sub-Category": "Service Work and Risers",
      "Amount": 60000,
      "PSF": 6,
      "Status": "Fixed"
    },
    {
      "Type": "Hard Costs",
      "Category": "Electric",
      "Sub-Category": "Apartment Branch, Panels and Feeders",
      "Amount": 100000,
      "PSF": 10,
      "Status": "Fixed"
    },
    {
      "Type": "Hard Costs",
      "Category": "Electric",
      "Sub-Category": "Light Fixtures",
      "Amount": 60000,
      "PSF": 6,
      "Status": "Open"
    },
    {
      "Type": "Hard Costs",
      "Category": "Electric",
      "Sub-Category": "Fire Alarm",
      "Amount": 21000,
      "PSF": 2.1,
      "Status": "Fixed"
    },
    {
      "Type": "Hard Costs",
      "Category": "Electric",
      "Sub-Category": "Low Voltage",
      "Amount": 30000,
      "PSF": 3,
      "Status": "Open"
    },
    {
      "Type": "Hard Costs",
      "Category": "Miscellaneous Site Work",
      "Sub-Category": "Flatwork",
      "Amount": 20000,
      "PSF": 2,
      "Status": "Fixed"
    },
    {
      "Type": "Hard Costs",
      "Category": "Miscellaneous Site Work",
      "Sub-Category": "Landscaping",
      "Amount": 10000,
      "PSF": 1,
      "Status": "Fixed"
    },
    {
      "Type": "Hard Costs",
      "Category": "Miscellaneous Site Work",
      "Sub-Category": "Rear Yard",
      "Amount": 41000,
      "PSF": 4.1,
      "Status": "Fixed"
    },
    {
      "Type": "Hard Costs",
      "Category": "Equipment and Miscellaneous",
      "Sub-Category": "Trash Compactor and Chutes",
      "Amount": 28000,
      "PSF": 2.8,
      "Status": "Fixed"
    },
    {
      "Type": "Hard Costs",
      "Category": "Equipment and Miscellaneous",
      "Sub-Category": "Balconies",
      "Amount": 20000,
      "PSF": 2,
      "Status": "Open"
    },
    {
      "Type": "Hard Costs",
      "Category": "Kitchen, Bathrooms and Fixtures",
      "Sub-Category": "Cabinets, Countertops, Sinks & Faucets",
      "Amount": 150000,
      "PSF": 15,
      "Status": "Fixed"
    },
    {
      "Type": "Hard Costs",
      "Category": "Kitchen, Bathrooms and Fixtures",
      "Sub-Category": "Kitchen Appliances",
      "Amount": 100000,
      "PSF": 10,
      "Status": "Fixed"
    },
    {
      "Type": "Hard Costs",
      "Category": "Kitchen, Bathrooms and Fixtures",
      "Sub-Category": "Shower Doors",
      "Amount": 20000,
      "PSF": 2,
      "Status": "Fixed"
    },
    {
      "Type": "Hard Costs",
      "Category": "Overhead & Profit",
      "Sub-Category": "Overhead & Profit",
      "Amount": 450000,
      "PSF": 45,
      "Status": "Fixed"
    },
    {
      "Type": "Hard Costs",
      "Category": "Contingencies",
      "Sub-Category": "Miscellaneous",
      "Amount": 319350,
      "PSF": 31.935,
      "Status": "Fixed"
    },
    {
      "Type": "Land Costs",
      "Category": "Land Costs",
      "Sub-Category": "Land Costs",
      "Amount": 5800000,
      "PSF": 580,
      "Status": "Fixed"
    },
    {
      "Type": "Soft Costs",
      "Category": "Soft Costs",
      "Sub-Category": "Soft Costs",
      "Amount": 1605134,
      "PSF": 160.5134,
      "Status": "Fixed"
    },
    {
      "Type": "Soft Costs",
      "Category": "Soft Costs",
      "Sub-Category": "Interest Reserve",
      "Amount": 757743,
      "PSF": 75.7743,
      "Status": "Fixed"
    },
    {
      "Type": "Soft Costs",
      "Category": "Soft Costs",
      "Sub-Category": "Loan Fee",
      "Amount": 21500,
      "PSF": 2.15,
      "Status": "Fixed"
    }
  ],
  "expenses": [
    {
      "Date": "3/10/1023",
      "Type": "Deposit",
      "Category": null,
      "Vendor": null,
      "Memo": "Shiraz Contribution",
      "Debit": null,
      "Credit": 290000,
      "Balance": 290000
    },
    {
      "Date": "2023-03-10T00:00:00",
      "Type": "CHK",
      "Category": "Land Costs",
      "Vendor": null,
      "Memo": "Contract Deposit",
      "Debit": 290000,
      "Credit": null,
      "Balance": 0
    },
    {
      "Date": "2023-04-28T00:00:00",
      "Type": "Deposit",
      "Category": null,
      "Vendor": null,
      "Memo": "NYC Cleaning Contribution",
      "Debit": null,
      "Credit": 50000,
      "Balance": 50000
    },
    {
      "Date": "2023-04-28T00:00:00",
      "Type": "Zelle",
      "Category": "Soft Costs",
      "Vendor": "5 Borough Mapping NY",
      "Memo": null,
      "Debit": 750,
      "Credit": null,
      "Balance": 49250
    },
    {
      "Date": "2023-05-02T00:00:00",
      "Type": "Wire",
      "Category": "Soft Costs",
      "Vendor": "International Office of Architects",
      "Memo": "Deposit to Architect",
      "Debit": 20000,
      "Credit": null,
      "Balance": 29250
    },
    {
      "Date": "2023-05-12T00:00:00",
      "Type": "ACH",
      "Category": "Soft Costs",
      "Vendor": "Preferred Bank",
      "Memo": "Deposit for Aquisition Loan",
      "Debit": 5000,
      "Credit": null,
      "Balance": 24250
    },
    {
      "Date": "2023-05-17T00:00:00",
      "Type": "CHK",
      "Category": "Soft Costs",
      "Vendor": "Middleton Environmental",
      "Memo": "Phase 1",
      "Debit": 1800,
      "Credit": null,
      "Balance": 22450
    },
    {
      "Date": "2023-05-18T00:00:00",
      "Type": "ACH",
      "Category": "Soft Costs",
      "Vendor": "Stroh Engineering Services",
      "Memo": null,
      "Debit": 4500,
      "Credit": null,
      "Balance": 17950
    },
    {
      "Date": "2023-05-22T00:00:00",
      "Type": "ACH",
      "Category": "Soft Costs",
      "Vendor": "DGM CPA",
      "Memo": null,
      "Debit": 613,
      "Credit": null,
      "Balance": 17337
    },
    {
      "Date": "2023-06-15T00:00:00",
      "Type": "ACH",
      "Category": "Soft Costs",
      "Vendor": "DGM CPA",
      "Memo": "LLC Creation",
      "Debit": 375,
      "Credit": null,
      "Balance": 16962
    },
    {
      "Date": "2023-06-15T00:00:00",
      "Type": "ACH",
      "Category": "Soft Costs",
      "Vendor": "DGM CPA",
      "Memo": "LLC Creation",
      "Debit": 375,
      "Credit": null,
      "Balance": 16587
    },
    {
      "Date": "2023-07-11T00:00:00",
      "Type": "ACH",
      "Category": "Soft Costs",
      "Vendor": "Boyd Consulting",
      "Memo": "Reimbursed Investmates for payment to Expeditor for Demo",
      "Debit": 1800,
      "Credit": null,
      "Balance": 14787
    },
    {
      "Date": "2023-07-18T00:00:00",
      "Type": "ACH",
      "Category": "Soft Costs",
      "Vendor": "Marcus Attorneys PLLC",
      "Memo": "Review of Operating Agreement",
      "Debit": 1080,
      "Credit": null,
      "Balance": 13707
    },
    {
      "Date": "2023-08-17T00:00:00",
      "Type": "ACH",
      "Category": "Soft Costs",
      "Vendor": "Preferred Bank",
      "Memo": "Good Faith Deposit",
      "Debit": 350,
      "Credit": null,
      "Balance": 13357
    },
    {
      "Date": "2023-08-17T00:00:00",
      "Type": "ACH",
      "Category": "Soft Costs",
      "Vendor": "Exterior Design Renterings",
      "Memo": "Payment for Exterior Rendering",
      "Debit": 622.99,
      "Credit": null,
      "Balance": 12734.01
    },
    {
      "Date": "2023-08-29T00:00:00",
      "Type": "Deposit",
      "Category": null,
      "Vendor": null,
      "Memo": "NYC Cleaning Contribution",
      "Debit": null,
      "Credit": 50000,
      "Balance": 62734.01
    },
    {
      "Date": "2023-08-29T00:00:00",
      "Type": "Wire",
      "Category": "Soft Costs",
      "Vendor": "International Office of Architects",
      "Memo": "Second Payment to Architect",
      "Debit": 14427,
      "Credit": null,
      "Balance": 48307.01
    },
    {
      "Date": "2023-10-29T00:00:00",
      "Type": "ACH",
      "Category": "Soft Costs",
      "Vendor": "Yaker Engineering",
      "Memo": "Deposit for Structural and SSP",
      "Debit": 16650,
      "Credit": null,
      "Balance": 31657.01
    },
    {
      "Date": "2024-01-08T00:00:00",
      "Type": "Zelle",
      "Category": "Soft Costs",
      "Vendor": "WJY MEP Consulting Services, Inc",
      "Memo": "Deposit for MEP",
      "Debit": 4000,
      "Credit": null,
      "Balance": 27657.01
    },
    {
      "Date": "2024-02-15T00:00:00",
      "Type": "Deposit",
      "Category": null,
      "Vendor": null,
      "Memo": "NYC Cleaning Contribution",
      "Debit": null,
      "Credit": 10000,
      "Balance": 37657.01
    },
    {
      "Date": "2024-02-15T00:00:00",
      "Type": "Wire",
      "Category": "Soft Costs",
      "Vendor": "International Office of Architects",
      "Memo": "30% Payment for Design Documents",
      "Debit": 30000,
      "Credit": null,
      "Balance": 7657.01
    },
    {
      "Date": "2024-04-19T00:00:00",
      "Type": "Deposit",
      "Category": null,
      "Vendor": null,
      "Memo": "Morgan Stanley Interest Income",
      "Debit": null,
      "Credit": 2690.17,
      "Balance": 10347.18
    },
    {
      "Date": "2024-04-19T00:00:00",
      "Type": "Wire",
      "Category": null,
      "Vendor": null,
      "Memo": "Interest Payment to Solomon Isakov",
      "Debit": 2540.17,
      "Credit": null,
      "Balance": 7807.01
    },
    {
      "Date": "2024-06-18T00:00:00",
      "Type": "Deposit",
      "Category": null,
      "Vendor": null,
      "Memo": "Shiraz Contribution",
      "Debit": null,
      "Credit": 25000,
      "Balance": 32807.01
    },
    {
      "Date": "2024-06-20T00:00:00",
      "Type": "Wire",
      "Category": "Soft Costs",
      "Vendor": "International Office of Architects",
      "Memo": "Third Payment",
      "Debit": 26250,
      "Credit": null,
      "Balance": 6557.01
    }
  ],
  "contracts": [
    {
      "Date": "2023-05-01T00:00:00",
      "Vendor": "Stroh Engineering Services",
      "Contract Total": 9000,
      "Total Paid": 4500,
      "Total Remaining": 4500
    },
    {
      "Date": "2023-04-28T00:00:00",
      "Vendor": "International Office of Architects",
      "Contract Total": 100000,
      "Total Paid": 90677,
      "Total Remaining": 9323
    },
    {
      "Date": "2023-10-29T00:00:00",
      "Vendor": "Yaker Engineering",
      "Contract Total": 28650,
      "Total Paid": 16650,
      "Total Remaining": 12000
    },
    {
      "Date": "2024-01-05T00:00:00",
      "Vendor": "WJY MEP Consulting Services, Inc",
      "Contract Total": 15000,
      "Total Paid": 4000,
      "Total Remaining": 11000
    }
  ],
  "insurances": [
    {
      "Company": "Trysler",
      "Subcontractor": "Mason",
      "Contract Signed": "YES",
      "Subcontractor Rider": "YES",
      "Additional Insured": "YES",
      "Workers Comp": "YES",
      "General Liability": "State Farm Fire & Casulty",
      "Workers Comp Expiration": "2022-11-01T00:00:00",
      "Workers Comp Expiration (d)": -1283,
      "General Liability Expiration": "2023-02-04T00:00:00",
      "General Liability Expiration(d)": -1188
    },
    {
      "Company": "First Choice Pl",
      "Subcontractor": "Sewer",
      "Contract Signed": "YES",
      "Subcontractor Rider": "NO",
      "Additional Insured": "NO",
      "Workers Comp": "NO",
      "General Liability": null,
      "Workers Comp Expiration": null,
      "Workers Comp Expiration (d)": null,
      "General Liability Expiration": null,
      "General Liability Expiration(d)": null
    },
    {
      "Company": "Greenstar Electrical",
      "Subcontractor": "Electrician",
      "Contract Signed": "YES",
      "Subcontractor Rider": "YES",
      "Additional Insured": "YES",
      "Workers Comp": "YES",
      "General Liability": "Trisura Specialty Insurance Company",
      "Workers Comp Expiration": "2022-08-06T00:00:00",
      "Workers Comp Expiration (d)": -1370,
      "General Liability Expiration": "2022-08-06T00:00:00",
      "General Liability Expiration(d)": -1370
    },
    {
      "Company": "Otis Elevator",
      "Subcontractor": "Elevator",
      "Contract Signed": "YES",
      "Subcontractor Rider": "NO",
      "Additional Insured": "YES",
      "Workers Comp": "YES",
      "General Liability": null,
      "Workers Comp Expiration": null,
      "Workers Comp Expiration (d)": null,
      "General Liability Expiration": null,
      "General Liability Expiration(d)": null
    },
    {
      "Company": "Raymond Plumber",
      "Subcontractor": "Plumber",
      "Contract Signed": "YES",
      "Subcontractor Rider": "NO",
      "Additional Insured": null,
      "Workers Comp": null,
      "General Liability": null,
      "Workers Comp Expiration": null,
      "Workers Comp Expiration (d)": null,
      "General Liability Expiration": null,
      "General Liability Expiration(d)": null
    },
    {
      "Company": "Capri Construction Corp",
      "Subcontractor": "Foundation",
      "Contract Signed": "NO",
      "Subcontractor Rider": "NO",
      "Additional Insured": "YES",
      "Workers Comp": "YES",
      "General Liability": "Accredited Surety and Casualty Company, Inc.",
      "Workers Comp Expiration": "2023-01-01T00:00:00",
      "Workers Comp Expiration (d)": -1222,
      "General Liability Expiration": "2022-09-24T00:00:00",
      "General Liability Expiration(d)": -1321
    }
  ],
  "permits": [
    {
      "Address": "74-76 Congress Street",
      "Permit Type": "Fence",
      "Agency": "DOB",
      "Permit Number": "B00340452-I1-FN",
      "Contractor": "GIRON CONTRACTING INC",
      "Contact": "718-690-1370",
      "Superintendent": null,
      "Expiration": "2022-11-01T00:00:00",
      "Number of Days Left": -1283
    },
    {
      "Address": "74-76 Congress Street",
      "Permit Type": "Structural",
      "Agency": "DOB",
      "Permit Number": "B00340502-I1-ST",
      "Contractor": "GIRON CONTRACTING INC",
      "Contact": "718-690-1370",
      "Superintendent": null,
      "Expiration": "2022-11-01T00:00:00",
      "Number of Days Left": -1283
    },
    {
      "Address": "74-76 Congress Street",
      "Permit Type": "Sidewalk Shed & Wiring and Lights",
      "Agency": "DOB",
      "Permit Number": "B00542874-I1-EL",
      "Contractor": "V.VASS ELECTRIC CORP",
      "Contact": "347-662-4896",
      "Superintendent": null,
      "Expiration": "2022-07-20T00:00:00",
      "Number of Days Left": -1387
    },
    {
      "Address": "74-76 Congress Street",
      "Permit Type": "Temporary Pipe Scaffold Per Plan",
      "Agency": "DOB",
      "Permit Number": "B00542374-I1-SF",
      "Contractor": "CORE SCAFFOLD SYSTEMS INC",
      "Contact": "347-662-4896",
      "Superintendent": null,
      "Expiration": "2022-06-21T00:00:00",
      "Number of Days Left": -1416
    },
    {
      "Address": "74-76 Congress Street",
      "Permit Type": "Temporary Sidewalk Shed",
      "Agency": "DOB",
      "Permit Number": "B00542355-I1-SH",
      "Contractor": "CORE SCAFFOLD SYSTEMS INC",
      "Contact": "347-662-4896",
      "Superintendent": null,
      "Expiration": "2022-06-21T00:00:00",
      "Number of Days Left": -1416
    },
    {
      "Address": "74-76 Congress Street",
      "Permit Type": "Temporary Electrical on Job site",
      "Agency": "DOB",
      "Permit Number": "B00705224-I1-EL",
      "Contractor": "GREEN STAR ELECTRICAL",
      "Contact": "347-683-9222",
      "Superintendent": null,
      "Expiration": "2022-08-06T00:00:00",
      "Number of Days Left": -1370
    },
    {
      "Address": "74-76 Congress Street",
      "Permit Type": "0132 - INSTALL FENCE",
      "Agency": "DOT",
      "Permit Number": "B01-2022059-A00",
      "Contractor": "GIRON CONTRACTING INC",
      "Contact": "718-690-1370",
      "Superintendent": null,
      "Expiration": "2022-03-26T00:00:00",
      "Number of Days Left": -1503
    },
    {
      "Address": "74-76 Congress Street",
      "Permit Type": "0201 - PLACE MATERIAL ON STREET",
      "Agency": "DOT",
      "Permit Number": "B02-2022059-A00",
      "Contractor": "GIRON CONTRACTING INC",
      "Contact": "718-690-1370",
      "Superintendent": null,
      "Expiration": "2022-05-17T00:00:00",
      "Number of Days Left": -1451
    },
    {
      "Address": "74-76 Congress Street",
      "Permit Type": "0202 - CROSSING SIDEWALK",
      "Agency": "DOT",
      "Permit Number": "B02-2022059-A01",
      "Contractor": "GIRON CONTRACTING INC",
      "Contact": "718-690-1370",
      "Superintendent": null,
      "Expiration": "2022-05-17T00:00:00",
      "Number of Days Left": -1451
    },
    {
      "Address": "74-76 Congress Street",
      "Permit Type": "0215 - OCCUPANCY OF SIDEWALK AS STIPULATED",
      "Agency": "DOT",
      "Permit Number": "B02-2022059-A02",
      "Contractor": "GIRON CONTRACTING INC",
      "Contact": "718-690-1370",
      "Superintendent": null,
      "Expiration": "2022-06-10T00:00:00",
      "Number of Days Left": -1427
    },
    {
      "Address": "74-76 Congress Street",
      "Permit Type": "0221 - TEMP. CONST. SIGNS/MARKINGS",
      "Agency": "DOT",
      "Permit Number": "B02-2022147-D00",
      "Contractor": "GIRON CONTRACTING INC",
      "Contact": "718-690-1370",
      "Superintendent": null,
      "Expiration": "2022-08-17T00:00:00",
      "Number of Days Left": -1359
    },
    {
      "Address": "74-76 Congress Street",
      "Permit Type": "0204 - PLACE EQUIPMENT OTHER THAN CRANE OR",
      "Agency": "DOT",
      "Permit Number": "B02-2022059-A04",
      "Contractor": "GIRON CONTRACTING INC",
      "Contact": "718-690-1370",
      "Superintendent": null,
      "Expiration": "2022-05-17T00:00:00",
      "Number of Days Left": -1451
    }
  ],
  "lookup": [
    {
      "Company | Name": "Brookside Environmental | Richard Taylor",
      "Name": "Richard Taylor",
      "Company Name": "Brookside Environmental",
      "Office": "(631) 608-8810",
      "Mobile": "516-852-1631",
      "Email": "rtaylor@brooksideweb.com"
    },
    {
      "Company | Name": "Design Studio Associates NY Inc. | Renzo Bolarte",
      "Name": "Renzo Bolarte",
      "Company Name": "Design Studio Associates NY Inc.",
      "Office": "(718) 569-2112",
      "Mobile": "(516) 642-6960",
      "Email": "renzo@dsany.com"
    },
    {
      "Company | Name": "Engineering Solutions | Jeffrey Spivak",
      "Name": "Jeffrey Spivak",
      "Company Name": "Engineering Solutions",
      "Office": "212-840-1030 x204",
      "Mobile": null,
      "Email": "jeff@engsolu.com"
    },
    {
      "Company | Name": "Greenworks Lending from Nuveen | Crystal Smith",
      "Name": "Crystal Smith",
      "Company Name": "Greenworks Lending from Nuveen",
      "Office": "(212) 731-2717",
      "Mobile": null,
      "Email": "crystal.smith@nuveen.com"
    },
    {
      "Company | Name": "International Office of Architects | Murat Mutlu",
      "Name": "Murat Mutlu",
      "Company Name": "International Office of Architects",
      "Office": "(212) 564-0094",
      "Mobile": "(607) 262-0368",
      "Email": "murat@in-oa.com"
    },
    {
      "Company | Name": "IRL Systems | Brendan Lally",
      "Name": "Brendan Lally",
      "Company Name": "IRL Systems",
      "Office": null,
      "Mobile": null,
      "Email": "brendanl@irlsystems.com"
    },
    {
      "Company | Name": "Middleton Environmental | Thomas R. Tompkins",
      "Name": "Thomas R. Tompkins",
      "Company Name": "Middleton Environmental",
      "Office": "(631) 321-4300",
      "Mobile": null,
      "Email": "info@midenv.com"
    },
    {
      "Company | Name": "One Concrete | Izzy Lubart",
      "Name": "Izzy Lubart",
      "Company Name": "One Concrete",
      "Office": null,
      "Mobile": null,
      "Email": "Izzy@Oneconcrete.net"
    },
    {
      "Company | Name": "Peerless Products | Jamie McKnight",
      "Name": "Jamie McKnight",
      "Company Name": "Peerless Products",
      "Office": "401-487-6686",
      "Mobile": null,
      "Email": "repmcknight33@gmail.com"
    },
    {
      "Company | Name": "Pella Windows | Leo Zonenshein",
      "Name": "Leo Zonenshein",
      "Company Name": "Pella Windows",
      "Office": "646-773-6405",
      "Mobile": null,
      "Email": "LZonenshein@pellactny.com"
    },
    {
      "Company | Name": "Renovation Group | Daniel Kaykov",
      "Name": "Daniel Kaykov",
      "Company Name": "Renovation Group",
      "Office": null,
      "Mobile": "(718) 690-1370",
      "Email": "dan@renovationgroup.com"
    },
    {
      "Company | Name": "Rosen Law | Jaime Rosen Esq",
      "Name": "Jaime Rosen Esq",
      "Company Name": "Rosen Law",
      "Office": null,
      "Mobile": null,
      "Email": "jaime@rosenlawllc.com"
    },
    {
      "Company | Name": "Soil Safe | James Case",
      "Name": "James Case",
      "Company Name": "Soil Safe",
      "Office": "(516) 605-2110 x30346",
      "Mobile": "(516) 972-3896",
      "Email": "james.case@gflenv.com"
    },
    {
      "Company | Name": "StudioGallos Architecture | Frankie Nunez",
      "Name": "Frankie Nunez",
      "Company Name": "StudioGallos Architecture",
      "Office": "(718) 458-1518 x2102",
      "Mobile": null,
      "Email": "fnunez@studiogallos.com"
    },
    {
      "Company | Name": "| Mohammad Aftab",
      "Name": "Mohammad Aftab",
      "Company Name": null,
      "Office": "(917) 560-6994",
      "Mobile": null,
      "Email": "aftabshahnoc@gmail.com"
    },
    {
      "Company | Name": "Perciballi Industries Inc | Mike Perciballi",
      "Name": "Mike Perciballi",
      "Company Name": "Perciballi Industries Inc",
      "Office": "(347) 825-3781",
      "Mobile": "(646) 248-2012",
      "Email": "mikep@perciballiindustriesinc.com"
    },
    {
      "Company | Name": "Celtic Demolition | Mike",
      "Name": "Mike",
      "Company Name": "Celtic Demolition",
      "Office": null,
      "Mobile": "914-704-5511",
      "Email": "mike@cltgrp.com"
    },
    {
      "Company | Name": "North East Specialist Group | Nick Sopasoudakis",
      "Name": "Nick Sopasoudakis",
      "Company Name": "North East Specialist Group",
      "Office": null,
      "Mobile": "347-756-2641",
      "Email": "nsopas@northeastsg.com"
    },
    {
      "Company | Name": "Stroh Engineering Services  | Jeff Roberts",
      "Name": "Jeff Roberts",
      "Company Name": "Stroh Engineering Services",
      "Office": "631-669-7531",
      "Mobile": "516-351-2150",
      "Email": "jeff@strohengineering.com"
    },
    {
      "Company | Name": "Boyd Consulting | Andrea Boyd",
      "Name": "Andrea Boyd",
      "Company Name": "Boyd Consulting",
      "Office": "646-619-3620",
      "Mobile": null,
      "Email": "andrea@boydconsult.com"
    },
    {
      "Company | Name": "5 Borough Mapping NY | Raj Kumar",
      "Name": "Raj Kumar",
      "Company Name": "5 Borough Mapping NY",
      "Office": "516-652-9984",
      "Mobile": null,
      "Email": "5boromapping@gmail.com"
    },
    {
      "Company | Name": "Preferred Bank | Sylvia Tseng",
      "Name": "Sylvia Tseng",
      "Company Name": "Preferred Bank",
      "Office": "(347) 532-8038",
      "Mobile": null,
      "Email": "Sylvia.Tseng@PreferredBank.com"
    },
    {
      "Company | Name": "DGM CPA | George Mataev",
      "Name": "George Mataev",
      "Company Name": "DGM CPA",
      "Office": "718-530-4545",
      "Mobile": null,
      "Email": "george@dgmcpany.com"
    },
    {
      "Company | Name": "Marcus Attorneys PLLC | Guillermo Santiago",
      "Name": "Guillermo Santiago",
      "Company Name": "Marcus Attorneys PLLC",
      "Office": "718-233-2564",
      "Mobile": null,
      "Email": "santiago@marcusattorneys.com"
    },
    {
      "Company | Name": "MCAI Construction Services | Noel G Muir",
      "Name": "Noel G Muir",
      "Company Name": "MCAI Construction Services",
      "Office": "516-288-8546",
      "Mobile": null,
      "Email": "mcai079@aol.com"
    },
    {
      "Company | Name": "Exterior Design Renterings | Andrew Melnikov",
      "Name": "Andrew Melnikov",
      "Company Name": "Exterior Design Renterings",
      "Office": "380\u00a066\u00a0198\u00a07396",
      "Mobile": null,
      "Email": null
    },
    {
      "Company | Name": "Yaker Engineering | Alex Yaker",
      "Name": "Alex Yaker",
      "Company Name": "Yaker Engineering",
      "Office": "917-518-2032",
      "Mobile": null,
      "Email": "ayaker@yakereng.com"
    },
    {
      "Company | Name": "ADG Engineering | Aamer Islam",
      "Name": "Aamer Islam",
      "Company Name": "ADG Engineering",
      "Office": "212-288-7120",
      "Mobile": "917-509-4148",
      "Email": "aislam@axisd.com"
    },
    {
      "Company | Name": "Active Environmental Corp. | Romeo Santos",
      "Name": "Romeo Santos",
      "Company Name": "Active Environmental Corp.",
      "Office": "718-854-1111",
      "Mobile": null,
      "Email": "doncarllo@aol.com"
    },
    {
      "Company | Name": "WJY MEP Consulting Services, Inc | Wei Wang",
      "Name": "Wei Wang",
      "Company Name": "WJY MEP Consulting Services, Inc",
      "Office": "917-815-5366",
      "Mobile": null,
      "Email": "weiwilliamworld@yahoo.com"
    },
    {
      "Company | Name": "Safari Energy Engineering | Yoichi Chiba",
      "Name": "Yoichi Chiba",
      "Company Name": "Safari Energy Engineering",
      "Office": "347-506-0277",
      "Mobile": "929-204-9438",
      "Email": "jack@safariny.com"
    },
    {
      "Company | Name": "Regional Testing Corp | Pamela Fajek",
      "Name": "Pamela Fajek",
      "Company Name": "Regional Testing Corp",
      "Office": "347-221-0110",
      "Mobile": null,
      "Email": "pfajek@regionaltestingcorp.com"
    },
    {
      "Company | Name": "|",
      "Name": null,
      "Company Name": null,
      "Office": null,
      "Mobile": null,
      "Email": null
    },
    {
      "Company | Name": "|",
      "Name": null,
      "Company Name": null,
      "Office": null,
      "Mobile": null,
      "Email": null
    },
    {
      "Company | Name": "|",
      "Name": null,
      "Company Name": null,
      "Office": null,
      "Mobile": null,
      "Email": null
    },
    {
      "Company | Name": "|",
      "Name": null,
      "Company Name": null,
      "Office": null,
      "Mobile": null,
      "Email": null
    },
    {
      "Company | Name": "|",
      "Name": null,
      "Company Name": null,
      "Office": null,
      "Mobile": null,
      "Email": null
    }
  ],
  "financialSummary": {
    "budgetTotal": 14890727.0,
    "expenseDebits": 421133.16,
    "expenseCredits": 427690.17,
    "contractTotal": 152650.0,
    "contractPaid": 115827.0,
    "contractRemaining": 36823.0
  }
};
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
