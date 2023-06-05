import * as Yup from "yup";

import AppError from "../../errors/AppError";
import Integrations from "../../models/Integrations";


interface Request {
  type: string;
  name: string;
  projectName: string;
  jsonContent: string;
  language: string;
  url: string;
}

const CreateIntegrationService = async ({
  type,  
  name,
  projectName,
  jsonContent,
  language,
  url
}: Request): Promise<Integrations> => {
  const schema = Yup.object().shape({
    name: Yup.string()
      .required()
      .min(2)
      .test(
        "Check-name",
        "This integration name is already used.",
        async value => {
          if (!value) return false;
          const nameExists = await Integrations.findOne({
            where: { name: value }
          });
          return !nameExists;
        }
      ),
      projectName: Yup.string()
      .required()
      .min(2)
      .test(
        "Check-name",
        "This integration projectName is already used.",
        async value => {
          if (!value) return false;
          const nameExists = await Integrations.findOne({
            where: { projectName: value }
          });
          return !nameExists;
        }
      ),
      jsonContent: Yup.string()
      .required()
      ,
      language: Yup.string()
      .required()
      .min(2)
    });

  try {
    await schema.validate({ type, name, projectName, jsonContent, language, url});
  } catch (err) {
    throw new AppError(err.message);
  }


  const integration = await Integrations.create(
    {
      type,
      name,
      projectName,
      jsonContent,
      language,
      url
    }
  );

   return integration   ;
};

export default CreateIntegrationService;