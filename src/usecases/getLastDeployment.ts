import { createNewDorametrix } from '../domain/services/Dorametrix';
import { Deployment } from '../interfaces/Deployment';

import { DeploymentResponse } from '../interfaces/DeploymentResponse';
import { RequestDTO } from '../interfaces/Input';
import { Repository } from '../interfaces/Repository';

/**
 * @description The use-case for getting the commit ID for the last production deployment.
 */
export async function getLastDeployment(
  repository: Repository,
  input: RequestDTO
): Promise<DeploymentResponse> {
  const { repo } = input;

  const lastDeploymentMetric = await repository.getMetrics({
    fromDate: '0',
    toDate: '3000000000000',
    key: `DEPLOYMENT_${repo}`,
    getLastDeployedCommit: true
  });
  const lastDeploymentData = lastDeploymentMetric[0] as Deployment;

  const dorametrix = createNewDorametrix(repo);

  return dorametrix.getLastDeployment(lastDeploymentData);
}
