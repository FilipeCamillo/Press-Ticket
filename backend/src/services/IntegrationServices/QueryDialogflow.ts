import * as Sentry from "@sentry/node";
import { SessionsClient } from "@google-cloud/dialogflow";
import { logger } from "../../utils/logger";

async function detectIntent(
  sessionClient: SessionsClient,
  projectId: string,
  sessionId: string,
  query: string,
  languageCode: string
) {
  const sessionPath = sessionClient.projectAgentSessionPath(
    projectId,
    sessionId
  );

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: query,
        languageCode: languageCode
      }
    }
  };

  const responses = await sessionClient.detectIntent(request);
  return responses[0];
}

async function detectAudioIntent(
  sessionClient: SessionsClient,
  projectId: string,
  sessionId: string,
  languageCode: string,
  inputAudio: string
) {
  const sessionPath = sessionClient.projectAgentSessionPath(
    projectId,
    sessionId
  );

  const encoding = 6;
  const sampleRateHertz = 16000;

  const request = {
    session: sessionPath,
    queryInput: {
      audioConfig: {
        audioEncoding: encoding,
        sampleRateHertz: sampleRateHertz,
        languageCode: languageCode
      }
    },
    inputAudio: inputAudio
  };

  const responses = await sessionClient.detectIntent(request);
  return responses[0];
}

async function queryDialogFlow(
  sessionClient: SessionsClient,
  projectId: string,
  sessionId: string,
  query: string,
  languageCode: string,
  inputAudio: string | undefined
): Promise<any | null> {
  let intentResponse;

  if (inputAudio) {
    try {
      intentResponse = await detectAudioIntent(
        sessionClient,
        projectId,
        sessionId,
        languageCode,
        inputAudio
      );

      const responses = intentResponse?.queryResult?.fulfillmentMessages;
      const endConversation =
        intentResponse?.queryResult?.diagnosticInfo?.fields?.end_conversation
          ?.boolValue;
      const parameters = intentResponse?.queryResult?.parameters?.fields;
      const encodedAudio = intentResponse?.outputAudio;

      if (responses?.length === 0) {
        return null;
      } else {
        return {
          responses,
          endConversation,
          parameters,
          encodedAudio
        };
      }
    } catch (error) {
      Sentry.captureException(error);
      logger.error(`Error handling whatsapp message: Err: ${error}`);
    }

    return null;
  } else {
    try {
      intentResponse = await detectIntent(
        sessionClient,
        projectId,
        sessionId,
        query,
        languageCode
      );

      const responses = intentResponse?.queryResult?.fulfillmentMessages;
      const endConversation =
        intentResponse?.queryResult?.diagnosticInfo?.fields?.end_conversation
          ?.boolValue;
      const parameters = intentResponse?.queryResult?.parameters?.fields;
      const encodedAudio = intentResponse?.outputAudio;

      if (responses?.length === 0) {
        return null;
      } else {
        return {
          responses,
          endConversation,
          parameters,
          encodedAudio
        };
      }
    } catch (error) {
      Sentry.captureException(error);
      logger.error(`Error handling whatsapp message: Err: ${error}`);
    }

    return null;
  }
}

export { queryDialogFlow };