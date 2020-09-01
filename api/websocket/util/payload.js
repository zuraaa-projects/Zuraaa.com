const events = require("./events");
const payloadToJson = ({ op, data, sequence, event }) => {
  return JSON.stringify({
    op: toOpCode(op),
    d: data,
    s: sequence,
    t: event,
  });
};

const jsonToPayload = (data) => {
  try {
    return {
      op,
      d,
      s,
      t,
    } = JSON.parse(data);
  } catch (e) { return {}; };
};

// TODO: Improve this
const isInvalidPayload = (payload) => !payload || !payload.op;

const opcodes = {
  Dispatch: 0,
  Heartbeat: 1,
  Identify: 2,
  Resume: 3,
  Reconnect: 4,
  InvalidSession: 5,
  Hello: 6,
  HeartbeatACK: 7,
};

const toOpCode = (name) => Object.values(opcodes).indexOf(name);

const Hello = (heartbeat_interval) =>
  payloadToJson({
    op: opcodes.Hello,
    data: { heartbeat_interval },
  });

module.exports = {
  payloadToJson,
  isInvalidPayload,
  toOpCode,
  opcodes,
  Hello,
  jsonToPayload
};
