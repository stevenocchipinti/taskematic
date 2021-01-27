export default {
  id: "root",
  title: "Taskematic project",
  children: [
    {
      title: "Columns for each level of nesting",
      children: [
        {
          title: "Clicking on a card opens that node in a new column",
          done: true,
        },
        {
          title: "Show which parent node the column belongs to",
          done: true,
        },
        {
          title: "Allow a leaf node to be marked as done or not",
          done: true,
        },
      ],
    },
    {
      title: "Automatic recursive progress for non-leaf nodes",
      children: [
        {
          title: "Calculate progress with recursive algorithm",
          done: true,
        },
        { title: "Display percentage for non-leaf nodes", done: true },
        { title: "Display boolean (tick) for leaf nodes", done: true },
      ],
    },
    {
      title: "Fancy circular progress indicator",
      children: [
        { title: "Display percentage for non-leaf nodes", done: true },
        { title: "Display boolean (tick) for leaf nodes", done: true },
      ],
    },
    {
      title: "Dragging and dropping",
      children: [
        { title: "Drag within the same column", done: true },
        { title: "Drag to a different column", done: true },
        { title: "Drag on top of another card" },
      ],
    },
    {
      title: "Visuals",
      children: [
        { title: "Make and use a logo", done: true },
        { title: "Choose a primary brand colour" },
        { title: "Add a favicon" },
        { title: "Dark mode" },
      ],
    },
    {
      title: "Persistence",
      children: [
        { title: "Temporarily read data from source code", done: true },
        { title: "Store data in local storage (Local Forage?)" },
        { title: "Store data in the cloud (Firebase)" },
      ],
    },
  ],
}
