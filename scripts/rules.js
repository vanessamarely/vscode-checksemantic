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
    level: "A",
    regex: /<img\b[^>]*?(\/?)>/gi,
    message: "Image without alt attribute",
    validate: (tag, doc) => {
      if (tag.includes("<!--") || tag.includes("-->")) return false;

      const isMissingAlt = !tag.includes("alt=");
      const isInsidePicture =
        /<picture[^>]*>[\s\S]*?<img[^>]*?>[\s\S]*?<\/picture>/gi.test(doc);
      return isMissingAlt || (isInsidePicture && !tag.includes("alt="));
    },
    recommendation:
      'Add an alt attribute to describe the image content or use alt="" if decorative. Even inside <picture>, ensure <img> has alt.',
    autofix: (tag) => {
      if (tag.includes("alt=")) return null;
      return tag.replace(/(<img\b[^>]*?)(\/?>)/i, `$1 alt="description"$2`);
    },
  },
  {
    id: "R2",
    tag: 'input[type="image"]',
    level: "A",
    regex: /<input[^>]*type=["']image["'][^>]*>/g,
    message: "Image input missing alt attribute",
    validate: (tag) => !tag.includes("alt="),
    recommendation:
      "Add an alt attribute that describes the function of the button.",
  },
  {
    id: "R3",
    tag: "area",
    level: "A",
    regex: /<area[^>]*>/g,
    message: "Area element missing alt attribute",
    validate: (tag) => !tag.includes("alt="),
    recommendation:
      "Provide a descriptive alt attribute for each <area> tag in image maps.",
  },
  {
    id: "R4",
    tag: "object",
    level: "A",
    regex: /<object[^>]*>/g,
    message: "Object without text alternative",
    validate: (tag, doc) => !doc.includes("<p>"),
    recommendation:
      "Include a text description inside or near the <object> tag or use aria-label.",
  },
  {
    id: "R5",
    tag: "svg",
    level: "A",
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
    level: "A",
    regex: /<applet[^>]*>/g,
    message: "Applet element requires alt text",
    validate: (tag) => !tag.includes("alt="),
    recommendation:
      "Add alt attribute that describes the content or purpose of the applet.",
  },
  {
    id: "R7",
    tag: "button",
    level: "A",
    regex: /<button(?![^>]*aria-label)(?![^>]*>\s*[^<]+\s*<)[^>]*>/g,
    message: "Button missing accessible name",
    validate: (tag) =>
      !tag.includes("aria-label") && !tag.match(/>\s*[^<]+\s*</),
    recommendation:
      "Include visible text or an aria-label to describe the button's purpose.",
    autofix: (tag) =>
      tag.includes("aria-label")
        ? tag
        : tag.replace(/<button/, '<button aria-label="Describe action"'),
  },
  {
    id: "R8",
    tag: "a",
    level: "A",
    regex: /<a[^>]*>(\s*<i[^>]*>|\s*<span[^>]*>)\s*<\/a>/g,
    message: "Anchor with icon only and no accessible label",
    validate: (tag) => tag.includes("<i") && !tag.includes("aria-label"),
    recommendation: "Use aria-label to describe the purpose of the link.",
  },
  {
    id: "R9",
    tag: "figure",
    level: "A",
    regex: /<figure[^>]*>(?!.*?<figcaption>).*?<\/figure>/gs,
    message: "Figure missing figcaption",
    validate: (tag, doc) => !doc.includes("<figcaption>"),
    recommendation: "Include a <figcaption> to describe the figure content.",
  },
  {
    id: "R10",
    tag: "iframe",
    level: "A",
    regex: /<iframe(?![^>]*title=)[^>]*>/g,
    message: "Iframe missing title attribute",
    validate: (tag) => !tag.includes("title="),
    recommendation:
      "Add a title attribute that describes the iframe's purpose.",
    autofix: (tag) =>
      tag.includes("title=")
        ? tag
        : tag.replace(/<iframe/, '<iframe title="Describe the iframe content"'),
  },
  {
    id: "R11",
    tag: "embed",
    level: "A",
    regex: /<embed(?![^>]*aria-label)(?![^>]*title)[^>]*>/g,
    message: "Embed missing fallback content",
    validate: (tag, doc) => !doc.includes("<p>"),
    recommendation:
      "Provide fallback content or use title/aria-label to describe the embedded content.",
  },
  {
    id: "R12",
    tag: "canvas",
    level: "A",
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
    level: "A",
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
    level: "A",
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
    level: "A",
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
    level: "A",
    regex: /<video[^>]*>/g,
    message: "Video missing subtitles",
    validate: (tag, doc) => !doc.includes("<track kind='subtitles'>"),
    recommendation:
      "Add a <track> element with kind='subtitles' to provide synchronized subtitles for the video.",
  },
  {
    id: "R17",
    tag: "track",
    level: "A",
    regex: /<track[^>]*>/g,
    message: "Track element missing kind='subtitles'",
    validate: (tag) => !tag.includes("kind='subtitles'"),
    recommendation:
      "Ensure the <track> element includes kind='subtitles' and other necessary attributes like src, srclang, and label.",
  },
  {
    id: "R18",
    tag: "video",
    level: "A",
    regex: /<video[^>]*>/g,
    message: "Video missing audio description",
    validate: (tag, doc) => !doc.includes("<track kind='descriptions'>"),
    recommendation:
      "Add a <track> element with kind='descriptions' to provide an audio description for visually impaired users.",
  },
  {
    id: "R19",
    tag: "object",
    level: "A",
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
    level: "AA",
    regex: /<video[^>]*>/g,
    message: "Video missing synchronized audio description",
    validate: (tag, doc) => !doc.includes("<track kind='descriptions'>"),
    recommendation:
      "Include a <track> element with kind='descriptions' to provide synchronized audio descriptions for the video.",
  },
  {
    id: "R21",
    tag: "object",
    level: "AA",
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
    level: "A",
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
    level: "A",
    regex: /<caption[^>]*>/g,
    message: "Table missing caption",
    validate: (tag, doc) => !doc.includes("<caption>"),
    recommendation:
      "Add a <caption> as the first child of the <table> to describe its purpose.",
  },
  {
    id: "R24",
    tag: "th",
    level: "A",
    regex: /<th[^>]*>/g,
    message: "Table header missing association",
    validate: (tag, doc) => !tag.includes("id=") || !doc.includes("headers="),
    recommendation:
      "Use the id attribute in <th> and the headers attribute in <td> to associate data cells with their headers.",
  },
  {
    id: "R25",
    tag: "fieldset",
    level: "A",
    regex: /<fieldset[^>]*>/g,
    message: "Form controls not grouped",
    validate: (tag, doc) => !doc.includes("<legend>"),
    recommendation:
      "Use <fieldset> to group related form controls and include a <legend> to describe the group.",
  },
  {
    id: "R26",
    tag: "legend",
    level: "A",
    regex: /<legend[^>]*>/g,
    message: "Fieldset missing legend",
    validate: (tag, doc) => !doc.includes("<legend>"),
    recommendation:
      "Add a <legend> inside the <fieldset> to describe the group of form controls.",
  },
  {
    id: "R27",
    tag: "label",
    level: "A",
    regex: /<label[^>]*>/g,
    message: "Form field missing label",
    validate: (tag, doc) => !tag.includes("for=") || !doc.includes("id="),
    recommendation:
      "Ensure each form field has a <label> associated with it using the for attribute and a matching id on the input.",
  },
  {
    id: "R28",
    tag: "h1",
    level: "A",
    regex: /<h[1-6][^>]*>/g,
    message: "Content missing heading structure",
    validate: (tag, doc) => !doc.match(/<h[1-6][^>]*>/),
    recommendation:
      "Use <h1> to <h6> to organize content hierarchically and improve navigation.",
  },
  {
    id: "R29",
    tag: "ul",
    level: "A",
    regex: /<ul[^>]*>/g,
    message: "List missing semantic structure",
    validate: (tag, doc) => !doc.includes("<li>"),
    recommendation:
      "Use <ul> or <ol> for lists and include <li> for each list item.",
  },
  {
    id: "R30",
    tag: "section",
    level: "A",
    regex: /<section[^>]*>/g,
    message: "Section missing heading",
    validate: (tag, doc) => !doc.match(/<section[^>]*>[\s\S]*?<h[1-6][^>]*>/),
    recommendation:
      "Include a heading (<h1> to <h6>) inside each <section> element to describe its content.",
  },
  {
    id: "R31",
    tag: "article",
    level: "A",
    regex: /<article[^>]*>/g,
    message: "Article missing heading",
    validate: (tag, doc) => !doc.match(/<article[^>]*>[\s\S]*?<h[1-6][^>]*>/),
    recommendation:
      "Include a heading (<h1> to <h6>) inside each <article> to provide a descriptive title.",
  },
  {
    id: "R32",
    tag: "ol",
    level: "A",
    regex: /<ol[^>]*>/g,
    message: "Ordered list missing structure",
    validate: (tag, doc) => !doc.includes("<li>"),
    recommendation:
      "Use <li> elements inside <ol> to define each item in the ordered list.",
  },
  {
    id: "R33",
    tag: "ul",
    level: "A",
    regex: /<ul[^>]*>/g,
    message: "Unordered list missing structure",
    validate: (tag, doc) => !doc.includes("<li>"),
    recommendation:
      "Use <li> elements inside <ul> to define each item in the unordered list.",
  },
  {
    id: "R34",
    tag: "li",
    level: "A",
    // solo detecta <li> seguido de espacio, cierre o atributos válidos, no link
    regex: /<li(\s|>)/gi,
    message: "List item outside of a list",
    validate: (tag, doc) => {
      if (tag.includes("<!--") || tag.includes("-->")) return false;

      const parentContext =
        /<(ul|ol|dl)[^>]*>[\s\S]*?<li[^>]*>[\s\S]*?<\/li>/gi;
      const isInsideValidList = parentContext.test(doc);

      // Detecta si el <li> está en navegación tipo link (nav, header, etc.)
      const isLikelyNav =
        /<nav[\s\S]*?<li[^>]*>[\s\S]*?<a[^>]*>.*?<\/a>[\s\S]*?<\/li>[\s\S]*?<\/nav>/gi.test(
          doc
        );

      return !isInsideValidList && !isLikelyNav;
    },
    recommendation:
      "Ensure <li> elements are properly nested inside <ul>, <ol>, or <dl> elements. Avoid using <li> outside list contexts.",
  },
  {
    id: "R35",
    tag: "table",
    level: "A",
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
    level: "A",
    regex: /<thead[^>]*>/g,
    message: "Table head is missing or misused",
    validate: (tag, doc) => !doc.includes("<thead>"),
    recommendation:
      "Include a <thead> section at the top of your table to group header rows.",
  },
  {
    id: "R37",
    tag: "tbody",
    level: "A",
    regex: /<tbody[^>]*>/g,
    message: "Table body missing or unordered",
    validate: (tag, doc) => !doc.includes("<tbody>"),
    recommendation:
      "Use <tbody> to group the main content rows and ensure logical row ordering.",
  },
  {
    id: "R38",
    tag: "p, span, strong, em",
    level: "A",
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
    level: "AA",
    regex: /<(input|select|textarea|form)[^>]*>/gi,
    message: "Form element missing or misusing autocomplete attribute",
    validate: (tag) => {
      if (tag.includes("<!--") || tag.includes("-->")) return false;

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
    level: "AAA",
    regex: /<(input|select|textarea)[^>]*>/gi,
    message: "Form field missing semantic autocomplete attribute",
    validate: (tag) => {
      if (tag.includes("<!--") || tag.includes("-->")) return false;

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
    level: "A",
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
    level: "A",
    regex: /<audio[^>]*>/g,
    message: "Autoplaying audio without controls",
    validate: (tag) => tag.includes("autoplay") && !tag.includes("controls"),
    recommendation:
      "Add 'controls' attribute to <audio> or provide visible custom controls for play/pause and volume.",
  },
  {
    id: "R43",
    tag: "text elements",
    level: "AA",
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
    level: "AA",
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
    level: "AA",
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
    level: "AA",
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
    level: "AAA",
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
    level: "AA",
    regex:
      /<(a|body|div|html|img|main|p|section)\s[^>]*style\s*=\s*["'][^"'>]*width\s*:\s*\d+px[^"'>]*["'][^>]*>/gi,
    message:
      "Element with inline fixed pixel width found. This might cause reflow issues when text is resized or on smaller viewports.",
    validate: (tag, doc) => {
      // The regex specifically finds elements with an inline style containing 'width: XXXpx'.
      // Further check if there's also a 'max-width' in the inline style that might mitigate it.
      if (tag.toLowerCase().includes("max-width")) {
        return false; // Has max-width, might be okay.
      }
      return true; // Fixed pixel width without inline max-width found.
    },
    recommendation:
      "Avoid inline fixed pixel widths (e.g., style='width:300px') on containers. Use relative units (%, vw, em, rem) and techniques like max-width to allow content to reflow. Manually review external CSS for other fixed-width issues affecting WCAG 1.4.10 (Reflow).",
  },
  ,
  {
    id: "R49",
    tag: "button|canvas|img|input|select|svg",
    level: "AA",
    regex: /<(button|canvas|img|input|select|svg)[^>]*>/gi,
    message: "Non-text UI element might have insufficient contrast",
    validate: (tag) =>
      /background-color\s*:\s*#[0-9a-fA-F]{3,6}/.test(tag) &&
      /color\s*:\s*#[0-9a-fA-F]{3,6}/.test(tag),
    recommendation:
      "Ensure UI elements have at least a 3:1 contrast ratio between foreground and background colors. Use visual indicators like borders or highlights for focus and active states.",
  },
  // In your rules.js, for R50 - A very basic heuristic attempt
  {
    id: "R50",
    tag: "p|span|li|h[1-6]",
    level: "AA",
    regex:
      /<(p|span|li|h[1-6])[^>]*style\s*=\s*["'][^"'>]*height\s*:\s*\d+px[^"'>]*["'][^>]*>/gi, // Only look at tags with inline style setting a pixel height
    message:
      "Text element with fixed inline height may not support spacing adjustments",
    validate: (tag) => {
      // This regex already found an inline pixel height.
      // We could also check for 'overflow: hidden' in the inline style if present.
      if (
        tag.toLowerCase().includes("overflow") &&
        tag.toLowerCase().includes("hidden")
      ) {
        return true; // Flag if fixed px height AND inline overflow:hidden
      }
      // Or, just flag any fixed pixel height as a warning for this rule (simpler):
      return true;
    },
    recommendation:
      "Ensure text elements with fixed heights can accommodate adjusted text spacing without loss of content, or use min-height/relative units instead. WCAG 1.4.12.",
  },
  {
    id: "R51",
    tag: "button|a|input|label",
    level: "AA",
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
  // In your rules.js
  {
    id: "R52",
    tag: "div|span", // Focuses on div/span that might be misused as interactive elements
    level: "A",
    regex: /<(div|span)\s[^>]*onclick\s*=[^>]*>/gi, // Finds div/span with an onclick attribute
    message:
      "Custom control created with div/span has an onclick but may lack full keyboard accessibility.",
    validate: (tagString) => {
      const lowerTag = tagString.toLowerCase();
      const hasTabindex = lowerTag.includes("tabindex=");
      const hasKeyboardEvent = /onkeydown\s*=|onkeyup\s*=|onkeypress\s*=/.test(
        lowerTag
      );
      // Check for roles that imply widget behavior, not just generic link.
      const hasInteractiveAriaRole =
        /role\s*=\s*["'](button|checkbox|menuitem|menuitemcheckbox|menuitemradio|option|radio|slider|spinbutton|switch|tab|treeitem)["']/.test(
          lowerTag
        );

      // If it has an onclick, it should be keyboard operable.
      // Flags if it's missing tabindex (to make it focusable) AND a common keyboard event handler AND a suitable interactive ARIA role.
      if (!hasTabindex && !hasKeyboardEvent && !hasInteractiveAriaRole) {
        return true;
      }
      return false;
    },
    recommendation:
      "If using non-interactive elements like <div> or <span> as custom controls (e.g., with an 'onclick' attribute), ensure they are keyboard accessible: add 'tabindex=\"0\"' to make them focusable, provide an appropriate interactive ARIA role (e.g., role='button'), and handle keyboard events (e.g., Enter/Space key for activation). Prefer using native <button> or <a> elements for interactive controls. [WCAG 2.1.1, 4.1.2]",
  },
  {
    id: "R53",
    tag: "a|button|input|label|select|textarea|div|span",
    level: "A",
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
    level: "A",
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
    level: "A",
    regex: /<(a|button)[^>]*accesskey=["'][^"']+["'][^>]*>/gi,
    message: "Accesskey defined without flexibility",
    validate: (tag) => tag.includes("accesskey="),
    recommendation:
      "Allow users to customize or disable accesskey combinations. Document the used keys to avoid conflicts.",
  },
  {
    id: "R56",
    tag: "video|audio|marquee",
    level: "A",
    regex: /<(video|audio|marquee)[^>]*>/gi,
    message: "Media content autoplaying without user controls",
    validate: (tag) => tag.includes("autoplay") && !tag.includes("controls"),
    recommendation:
      "Avoid autoplay or include visible controls to let users pause, stop or control playback.",
  },
  {
    id: "R57",
    tag: "a|main|nav", // Keeping your original tag
    level: "A",
    regex: /<(a\s+[^>]*href=["']#main["'][^>]*|main|nav)[^>]*>/gi, // Keeping your original regex
    message:
      "Review page for a 'skip to main content' link mechanism and corresponding main landmark. [WCAG 2.4.1]",
    validate: (matchedElementString, doc) => {
      const hasMainLandmarkInDoc =
        doc.includes("<main") || /role\s*=\s*["']main["']/.test(doc);

      // Heuristic check for a plausible skip link in the entire document.
      const skipLinkRegex =
        /<a\s[^>]*href\s*=\s*["']#\w[^"']*["'][^>]*>[\s\S]*?(skip|main|content|primary|jump\s+to|go\s+to)[\s\S]*?<\/a>/i;
      const hasPlausibleSkipLinkInDoc = skipLinkRegex.test(doc);

      if (!hasMainLandmarkInDoc) {
        return true; // FAIL: No main content landmark defined on the page.
      }

      if (hasMainLandmarkInDoc && !hasPlausibleSkipLinkInDoc) {
        return true; // FAIL: Main landmark found, but a skip link to it appears to be missing or not recognized by common keywords.
      }

      return false; // PASS: Basic skip mechanism components (landmark and a plausible skip link) appear to be present in the document.
    },
    recommendation:
      "Ensure a 'skip to main content' link is one of the first focusable elements on the page and is visible when it receives keyboard focus (it can be initially hidden but must become visible on focus). This link should target the primary content area, identified by a <main> element (with an id) or an element with role='main' (with an id). If your skip link uses different text than common keywords (e.g., 'Skip', 'Main', 'Content'), this automated check might not detect it; in such cases, please manually verify compliance. [WCAG G1, H69]",
  },
  {
    id: "R58",
    tag: "title",
    level: "A",
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
    level: "A",
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
    level: "A",
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
    tag: "nav|a|ul|ol", // As per your documentation for this rule
    level: "AA",
    regex: /<(nav|a|ul|ol)[^>]*>/gi, // Regex matching one of these tags
    message:
      "Ensure the site offers multiple ways to find pages (e.g., navigation menu, search, sitemap), unless the page is part of a process. [WCAG 2.4.5]",
    validate: (matchedElementString, doc) => {
      // matchedElementString is the specific nav/a/ul/ol found
      // doc is the entire document for page-level analysis
      let mechanismsFound = 0;
      try {
        if (typeof doc === "string" && doc.length > 0) {
          // Check for <nav> element or role="navigation"
          if (/<nav[^>]*>|role\s*=\s*["']navigation["']/.test(doc)) {
            mechanismsFound++;
          }
          // Check for a search form
          if (
            /<form\s[^>]*role\s*=\s*["']search["'][^>]*>|<input\s[^>]*type\s*=\s*["']search["']/.test(
              doc
            )
          ) {
            mechanismsFound++;
          }
          // Check for a link that seems to point to a sitemap
          if (
            /<a\s[^>]*href\s*=\s*["'][^"'>]*sitemap[^"'>]*["'][^>]*>/i.test(doc)
          ) {
            mechanismsFound++;
          }
          // Add other checks if needed, e.g., for a link to a table of contents.
        } else {
          // If 'doc' is not usable, we can't determine, so flag for manual review.
          return true;
        }
      } catch (e) {
        console.error(
          "Error during R61 validation (multiple ways) regex tests:",
          e
        );
        // If regex testing causes an error, flag for manual review.
        return true;
      }

      // WCAG 2.4.5 requires "more than one way" unless the page is part of a process.
      // This rule FAILS (returns true) if fewer than 2 distinct mechanisms are found.
      return mechanismsFound < 2;
    },
    recommendation:
      "Provide at least two distinct ways to find other web pages on the site, such as: a main navigation menu/bar (using <nav> or role='navigation'), a site search feature, and/or a link to a sitemap. This does not apply to pages that are part of a process (e.g., steps in a checkout). If an error occurred during this automated check, please review this requirement manually. [WCAG 2.4.5]",
  },
  {
    id: "R62",
    tag: "label|h1|h2|h3|h4|h5|h6", // Targets labels and heading opening tags
    level: "AA",
    regex: /<(label|h[1-6])(\s[^>]*)?>/gi, // Matches <label ...> or <h1 ...> (opening tag)
    message:
      "Form controls or headings may need review for semantic clarity or proper association.",
    validate: (tagString, doc) => {
      const lowerTagString = tagString.toLowerCase();

      if (lowerTagString.startsWith("<label")) {
        // For <label> tags, check inline attributes for association.
        // A label should ideally have a 'for' attribute or wrap an input.
        // 'aria-label' can also be used. This checks for presence on the tag.
        const hasFor = /for\s*=\s*["']?[^"'\s>]+["']?/.test(lowerTagString);
        const hasAriaLabel = /aria-label\s*=\s*["'](?!["'])[^"']+["']/.test(
          lowerTagString
        );

        // If a label has neither 'for' nor 'aria-label' directly on its tag,
        // it might still be valid if it wraps an input, but that's harder to check here.
        // Flagging if both are missing encourages explicit association.
        if (!hasFor && !hasAriaLabel) {
          return true; // Consider it an issue if these common associating attributes are missing on the label tag.
        }
        return false; // Assume okay if 'for' or 'aria-label' is present on the tag.
      } else if (lowerTagString.match(/^<h[1-6]/)) {
        // For heading tags (e.g., <h1>, <h2>):
        // The previous 'tag.length <= 8' check on the opening tag was incorrect.
        // Automatically validating semantic clarity (descriptive content) and correct hierarchical usage
        // is very complex with static analysis of just the opening tag.
        // We remove the automatic failure for headings here to prevent false positives.
        // The rule's recommendation will guide the user to manually review headings.
        return false; // Avoids the previous false positive for headings.
      }
      return false; // Default for any other case
    },
    recommendation:
      "For <label> elements, ensure they are correctly associated with form controls, typically using the 'for' attribute referencing the control's 'id', or by wrapping the control. Consider 'aria-label' if a visible label is not desired. For <h1>-<h6> headings, manually review their content for clarity and ensure they are used in a logical hierarchical order to structure the page content. [WCAG 2.4.6]",
  },
  {
    id: "R63",
    tag: "button|a|input|select|textarea",
    level: "AA",
    regex: /<(button|a|input|select|textarea)[^>]*>/gi,
    message: "Interactive element lacks visible focus indicator",
    validate: (tag, doc) => !doc.includes(":focus") && !doc.includes("outline"),
    recommendation:
      "Ensure interactive elements are styled with visible focus indicators (e.g., :focus with outline or border).",
  },
  {
    id: "R64",
    tag: "a",
    level: "AAA",
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
    level: "AAA",
    regex: /<(h[1-6])[^>]*>/gi,
    message: "Missing semantic heading structure",
    validate: (tag, doc) => !doc.match(/<h[1-6][^>]*>.*<\/h[1-6]>/i),
    recommendation:
      "Use semantic HTML headings (<h1>–<h6>) to convey the structure of the page.",
  },
  {
    id: "R66",
    tag: "label",
    level: "AAA",
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
    level: "A",
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
    level: "A",
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
    level: "A",
    regex: /<abbr[^>]*>/gi,
    message: "<abbr> missing title attribute",
    validate: (tag) => !tag.includes("title="),
    recommendation:
      "Add a title attribute to <abbr> elements to provide the expanded form of the abbreviation.",
  },
  {
    id: "R70",
    tag: "input|a|button",
    level: "A",
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
    level: "A",
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
    level: "A",
    regex: /<(nav|header|footer|a)[^>]*>/gi,
    message: "Navigation structure should be consistent",
    validate: () => false, // Placeholder: requires cross-page comparison
    recommendation:
      "Ensure that repeated navigational elements maintain order, labeling, and structure across all pages.",
  },
  {
    id: "R73",
    tag: "button|label|input|a",
    level: "AA",
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
    level: "AA",
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
    level: "AA",
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
  // In your rules.js
  {
    id: "R76",
    tag: "form|fieldset", // Target specific tags where overall instructions are relevant
    level: "A", // WCAG 3.3.2 is Level A
    // Regex to capture the opening tag of form or fieldset, to check its attributes
    regex: /<(form|fieldset)((?:\s+[^>]*)*)>/gi,
    message:
      "Form or fieldset may need explicit instructions if its purpose or required input is not obvious from individual control labels (and the fieldset's legend, if applicable). Consider using aria-describedby to link to instructions. [WCAG 3.3.2]",
    validate: (tagString, doc) => {
      // tagString is the matched opening tag, e.g., "<form id='f1'>", "<fieldset aria-describedby='instr'>"
      // We are interested in the attributes of this specific tag.
      // Extract attributes string from the opening tag. Example: ' id="f1" class="myform"'
      const attributesString = tagString
        .substring(tagString.indexOf(" "), tagString.lastIndexOf(">"))
        .toLowerCase();

      // Check if the <form> or <fieldset> tag itself has an 'aria-describedby' attribute.
      // This is a primary programmatic way to link to more detailed instructions for the entire form/fieldset.
      if (
        /\baria-describedby\s*=\s*["'](?!["'])[^"'\s>]+["']/.test(
          attributesString
        )
      ) {
        // If aria-describedby is present, we assume instructions are referenced.
        // A more thorough check (beyond this rule's scope) would verify that the ID it points to
        // exists and that the referenced element contains meaningful instructional text.
        return false; // PASS: Instructions are likely referenced programmatically. Manual check for adequacy of referenced text is still good.
      }

      // If no 'aria-describedby' is found directly on the <form> or <fieldset> tag:
      // This rule will flag it. This encourages the developer to consider if instructions are needed
      // and to provide them using a recognized technique like 'aria-describedby', or visible text
      // (which is harder to auto-detect reliably as being *for* this specific form/fieldset),
      // or ensuring the <legend> of a <fieldset> is sufficiently instructive.

      // For <fieldset>, its <legend> provides the group label/title.
      // This rule (R76) is more about *additional* instructions if the legend and individual labels aren't enough.
      // The presence of a <legend> itself is covered by R25/R26 in your PDF.

      return true; // FAIL: No 'aria-describedby' found on the tag. Review if instructions are needed and how they are provided.
    },
    recommendation:
      "If a form or fieldset is complex, contains non-obvious fields, or requires specific input formats not clear from individual control labels (and the fieldset's legend, if applicable), provide clear overall instructions. A robust method is to use the 'aria-describedby' attribute on the <form> or <fieldset> tag to programmatically link it to a text element containing these instructions. Alternatively, ensure visible instructional text is placed directly before or at the beginning of the form/fieldset. For <fieldset>, its <legend> should clearly describe the group. Manually verify that instructions (if needed) are adequate and clearly associated with the form/fieldset. [WCAG 3.3.2, G184]",
  },
  {
    id: "R77",
    tag: "input|select|textarea",
    level: "AA",
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
    level: "AA",
    regex: /<fieldset[^>]*>/g,
    message: "Missing <legend> for related form controls",
    validate: (tag, doc) => !doc.includes("<legend"),
    recommendation:
      "Use a <legend> inside <fieldset> to describe the grouped form controls.",
  },
  {
    id: "R79",
    tag: "form|input|select|textarea",
    level: "A",
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
    level: "AA",
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
    tag: "div|span|a|button|input|img|select|textarea", // Keeps it broad for regex if role is present
    level: "A",
    // Regex specifically targets elements that HAVE an explicit ARIA 'role' attribute
    regex:
      /<(div|span|a|button|input|img|select|textarea)\s[^>]*\brole\s*=\s*["']\w[^"']*["'][^>]*>/gi,
    message:
      "Element with an ARIA role may require an accessible name (e.g., via aria-label, aria-labelledby, or appropriate text content). [WCAG 4.1.2]",
    validate: (tagString, doc) => {
      const lowerTag = tagString.toLowerCase();

      const hasAriaLabel = /aria-label\s*=\s*["'](?!["'])[^"']+["']/.test(
        lowerTag
      );
      const hasAriaLabelledby =
        /aria-labelledby\s*=\s*["'](?!["'])[^"'\s>]+["']/.test(lowerTag);
      const hasTitle = /title\s*=\s*["'](?!["'])[^"']+["']/.test(lowerTag);
      const hasTextContent = />[^<>\s][^<>]*?</.test(tagString); // Simplified check for non-empty text content

      // If an element has an ARIA role (guaranteed by the regex), it generally needs an accessible name.
      // This is a basic check. Some roles derive names from content by default (e.g., role="heading" from text).
      // Others strictly need aria-label or aria-labelledby (e.g., role="toolbar" often does).
      if (!hasAriaLabel && !hasAriaLabelledby && !hasTitle && !hasTextContent) {
        // Exceptions for common elements where other attributes provide the name when a role is also present
        if (
          lowerTag.startsWith("<img") &&
          /alt\s*=\s*["'](?!["'])[^"']+["']/.test(lowerTag)
        ) {
          return false; // alt attribute provides the name
        }
        if (lowerTag.startsWith("<input")) {
          if (
            (/type\s*=\s*["'](button|submit|reset)["']/i.test(lowerTag) &&
              /value\s*=\s*["'](?!["'])[^"']+["']/.test(lowerTag)) ||
            (/type\s*=\s*["']image["']/i.test(lowerTag) &&
              /alt\s*=\s*["'](?!["'])[^"']+["']/.test(lowerTag))
          ) {
            return false; // value or alt on specific input types provides the name
          }
        }
        return true; // Flag if no common naming method is found on an element with an explicit role.
      }
      return false; // Passes if a common naming method is found.
    },
    recommendation:
      "Ensure that elements with explicit ARIA roles have an accessible name. This can often be provided via their text content, or attributes like 'aria-label', 'aria-labelledby', or 'title'. For standard HTML interactive elements, their accessible name is typically derived from associated labels, text content, or specific attributes like 'alt' for images. [WCAG 4.1.2, 1.1.1, 1.3.1, 2.4.6]",
  },
  {
    id: "R82",
    tag: "div|output|p|span",
    level: "AA",
    regex: /<(div|output|p|span)[^>]*>/gi,
    message:
      "Review for potential need of ARIA for dynamic status messages (Manual Check Usually Required).",
    validate: (tagString, doc) => {
      const lowerTagString = tagString.toLowerCase();

      if (lowerTagString.startsWith("<output")) {
        // The <output> element is specifically designed for outputting results or statuses.
        // While not strictly required to have aria-live (its role implies some announcement),
        // it's a stronger candidate to check if it's missing explicit live region attributes
        // if it's intended to update and announce frequently or assertively.
        // Let's flag if it's an <output> tag and missing common live region attributes.
        const hasAriaLive =
          /aria-live\s*=\s*["'](polite|assertive|off)["']/.test(lowerTagString);
        const hasRoleStatusOrAlert = /role\s*=\s*["'](status|alert)["']/.test(
          lowerTagString
        );
        if (!hasAriaLive && !hasRoleStatusOrAlert) {
          return true; // Flag <output> if it's missing these common explicit live attributes.
        }
        return false;
      }

      // For generic <div>, <p>, <span>:
      // It is incorrect to assume these should be live regions by default.
      // Automatically flagging them for missing aria-live/role=status will cause many false positives.
      // The decision to make an element a live region depends on its dynamic behavior,
      // which is typically controlled by JavaScript and not evident from static HTML attributes alone.
      return false; // Avoids false positives on generic <p>, <div>, <span>.
    },
    recommendation:
      "If an element's content is updated dynamically to convey status messages or important information to the user without a page reload (e.g., 'Search results loaded', 'Item added to cart', error notifications), the container for these messages should use appropriate ARIA attributes like aria-live ('polite' or 'assertive') or a specific role like 'status' (for advisory information) or 'alert' (for urgent messages) to ensure assistive technologies announce these changes. The <output> tag is often used for such purposes and should also be considered for these ARIA attributes if its updates need to be announced. Manually identify and mark up these dynamic regions. [WCAG 4.1.3]",
  },
];
