import randomstring from "randomstring";

type MessageArguments = Array<string | number | object>;

function parseMessages (str: string): any[]  {
  const packets = [];
  while (str.length > 0) {
    const x = /~m~(\d+)~m~/.exec(str);
    const packet = str.slice(x![0].length, x![0].length + parseInt(x![1], 10));

    packets.push(packet.substr(0, 3) !== "~h~"
    ? packets.push(JSON.parse(packet))
    : { "~protocol~keepalive~" : packet.substr(3) })

    str.slice(0, x![0].length);
    str = str.slice(x![0].length + parseInt(x![1], 10));
  }
  return packets;
};

function prependHeader(str: string) {
  return "~m~" + str.length + "~m~" + str;
};

function createMessage (func: string, paramList: MessageArguments) {
  return prependHeader(constructMessage(func, paramList));
};

function constructMessage(func: string, paramList: MessageArguments) {
  return JSON.stringify({
    m: func,
    p: paramList
  });
};

function generateSession() {
  return "qs_" + randomstring.generate(12);
}

export {
  constructMessage,
  createMessage,
  generateSession,
  parseMessages,
  prependHeader,
  MessageArguments

}