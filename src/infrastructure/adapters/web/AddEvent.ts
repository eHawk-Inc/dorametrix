import { MikroLog } from 'mikrolog';
import { MikroMetric } from 'mikrometric';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

import { makeEvent } from '../../../domain/valueObjects/Event';

import { getParser } from '../../../application/getParser';

import { createEvent } from '../../../usecases/createEvent';

import { createNewDynamoDbRepository } from '../../repositories/DynamoDbRepository';

import { metadataConfig } from '../../../config/metadata';

/**
 * @description The controller for our service that handles incoming new events.
 */
export async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  const logger = MikroLog.start({ metadataConfig, event, context });
  MikroMetric.start({
    namespace: metadataConfig.service,
    serviceName: metadataConfig.service,
    event,
    context
  });

  try {
    const body = event.body && typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    const headers = event.headers;

    const repo = createNewDynamoDbRepository();
    logger.info("here here here");
    logger.info(headers);
    const parser = await getParser(headers);
    logger.info("here 0");
    const metricEvent = await makeEvent(parser, body, headers);

    logger.info("event type is: " + metricEvent.eventType);
    await createEvent(repo, metricEvent);
    logger.info("all done");

    return {
      statusCode: 204,
      body: ''
    };
  } catch (error: any) {
    const statusCode: number = error?.['cause']?.['statusCode'] || 400;
    const message: string = error.message;
    logger.error(error);

    return {
      statusCode,
      body: JSON.stringify(message)
    };
  }
}
