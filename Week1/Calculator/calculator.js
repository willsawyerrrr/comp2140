// Usage: node calculator.js [<expression>]
// <expression>, if supplied, must be of the form "<operand1> <operator>
//     <operand2>", including whitespace between each token.

const prompt = require("prompt-sync")({sigint: true}); // allow ^C to interrupt

/** Number of tokens in a binary expression: <operand1> <operator> <operand2>. */
const BINARY_TOKENS = 3

/** Number of tokens in a unary expression: <operator> <operand2>. */
const UNARY_TOKENS = 2

/** Valid arithmetic operators. */
const OPERATORS = ["+", "-", "*", "/", "**"];


/**
 * Parses the command line arguments and returns an object with the following properties:
 *    - interactive: boolean indicating whether the program should enter interactive mode
 *    - expression: string containing the expression to evaluate
 * 
 * @param {array[String]} args - command line arguments
 * @returns {Object} boolean interactive field representing whether the program is in interactive mode or not, and the expression to be evaluated if not in interactive mode
 */
function parseArgs(args) {
    if (args.length) { // expression supplied; non-interactive
        return {
            interactive: false,
            expression: args.join(" ")
        };
    } else { // expression not supplied; interactive
        return {
            interactive: true
        };
    }
}


/**
 * Runs an interactive calculator, repeatedly prompting the user for an
 * expression, evaluating the expression and outputting the result.
 */
function interactive() {
    let current = 0;
    while(typeof(current) === "number") {
        let expression = prompt("calculator.js >> ");
        current = evaluate(expression, current);
        console.log(current);
    }
}


/**
 * Evaluates the given arithmetic expression and returns the result.
 * @param {string} expression arithmetic expression to evaluate
 * @param {number} current current value of the calculator
 * @returns result of the given arithmetic expression
 */
function evaluate(expression, current = null) {
    let validation = validateExpression(expression);
    if (!validation.valid) {
        // do nothing
    } else if (validation.type == "Binary") {
        // evaluate as binary expression
        let tokens = validation.tokens;
        switch (tokens[1]) {
            case "+":
                return tokens[0] + tokens[2];
            case "-":
                return tokens[0] - tokens[2];
            case "*":
                return tokens[0] * tokens[2];
            case "/":
                return tokens[0] / tokens[2];
            case "**":
                return tokens[0] ** tokens[2];
            default:
                throw TypeError("Invalid operator");
        }
    } else if ((current != null) && (validation.type == "Unary")) {
        // only allow unary expression if current value is supplied
        // evaluate as unary expression, using current value
        let tokens = validation.tokens;
        switch (tokens[0]) {
            case "+":
                return current + tokens[1];
            case "-":
                return current - tokens[1];
            case "*":
                return current * tokens[1];
            case "/":
                return current / tokens[1];
            case "**":
                return current ** tokens[1];
            default:
                throw TypeError("Invalid operator");
        }
    }
    
    // invalid expression and/or unary expression without current value
    console.error("Usage: calculator.js [<expression>]");
    process.exit(1);
}


/**
 * Validates the given arithmetic expression. If the expression is a safe and
 * valid arithmetic expression, returns true; otherwise, returns false.
 * @param {string} expression binary arithmetic expression to validate
 * @returns {boolean | string} true if the expression is a valid arithmetic expression; false otherwise
 */
function validateExpression(expression) {
    if (!expression) { // null, undefined or empty string
        return {valid: false};
    }

    let tokens = expression.split(" ");
    if (tokens.length == BINARY_TOKENS) {
        if (isNaN(tokens[0])                        // operand1 is not a number
            || isNaN(tokens[2])                     // operand2 is not a number
            || !isNaN(tokens[1])                    // operator is a number
            || !OPERATORS.includes(tokens[1])) {    // operator is not valid
            return {valid: false};
        } else {
            let operand1 = parseFloat(tokens[0]);
            let operator = tokens[1];
            let operand2 = parseFloat(tokens[2]);
            return {
                valid: true,
                type: "Binary",
                tokens: [operand1, operator, operand2]
            };
        }
    } else if (tokens.length == UNARY_TOKENS) {
        if (isNaN(tokens[1])                        // operand is not a number
            || !isNaN(tokens[0])                    // operator is a number
            || !OPERATORS.includes(tokens[0])) {    // operator is not valid
            return {valid: false};
        } else {
            let operator = tokens[0];
            let operand = parseFloat(tokens[1]);
            return {
                valid: true,
                type: "Unary",
                tokens: [operator, operand]
            };
        };
    } else {
        return {valid: false};
    }
}


function main() {
    // skip "node" and "calculator.js" arguments
    let args = process.argv.slice(2);
    let parsed = parseArgs(args);
    if (parsed.interactive) {
        interactive();
    } else {
        console.log(evaluate(parsed.expression));
        process.exit(0);
    }
}


if (require.main === module) {
    main();
}
