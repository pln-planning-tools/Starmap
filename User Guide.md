# StarMaps User Guide

Starmap is a tool used to generate graphical representations of project roadmaps from GitHub issues. For the purposes of Starmap, a roadmap is represented by a single root node issue in GitHub that contains links to date-bound project milestone issues within that roadmap.

The goal of Starmap is to help externalize planning, share team progress against milestones, and publicly flag dependencies. Starmap roadmaps are inter-team and user-focused.  The tool provides flexibility in terms of the level of granularity that can be viewed, enabling users to drill down into specific details or see a high-level overview of the project as a whole

For more context around roadmapping within the Protocol Labs Network, watch the [roadmapping presentation](https://drive.google.com/file/d/130ujRG5R9TXt9UcsIGl6S343X1ispxVC/view?usp=sharing) from PL EngRes Team Summit in October 2022. This tool is introduced at 00:18:00.

## Using Starmaps.site

To render a roadmap in Starmap, enter the related GitHub issue URL into the Starmap search bar. Depending on the size of the roadmap, the rendering may take a minute to load.

- Project milestones will appear as fixed-width cards on the Starmap timeline. 
  - If a milestone contains one or more nested “child” milestones, users can click on the milestone card to view that milestone and its nested child         milestone(s).
  - When applicable, Milestone cards will feature a green progress bar that reflects the completion status of nested child milestones.
  - To access the source GitHub issue for any milestone, users can click on the GitHub icon within each milestone card.
- Starmap offers two rendering modes that can be set through the toggle button above the timeline:
    - **Overview** mode displays high-level milestones plotted against a timeline
    - **Detailed view** mode organizes milestones under their respective parent milestones.

GitHub issues that do not satisfy the requirements for rendering in Starmap as outlined herein may not display correctly. To add your roadmap to GitHub in a manner that will allow it to render in Starmap.site, see the section titled "Storing Roadmaps in Github" below.

## Capabilities

The fundamental unit of a roadmap is a project milestone. In the context of roadmapping with Starmap, a "milestone" refers to a project milestone and is distinct from the "Milestone" feature in GitHub.
- A milestone can have multiple nested child milestones, which can also have their own child milestones, and so on.
  - In overview mode, you can only view the immediate child milestones of a milestone or root node roadmap. In detailed view mode, you can view child milestones up to two levels deep.
- Starmap allows you to navigate through a roadmap at different levels of granularity by following the parent/child relationships. You can "zoom in" to a child milestone by clicking on its card, and "zoom out" by clicking the back button on your browser or following the breadcrumb trail.
  - A roadmap can therefore be conceptualized as a directed acyclic graph (DAG). The root node of the DAG represents the roadmap itself, with child milestones linked as issues under this root node. These child milestones can be displayed by directing Starmap to the root issue. 
  - For more information on this, see the "Roadmap Root Nodes" section below.
- Starmap allows you to easily create new roadmap visualizations by creating a new root "roadmap" node that points to a set of existing milestones. This means that the same milestone can be included in multiple roadmaps.

## Storing Roadmaps in Github

### Fundamentals

- Roadmaps are represented by a single root node, or GitHub issue, which contains links to milestones contained within that roadmap.
- The roadmap root node and child milestones can be in any public repository as long as the issues satisfy the requirements outlined in this document.
  - This means that you can link to existing GitHub issues as child milestones.


### Milestone Encodings

Certain data must be encoded within the body of a GitHub issue in order to render properly in Starmap. These encodings can co-exist with other Markdown in the issue body.

For any encoding, Starmap will only take the first such occurrence in the body.


#### ETA Requirement

- Milestones must have an estimated time of arrival (ETA), which is the timeframe in which the milestone is expected to be completed. The ETA is stored in the body of the issue.
    - The ETA must be placed at the beginning of a new line in the issue body
    - The ETA must be formatted according to the ISO 8601 standard
- ETAs are encoded as follows:

```
eta: YYYY-MM-DD

example: 2023-02-01
```
- If you are linking to an existing GitHub issue as a milestone, you must edit the issue to include an ETA



#### Issue Title

- The titles of the Roadmap root node and milestone issues will be displayed in the Starmap visualization.
    - You should appropriately title your issues to give users a clear picture of the roadmap content.
- Issue titles are encoded as follows:

```
Title: [Team/Project Name] [Duration] Roadmap

Example: Starmap 2023 Roadmap
Example: Starmap Q4 2022 Roadmap
```


#### Description

- A milestone may have a description field.
- The description field allows you to encode a short summary of the milestone, ideally describing the value provided by the milestone.
- Descriptions are encoded as follows:


```
Description: Some description text for my milestone which I am using to tell readers what value they can expect 
to get from this milestone.

```

## Roadmap Root Nodes

- Every roadmap is defined by a root node; the rendering of the roadmap starts with the child(ren) of that root node.
- A root node can itself be a "Milestone,” but in order to do so, it must have required fields such as an ETA.

#### Children

- A milestone may have child milestones.
- Child milestones are simply full URL links to other GitHub milestone issues
- Child milestones can exist in any public Github repository.
- It is expected that child milestone issues are themselves properly encoded milestones; otherwise they will be ignored by Starmap.
- Within a parent issue, child milestones are encoded as follows (raw Markdown):


```
children:
- https://github.com/pln-roadmap/Roadmap-Vizualizer/issues/10
- https://github.com/pln-roadmap/Roadmap-Vizualizer/issues/9
- https://github.com/pln-roadmap/Roadmap-Vizualizer/issues/8
```

- Errors will be logged and displayed for the user in Starmap.site

### Progress Indicators

- Starmap shows progress against completion of every Milestone rendered within each milestone card.
  - It uses the GitHub status (open/closed) of the children and the Roadmap root node itself to calculate progress.
- As issues are resolved and closed, they are counted as progress towards completion.
- Once all children and the parent node itself are closed, the progress bar on the parent will show 100% complete.

## Best Practices

### Milestone Nesting

- Roadmaps with numerous milestones may not render in a useful way; it is recommended to have <= 5 milestones at any level. This is also a general best practice for project roadmaps.
- Starmap’s two rendering modes (Overview and Detailed View) allow for the display of a roadmap in which there are multiple independent streams of delivery - which could be considered "themes", "pillars", etc.
  - To do this, set up a root roadmap issue, where the theme issues are the children.
  - Then, each child theme issue (encoded as a milestone), will have an ETA by necessity - simply set it to the ETA of the latest milestone in that theme.
- The children of each theme are milestones; these are what get rendered under the theme headings in the timeline.


## Sample Roadmap Issue in GitHub

 ### Template (Root Node Issue)

Title: [Team/Project Name] [Duration] Roadmap

Description (optional):
The goal of this roadmap is to outline the key milestones and deliverables for our team/project over the next [Duration].

Milestones:

  - [GitHub Milestone Link 1] - [Date (ISO format)]
  - [GitHub Milestone Link 2] - [Date (ISO format)]
  - [GitHub Milestone Link 3] - [Date (ISO format)]

Note: This roadmap is subject to change as priorities and circumstances evolve.

Starmap Link: [Starmap Link](https://www.starmaps.app/)


### Template (Child Milestone Issues)

Title: [Milestone Title] - [Team/Project Name] [Duration] 

Description:
This milestone is part of the [Team/Project Name] [Duration] Roadmap (link to root issue).

(Optional) Objectives:
- [Objective 1]
- [Objective 2]
- [Objective 3]

(Optional) Key Deliverables:
- [Deliverable 1]
- [Deliverable 2]
- [Deliverable 3]

ETA: [Date (YYY-MM-DD)]

Resources:
- [Link to any relevant resources or documents]

Note: This milestone is subject to change as priorities and circumstances evolve.
