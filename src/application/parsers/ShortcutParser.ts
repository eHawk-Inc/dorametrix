import axios from 'axios';
import { convertDateToUnixTimestamp } from 'chrono-utils';

import { EventDto } from '../../interfaces/Event';
import { EventTypeInput, Parser, PayloadInput } from '../../interfaces/Parser';
import { MikroLog } from 'mikrolog';
import { metadataConfig } from '../../config/metadata';

import {
  MissingEventTimeError,
  MissingEventError,
  MissingIdError,
  MissingShortcutFieldsError,
  UnknownEventTypeError
} from '../errors/errors';

/**
 * @description Parser adapted for Shortcut.
 */
export class ShortcutParser implements Parser {

  restData: any = {}
  /**
   * @description Shortcut only handles Incidents, so this simply returns a hard coded value for it.
   */
  public getEventType(eventTypeInput: EventTypeInput): string {
    const logger = MikroLog.start({ metadataConfig: metadataConfig });
    logger.info("going into async call");
    
    
    var asyncComplete = false;
    (async () => {
      try {
        let response = await axios.get("https://api.app.shortcut.com/api/v3/stories/2507", { headers: {"Shortcut-Token" : "64060923-33b7-457f-91ea-4db7893273fa"}});
        this.setShortcutApiData(response)
        asyncComplete = true;
      } catch (e) {
        logger.info("error in async");
      } finally {
        logger.info("async is complete");
        asyncComplete = true;
      }
    })()

    //this.sleep(6000);
    logger.info("rest data object: " + this.restData);
    logger.info("rest data object app url: " + this.restData.app_url);

    const payloadInput: PayloadInput = eventTypeInput;
    logger.info("in get event type");
    logger.info(payloadInput);
    const isIncident = this.isIncident(payloadInput);
    if (isIncident) { // incident label added
      return "incident";
    }
    const movedToReadyForDeployment = this.movedToReadyForDeployment(payloadInput);
    if (movedToReadyForDeployment) { // in ready for deployment - ticket will contain all commits that it will have
      return "change"
    }
    logger.info("shortcut parser - event is not an incident or change")
    throw new UnknownEventTypeError();
  }

  private sleep(miliseconds: number) {
    var currentTime = new Date().getTime();
 
    while (currentTime + miliseconds >= new Date().getTime()) {
    }
 }

  private dummy() {
    const logger = MikroLog.start({ metadataConfig: metadataConfig });
    logger.info("in the set time out");
  }

  private setShortcutApiData(response: any) {
    const logger = MikroLog.start({ metadataConfig: metadataConfig });
    logger.info("in setShortcutApi");
    logger.info(response.data);
    logger.info(response.status);
    this.restData = response.data
  }

  private movedToReadyForDeployment(payloadInput: PayloadInput) {
    const references = payloadInput.body?.['references']
    if (!references) {
      return false
    }
    var movedToReadyForDeployment = false;
    var isNewWorkflowState = false
    var newWorkflowStateId = 0
    references.forEach(
      (reference: any) => {
        if (reference.entity_type === "workflow-state" && reference.name === "Ready for Deployment") {
          isNewWorkflowState = true;
          newWorkflowStateId = reference.id
        }
      }
    )
    if (!isNewWorkflowState) return false;

    payloadInput.body?.['actions'].forEach(
      (action: any) => {
        if (action.changes?.workflow_state_id?.new !== undefined) { // this check didn't work when i accidentally left off the "_id"...
          if (action.changes.workflow_state_id.new === newWorkflowStateId) {
            movedToReadyForDeployment = true;
          }
        }
      }
    )
    return movedToReadyForDeployment;
  }

  private movedToDeployed(payloadInput: PayloadInput) {
    const references = payloadInput.body?.['references']
    if (!references) {
      return false
    }
    var movedToDeployed = false;
    var isNewWorkflowState = false
    var newWorkflowStateId = 0
    references.forEach(
      (reference: any) => {
        if (reference.entity_type === "workflow-state" && reference.name === "Deployed") {
          isNewWorkflowState = true;
          newWorkflowStateId = reference.id
        }
      }
    )
    if (!isNewWorkflowState) return false;

    payloadInput.body?.['actions'].forEach(
      (action: any) => {
        if (action.changes?.workflow_state_id?.new !== undefined) { // this check didn't work when i accidentally left off the "_id"...
          if (action.changes.workflow_state_id.new === newWorkflowStateId) {
            movedToDeployed = true;
          }
        }
      }
    )
    return movedToDeployed;
  }

  private  isIncident(payloadInput: PayloadInput) {
    //const hasIncidentLable = await this.hasIncidentLabel(payloadInput);
    const logger = MikroLog.start({ metadataConfig: metadataConfig });
    logger.info("in is incident");
      
      
    return this.isIncidentLabelAdded(payloadInput) ||
       this.isIncidentLabelRemoved(payloadInput) ||
       (this.movedToDeployed(payloadInput) && this.hasIncidentLabel(payloadInput));
  }

  private async hasIncidentLabel(payloadInput: PayloadInput) {
    // shortcut api call with ticket number
    // extract labels - if incident lable, return true
    
    
    return false;
  }

