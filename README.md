- [Atlas Parser](#atlas-parser)
  - [Installation](#installation)
  - [Usage](#usage)

# Atlas Parser

This is an accompanying repo for the course [Building a Parser from Scratch](https://www.udemy.com/course/parser-from-scratch/).

It's part of a larger goal on designing my own programming language called Atlas.

## Installation

Clone this project

```sh
> git clone https://github.com/IsaacAderogba/atlas-parser.git
```

<br />
From the project directory, give the `atlas` binary execution rights:

```sh
> chmod +x bin/atlas
```

## Usage

The parser can now evaluate any code (https://en.wikipedia.org/wiki/S-expression) you give it. Check the [tests](https://github.com/IsaacAderogba/atlas-parser/tree/main/src/__tests__) directory for inspiration.

The following prints out the AST representation of `'2 + 2;'`.

```sh
> ./bin/atlas -e '2 + 2;'
{
  "type": "Program",
  "body": [
    {
      "type": "ExpressionStatement",
      "expression": {
        "type": "BinaryExpression",
        "operator": "+",
        "left": {
          "type": "NumericLiteral",
          "value": 2
        },
        "right": {
          "type": "NumericLiteral",
          "value": 2
        }
      }
    }
  ]
}

```
