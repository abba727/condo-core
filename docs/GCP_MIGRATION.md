# CondoCore Google Cloud Migration

The target project is **`condo-core-505419`** in **`us-east4`**. The initial public Cloud Run deployment intentionally has no application login layer, per the project owner’s direction. Authentication is a deferred hardening item.

| Component | Target resource | Current state |
|---|---|---|
| Cloud Run | `condocore` | Initial revision `condocore-00001-z7g` built and deployed through Cloud Build. |
| Cloud SQL | `condocore-mysql` / database `condocore` | Provisioned with 22 source tables imported. |
| Cloud Storage | `gs://condocore-505419-files` | Private bucket created; three retrievable application assets copied. |
| Artifact Registry | `us-east4-docker.pkg.dev/condo-core-505419/condocore` | Docker repository created. |
| Secret Manager | `condocore-db-password` | Cloud Run database password stored and mounted as `DB_PASSWORD`. |
| GitHub App | Google Cloud Build installation | `abba727/condo-core` is already selected in the GitHub App’s repository-access configuration. |

The exported source database contains 22 tables. Two legacy source document references returned HTTP 403 from the source storage service:

| Storage key | Attached bid | Business context |
|---|---|---|
| `documents/fKkSlo-p7Bvg.pdf` | **Doma Architect PC** — bid ID 1 | `PROPOSAL 20260604_712 DRIGGS AVENUE - Architect's Report.pdf`; approved **$12,900** proposal for **17.02 — Architect's Report / DOF Tax Maps**, dated June 4, 2026. |
| `documents/u0q7_7M5C7we.pdf` | **Edge Concrete** — bid ID 30001 | `712 Driggs Ave Proposal 06.04.26.pdf`; pending **$1,600,000** proposal for **03.01 — Concrete Superstructure**, dated June 17, 2026. |

With the owner’s approval, their `fileKey` and `fileUrl` references were cleared in Cloud SQL. The original document names, bid links, amounts, statuses, and an explicit migration-unavailable note remain, so the business record is preserved without any broken dependency on the source storage service.

The Cloud Build configuration lives in `cloudbuild.yaml`. Its deployment path is Cloud Build → Artifact Registry → Cloud Run, with Cloud Run attached to Cloud SQL and the private storage bucket. After the repository mapping is refreshed in Cloud Build, create the `main` push trigger using the configuration in that file.

The Google Cloud Build GitHub App installation is configured with **only selected repositories**, and the selected set includes **`abba727/condo-core`**. Cloud Build’s connection dialog initially showed a stale repository list, so the repository mapping must be refreshed in Cloud Build before creating the trigger.

The first GitHub-triggered build completed successfully on **2026-08-13**. Trigger `condocore-main` executed build `2f460451-e103-4326-a403-8ec95e88d814` for commit `d22fd92af5aab6f02f9274ae2bb245669594ae2e`, created the Cloud Run image in Artifact Registry, and completed the deployment step.

Cloud Run’s generated `run.app` URLs returned a Google-branded 404 before requests reached the revision, despite a ready, public service. The workaround is the external application load balancer at **`136.68.220.42`**, backed by the global URL map `condocore-url-map`, backend service `condocore-run-backend`, and serverless NEG `condocore-run-neg`. Both `GET /` and the database-backed `budget.listGroups` tRPC endpoint return HTTP 200 through this load balancer. A user-controlled DNS name is still needed to provision a Google-managed TLS certificate and expose this endpoint over HTTPS.

## Validation and recovery

The application is validated through the public load balancer at `http://136.68.220.42`: `GET /healthz` returns `200 {"ok":true}` and the database-backed `budget.listGroups` tRPC request returns HTTP 200. The active Cloud Run revision is `condocore-00005-25z`; the most recent main-branch Cloud Build deployment completed successfully on 2026-08-14. The private Cloud Storage bucket contains the three retrievable migrated objects.

For recovery, Cloud Run revisions and Cloud Build build history remain available in project `condo-core-505419`, while the GitHub `main` branch is the deployment source of truth. The public IP is reserved as `condocore-lb-ip`. The legacy managed-environment data should not be destroyed until the owner explicitly approves final decommissioning; authentication and a custom-domain HTTPS frontend are intentionally deferred.
