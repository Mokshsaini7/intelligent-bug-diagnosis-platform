# Software Defect Analysis — Research Notes (M1.1, Task 1)

Status: DRAFT for approval. Date: 2026-11-12.

## How to read this document

Every statement carries one of these tags:

- **[V]** Verified: I opened the cited source and the claim matches what it says. Wording is paraphrased.
- **[U]** Unverified: widely held or remembered, but I did not open a source for it in this pass. Do not build on it without checking.
- **[D]** Design decision or hypothesis for this project. Not a fact about the world, and it must be tested.

Reference numbers like [R3] point to the list at the end. "Opened" means the page or paper was actually fetched and read. Sources that returned only bibliographic metadata are marked as such, and no claims are taken from them.

---

## 1. Software defect lifecycle

### 1.1 Common states

Bug trackers model a defect as a workflow from report to closure. A concrete, documented example is WebKit's Bugzilla [R1]:

- [V] UNCONFIRMED: newly filed, nobody has reviewed it.
- [V] NEW: confirmed as reproducible on current sources, or otherwise has enough information to proceed.
- [V] ASSIGNED: an owner has accepted it and is working on it.
- [V] FIXED: a patch was committed. Later states mark verification (VERIFIED) and inclusion in a public release (CLOSED).
- [V] Resolutions that are not fixes include DUPLICATE (same cause as an earlier report), WORKSFORME (does not occur on latest sources), INVALID (not a defect in this project) and WONTFIX (valid but deliberately not fixed).
- [V] REOPENED returns a bug to the submitter when verification shows the problem persists. The page is itself inconsistent about whether this is a status or a resolution.

**Caveat.** [R1] describes WebKit's installation, not Mozilla's or Eclipse's. Mozilla's field guide [R2] documents priority, severity and type but does not define status and resolution values on the page I opened. Exact status and resolution vocabularies per source (Mozilla, Apache, Eclipse) are therefore **not yet verified** and are deferred to Task 4. Apache projects use Jira, which has its own workflow. [U]

### 1.2 Fields that drive the lifecycle

- [V] Mozilla's Bugzilla distinguishes type (defect, enhancement, task), severity (S1 to S4, or N/A) and priority (P1 to P5, or "--" for undecided) [R2].
- [V] Mozilla treats a defect as triaged when its component is set (not UNTRIAGED) and its severity is neither "--" nor N/A. Policy is to fully triage new bugs, or show they are under active investigation, within one week [R3].
- [V] An UNCONFIRMED bug lacking steps to reproduce triggers a needinfo request to the reporter, and unanswered requests can end in INCOMPLETE [R3].

### 1.3 Why lifecycle data matters for this project

- [D] Terminal states carry the knowledge we want to retrieve. Only reports that ended in FIXED with a linked change or explanatory comment are useful as "resolution evidence". DUPLICATE, INVALID and WORKSFORME records are useful for duplicate detection but not for fix recommendations. The ingestion schema must therefore keep status and resolution as first-class fields.
- [D] Status vocabularies differ across trackers, so the knowledge base needs a normalized resolution category plus the raw source value.

---

## 2. Traditional debugging workflows

- [D] A generic manual workflow, which I am describing from general engineering practice rather than from a single source: reproduce the failure, collect evidence (logs, stack trace, environment), search for prior art (tracker, forums, code history), form hypotheses about the cause, test them, apply and verify a fix, and record the outcome.
- [V] Systematic hypothesis-driven debugging has formal support. Delta debugging automatically shrinks a failing input to a minimal one and isolates the difference between passing and failing runs. In Zeller and Hildebrandt's Mozilla case study, a crash needing 95 user actions was reduced to 3, and 896 lines of HTML to a single line, using 139 automated test runs [R4].
- [U] Zeller's book "Why Programs Fail" is the usual reference for the full structured process. I found its publisher page but did not read it. I should not cite specific steps from it until I have.

**Where manual effort goes (what the platform can target):**

- [V] Developers rank steps to reproduce, stack traces and test cases as the most helpful report content, yet reporters find those the hardest to supply. In a survey with 466 usable responses across Apache, Eclipse and Mozilla, what developers consider useful correlated only weakly (Spearman 0.321) with what reporters provide [R5].
- [V] In Eclipse, analysis of bug reports supports the common assumption that stack traces help developers fix bugs [R6].
- [D] Implication: searching prior reports by hand is slow and depends on the searcher's vocabulary. Structured extraction of the stack trace and an automated search of history address real, documented pain points.

