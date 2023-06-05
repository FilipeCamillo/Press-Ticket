import Integrations from "../../models/Integrations";

const ListIntegrationService = async (): Promise<Integrations[]> => {
  const integrations = await Integrations.findAll();

  return integrations;
};

export default ListIntegrationService;