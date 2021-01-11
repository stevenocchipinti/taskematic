export default {
  id: "root",
  title: "Taskematic project",
  children: [
    {
      id: "0",
      title: "Basic UI",
      children: [
        {
          id: "1",
          title: "Columns for each level of nesting",
          children: [
            {
              id: "8",
              title: "Clicking on a card opens that node in a new column",
              done: true,
            },
            { id: "9", title: "Show which parent node the column belongs to" },
            {
              id: "10",
              title: "Allow a leaf node to be marked as done or not",
            },
          ],
        },
        { id: "2", title: "Automatic recursive progress for non-leaf nodes" },
        { id: "3", title: "Fancy circular progress indicator" },
      ],
    },
    {
      id: "4",
      title: "Visuals",
      children: [
        { id: "5", title: "Make and use a logo" },
        { id: "6", title: "Choose a primary brand colour" },
        { id: "7", title: "Add a favicon" },
      ],
    },
  ],
}
