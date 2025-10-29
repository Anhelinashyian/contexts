import webpack from 'webpack';
const { Compilation } = webpack;

class DebuggerConsoleValidatorPlugin {
    constructor(options = {}) {
        this.options = {
            forbidden: [
                /\bdebugger\b/,
                /\bconsole\.log\s*\(/,
            ],
            include: /\.js$/,
            failOnError: true,
            onlyInDev: true,
            ...options,
        };
    }

    apply(compiler) {
        const pluginName = 'DebuggerConsoleValidatorPlugin';

        compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
            compilation.hooks.processAssets.tap(
                {
                    name: pluginName,
                    stage: Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE,
                },
                (assets) => {
                    // Skip if onlyInDev and not in development mode


                    const problems = [];

                    for (const [filename, asset] of Object.entries(assets)) {
                        if (!this.options.include.test(filename)) continue;

                        const source = asset.source().toString();
                        const lines = source.split('\n');

                        lines.forEach((line, lineIndex) => {
                            this.options.forbidden.forEach((pattern) => {
                                const match = line.match(pattern);
                                if (match) {
                                    problems.push({
                                        pattern: pattern.toString(),
                                    });
                                }
                            });
                        });
                    }

                    if (problems.length > 0) {
                        console.error('\n❌ [DebuggerConsoleValidatorPlugin] Forbidden statements found:\n');

                        problems.forEach((p) => {
                            console.error(
                                `  • → matches ${p.pattern}\n`
                            );
                        });

                        if (this.options.failOnError) {
                            compilation.errors.push(
                                new Error(
                                    `${pluginName}: ${problems.length} forbidden statement(s) found.`
                                )
                            );
                        } else {
                            compilation.warnings.push(
                                new Error(
                                    `${pluginName}: ${problems.length} forbidden statement(s) found.`
                                )
                            );
                        }
                    }
                }
            );
        });
    }
}

export default DebuggerConsoleValidatorPlugin;