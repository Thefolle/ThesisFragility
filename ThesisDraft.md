# Thesis draft

## Background: tipologia di testing considerata (descrizione più lunga, citando); parla in maniera estesa di fragilità (almeno 15-20 pagine)

Analizzare la fragilità: creare script che possano analizzare lo stato di un app web che usa un progetto github; usa degli scraper (identificatori di codice); prioritazzazione dei test: se il tempo di sviluppo a disposizione è poco, lo sviluppatore dovrebbe aggiustare i test secondo una certa priorità. Predittore: guardando l'andamento della fragilità, puo' indovinare quali sono i test più fragili.

No effort to measure the actual fragility in the wild have been performed so far.

Current lints, like Prettier, essentially check style compliance of the code: for instance, they tell how arguments of functions should be positioned or they even probe anti-patterns regarding style. Tools like ESLint, instead, are specific for a development environment.

Material and studies about fragility are scarce (at least in the wild).

## Analisi e concettualizzazione della fragilità

Some recommendations coming from the wild are apparently contrasting:

- rule W.0 states that unit tests are less fragile than integration tests due to their low volatility, namely they get changed more rarely than the latters;
- recommendation W.1 states that lower-level tests are more prone to fragility as they depend from implementation details.

Each source may contain different recommendations, as well as a recommendation may be extracted from multiple sources.

Unfortunately, the provided recommendations have a variable degree of ease of implementation. This may lower the tool's capabilities, as described in the pertinent chapter.

*You can infer which are the properties fragility depends from by automatically inspecting the thesis: any word ending with -ility or -ness is a good candidate*.

## Progettazione del tool: cosa si vuole fare, quale tecnologia (UML grafici)



## Conclusione: abbiamo fatto questo, cosa abbiamo risolto e cosa non. Spunti futuri

The lint analyzes only the current version of a test case, so it can be considered stateless. In future, a module that watch back at the previous versions of it could increase the accuracy of the suggested modifications.
