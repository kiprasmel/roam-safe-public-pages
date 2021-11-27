import { RO, WithMetadata } from "./metadata.d";
import { Page, LinkedReferenceKind } from "./roam.d";

export * from "./metadata.d"; // TODO TS
export * from "./roam.d"; // TODO REMOVE

export type SettingsForPluginFindPublicPages = {
	publicTags: string[];
	publicOnlyTags: string[];
	privateTag: string; // TODO ARRAY
	/**
	 * TODO DEPRECATE - use the .uid instead! (will work for pages too to avoid merging them lol)
	 * (or keep and concat w/ the .title / .string to make obvious it's hidden)
	 */
	hiddenStringValue: string;
	/**
	 * make the publicTag page itself public
	 */
	makeThePublicTagPagePublic: boolean;

	/**
	 * TODO and DONE are more like boolean toggles to indicate if something's done or not,
	 * and show a visual indicator, thus we have a special case for them
	 */
	doNotHideTodoAndDone: boolean;

	/**
	 * currently blocks', will later apply to pages as well once we implement it properly
	 */
	keepMetadata: boolean;
};

export type PageWithMetadata<M0 extends RO, M1 extends RO> = {
	page: Page<M0, M1>;
	hasPublicTag: boolean;
	isPublicTagInRootBlocks: boolean;
	isFullyPublic: boolean;
	hasAtLeastOnePublicBlockAnywhereInTheHierarchy: boolean;
	hasAtLeastOnePublicLinkedReference: boolean;
	/**
	 * when a block links to a public linked reference
	 */
	hasAtLeastOneMentionOfAPublicLinkedReference: boolean;

	//
	isTitleHidden?: boolean;
	originalTitle: string;
	hiddenTitle: string;
};

export type LinkedReference = {
	origStr: string;
	fullStr: string; //
	kind: LinkedReferenceKind;
	create: (newStr: string) => string;
};

export type MutatingActionsToTakeProps = {
	hasPublicTag: boolean;
	isPublic: boolean;
};

export type ShouldContinueTraversal = boolean;

// export declare function MutatingActionToTake<
// 	ExistingBlock extends Block, //
// 	ExtraPropertiesForBlock extends Record<any, any>,
// 	Props extends Record<any, any>
// >(
// 	props: Props
// ): (
// 	block: ExistingBlock //
// ) => {} extends ExtraPropertiesForBlock ? ExistingBlock : ExistingBlock & ExtraPropertiesForBlock; //

// // TODO RM
// export declare function MutatingActionToTake<
// 	ExistingBlock extends Block, //
// 	ExtraPropertiesForBlock extends Record<any, any>
// 	/** no props */
// >(): // props?: never // TODO remove totally?
// (
// 	block: ExistingBlock //
// ) => {} extends ExtraPropertiesForBlock ? ExistingBlock : ExistingBlock & ExtraPropertiesForBlock; //

// export type MutatingAction<
// 	ExistingBlock extends Block, //
// 	ExtraPropertiesForBlock extends Record<any, any>,
// 	Props extends Record<any, any>
// > = (
// 	// ...props: {} extends Props ? [] : [Props] // TODO - conditional optional parameter
// 	props: Props,
// 	parentBlock?: ExistingBlock
// ) => (
// 	block: ExistingBlock //
// ) =>  ExistingBlock & ExtraPropertiesForBlock |
// 	[ExistingBlock & ExtraPropertiesForBlock , ShouldContinueTraversal]

export type RemoveUnknownPropertiesProps = {
	//
};

// type A =

// (
// 	props: RemoveUnknownPropertiesRecursivelyProps
// ) => (block: Block) => Block;

export type WithIsPublic = WithMetadata<{
	isPublic: boolean; //
	isPublicOnly: boolean;
	hasPublicTag: boolean;
	hasPrivateTag: boolean;
}>;
// export type FindPublicBlocks = (props: FindPublicBlocksProps) => (block: Block) => Block;

// TODO TS FIXME
export type LinkedRef<M0 extends RO = RO, M1 extends RO = RO> = {
	metaPage: PageWithMetadata<M0, M1>;
	candidateLR: LinkedReference;
};

export type FindLinkedReferencesProps<M0, M1> = {
	allPagesWithMetadata: PageWithMetadata<M0, M1>[];
	rootParentPage: PageWithMetadata<M0, M1>;
};
export type WithLinkedReferences<M0, M1> = WithIsPublic &
	WithMetadata<{
		linkedReferences: LinkedRef<M0, M1>[];
	}>;

export type HideBlockStringsIfNotPublicProps = {
	doNotHideTodoAndDone: boolean;
	hiddenStringValue: string;
};