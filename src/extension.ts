import {
    Disposable, ProviderResult, TreeItem, Uri,
    window, workspace, commands,
} from 'vscode';

const disposables: Disposable[] = [];

const PUBLISHER_ID = 'jrcligny';
const EXTENSION_ID = `${PUBLISHER_ID}.template`;
const TREE_VIEW_ID = `${EXTENSION_ID}.treeview`;
const COMMAND_ID = `${EXTENSION_ID}.command`;
const CATEGORY_FILE_TYPE = `${EXTENSION_ID}.file-type`;

export async function activate() {

    /**
     * Find all files at the root of the current workspaces and associate them with the type `jrcligny.file`.
     */
    const fileURIs = await workspace.findFiles(`*`);
    const filePaths = fileURIs.map((file) => file.fsPath);
    commands.executeCommand('setContext', CATEGORY_FILE_TYPE, filePaths);

    /**
     * Register a command with the identifier `jrcligny.core.command`.
     */
    const registeredCommand = commands.registerCommand(
        /* Command identifier */
        COMMAND_ID,
        /* Command handler */
        (entry?: Uri) => window.showInformationMessage(`Command triggered on ${entry?.fsPath || 'unknown file'}`),
    );
    /**
     * Push the registered command to the disposables array to dispose it when the extension is deactivated.
     */
    disposables.push(registeredCommand);

    /**
     * Instantiate a list of elements representing data to expose
     */
    const elementHandler = (function () {
        /**
         * Get the children of `element` or root if no element is passed.
         *
         * @param element The element from which the provider gets children. Can be `undefined`.
         * @returns Children of `element` or root if no element is passed.
         */
        function getChildren(element?: { label: string; }): { label: string; }[] | null {
            if (!element) {
                // Return root's children
                return [
                    { label: 'Element 1' },
                    { label: 'Element 2' },
                    { label: 'Element 3' },
                    { label: 'Element 4' },
                ];
            }
            return null;
        }
        return { getChildren };
    })();

    /**
     * Create a {@link TreeView} for the view contributed using the extension point `views`.
     * @param viewId Id of the view contributed using the extension point `views`.
     * @param options Options for creating the {@link TreeView}
     * @returns a {@link TreeView}.
     */
    const treeViewInstance = window.createTreeView(
        /* Id of the view contributed using the extension point `views`. */
        TREE_VIEW_ID,

        /* Options for creating a {@link TreeView} */
        {
            /**
             * A data provider that provides tree data.
             */
            treeDataProvider: {
                /**
                 * Get {@link TreeItem} representation of the `element`
                 *
                 * @param element The element for which {@link TreeItem} representation is asked for.
                 * @returns TreeItem representation of the element.
                 */
                getTreeItem(element: { label: string; }): TreeItem {
                    return new TreeItem(element.label);
                },

                /**
                 * Get the children of `element` or root if no element is passed.
                 *
                 * @param element The element from which the provider gets children. Can be `undefined`.
                 * @returns Children of `element` or root if no element is passed.
                 */
                getChildren(element?: { label: string; }): ProviderResult<{ label: string; }[]> {
                    return elementHandler.getChildren(element);
                }

            }
        }
    );
    /**
     * Push the {@link TreeView} instance to the disposables array to dispose it when the extension is deactivated.
     */
    disposables.push(treeViewInstance);

    /**
     * Publish the API for other extensions to use.
     */
    return {
        getChildren: elementHandler.getChildren
    };
}

export async function deactivate(): Promise<void> {
    /**
     * Dispose all the disposables when the extension is deactivated.
     */
    disposables.forEach((disposable) => disposable.dispose());
}
