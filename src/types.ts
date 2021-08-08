/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */

export interface IInterface {
  author: {
    name: string | number;
    avatar: string[];
  };
  content: object;
  isAnswered: boolean;
  isHighlighted: boolean;
}

export type FQ = Record<string, IInterface>;

// const obj: {
//   'uuid1': IInterface,
//   'uuid2': IInterface
//   ...
// }

export type FQAny = Record<string, any>;

// const obj: {
//   'a': string,
//   'string': number,
//   'string2': any,
// }

type IL = Record<'a' | 'b' | 'c', string>;

// const obj: IListTest = {
//   a: '10',
//   b: '10',
//   c: '10',
// };

type IL1 = Record<'a' | 'b' | 'c', string>;
type IL2 = Record<string, any>;

type IL3 = IL1 & IL2;
// interface IL3 extends IL1, IL2 {}

// const obj: IL3 = {
//   a: '10', // IL1
//   b: '10', // IL1
//   c: '10', // IL1
//
//   d: '10', // IL2
//   ...      // IL2
// };

interface Box<T> {
  contents: T;
}

// const boxA: Box<string> = {
//   contents: 'string text',
// };

type Box1<T> = Array<T>;

// const objBase: Box1<number> = [1, 2, 3];

type IObject<T> = T;

interface ISimple {
  id: string;
  name: string;
}
const x: ISimple = {
  id: '1',
  name: 'Rodrigo',
};

// const obj: IObject<typeof x> = {
//   id: '10',
//   name: '10',
// }
