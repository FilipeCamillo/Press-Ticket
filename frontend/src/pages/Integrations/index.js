import { format, parseISO } from "date-fns";
import React, { useReducer, useState, useEffect } from "react";
import openSocket from "../../services/socket-io";

import {
  Button,
  IconButton,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@material-ui/core";

import { DeleteOutline, Edit } from "@material-ui/icons";
import { toast } from "react-toastify";
import ConfirmationModal from "../../components/ConfirmationModal";
import IntegrationModal from "../../components/IntegrationModal";
import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import Title from "../../components/Title";
import toastError from "../../errors/toastError";
import api from "../../services/api";
import { i18n } from "../../translate/i18n";

const useStyles = makeStyles((theme) => ({
  mainPaper: {
    flex: 1,
    padding: theme.spacing(1),
    overflowY: "scroll",
    ...theme.scrollbarStyles,
  },
  customTableCell: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

const reducer = (state, action) => {
  if (action.type === "LOAD_INTEGRATIONS") {
    const integrations = action.payload;
    const newIntegrations = [];

    integrations.forEach((integration) => {
      const integrationIndex = state.findIndex((q) => q.id === integration.id);
      if (integrationIndex !== -1) {
        state[integrationIndex] = integration;
      } else {
        newIntegrations.push(integration);
      }
    });

    return [...state, ...newIntegrations];
  }

  if (action.type === "UPDATE_INTEGRATIONS") {
    const integration = action.payload;
    const integrationIndex = state.findIndex((u) => u.id === integration.id);

    if (integrationIndex !== -1) {
      state[integrationIndex] = integration;
      return [...state];
    } else {
      return [integration, ...state];
    }
  }

  if (action.type === "DELETE_INTEGRATIONS") {
    const integrationId = action.payload;
    const integrationIndex = state.findIndex((q) => q.id === integrationId);
    if (integrationIndex !== -1) {
      state.splice(integrationIndex, 1);
    }
    return [...state];
  }

  if (action.type === "RESET") {
    return [];
  }
};

const Integrations = () => {
  const classes = useStyles();

  const [dialogflows, dispatch] = useReducer(reducer, []);
  const [loading, setLoading] = useState(false);

  const [dialogflowModalOpen, setDialogflowModalOpen] = useState(false);
  const [selectedDialogflow, setSelectedDialogflow] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  useEffect(() => {
    const socket = openSocket();

    socket.on("integration", (data) => {
      if (data.action === "update" || data.action === "create") {
        dispatch({ type: "UPDATE_USERS", payload: data.integration });
      }

      if (data.action === "delete") {
        dispatch({ type: "DELETE_USER", payload: +data.integrationId });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleOpenDialogflowModal = () => {
    setDialogflowModalOpen(true);
    setSelectedDialogflow(null);
  };

  const handleCloseDialogflowModal = () => {
    setDialogflowModalOpen(false);
    setSelectedDialogflow(null);
  };

  const handleEditDialogflow = (dialogflow) => {
    setSelectedDialogflow(dialogflow);
    setDialogflowModalOpen(true);
  };

  const handleCloseConfirmationModal = () => {
    setConfirmModalOpen(false);
    setSelectedDialogflow(null);
  };

  const handleDeleteDialogflow = async (dialogflowId) => {
    try {
      await api.delete(`/integrations/${dialogflowId}`);
      toast.success(i18n.t("Integration deleted successfully!"));
    } catch (err) {
      toastError(err);
    }
    setSelectedDialogflow(null);
  };

  return (
    <MainContainer>
      <ConfirmationModal
        title={
          selectedDialogflow &&
          `${i18n.t("dialogflows.confirmationModal.deleteTitle")} ${
            selectedDialogflow.name
          }?`
        }
        open={confirmModalOpen}
        onClose={handleCloseConfirmationModal}
        onConfirm={() => handleDeleteDialogflow(selectedDialogflow.id)}
      >
        {i18n.t("dialogflows.confirmationModal.deleteMessage")}
      </ConfirmationModal>
      <IntegrationModal
        open={dialogflowModalOpen}
        onClose={handleCloseDialogflowModal}
        dialogflowId={selectedDialogflow?.id}
      />
      <MainHeader>
        <Title>{i18n.t("dialogflows.title")}</Title>
        <MainHeaderButtonsWrapper>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenDialogflowModal}
          >
            {i18n.t("dialogflows.buttons.add")}
          </Button>
        </MainHeaderButtonsWrapper>
      </MainHeader>
      <Paper className={classes.mainPaper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell align="center">
                {i18n.t("dialogflows.table.type")}
              </TableCell>
              <TableCell align="center">
                {i18n.t("dialogflows.table.name")}
              </TableCell>
              <TableCell align="center">
                {i18n.t("dialogflows.table.projectName")}
              </TableCell>
              <TableCell align="center">
                {i18n.t("dialogflows.table.language")}
              </TableCell>
              <TableCell align="center">
                {i18n.t("dialogflows.table.lastUpdate")}
              </TableCell>
              <TableCell align="center">
                {i18n.t("dialogflows.table.actions")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <>
              {dialogflows.map((dialogflow) => (
                <TableRow key={dialogflow.id}>
                  <TableCell align="center">{dialogflow.type}</TableCell>  
                  <TableCell align="center">{dialogflow.name}</TableCell>
                  <TableCell align="center">{ dialogflow.projectName}</TableCell>
                  <TableCell align="center">{dialogflow.language}</TableCell>
                  <TableCell align="center">
												{format(parseISO(dialogflow.updatedAt), "dd/MM/yy HH:mm")}
											</TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => handleEditDialogflow(dialogflow)}
                    ><Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSelectedDialogflow(dialogflow);
                        setConfirmModalOpen(true);
                      }}
                    >
                      <DeleteOutline />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {loading && <TableRowSkeleton columns={4} />}
            </>
          </TableBody>
        </Table>
      </Paper>
    </MainContainer>
  );
};

export default Integrations;