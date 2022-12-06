import { Bot } from 'grammy';
import dotenv from "dotenv";
import { nuevaFrase, fraseAleatoria } from './queries';

dotenv.config();
const BOT = new Bot(process.env.TELEGRAM_TOKEN as string);

BOT.command(['start', 'hello', 'hola'], (ctx) => {
    if (ctx.from) {
        ctx.reply(`Hola ${ctx.from?.first_name}! 👀`);
    }
});

BOT.command(['stop', 'shutdown', 'bye', 'adios'], (ctx) => {
    if (ctx.chat.id.toString() == process.env.TELEGRAM_CHAT_ID as string) {
        ctx.reply(`👋`);
        BOT.stop();
    }
});

// ToDo: fix, no funciona en canales
BOT.command('nuevafrase', async (ctx) => {
    if (ctx.chat.id.toString() == process.env.TELEGRAM_CHAT_ID as string) {
        await nuevaFrase(ctx.match as string).then(() => {
            const msg = `La frase: "${ctx.match}" fue añadida correctamente a la base de datos.`;
            // ToDo: enviar mensaje como respuesta
            if (ctx.chat.type == 'channel') {
                ctx.reply(msg, {
                    reply_to_message_id: ctx.channelPost?.message_id,
                });
            }
            else {
                ctx.reply(msg, {
                    reply_to_message_id: ctx.message?.message_id,
                });
            }
        });
    }
});

BOT.command('frasealeatoria', async (ctx) => {
    await fraseAleatoria().then((resp) => {
        // ToDo: enviar mensaje como respuesta
        ctx.reply(resp.mensaje);
    });
});

BOT.command('mate', (ctx) => {
    ctx.reply(`🧉`);
});

BOT.command('id', (ctx) => {
    ctx.reply(ctx.from?.id + '\n' + ctx.chat.id);
});

BOT.on('message:document', (ctx) => {
    ctx.reply(ctx.msg.document.file_name as string);
});

BOT.command('data', (ctx) => {
    ctx.reply(JSON.stringify(ctx, null, "\t"));
});

BOT.start();