/**
 * useProjectsDb
 * Provides database-backed project data, contracts, insurances, permits, and plan tasks via tRPC.
 */
import { trpc } from "@/lib/trpc";

const PROJECT_ID = "712-driggs";

export function useProjectsDb() {
  const projectQuery = trpc.projects.get.useQuery({ id: PROJECT_ID });
  const contractsQuery = trpc.projects.listContracts.useQuery({ projectId: PROJECT_ID });
  const insurancesQuery = trpc.projects.listInsurances.useQuery({ projectId: PROJECT_ID });
  const permitsQuery = trpc.projects.listPermits.useQuery({ projectId: PROJECT_ID });
  const planTasksQuery = trpc.projects.listPlanTasks.useQuery({ projectId: PROJECT_ID });

  const project = projectQuery.data ?? null;
  const contracts = contractsQuery.data ?? [];
  const insurances = insurancesQuery.data ?? [];
  const permits = permitsQuery.data ?? [];
  const planTasks = planTasksQuery.data ?? [];

  return {
    project,
    contracts,
    insurances,
    permits,
    planTasks,
    isLoading:
      projectQuery.isLoading ||
      contractsQuery.isLoading ||
      insurancesQuery.isLoading ||
      permitsQuery.isLoading ||
      planTasksQuery.isLoading,
  };
}
