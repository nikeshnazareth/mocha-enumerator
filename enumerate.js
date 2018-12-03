const Scenario = require('./scenario');

const enumerate = (scenario, validTestsFn, invalidTestsFn, parents = []) => {
    // the contents of this scenario expansion is wrapped in a function to because it may not require a describe block
    const wrapper = () => {
        if (scenario.childElements.length === 0) {
            beforeEach(scenario.set);

            if (parents.length > 0) {
                const parent = parents[0];
                const partialParent = new Scenario(
                    null,
                    parent.childElements.slice(1),
                    parent.value(scenario),
                    parent.valid(scenario),
                    parent.set(scenario)
                );
                enumerate(partialParent, validTestsFn, invalidTestsFn, parents.slice(1))
            } else {
                const tests = scenario.valid ? validTestsFn : invalidTestsFn;
                tests();
            }
        } else {
            const nextProperty = scenario.childElements[0];
            describe(nextProperty.desc, () => {
                nextProperty.scenarios.map(subScenario =>
                    enumerate(subScenario, validTestsFn, invalidTestsFn, [scenario, ...parents]));
            });
        }
    };

    const contents = scenario.desc ? () => describe(scenario.desc, wrapper) : wrapper;
    contents();
};

module.exports = enumerate;
