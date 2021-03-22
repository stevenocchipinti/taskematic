import tw, { styled } from "twin.macro"

export default styled.div`
  /* BASE */

  .markdown-body {
    > p,
    > blockquote,
    > ol,
    > ul,
    > pre,
    > table {
      ${tw`mb-4`}
    }
    blockquote {
      ${tw`italic px-3 text-gray-400 border-l-4`}
    }
    a {
      ${tw`text-blue-600`}
    }
    hr {
      ${tw`my-6 h-1 bg-gray-200`}
    }
    @media (hover: hover) {
      a:hover {
        ${tw`underline`}
      }
    }
  }

  /* HEADINGS */

  .markdown-body {
    > h1,
    > h2,
    > h3,
    > h4,
    > h5,
    > h6 {
      ${tw`mb-2`}
    }
  }
  .markdown-body h1,
  .cm-header-1 {
    ${tw`text-lg font-semibold`}
  }
  .markdown-body h2,
  .cm-header-2 {
    ${tw`text-base font-semibold`}
  }
  .markdown-body h3,
  .cm-header-3 {
    ${tw`text-sm font-bold`}
  }
  .markdown-body h4,
  .cm-header-4 {
    ${tw`text-sm font-semibold`}
  }
  .markdown-body h5,
  .cm-header-5 {
    ${tw`text-xs font-bold`}
  }
  .markdown-body h6,
  .cm-header-6 {
    ${tw`text-xs font-semibold`}
  }

  /* LISTS */

  .markdown-body {
    ol,
    ul {
      ${tw`pl-8 -mt-2.5`}
    }

    ol {
      list-style-type: decimal;
    }
    ul {
      list-style-type: disc;
    }
    li {
      word-wrap: break-all;
    }

    ol ol,
    ul ol {
      list-style-type: lower-roman;
    }

    ol ol ol,
    ol ul ol,
    ul ol ol,
    ul ul ol {
      list-style-type: lower-alpha;
    }

    ol ol,
    ol ol,
    ol ul,
    ul ol,
    ul ul {
      ${tw`mt-0 mb-0`}
    }

    li > p {
      ${tw`mt-4`}
    }

    li + li {
      ${tw`mt-1`}
    }
  }

  /* TABLE */

  .markdown-body {
    table {
      display: block;
      border-spacing: 0;
      border-collapse: collapse;
      width: 100%;
      overflow: auto;
    }

    table th {
      font-weight: 600;
    }

    table td,
    table th {
      padding: 6px 13px;
      border: 1px solid #dfe2e5;
    }

    table tr {
      background-color: #fff;
      border-top: 1px solid #c6cbd1;
    }

    table tr:nth-child(2n) {
      background-color: #f6f8fa;
    }
  }

  /* IMG */

  .markdown-body {
    img {
      border-style: none;
      max-width: 100%;
      box-sizing: initial;
      background-color: #fff;
    }

    img[align="right"] {
      padding-left: 20px;
    }

    img[align="left"] {
      padding-right: 20px;
    }
  }

  /* CODE */

  .markdown-body {
    code,
    pre {
      font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace;
      font-size: 12px;
    }

    code {
      padding: 0.2em 0.4em;
      margin: 0;
      font-size: 85%;
      background-color: rgba(27, 31, 35, 0.05);
      border-radius: 3px;
    }

    pre {
      margin-top: 0;
      margin-bottom: 0;
      word-wrap: normal;
      padding: 16px;
      overflow: auto;
      font-size: 85%;
      line-height: 1.45;
      background-color: #f6f8fa;
      border-radius: 3px;
    }

    pre code {
      display: inline;
      font-size: 100%;
      line-height: inherit;
      word-break: normal;
      word-wrap: normal;
      white-space: pre;
      border: 0;
      max-width: auto;
      padding: 0;
      margin: 0;
      overflow: visible;
      background-color: initial;
      border-radius: 3px;
    }
  }
`
