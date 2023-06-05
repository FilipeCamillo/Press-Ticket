import Integrations from "../../models/Integrations";
import AppError from "../../errors/AppError";


const ShowIntegrationService = async (id: string | number): Promise<Integrations> => {
  const integration = await Integrations.findByPk(id);

  if (!integration) {
    throw new AppError("ERR_NO_DIALOG_FOUND", 404);
  }

  return integration;
};

export default ShowIntegrationService;