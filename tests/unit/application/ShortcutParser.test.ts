import axios from 'axios';
import { ShortcutParser } from '../../../src/application/parsers/ShortcutParser';

//jest.mock('axios');
import { convertDateToUnixTimestamp } from 'chrono-utils';


import {
//  MissingEventTimeError,
//  MissingEventError,
  MissingIdError,
//  MissingJiraFieldsError,
//  MissingJiraMatchedCustomFieldKeyError
} from '../../../src/application/errors/errors';


//process.env.SHORTCUT_TOKEN = "7c874900-b038-4ac8-89d6-813d6daea148";

const webHookIncoming_16927 = {
  id: "595285dc-9c43-4b9c-a1e6-0cd9aff5b084",
  changed_at: "2017-06-27T16:20:44Z",
  primary_id: 16927,
  member_id: "56d8a839-1c52-437f-b981-c3a15a11d6d4",
  version: "v1",
  actions: [
    {
      id: 16927,
      entity_type: "story",
      action: "update",
      name: "test story",
      changes: {
        started: {
          new: true,
          old: false
        },
        workflow_state_id: {
          new: 1495,
          old: 1493
        },
        owner_ids: {
          adds: ["56d8a839-1c52-437f-b981-c3a15a11d6d4"]
        }
      }
    }
  ]
}


const webHookIncoming_labeled_16927 = {
  id: "595285dc-9c43-4b9c-a1e6-0cd9aff5b084",
  changed_at: "2017-06-27T16:20:44Z",
  primary_id: 16927,
  member_id: "56d8a839-1c52-437f-b981-c3a15a11d6d4",
  version: "v1",
  actions: [
    {
        "id": 2507,
        "entity_type": "story",
        "action": "update",
        "name": "Deploy current product to np-usea1-3",
        "story_type": "feature",
        "app_url": "https://app.shortcut.com/ehawk/story/2507",
        "changes": {
            "label_ids": {
                "adds": [
                    2805
                ]
            }
        }
    }
  ],
  "references": [
      {
          "id": 2805,
          "entity_type": "label",
          "name": "Incident",
          "app_url": "https://app.shortcut.com/ehawk/label/2805"
      }
  ]
}

const specificStoryData : Record<string, any> = {
  "archived": false,
  "completed": false,
  //"completed_at": "2016-12-31T12:30:00Z",
  //"completed_at_override": "2017-12-31T12:30:00Z",
  "created_at": "2016-12-31T12:30:00Z",
  "id": 123,
  "name": "foo",
  "started": true,
  "started_at": "2016-12-31T12:30:00Z",
  "started_at_override": "2016-12-31T12:30:00Z",
  "description": "foo desc"
}

