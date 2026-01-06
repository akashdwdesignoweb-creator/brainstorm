export function buildBraceMapPrompt(idea: string) {
  return `
You are helping a client brainstorm a software project.

Convert the idea into a TREE-STRUCTURED mind map.

RULES:
- Think in hierarchy (parent → child → sub-child)
-should be explanatory not just one word
- should cover every aspect of the product design 
- Use simple business language
- No pricing
- No timelines
- Output VALID JSON ONLY
- Follow this structure EXACTLY:

{
  "root": {
    "id": string,
    "label": string,
    "children": [
      {
        "id": string,
        "label": string,
        "children": []
      }
    ]
  },
  "complexity": "Low" | "Medium" | "High"
}

IDEA:
${idea}
`;
}