---

## 3. Bug triage and classification

- [V] Triage means reviewing incoming reports, assigning classification fields and routing them; Mozilla's written policy sets time targets (see 1.2) [R3].
- [V] Automated assignment has been studied as text categorization. Anvik, Hiew and Murphy trained a Support Vector Machine on report text to suggest likely resolvers. On Eclipse and Firefox, precision for a single suggestion was about 57% and 64%, but recall was low (about 7% and 2%). On gcc it performed poorly (about 6% precision), which the authors attribute to one developer resolving a disproportionate share of reports and too few reports per developer [R7].
- [V] Labels are unreliable. Herzig, Just and Zeller manually examined more than 7,000 reports from five open-source projects and found that 33.8% of reports labeled as bugs were something else (features, documentation, refactoring). That mislabeling distorted bug-prediction results, with on average 39% of files marked defective never actually having a bug [R8].
- [V] Duplicates add useful training data: in Eclipse, including duplicate reports improved bug-to-developer assignment by up to 9 percentage points for one configuration [R9].

**Implications**

- [D] The Triage Agent will classify type and component into a small, explicit taxonomy and attach a confidence. It must be able to answer "unknown".
- [D] Developer assignment is out of scope for Milestone 1. Our knowledge base cannot know a user's team, and the evidence shows poor transfer between projects [R7].
- [D] Historical labels will be treated as noisy. Ingestion should keep the source label and not silently "correct" it [R8].

---

## 4. Severity and priority estimation

### 4.1 Definitions differ by source

- [V] Eclipse conventions (WTP and the Eclipse Bug Tracking wiki): severity (Blocker, Critical, Major, Normal, Minor, Trivial, Enhancement) is set by the reporter and expresses impact; priority (P1 to P5) is set by the project lead or assignee and expresses work order. P3 is the default [R10][R11].
- [V] Mozilla uses S1 to S4 plus N/A for severity and P1 to P5 for priority. Its priority rules are partly automatic: P1 for bugs tracked for or blocking beta, release or ESR, and P2 for nightly. Setting priority is optional for triagers. Severity there is part of triage [R3]. The Firefox severity guide gives examples for S1 to S3 only, and says defects must never be N/A [R12].
- [D] Consequence: "severity" and "priority" are not interchangeable across Mozilla and Eclipse, and one project's P3 is not another's. The platform must store them per source and never present a pooled "ground truth".

### 4.2 Automated prediction

- [V] Lamkanfi, Demeyer et al. used text mining on report descriptions to predict severity for Mozilla, Eclipse and GNOME. They report precision and recall of roughly 0.65 to 0.75 (Mozilla, Eclipse) and 0.70 to 0.85 (GNOME), and note that about 500 training reports per severity level were needed [R13].
- [U] That result comes from an abstract-level reading and concerns the coarse classes the authors chose. It predates modern embedding models, and I have not verified how well it transfers.

### 4.3 Project decision

- [D] The Triage Agent will output a **suggested** severity and priority with rationale and confidence, clearly marked as advisory. Because the human reporter or owner decides these fields in real trackers [R10], the platform should not claim to "set" them.
- [D] No claim of numerical accuracy will be made until we evaluate on our own held-out data.

---

## 5. Root cause analysis

- [V] Isolating a failure cause can be automated for some inputs (delta debugging [R4]), but that requires a runnable test and a failing input. Our platform receives text only, so it cannot run the program.
- [V] Information retrieval can narrow where to look. BugLocator ranks source files by textual similarity between the report and the code, using a revised vector space model, and also uses similar previously fixed bugs. On four open-source projects (more than 3,000 bugs) it placed a relevant file in the top ten for 62.60% of Eclipse 3.1 bugs [R14].
- [D] Our platform has no access to the user's source code in Milestone 1, so file-level localization is out of scope. What it can do is rank **historical bugs and their fixes**, which carry the same kind of signal, and extract suspicious frames from stack traces.
- [D] "Root cause" output will always be a **hypothesis with evidence**: which retrieved cases support it, what is missing, and what would confirm it. It will not be presented as established fact.

---

## 6. Duplicate bug detection

