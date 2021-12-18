# Restyling methods analysis

This paragraph discusses the task of developers that adapt the library methods to their actual needs.

Although the task does not functionally affect test cases, given the definition of fragility defined within the scope of this research, developers devote some effort to write such utility methods.

The task is performed in 5 test cases out of the 66 total maintained test cases (7.5%). The most relevant test case (94% of the restyle modifications) has been entirely re-ported to a corrected API of the testing tool. Mapping the whole existing tool API is famous to be a tedious task, which partially justifies why it is delivered so rarely.
The remaining 4 test cases have got instead spurious mappings.
In average there are ceil(245 / 66) = 4 restyling modifications per test case, during its whole lifetime.

What encourages developers to write such functions comprises clearness, readability or convenience:

![Methods for better readability](<.\DiffExamples\RestyleLibraryMethodsForReadability.png>)

The task is strictly related to the extraction of functions or macros from frequent snippets. The difference consists in that developers may write these utility methods ahead of their work or a-posteriori, namely when the code is showily getting harder to maintain due to snippet duplication.
An alternative motivation may consist of organizing a test case in logical parts, like steps of a use case, especially when the test case is getting longer and longer.
