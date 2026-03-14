const chunk = "data: {\"candidates\":[{\"content\":{\"parts\":[{\"text\":\"### resumeScore\\n\"}]}}]}";
const dataMatch = chunk.match(/^data:\\s*(.+)$/s);
console.log("Match:", !!dataMatch);
if (dataMatch) console.log("Extracted:", dataMatch[1]);

const chunk2 = "\\r\\ndata: {\"candidates\":[]}";
const dataMatch2 = chunk2.match(/^data:\\s*(.+)$/s);
console.log("Match2:", !!dataMatch2);
if (dataMatch2) console.log("Extracted2:", dataMatch2[1]);