  // private async getResponse(payloadInput: PayloadInput) {
  //   const storyId = payloadInput.body?.primaryId;
  //   return await axios.get("https://api.app.shortcut.com/api/v3/stories/" + storyId, { headers: {"Shortcut-Token" : "64060923-33b7-457f-91ea-4db7893273fa"}});
  // }

  private isIncidentLabelRemoved(payloadInput: PayloadInput) {
     // label added case - incident opened
     const logger = MikroLog.start({ metadataConfig: metadataConfig });
     const references = payloadInput.body?.['references']
     if (!references) {
       return false
     }
     var isIncident = false;
     var incidentLabel = false
     var labelId = 0
     references.forEach(
       (reference: any) => {
         if (reference.entity_type === "label" && reference.name === "Incident") {
           incidentLabel = true;
           labelId = reference.id
         }
       }
     )
     if (!incidentLabel) return false;
 
     payloadInput.body?.['actions'].forEach(
       (action: any) => {
         if (action.changes?.label_ids?.removes !== undefined) {
           action.changes.label_ids.removes.forEach((added_label_id: any) => {
             if (added_label_id === labelId) {
               isIncident = true;
             }
           });
         }
       }
     )
 
     return isIncident;
  }

  private isIncidentLabelAdded(payloadInput: PayloadInput) {
       // label added case - incident opened
       const logger = MikroLog.start({ metadataConfig: metadataConfig });
       const references = payloadInput.body?.['references']
       if (!references) {
         return false
       }
       var isIncident = false;
       var incidentLabel = false
       var labelId = 0
       references.forEach(
         (reference: any) => {
           if (reference.entity_type === "label" && reference.name === "Incident") {
             incidentLabel = true;
             labelId = reference.id
           }
         }
       )
       if (!incidentLabel) return false;
   
       payloadInput.body?.['actions'].forEach(
         (action: any) => {
          logger.info("here 3");
          logger.info(action.changes.label_ids);
          logger.info(action.changes.label_ids.adds);
           if (action.changes?.label_ids?.adds !== undefined) {
             action.changes.label_ids.adds.forEach((added_label_id: any) => {
               if (added_label_id === labelId) {
                 isIncident = true;
               }
             });
           }
         }
       )
   
       return isIncident;
  }

  private isIncidentClosed(payloadInput: PayloadInput) {
    return this.isIncidentLabelRemoved(payloadInput) ||
          (this.movedToDeployed(payloadInput) && this.hasIncidentLabel(payloadInput));
  }

  private isIncidentOpened(payloadInput: PayloadInput) {
    return this.isIncidentLabelAdded(payloadInput);
  }

  /**
   * @description Get payload fields from the right places.
   */
  public getPayload(payloadInput: PayloadInput): EventDto {
    const logger = MikroLog.start({ metadataConfig: metadataConfig });
    logger.info("here 1")
    const body = payloadInput.body || {};

    logger.info(body);

    const eventType = this.getEventType(payloadInput)
    if (eventType === "incident") {
      if (this.isIncidentOpened(payloadInput)){
        return this.handleIncidentOpened(payloadInput);
      }
      if (this.isIncidentClosed(payloadInput)) {
        return this.handleIncidentClosed(payloadInput);
      }
    }

    if (eventType === "change") {
      return this.handleChange(body);
    }
    //throw new MissingEventError()


    
    return {
      eventTime: 'UNKNOWN',
      timeCreated: 'UNKNOWN',
      id: 'UNKNOWN',
      message: 'UNKNOWN'
    };
    
  }

  private handleChange(body: Record<string, any>) {
    // const storyId = body?.['actions']?.['id'];
    // //const data = await axios.get("https://api.app.shortcut.com/api/v3/stories/" + storyId, { headers: {"Shortcut-Token" : "64060923-33b7-457f-91ea-4db7893273fa"}});

    // const timeCreated = body?.['head_commit']?.['timestamp'];
    // if (!timeCreated)
    //   throw new MissingEventTimeError('Missing expected timestamp in handlePush()!');
    // const id = body?.['head_commit']?.['id'];
    // if (!id) throw new MissingIdError('Missing ID in handlePush()!');

    return {
      eventTime: Date.now().toString(),
      timeCreated: convertDateToUnixTimestamp(Date.now().toString()),
      id: "id",//id.toString(),
      message: JSON.stringify(body)
    };
  }

  private handleIncidentOpened(body: Record<string, any>) {
    return {
      eventTime: Date.now().toString(),
      timeCreated: convertDateToUnixTimestamp(Date.now().toString()),
      id: "id",//id.toString(),
      message: JSON.stringify(body)
    };
  }

  private handleIncidentClosed(body: Record<string, any>) {
    return {
      eventTime: Date.now().toString(),
      timeCreated: convertDateToUnixTimestamp(Date.now().toString()),
      id: "id",//id.toString(),
      message: JSON.stringify(body)
    };
  }

  
  /**
   * @description Get the repository name.
   * @example `https://bitbucket.org/SOMEORG/SOMEREPO/src/master/`
   * @example `https://bitbucket.org/SOMEORG/SOMEREPO/`
   * @example `https://github.com/SOMEORG/SOMEREPO`
   */
  public getRepoName(body: Record<string, any>): string {
   
 
    const repoName: string = "eHawk";
    return repoName;
  }
  
}
