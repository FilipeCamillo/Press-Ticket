import Integrations from "../../models/Integrations";
import AppError from "../../errors/AppError";

const DeleteIntegrationService = async (id: string): Promise<void> => {
  const dialogflow = await Integrations.findOne({
    where: { id }
  });

  if (!dialogflow) {
    throw new AppError("ERR_NO_DIALOG_FOUND", 404);
  }

  await dialogflow.destroy();
};

export default DeleteIntegrationService;