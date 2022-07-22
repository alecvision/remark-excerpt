/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-empty */
import * as check from "./utils.js";
import { visitParents } from "unist-util-visit-parents";
import { is } from "unist-util-is";
export class MultiError extends Error {
    constructor(errors) {
        super(`Multiple Errors Occured:`);
        Object.defineProperty(this, "errors", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.name = "MultiError";
        this.errors = errors;
    }
}
const isParagraph = (node) => is(node, "paragraph");
const remarkExcerpt = function (settings) {
    const { maxLength = 160, minLength = 80, defaultExcerpt = "...", ellipsis = "...", skipParagraphs = 0, minParagraphs = 0, } = settings !== null && settings !== void 0 ? settings : {};
    const stringify = this.stringify;
    return function transformer(tree, file) {
        var _a;
        file.data = Object.assign(Object.assign({}, file.data), { excerpt: defaultExcerpt.slice(0, maxLength - ellipsis.length) + ellipsis });
        const candidates = [];
        visitParents(tree, (node, ancestors) => {
            if (isParagraph(node)) {
                if (ancestors.some((a) => check.isTopLevelContent(a))) {
                    return "skip";
                }
                const normalizedChildren = node.children.map((child) => {
                    var _a;
                    if (check.isBlockContent(child)) {
                        return { type: "text", value: " ... " };
                    }
                    if (check.extendsAlternative(child)) {
                        return {
                            type: "emphasis",
                            children: [
                                { type: "text", value: `Image: ${(_a = child.alt) !== null && _a !== void 0 ? _a : "(...)"}` },
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
                });
                const paragraph = stringify(Object.assign(Object.assign({}, node), { children: normalizedChildren }));
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
            excerpt += (_a = eligibleParagraphs.shift()) !== null && _a !== void 0 ? _a : "";
            excerpt += "  ";
        }
        file.data = Object.assign(Object.assign({}, file.data), { excerpt: (excerpt.slice(0, maxLength - ellipsis.length) + ellipsis)
                .replaceAll("\n", " ")
                .trim() });
    };
};
export default remarkExcerpt;
