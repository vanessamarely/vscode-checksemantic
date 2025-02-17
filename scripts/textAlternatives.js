// detectTextAlternatives.js - code to detect issues of Criterio 1.
function detectTextAlternatives(documentText, issues) {

    // Detect <img> missing alt
    const imgRegex = /<img[^>]*>/g;
    let match;
    while ((match = imgRegex.exec(documentText)) !== null) {
        if (!match[0].includes('alt="')) {
            issues.push({ message: "Imagen sin alt", start: match.index });
        }
    }

    // Detect <a> with icon without aria-label
    const linkRegex = /<a[^>]*href=[^>]*>(.*?)<\/a>/g;
    while ((match = linkRegex.exec(documentText)) !== null) {
        if (match[1].match(/^<i|^<span/) && !match[0].includes('aria-label')) {
            issues.push({ message: "Enlace con icono sin aria-label", start: match.index });
        }
    }

    // Detect <button> missing aria-label
    const buttonRegex = /<button[^>]*>/g;
    while ((match = buttonRegex.exec(documentText)) !== null) {
        if (!match[0].includes('aria-label')) {
            issues.push({ message: "Botón sin aria-label", start: match.index });
        }
    }

    // Detect <input type="image"> missing alt
    const inputImageRegex = /<input[^>]*type="image"[^>]*>/g;
    while ((match = inputImageRegex.exec(documentText)) !== null) {
        if (!match[0].includes('alt="')) {
            issues.push({ message: "Input imagen sin alt", start: match.index });
        }
    }

    // Detect <svg> missing aria-label or aria-hidden
    const svgRegex = /<svg[^>]*>/g;
    while ((match = svgRegex.exec(documentText)) !== null) {
        if (!match[0].includes('aria-label') && !match[0].includes('aria-hidden')) {
            issues.push({ message: "SVG sin aria-label o aria-hidden", start: match.index });
        }
    }

    // Detect <table> missing caption
    const tableRegex = /<table[^>]*>/g;
    while ((match = tableRegex.exec(documentText)) !== null) {
        if (!documentText.includes('<caption>')) {
            issues.push({ message: "Tabla sin caption", start: match.index });
        }
    }

    // Detect <form> missing labels
    const formRegex = /<form[^>]*>/g;
    while ((match = formRegex.exec(documentText)) !== null) {
        if (!documentText.includes('<label')) {
            issues.push({ message: "Formulario sin etiquetas", start: match.index });
        }
    }

    // Detect <select> missing labels
    const selectRegex = /<select[^>]*>/g;
    while ((match = selectRegex.exec(documentText)) !== null) {
        if (!documentText.includes('<label')) {
            issues.push({ message: "Select sin label", start: match.index });
        }
    }

    // Detect <textarea> missing labels
    const textareaRegex = /<textarea[^>]*>/g;
    while ((match = textareaRegex.exec(documentText)) !== null) {
        if (!documentText.includes('<label')) {
            issues.push({ message: "Textarea sin label", start: match.index });
        }
    }

    // Detect <figure> missing figcaption
    const figureRegex = /<figure[^>]*>/g;
    while ((match = figureRegex.exec(documentText)) !== null) {
        if (!documentText.includes('<figcaption>')) {
            issues.push({ message: "Figura sin figcaption", start: match.index });
        }
    }

    // Detect <picture> missing alt in <img>
    const pictureRegex = /<picture[^>]*>/g;
    while ((match = pictureRegex.exec(documentText)) !== null) {
        if (!documentText.includes('<img') || !documentText.includes('alt=')) {
            issues.push({ message: "Picture sin alt en img", start: match.index });
        }
    }

    // Detect <object> missing text alternative
    const objectRegex = /<object[^>]*>/g;
    while ((match = objectRegex.exec(documentText)) !== null) {
        if (!documentText.includes('<p>')) {
            issues.push({ message: "Objeto sin texto alternativo", start: match.index });
        }
    }

    // Detect <video> missing captions
    const videoRegex = /<video[^>]*>/g;
    while ((match = videoRegex.exec(documentText)) !== null) {
        if (!documentText.includes('<track')) {
            issues.push({ message: "Video sin subtítulos", start: match.index });
        }
    }

    // Detect <audio> missing controls
    const audioRegex = /<audio[^>]*>/g;
    while ((match = audioRegex.exec(documentText)) !== null) {
        if (!match[0].includes('controls')) {
            issues.push({ message: "Audio sin controles", start: match.index });
        }
    }

    // Detect <iframe> missing title
    const iframeRegex = /<iframe[^>]*>/g;
    while ((match = iframeRegex.exec(documentText)) !== null) {
        if (!match[0].includes('title=')) {
            issues.push({ message: "Iframe sin título", start: match.index });
        }
    }

    // Detect <area> missing alt
    const areaRegex = /<area[^>]*>/g;
    while ((match = areaRegex.exec(documentText)) !== null) {
        if (!match[0].includes('alt=')) {
            issues.push({ message: "Área sin alt", start: match.index });
        }
    }

    // Detect <canvas> missing text alternative
    const canvasRegex = /<canvas[^>]*>/g;
    while ((match = canvasRegex.exec(documentText)) !== null) {
        if (!documentText.includes('<p>')) {
            issues.push({ message: "Canvas sin texto alternativo", start: match.index });
        }
    }

    // Detect <map> missing alt in areas
    const mapRegex = /<map[^>]*>/g;
    while ((match = mapRegex.exec(documentText)) !== null) {
        if (!documentText.includes('<area') || !documentText.includes('alt=')) {
            issues.push({ message: "Mapa sin alt en áreas", start: match.index });
        }
    }

    // Detect <embed> missing text alternative
    const embedRegex = /<embed[^>]*>/g;
    while ((match = embedRegex.exec(documentText)) !== null) {
        if (!documentText.includes('<p>')) {
            issues.push({ message: "Embed sin texto alternativo", start: match.index });
        }
    }

    // Detect <track> missing captions
    const trackRegex = /<track[^>]*>/g;
    while ((match = trackRegex.exec(documentText)) !== null) {
        if (!match[0].includes('kind="captions"')) {
            issues.push({ message: "Pista de subtítulos faltante", start: match.index });
        }
    }

    // Detect <source> missing captions
    const sourceRegex = /<source[^>]*>/g;
    while ((match = sourceRegex.exec(documentText)) !== null) {
        if (!documentText.includes('<track')) {
            issues.push({ message: "Fuente sin subtítulos", start: match.index });
        }
    }

    // Detect <applet> missing text alternative
    const appletRegex = /<applet[^>]*>/g;
    while ((match = appletRegex.exec(documentText)) !== null) {
        if (!documentText.includes('<p>')) {
            issues.push({ message: "Applet sin texto alternativo", start: match.index });
        }
    }

    // Detect <progress> missing aria-label
    const progressRegex = /<progress[^>]*>/g;
    while ((match = progressRegex.exec(documentText)) !== null) {
        if (!match[0].includes('aria-label')) {
            issues.push({ message: "Progress sin aria-label", start: match.index });
        }
    }

    // Detect <meter> missing aria-label
    const meterRegex = /<meter[^>]*>/g;
    while ((match = meterRegex.exec(documentText)) !== null) {
        if (!match[0].includes('aria-label')) {
            issues.push({ message: "Meter sin aria-label", start: match.index });
        }
    }

    // Detect <time> missing context
    const timeRegex = /<time[^>]*>/g;
    while ((match = timeRegex.exec(documentText)) !== null) {
        issues.push({ message: "Elemento time sin contexto claro", start: match.index });
    }

    // Detect <abbr> missing title
    const abbrRegex = /<abbr[^>]*>/g;
    while ((match = abbrRegex.exec(documentText)) !== null) {
        if (!match[0].includes('title=')) {
            issues.push({ message: "Abbr sin title", start: match.index });
        }
    }

    // Detect <q> missing cite
    const qRegex = /<q[^>]*>/g;
    while ((match = qRegex.exec(documentText)) !== null) {
        if (!match[0].includes('cite=')) {
            issues.push({ message: "Cita sin atributo cite", start: match.index });
        }
    }

    // Detect <caption> missing description
    const captionRegex = /<caption[^>]*>(.*?)<\/caption>/g;
    while ((match = captionRegex.exec(documentText)) !== null) {
        if (match[1].trim() === '') {
            issues.push({ message: "Caption sin descripción", start: match.index });
        }
    }

    // Detect <legend> missing text
    const legendRegex = /<legend[^>]*>(.*?)<\/legend>/g;
    while ((match = legendRegex.exec(documentText)) !== null) {
        if (match[1].trim() === '') {
            issues.push({ message: "Legend sin texto", start: match.index });
        }
    }

    // Detect <figcaption> missing description
    const figcaptionRegex = /<figcaption[^>]*>(.*?)<\/figcaption>/g;
    while ((match = figcaptionRegex.exec(documentText)) !== null) {
        if (match[1].trim() === '') {
            issues.push({ message: "Figcaption sin descripción", start: match.index });
        }
    }

    // Detect <datalist> missing context
    const datalistRegex = /<datalist[^>]*>/g;
    while ((match = datalistRegex.exec(documentText)) !== null) {
        issues.push({ message: "Datalist sin contexto", start: match.index });
    }

}

module.exports = { detectTextAlternatives };
