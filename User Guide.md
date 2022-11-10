# MapLight User Guide
MapLight is a tool to generates graphical representations of roadmaps which are stored as Issues in Github. For the purposes of MapLight, a Roadmap is a set of date-bound Milestones for the project.

## Capabilities
- The fundamental unit of a roadmap is a "milestone" - each milestone is stored as an issue in Github (note that this is not related to the built-in Milestone feature in Github). 
- Milestones can have child milestones. The visualizer provides the ability to zoom in and out of roadmaps at different levels of granularity by following the parent/child relationships. 
- Roadmaps can therefore be thought of as a DAG. The roadmap itself is represented by a single issue which serves as the root of the DAG (and this root node is itself considered a milestone). The child milestones of this root node are rendered by pointing MapLight at this root issue.
- MapLight also provides flexibility in creating new roadmap visualizations simply by creating a new root "roadmap" node pointing to some set of existing milestones. Thus, the same milestone can be rendered in multiple roadmaps.

## Storing Roadmaps in Github
### Fundamentals
- Roadmaps are represented by a single Github issue with child links to the milestones in that roadmap.
- Milestones are simply Github Issues with the "milestone" label. MapLight will only render issues with this label. 
- Milestones can be found in any Github repo so long as the Issues are readable by the public.
- Roadmaps with lots of milestones aren't going to render in a useful way; it is recommended to have <= 5 milestones at any level. (and is a general best practice for project roadmaps)

### Milestone Encodings
Encodings are how to encode certain data that MapLight will render into an issue's Body. These encodings can co-exist with other Markdown in the issue body.

For any encoding, MapLight will only take the first such occurrence in the body.

#### ETA
- Every milestone **must** have an ETA - "Estimated Time of Arrival". This is the timeframe in which the Milestone will be fully achieved. The ETA is stored in the Body of the issue. There are three accepted formats:

*Option 1 - Quarter*
```
eta: YYYYQN

example:
eta: 2023Q1
```
*Option 2 - Month*
```
eta: YYYY-MM

example: 2023-02
```
*Option 3 - Specific Date*
```
eta: YYYY-MM-DD

example: 2023-02-01
```
- Must occur at the beginning of a new line
- Date must be in ordered specified; we support ".", "-", and "/" as delimiters.

#### Description
- A milestone **may** have a description field. 
- The description field allows you to encode a short summary of the milestone, ideally describing the value provided by the milestone. 
- The description will be rendered when users hover over a milestone in a rendered roadmap.
- Descriptions are encoded as follows:
```
description: Some description text for my milestone
which I am using to tell readers what value they 
can expect to get from this milestone.
```
- MapLight will pull all text after the "description:" label until it reaches an empty line.
- MapLight may truncate rendered descriptions as determined by the canvas size; keeping them to a few sentences is important.
- MapLight will not properly render Markdown - it will simply display as raw Markdown; descriptions should be simple text.


#### Children
- A milestone **may** have child milestones. 
- As stated above, it is best to cap at 5 children, but any number is allowed. 
- Children are simply full URL links to other Github issues.
- Children can be in any Github repository.
- It is expected that the children are themselves properly encoded milestones; otherwsie it will simply be ignored by MapLight.
- Children are encoded as follows (raw Markdown):
```
children:
- https://github.com/pln-roadmap/Roadmap-Vizualizer/issues/10
- https://github.com/pln-roadmap/Roadmap-Vizualizer/issues/9
- https://github.com/pln-roadmap/Roadmap-Vizualizer/issues/8
```
- MapLight will stop parsing children when the list terminates or when a line is encountered which is not a valid and reachable URL.

### Roadmap Root Nodes
- Every roadmap is defined by a root node; the rendering of the roadmap starts with the children of that root node.
- A root node can be a "Milestone" just like any other milestone. This is the most flexible option, but that means it must have required fields like "eta"
- A root node that will not be linked into other roadmaps can be a "roadmap" issue, meaning it has a label "roadmap" instead of "milestone", and does not need the required fields of a milestone.
- If an issue has both "roadmap" and "milestone" labels, it will be treated as a milestone.

### Progress Indicators
- MapLight shows progress against completion of every Milestone rendered.
- It uses status of the children and the node itself to calculate progress. As the issues are closed, it counts as progress towards completion. 
- Once all children **and** the parent node itself are closed, the progress bar on the parent will show 100% complete.

## Best Practices
### Using Nesting to Capture "Themes"
- MapLight has two rendering modes. A simple rendering mode that shows milestones plotted on a timeline, and a nested rendering mode that shows milestones grouped together under their parent milestones.
- This can be used to display a roadmap where there are multiple independent streams of delivery - which could be considered "themes", "pillars", etc.
- To do this, set up a root roadmap issue, where the theme issues are the children.
- Then, each child theme issue (encoded as a milestone), will have an ETA by necessity - simply set it to the ETA of the latest milestone in that theme.
- The children of each theme are milestones, and these are what get rendered under the theme headings in the timeline.

