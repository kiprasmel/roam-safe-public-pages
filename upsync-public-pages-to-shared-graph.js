#!/usr/bin/env node

// @ts-check
/* eslint-disable @typescript-eslint/no-var-requires */

// const fs = require("fs");

const { findPublicPages } = require("./findPublicPages");

const publicPages = findPublicPages(
	require("../notes/json/kipras-g1.json"), //
	{
		recursive: false,
		publicTag: "#publix", // custom for testing
	}
).map((p) => p.page);

// fs.writeFileSync("public-pages.json", JSON.stringify(publicPages, null, 2), { encoding: "utf-8" });

const RoamPrivateApi = require("./roam-research-private-api");
const secrets = require("./secrets.json"); // TODO FIXME

/**
 * TODO implement helpful measures to avoid deleting pages
 * if the user specifies the wrong graph.
 *
 * e.g. have a #custom-touched-by-roam-safe-public-updates tag,
 * and check if it's already there.
 *
 * if it is:
 *   all good, continue
 *
 * if not:
 *   do we have any pages that have the `publicTag`, even recursively?
 *     if yes: VERY BAD !!! we're in the wrong graph -- ABORT & report to user
 *     if no: all good, continue
 *
 */
const publicGraphToImportInto = "kiprasmel";

const api = new RoamPrivateApi(publicGraphToImportInto, secrets.email, secrets.password, {
	headless: true,
	// @ts-expect-error
	folder: ".",
	// folder: "/tmp/",
});

const startTime = new Date();

Promise.resolve()
	.then(() => api.deletePages(publicPages))
	.then(() => api.import(publicPages))
	.then(() => api.markSelectedPagesAsPubliclyReadable(publicPages))
	.then(() => console.log("done", (new Date() - startTime) / 1000))
	.then(() => process.exit(0))
	.catch(() => process.exit(1))
	.finally(() => console.log("finally"));