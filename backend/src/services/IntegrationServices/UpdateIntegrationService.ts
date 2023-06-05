import * as Yup from "yup";

import AppError from "../../errors/AppError";
import Integrations from "../../models/Integrations";
import ShowIntegrationService from "./ShowIntegrationService";

interface IntegrationData {
  type?: string;
  name?: string;
  projectName?: string;
  jsonContent?: string;
  language?: string;
  url?: string;
}

interface Request {
  integrationData: IntegrationData;
  integrationId: string;
}

const UpdateIntegrationService = async ({
    integrationData,
    integrationId
}: Request): Promise<Integrations> => {
  const schema = Yup.object().shape({
    type: Yup.string().min(2),
    name: Yup.string().min(2),
    projectName: Yup.string().min(2),
    jsonContent: Yup.string().min(2),
    language: Yup.string().min(2)
  });

  const {
    type,
    name,
    projectName,
    jsonContent,
    language,
    url
  } = integrationData;

  try {
    await schema.validate({ type, name, projectName, jsonContent, language, url});
  } catch (err) {
    throw new AppError(err.message);
  }
  
  const integration = await ShowIntegrationService(integrationId);

  await integration.update({
    type,
    name,
    projectName,
    jsonContent,
    language,
    url
  });

  return integration;
};

export default UpdateIntegrationService;