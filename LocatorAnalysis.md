# Locator analysis

## Xpath

### Definitions

This kind of locator is fragile to structural changes in the DOM of the AUT. The structural changes that affect xpaths are classified as follows:
: Addition of an element;
: Modification of an element;
: Deletion of an element;
: Addition of a child in a collection;
: Deletion of a child in a collection;
: Implicit move of an element: when D adds or deletes a portion of xpath, beside the last element inside the xpath, *with* a real modification in the AUT of the elements in the portion;
: Explicit move of an element: when D adds or deletes a portion of xpath, beside the last element inside the xpath, *without* a real modification in the AUT of the elements in the portion;
: Addition of an attribute to an element;
: Modification of an attribute of an element;
: Deletion of an attribute from an element.

Example of explicit move of an element: ![Move element](<./DiffExamples/XpathMoveElement.png>)

### Consequences of structural changes to xpaths

The longer the xpath, the greater the probability that the xpath is involved in a change.

A change in the AUT may trigger other xpaths to be modified, beside the directly-interested ones. For instance, the addition or deletion of an item in a collection causes a correction not just to the pertinent xpath, quite also to the subsequent ones in the list that get shifted upward or downward.

### Possible solutions

1. Use of other kinds of locators;
2. The same locator is converted from a literal to a macro, when it is referenced multiple times; this avoids bulk modifications;
3. Each locator is split in concatenated macros: how to split it properly?

## Id

The number of recorded modifications that engage selectors by id is not enough to do any evaluation.

## Tag

The number of recorded modifications that engage selectors by tag is not enough to do any evaluation.

## Text

A selector of this kind may refer to a link text, or a dropdown label for instance.
