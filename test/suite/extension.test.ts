import * as assert from 'assert';
import * as vscode from 'vscode';
import * as extension from '../../src/extension';

/**
 * These tests are end-to-end tests that run the extension and test its behavior.
 *
 * They can access the VS Code API and are slower than unit tests.
 * Any unit test should be implemented in a spec file instead.
 */

suite('Extension Test Suite', () => {
    suiteSetup(() => {
        extension.activate();
    });

    suiteTeardown(() => {
        vscode.window.showInformationMessage('All tests done!');
    });

    test('Sample test', () => {
        // Arrange

        // Act

        // Assert
        assert.ok(true);
    });
});
