import Chat from "../../models/Chat";
import ChatUser from "../../models/ChatUser";
import User from "../../models/User";
import AppError from "../../errors/AppError";

interface Request {
  ownerId: number;
  users: any[];
  title: string;
  ticketId?: number;
  queueId?: number;
}

const CreateService = async ({
  ownerId,
  ticketId,
  queueId,
  title, 
  users=[]}:Request): Promise<Chat> => {
  
    const numberExists = await Chat.findOne({
      where: { ownerId }
    });
  
    if (numberExists) {
      throw new AppError("ERR_DUPLICATED_CONTACT");
    }
  
  const record = await Chat.create({
    ownerId,
    ticketId,
    queueId,
    title
  });

  if (Array.isArray(users) && users.length > 0) {
    await ChatUser.create({ chatId: record.id, userId: ownerId });
    for (let user of users) {
      await ChatUser.create({ chatId: record.id, userId: user.id });
    }
  }

  await record.reload({
    include: [
      { model: ChatUser, as: "users", include: [{ model: User, as: "user" }] },
      { model: User, as: "owner" }
    ]
  });

  return record;
};

export default CreateService;
