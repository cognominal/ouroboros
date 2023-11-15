
const sampledCode = `
export class ShowAllCommandsAction extends Action2 {

    static readonly ID = 'workbench.action.showCommands';

    constructor() {
        super({
            id: ShowAllCommandsAction.ID,
            title: { value: localize('showTriggerActions', "Show All Commands"), original: 'Show All Commands' },
            keybinding: {
                weight: KeybindingWeight.WorkbenchContrib,
                when: undefined,
                primary: !isFirefox ? (KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyP) : undefined,
                secondary: [KeyCode.F1]
            },
            f1: true
        });
    }

    async run(accessor: ServicesAccessor): Promise<void> {
        accessor.get(IQuickInputService).quickAccess.show(CommandsQuickAccessProvider.PREFIX);
    }
}
`;



// export function findKeybindingSource(sourceCode: string): string | undefined {
//     const sourceFile = ts.createSourceFile('sample.ts', sourceCode, ts.ScriptTarget.Latest);

//     // Find the constructor declaration
//     const constructor = sourceFile.statements.find(
//         ts.isClassDeclaration
//     )?.members.find(ts.isConstructorDeclaration);

//     if (!constructor) {
//         return undefined;
//     }

//     // Find the super call
//     const superCall = constructor.body?.statements.find(
//         ts.isExpressionStatement
//     )?.expression;

//     if (!superCall || superCall.expression || !ts.isCallExpression(superCall) || !ts.isSuperKeyword(superCall.expression)) {
//         return undefined;
//     }

//     // Find the keybinding property
//     const keybindingArg = superCall.arguments[0];
//     const keybindingProp = ts.isObjectLiteralExpression(keybindingArg)
//         ? keybindingArg.properties.find(
//                 (prop) =>
//                     ts.isPropertyAssignment(prop) &&
//                     ts.isIdentifier(prop.name) &&
//                     prop.name.text === 'keybinding'
//             )
//         : undefined;

//     if (!keybindingProp) {
//         return undefined;
//     }

//     // Extract the source code for the keybinding property
//     const keybindingSource = sourceCode.substring(
//         keybindingProp.pos,
//         keybindingProp.end
//     );

//     return keybindingSource;
// }

// console.log(findKeybindingSource(sampledCode));


// console.log(sourceFile.statements);
