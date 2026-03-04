import twilio from 'twilio';
import { getReply } from './reply.js';

const {MessagingResponse} = twilio.twiml;

export async function handleIncomingSMS(req, res) {
    const incomingMessage = req.body.Body;
    const fromNumber = req.body.From;
    console.log(`SMS from ${fromNumber}: ${incomingMessage}`);

    try {
        const reply = await getReply(incomingMessage, fromNumber);
        const twiml = new MessagingResponse();
        twiml.message(reply);
        res.writeHead(200, {'Content-Type': 'text/xml'});
        res.end(twiml.toString());
    } catch (error) {
        console.error('Error handling incoming SMS:', error);
        res.status(500).send('Error processing message');
    }
}
