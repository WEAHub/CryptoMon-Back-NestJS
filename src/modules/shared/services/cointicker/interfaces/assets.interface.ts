interface IAsset {
  exchange: string;
  fromSymbol: string;
  toSymbol: string;  
}

interface ITrade extends IAsset{
  id: string,
}

interface ISubAsset extends IAsset {
  price: number;
}

export {
  IAsset,
  ITrade,
  ISubAsset
}