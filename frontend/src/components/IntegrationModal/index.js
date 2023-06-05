import React, { useState, useEffect } from "react";

import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { toast } from "react-toastify";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Select,
  InputLabel,
  MenuItem,
  FormControl,
  TextField,
} from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";

import { i18n } from "../../translate/i18n";

import api from "../../services/api";
import toastError from "../../errors/toastError";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginRight: theme.spacing(1),
    flex: 1,
  },

  btnWrapper: {
    position: "relative",
  },

  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
  btnLeft: {
    display: "flex",
    marginRight: "auto",
    marginLeft: 12,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 240,
  },
  colorAdorment: {
    width: 20,
    height: 20,
  },
}));

const DialogflowSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  projectName: Yup.string()
    .min(3, "Too Short!")
    .max(100, "Too Long!")
    .required(),
  jsonContent: Yup.string().min(3, "Too Short!").required(),
  language: Yup.string().min(2, "Too Short!").max(50, "Too Long!").required(),
});

const DialogflowModal = ({ open, onClose, integrationId }) => {
  const classes = useStyles();

  const initialState = {
    type: "dialogflow",
    name: "",
    projectName: "",
    jsonContent: "",
    language: "",
    url: "",
  };

  const [dialogflow, setDialogflow] = useState(initialState);

  useEffect(() => {
    (async () => {
      if (!integrationId) return;
      try {
        const { data } = await api.get(`/integrations/${integrationId}`);
        setDialogflow((prevState) => {
          return { ...prevState, ...data };
        });
      } catch (err) {
        toastError(err);
      }
    })();

    return () => {
      setDialogflow({
        type: "dialoflow",
        name: "",
        projectName: "",
        jsonContent: "",
        language: "",
        url: "",
      });
    };
  }, [integrationId, open]);

  const handleClose = () => {
    onClose();
    setDialogflow(initialState);
  };

  const handleTestSession = async (event, values) => {
    try {
      const { projectName, jsonContent, language } = values;

      await api.post(`/integrations/testSession`, {
        projectName,
        jsonContent,
        language,
      });

      toast.success(i18n.t("dialogflowModal.messages.testSuccess"));
    } catch (err) {
      toastError(err);
    }
  };

  const handleSaveDialogflow = async (values) => {
    try {
      console.log(values);
      if (integrationId) {
        await api.put(`/integrations/${integrationId}`, values);
        toast.success(i18n.t("dialogflowModal.messages.editSuccess"));
      } else {
        await api.post("/integrations", values);
        toast.success(i18n.t("dialogflowModal.messages.addSuccess"));
      }
      handleClose();
    } catch (err) {
      toastError(err);
    }
  };

  return (
    <div className={classes.root}>
      <Dialog open={open} onClose={handleClose} scroll="paper">
        <DialogTitle>
          {integrationId
            ? `${i18n.t("dialogflowModal.title.edit")}`
            : `${i18n.t("dialogflowModal.title.add")}`}
        </DialogTitle>
        <Formik
          initialValues={dialogflow}
          enableReinitialize={true}
          validationSchema={DialogflowSchema}
          onSubmit={(values, actions, event) => {
            setTimeout(() => {
              console.log(actions);
              handleSaveDialogflow(values);
              actions.setSubmitting(false);
            }, 400);
          }}
        >
          {({ touched, errors, isSubmitting, values }) => (
            <Form>
              <DialogContent dividers>
                <div>
                <FormControl
                  variant="outlined"
                  className={classes.formControl}
                  margin="dense"
                  fullWidth
                  style={{ marginLeft: '-5px' }}
                >
                  <InputLabel id="type-selection-input-label">
                    {i18n.t("dialogflowModal.form.type")}
                  </InputLabel>

                  <Field
                    as={Select}
                    label={i18n.t("dialogflowModal.form.type")}
                    name="type"
                    labelId="profile-selection-label"
                    error={touched.type && Boolean(errors.type)}
                    helpertext={touched.type && errors.type}
                    id="type-selection"
                    required
                  >
                    <MenuItem value="dialogflow">DialogFlow</MenuItem>
                    <MenuItem value="n8n">N8N</MenuItem>
                  </Field>
                </FormControl>
                </div>
                <Field
                  as={TextField}
                  label={i18n.t("dialogflowModal.form.name")}
                  autoFocus
                  name="name"
                  error={touched.name && Boolean(errors.name)}
                  helpertext={touched.name && errors.name}
                  variant="outlined"
                  margin="dense"
                  className={classes.textField}
                />
                <FormControl
                  variant="outlined"
                  className={classes.formControl}
                  margin="dense"
                >
                  <InputLabel id="language-selection-input-label">
                    {i18n.t("dialogflowModal.form.language")}
                  </InputLabel>

                  <Field
                    as={Select}
                    label={i18n.t("dialogflowModal.form.language")}
                    name="language"
                    labelId="profile-selection-label"
                    error={touched.language && Boolean(errors.language)}
                    helpertext={touched.language && errors.language}
                    id="language-selection"
                    required
                  >
                    <MenuItem value="pt-BR">Portugues</MenuItem>
                    <MenuItem value="en">Inglês</MenuItem>
                    <MenuItem value="es">Espanhol</MenuItem>
                  </Field>
                </FormControl>
                <div>
                  <Field
                    as={TextField}
                    label={i18n.t("dialogflowModal.form.projectName")}
                    name="projectName"
                    error={touched.projectName && Boolean(errors.projectName)}
                    helpertext={touched.projectName && errors.projectName}
                    fullWidth
                    variant="outlined"
                    margin="dense"
                  />
                </div>
                <div>
                  <Field
                    as={TextField}
                    label={i18n.t("dialogflowModal.form.jsonContent")}
                    type="jsonContent"
                    multiline
                    //inputRef={greetingRef}
                    maxRows={5}
                    minRows={5}
                    fullWidth
                    name="jsonContent"
                    error={touched.jsonContent && Boolean(errors.jsonContent)}
                    helpertext={touched.jsonContent && errors.jsonContent}
                    variant="outlined"
                    margin="dense"
                  />
                </div>
              </DialogContent>

              <DialogActions>
                <Button
                  //type="submit"
                  onClick={(e) => handleTestSession(e, values)}
                  color="inherit"
                  disabled={isSubmitting}
                  name="testSession"
                  variant="outlined"
                  className={classes.btnLeft}
                >
                  {i18n.t("dialogflowModal.buttons.test")}
                </Button>
                <Button
                  onClick={handleClose}
                  color="secondary"
                  disabled={isSubmitting}
                  variant="outlined"
                >
                  {i18n.t("dialogflowModal.buttons.cancel")}
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  disabled={isSubmitting}
                  variant="contained"
                  className={classes.btnWrapper}
                >
                  {integrationId
                    ? `${i18n.t("dialogflowModal.buttons.okEdit")}`
                    : `${i18n.t("dialogflowModal.buttons.okAdd")}`}
                  {isSubmitting && (
                    <CircularProgress
                      size={24}
                      className={classes.buttonProgress}
                    />
                  )}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </div>
  );
};

export default DialogflowModal;