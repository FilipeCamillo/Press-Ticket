import Chat from "../../models/Chat";
import User from "../../models/User";

type Params = {
  ownerId?: number ;
  ticketId?: number;
};

const FindService = async ({ ownerId, ticketId }: Params): Promise<Chat[]> => {
  const chats: Chat[] = await Chat.findAll({
    where: {
      ownerId: ownerId,
      ticketId: ticketId
    },
    include: [
      { model: User, as: "owner", attributes: ["id", "name"] }
    ],
    order: [["createdAt", "DESC"]]
  });

  return chats;
};

export default FindService;
