const recommendations = [
    {
        id: "R.W.4",
        message: (tokenValue) => "Id locators are primarily more robust than XPaths; they are also cleaner and faster.",
        contract: (tokenValues) => {
            if (tokenValues.length < 1) return false

            return tokenValues[0].charAt(0) == '/' && tokenValues[0].charAt(1) != '/'
        }
    },
    {
        id: "R.W.0",
        message: (tokenValue) => `If an id locator is not applicable, convert the absolute XPath ${tokenValue} to a more robust relative XPath.`,
        contract: (tokenValues) => {
            if (tokenValues.length < 1) return false

            return tokenValues[0].charAt(0) == '/' && tokenValues[0].charAt(1) != '/'
        }
    },
    {
        id: "R.W.8.1",
        message: (tokenValue) => "Test names must contain three parts: what is being tested, under which circumstances and what's the expected result.",
        contract: (tokenValues) => {
            if (tokenValues.length < 3) return false

            if (tokenValues[2] == 'it' && tokenValues[1] == '(') {
                return true
            } else return false
        }
    }
]

exports.recommendations = recommendations