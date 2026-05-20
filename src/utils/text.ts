export function firstWordsFrom(sentence: string, idealLength: number): string {
  const restrictedLength = Math.min(sentence.length, idealLength);
  const proposedLength = sentence.substring(restrictedLength).search(/\s|$/) + restrictedLength;
  const end = proposedLength < sentence.length ? '…' : '';
  return sentence.substring(0, proposedLength) + end;
}
