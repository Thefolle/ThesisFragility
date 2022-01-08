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





## Id

The number of recorded modifications that engage selectors by id is not enough to do any evaluation.

## CSS



## Tag

The number of recorded modifications that engage selectors by tag is not enough to do any evaluation.

## Text

A selector of this kind may refer to a link text, or a dropdown label for instance.
Data report 70 text modifications out of the total 1291 (5.4%); most of them (90%) belong to the assertion modifications category (78%). As expected, text labels are way fragile, independently from the context where they are employed. One reason could be that they also accomplish a presentational purpose.
The conclusion is that locators and asserts on text should be discouraged in favor of other more sturdy techniques.

## Overall analysis

Data collected don't take into account the number of modified locators out of the number of total locators, that is the number of non-modified and modified locators of the same nature. They instead concentrate on the probability that, given a locator, it gets modified. In other words, the collected data are absolute measures rather than relative. Therefore, the interpretation of the collected data must be careful and possibly it should be compared with findings from other sources; this is where recommendations from the wild come into play. [Put this observation in the validity threats].

Having at hand the rolled up data in the spreadsheet regarding locators, they have been sorted by decreasing number of modifications.

The locators beside XPath-based ones don't show relevant absolute frequencies. This means that either they are used rarely or that they are robust. As previously discussed, this ambiguity is solved through recommendation gathering which is described later on in the study.

As shown by statistical data, testers typically do not perform changes to asserts on xpaths, css, links, ids or names. It is common knowledge that selenium permits to retrieve attribute values given a node.

It is interesting to notice that the rank of the top-three locators according to the total number of modifications exactly match the order of preference of selectors suggested by the Selenium guidelines: first ids; if not applicable, then CSS; if neither ids nor CSS are admissible, fallback to XPaths.
