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

The exported source database contains 22 tables. Two legacy source document references (`documents/fKkSlo-p7Bvg.pdf` and `documents/u0q7_7M5C7we.pdf`) return HTTP 403 from the source storage service and remain explicitly tracked as unrecoverable until source access can be restored or replacement files are supplied.

The Cloud Build configuration lives in `cloudbuild.yaml`. Its deployment path is Cloud Build → Artifact Registry → Cloud Run, with Cloud Run attached to Cloud SQL and the private storage bucket. After the repository mapping is refreshed in Cloud Build, create the `main` push trigger using the configuration in that file.

The Google Cloud Build GitHub App installation is configured with **only selected repositories**, and the selected set includes **`abba727/condo-core`**. Cloud Build’s connection dialog initially showed a stale repository list, so the repository mapping must be refreshed in Cloud Build before creating the trigger.

The first GitHub-triggered build completed successfully on **2026-08-13**. Trigger `condocore-main` executed build `2f460451-e103-4326-a403-8ec95e88d814` for commit `d22fd92af5aab6f02f9274ae2bb245669594ae2e`, created the Cloud Run image in Artifact Registry, and completed the deployment step.

Cloud Run’s generated `run.app` URLs returned a Google-branded 404 before requests reached the revision, despite a ready, public service. The workaround is the external application load balancer at **`136.68.220.42`**, backed by the global URL map `condocore-url-map`, backend service `condocore-run-backend`, and serverless NEG `condocore-run-neg`. Both `GET /` and the database-backed `budget.listGroups` tRPC endpoint return HTTP 200 through this load balancer. A user-controlled DNS name is still needed to provision a Google-managed TLS certificate and expose this endpoint over HTTPS.
