[View in GitHub ![GitHub Logo](images/GitHubLogo.png#right)](https://github.com/pln-planning-tools/StarMaps)

# StarMaps User Guide

StarMaps is a tool used to generate graphical representations of roadmaps which are stored as issues in GitHub. For the purposes of StarMaps, a Roadmap is an issue that contains a set of date-bound project Milestone issues for the project.

For additional context around roadmapping within the PLN, it is recommended that you watch the [roadmapping presentation](https://drive.google.com/file/d/130ujRG5R9TXt9UcsIGl6S343X1ispxVC/view?usp=sharing) from EngRes Summit in October 2022. The introduction of this tool is at the 18min mark but the preceding conversation around roadmapping offers additional context, such as the requirement for inter-team and user-rocused roadmaps that would allow for different levels of granularity. Such roadmaps will externalize planning, share progress against milestones, and flag dependencies in a public manner.

## Using Starmaps.app

- Paste the full URL for the related GitHub roadmap issue into the search bar in the StarMaps navigation bar and press enter to search and view the StarMaps rendering of the roadmap for the related GitHub issue.
  - **Note 1**: The GitHub issue must satisfy the requirements for rendering in StarMaps as outlined herein in order to display correctly. If the requirements for rendering in StarMaps are not met by the GitHub issue, you may receive an error notification. This will appear as an error log above the rendered timeline.
  - **Note 2**: The rendering may take a minute to load depending on size of the GitHub issues.
- StarMaps has two rendering modes. A simple rendering mode that shows milestones plotted on a timeline and a detailed rendering mode that shows milestones grouped together under their parent milestones.
- Roadmap milestones will appear as cards on the StarMaps timeline. If the milestone contains one or more nested child milestones, the milestone card will be clickable. Clicking into a milestone card will allow you to view that milestone and its nested child milestone. If the milestone does not contain nested child milestones, the milestone card will not be clickable.
- Milestone cards will display a green progress bar indicating the completion of nested child milestone issues, where applicable.
- Each milestone card contains a link to the corresponding GitHub issue. You can access the issue in GitHub by clicking the GitHub icon in the milestone card.
- To add your roadmap to GitHub in a manner that will allow it to render in Starmaps.app, see the section titled "Storing Roadmaps in Github" below.

## Capabilities

The fundamental unit of a roadmap is a project milestone which will be referred to in this document as “milestones.” Note that this is unrelated to the built-in Milestone feature in GitHub. Each milestone is stored as an issue in GitHub.

- Milestones can have child milestones. Child milestones can also have child milestones.
  - **Note:** In the simplified view, you will only be able to view children one level deep. In the detailed view, you can only view children two levels deep.
- The visualizer provides the ability to “zoom” in and out of roadmaps at different levels of granularity by following the parent/child relationships. I.e. clicking into a child to zoom in, or clicking the back button on your browser to zoom back out.
- Roadmaps can therefore be thought of as a DAG. The roadmap itself is represented by a single issue which serves as the root of the DAG (and this root node is itself considered a milestone). Child milestones should be linked as issues in this root node. The child milestones of this root node are rendered by pointing StarMaps at this root issue. Read more about this in the “Roadmap Root Nodes” section below.
- StarMaps also provides flexibility in creating new roadmap visualizations simply by creating a new root "roadmap" node pointing to some set of existing milestones. Thus, the same milestone can be rendered in multiple roadmaps.

## Storing Roadmaps in Github

### Fundamentals

- Roadmaps are represented by a single root node, or GitHub issue, with child links to the milestones in that roadmap.
- The roadmap root node issue can be in any public repository.
- Milestones can be found in any GitHub repo so long as the Issues are public and satisfy the requirements as outlined herein.
  - This means that you are able to link to existing GitHub issues as child milestones.
  - Milestones and root nodes can span multiple organizations and repos, as long as the repositories are public.
- In order to render in StarMaps, all issues are required to carry the label “starmaps.” This includes both the Roadmap root node issue and all Milestone, or child, issues.

### Milestone Encodings

Encodings are how to encode certain data that StarMaps will render into an issue's Body. These encodings can co-exist with other Markdown in the issue body.

For any encoding, StarMaps will only take the first such occurrence in the body.

#### ETA Requirement

- Every milestone **must** have an ETA - "Estimated Time of Arrival". This is the timeframe in which the Milestone will be fully achieved. The ETA is stored in the Body of the issue. There are three accepted formats:

_Option 1 - Quarter_

```
eta: YYYYQN

example:
eta: 2023Q1
```

_Option 2 - Month_

```
eta: YYYY-MM

example: 2023-02
```

_Option 3 - Specific Date_

```
eta: YYYY-MM-DD

example: 2023-02-01
```

- ETA must occur at the beginning of a new line
- Date must be either in ISO 8601 or in the mentioned querterly format.
- **Note:** If you are linking to an existing GitHub issue as a milestone, you must edit the issue to include both an ETA and the starmaps label. See the next section for more details on label requirements.

#### Label Requirement

- Roadmap root nodes and milestone issues must have the “starmaps” label. Issues without the starmaps label will not render in the StarMaps tool.
- You will likely have to create the starmaps label in order to use it for issues in your repository. It is recommended that you do this prior to creating your Roadmap root node.
- You may also add your own labels. This will not interfere with the starmaps label and Starmaps.app tool.
- **TL;DR:** if you want an issue to render in the StarMaps tool, add the starmaps label.

#### Issue Title

- The issue title that you choose for your Roadmap root node and milestone issues will be used in the StarMaps rendering.
- You should appropriately title your issues to give users a clear picture of the roadmap content.

#### Description

- A milestone **may** have a description field.
- The description field allows you to encode a short summary of the milestone, ideally describing the value provided by the milestone.
- Descriptions are encoded as follows:

```
description: Some description text for my milestone
which I am using to tell readers what value they
can expect to get from this milestone.
```

### Roadmap Root Nodes

- Every roadmap is defined by a root node; the rendering of the roadmap starts with the children of that root node.
- A root node can be a "Milestone" just like any other milestone. This is the most flexible option, but that means it must have required fields like "eta"

#### Children

- A milestone **may** have child milestones.
- Children are simply full URL links to other GitHub issues that satisfy the requirements as outlined herein.
- Children can be in any Github repository.
- It is expected that the children are themselves properly encoded milestones; otherwise it will simply be ignored by StarMaps. This means that every child milestone must have an ETA encoded in the issue and must have the “starmaps” label in order to render in StarMaps.
- Children are encoded as follows (raw Markdown):

```
children:
- https://github.com/pln-roadmap/Roadmap-Vizualizer/issues/10
- https://github.com/pln-roadmap/Roadmap-Vizualizer/issues/9
- https://github.com/pln-roadmap/Roadmap-Vizualizer/issues/8
```

- StarMaps will stop parsing children when the list terminates or when a line is encountered which is not a valid and reachable URL.
- Errors will be logged and displayed for the user in starmaps.app

### Progress Indicators

- StarMaps shows progress against completion of every Milestone rendered within each milestone card.
- It uses the GitHub status (open/closed) of the children and the Roadmap root node itself to calculate progress.
- As the issues are closed, it counts as progress towards completion.
- Once all children and the parent node itself are closed, the progress bar on the parent will show 100% complete.

## Best Practices

### Using Nesting to Capture "Themes"

- StarMaps has two rendering modes. A simple rendering mode that shows milestones plotted on a timeline, and a nested rendering mode that shows milestones grouped together under their parent milestones.
- This can be used to display a roadmap where there are multiple independent streams of delivery - which could be considered "themes", "pillars", etc.
- To do this, set up a root roadmap issue, where the theme issues are the children.
- Then, each child theme issue (encoded as a milestone), will have an ETA by necessity - simply set it to the ETA of the latest milestone in that theme.
- The children of each theme are milestones, and these are what get rendered under the theme headings in the timeline.
- Roadmaps with lots of milestones may not render in a useful way; it is recommended to have <= 5 milestones at any level. (and is a general best practice for project roadmaps)

### Sample Roadmap Issue in GitHub

https://github.com/ipfs/roadmap/issues/102
