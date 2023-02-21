import { convertDateToUnixTimestamp } from 'chrono-utils';

import { EventDto } from '../../interfaces/Event';
import { Parser, PayloadInput } from '../../interfaces/Parser';
import { MikroLog } from 'mikrolog';
import { metadataConfig } from '../../config/metadata';

import {
  MissingEventTimeError,
  MissingEventError,
  MissingIdError,
  MissingShortcutFieldsError
} from '../errors/errors';

/**
 * @description Parser adapted for Shortcut.
 */
export class ShortcutParser implements Parser {
  /**
   * @description Shortcut only handles Incidents, so this simply returns a hard coded value for it.
   */
  public getEventType(): string {
    return 'incident';
  }

  /**
   * @description Get payload fields from the right places.
   */
  public getPayload(payloadInput: PayloadInput): EventDto {
    const logger = MikroLog.start({ metadataConfig: metadataConfig });
    const body = payloadInput.body || {};

    logger.info(body);

    const event = (() => {
      const eventType = body?.['actions']?.[0]?.['action'];
      if (eventType === 'created') return 'opened';
/*
      if (eventType === 'issue_generic') {
        const resolved = body?.changelog.items.filter(
          (item: any) => item.field === 'resolution' && item.toString === 'Done'
        );
        if (resolved.length > 0) return 'closed';
      }
*/
      if (eventType === 'updated') {
//        if (body?.['changes']?.['status']?.['new'] === 'resolved') return 'closed';
//        if (body?.['changelog']?.['items'][0]?.['toString'] === 'incident') return 'labeled';
//        if (body?.['changelog']?.['items'][0]?.['toString'] !== 'incident') return 'unlabeled';
      }
      if (eventType === 'deleted') return 'deleted';
      return eventType;
    })();

    if (!event) throw new MissingEventError();

    switch (event) {
      case 'opened':
        return this.handleOpenedLabeled(body, true);
      case 'labeled':
        return this.handleOpenedLabeled(body);
      case 'closed':
      case 'unlabeled':
      case 'deleted':
//        return this.handleClosedUnlabeled(body);
      default:
        return {
          eventTime: 'UNKNOWN',
          timeCreated: 'UNKNOWN',
          id: 'UNKNOWN',
          message: 'UNKNOWN'
        };
    }
  }
/*
https://ehawkinc.slack.com/apps/AKEEF9DTM-launchdarkly?tab=more_info
https://slack.com/help/articles/360041352714-Create-more-advanced-workflows-using-webhooks
{
  "meanTimeToRecovery": "Example text",
  "deploymentFrequency": "Example text",
  "changeFailureRate": "Example text",
  "leadTimeForChange": "Example text",
  "chartUrl": "Example text"    https://quickchart.io/documentation/
}


  https://api.app.shortcut.com
  export SHORTCUT_API_TOKEN="YOUR API TOKEN HERE"
    Shortcut-Token
    https://developer.shortcut.com/api/rest/v3#Get-Story

  Get timeCreated 
  action: deleted, api-call Shortcut API ['primary_id']
  action: update, api-call Shortcut API ['primary_id']
  action: create, ['changed_at']

  curl -X GET \
  -H "Content-Type: application/json" \
  -H "Shortcut-Token: $SHORTCUT_API_TOKEN" \
  -L "https://api.app.shortcut.com/api/v3/stories/{story-public-id}"

  https://developer.shortcut.com/api/rest/v3#Responses-91306
    started_at
      started_at_override

    "labels": [{
        "app_url": "foo",
        "archived": true,
        "color": "#6515dd",
        "created_at": "2016-12-31T12:30:00Z",
        "description": "foo",
        "entity_type": "foo",
        "external_id": "foo",
        "id": 123,
        "name": "foo",
        "updated_at": "2016-12-31T12:30:00Z"
      }],
      */
  /**
   * @description Utility to create an incident.
   */
  private handleOpenedLabeled(body: Record<string, any>, opened: boolean = false) {
    const timeCreated = opened ? body?.['changed_at'] : body?.['changed_at']; // body?.['issue']?.['fields']?.['created'];

    if (!timeCreated)
      throw new MissingEventTimeError('Missing expected timestamp in handleOpenedLabeled()!');

    const id = body?.['primary_id'];
    if (!id) throw new MissingIdError('Missing ID in handleOpenedLabeled()!');

    const title = body?.['actions'][0]?.['name'] || '';

    return {
      eventTime: Date.now().toString(),
      timeCreated: convertDateToUnixTimestamp(timeCreated),
      timeResolved: '',
      id: id.toString(),
      title,
      message: JSON.stringify(body)
    };
  }

//  /**
//   * @description Utility to resolve an incident.
//   */
/*
  private handleClosedUnlabeled(body: Record<string, any>) {
    const timeCreated = body?.['changed_at']; // body?.['issue']?.['fields']?.['created'];
    if (!timeCreated)
      throw new MissingEventTimeError('Missing expected timestamp in handleClosedUnlabeled()!');

    const timeResolved = body?.['changed_at'];
    if (!timeResolved)
      throw new MissingEventTimeError(
        'Missing expected updated/resolved timestamp in handleClosedUnlabeled()!'
      );

    const id = body?.['primary_id'];
    if (!id) throw new MissingIdError('Missing ID in handleClosedUnlabeled()!');

    const title = body?.['actions'][0]?.['name'] || '';

    return {
      eventTime: Date.now().toString(),
      timeCreated: convertDateToUnixTimestamp(timeCreated),
      timeResolved: convertDateToUnixTimestamp(timeResolved),
      id: id.toString(),
      title,
      message: JSON.stringify(body)
    };
  }
*/
  /**
   * @description Get the repository name.
   * @example `https://bitbucket.org/SOMEORG/SOMEREPO/src/master/`
   * @example `https://bitbucket.org/SOMEORG/SOMEREPO/`
   * @example `https://github.com/SOMEORG/SOMEREPO`
   */
  public getRepoName(body: Record<string, any>): string {
   
    const fields: Record<string, any> = body?.issue?.fields;
    if (!fields) throw new MissingShortcutFieldsError();
 /*
    const matchedCustomFieldKey: string =
      Object.keys(fields).filter(
        (key: string) =>
          typeof fields[key] === 'string' &&
          key.startsWith('customfield_') &&
          (fields[key].startsWith('https://bitbucket.org/') ||
            fields[key].startsWith('https://github.com/'))
      )[0] || '';

    if (!matchedCustomFieldKey) throw new MissingShortcutMatchedCustomFieldKeyError();

    const repoName: string = fields[matchedCustomFieldKey]
      .replace('https://bitbucket.org/', '')
      .replace('https://github.com/', '')
      .split('/src/')[0];
  */
    const repoName: string = "eHawk";
    return repoName;
  }
  
}