const genericStoryData = {
    "app_url": "foo",
    "archived": true,
    "blocked": true,
    "blocker": true,
    "branches": [{
      "created_at": "2016-12-31T12:30:00Z",
      "deleted": true,
      "entity_type": "foo",
      "id": 123,
      "merged_branch_ids": [123],
      "name": "foo",
      "persistent": true,
      "pull_requests": [{
        "branch_id": 123,
        "branch_name": "foo",
        "build_status": "foo",
        "closed": true,
        "created_at": "2016-12-31T12:30:00Z",
        "draft": true,
        "entity_type": "foo",
        "id": 123,
        "merged": true,
        "num_added": 123,
        "num_commits": 123,
        "num_modified": 123,
        "num_removed": 123,
        "number": 123,
        "overlapping_stories": [123],
        "repository_id": 123,
        "review_status": "foo",
        "target_branch_id": 123,
        "target_branch_name": "foo",
        "title": "foo",
        "updated_at": "2016-12-31T12:30:00Z",
        "url": "foo",
        "vcs_labels": [{
          "color": "#6515dd",
          "description": "foo",
          "entity_type": "foo",
          "id": 123,
          "name": "foo"
        }]
      }],
      "repository_id": 123,
      "updated_at": "2016-12-31T12:30:00Z",
      "url": "foo"
    }],
    "comments": [{
      "app_url": "foo",
      "author_id": "12345678-9012-3456-7890-123456789012",
      "blocker": true,
      "created_at": "2016-12-31T12:30:00Z",
      "deleted": true,
      "entity_type": "foo",
      "external_id": "foo",
      "group_mention_ids": ["12345678-9012-3456-7890-123456789012"],
      "id": 123,
      "member_mention_ids": ["12345678-9012-3456-7890-123456789012"],
      "mention_ids": ["12345678-9012-3456-7890-123456789012"],
      "parent_id": 123,
      "position": 123,
      "story_id": 123,
      "text": "foo",
      "unblocks_parent": true,
      "updated_at": "2016-12-31T12:30:00Z"
    }],
    "commits": [{
      "author_email": "foo",
      "author_id": "12345678-9012-3456-7890-123456789012",
      "author_identity": {
        "entity_type": "foo",
        "name": "foo",
        "type": "foo"
      },
      "created_at": "2016-12-31T12:30:00Z",
      "entity_type": "foo",
      "hash": "foo",
      "id": 123,
      "message": "foo",
      "repository_id": 123,
      "timestamp": "2016-12-31T12:30:00Z",
      "updated_at": "2016-12-31T12:30:00Z",
      "url": "foo"
    }],
    "completed": true,
    "completed_at": "2016-12-31T12:30:00Z",
    "completed_at_override": "2017-12-31T12:30:00Z",
    "created_at": "2016-12-31T12:30:00Z",
    "custom_fields": [{
      "field_id": "12345678-9012-3456-7890-123456789012",
      "value": "foo",
      "value_id": "12345678-9012-3456-7890-123456789012"
    }],
    "cycle_time": 123,
    "deadline": "2016-12-31T12:30:00Z",
    "description": "foo",
    "entity_type": "foo",
    "epic_id": 123,
    "estimate": 123,
    "external_id": "foo",
    "external_links": [],
    "files": [{
      "content_type": "foo",
      "created_at": "2016-12-31T12:30:00Z",
      "description": "foo",
      "entity_type": "foo",
      "external_id": "foo",
      "filename": "foo",
      "group_mention_ids": ["12345678-9012-3456-7890-123456789012"],
      "id": 123,
      "member_mention_ids": ["12345678-9012-3456-7890-123456789012"],
      "mention_ids": ["12345678-9012-3456-7890-123456789012"],
      "name": "foo",
      "size": 123,
      "story_ids": [123],
      "thumbnail_url": "foo",
      "updated_at": "2016-12-31T12:30:00Z",
      "uploader_id": "12345678-9012-3456-7890-123456789012",
      "url": "foo"
    }],
    "follower_ids": ["12345678-9012-3456-7890-123456789012"],
    "group_id": "12345678-9012-3456-7890-123456789012",
    "group_mention_ids": ["12345678-9012-3456-7890-123456789012"],
    "id": 123,
    "iteration_id": 123,
    "label_ids": [123],
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
    "lead_time": 123,
    "linked_files": [{
      "content_type": "foo",
      "created_at": "2016-12-31T12:30:00Z",
      "description": "foo",
      "entity_type": "foo",
      "group_mention_ids": ["12345678-9012-3456-7890-123456789012"],
      "id": 123,
      "member_mention_ids": ["12345678-9012-3456-7890-123456789012"],
      "mention_ids": ["12345678-9012-3456-7890-123456789012"],
      "name": "foo",
      "size": 123,
      "story_ids": [123],
      "thumbnail_url": "foo",
      "type": "foo",
      "updated_at": "2016-12-31T12:30:00Z",
      "uploader_id": "12345678-9012-3456-7890-123456789012",
      "url": "foo"
    }],
    "member_mention_ids": ["12345678-9012-3456-7890-123456789012"],
    "mention_ids": ["12345678-9012-3456-7890-123456789012"],
    "moved_at": "2016-12-31T12:30:00Z",
    "name": "foo",
    "owner_ids": ["12345678-9012-3456-7890-123456789012"],
    "position": 123,
    "previous_iteration_ids": [123],
    "project_id": 123,
    "pull_requests": [{
      "branch_id": 123,
      "branch_name": "foo",
      "build_status": "foo",
      "closed": true,
      "created_at": "2016-12-31T12:30:00Z",
      "draft": true,
      "entity_type": "foo",
      "id": 123,
      "merged": true,
      "num_added": 123,
      "num_commits": 123,
      "num_modified": 123,
      "num_removed": 123,
      "number": 123,
      "overlapping_stories": [123],
      "repository_id": 123,
      "review_status": "foo",
      "target_branch_id": 123,
      "target_branch_name": "foo",
      "title": "foo",
      "updated_at": "2016-12-31T12:30:00Z",
      "url": "foo",
      "vcs_labels": [{
        "color": "#6515dd",
        "description": "foo",
        "entity_type": "foo",
        "id": 123,
        "name": "foo"
      }]
    }],
    "requested_by_id": "12345678-9012-3456-7890-123456789012",
    "started": true,
    "started_at": "2016-12-31T12:30:00Z",
    "started_at_override": "2016-12-31T12:30:00Z",
    "stats": {
      "num_related_documents": 123
    },
    "story_links": [{
      "created_at": "2016-12-31T12:30:00Z",
      "entity_type": "foo",
      "id": 123,
      "object_id": 123,
      "subject_id": 123,
      "type": "foo",
      "updated_at": "2016-12-31T12:30:00Z",
      "verb": "foo"
    }],
    "story_template_id": "12345678-9012-3456-7890-123456789012",
    "story_type": "foo",
    "synced_item": {
      "external_id": "foo",
      "url": "foo"
    },
    "tasks": [{
      "complete": true,
      "completed_at": "2016-12-31T12:30:00Z",
      "created_at": "2016-12-31T12:30:00Z",
      "description": "foo",
      "entity_type": "foo",
      "external_id": "foo",
      "group_mention_ids": ["12345678-9012-3456-7890-123456789012"],
      "id": 123,
      "member_mention_ids": ["12345678-9012-3456-7890-123456789012"],
      "mention_ids": ["12345678-9012-3456-7890-123456789012"],
      "owner_ids": ["12345678-9012-3456-7890-123456789012"],
      "position": 123,
      "story_id": 123,
      "updated_at": "2016-12-31T12:30:00Z"
    }],
    "unresolved_blocker_comments": [123],
    "updated_at": "2016-12-31T12:30:00Z",
    "workflow_id": 123,
    "workflow_state_id": 123
}

