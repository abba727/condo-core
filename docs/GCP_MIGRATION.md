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
