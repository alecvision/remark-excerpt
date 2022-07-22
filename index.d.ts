import type { Plugin } from "unified";
import type { Root } from "mdast";
export declare class MultiError extends Error {
    errors: Error[];
    constructor(errors: Error[]);
}
export declare type Options = {
    maxLength?: number;
    minLength?: number;
    defaultExcerpt?: string;
    ellipsis?: string;
    skipParagraphs?: number;
    minParagraphs?: number;
};
declare const remarkExcerpt: Plugin<[(Options | undefined | void)?], Root, Root>;
export default remarkExcerpt;
//# sourceMappingURL=index.d.ts.map