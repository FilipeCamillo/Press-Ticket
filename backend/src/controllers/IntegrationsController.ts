import { Request, Response } from "express";
import { getIO } from "../libs/socket";
import CreateIntegrationService from "../services/IntegrationServices/CreateIntegrationService";
import DeleteIntegrationService from "../services/IntegrationServices/DeleteIntegrationService";
import ListIntegrationsService from "../services/IntegrationServices/ListIntegrationService";
import ShowIntegrationService from "../services/IntegrationServices/ShowIntegrationService";
import TestSessionIntegrationService from "../services/IntegrationServices/TestSessionDialogflowService";
import UpdateIntegrationService from "../services/IntegrationServices/UpdateIntegrationService";

export const index = async (req: Request, res: Response): Promise<Response> => {
  const dialogflows = await ListIntegrationsService();

  return res.status(200).json(dialogflows);
};

export const store = async (req: Request, res: Response): Promise<Response> => {
  const { type, name, projectName, jsonContent, language } = req.body;

  const dialogflow = await CreateIntegrationService({ type, name, projectName, jsonContent, language , url});

  const io = getIO();
  io.emit("dialogflow", {
    action: "update",
    dialogflow
  });

  return res.status(200).json(dialogflow);
};

export const show = async (req: Request, res: Response): Promise<Response> => {
  const { integrationId } = req.params;

  const integration = await ShowIntegrationService(integrationId);

  return res.status(200).json(integration);
};

export const update = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { integrationId } = req.params;
  const integrationData = req.body;

  const integration = await UpdateIntegrationService({integrationData, integrationId });

  const io = getIO();
  io.emit("integration", {
    action: "update",
    integration
  });

  return res.status(201).json(integration);
};

export const remove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { integrationId } = req.params;

  await DeleteIntegrationService(integrationId);

  const io = getIO();
  io.emit("integration", {
    action: "delete",
    integrationId: +integrationId
  });

  return res.status(200).send();
};

export const testSession = async (req: Request, res: Response): Promise<Response> => {
  const { projectName, jsonContent, language } = req.body;

  const response = await TestSessionIntegrationService({ projectName, jsonContent, language });

  const io = getIO();
  io.emit("integration", {
    action: "testSession",
    response
  });

  return res.status(200).json(response);
};