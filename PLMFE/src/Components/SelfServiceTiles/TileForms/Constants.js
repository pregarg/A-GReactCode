export const RenderType = {
  PROVIDER_DISPUTE: "PROVIDER_DISPUTE",
  APPEALS: "APPEALS",
};

export const chunkArray = (arr, chunkSize, filter) => {
  return arr.reduce((result, item, idx) => {
    if (!filter(item)) return result;
    console.log(result);
    const chunkIdx = Math.floor(result.flatMap((e) => e).length / chunkSize);
    if (!result[chunkIdx]) {
      result[chunkIdx] = [];
    }
    result[chunkIdx].push(item);
    return result;
  }, []);
};