describe('Success cases', () => {

  describe('Event types', () => {

    test('It should return "incident" for event types', async () => {
      var storyData = genericStoryData;
      axios.get = jest.fn(() => Promise.resolve<any>(storyData));

      const parser = new ShortcutParser();
      const eventType = await parser.getEventType();
      
      expect(eventType).toBe('incident');
    });
  });


  describe('Payloads', () => {
    test('It should return the provided event if it is unknown together with the a correct object', async () => {
      var storyData = JSON.parse(JSON.stringify(genericStoryData));
      axios.get = jest.fn(() => Promise.resolve<any>({ data: storyData }));

      const parser = new ShortcutParser();
      const payload = await parser.getPayload({
        headers: {},
        body: webHookIncoming_16927
      });

      expect(payload).toHaveProperty('eventTime');
      expect(payload).toHaveProperty('timeCreated');
      expect(payload).toHaveProperty('id');
      expect(payload).toHaveProperty('message');
    });


    test('It should return incident label', async () => {
      var storyData = JSON.parse(JSON.stringify(genericStoryData));
      axios.get = jest.fn(() => Promise.resolve<any>({ data: storyData }));

      const parser = new ShortcutParser();
      const payload = await parser.getPayload({
        headers: {},
        body: webHookIncoming_labeled_16927
      });

      expect(payload).toHaveProperty('eventTime');
      expect(payload).toHaveProperty('timeCreated');
      expect(payload).toHaveProperty('id');
      expect(payload).toHaveProperty('message');
    });


    test('It should return assigned properties on update', async () => {
      var storyData = JSON.parse(JSON.stringify(specificStoryData));
      axios.get = jest.fn(() => Promise.resolve<any>( { data: storyData }));

      const parser = new ShortcutParser();
      const payload = await parser.getPayload({
        headers: {},
        body: webHookIncoming_labeled_16927
      });

      expect(payload.eventTime).toBe("2017-06-27T16:20:44Z");
      expect(payload.timeCreated).toBe(convertDateToUnixTimestamp('2016-12-31T12:30:00Z'));
      expect(payload.timeResolved).toBe('');
      expect(payload.id).toBe(123);
      expect(payload.title).toBe("foo");
      expect(payload.message).toBe(JSON.stringify(storyData));
    });


    test('It should return assigned properties on completed with override', async () => {
      var storyData = JSON.parse(JSON.stringify(specificStoryData))
      storyData.id = 876
      storyData.completed = true;
      storyData.completed_at = "2016-12-31T12:30:00Z"
      storyData.completed_at_override = "2017-12-31T12:30:00Z"

      var webhookData = webHookIncoming_labeled_16927
      webhookData.actions[0].action = "updated";

      axios.get = jest.fn(() => Promise.resolve<any>({ data: storyData }));

      const parser = new ShortcutParser();
      const payload = await parser.getPayload({
        headers: {},
        body: webhookData
      });

      expect(payload.timeResolved).toBe(convertDateToUnixTimestamp('2017-12-31T12:30:00Z'));
    });

    test('It should return assigned properties on completed', async () => {
      var storyData = JSON.parse(JSON.stringify(specificStoryData));
      storyData.id = 876
      storyData.completed = true;
      storyData.completed_at = "2016-12-31T12:30:00Z"

      var webhookData = webHookIncoming_labeled_16927 || webHookIncoming_16927
      webhookData.actions[0].action = "updated";

      axios.get = jest.fn(() => Promise.resolve<any>({ data: storyData }));

      const parser = new ShortcutParser();
      const payload = await parser.getPayload({
        headers: {},
        body: webhookData
      });

      expect(payload.eventTime).toBe("2017-06-27T16:20:44Z");
      expect(payload.timeCreated).toBe(convertDateToUnixTimestamp('2016-12-31T12:30:00Z'));
      expect(payload.timeResolved).toBe(convertDateToUnixTimestamp('2016-12-31T12:30:00Z'));
      expect(payload.id).toBe(876);
      expect(payload.title).toBe("foo");
      expect(payload.message).toBe(JSON.stringify(storyData));
    });


    test('It should return assigned properties on archived', async () => {
      var storyData = JSON.parse(JSON.stringify(specificStoryData));;
      storyData.id = 876
      storyData.archived = true;
      storyData.completed_at = "2016-12-31T12:30:00Z"

      var webhookData = webHookIncoming_labeled_16927
      webhookData.actions[0].action = "created";

      axios.get = jest.fn(() => Promise.resolve<any>({ data: storyData }));

      const parser = new ShortcutParser();
      const payload = await parser.getPayload({
        headers: {},
        body: webhookData
      });

      expect(payload.timeResolved).toBe(convertDateToUnixTimestamp('2016-12-31T12:30:00Z'));
    });

    test('It should used cached data to prevent excess api calls', async () => {
      var storyData = JSON.parse(JSON.stringify(specificStoryData));;
      storyData.id = 876
      storyData.archived = true;
      storyData.completed_at = "2016-12-31T12:30:00Z"

      var webhookData = webHookIncoming_labeled_16927
      webhookData.actions[0].action = "created";

      axios.get = jest.fn(() => Promise.resolve<any>({ data: storyData }));
      const spy = jest.spyOn(axios, 'get');

      const parser = new ShortcutParser();
      await parser.getPayload({
        headers: {},
        body: webhookData
      });

      await parser.getPayload({
        headers: {},
        body: webhookData
      });

      expect(spy).toHaveBeenCalledTimes(1);
    });

    test('It should parse the story id from the webhook payload', async () => {
      var storyData = JSON.parse(JSON.stringify(specificStoryData));
      var webhookData = webHookIncoming_labeled_16927
      webhookData.primary_id = 123456;

      const mockCallback = jest.fn((url, header) => {
        console.log(url, header);
        return Promise.resolve<any>({ data: storyData });
      });

      axios.get = mockCallback

      const parser = new ShortcutParser();
      await parser.getPayload({
        headers: {},
        body: webhookData
      });

   
      const argUrl = 0;
      expect(mockCallback.mock.calls[0][argUrl]).toBe("https://api.app.shortcut.com/api/v3/stories/123456");
    });

    test('It should use the environment shortcut token', async () => {
      var storyData = JSON.parse(JSON.stringify(specificStoryData));
      var webhookData = webHookIncoming_labeled_16927
      webhookData.primary_id = 123456;

      const mockCallback = jest.fn((url, header) => {
        console.log(url, header);
        return Promise.resolve<any>({ data: storyData });
      });

      axios.get = mockCallback

      const parser = new ShortcutParser();
      await parser.getPayload({
        headers: {},
        body: webhookData
      });

   
      const argHeader = 1
      expect(mockCallback.mock.calls[0][argHeader].headers["Shortcut-Token"]).toBe("7c874900-b038-4ac8-89d6-813d6daea148")
    });
  });

  describe('Repository name', () => {
    test('It should take in a typical Jira event and return the GitHub repository name', async () => {
      var storyData = genericStoryData;
      axios.get = jest.fn(() => Promise.resolve<any>(storyData));

      const expected = 'eHawk';

      const parser = new ShortcutParser();
      const repoName = await parser.getRepoName({
        user: {
          self: 'https://something.atlassian.net/rest/api/2/user?accountId=12345-123asd-12ab12-1234567-abcdefg'
        },
        issue: {
          id: '10004',
          fields: {
            created: '2022-02-03T20:04:45.243+0100',
            customfield_10035: `https://github.com/${expected}`
          }
        }
      });
      expect(repoName).toBe(expected);
    });
  });

});


describe('Failure cases', () => {
  describe('Payloads', () => {
    test('It should throw a MissingIdError if event is missing an ID',async () => {
      const webHookIncoming = {
        id: "595285dc-9c43-4b9c-a1e6-0cd9aff5b084",
        changed_at: "2017-06-27T16:20:44Z",
        member_id: "56d8a839-1c52-437f-b981-c3a15a11d6d4",
        version: "v1",
      }

      const parser = new ShortcutParser();
      try {
      await parser.getPayload({
          headers: {},
          body: webHookIncoming
        })
      } catch(e){
        expect(e).toBeInstanceOf(MissingIdError);
      }
    });
  });
});