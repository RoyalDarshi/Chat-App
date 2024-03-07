import cron from 'node-cron';
import Message from "../modal/message";
import Sequelize from "sequelize";
import ArchiveMessage from "../modal/archiveMessage";

export async function moveMessagesToArchive() {
    try {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const messagesToArchive = await Message.findAll({
            where: {
                createdAt: { [Sequelize.Op.lt]: yesterday }
            }
        });

        for (const message of messagesToArchive) {
            await ArchiveMessage.create(message.toJSON());
            await message.destroy();
        }

        console.log('Messages moved to archive successfully.');
    } catch (error) {
        console.error('Error moving messages to archive:', error);
    }
}

cron.schedule('0 0 * * *', async () => {
   await moveMessagesToArchive();
});
