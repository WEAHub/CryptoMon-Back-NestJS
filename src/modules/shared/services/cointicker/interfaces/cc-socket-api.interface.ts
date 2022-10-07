interface ICommonStructure {
  TYPE: number;
  MESSAGE: string;
}

interface IMessageWelcome extends ICommonStructure {
  SERVER_UPTIME_SECONDS: number; 
  SERVER_NAME: string; 
  SERVER_TIME_MS: number;  
  CLIENT_ID: number;  
  DATA_FORMAT: string;
  SOCKETS_ACTIVE: number;  
  SOCKETS_REMAINING: number;  
  RATELIMIT_MAX_SECOND: number;  
  RATELIMIT_MAX_MINUTE: number;  
  RATELIMIT_MAX_HOUR: number;  
  RATELIMIT_MAX_DAY: number;  
  RATELIMIT_MAX_MONTH: number;  
  RATELIMIT_REMAINING_SECOND: number;  
  RATELIMIT_REMAINING_MINUTE: number;  
  RATELIMIT_REMAINING_HOUR: number;  
  RATELIMIT_REMAINING_DAY: number;  
  RATELIMIT_REMAINING_MONTH: number; 
}

interface ISubComplete extends ICommonStructure {
  SUB: string;
}

interface ISubMessage extends ICommonStructure{
  MARKET: string;
  FROMSYMBOL: string;
  TOSYMBOL: string;
  FLAGS: number;
  PRICE: number;
  LASTUPDATE: number;
  LASTVOLUME: number;
  LASTVOLUMETO: number;
  LASTTRADEID: string;
  VOLUMEDAY: number;
  VOLUMEDAYTO: number;
  VOLUME24HOUR: number;
  VOLUME24HOURTO: number;
  VOLUMEHOUR: number;
  VOLUMEHOURTO: number;
}

interface IMessageError extends ICommonStructure {
  PARAMETER: string;
  INFO: string;
}

enum EMessageTypes {
  STREAMERWELCOME = 20,
  SUBSCRIBECOMPLETE = 16,
  LOADCOMPLETE = 3,
  UNSUBSCRIBECOMPLETE = 17,
  UNSUBSCRIBEALLCOMPLETE = 18,
  HEARTBEAT = 999,
  UNAUTHORIZED = 401,
  SUBMESSAGE = 2,
  ERROR = 500,
}
  

export {
  ICommonStructure,
  IMessageWelcome,
  ISubComplete,
  ISubMessage,
  IMessageError,
  EMessageTypes
}