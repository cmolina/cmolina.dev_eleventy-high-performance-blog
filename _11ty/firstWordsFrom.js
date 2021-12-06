module.exports = function firstWordsFrom(sentence, idealLength) {
    const restrictedLength = Math.min(sentence.length, idealLength);
    const proposedLength = sentence.substr(restrictedLength).search(/\s|$/) + restrictedLength;
    const end = (proposedLength < sentence.length) ? "…" : "";
    
    return sentence.substr(0, proposedLength) + end;
};
