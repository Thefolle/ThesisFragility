# Thesis draft

## Background: tipologia di testing considerata (descrizione più lunga, citando); parla in maniera estesa di fragilità (almeno 15-20 pagine)

Analizzare la fragilità: creare script che possano analizzare lo stato di un app web che usa un progetto github; usa degli scraper (identificatori di codice); prioritazzazione dei test: se il tempo di sviluppo a disposizione è poco, lo sviluppatore dovrebbe aggiustare i test secondo una certa priorità. Predittore: guardando l'andamento della fragilità, puo' indovinare quali sono i test più fragili.

No effort to measure the actual fragility in the wild have been performed so far.

Cite paper 3 as example of previous work.

Current lints, like Prettier, essentially check style compliance of the code: for instance, they tell how arguments of functions should be positioned or they even probe anti-patterns regarding style. Tools like ESLint, instead, are specific for a development environment.

Material and studies about fragility are scarce (at least in the wild).

## Analisi e concettualizzazione della fragilità

The language in which these wikis are written is not well-finished: there are sentences with no independent clause.
The issue presented above triggers a work of textual analysis to shed light on what is the real message of a wiki.
Additionally, another essential task have been carried out and that commonly goes by the name of internal consistency check.

Some recommendations coming from the wild are apparently contrasting:

- rule W.0 states that unit tests are less fragile than integration tests due to their low volatility, namely they get changed more rarely than the latters;
- recommendation W.1 states that lower-level tests are more prone to fragility as they depend from implementation details.

Since multiple rules may declare opposite statements to each other, they have been checked also against external consistency. Regarding the methodology, recommendations have been evaluated incrementally in order to easier the process: given the corpus of already-scanned and consistent recommendations, a further rule is compared with them and admitted in case of coherence.

The intermediate result has been filtered by fragility-pertinent rules: guidelines that establish a recommendation just for the sake of clearness, for instance, have been dropped. Instead, those good practices that enforce clearness or other properties for the name of fragility have been kept.

Each source may contain different recommendations, as well as a recommendation may be extracted from multiple sources.

Unfortunately, the provided recommendations have a variable degree of ease of implementation. This may lower the tool's capabilities, as described in the pertinent chapter.

*You can infer which are the properties fragility depends from by automatically inspecting the thesis: any word ending with -ility or -ness is a good candidate*.

Although performing data mining by collecting test cases modifications along their history is a reasonable and direct source of information, other channels have been considered. Indeed, developers feel the implicit need to establish rules that hopefully guarantee stronger robustness and try to follow them. These rules can be still found in the wild, but under the form of wikis (as called on GitHub) rather than code. Additionally, authoritative organizations like Google, the Selenium team, Node.js and so on have published guidelines on the Net with the same purpose over the years. Taking into account what developers experienced about fragility so that to write down their own guidelines enrich the range of rules that a tool is capable to enforce or suggest; the developer would rely upon a tool that summarizes the knowledge of hundreds of peers from the wild.

A more formal justification of the motivation that encouraged this study to search for other sources of information is that data collection based on statistics is a quantitative approach. Nowadays automating data analysis through algorithms is catching on a wider and wider audience. Nevertheless, experts of big data are at the same time more convinced that these techniques, like association rule recognition, cannot reveal every facet of the truth starting only from numbers. To prove this, it's enough to observe that even firms that analyze data coming from social networks or mobile cells still leverage the traditional focus groups to shape their product, which in turn is a qualitative approach.
Here going deep into these topics is not of interest, but it is still important to highlight what are the advantages of both quantitative and qualitative techniques: while the former gives a general and objective overview, the latter obtains information directly from end users.
As a consequence, combining both techniques has been deemed more profitable for the purpose of this study.

It is natural wondering about why locators by id are more robust than their xpath and css counterparts. A justification for this behaviour could be that css identifiers, beside being placeholders, also encode a certain style attribute; therefore, modifying them is more likely than ids which don't carry any other meaning for the AUT. The same reason subsists for xpaths: beside identifying an element, they are bound to the structure of the DOM, whereas ids are transparent to any structural change.

## Progettazione del tool: cosa si vuole fare, quale tecnologia (UML grafici)



## Conclusione: abbiamo fatto questo, cosa abbiamo risolto e cosa non. Spunti futuri

The lint analyzes only the current version of a test case, so it can be considered stateless. In future, a module that watch back at the previous versions of it could increase the accuracy of the suggested modifications.
