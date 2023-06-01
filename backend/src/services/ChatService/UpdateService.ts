import Chat from "../../models/Chat";
import ChatUser from "../../models/ChatUser";
import User from "../../models/User";


interface ChatData {
  id: number;
  title?: string;
  ticketId?: number | null;
  queueId?: number | null;
  name?: string;
  ownerId?: number;
  users?: any[];
}

interface Request {
  chatData : ChatData;
}

const UpdateService = async ({
  chatData
}: Request): Promise<Response> => {
  const { id, ownerId } = chatData;

  const record = await Chat.findByPk(id, {
    include: [{ model: ChatUser, as: "users" }]
  });
  

  await record.update({ title: title });

  if (Array.isArray(users)) {
    await ChatUser.destroy({ where: { chatId: id } });
    await ChatUser.create({ chatId: id, userId: ownerId });
    for (let user of users) {
      if (user.id !== ownerId) {
        await ChatUser.create({ chatId: id, userId: user.id });
      }
    }
  }

  await record.reload({
    include: [
      { model: ChatUser, as: "users", include: [{ model: User, as: "user" }] },
      { model: User, as: "owner" }
    ]
  });

  return record;
}
export default UpdateService;