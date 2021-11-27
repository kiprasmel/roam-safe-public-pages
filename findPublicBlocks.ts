/* eslint-disable indent */

import { MutatingActionToExecute } from "./traverseBlockRecursively";
import { PageWithMetadata } from "./types";
import { withMetadata } from "./util/withMetadata";

export const removeUnknownProperties: MutatingActionToExecute<{}> = () => (block) =>
	!block
		? block
		: {
				string: block.string,
				uid: block.uid,
				heading: block.heading,
				"create-time": block["create-time"],
				"edit-time": block["edit-time"],
				"edit-email": block["edit-email"],
				"text-align": block["text-align"],
				...("refs" in block ? { refs: block.refs } : {}),
				...("children" in block ? { children: block.children } : {}),
				metadata: block.metadata || {},
		  };

export const markBlockPublic: MutatingActionToExecute<
	{
		publicTags: string[];
		publicOnlyTags: string[];
		privateTag: string;

		// parentBlock: Block | null;
		rootParentPage: PageWithMetadata<{}, {}>; // TODO FIXME
	},
	{
		isPublic: boolean; //
		isPublicOnly: boolean;
		hasPublicTag: boolean;
		hasPrivateTag: boolean;
	},
	{
		hasCodeBlock: boolean;
	}
> = ({
	// parentBlock,
	rootParentPage,
	publicTags,
	publicOnlyTags,
	privateTag,
}) =>
	// parentBlock
	(block, parentBlock) => {
		/**
		 * TODO we'll likely need separate variables for `isPageFullyPublic`
		 * and `isCurrenlBlockPublic` and `isCurrentBlockOrAnyParentsPublic`
		 *
		 * (and also minding the upwards tree, not necessarily straight from the root,
		 * because we might have a #private tag that would affect this)
		 *
		 */
		const hasPublicTag: boolean =
			!block.metadata.hasCodeBlock && publicTags.some((publicTag) => block.string.includes(publicTag));

		const hasPublicOnlyTag: boolean =
			!block.metadata.hasCodeBlock &&
			publicOnlyTags.some((publicOnlyTag) => block.string.includes(publicOnlyTag));

		const hasPrivateTag: boolean = !block.metadata.hasCodeBlock && block.string.includes(privateTag);

		/**
		 * ---
		 */

		const isPublicOnly: boolean = hasPublicOnlyTag && !hasPrivateTag && !parentBlock?.metadata.hasPrivateTag;

		const isPublic: boolean = !!(
			(rootParentPage.isFullyPublic || //
				hasPublicTag ||
				parentBlock?.metadata.isPublic) &&
			!hasPrivateTag &&
			!isPublicOnly
		);

		if (isPublic || hasPublicOnlyTag) {
			/**
			 * TODO FIXME, very ugly work-around lmao
			 *
			 * tho, perhaps not so ugly; will see:
			 * - was (& still is & will be) needed for priority;
			 * - is needed for finding out which pages get mentioned in public pages
			 *   and thus hiding them has no point so...
			 *
			 * TODO we'll have to support this too w/ the types oh boy!
			 */
			rootParentPage.hasAtLeastOnePublicBlockAnywhereInTheHierarchy = true;
		}

		return withMetadata({
			isPublicOnly,
			isPublic,
			hasPublicTag,
			hasPrivateTag,
		})(block);
	};