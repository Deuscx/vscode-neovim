import path from "path";

import { NeovimClient } from "neovim";

import {
    attachTestNvimClient,
    closeNvimClient,
    closeAllActiveEditors,
    sendVSCodeKeys,
    assertContent,
    sendNeovimKeys,
    openTextDocument,
    wait,
} from "../utils";

describe("Jumplist & jump actions", () => {
    // abc
    let client: NeovimClient;
    before(async () => {
        client = await attachTestNvimClient();
    });
    after(async () => {
        await closeNvimClient(client);
        await closeAllActiveEditors();
    });

    it("Jump to definition to another file", async function () {
        this.retries(3);

        await openTextDocument(path.join(__dirname, "../../../test_fixtures/b.ts"));
        await wait(2000);

        await sendVSCodeKeys("jjjjjl");
        await sendVSCodeKeys("gd", 2000);

        await sendNeovimKeys(client, "<C-o>", 500);
        await assertContent(
            {
                cursor: [5, 1],
            },
            client,
        );
    });

    // currently too flaky
    it.skip("Jump to definition in same file", async function () {
        this.retries(3);

        await openTextDocument(path.join(__dirname, "../../../test_fixtures/go-to-def-same-file.ts"));
        await wait(2000);

        await sendVSCodeKeys("gg049jgd", 2000);
        await sendVSCodeKeys("jgd", 1000);
        await assertContent(
            {
                cursor: [4, 9],
            },
            client,
        );

        await sendNeovimKeys(client, "<C-o>");
        await assertContent(
            {
                cursor: [27, 9],
            },
            client,
        );
        await sendNeovimKeys(client, "<C-o>");
        await assertContent(
            {
                cursor: [49, 0],
            },
            client,
        );
    });
});