- [V] Runeson, Alexandersson and Nyholm applied natural language processing to defect reports at Sony Ericsson Mobile Communications. Their tool found roughly two-thirds of duplicates, and technique variants differed little. Users were qualitatively positive [R15]. This is an industrial case study at one company, so it indicates feasibility rather than a general accuracy figure.
- [V] Duplicates are not purely waste. In Eclipse, merging duplicates would add information that is otherwise lost, including new stack-trace frames that point to additional code locations. The authors also recommend better search as the most important improvement and caution that findings are from Eclipse only [R9].
- [V] Evaluation is easy to get wrong. A 2022 study comparing five research tools and two industry tools found that results depend strongly on how old the data is and on which tracker it came from. On a new 2018 to 2020 benchmark from six projects, the older BM25F-based method (REP) beat the deep-learning method SABD by about 22.3% on average in RR@10, and was best on five of six datasets. The authors recommend simple baselines and comparison against industry tools such as Bugzilla full-text search [R16].
- [V] A comparison of text embedding models on about 480,000 reports from five Mozilla and Eclipse repositories found that a BERT-based model (all-mpnet-base-v2) generally gave the best recall. The paper's own rankings are not fully consistent between its abstract and its text, and I treat it as one preprint, not settled evidence [R17].

**Implications**

- [D] Duplicate detection will start from a **hybrid** baseline: lexical (BM25-style) plus embedding similarity, plus exact-signature matching on stack traces. This follows [R16], which shows lexical methods are strong, and [R17], which shows embeddings help recall.
- [D] The Duplicate Detection Agent returns **candidates with evidence and a calibrated score**, never an automatic closure. Thresholds are chosen on a time-split evaluation, not a random split, to avoid the bias reported in [R16].
- [D] Retain DUPLICATE-resolved reports in the knowledge base and link them to their master report, since they carry additional information [R9].

---

## 7. Historical bug resolution analysis

- [V] Similar past reports can predict effort. Weiss, Premraj, Zimmermann and Zeller used Lucene to find similar issues and averaged their fix effort. On JBoss, predictions for bugs were off by about one hour, which they report as four times better than a naive baseline [R18]. One project, one metric.
- [V] BugLocator also uses similar fixed bugs as a signal [R14].
- [D] For our platform, "resolution analysis" means: for each retrieved similar bug that ended in FIXED, extract the resolution description, linked change or patch reference when available, and any reporter confirmation. The Remediation Agent will recommend only fixes grounded in such records, and will state when no grounded resolution exists.
- [D] Fix-time estimation is out of scope for Milestone 1.

---

## 8. How the platform improves on traditional workflows

These are **design hypotheses (D)**, not results. Each one needs an evaluation in a later milestone before it is claimed.

| Traditional pain point | Evidence it is real | Proposed platform response | How we will test it |
|---|---|---|---|
| Reports lack stack traces and reproduction steps | [R5] | Deterministic parsing of pasted traces and logs; prompt the reporter for missing items | Share of submissions with a parsed trace |
| Manual search of history is vocabulary-dependent | [R9] | Hybrid lexical and semantic retrieval over historical defects | Recall@k and MRR on time-split duplicate pairs |
| Duplicate handling discards information | [R9] | Surface candidates with links and differences rather than closing | Review of candidate usefulness |
| Triage is slow and labels are noisy | [R3][R8] | Advisory classification and severity with confidence and "unknown" | Agreement with held-out labels, reported with noise caveats |
| Past fixes are hard to find | [R14][R18] | Retrieve similar fixed bugs and quote their resolutions | Manual check that each recommendation cites a real record |

**Limits we must be honest about**

- [V] Reported accuracies in the literature are modest and vary by project and dataset [R7][R13][R16].
- [D] The platform will not execute user code, will not edit trackers, and will label every output as decision support.
- [D] We do not claim an LLM improves on the retrieval baselines. Whether a generated explanation helps is an open question for the evaluation plan.

---

## 9. Requirements carried into later milestones

1. [D] Store raw source status, resolution, severity and priority exactly as published, plus normalized fields.
2. [D] Keep provenance (source, original ID, URL, fetch date) on every record.
3. [D] Extract stack traces and exception types deterministically, not with an LLM.
4. [D] Split evaluation data by time and by source.
5. [D] Record duplicate links and resolution text, because they are the main evidence for the agents.

## 10. Open items for later tasks

