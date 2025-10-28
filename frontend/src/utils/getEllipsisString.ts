export const getEllipsisString = (
    value: string,
    countLeft: number,
    countRight: number,
  ) =>
    value.length <= countLeft + countRight + 4
      ? value
      : [
          value.substring(0, countLeft),
          value.substring(value.length - countRight),
        ].join('...');
  