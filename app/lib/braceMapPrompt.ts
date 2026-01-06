export function buildBraceMapPrompt(idea: string) {
  return `
You are an expert Product Manager and System Architect.
Convert the idea into a comprehensive, TREE-STRUCTURED mind map JSON.

RULES:
1.  **HIERARCHY**: Structure as Parent → Feature → Action → Detailed Spec.
2.  **DETAIL IS CRITICAL**: Leaf nodes must be *explanatory* and *detailed*. Never use single words for leaf nodes.
3.  **MULTI-LINE CONTENT**: Use \`\\n\` to format detailed lists within a node.
    *   BAD LABEL: "User Details"
    *   GOOD LABEL: "View User Details:\\n1. Name\\n2. Email Address\\n3. Past Order History\\n4. Account Status"
4.  **GROUPING**: Do not fragment related small details into separate tiny nodes. Group them into one "Card" node (using newlines).
5.  **Professional Tone**: Use simple but precise business language.
6.  **Coverage**: Cover every aspect: Authentication, Dashboard, User Mgmt, Settings, etc.

JSON STRUCTURE (Strict):
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

EXAMPLE OF DESIRED DETAIL LEVEL (Mimic this depth):
"DASHBOARD" -> "Admin will be able to view:\\n1. Total Bookings\\n2. Active Drivers\\n3. Escalated Bookings\\n4. Alerts regarding:\\n  4.1. Unassigned Bookings\\n  4.2. Late Flights"

"USER MANAGEMENT" -> "VIEW" -> "Admin can view users as:\\n1. Username\\n2. Email\\n3. Booking History:\\n  3.1. Ongoing\\n  3.2. Past"

IDEA:
${idea}
`;
}
