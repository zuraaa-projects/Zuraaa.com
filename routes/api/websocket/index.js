const {
  isInvalidPayload,
  jsonToPayload,
  opcodes,
  payloadToJson,
} = require("./util/payload");
const mongoose = require('mongoose');
const { partialBotObject } = require("../../../utils/bot");
const { eventsCode } = require("./util/events");


class WebsocketController {
  constructor() {
    this.websockets = new Set();
  }

  bind(ws) {
    this.wsServer = ws;
    this.wsServer.on("connection", (ws, msg) => this.connection(ws, msg));
    this.wsServer.on("close", () => this.close());
    // this.wsServer.on("listening", (args) => this.listening(args));
  }

  connection(ws, request) {
    let wsSession = new WsSession(ws);
    this.websockets.add(wsSession);
  }

  close(code, reason) {
    console.log("closed ", code, reason);
  }

  async broadcast(payload) {
    for (let ws of this.websockets) await ws.send(payload);
  }
}

class WsSession {
  constructor(ws) {
    this.ws = ws;
    this.status = Status.IDLE;
    this.queuePackets = [];
    this.sequence = 0;
    this.token = null;
    this.resetTimeout();
    this.send(payloadToJson({
      op: opcodes.Hello,
      data: { heartbeat_interval: 45000 },
    }));

    this.ws.onmessage = ({ data }) => this.onMessage(data);
  }

  send(data) {
    this.ws.send(data);
  }

  async onMessage(data) {
    const payload = jsonToPayload(data);
    if (isInvalidPayload(payload)) return;

    if (payload.op == opcodes.Heartbeat) {
      return this.resetTimeout();
    }

    if (this.status == Status.IDLE) {
      if (payload.op != opcodes.Identify)
        return this.queuePackets.push(payload); // If not identified, push packets and wait...

      const { token, properties } = payload.d;
      if (!token)
        return this.disconnect(payloadToJson({ op: opcodes.InvalidSession, data: { code: 401 } }));

      this.bot = await mongoose.model('bots').findOne({ tokens: { current: token } }).exec();
      if (!this.bot)
        return this.disconnect(payloadToJson({ op: opcodes.InvalidSession, data: { code: 401 } }));

      this.token = token;
      this.status = Status.READY;
      const usersCount = await mongoose.model('users').count().exec();
      const botsCount = await mongoose.model('bots').count().exec();
      this.send(payloadToJson({ op: opcodes.Dispatch, data: { selfBot: partialBotObject(this.bot), users: usersCount, bots: botsCount }, event: eventsCode.READY, sequence: this.sequence++ }));
    }

    if (this.queuePackets.length > 0) { // Packets in queue? Process each one like event emitted now
      let packet = this.queuePackets.shift();
      this.onMessage(packet);
    }

    if (payload.op == opcodes.Dispatch) {
      switch (payload.t) {
        case eventsCode.BOT_UPDATE: {
          break;
        }
      }
    }
  }

  disconnect(data) {
    this.send(data);
    clearTimeout(this.timeout);
    // if (this.ws) TODO: ws destroy
    //   this.ws.disconnect();
    this.status = Status.CLOSED;
    this.queuePackets = [];
    this.sequence = 0;
    this.token = null;
  }

  resetTimeout() {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => this.disconnect(), 60000);
  }
}

const Status = {
  IDLE: "idle",
  READY: "ready",
  CLOSED: 'closed'
};


const controller = new WebsocketController();
module.exports = controller;
module.exports.bindWs = (ws) => controller.bind(ws);