- Official status and resolution vocabularies for Mozilla Bugzilla, Eclipse Bugzilla and Apache Jira (Task 4).
- Whether comments and attachments (including stack traces) are retrievable per source (Task 4).
- Read the primary text of Zeller's book and of the infoZilla paper on extracting structure from reports [R19] before citing them.
- Read Rakha et al. on realistic duplicate-retrieval evaluation, which I found but could not fetch [R20].

---

## References

Opened and read (claims above are taken from these):

- [R1] WebKit, "Bug Life Cycle". https://webkit.org/bug-life-cycle
- [R2] Mozilla, BMO user guide, "Bug Fields". https://wiki.mozilla.org/BMO/UserGuide/BugFields
- [R3] Mozilla, "Triage for Bugzilla" (Firefox source docs). https://firefox-source-docs.mozilla.org/bug-mgmt/policies/triage-bugzilla.html
- [R4] Zeller and Hildebrandt, "Simplifying and Isolating Failure-Inducing Input", IEEE TSE 28(2), 2002. https://www.st.cs.uni-saarland.de/papers/tse2002
- [R5] Zimmermann et al., "What Makes a Good Bug Report?", IEEE TSE, 2010. https://thomas-zimmermann.com/publications/files/zimmermann-tse-2010.pdf
- [R6] Schröter, Bettenburg, Premraj, "Do Stack Traces Help Developers Fix Bugs?", MSR 2010. https://research.vu.nl/en/publications/do-stack-traces-help-developers-fix-bugs/
- [R7] Anvik, Hiew, Murphy, "Who Should Fix This Bug?", ICSE 2006. https://www.st.cs.uni-saarland.de/edu/empirical-se/2006/PDFs/p361.pdf
- [R8] Herzig, Just, Zeller, "It's Not a Bug, It's a Feature", ICSE 2013. https://www.st.cs.uni-saarland.de/publications/details/herzig-icse-2013
- [R9] Bettenburg, Premraj, Zimmermann, Kim, "Duplicate Bug Reports Considered Harmful... Really?", ICSM 2008. https://people.csail.mit.edu/hunkim/images/b/b2/Papers_Bettenburg2008icsm.pdf
- [R10] Eclipse WTP, "Conventions of bug priority and severity". https://wiki.eclipse.org/WTP/Conventions_of_bug_priority_and_severity
- [R11] Eclipse, "Bug Tracking". https://wiki.eclipse.org/Eclipse/Bug_Tracking
- [R12] Mozilla, "Defect Severity" (Firefox source docs). https://firefox-source-docs.mozilla.org/bug-mgmt/guides/severity.html
- [R13] Lamkanfi, Demeyer et al., "Predicting the Severity of a Reported Bug", MSR 2010. https://ansymore.uantwerpen.be/publications/predicting-severity-reported-bug
- [R14] Zhou, Zhang, Lo, "Where Should the Bugs Be Fixed?" (BugLocator), ICSE 2012. https://ink.library.smu.edu.sg/sis_research/1531
- [R15] Runeson, Alexandersson, Nyholm, "Detection of Duplicate Defect Reports Using Natural Language Processing", ICSE 2007. https://lup.lub.lu.se/record/643449
- [R16] "Duplicate Bug Report Detection: How Far Are We?" (arXiv 2212.00548). https://ar5iv.labs.arxiv.org/html/2212.00548
- [R17] "A Comparative Study of Text Embedding Models for Semantic Text Similarity in Bug Reports" (arXiv 2308.09193, preprint). https://arxiv.org/pdf/2308.09193
- [R18] Weiss, Premraj, Zimmermann, Zeller, "How Long Will It Take to Fix This Bug?", MSR 2007. https://www.st.cs.uni-saarland.de/publications/details/weiss-msr-2007/

Found but not read (no claims taken):

- [R19] Bettenburg et al., "Extracting Structural Information from Bug Reports", MSR 2008. https://www.st.cs.uni-saarland.de/publications/details/bettenburg-msr-2008
- [R20] Rakha, Bezemer, Hassan, "Revisiting the Performance Evaluation of Automated Approaches for the Retrieval of Duplicate Issue Reports", IEEE TSE. https://sail.cs.queensu.ca/data/pdfs/TSE2017_RevisitingThePerformanceEvaluationOfAutomatedApproachesForTheRetrievalOfDuplicateIssueReports.pdf
