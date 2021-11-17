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

## Roll up analysis

Data collected don't take into account the number of modified locators out of the number of total locators,that is the number of non-modified and modified locators of the same nature. They instead concentrate on the probability that, given a locator, it gets modified. In other words, the collected data are absolute measures rather than relative.
Therefore, the interpretation of the collected data must be careful and possibly it should be compared with findings from other sources; this is where recommendations from the wild come into play.

Having at hand the rolled up data in the spreadsheet regarding locators, they have been sorted by decreasing number of modifications.
XPath locators reveal their strong fragility given that 356 of the 1300 total modifications (27%) belong to this category alone, whereas their occurrence w.r.t. the locator-based modifications is 85%.

The other locators don't show relevant absolute frequencies. However, if the frequencies rank is limited to the top three selectors, the order in which they appear is the same as the locator preference of usage as suggested by the Node guidelines.
