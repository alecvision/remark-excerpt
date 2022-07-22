import { convert } from "unist-util-is";
// Phrasing Content:
const staticPhrasingContentTypes = new Set([
    "text",
    "emphasis",
    "strong",
    "delete",
    "html",
    "inlineCode",
    "break",
    "image",
    "imageReference",
    "footnote",
    "footnoteReference",
]);
const phrasingContentTypes = new Set([
    "link",
    "linkReference",
    ...staticPhrasingContentTypes,
]);
// Top-Level Content:
const blockContentTypes = new Set([
    "html",
    "paragraph",
    "heading",
    "thematicBreak",
    "blockquote",
    "list",
    "table",
    "code",
]);
const definitionContentTypes = new Set([
    "definition",
    "footnoteDefinition",
]);
const frontmatterContentTypes = new Set(["yaml"]);
const topLevelContentTypes = new Set([
    ...frontmatterContentTypes,
    ...blockContentTypes,
    ...definitionContentTypes,
]);
// Special Content (or: Spread Content)
const listContentTypes = new Set(["listItem"]);
const rowContentTypes = new Set(["tableCell"]);
const tableContentTypes = new Set(["tableRow"]);
// Branch / Leaf Tests:
export const isParent = (node) => "children" in node;
export const isLiteral = (node) => "value" in node;
// Mixin Tests:
export const extendsResource = (node) => "url" in node;
export const extendsAlternative = (node) => "alt" in node;
export const extendsReference = (node) => "referenceType" in node;
export const extendsAssociation = (node) => "identifier" in node;
// Content Model Tests:
export const isPhrasingContent = (node) => 
//@ts-expect-error: ts2345
phrasingContentTypes.has(node.type);
export const isStaticPhrasingContent = (node
//@ts-expect-error: ts2345
) => staticPhrasingContentTypes.has(node.type);
export const isBlockContent = (node) => 
//@ts-expect-error: ts2345
blockContentTypes.has(node.type);
export const isDefinitionContent = (node) => 
//@ts-expect-error: ts2345
definitionContentTypes.has(node.type);
export const isFrontmatterContent = (node) => 
//@ts-expect-error: ts2345
frontmatterContentTypes.has(node.type);
export const isListContent = (node) => 
//@ts-expect-error: ts2345
listContentTypes.has(node.type);
export const isRowContent = (node) => 
//@ts-expect-error: ts2345
rowContentTypes.has(node.type);
export const isTableContent = (node) => 
//@ts-expect-error: ts2345
tableContentTypes.has(node.type);
export const isTopLevelContent = (node) => 
//@ts-expect-error: ts2345
topLevelContentTypes.has(node.type);
// Type Predicates:
export const isParagraph = convert("paragraph");
export const isHTML = convert("html");
export const isBlockQuote = convert("blockquote");
export const isReference = convert("linkReference");
export const isBreak = convert("break");
export const isCode = convert("code");
export const isEmphasis = convert("emphasis");
export const isStrong = convert("strong");
export const isImage = convert("image");
export const isList = convert("list");
export const isListItem = convert("listItem");
export const isTable = convert("table");
export const isTableRow = convert("tableRow");
export const isTableCell = convert("tableCell");
export const isDefinition = convert("definition");
export const isDelete = convert("delete");
export const isFootnote = convert("footnote");
export const isFootnoteReference = convert("footnoteReference");
export const isFootnoteDefinition = convert("footnoteDefinition");
export const isHeading = convert("heading");
export const isImageReference = convert("imageReference");
export const isInlineCode = convert("inlineCode");
export const isLink = convert("link");
export const isText = convert("text");
export const isThematicBreak = convert("thematicBreak");
export const isYAML = convert("yaml");
