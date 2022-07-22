/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-empty */
import * as check from "./utils.js";
import { visitParents } from "unist-util-visit-parents";
import { visit } from "unist-util-visit";
import { is } from "unist-util-is";
import type { Plugin } from "unified";
import type { Node } from "unist";
import type {
  BlockContent,
  Paragraph,
  PhrasingContent,
  Root,
  TopLevelContent,
} from "mdast";

export class MultiError extends Error {
  errors: Error[];
  constructor(errors: Error[]) {
    super(`Multiple Errors Occured:`);
    this.name = "MultiError";
    this.errors = errors;
  }
}

export type Options = {
  // The maximum length of excerpts generated (including ellipses). Defaults to 160.
  maxLength?: number;
  // The minimum length of paragraph to excerpt. Defaults to 80.
  minLength?: number;
  // A default excerpt to use if no excerpt is generated. Defaults to "...".
  defaultExcerpt?: string;
  // A string of charactrs to append to the end of preview paragraphs. Defaults to "...".
  ellipsis?: string;
  // A number of paragraphs to skip when selecting a paragraph to excerpt. Defaults to 0.
  skipParagraphs?: number;
  // The minimum number of paragraphs required for an excerpt to be generated. Defaults to 0.
  minParagraphs?: number;
};

const isParagraph = (node: Node): node is Paragraph => is(node, "paragraph");
const remarkExcerpt: Plugin<[(Options | undefined | void)?], Root, Root> =
  function (this, settings) {
    const {
      maxLength = 160,
      minLength = 80,
      defaultExcerpt = "...",
      ellipsis = "...",
      skipParagraphs = 0,
      minParagraphs = 0,
    } = settings ?? {};
    const stringify = this.stringify;
    return function transformer(tree, file) {
      file.data = {
        ...file.data,
        excerpt:
          defaultExcerpt.slice(0, maxLength - ellipsis.length) + ellipsis,
      };
      const candidates: string[] = [];
      visitParents(tree, (node, ancestors) => {
        if (isParagraph(node)) {
          if (ancestors.some((a) => check.isTopLevelContent(a))) {
            return "skip";
          }
          const normalizedChildren = node.children.map((child) => {
            if (check.isBlockContent(child)) {
              return { type: "text", value: " ... " };
            }
            if (check.extendsAlternative(child)) {
              return {
                type: "emphasis",
                children: [
                  { type: "text", value: `Image: ${child.alt ?? "(...)"}` },
                ],
              };
            }
            if (check.extendsAssociation(child)) {
              return child.label
                ? { type: "text", value: `See: ${child.label}` }
                : { type: "text", value: `See: ${child.identifier}` };
            }
            if (check.extendsReference(child)) {
              return child.label
                ? { type: "text", value: `Ref: ${child.label}` }
                : { type: "text", value: `Ref: ${child.identifier}` };
            }
            if (check.extendsResource(child)) {
              return child.title
                ? { type: "text", value: `Link: ${child.title}` }
                : { type: "text", value: `Link: ${child.url}` };
            }
            switch (child.type) {
              case "footnote":
                return { type: "text", value: "(footnote)" };
              case "inlineCode":
                return { type: "text", value: "(inline code)" };
              case "break":
                return { type: "text", value: " --- " };
              case "text":
                return { type: "text", value: child.value };
              default:
                return child;
            }
          }) as PhrasingContent[];
          const paragraph = stringify({
            ...node,
            children: normalizedChildren,
          } as Paragraph) as string;
          candidates.push(paragraph);
        }
      });
      if (candidates.length < minParagraphs) {
        return tree;
      }
      const eligibleParagraphs = candidates.slice(skipParagraphs);
      if (eligibleParagraphs.length === 0) {
        return tree;
      }
      let excerpt = "";
      while (excerpt.length < minLength && eligibleParagraphs.length > 0) {
        excerpt += eligibleParagraphs.shift() ?? "";
        excerpt += "  ";
      }
      file.data = {
        ...file.data,
        excerpt: (excerpt.slice(0, maxLength - ellipsis.length) + ellipsis)
          .replaceAll("\n", " ")
          .trim(),
      };
    };
  };

export default remarkExcerpt;
