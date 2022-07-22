import type { Node } from "unist";
import type {
  PhrasingContent,
  StaticPhrasingContent,
  BlockContent,
  DefinitionContent,
  FrontmatterContent,
  ListContent,
  RowContent,
  TableContent,
  TopLevelContent,
  Resource,
  Alternative,
  Association,
  Paragraph,
  Literal,
  Reference,
  HTML,
  Blockquote,
  LinkReference,
  Break,
  Code,
  Emphasis,
  Strong,
  Image,
  List,
  ListItem,
  Table,
  TableRow,
  TableCell,
  Definition,
  Delete,
  Footnote,
  FootnoteReference,
  FootnoteDefinition,
  Heading,
  ImageReference,
  InlineCode,
  Link,
  Text,
  ThematicBreak,
  YAML,
} from "mdast";
import { convert, Parent } from "unist-util-is";

// Phrasing Content:
const staticPhrasingContentTypes = new Set<StaticPhrasingContent["type"]>([
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
const phrasingContentTypes = new Set<PhrasingContent["type"]>([
  "link",
  "linkReference",
  ...staticPhrasingContentTypes,
]);

// Top-Level Content:
const blockContentTypes = new Set<BlockContent["type"]>([
  "html",
  "paragraph",
  "heading",
  "thematicBreak",
  "blockquote",
  "list",
  "table",
  "code",
]);
const definitionContentTypes = new Set<DefinitionContent["type"]>([
  "definition",
  "footnoteDefinition",
]);
const frontmatterContentTypes = new Set<FrontmatterContent["type"]>(["yaml"]);
const topLevelContentTypes = new Set<TopLevelContent["type"]>([
  ...frontmatterContentTypes,
  ...blockContentTypes,
  ...definitionContentTypes,
]);

// Special Content (or: Spread Content)
const listContentTypes = new Set<ListContent["type"]>(["listItem"]);
const rowContentTypes = new Set<RowContent["type"]>(["tableCell"]);
const tableContentTypes = new Set<TableContent["type"]>(["tableRow"]);

// Branch / Leaf Tests:
export const isParent = (node: Node): node is Parent => "children" in node;
export const isLiteral = (node: Node): node is Literal => "value" in node;

// Mixin Tests:
export const extendsResource = (node: Node): node is Node & Resource =>
  "url" in node;
export const extendsAlternative = (node: Node): node is Node & Alternative =>
  "alt" in node;
export const extendsReference = (node: Node): node is Node & Reference =>
  "referenceType" in node;
export const extendsAssociation = (node: Node): node is Node & Association =>
  "identifier" in node;

// Content Model Tests:
export const isPhrasingContent = (node: Node): node is PhrasingContent =>
  //@ts-expect-error: ts2345
  phrasingContentTypes.has(node.type);

export const isStaticPhrasingContent = (
  node: Node
  //@ts-expect-error: ts2345
): node is StaticPhrasingContent => staticPhrasingContentTypes.has(node.type);

export const isBlockContent = (node: Node): node is BlockContent =>
  //@ts-expect-error: ts2345
  blockContentTypes.has(node.type);

export const isDefinitionContent = (node: Node): node is DefinitionContent =>
  //@ts-expect-error: ts2345
  definitionContentTypes.has(node.type);

export const isFrontmatterContent = (node: Node): node is FrontmatterContent =>
  //@ts-expect-error: ts2345
  frontmatterContentTypes.has(node.type);

export const isListContent = (node: Node): node is ListContent =>
  //@ts-expect-error: ts2345
  listContentTypes.has(node.type);

export const isRowContent = (node: Node): node is RowContent =>
  //@ts-expect-error: ts2345
  rowContentTypes.has(node.type);

export const isTableContent = (node: Node): node is TableContent =>
  //@ts-expect-error: ts2345
  tableContentTypes.has(node.type);

export const isTopLevelContent = (node: Node): node is TopLevelContent =>
  //@ts-expect-error: ts2345
  topLevelContentTypes.has(node.type);

// Type Predicates:
export const isParagraph = convert<Paragraph>("paragraph");
export const isHTML = convert<HTML>("html");
export const isBlockQuote = convert<Blockquote>("blockquote");
export const isReference = convert<LinkReference>("linkReference");
export const isBreak = convert<Break>("break");
export const isCode = convert<Code>("code");
export const isEmphasis = convert<Emphasis>("emphasis");
export const isStrong = convert<Strong>("strong");
export const isImage = convert<Image>("image");
export const isList = convert<List>("list");
export const isListItem = convert<ListItem>("listItem");
export const isTable = convert<Table>("table");
export const isTableRow = convert<TableRow>("tableRow");
export const isTableCell = convert<TableCell>("tableCell");
export const isDefinition = convert<Definition>("definition");
export const isDelete = convert<Delete>("delete");
export const isFootnote = convert<Footnote>("footnote");
export const isFootnoteReference = convert<FootnoteReference>("footnoteReference");
export const isFootnoteDefinition = convert<FootnoteDefinition>("footnoteDefinition");
export const isHeading = convert<Heading>("heading");
export const isImageReference = convert<ImageReference>("imageReference");
export const isInlineCode = convert<InlineCode>("inlineCode");
export const isLink = convert<Link>("link");
export const isText = convert<Text>("text");
export const isThematicBreak = convert<ThematicBreak>("thematicBreak");
export const isYAML = convert<YAML>("yaml");

