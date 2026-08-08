---
layout: default

# ---------------------------------------------------------------------------
# Header and footer
# ---------------------------------------------------------------------------
role: Experimental nuclear and particle physicist
affiliation: Czech Technical University, Prague · STAR (RHIC) · ePIC (EIC)
footer: Alexandr Prozorov · Prague

# ---------------------------------------------------------------------------
# Experience. Add or remove entries; they render in the order written.
# ---------------------------------------------------------------------------
experience:
  - years: 2023 – now
    what: Researcher, Czech Technical University, Prague
  - years: 2025
    what: Research stay, Yale University
  - years: 2025
    what: Research stay, Brookhaven National Laboratory
  - years: 2019 – 2023
    what: Researcher, GSI Helmholtzzentrum für Schwerionenforschung, Darmstadt
  - years: 2017 – 2023
    what: Researcher, Nuclear Physics Institute, Czech Academy of Sciences
  - years: 2017 – 2023
    what: Ph.D. in Nuclear Physics, Charles University, Prague
  - years: 2012 – 2017
    what: Ing. (M.Sc.), Tomsk Polytechnic University

# ---------------------------------------------------------------------------
# Skills. Each group becomes a labelled row of chips.
# ---------------------------------------------------------------------------
skills:
  - group: Programming
    items: [C++, Python, Bash, SQL, LaTeX, JavaScript]
  - group: HEP software
    items: [ROOT, Geant4, DD4hep, JANA2, PODIO/EDM4hep, HepMC3, uproot, XRootD, Rucio]
  - group: Event generators
    items: [Sartre, Pythia8]
  - group: Computing
    items: [Linux, Docker, Spack, Git & CI/CD, HTCondor, Slurm, PostgreSQL]
  - group: AI tooling
    items: [RAG, vector databases, MCP servers, agentic workflows, TensorFlow]
  - group: Instrumentation
    items: [EM & hadronic calorimetry, detector calibration, DAQ, FPGA]
---

I measure jets and heavy flavor in heavy-ion collisions with
[STAR](https://www.star.bnl.gov/) at RHIC. For [ePIC](https://www.epic-eic.org/) at the
future Electron-Ion Collider I do simulation and detector-design studies. My background is
electromagnetic calorimetry: six years in [HADES](https://hades.gsi.de/) at GSI/FAIR, doing
calibration and assembly work, and taking part in beam-time operations. My thesis there was
on neutral-meson production in Ag+Ag collisions.

I also write software, mostly to keep analyses reproducible. I am an AI enthusiast, and I
like to teach. I co-convene the ePIC
[User Learning](https://www.epic-eic.org/sc/learning.html) working group and write its
training material. I am also involved with the
[HEP Software Foundation](https://hepsoftwarefoundation.org/).

> **STAR Collaboration Early Career Award, 2025**
>
> For building and deploying an AI assistant for the collaboration.

## Research

- In ePIC I work on the backward hadronic calorimeter: resolution and cell-segmentation
  studies for the detector design. The physics case is coherent diffractive
  φ(1020) → K⁺K⁻ in *e*+Au, generated with the [Sartre](https://sartre.hepforge.org/)
  dipole model and run through the full ePIC simulation chain. Including the backward HCal
  recovers 75% more tagged φ yield than an ECal-only selection.

- **Jets in STAR.** D⁰-tagged jet measurements unfolded with
  [OmniFold](https://arxiv.org/abs/1911.09107), a machine-learning method that unfolds
  several observables at once without binning, and inclusive jet cross-sections in Au+Au
  and p+p at √s<sub>NN</sub> = 200 GeV.

## Software

- The search box on [eic.github.io](https://eic.github.io/) runs on
  [eic_smart_search](https://github.com/eic/eic_smart_search), a retrieval-augmented search
  that indexes the EIC websites, code repositories, wiki and document archives.

- [Generative AI for Physics Analysis](https://eic.github.io/tutorial-mcp) teaches
  AI-assisted analysis on a real Λ⁰ → pπ⁻ measurement with ePIC data. The Model Context
  Protocol servers it runs on are in [eic-mcp](https://github.com/eic/eic-mcp).

- I rebuilt the front end of the EIC software website,
  [eic.github.io](https://github.com/eic/eic.github.io), and set up its AI search interface
  and tutorial program.

- Onboarding and computing documentation for junior STAR members lives at
  [star-juniors.github.io](https://star-juniors.github.io/).

- [Teaching material](https://github.com/aprozo/root_workshop): a ROOT course on CERN Open
  Data and Pythia jet exercises, plus a
  [STAR environment walkthrough](https://github.com/aprozo/star-tutorial). It all runs in
  the browser, nothing to install.

- The [HEP jobs board](/jobs/) collects high-energy and nuclear physics postings and ranks
  them daily.

- [EpicHcalAnalysis](https://github.com/aprozo/EpicHcalAnalysis) holds the resolution and
  geometry code for the backward HCal.

## Experience

{% include experience.html %}

Service: co-convener of the ePIC User Learning working group (2026), elected STAR Juniors
representative (2025).
{: .meta}

## Skills

{% include skills.html %}

## Selected publications

<div class="pubs" markdown="1">

M. Atif, V. Garonne, E. Lancon, J. Lauret, **A. Prozorov**, M. Vranovsky,
“AI-Powered Assistant for Long-Term Access to RHIC Knowledge”,
*[arXiv:2509.09688](https://arxiv.org/abs/2509.09688) (2025).*

**A. Prozorov** (HADES), “Neutral meson production in Ag+Ag at √s<sub>NN</sub> = 2.55 GeV”,
*[EPJ Web Conf. **291**, 04001](https://doi.org/10.1051/epjconf/202429104001) (2024).*

**A. Prozorov** (HADES), “Neutral mesons flow and yields in Ag+Ag at 1.58 AGeV at HADES”,
*[PoS **FAIRness2022**, 048](https://doi.org/10.22323/1.419.0048) (2023).*

**A. Prozorov**, “Simulation study of effects induced by final granularity of detector in
particle flow”,
*[J. Phys. Conf. Ser. **1667**, 012034](https://doi.org/10.1088/1742-6596/1667/1/012034) (2020).*

</div>

Co-author on STAR, HADES and MPD collaboration papers. 40 records and 613 citations on
INSPIRE-HEP. Full lists: [ORCID](https://orcid.org/0000-0001-8368-8290) ·
[INSPIRE-HEP](https://inspirehep.net/authors/2034957).
{: .meta}

## Contact

- [me@aprozo.com](mailto:me@aprozo.com)
- [GitHub](https://github.com/aprozo)
- [ORCID](https://orcid.org/0000-0001-8368-8290)
- [CV (PDF)](assets/cv/CV.pdf)
{: .links}
