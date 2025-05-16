// rules.js

/**
 * Accessibility rules for WCAG 2.2 HTML verification.
 * Each rule contains:
 * - id: unique identifier for the rule
 * - tag: HTML tag to check
 * - regex: pattern to match in the document
 * - message: description of the issue if validation fails
 * - validate: function to evaluate the tag's correctness
 * - recommendation: suggestion for fixing the issue
 */

module.exports = [
  {
    id: "R1",
    tag: "img",
    regex: /<img[^>]*>/g,
    message: "Image without alt attribute",
    validate: (tag, doc) => {
      const isMissingAlt = !tag.includes("alt=");
      const isInsidePicture = /<picture[^>]*>.*<img[^>]*>.*<\/picture>/gs.test(
        doc
      );
      return isMissingAlt || (isInsidePicture && !tag.includes("alt="));
    },
    recommendation:
      'Add an alt attribute to describe the image content or use alt="" if decorative. Even inside <picture>, ensure <img> has alt.',
  },
  {
    id: "R2",
    tag: 'input[type="image"]',
    regex: /<input[^>]*type=["']image["'][^>]*>/g,
    message: "Image input missing alt attribute",
    validate: (tag) => !tag.includes("alt="),
    recommendation:
      "Add an alt attribute that describes the function of the button.",
  },
  {
    id: "R3",
    tag: "area",
    regex: /<area[^>]*>/g,
    message: "Area element missing alt attribute",
    validate: (tag) => !tag.includes("alt="),
    recommendation:
      "Provide a descriptive alt attribute for each <area> tag in image maps.",
  },
  {
    id: "R4",
    tag: "object",
    regex: /<object[^>]*>/g,
    message: "Object without text alternative",
    validate: (tag, doc) => !doc.includes("<p>"),
    recommendation:
      "Include a text description inside or near the <object> tag or use aria-label.",
  },
  {
    id: "R5",
    tag: "svg",
    regex: /<svg(?![^>]*aria-label)(?![^>]*aria-hidden)(?![^>]*<title)[^>]*>/g,
    message: "SVG missing aria-label or aria-hidden",
    validate: (tag) =>
      !tag.includes("aria-label") && !tag.includes("aria-hidden"),
    recommendation:
      "Add aria-label or <title> for informative SVGs, or aria-hidden='true' for decorative ones.",
  },
  {
    id: "R6",
    tag: "applet",
    regex: /<applet[^>]*>/g,
    message: "Applet element requires alt text",
    validate: (tag) => !tag.includes("alt="),
    recommendation:
      "Add alt attribute that describes the content or purpose of the applet.",
  },
  {
    id: "R7",
    tag: "button",
    regex: /<button(?![^>]*aria-label)(?![^>]*>\s*[^<]+\s*<)[^>]*>/g,
    message: "Button missing accessible name",
    validate: (tag) =>
      !tag.includes("aria-label") && !tag.match(/>\s*[^<]+\s*</),
    recommendation:
      "Include visible text or an aria-label to describe the button's purpose.",
  },
  {
    id: "R8",
    tag: "a",
    regex: /<a[^>]*>(\s*<i[^>]*>|\s*<span[^>]*>)\s*<\/a>/g,
    message: "Anchor with icon only and no accessible label",
    validate: (tag) => tag.includes("<i") && !tag.includes("aria-label"),
    recommendation: "Use aria-label to describe the purpose of the link.",
  },
  {
    id: "R9",
    tag: "figure",
    regex: /<figure[^>]*>(?!.*?<figcaption>).*?<\/figure>/gs,
    message: "Figure missing figcaption",
    validate: (tag, doc) => !doc.includes("<figcaption>"),
    recommendation: "Include a <figcaption> to describe the figure content.",
  },
  {
    id: "R10",
    tag: "iframe",
    regex: /<iframe(?![^>]*title=)[^>]*>/g,
    message: "Iframe missing title attribute",
    validate: (tag) => !tag.includes("title="),
    recommendation:
      "Add a title attribute that describes the iframe's purpose.",
  },
  {
    id: "R11",
    tag: "embed",
    regex: /<embed(?![^>]*aria-label)(?![^>]*title)[^>]*>/g,
    message: "Embed missing fallback content",
    validate: (tag, doc) => !doc.includes("<p>"),
    recommendation:
      "Provide fallback content or use title/aria-label to describe the embedded content.",
  },
  {
    id: "R12",
    tag: "canvas",
    regex: /<canvas[^>]*>/g,
    message: "Canvas missing fallback content",
    validate: (tag, doc) =>
      !doc.includes("</canvas>") || !doc.match(/<canvas[^>]*>\s*<\/canvas>/),

    recommendation:
      "Provide descriptive fallback content between <canvas> tags.",
  },
  {
    id: "R13",
    tag: "audio",
    regex: /<audio[^>]*>/g,
    message: "Audio element missing transcript",
    validate: (tag, doc) =>
      !doc.includes("<transcript>") && !doc.includes("<p>"),
    recommendation:
      "Provide a transcript of the audio content, including dialogues and relevant sounds, in a <p> or <transcript> tag.",
  },
  {
    id: "R14",
    tag: "object",
    regex: /<object[^>]*>/g,
    message: "Object containing only audio missing transcript",
    validate: (tag, doc) =>
      !doc.includes("<transcript>") && !doc.includes("<p>"),
    recommendation:
      "Include a transcript of the audio content outside the <object> tag to detail the audio content.",
  },
  {
    id: "R15",
    tag: "video",
    regex: /<video[^>]*>/g,
    message: "Video missing textual description",
    validate: (tag, doc) =>
      !doc.includes("<track kind='descriptions'>") && !doc.includes("<p>"),
    recommendation:
      "Provide a textual description of the video content in a <p> tag or include a <track> element with kind='descriptions'.",
  },
  {
    id: "R16",
    tag: "video",
    regex: /<video[^>]*>/g,
    message: "Video missing subtitles",
    validate: (tag, doc) => !doc.includes("<track kind='subtitles'>"),
    recommendation:
      "Add a <track> element with kind='subtitles' to provide synchronized subtitles for the video.",
  },
  {
    id: "R17",
    tag: "track",
    regex: /<track[^>]*>/g,
    message: "Track element missing kind='subtitles'",
    validate: (tag) => !tag.includes("kind='subtitles'"),
    recommendation:
      "Ensure the <track> element includes kind='subtitles' and other necessary attributes like src, srclang, and label.",
  },
  {
    id: "R18",
    tag: "video",
    regex: /<video[^>]*>/g,
    message: "Video missing audio description",
    validate: (tag, doc) => !doc.includes("<track kind='descriptions'>"),
    recommendation:
      "Add a <track> element with kind='descriptions' to provide an audio description for visually impaired users.",
  },
  {
    id: "R19",
    tag: "object",
    regex: /<object[^>]*>/g,
    message: "Object missing audio description",
    validate: (tag, doc) =>
      !doc.includes("<track kind='descriptions'>") && !doc.includes("<p>"),
    recommendation:
      "Ensure the embedded multimedia in the <object> tag includes synchronized audio descriptions or provide a textual description nearby.",
  },
  {
    id: "R20",
    tag: "video",
    regex: /<video[^>]*>/g,
    message: "Video missing synchronized audio description",
    validate: (tag, doc) => !doc.includes("<track kind='descriptions'>"),
    recommendation:
      "Include a <track> element with kind='descriptions' to provide synchronized audio descriptions for the video.",
  },
  {
    id: "R21",
    tag: "object",
    regex: /<object[^>]*>/g,
    message: "Object missing synchronized audio description",
    validate: (tag, doc) =>
      !doc.includes("<track kind='descriptions'>") && !doc.includes("<p>"),
    recommendation:
      "Ensure the multimedia embedded in the <object> tag includes synchronized audio descriptions or provide a detailed textual description nearby.",
  },
  {
    id: "R22",
    tag: "table",
    regex: /<table[^>]*>/g,
    message: "Table missing semantic structure",
    validate: (tag, doc) =>
      !doc.includes("<thead>") || !doc.includes("<tbody>"),
    recommendation:
      "Use <thead>, <tbody>, and <tfoot> to group rows and provide a clear structure for the table.",
  },
  {
    id: "R23",
    tag: "caption",
    regex: /<caption[^>]*>/g,
    message: "Table missing caption",
    validate: (tag, doc) => !doc.includes("<caption>"),
    recommendation:
      "Add a <caption> as the first child of the <table> to describe its purpose.",
  },
  {
    id: "R24",
    tag: "th",
    regex: /<th[^>]*>/g,
    message: "Table header missing association",
    validate: (tag, doc) => !tag.includes("id=") || !doc.includes("headers="),
    recommendation:
      "Use the id attribute in <th> and the headers attribute in <td> to associate data cells with their headers.",
  },
  {
    id: "R25",
    tag: "fieldset",
    regex: /<fieldset[^>]*>/g,
    message: "Form controls not grouped",
    validate: (tag, doc) => !doc.includes("<legend>"),
    recommendation:
      "Use <fieldset> to group related form controls and include a <legend> to describe the group.",
  },
  {
    id: "R26",
    tag: "legend",
    regex: /<legend[^>]*>/g,
    message: "Fieldset missing legend",
    validate: (tag, doc) => !doc.includes("<legend>"),
    recommendation:
      "Add a <legend> inside the <fieldset> to describe the group of form controls.",
  },
  {
    id: "R27",
    tag: "label",
    regex: /<label[^>]*>/g,
    message: "Form field missing label",
    validate: (tag, doc) => !tag.includes("for=") || !doc.includes("id="),
    recommendation:
      "Ensure each form field has a <label> associated with it using the for attribute and a matching id on the input.",
  },
  {
    id: "R28",
    tag: "h1",
    regex: /<h[1-6][^>]*>/g,
    message: "Content missing heading structure",
    validate: (tag, doc) => !doc.match(/<h[1-6][^>]*>/),
    recommendation:
      "Use <h1> to <h6> to organize content hierarchically and improve navigation.",
  },
  {
    id: "R29",
    tag: "ul",
    regex: /<ul[^>]*>/g,
    message: "List missing semantic structure",
    validate: (tag, doc) => !doc.includes("<li>"),
    recommendation:
      "Use <ul> or <ol> for lists and include <li> for each list item.",
  },
  {
    id: "R30",
    tag: "section",
    regex: /<section[^>]*>/g,
    message: "Section missing heading",
    validate: (tag, doc) => !doc.match(/<section[^>]*>[\s\S]*?<h[1-6][^>]*>/),
    recommendation:
      "Include a heading (<h1> to <h6>) inside each <section> element to describe its content.",
  },
  {
    id: "R31",
    tag: "article",
    regex: /<article[^>]*>/g,
    message: "Article missing heading",
    validate: (tag, doc) => !doc.match(/<article[^>]*>[\s\S]*?<h[1-6][^>]*>/),
    recommendation:
      "Include a heading (<h1> to <h6>) inside each <article> to provide a descriptive title.",
  },
  {
    id: "R32",
    tag: "ol",
    regex: /<ol[^>]*>/g,
    message: "Ordered list missing structure",
    validate: (tag, doc) => !doc.includes("<li>"),
    recommendation:
      "Use <li> elements inside <ol> to define each item in the ordered list.",
  },
  {
    id: "R33",
    tag: "ul",
    regex: /<ul[^>]*>/g,
    message: "Unordered list missing structure",
    validate: (tag, doc) => !doc.includes("<li>"),
    recommendation:
      "Use <li> elements inside <ul> to define each item in the unordered list.",
  },
  {
    id: "R34",
    tag: "li",
    regex: /<li[^>]*>/g,
    message: "List item outside of a list",
    validate: (tag, doc) =>
      !doc.includes("<ul") && !doc.includes("<ol") && !doc.includes("<dl"),
    recommendation:
      "Ensure <li> elements are properly nested inside <ul>, <ol>, or <dl> elements.",
  },
  {
    id: "R35",
    tag: "table",
    regex: /<table[^>]*>/g,
    message: "Table with illogical row/column order",
    validate: (tag, doc) =>
      !doc.includes("<thead>") || !doc.includes("<tbody>"),
    recommendation:
      "Ensure the table follows a logical visual order using <thead>, <tbody>, and <tfoot>.",
  },
  {
    id: "R36",
    tag: "thead",
    regex: /<thead[^>]*>/g,
    message: "Table head is missing or misused",
    validate: (tag, doc) => !doc.includes("<thead>"),
    recommendation:
      "Include a <thead> section at the top of your table to group header rows.",
  },
  {
    id: "R37",
    tag: "tbody",
    regex: /<tbody[^>]*>/g,
    message: "Table body missing or unordered",
    validate: (tag, doc) => !doc.includes("<tbody>"),
    recommendation:
      "Use <tbody> to group the main content rows and ensure logical row ordering.",
  },
  {
    id: "R38",
    tag: "p, span, strong, em",
    regex: /<(p|span|strong|em)[^>]*>/gi,
    message: "Instruction depends only on color or shape",
    validate: (tag) =>
      /red|blue|green|circle|square|round|arrow|triangle/.test(
        tag.toLowerCase()
      ) &&
      !tag.includes("aria-label") &&
      !tag.includes("title"),
    recommendation:
      "Do not rely solely on color or shape for instructions. Add visible text or use aria-label/title to describe the purpose.",
  },
  {
    id: "R39",
    tag: "input, select, textarea, form",
    regex: /<(input|select|textarea|form)[^>]*>/gi,
    message: "Form element missing or misusing autocomplete attribute",
    validate: (tag) => {
      const tagLower = tag.toLowerCase();
      return (
        !tagLower.includes("autocomplete=") ||
        tagLower.includes('autocomplete="off"') ||
        tagLower.includes("autocomplete='off'")
      );
    },
    recommendation:
      "Use meaningful autocomplete values (e.g., 'name', 'email', 'tel') instead of omitting the attribute or setting it to 'off', to improve form usability and accessibility.",
  },
  {
    id: "R40",
    tag: "input, select, textarea",
    regex: /<(input|select|textarea)[^>]*>/gi,
    message: "Form field missing semantic autocomplete attribute",
    validate: (tag) => {
      const lower = tag.toLowerCase();
      return (
        !lower.includes("autocomplete=") ||
        lower.includes('autocomplete="off"') ||
        lower.includes("autocomplete='off'")
      );
    },
    recommendation:
      "Use autocomplete attributes like 'bday', 'name', 'address-line1', etc., to help assistive technologies and browsers identify the field’s purpose semantically.",
  },
  {
    id: "R41",
    tag: "inline-styled elements",
    regex: /<\w+[^>]*style=["'][^"'>]*color\s*:\s*[^;"']+["'][^>]*>/gi,
    message: "Color used as the only visual indicator",
    validate: (tag, doc) =>
      /color\s*:\s*/i.test(tag) &&
      !doc.match(
        /(aria-label|title|icon|symbol|text-decoration|underline|border)/i
      ),
    recommendation:
      "Avoid relying only on color to convey information. Use additional indicators such as text, underline, icons, or labels to ensure accessibility. See WCAG techniques G14 and G205.",
  },
  {
    id: "R42",
    tag: "audio",
    regex: /<audio[^>]*>/g,
    message: "Autoplaying audio without controls",
    validate: (tag) => tag.includes("autoplay") && !tag.includes("controls"),
    recommendation:
      "Add 'controls' attribute to <audio> or provide visible custom controls for play/pause and volume.",
  },
  {
    id: "R43",
    tag: "text elements",
    regex:
      /<(a|p|span|h[1-6])[^>]*style=["'][^"'>]*color\s*:\s*#[0-9a-fA-F]{3,6}[^"'>]*["'][^>]*>/gi,
    message: "Low text contrast",
    validate: (tag) =>
      /color\s*:\s*#[0-9a-fA-F]{3,6}/i.test(tag) &&
      !/background-color\s*:/i.test(tag),
    recommendation:
      "Ensure text has a contrast ratio of at least 4.5:1 against its background. Use tools like Contrast Checker or adjust foreground and background colors appropriately. See WCAG G18.",
  },
  {
    id: "R44",
    tag: "text over image",
    regex:
      /<(a|p|span|h[1-6])[^>]*style=["'][^"'>]*background(?:-image)?\s*:\s*(url\(|linear-gradient)[^"'>]*["'][^>]*>/gi,
    message: "Text over image or gradient lacks contrast support",
    validate: (tag) =>
      !/background-color\s*:/i.test(tag) && !/text-shadow\s*:/i.test(tag),
    recommendation:
      "Use a solid background color or text shadow to ensure text remains legible over images or gradients. See WCAG G145.",
  },
  {
    id: "R45",
    tag: "text containers",
    regex:
      /<(html|body|div|span|p|a|h[1-6])[^>]*style=["'][^"'>]*font-size\s*:\s*\d+px[^"'>]*["'][^>]*>/gi,
    message: "Fixed text size using 'px' prevents proper text resizing",
    validate: (tag) => /font-size\s*:\s*\d+px/.test(tag),
    recommendation:
      "Use relative units like em, rem, or % instead of px for font size to support text resizing. This ensures compliance with WCAG techniques G142 and C28.",
  },
  {
    id: "R46",
    tag: "img",
    regex: /<img[^>]*>/g,
    message: "Image of text used instead of HTML text",
    validate: (tag) =>
      tag.includes("alt=") &&
      tag.match(/alt=["'][a-zA-Z\s\d]{3,}["']/) &&
      !tag.includes("logo") &&
      !tag.includes("logotipo") &&
      !tag.match(/alt=["']\s*["']/),
    recommendation:
      "Avoid using images to convey textual information. Use HTML text styled with CSS unless the image is a logo or required for specific presentation. Ensure alt text conveys the same message if an image must be used.",
  },
  {
    id: "R47",
    tag: "img|canvas|svg|object",
    regex: /<(img|canvas|svg|object)[^>]*>/g,
    message: "Text rendered with image elements instead of HTML",
    validate: (tag, doc) =>
      tag.match(/<(canvas|svg|object)/) &&
      doc.toLowerCase().includes("text") &&
      !tag.includes("aria-label") &&
      !tag.includes("aria-hidden") &&
      !doc.match(/class=["'][^"']*(visually-hidden|sr-only)[^"']*["']/),
    recommendation:
      "Avoid using images, canvas, SVG, or object to render text unless necessary. Use real HTML text and style it with CSS. If unavoidable, provide accessible alternatives like aria-label or visually hidden content.",
  },
  {
    id: "R48",
    tag: "a|body|div|html|img|main|p|section",
    regex: /<(a|body|div|html|img|main|p|section)[^>]*>/gi,
    message: "Layout does not adapt to viewport size",
    validate: (tag, doc) =>
      doc.match(/width:\s*\d+(px|vw)/i) &&
      !doc.match(/max-width:\s*(100%|auto|fit-content)/i),
    recommendation:
      "Avoid fixed width using px or vw. Use relative units (%, em, rem) and max-width to ensure responsive layouts.",
  },
  {
    id: "R49",
    tag: "button|canvas|img|input|select|svg",
    regex: /<(button|canvas|img|input|select|svg)[^>]*>/gi,
    message: "Non-text UI element might have insufficient contrast",
    validate: (tag) =>
      /background-color\s*:\s*#[0-9a-fA-F]{3,6}/.test(tag) &&
      /color\s*:\s*#[0-9a-fA-F]{3,6}/.test(tag),
    recommendation:
      "Ensure UI elements have at least a 3:1 contrast ratio between foreground and background colors. Use visual indicators like borders or highlights for focus and active states.",
  },
  {
    id: "R50",
    tag: "p|span|li|h[1-6]",
    regex: /<(p|span|li|h[1-6])[^>]*>/gi,
    message: "Text element may not support spacing adjustments",
    validate: (tag) =>
      !tag.includes("letter-spacing") ||
      !tag.includes("line-height") ||
      !tag.includes("word-spacing"),
    recommendation:
      "Use CSS properties like letter-spacing, line-height, and word-spacing to ensure text remains readable when users adjust spacing.",
  },
  {
    id: "R51",
    tag: "button|a|input|label",
    regex: /<(button|a|input|label)[^>]*>/gi,
    message: "Content triggered by hover or focus may not be dismissible",
    validate: (tag, doc) =>
      (tag.includes("onmouseover") || tag.includes("onfocus")) &&
      !(
        tag.includes("onmouseleave") ||
        tag.includes("onblur") ||
        doc.includes("aria-describedby")
      ),
    recommendation:
      "Ensure that content triggered on hover or focus can be dismissed without moving the pointer or losing focus. Use proper event handling or aria-describedby patterns.",
  },
  {
    id: "R52",
    tag: "button|a|input|select|textarea|fieldset|label|form",
    regex: /<(button|a|input|select|textarea|fieldset|label|form)[^>]*>/gi,
    message: "Element may not be fully accessible via keyboard",
    validate: (tag) =>
      !tag.includes("tabindex") &&
      !tag.includes("onkeydown") &&
      !tag.includes("onkeypress") &&
      !tag.includes("role") &&
      !tag.includes("type"),
    recommendation:
      "Use native HTML elements and attributes like tabindex, onkeydown, and ARIA roles to ensure keyboard accessibility.",
  },
  {
    id: "R53",
    tag: "a|button|input|label|select|textarea|div|span",
    regex:
      /<(a|button|input|label|select|textarea|div|span)[^>]*onclick=[^>]*>/gi,
    message:
      "Interactive element lacks keyboard event support or semantic structure",
    validate: (tag) =>
      tag.includes("onclick") &&
      !tag.includes("onkeypress") &&
      !tag.includes("onkeydown") &&
      !tag.includes("role") &&
      !tag.includes("tabindex"),
    recommendation:
      "Add keyboard handlers (onkeydown, onkeypress) and consider using semantic HTML elements like <button> or <a> instead of generic <div> or <span>.",
  },
  {
    id: "R54",
    tag: "a|button|input",
    regex: /<(a|button|input)[^>]*>/gi,
    message: "Component may trap keyboard focus",
    validate: (tag, doc) =>
      tag.includes("tabindex") &&
      tag.includes('tabindex="-1"') &&
      !doc.includes("onkeydown") &&
      !doc.includes("Escape") &&
      !doc.includes("Tab"),
    recommendation:
      "Ensure users can exit focusable components using keyboard (Tab or Esc). Don't trap focus unless you provide a clear exit.",
  },
  {
    id: "R55",
    tag: "a|button",
    regex: /<(a|button)[^>]*accesskey=["'][^"']+["'][^>]*>/gi,
    message: "Accesskey defined without flexibility",
    validate: (tag) => tag.includes("accesskey="),
    recommendation:
      "Allow users to customize or disable accesskey combinations. Document the used keys to avoid conflicts.",
  },
  {
    id: "R56",
    tag: "video|audio|marquee",
    regex: /<(video|audio|marquee)[^>]*>/gi,
    message: "Media content autoplaying without user controls",
    validate: (tag) => tag.includes("autoplay") && !tag.includes("controls"),
    recommendation:
      "Avoid autoplay or include visible controls to let users pause, stop or control playback.",
  },
  {
    id: "R57",
    tag: "a|main|nav",
    regex: /<(a\s+[^>]*href=["']#main["'][^>]*|main|nav)[^>]*>/gi,
    message: "Missing skip link or landmark for main content",
    validate: (tag, doc) =>
      !doc.includes('<a href="#main"') ||
      (!doc.includes("<main") && !doc.includes('role="main"')),
    recommendation:
      "Include a 'Skip to main content' link (<a href='#main'>) and ensure a corresponding <main> or [role='main'] exists.",
  },
  {
    id: "R58",
    tag: "title",
    regex: /<title[^>]*>(.*?)<\/title>/gi,
    message: "Missing or non-descriptive page title",
    validate: (tag) =>
      !tag || tag.length < 15 || tag.toLowerCase().includes("untitled"),
    recommendation:
      "Ensure the <title> inside <head> is descriptive and meaningful for the page content.",
  },
  {
    id: "R59",
    tag: "any",
    regex: /<[^>]*tabindex\s*=\s*["']?-?\d+["'][^>]*>/gi,
    message: "Potential focus order issue due to tabindex",
    validate: (tag) =>
      tag.includes("tabindex") && tag.match(/tabindex=["']?-1["']/),
    recommendation:
      "Use tabindex carefully. Avoid tabindex='-1' unless intentionally removing an element from the tab sequence.",
  },
  {
    id: "R60",
    tag: "a",
    regex: /<a[^>]*>(.*?)<\/a>/gi,
    message: "Link text is vague or meaningless",
    validate: (tag) => {
      const inner = tag
        .replace(/<[^>]+>/g, "")
        .trim()
        .toLowerCase();
      return ["", "click here", "read more", "more", "details"].includes(inner);
    },
    recommendation:
      "Write meaningful link text that explains the action or destination, e.g., 'View pricing details'.",
  },
  {
    id: "R61",
    tag: "nav|a|ul|ol",
    regex: /<(nav|a|ul|ol)[^>]*>/gi,
    message: "Only one navigation method provided",
    validate: (tag, doc) =>
      !doc.includes("sitemap") &&
      !doc.includes("search") &&
      !doc.includes('role="navigation"'),
    recommendation:
      "Provide multiple navigation options (e.g., a nav bar, search function, or sitemap) to enhance accessibility.",
  },
  {
    id: "R62",
    tag: "label|h1|h2|h3|h4|h5|h6",
    regex: /<(label|h[1-6])[^>]*>/gi,
    message: "Form controls or headings not labeled semantically",
    validate: (tag) =>
      (tag.startsWith("<label") &&
        !tag.includes("for=") &&
        !tag.includes("aria-label")) ||
      (tag.match(/^<h[1-6]/) && tag.length <= 8), // short headings likely unclear
    recommendation:
      "Use <label> with for or aria-label for form fields, and structure content using meaningful <h1>–<h6> headings.",
  },
  {
    id: "R63",
    tag: "button|a|input|select|textarea",
    regex: /<(button|a|input|select|textarea)[^>]*>/gi,
    message: "Interactive element lacks visible focus indicator",
    validate: (tag, doc) => !doc.includes(":focus") && !doc.includes("outline"),
    recommendation:
      "Ensure interactive elements are styled with visible focus indicators (e.g., :focus with outline or border).",
  },
  {
    id: "R64",
    tag: "a",
    regex: /<a[^>]*>(\s*|<i[^>]*>\s*<\/i>|<span[^>]*>\s*<\/span>)<\/a>/gi,
    message: "Link is empty, icon-only, or lacks descriptive text",
    validate: (tag) =>
      !tag.match(/>[^<]{3,}</) &&
      !tag.includes("aria-label") &&
      !tag.includes("title"),
    recommendation:
      "Ensure links have meaningful text or use aria-label/title attributes if icon-only.",
  },
  {
    id: "R65",
    tag: "h1|h2|h3|h4|h5|h6",
    regex: /<(h[1-6])[^>]*>/gi,
    message: "Missing semantic heading structure",
    validate: (tag, doc) => !doc.match(/<h[1-6][^>]*>.*<\/h[1-6]>/i),
    recommendation:
      "Use semantic HTML headings (<h1>–<h6>) to convey the structure of the page.",
  },
  {
    id: "R66",
    tag: "label",
    regex: /<label[^>]*>/gi,
    message: "Label text does not match accessible name",
    validate: (tag) =>
      tag.includes("aria-label") && tag.includes(">") && !tag.includes("for="),
    recommendation:
      "Ensure the visible label matches the accessible name (e.g., aria-label or aria-labelledby).",
  },
  {
    id: "R67",
    tag: "html",
    regex: /<html[^>]*>/gi,
    message: "Missing or incorrect lang attribute on <html>",
    validate: (tag) =>
      !tag.includes("lang=") ||
      tag.includes('lang=""') ||
      tag.includes("lang='xx'"),
    recommendation:
      "Add a valid lang attribute to <html> (e.g., lang='en', lang='es').",
  },
  {
    id: "R68",
    tag: "span|p",
    regex: /<(span|p)(?![^>]*lang=)[^>]*>.*?<\/\1>/gi,
    message: "Foreign language content missing lang attribute",
    validate: (tag) =>
      /[áéíóúüàèìòùâêîôûäëïöüñçßæœ]/i.test(tag) && !tag.includes("lang="),
    recommendation:
      "Use the lang attribute to identify the language of foreign phrases or sections.",
  },
  {
    id: "R69",
    tag: "abbr",
    regex: /<abbr[^>]*>/gi,
    message: "<abbr> missing title attribute",
    validate: (tag) => !tag.includes("title="),
    recommendation:
      "Add a title attribute to <abbr> elements to provide the expanded form of the abbreviation.",
  },
  {
    id: "R70",
    tag: "input|a|button",
    regex:
      /<(input|a|button)[^>]*onfocus=["'][^"']*(location|redirect)[^"']*["'][^>]*>/gi,
    message: "Element changes context on focus",
    validate: (tag) =>
      tag.includes("onfocus") &&
      (tag.includes("location") || tag.includes("redirect")),
    recommendation:
      "Avoid using onfocus events to trigger context changes like redirections. Require explicit user action instead.",
  },
  {
    id: "R71",
    tag: "select|input|textarea",
    regex:
      /<(select|input|textarea)[^>]*onchange=["'][^"']*(submit|location|redirect)[^"']*["'][^>]*>/gi,
    message: "Element changes context automatically on input",
    validate: (tag) =>
      tag.includes("onchange") &&
      (tag.includes("submit") ||
        tag.includes("location") ||
        tag.includes("redirect")),
    recommendation:
      "Require a confirmation action (e.g., clicking a button) before applying input-based context changes.",
  },
  {
    id: "R72",
    tag: "nav|header|footer|a",
    regex: /<(nav|header|footer|a)[^>]*>/gi,
    message: "Navigation structure should be consistent",
    validate: () => false, // Placeholder: requires cross-page comparison
    recommendation:
      "Ensure that repeated navigational elements maintain order, labeling, and structure across all pages.",
  },
  {
    id: "R73",
    tag: "button|label|input|a",
    regex: /<(button|label|input|a)[^>]*>/gi,
    message: "Inconsistent labeling for same functionality",
    validate: (tag, doc) =>
      tag.includes("submit") &&
      (doc.match(/submit/gi) || []).length > 1 &&
      !tag.includes("aria-label"),
    recommendation:
      "Ensure consistent visible text and accessible name (aria-label) for elements with the same function across pages.",
  },
  {
    id: "R74",
    tag: "input|label|select|textarea",
    regex: /<(input|label|select|textarea)[^>]*>/gi,
    message: "Missing or unclear error handling for form field",
    validate: (tag, doc) =>
      (tag.includes("required") || tag.includes("aria-required")) &&
      !doc.match(/(error|invalid|aria-describedby)/i),
    recommendation:
      "Include specific error messages and associate them with form fields using aria-describedby or inline hints.",
  },
  {
    id: "R75",
    tag: "label",
    regex: /<label[^>]*>/g,
    message: "Label missing field association or clear instruction",
    validate: (tag, doc) =>
      !tag.includes("for=") &&
      !tag.includes("aria-label") &&
      !tag.includes("aria-labelledby") &&
      !tag.includes("id=") &&
      !doc.includes("instructions"),
    recommendation:
      "Use the 'for' attribute or aria-label/aria-labelledby to associate the label with a field, and include helpful instructions.",
  },
  {
    id: "R76",
    tag: "form|fieldset|input|textarea|select",
    regex: /<(form|fieldset|input|textarea|select)[^>]*>/gi,
    message: "Form or field missing user instructions",
    validate: (tag, doc) =>
      !doc.match(/(instruction|note|guidance|help|hint)/i),
    recommendation:
      "Provide clear guidance at the top of the form or next to relevant fields to help users understand what to do.",
  },
  {
    id: "R77",
    tag: "input|select|textarea",
    regex: /<(input|select|textarea)[^>]*>/gi,
    message: "Form control lacks descriptive label",
    validate: (tag) =>
      tag.includes("placeholder") &&
      !tag.includes("aria-describedby") &&
      !tag.includes("label") &&
      !tag.includes("aria-label"),
    recommendation:
      "Use aria-describedby or an associated label to provide clear information about what is expected from the user.",
  },
  {
    id: "R78",
    tag: "fieldset",
    regex: /<fieldset[^>]*>/g,
    message: "Missing <legend> for related form controls",
    validate: (tag, doc) => !doc.includes("<legend"),
    recommendation:
      "Use a <legend> inside <fieldset> to describe the grouped form controls.",
  },
  {
    id: "R79",
    tag: "form|input|select|textarea",
    regex: /<(form|input|select|textarea)[^>]*>/gi,
    message: "Missing error suggestions or guidance",
    validate: (tag, doc) =>
      doc.includes("error") &&
      !doc.match(/(suggestion|hint|try again|did you mean)/i),
    recommendation:
      "Include contextual suggestions or hints near fields with errors to help users understand and fix issues.",
  },
  {
    id: "R80",
    tag: "html|body|button|form|input|script|select|textarea",
    regex: /<(html|body|button|form|input|script|select|textarea)[^>]*>/gi,
    message: "Malformed or improperly structured HTML tag",
    validate: (tag) =>
      // Detect repeated attributes or invalid nesting
      /(id|class|name|type)=["'][^"']*["'].*\1=["']/.test(tag) || // atributo duplicado
      tag.includes("<div><div>") || // ejemplo básico de anidación incorrecta
      (tag.includes("<input") && tag.includes("</input>")) || // input no debe tener cierre
      (tag.startsWith("<") && !tag.endsWith(">")), // apertura sin cierre
    recommendation:
      "Check for repeated attributes, invalid nesting, or improper tag syntax. Use a validator to ensure the HTML is well-formed.",
  },
  {
    id: "R81",
    tag: "input|button|a|select|textarea|form|img",
    regex: /<(input|button|a|select|textarea|form|img)[^>]*>/gi,
    message: "Missing accessible name, role, or value",
    validate: (tag) =>
      (!tag.includes("aria-label") &&
        !tag.includes("name=") &&
        !tag.includes("type=")) ||
      (tag.includes("role") && !tag.includes("aria-")),
    recommendation:
      "Ensure interactive elements use native semantics or ARIA attributes (aria-label, role, aria-checked) and provide name/type where appropriate.",
  },
  {
    id: "R82",
    tag: "div|output|p|span",
    regex: /<(div|output|p|span)[^>]*>/gi,
    message: "Missing ARIA status announcement for dynamic updates",
    validate: (tag) =>
      !tag.includes("aria-live") &&
      !tag.includes('role="status"') &&
      !tag.includes("alert") &&
      !tag.includes("notification"),
    recommendation:
      "Use aria-live='polite' or role='status' on containers with dynamic content updates so assistive technologies can announce changes.",
  },
];
