const eris = require('eris');
require('dotenv').config();

const bot = new eris.Client(process.env.BOT_TOKEN);

bot.on('ready', () => { console.log('Ready!'); });

const commandHandlerForCommandNames = {}
commandHandlerForCommandNames['addPayment'] = (msg, args) => {
    if (!msg.channel.guild) {
        return msg.channel.createMessage('This command can only be used in a server');
    }
    if (args.length < 2) {
        return msg.channel.createMessage('Not enough arguments');
    } else if(args.length >= 2) {
        const mention = args[0]
        const amount = parseFloat(args[1])

        return msg.channel.createMessage(`${mention} paid $${amount.toFixed(2)}`)
    }
}

bot.on('messageCreate', async (msg) => {
    const content = msg.content;
    if (!content.startsWith(process.env.PREFIX)) {
        return
    }

    const parts = content.split(' ').map(s => s.trim()).filter(s => s)
    const command = parts[0].substring(process.env.PREFIX.length)

    const commandHandler = commandHandlerForCommandNames[command]
    if (!commandHandler) {
        return
    }

    const args = parts.slice(1)

    try {
        await commandHandler(msg, args)
    } catch (error) {
        console.warn('Error handeling the command', error);
        msg.channel.createMessage('Error handeling the command')
    }
})

bot.on('error', (error) => {
    console.warn('Error', error);
});

bot.connect();