# Tutorial Publishing

This context defines the shared language used to plan and publish framework
tutorial paths under `/tutorials`.

## Language

**Framework Tutorial Path**:
A framework-specific learning path that starts with a Core Deployment Tutorial
and can extend into database, production, and task-specific tutorials.
_Avoid_: Tutorial bundle, fixed three-page series

**Core Deployment Tutorial**:
The primary framework tutorial that takes a reader from a local application to
a verified public deployment on Sealos.
_Avoid_: Beginner article, deployment landing page

**Tutorial Detail Shell**:
The shared page structure for tutorial title, outcome summary, entry paths,
article body, table of contents, navigation, and structured data.
_Avoid_: Tutorial hero, article wrapper

**Dual-Entry Tutorial Flow**:
The two visible starting paths in a Core Deployment Tutorial: build the
reference application from scratch or continue with an existing application.
_Avoid_: Beginner mode, expert mode

**Existing-Project Compatibility Checkpoint**:
The section where readers with an existing application verify required files,
settings, runtime behavior, and deployment assumptions before joining the main
deployment flow.
_Avoid_: Existing app shortcut, skip section

**Public Tutorial Frontmatter**:
Reader-facing content facts stored with an MDX tutorial, including its canonical
path, framework, runtime, publication dates, reading time, navigation, FAQ, and
HowTo data.
_Avoid_: Editorial workflow metadata, keyword scorecard

**Tutorial Operations Data**:
Internal planning and production state such as target queries, search demand,
workflow status, and evidence tracking. It lives outside published MDX.
_Avoid_: Public tutorial metadata

**FastAPI Path**:
The Framework Tutorial Path whose framework is FastAPI.
_Avoid_: Python API series

**Django Path**:
The Framework Tutorial Path whose framework is Django.
_Avoid_: Python web series

**Practice Evidence**:
Build, deployment, runtime, and browser results captured from an actual tutorial
workflow and used as the source for tutorial screenshots.
_Avoid_: Mock output, illustrative proof

**Reference Application**:
A concrete framework-native application that remains consistent throughout one
Framework Tutorial Series.
_Avoid_: Demo app, sample project

**Django Task App**:
The Django Reference Application with a task creation and listing workflow plus
the framework-native administration entry point.
_Avoid_: Django demo, Django sample app

**Tutorial Opportunity**:
A framework and launch-job pair, such as Django Deploy or Django PostgreSQL,
whose availability is evaluated independently in the tutorial framework matrix.
_Avoid_: Framework-wide availability, tutorial bundle

**Available Tutorial Opportunity**:
A Tutorial Opportunity whose published page has passed source, asset, catalog,
production build, and public route acceptance and is linked from the matrix.
_Avoid_: Published framework badge, enabled framework

**Retired Tutorial**:
Removed public content whose former canonical URL has an intentional reader
handoff to the qualified published tutorial.
_Avoid_: Planned tutorial, deleted URL

**Tutorial Publication Gate**:
The combined source, catalog, validator, static HTTP, image, and cleanup
acceptance required before a Tutorial Opportunity becomes an Available Tutorial
Opportunity.
_Avoid_: Content check, release smoke

**Static Tutorial Surface**:
The exported tutorial index, tutorial detail routes, and public evidence assets
served to readers from the production static build.
_Avoid_: Build output files, generated pages

**Tutorial Catalog**:
The public `/tutorials/` page that groups Framework Tutorial Paths by learning
stage, framework, publication status, and request entry.
_Avoid_: Tutorial landing page, Tutorial Matrix

## Website Attribution Language

**Attribution Handoff (归因交接)**:
The transfer of acquisition context from the public website to a Sealos product
surface during a cross-origin user journey.
_Avoid_: CTA attribution, redirect tracking
